import React from "react";

export default function StatCard({ label, value, sub, color = "var(--text)", loading }) {
  return (
    <div style={styles.card}>
      <div style={styles.bar} />
      <div style={styles.label}>{label}</div>
      {loading
        ? <div className="skeleton" style={{ width: 60, height: 36, marginBottom: 4 }} />
        : <div style={{ ...styles.value, color }}>{value ?? "—"}</div>
      }
      {sub && <div style={styles.sub}>{sub}</div>}
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    padding: "1.25rem 1.5rem",
    position: "relative",
    overflow: "hidden",
    transition: "border-color .2s, transform .2s",
    cursor: "default",
  },
  bar: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 2,
    background: "linear-gradient(90deg, var(--accent), var(--accent2))",
  },
  label: {
    fontFamily: "var(--mono)",
    fontSize: "0.62rem",
    color: "var(--text3)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "0.4rem",
  },
  value: {
    fontSize: "2.2rem",
    fontWeight: 900,
    lineHeight: 1,
    fontFamily: "var(--sans)",
    marginBottom: "0.25rem",
  },
  sub: {
    fontFamily: "var(--mono)",
    fontSize: "0.62rem",
    color: "var(--text3)",
  },
};
