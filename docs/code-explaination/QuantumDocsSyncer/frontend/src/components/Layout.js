// components/Layout.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Cursor } from "./UI";

const NAV = [
  { to:"/",        icon:"⬡", label:"Overview"  },
  { to:"/live",    icon:"◉", label:"Live Log"   },
  { to:"/trigger", icon:"▷", label:"Trigger"    },
  { to:"/history", icon:"≡", label:"History"    },
  { to:"/index",   icon:"◫", label:"File Index" },
  { to:"/setup",   icon:"⚙", label:"Setup"      },
];

export default function Layout({ children }) {
  const { queueLen, running, connected } = useApp();

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>

      {/* ── Header ── */}
      <header style={{
        position:"sticky", top:0, zIndex:100,
        height:"56px", display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 1.75rem",
        background:"rgba(3,5,8,.92)", backdropFilter:"blur(12px)",
        borderBottom:"1px solid var(--border)",
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
          <div style={{
            width:"34px", height:"34px", borderRadius:"5px",
            background:"var(--bg2)", border:"1px solid var(--green3)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"var(--glow-green)",
          }}>
            <span style={{ fontFamily:"var(--font-display)", fontSize:"10px", fontWeight:900, color:"var(--green)" }}>QD</span>
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:".85rem", fontWeight:700, color:"var(--green)", letterSpacing:"1px" }}>
              QuantumDocs<span style={{ color:"var(--cyan)" }}>Syncer</span>
            </div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:".58rem", color:"var(--muted)", letterSpacing:".5px" }}>
              auto-documentation engine
            </div>
          </div>
        </div>

        {/* Right badges */}
        <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
          <div style={{
            display:"flex", alignItems:"center", gap:"6px",
            fontFamily:"var(--font-mono)", fontSize:".65rem",
            color: connected ? "var(--green)" : "var(--red)",
            background: connected ? "rgba(0,255,136,.06)" : "rgba(255,68,68,.06)",
            border:`1px solid ${connected ? "rgba(0,255,136,.2)" : "rgba(255,68,68,.2)"}`,
            borderRadius:"20px", padding:"3px 10px",
          }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background: connected ? "var(--green)":"var(--red)", animation: connected ? "pulseGlow 2s infinite":"none" }} />
            {connected ? "STREAM LIVE" : "RECONNECTING"}
          </div>
          {(running || queueLen > 0) && (
            <div style={{
              fontFamily:"var(--font-mono)", fontSize:".65rem", color:"var(--amber)",
              background:"rgba(255,179,0,.06)", border:"1px solid rgba(255,179,0,.25)",
              borderRadius:"20px", padding:"3px 10px",
            }}>
              QUEUE: {queueLen}
            </div>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display:"flex", flex:1 }}>

        {/* Sidebar */}
        <aside style={{
          width:"200px", flexShrink:0,
          background:"rgba(8,13,18,.7)", borderRight:"1px solid var(--border)",
          padding:"1.25rem .75rem",
          position:"sticky", top:"56px", height:"calc(100vh - 56px)", overflowY:"auto",
        }}>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:".58rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1.5px", padding:"0 .5rem", marginBottom:".5rem" }}>
            / NAVIGATION
          </div>
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to==="/"} style={{ textDecoration:"none" }}>
              {({ isActive }) => (
                <div style={{
                  display:"flex", alignItems:"center", gap:".55rem",
                  padding:".45rem .65rem", borderRadius:"4px", marginBottom:"2px",
                  background: isActive ? "rgba(0,255,136,.06)" : "transparent",
                  border: isActive ? "1px solid rgba(0,255,136,.15)" : "1px solid transparent",
                  color: isActive ? "var(--green)" : "var(--text2)",
                  fontFamily:"var(--font-mono)", fontSize:".78rem",
                  cursor:"pointer", transition:"all .15s",
                  letterSpacing:".3px",
                }}>
                  <span style={{ fontSize:"11px", width:"16px", textAlign:"center" }}>{icon}</span>
                  {label}
                  {isActive && <span style={{ marginLeft:"auto", color:"var(--green)" }}><Cursor /></span>}
                </div>
              )}
            </NavLink>
          ))}

          {/* System info at bottom */}
          <div style={{ position:"absolute", bottom:"1rem", left:".75rem", right:".75rem" }}>
            <div style={{ height:"1px", background:"var(--border)", marginBottom:".75rem" }} />
            <div style={{ fontFamily:"var(--font-mono)", fontSize:".58rem", color:"var(--dim)", lineHeight:2 }}>
              <div>SRC: Quantum-Language</div>
              <div>DST: QuantumLang</div>
              <div>    CodeExplaination</div>
              <div>MDL: Mistral-7B</div>
            </div>
          </div>
        </aside>

        {/* Page content */}
        <main style={{ flex:1, padding:"1.75rem", overflowX:"hidden", minHeight:"calc(100vh - 56px)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
