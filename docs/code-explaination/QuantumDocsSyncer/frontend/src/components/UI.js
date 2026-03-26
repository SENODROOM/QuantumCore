/* components/UI.js — shared styled components */
import React from "react";

/* ── Terminal cursor ── */
export function Cursor() {
  return <span style={{
    display:"inline-block", width:"8px", height:"14px",
    background:"var(--green)", marginLeft:"2px",
    animation:"blink 1s step-end infinite", verticalAlign:"middle"
  }} />;
}

/* ── Status badge ── */
export function Badge({ status }) {
  const map = {
    success: { bg:"rgba(0,255,136,.1)", color:"var(--green)",  border:"rgba(0,255,136,.3)", label:"SUCCESS" },
    error:   { bg:"rgba(255,68,68,.1)", color:"var(--red)",    border:"rgba(255,68,68,.3)",  label:"ERROR"   },
    skipped: { bg:"rgba(255,179,0,.1)", color:"var(--amber)",  border:"rgba(255,179,0,.3)", label:"SKIP"    },
  };
  const s = map[status] || map.skipped;
  return (
    <span style={{
      background:s.bg, color:s.color,
      border:`1px solid ${s.border}`,
      borderRadius:"3px", padding:"1px 6px",
      fontFamily:"var(--font-mono)", fontSize:".6rem",
      letterSpacing:"1px", flexShrink:0,
    }}>{s.label}</span>
  );
}

/* ── Panel ── */
export function Panel({ children, style }) {
  return (
    <div style={{
      background:"var(--bg1)",
      border:"1px solid var(--border)",
      borderRadius:"6px", overflow:"hidden",
      ...style,
    }}>{children}</div>
  );
}

/* ── Panel header ── */
export function PanelHead({ title, right }) {
  return (
    <div style={{
      padding:".65rem 1.1rem",
      background:"var(--bg2)",
      borderBottom:"1px solid var(--border)",
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      <span style={{
        fontFamily:"var(--font-display)", fontSize:".68rem",
        color:"var(--green)", letterSpacing:"1.5px", textTransform:"uppercase",
      }}>
        <span style={{ color:"var(--muted)", marginRight:"6px" }}>▸</span>{title}
      </span>
      {right}
    </div>
  );
}

/* ── Stat card ── */
export function StatCard({ label, value, color = "var(--green)", sub }) {
  return (
    <div style={{
      background:"var(--bg1)", border:"1px solid var(--border)",
      borderRadius:"6px", padding:"1.1rem 1.25rem",
      borderTop:`2px solid ${color}`,
      transition:"border-color .2s, box-shadow .2s",
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 16px rgba(0,255,136,.12)`}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ fontFamily:"var(--font-mono)", fontSize:".65rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:".4rem" }}>{label}</div>
      <div style={{ fontFamily:"var(--font-display)", fontSize:"1.9rem", fontWeight:900, color, lineHeight:1 }}>{value ?? "—"}</div>
      {sub && <div style={{ fontFamily:"var(--font-mono)", fontSize:".62rem", color:"var(--muted)", marginTop:".3rem" }}>{sub}</div>}
    </div>
  );
}

/* ── Button ── */
export function Btn({ children, onClick, variant="primary", disabled, style }) {
  const variants = {
    primary: { background:"rgba(0,255,136,.08)", color:"var(--green)", border:"1px solid var(--green3)" },
    danger:  { background:"rgba(255,68,68,.08)",  color:"var(--red)",   border:"1px solid rgba(255,68,68,.35)" },
    ghost:   { background:"transparent",          color:"var(--text2)", border:"1px solid var(--border)" },
    cyan:    { background:"rgba(0,212,255,.08)",  color:"var(--cyan)",  border:"1px solid rgba(0,212,255,.3)" },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...v, padding:".5rem 1rem",
        fontFamily:"var(--font-mono)", fontSize:".78rem",
        borderRadius:"4px", cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? .4 : 1,
        transition:"all .2s", whiteSpace:"nowrap",
        letterSpacing:".5px",
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter="brightness(1.3)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter="none"; }}
    >{children}</button>
  );
}

/* ── Input ── */
export function Input({ value, onChange, placeholder, style }) {
  return (
    <input
      value={value} onChange={onChange} placeholder={placeholder}
      style={{
        background:"var(--bg)", border:"1px solid var(--border)",
        borderRadius:"4px", padding:".5rem .85rem",
        color:"var(--text)", fontFamily:"var(--font-mono)", fontSize:".78rem",
        outline:"none", flex:1, minWidth:"200px",
        transition:"border-color .2s",
        ...style,
      }}
      onFocus={e => e.target.style.borderColor="var(--green)"}
      onBlur={e  => e.target.style.borderColor="var(--border)"}
    />
  );
}

/* ── Time ago ── */
export function timeAgo(d) {
  if (!d) return "—";
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

/* ── Feed item ── */
export function FeedItem({ item }) {
  return (
    <div style={{
      padding:".6rem 1.1rem", borderBottom:"1px solid var(--border2)",
      display:"flex", alignItems:"flex-start", gap:".6rem",
      transition:"background .12s",
    }}
    onMouseEnter={e => e.currentTarget.style.background="var(--bg2)"}
    onMouseLeave={e => e.currentTarget.style.background="transparent"}
    >
      <Badge status={item.status} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:"var(--font-mono)", color:"var(--cyan)", fontSize:".72rem", wordBreak:"break-all" }}>
          {item.filePath}
        </div>
        {item.error && (
          <div style={{ fontFamily:"var(--font-mono)", fontSize:".62rem", color:"var(--red)", marginTop:"2px", opacity:.8 }}>
            {item.error.slice(0,80)}
          </div>
        )}
      </div>
      <div style={{ fontFamily:"var(--font-mono)", fontSize:".62rem", color:"var(--muted)", flexShrink:0, whiteSpace:"nowrap" }}>
        {timeAgo(item.timestamp)}
      </div>
    </div>
  );
}
