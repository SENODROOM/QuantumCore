import React, { createContext, useContext, useState, useCallback } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [{ id, msg, type }, ...p]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 5000);
  }, []);

  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div style={styles.container}>
        {toasts.map(t => (
          <div key={t.id} style={{ ...styles.toast, ...TYPES[t.type] }} className="fade-in">
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

const TYPES = {
  info:    { borderLeftColor: "var(--accent)" },
  success: { borderLeftColor: "var(--green)"  },
  error:   { borderLeftColor: "var(--red)"    },
  warn:    { borderLeftColor: "var(--yellow)" },
};

const styles = {
  container: {
    position: "fixed",
    bottom: "1.5rem",
    right: "1.5rem",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  toast: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderLeft: "3px solid var(--accent)",
    borderRadius: "var(--r-sm)",
    padding: "0.7rem 1.1rem",
    fontFamily: "var(--mono)",
    fontSize: "0.78rem",
    color: "var(--text)",
    maxWidth: 340,
    boxShadow: "var(--shadow)",
  },
};

export function useToast() {
  return useContext(ToastCtx);
}
