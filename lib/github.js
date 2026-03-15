const { Octokit } = require("@octokit/rest");

const oc = () => new Octokit({ auth: process.env.GITHUB_TOKEN });
const SRC  = () => ({ owner: process.env.GITHUB_SOURCE_OWNER, repo: process.env.GITHUB_SOURCE_REPO,  branch: process.env.GITHUB_SOURCE_BRANCH || "main" });
const DOCS = () => ({ owner: process.env.GITHUB_DOCS_OWNER,   repo: process.env.GITHUB_DOCS_REPO,    branch: process.env.GITHUB_DOCS_BRANCH   || "main" });

async function fetchFileContent(path) {
  try {
    const s = SRC();
    const r = await oc().repos.getContent({ owner: s.owner, repo: s.repo, path, ref: s.branch });
    return Buffer.from(r.data.content, "base64").toString("utf8");
  } catch(e) { console.error("fetchFile:", e.message); return null; }
}

async function getAllRepoFiles() {
  try {
    const s = SRC();
    const r = await oc().git.getTree({ owner: s.owner, repo: s.repo, tree_sha: s.branch, recursive: "1" });
    return r.data.tree.filter(i => i.type === "blob").map(i => i.path);
  } catch(e) { console.error("getAllFiles:", e.message); return []; }
}

async function writeDocFile(docPath, content) {
  const d = DOCS();
  let sha;
  try { const ex = await oc().repos.getContent({ owner: d.owner, repo: d.repo, path: docPath, ref: d.branch }); sha = ex.data.sha; } catch {}
  await oc().repos.createOrUpdateFileContents({
    owner: d.owner, repo: d.repo, path: docPath,
    message: `docs: auto-update ${docPath}`,
    content: Buffer.from(content).toString("base64"),
    branch: d.branch, ...(sha ? { sha } : {}),
  });
}

async function readDocFile(docPath) {
  try {
    const d = DOCS();
    const r = await oc().repos.getContent({ owner: d.owner, repo: d.repo, path: docPath, ref: d.branch });
    return Buffer.from(r.data.content, "base64").toString("utf8");
  } catch { return null; }
}

async function getChangedFiles(commits) {
  const s = new Set();
  for (const c of commits) [...(c.added||[]), ...(c.modified||[])].forEach(f => s.add(f));
  return [...s];
}

module.exports = { fetchFileContent, getAllRepoFiles, writeDocFile, readDocFile, getChangedFiles };
