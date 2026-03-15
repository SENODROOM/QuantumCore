// context/AppContext.js
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const API = process.env.REACT_APP_API_URL || "";

export function AppProvider({ children }) {
  const [stats,    setStats]    = useState(null);
  const [recent,   setRecent]   = useState([]);
  const [logs,     setLogs]     = useState([]);
  const [queueLen, setQueueLen] = useState(0);
  const [running,  setRunning]  = useState(false);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const [connected, setConnected] = useState(false);
  const esRef = useRef(null);

  // SSE connection
  useEffect(() => {
    function connect() {
      const es = new EventSource(`${API}/api/stream`);
      esRef.current = es;

      es.onopen = () => setConnected(true);

      es.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if (d.level === "progress") {
          setProgress({ processed: d.processed, total: d.total });
          return;
        }
        if (d.level === "queue") {
          const m = d.message.match(/(\d+) files queued/);
          if (m) setQueueLen(parseInt(m[1]));
          if (d.message === "Queue finished") { setRunning(false); setQueueLen(0); }
          else setRunning(true);
        }
        setLogs(prev => {
          const next = [d, ...prev];
          return next.slice(0, 300);
        });
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        setTimeout(connect, 5000);
      };
    }
    connect();
    return () => esRef.current?.close();
  }, []);

  // Poll stats
  const loadStats = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/stats`);
      const d = await r.json();
      setStats(d.stats);
      setRecent(d.recent || []);
      setQueueLen(d.queue || 0);
      setRunning(d.running || false);
    } catch {}
  }, []);

  useEffect(() => {
    loadStats();
    const t = setInterval(loadStats, 30000);
    return () => clearInterval(t);
  }, [loadStats]);

  async function trigger(payload) {
    const r = await fetch(`${API}/api/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const d = await r.json();
    if (d.fileCount) setProgress({ processed: 0, total: d.fileCount });
    setTimeout(loadStats, 8000);
    return d;
  }

  return (
    <Ctx.Provider value={{ stats, recent, logs, queueLen, running, progress, connected, loadStats, trigger, API }}>
      {children}
    </Ctx.Provider>
  );
}
