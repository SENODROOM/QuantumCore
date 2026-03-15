import React, { useEffect, useRef } from "react";
import { fmtTime } from "../utils/time";

const LEVEL_COLOR = {
  success: "var(--green)",
  error:   "var(--red)",
  warn:    "var(--yellow)",
  skip:    "var(--yellow)",
  queue:   "var(--accent)",
  info:    "var(--text2)",
};

export default function LogBox({ logs, height = 360, autoScroll = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  return (
    <div style={{ ...styles.box, height }} ref={ref}>
      {logs.length === 0 && (
        <div style={styles.empty}>Waiting for events…</div>
      )}
      {[...logs].reverse().map((l, i) => (
        <div key={i} style={styles.line} className="fade-in">
          <span style={styles.ts}>{l.ts ? fmtTime(l.ts) : ""}</span>
          {l.filePath && (
            <span style={styles.file} title={l.filePath}>
              {l.filePath.split("/").pop()}
            </span>
          )}
          <span style={{ ...styles.msg, color: LEVEL_COLOR[l.level] || "var(--text2)" }}>
            {l.message}
          </span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  box: {
    overflowY: "auto",
    padding: "0.75rem",
    background: "var(--bg)",
    fontFamily: "var(--mono)",
    fontSize: "0.7rem",
    lineHeight: 1.8,
  },
  empty: {
    color: "var(--text3)",
    padding: "2rem",
    textAlign: "center",
  },
  line: {
    display: "flex",
    gap: "0.6rem",
    alignItems: "baseline",
    padding: "1px 0",
    borderBottom: "1px solid rgba(255,255,255,0.02)",
  },
  ts:   { color: "var(--text3)", flexShrink: 0, minWidth: 80 },
  file: {
    color: "var(--orange)",
    flexShrink: 0,
    maxWidth: 160,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  msg:  { flex: 1 },
};
