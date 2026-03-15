import { useEffect, useRef, useState } from "react";
import { createSSE } from "../utils/api";

export default function useSSE() {
  const [logs, setLogs]       = useState([]);
  const [queueSize, setQSize] = useState(0);
  const [running, setRunning] = useState(false);
  const esRef = useRef(null);

  useEffect(() => {
    esRef.current = createSSE((entry) => {
      if (entry.level === "queue_size") {
        setQSize(entry.size);
        return;
      }
      if (entry.level === "running") {
        setRunning(entry.value);
        return;
      }
      setLogs((prev) => {
        const next = [entry, ...prev];
        return next.slice(0, 300);
      });
    });
    return () => esRef.current?.close();
  }, []);

  return { logs, queueSize, running };
}
