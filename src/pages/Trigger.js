import React, { useState } from "react";
import Panel from "../components/Panel";
import { triggerFiles, triggerAll } from "../utils/api";
import { useToast } from "../components/Toast";

export default function Trigger({ onTriggered }) {
  const toast = useToast();
  const [fileInput, setFileInput] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingAll,   setLoadingAll]   = useState(false);
  const [statusFiles,  setStatusFiles]  = useState("");
  const [statusAll,    setStatusAll]    = useState("");
  const [progress, setProgress]         = useState(null);

  async function handleFiles() {
    const files = fileInput.split(",").map(f => f.trim()).filter(Boolean);
    if (!files.length) { toast("Enter at least one file path", "error"); return; }
    setLoadingFiles(true);
    setStatusFiles("Queuing files…");
    try {
      const d = await triggerFiles(files);
      toast(`${d.fileCount} file(s) queued`, "success");
      setStatusFiles(`${d.fileCount} file(s) queued. Watch the Live Log for progress.`);
      setProgress({ total: d.fileCount, done: 0 });
      onTriggered?.();
    } catch(e) {
      toast(e.message, "error"); setStatusFiles("");
    } finally { setLoadingFiles(false); }
  }

  async function handleAll() {
    if (!window.confirm("Regenerate docs for ALL files? This may take several minutes.")) return;
    setLoadingAll(true);
    setStatusAll("Fetching file list…");
    try {
      const d = await triggerAll();
      toast(`Full scan started: ${d.fileCount} files queued`, "info");
      setStatusAll(`${d.fileCount} files queued. Processing in background.`);
      setProgress({ total: d.fileCount, done: 0 });
      onTriggered?.();
    } catch(e) {
      toast(e.message, "error"); setStatusAll("");
    } finally { setLoadingAll(false); }
  }

  return (
    <div className="fade-up">
      <h1 style={styles.title}>Trigger</h1>
      <p style={styles.desc}>Manually queue files for documentation generation.</p>

      {progress && (
        <div style={styles.progressCard}>
          <div style={styles.progressLabel}>
            Processing queue — {progress.total} files
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${Math.min(100, (progress.done / progress.total) * 100)}%` }} />
          </div>
          <div style={styles.progressStats}>
            <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "0.7rem" }}>
              {progress.total} total queued
            </span>
          </div>
        </div>
      )}

      <Panel title="Selected Files" style={{ marginBottom: "1.25rem" }}>
        <div style={styles.body}>
          <p style={styles.cardDesc}>
            Enter one or more file paths from the Quantum Language repo. Separate multiple paths with commas.
          </p>
          <input
            style={styles.input}
            value={fileInput}
            onChange={e => setFileInput(e.target.value)}
            placeholder="include/AST/AST.h, src/lexer/Lexer.cpp, …"
            onKeyDown={e => e.key === "Enter" && handleFiles()}
          />
          <div style={styles.row}>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleFiles} disabled={loadingFiles}>
              {loadingFiles ? "Queuing…" : "Generate Selected"}
            </button>
            <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => setFileInput("")}>
              Clear
            </button>
          </div>
          {statusFiles && <p style={styles.status}>{statusFiles}</p>}
        </div>
      </Panel>

      <Panel title="Full Repository Scan">
        <div style={styles.body}>
          <p style={styles.cardDesc}>
            Regenerate documentation for every file in the Quantum Language repo.
            HuggingFace free tier processes ~1 file every 2–3 seconds — a full repo scan may take several minutes.
          </p>
          <div style={styles.row}>
            <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={handleAll} disabled={loadingAll}>
              {loadingAll ? "Starting…" : "⚡ Start Full Scan"}
            </button>
          </div>
          {statusAll && <p style={styles.status}>{statusAll}</p>}
        </div>
      </Panel>
    </div>
  );
}

const styles = {
  title: { fontSize: "1.4rem", fontWeight: 900, marginBottom: "0.4rem" },
  desc:  { color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1.5rem" },
  body:  { padding: "1.25rem" },
  cardDesc: { fontSize: "0.83rem", color: "var(--text2)", lineHeight: 1.7, marginBottom: "1rem" },
  input: {
    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)", padding: "0.65rem 1rem",
    color: "var(--text)", fontFamily: "var(--mono)", fontSize: "0.8rem",
    outline: "none", marginBottom: "0.85rem",
  },
  row: { display: "flex", gap: "0.65rem", flexWrap: "wrap" },
  btn: {
    padding: "0.6rem 1.2rem", borderRadius: "var(--r-sm)", border: "none",
    fontFamily: "var(--sans)", fontWeight: 700, fontSize: "0.82rem",
    cursor: "pointer", transition: "all .2s",
  },
  btnPrimary: { background: "linear-gradient(135deg, var(--accent), #0099cc)", color: "#000" },
  btnGhost:   { background: "none", color: "var(--text2)", border: "1px solid var(--border)" },
  btnDanger:  { background: "rgba(255,23,68,.12)", color: "var(--red)", border: "1px solid rgba(255,23,68,.25)" },
  status: { fontFamily: "var(--mono)", fontSize: "0.73rem", color: "var(--text2)", marginTop: "0.65rem" },
  progressCard: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "var(--r-md)", padding: "1.25rem", marginBottom: "1.25rem",
  },
  progressLabel: { fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text2)", marginBottom: "0.5rem" },
  progressBar:   { height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden", marginBottom: "0.5rem" },
  progressFill:  { height: "100%", background: "linear-gradient(90deg, var(--accent), var(--accent2))", borderRadius: 3, transition: "width .4s ease" },
  progressStats: {},
};
