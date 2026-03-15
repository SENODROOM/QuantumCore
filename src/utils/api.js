/* global __BACKEND_URL__ */

const BASE = (typeof __BACKEND_URL__ !== "undefined" && __BACKEND_URL__)
  ? `${__BACKEND_URL__}/api`
  : "/api";

async function safeFetch(url, options) {
  const r    = await fetch(url, options);
  const text = await r.text();
  if (!text || text.trim() === "") throw new Error(`Empty response from ${url} (status ${r.status})`);
  try { return JSON.parse(text); }
  catch { throw new Error(`Invalid JSON from ${url}: ${text.slice(0, 100)}`); }
}

export const fetchStats = (type) =>
  safeFetch(type ? `${BASE}/stats?type=${type}` : `${BASE}/stats`);

export const pingHealth = () =>
  safeFetch(`${BASE}/health`);

export const triggerFiles = (files) =>
  safeFetch(`${BASE}/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });

export const triggerAll = () =>
  safeFetch(`${BASE}/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ all: true }),
  });

// SSE for both local and Render (Render supports persistent connections)
// Falls back to polling if SSE fails
export function createSSE(onMessage) {
  let stopped = false;

  function trySSE() {
    if (stopped) return;
    try {
      const es = new EventSource(`${BASE}/stream`);
      es.onmessage = e => { try { onMessage(JSON.parse(e.data)); } catch {} };
      es.onerror   = () => {
        es.close();
        // SSE failed — fall back to polling
        console.log("SSE failed, switching to polling");
        startPolling();
      };
      return es;
    } catch {
      startPolling();
    }
  }

  function startPolling() {
    let lastTs = new Date(Date.now() - 5000).toISOString();
    const poll = async () => {
      if (stopped) return;
      try {
        const d = await safeFetch(`${BASE}/logs?since=${encodeURIComponent(lastTs)}`);
        if (d.logs?.length) {
          d.logs.reverse().forEach(onMessage);
          lastTs = d.ts;
        }
      } catch (e) {
        console.warn("Poll error:", e.message);
      }
      setTimeout(poll, 3000);
    };
    poll();
  }

  const es = trySSE();
  return {
    close: () => {
      stopped = true;
      if (es && es.close) es.close();
    }
  };
}