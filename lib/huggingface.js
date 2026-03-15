const MODEL = "mistralai/Mistral-7B-Instruct-v0.3";
const URL   = `https://api-inference.huggingface.co/models/${MODEL}`;

function buildPrompt(filePath, code, existing) {
  const ext = filePath.split(".").pop();
  const ctx = existing ? `\nExisting doc (update it):\n${existing.slice(0,600)}\n---\n` : "";
  return `<s>[INST] You are a technical documentation expert for C++ compiler projects.

Analyze this file from the Quantum Language compiler and write a README.md.

File: ${filePath}${ctx}
\`\`\`${ext}
${code.slice(0, 3000)}
\`\`\`

Write README.md that: explains the file role, WHY design decisions were made, documents each major class/function, notes tradeoffs. Clean markdown, no excessive emojis. Start with # heading. [/INST]`;
}

async function generateExplanation(filePath, code, existing = null) {
  const r = await fetch(URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      inputs: buildPrompt(filePath, code, existing),
      parameters: { max_new_tokens: 1200, temperature: 0.3, top_p: 0.9, do_sample: true, return_full_text: false },
      options: { wait_for_model: true, use_cache: false },
    }),
  });
  if (!r.ok) throw new Error(`HF ${r.status}: ${(await r.text()).slice(0,200)}`);
  const data = await r.json();
  const raw = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
  if (!raw) throw new Error("Empty HF response");
  let clean = raw.replace(/\[INST\].*?\[\/INST\]/gs,"").trim();
  clean = clean.replace(/^```markdown\n?/,"").replace(/\n?```$/,"").trim();
  if (!clean.startsWith("#")) clean = `# ${filePath.split("/").pop()}\n\n${clean}`;
  return clean;
}

module.exports = { generateExplanation };
