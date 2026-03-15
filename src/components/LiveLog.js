// components/LiveLog.js
import React, { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

const LEVEL_COLOR = {
  success: "var(--green)",
  error:   "var(--red)",
  warn:    "var(--amber)",
  skip:    "var(--amber)",
  queue:   "var(--cyan)",
  info:    "var(--text2)",
  progress:"var(--purple)",
};

export default function LiveLog({ height = "340px", autoScroll = true }) {
  const { logs } = useApp();
  const ref = useRef(null);

  useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  return (
    <div ref={ref} style={{
      height, overflowY:"auto",
      background:"var(--bg)", padding:".65rem .85rem",
      fontFamily:"var(--font-mono)", fontSize:".7rem", lineHeight:"1.75",
    }}>
      {logs.length === 0 ? (
        <div style={{ color:"var(--muted)", padding:"1rem 0" }}>
          {'> '}waiting for events<span style={{ animation:"blink 1s infinite", display:"inline-block" }}>_</span>
        </div>
      ) : [...logs].reverse().map((l, i) => (
        <div key={i} style={{ display:"flex", gap:".5rem", animation:"scanIn .15s ease" }}>
          <span style={{ color:"var(--dim)", flexShrink:0 }}>
            {l.ts ? new Date(l.ts).toLocaleTimeString() : ""}
          </span>
          <span style={{ color:"var(--muted)", flexShrink:0, width:"60px", textAlign:"right" }}>
            [{(l.level||"info").toUpperCase().slice(0,5).padEnd(5)}]
          </span>
          {l.filePath && (
            <span style={{ color:"var(--cyan)", flexShrink:0, maxWidth:"180px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {l.filePath.split("/").pop()}
            </span>
          )}
          <span style={{ color: LEVEL_COLOR[l.level] || "var(--text2)" }}>
            {l.message}
          </span>
        </div>
      ))}
    </div>
  );
}
