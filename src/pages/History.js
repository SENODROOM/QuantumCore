import React, { useEffect, useState } from "react";
import Panel from "../components/Panel";
import ActivityFeed from "../components/ActivityFeed";
import { fetchStats } from "../utils/api";

export default function History() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats("history")
      .then(d => setItems(d.updates || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-up">
      <h1 style={styles.title}>History</h1>
      <p style={styles.desc}>Last 100 documentation update events.</p>
      <Panel
        title={`Updates (${items.length})`}
        action={
          <button
            style={styles.rbtn}
            onClick={() => {
              setLoading(true);
              fetchStats("history").then(d => setItems(d.updates||[])).finally(()=>setLoading(false));
            }}
          >
            ↻ refresh
          </button>
        }
      >
        <ActivityFeed items={items} maxHeight={600} loading={loading} />
      </Panel>
    </div>
  );
}

const styles = {
  title: { fontSize: "1.4rem", fontWeight: 900, marginBottom: "0.4rem" },
  desc:  { color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1.5rem" },
  rbtn:  {
    fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text3)",
    background: "none", border: "1px solid var(--border)", borderRadius: 5,
    padding: "3px 9px", cursor: "pointer",
  },
};
