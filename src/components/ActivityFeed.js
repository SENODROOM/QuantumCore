import React from "react";
import { timeAgo } from "../utils/time";

const BADGE = {
  success: { bg: "rgba(0,230,118,.1)",  color: "var(--green)"  },
  error:   { bg: "rgba(255,23,68,.1)",  color: "var(--red)"    },
  skipped: { bg: "rgba(255,214,0,.1)",  color: "var(--yellow)" },
};

export default function ActivityFeed({ items, maxHeight = 360, loading }) {
  if (loading) return (
    <div style={{ padding: "1rem" }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8 }} />
      ))}
    </div>
  );

  if (!items?.length) return (
    <div style={styles.empty}>No activity yet. Push a commit or trigger manually.</div>
  );

  return (
    <div style={{ maxHeight, overflowY: "auto" }}>
      {items.map((item, i) => {
        const b = BADGE[item.status] || BADGE.skipped;
        return (
          <div key={i} style={styles.item}>
            <span style={{ ...styles.badge, background: b.bg, color: b.color }}>
              {item.status}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.path} title={item.filePath}>{item.filePath}</div>
              {item.error && <div style={styles.err}>{item.error.slice(0, 80)}</div>}
            </div>
            <span style={styles.time}>{timeAgo(item.timestamp)}</span>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  empty: {
    padding: "3rem 1.5rem",
    textAlign: "center",
    color: "var(--text3)",
    fontFamily: "var(--mono)",
    fontSize: "0.75rem",
    lineHeight: 1.8,
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.65rem",
    padding: "0.75rem 1.25rem",
    borderBottom: "1px solid var(--border)",
    transition: "background .15s",
    fontSize: "0.82rem",
  },
  badge: {
    flexShrink: 0,
    padding: "2px 8px",
    borderRadius: 4,
    fontFamily: "var(--mono)",
    fontSize: "0.6rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: 2,
  },
  path: {
    fontFamily: "var(--mono)",
    fontSize: "0.75rem",
    color: "var(--orange)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  err: {
    fontFamily: "var(--mono)",
    fontSize: "0.62rem",
    color: "var(--red)",
    opacity: 0.8,
    marginTop: 2,
  },
  time: {
    fontFamily: "var(--mono)",
    fontSize: "0.62rem",
    color: "var(--text3)",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
};
