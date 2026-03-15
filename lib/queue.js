// In-memory queue + SSE broadcaster
const { fetchFileContent, writeDocFile, readDocFile } = require("./github");
const { generateExplanation } = require("./huggingface");
const { Update, DocIndex } = require("./models");

const SKIP_EXT = new Set(["png","jpg","jpeg","gif","ico","svg","woff","woff2","ttf","eot","pdf","zip","tar","gz","lock","log","md"]);
const SKIP_DIR = ["node_modules/",".git/","dist/","build/"];

const sseClients = [];
const recentLogs = [];
let queue = [];
let isRunning = false;

function shouldProcess(p) {
  const ext = p.split(".").pop().toLowerCase();
  return !SKIP_EXT.has(ext) && !SKIP_DIR.some(d => p.startsWith(d));
}

function toDocPath(f) { return `${f}.md`; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function broadcast(entry) {
  recentLogs.unshift(entry);
  if (recentLogs.length > 300) recentLogs.pop();
  const msg = `data: ${JSON.stringify(entry)}\n\n`;
  sseClients.forEach(res => { try { res.write(msg); } catch {} });
}

function log(level, filePath, message) {
  const entry = { level, filePath: filePath || null, message, ts: new Date().toISOString() };
  broadcast(entry);
  console.log(`[${level.toUpperCase()}]`, filePath || "", message);
  return entry;
}

function addSSEClient(res) {
  sseClients.push(res);
  // replay last 30 logs
  recentLogs.slice(0,30).reverse().forEach(l => { try { res.write(`data: ${JSON.stringify(l)}\n\n`); } catch {} });
  return () => {
    const i = sseClients.indexOf(res);
    if (i !== -1) sseClients.splice(i,1);
  };
}

async function processOne(filePath, commitSha, triggeredBy) {
  const docPath = toDocPath(filePath);
  log("info", filePath, "fetching source…");

  const content = await fetchFileContent(filePath);
  if (!content || content.trim().length < 20) {
    log("skip", filePath, "empty or too small");
    await Update.create({ filePath, docPath, status:"skipped", error:"too small", commitSha, triggeredBy });
    return "skipped";
  }

  log("info", filePath, "generating explanation via HuggingFace…");
  const existing = await readDocFile(docPath);

  let explanation;
  try {
    explanation = await generateExplanation(filePath, content, existing);
  } catch(e) {
    log("error", filePath, `HF error: ${e.message}`);
    await Update.create({ filePath, docPath, status:"error", error: e.message, commitSha, triggeredBy });
    if (e.message.includes("429")) { log("warn", null, "Rate limited — waiting 30s"); await sleep(30000); }
    return "error";
  }

  log("info", filePath, "writing to docs repo…");
  await writeDocFile(docPath, explanation);
  await Update.create({ filePath, docPath, status:"success", commitSha, triggeredBy });
  await DocIndex.findOneAndUpdate(
    { filePath },
    { filePath, docPath, lastCommitSha: commitSha, updatedAt: new Date() },
    { upsert: true, new: true }
  );
  log("success", filePath, "documentation updated ✓");
  return "success";
}

async function runQueue() {
  if (isRunning) return;
  isRunning = true;
  log("queue", null, `Queue started — ${queue.length} files`);
  broadcast({ level:"queue_size", size: queue.length });

  while (queue.length > 0) {
    const job = queue.shift();
    broadcast({ level:"queue_size", size: queue.length });
    await processOne(job.filePath, job.commitSha, job.triggeredBy);
    await sleep(2200);
  }

  isRunning = false;
  log("queue", null, "Queue finished");
  broadcast({ level:"queue_size", size: 0 });
}

function enqueue(files, commitSha, triggeredBy) {
  const valid = files.filter(shouldProcess);
  valid.forEach(f => queue.push({ filePath: f, commitSha: commitSha || null, triggeredBy: triggeredBy || "manual" }));
  runQueue().catch(console.error);
  return valid.length;
}

function getQueueSize() { return queue.length; }
function isProcessing() { return isRunning; }

module.exports = { enqueue, addSSEClient, getQueueSize, isProcessing, shouldProcess };
