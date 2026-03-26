// pages/Live.js
import React from "react";
import { useApp } from "../context/AppContext";
import { Panel, PanelHead, Btn } from "../components/UI";
import LiveLog from "../components/LiveLog";

export default function Live() {
  const { logs } = useApp();

  return (
    <div style={{ animation:"slideUp .3s ease" }}>
      <div style={{ marginBottom:"1.5rem" }}>
        <div style={{ fontFamily:"var(--font-display)", fontSize:"1.1rem", fontWeight:700, color:"var(--green)", letterSpacing:"2px" }}>
          LIVE LOG
        </div>
        <div style={{ fontFamily:"var(--font-mono)", fontSize:".65rem", color:"var(--muted)", marginTop:".25rem" }}>
          {'>'} real-time processing stream · {logs.length} events buffered
        </div>
      </div>

      <Panel>
        <PanelHead
          title="Processing Stream"
          right={
            <span style={{ fontFamily:"var(--font-mono)", fontSize:".6rem", color:"var(--green)", letterSpacing:"1px", animation:"pulseGlow 2s infinite" }}>
              ● LIVE
            </span>
          }
        />
        <LiveLog height="calc(100vh - 220px)" autoScroll={true} />
      </Panel>
    </div>
  );
}
