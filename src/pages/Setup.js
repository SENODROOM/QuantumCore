import React, { useState } from "react";
import Panel from "../components/Panel";
import { pingHealth } from "../utils/api";
import { useToast } from "../components/Toast";

export default function Setup() {
  const toast = useToast();
  const [pingStatus, setPingStatus] = useState("");

  async function ping() {
    setPingStatus("Pinging…");
    try {
      const d = await pingHealth();
      setPingStatus(`✓ Online — queue: ${d.queue}, running: ${d.running}`);
      toast("Backend is online", "success");
    } catch {
      setPingStatus("✗ Cannot reach backend");
      toast("Backend offline", "error");
    }
  }

  return (
    <div className="fade-up">
      <h1 style={styles.title}>Setup Guide</h1>
      <p style={styles.desc}>Configure GitHub webhooks and deploy instructions.</p>

      {/* Health check */}
      <Panel title="Backend Health" style={{ marginBottom: "1.25rem" }}>
        <div style={styles.body}>
          <p style={styles.cardDesc}>
            The React frontend proxies <code style={styles.code}>/api/*</code> to the Express backend on port 5000.
            When deployed to Vercel separately, update the proxy in <code style={styles.code}>webpack.config.js</code>.
          </p>
          <div style={styles.row}>
            <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={ping}>Ping Backend</button>
          </div>
          {pingStatus && <p style={styles.status}>{pingStatus}</p>}
        </div>
      </Panel>

      {/* Steps */}
      <div style={styles.stepsGrid}>
        <Panel title="Step 1 — GitHub Webhook">
          <div style={styles.body}>
            <p style={styles.cardDesc}>
              Go to <strong style={{ color: "var(--text)" }}>Quantum-Language</strong> repo → Settings → Webhooks → Add webhook
            </p>
            <div style={styles.codeBlock}>
              <div style={styles.codeLine}><span style={styles.codeKey}>Payload URL:</span></div>
              <div style={{ ...styles.codeLine, color: "var(--orange)", wordBreak: "break-all" }}>
                https://your-backend.vercel.app/api/webhook
              </div>
              <div style={styles.codeLine}><span style={styles.codeKey}>Content type:</span> application/json</div>
              <div style={styles.codeLine}><span style={styles.codeKey}>Secret:</span> quantum_webhook_secret_2024</div>
              <div style={styles.codeLine}><span style={styles.codeKey}>Events:</span> Just the push event</div>
            </div>
          </div>
        </Panel>

        <Panel title="Step 2 — Docs Repo">
          <div style={styles.body}>
            <p style={styles.cardDesc}>Create a new empty GitHub repo named:</p>
            <div style={styles.repoName}>QuantumLangCodeExplaination</div>
            <p style={styles.cardDesc}>
              under your account (<strong style={{ color: "var(--text)" }}>SENODROOM</strong>).
              The backend will auto-commit generated READMEs there on every push.
            </p>
          </div>
        </Panel>

        <Panel title="Step 3 — Deploy Backend">
          <div style={styles.body}>
            <p style={styles.cardDesc}>From the <code style={styles.code}>server/</code> folder:</p>
            <div style={styles.codeBlock}>
              <div style={{ color: "var(--green)", fontFamily: "var(--mono)", fontSize: "0.75rem", lineHeight: 2 }}>
                cd server<br />
                npm install<br />
                node index.js
              </div>
            </div>
            <p style={styles.cardDesc} style={{ marginTop: "0.75rem" }}>
              For production: <code style={styles.code}>vercel --prod</code> inside <code style={styles.code}>server/</code>
            </p>
          </div>
        </Panel>

        <Panel title="Step 4 — Deploy Frontend">
          <div style={styles.body}>
            <p style={styles.cardDesc}>From the <code style={styles.code}>client/</code> folder:</p>
            <div style={styles.codeBlock}>
              <div style={{ color: "var(--green)", fontFamily: "var(--mono)", fontSize: "0.75rem", lineHeight: 2 }}>
                cd client<br />
                npm install<br />
                npm start
              </div>
            </div>
            <p style={{ ...styles.cardDesc, marginTop: "0.75rem" }}>
              For production build: <code style={styles.code}>npm run build</code> then deploy the <code style={styles.code}>dist/</code> folder.
            </p>
          </div>
        </Panel>

        <Panel title="Environment Variables">
          <div style={styles.body}>
            <p style={styles.cardDesc}>Set these in <code style={styles.code}>server/.env</code> or Vercel dashboard:</p>
            {[
              ["HF_TOKEN",              "Hugging Face API token"],
              ["GITHUB_TOKEN",          "GitHub PAT (repo read+write)"],
              ["GITHUB_SOURCE_OWNER",   "SENODROOM"],
              ["GITHUB_SOURCE_REPO",    "Quantum-Language"],
              ["GITHUB_DOCS_REPO",      "QuantumLangCodeExplaination"],
              ["MONGO_URI",             "MongoDB connection string"],
              ["WEBHOOK_SECRET",        "Any random secret string"],
            ].map(([k, v]) => (
              <div key={k} style={styles.envRow}>
                <span style={styles.envKey}>{k}</span>
                <span style={styles.envVal}>{v}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="HuggingFace Notes">
          <div style={styles.body}>
            <p style={styles.cardDesc}>Using free tier <strong style={{ color: "var(--text)" }}>Mistral-7B-Instruct-v0.3</strong>.</p>
            <div style={styles.noteList}>
              {[
                "Rate limited to ~1 req/sec",
                "2s delay added between files automatically",
                "429 errors trigger a 30s pause",
                "Processing happens in background after webhook responds",
                "Large repos may take several minutes for full scan",
              ].map((n, i) => (
                <div key={i} style={styles.noteItem}>
                  <span style={{ color: "var(--accent)" }}>→</span> {n}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

const styles = {
  title:     { fontSize: "1.4rem", fontWeight: 900, marginBottom: "0.4rem" },
  desc:      { color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1.5rem" },
  body:      { padding: "1.25rem" },
  cardDesc:  { fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.7, marginBottom: "0.75rem" },
  row:       { display: "flex", gap: "0.65rem", flexWrap: "wrap" },
  btn:       { padding: "0.6rem 1.2rem", borderRadius: "var(--r-sm)", border: "none", fontFamily: "var(--sans)", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", transition: "all .2s" },
  btnGhost:  { background: "none", color: "var(--text2)", border: "1px solid var(--border)" },
  status:    { fontFamily: "var(--mono)", fontSize: "0.73rem", color: "var(--text2)", marginTop: "0.65rem" },
  code:      { fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--orange)", background: "rgba(255,109,0,.08)", borderRadius: 3, padding: "1px 5px" },
  codeBlock: { background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", padding: "0.85rem 1rem", marginBottom: "0.75rem" },
  codeLine:  { fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text2)", lineHeight: 2 },
  codeKey:   { color: "var(--text3)" },
  repoName:  { fontFamily: "var(--mono)", fontSize: "0.9rem", color: "var(--accent)", background: "rgba(0,229,255,.07)", border: "1px solid rgba(0,229,255,.15)", borderRadius: "var(--r-sm)", padding: "0.5rem 1rem", marginBottom: "0.75rem", display: "inline-block" },
  stepsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  envRow:    { display: "flex", gap: "1rem", alignItems: "baseline", padding: "0.3rem 0", borderBottom: "1px solid var(--border)" },
  envKey:    { fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--accent)", flexShrink: 0, minWidth: 180 },
  envVal:    { fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--text3)" },
  noteList:  { display: "flex", flexDirection: "column", gap: "0.4rem" },
  noteItem:  { fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text2)", display: "flex", gap: "0.5rem" },
};
