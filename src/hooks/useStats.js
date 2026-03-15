import { useState, useEffect, useCallback } from "react";
import { fetchStats } from "../utils/api";

export default function useStats(autoRefresh = 30000) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    try {
      const d = await fetchStats();
      setData(d);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, autoRefresh);
    return () => clearInterval(id);
  }, [load, autoRefresh]);

  return { data, loading, error, reload: load };
}
