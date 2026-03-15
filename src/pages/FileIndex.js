import React, { useEffect, useState } from "react";
import Panel from "../components/Panel";
import { fetchStats } from "../utils/api";
import { timeAgo } from "../utils/time";

const DOCS_BASE = "https://github.com/SENODROOM/QuantumLangCodeExplaination/blob/main/";

export default function FileIndex() {
  const [all,     setAll]     = useState([]);
  const [query,   setQuery]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats("index")
      .then(d => setAll(d.index || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = all
    .filter(i => i.filePath.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.filePath.localeCompare(b.filePath));

  return (
    <div className="fade-up">
      <h1 style={styles.title}>File Index</h1>
      <p style={styles.desc}>{all.length} documented files in the docs repo.</p>

      <Panel title={`Files (${filtered.length})`} action={
        <button style={styles.rbtn} onClick={() => { setLoading(true); fetchStats("index").then(d=>setAll(d.index||[])).finally(()=>setLoading(false)); }}>
          ↻ refresh
        </button>
      }>
        {/* Search */}
        <div style={styles.searchWrap}>
          <input
            style={styles.search}
            placeholder="Filter by path…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto", maxHeight: 540, overflowY: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>File Path</th>
                <th style={styles.th}>Doc</th>
                <th style={styles.th}>Last Updated</th>
                <th style={styles.th}>Commit</th>
              </tr>
            </thead>
            <tbody>
              {loading && [...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={4} style={{ padding: "0.75rem 1rem" }}>
                    <div className="skeleton" style={{ height: 16 }} />
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} style={styles.emptyTd}>
                    {query ? "No files match your filter." : "No documented files yet. Run a trigger to get started."}
                  </td>
                </tr>
              )}
              {!loading && filtered.map((item, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={styles.tdPath}>{item.filePath}</td>
                  <td style={styles.td}>
                    <a href={`${DOCS_BASE}${item.docPath}`} target="_blank" rel="noreferrer" style={styles.link}>
                      view →
                    </a>
                  </td>
                  <td style={styles.tdMono}>{item.updatedAt ? timeAgo(item.updatedAt) : "—"}</td>
                  <td style={styles.tdMono}>{item.lastCommitSha ? item.lastCommitSha.slice(0, 7) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

const styles = {
  title: { fontSize: "1.4rem", fontWeight: 900, marginBottom: "0.4rem" },
  desc:  { color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1.5rem" },
  rbtn:  { fontFamily:"var(--mono)", fontSize:"0.65rem", color:"var(--text3)", background:"none", border:"1px solid var(--border)", borderRadius:5, padding:"3px 9px", cursor:"pointer" },
  searchWrap: { padding: "0.85rem 1.25rem", borderBottom: "1px solid var(--border)", background: "var(--surface2)" },
  search: {
    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)", padding: "0.5rem 0.9rem",
    color: "var(--text)", fontFamily: "var(--mono)", fontSize: "0.78rem", outline: "none",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text3)",
    textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 400,
    padding: "0.6rem 1rem", textAlign: "left",
    borderBottom: "1px solid var(--border)", background: "var(--surface2)",
    whiteSpace: "nowrap",
  },
  tr: { transition: "background .15s" },
  td:     { padding: "0.65rem 1rem", borderBottom: "1px solid var(--border)" },
  tdPath: { padding: "0.65rem 1rem", borderBottom: "1px solid var(--border)", fontFamily: "var(--mono)", fontSize: "0.74rem", color: "var(--orange)", wordBreak: "break-all" },
  tdMono: { padding: "0.65rem 1rem", borderBottom: "1px solid var(--border)", fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--text3)", whiteSpace: "nowrap" },
  link: {
    fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--accent)",
    background: "rgba(0,229,255,.07)", border: "1px solid rgba(0,229,255,.18)",
    borderRadius: 4, padding: "2px 8px", textDecoration: "none", whiteSpace: "nowrap",
  },
  emptyTd: { padding: "3rem", textAlign: "center", color: "var(--text3)", fontFamily: "var(--mono)", fontSize: "0.75rem" },
};
