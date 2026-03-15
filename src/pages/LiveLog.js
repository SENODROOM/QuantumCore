import React, { useState } from "react";
import Panel from "../components/Panel";
import LogBox from "../components/LogBox";

export default function LiveLog({ logs }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? logs
    : logs.filter(l => l.level === filter);

  const LEVELS = ["all", "success", "error", "info", "warn", "skip", "queue"];

  return (
    <div className="fade-up">
      <h1 style={styles.title}>Live Log</h1>
      <p style={styles.desc}>Real-time stream of all documentation processing events.</p>

      <Panel
        title={`Events (${filtered.length})`}
        action={
          <button style={styles.clearBtn} onClick={() => {}}>
            {filtered.length} entries
          </button>
        }
      >
        <div style={styles.filters}>
          {LEVELS.map(lv => (
            <button
              key={lv}
              style={{ ...styles.filterBtn, ...(filter === lv ? styles.filterActive : {}) }}
              onClick={() => setFilter(lv)}
            >
              {lv}
            </button>
          ))}
        </div>
        <LogBox logs={filtered} height={560} autoScroll={filter === "all"} />
      </Panel>
    </div>
  );
}

const styles = {
  title: { fontSize: "1.4rem", fontWeight: 900, marginBottom: "0.4rem" },
  desc:  { color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1.5rem" },
  clearBtn: {
    fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text3)",
    background: "none", border: "1px solid var(--border)", borderRadius: 5, padding: "3px 9px", cursor: "pointer",
  },
  filters: {
    display: "flex", gap: "0.4rem", padding: "0.75rem 1rem",
    borderBottom: "1px solid var(--border)", flexWrap: "wrap",
  },
  filterBtn: {
    fontFamily: "var(--mono)", fontSize: "0.65rem",
    background: "none", border: "1px solid var(--border)",
    borderRadius: 5, padding: "3px 10px", cursor: "pointer",
    color: "var(--text3)", transition: "all .15s",
  },
  filterActive: {
    background: "rgba(0,229,255,0.1)", color: "var(--accent)",
    borderColor: "rgba(0,229,255,0.3)",
  },
};
