import React from "react";

export default function Panel({ title, action, children, style }) {
  return (
    <div style={{ ...styles.panel, ...style }}>
      <div style={styles.head}>
        <div style={styles.title}>
          <span style={styles.titleBar} />
          {title}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}

const styles = {
  panel: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    overflow: "hidden",
  },
  head: {
    padding: "0.85rem 1.25rem",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "0.85rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "var(--text)",
  },
  titleBar: {
    display: "block",
    width: 3,
    height: 14,
    background: "var(--accent)",
    borderRadius: 2,
    flexShrink: 0,
  },
};
