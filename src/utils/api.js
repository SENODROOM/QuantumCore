const BASE = "/api";

export async function fetchStats(type) {
  const url = type ? `${BASE}/stats?type=${type}` : `${BASE}/stats`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Stats fetch failed: ${r.status}`);
  return r.json();
}

export async function triggerFiles(files) {
  const r = await fetch(`${BASE}/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
  if (!r.ok) throw new Error(`Trigger failed: ${r.status}`);
  return r.json();
}

export async function triggerAll() {
  const r = await fetch(`${BASE}/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ all: true }),
  });
  if (!r.ok) throw new Error(`Trigger failed: ${r.status}`);
  return r.json();
}

export async function pingHealth() {
  const r = await fetch(`${BASE}/health`);
  if (!r.ok) throw new Error("Offline");
  return r.json();
}

export function createSSE(onMessage) {
  const es = new EventSource(`${BASE}/stream`);
  es.onmessage = (e) => {
    try { onMessage(JSON.parse(e.data)); } catch {}
  };
  es.onerror = () => {
    es.close();
    setTimeout(() => createSSE(onMessage), 5000);
  };
  return es;
}
