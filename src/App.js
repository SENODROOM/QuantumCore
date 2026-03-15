import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { ToastProvider } from "./components/Toast";
import useSSE from "./hooks/useSSE";
import useStats from "./hooks/useStats";
import Overview  from "./pages/Overview";
import LiveLog   from "./pages/LiveLog";
import Trigger   from "./pages/Trigger";
import History   from "./pages/History";
import FileIndex from "./pages/FileIndex";
import Setup     from "./pages/Setup";

export default function App() {
  const { logs, queueSize, running } = useSSE();
  const { data: statsData, loading: statsLoading, reload } = useStats(30000);

  return (
    <ToastProvider>
      <div className="grid-bg" style={styles.root}>
        {/* Glow blobs */}
        <div className="glow-blob" style={{ width: 600, height: 600, background: "var(--accent2)", top: -200, left: -200 }} />
        <div className="glow-blob" style={{ width: 400, height: 400, background: "var(--accent)",  bottom: 0,   right: -100 }} />

        <div style={styles.layout}>
          <Sidebar queueSize={queueSize} running={running} />

          <div style={styles.main}>
            <Routes>
              <Route path="/"        element={<Overview  statsData={statsData} statsLoading={statsLoading} logs={logs} />} />
              <Route path="/live"    element={<LiveLog   logs={logs} />} />
              <Route path="/trigger" element={<Trigger   onTriggered={reload} />} />
              <Route path="/history" element={<History />} />
              <Route path="/index"   element={<FileIndex />} />
              <Route path="/setup"   element={<Setup />} />
            </Routes>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    position: "relative",
  },
  layout: {
    display: "flex",
    minHeight: "100vh",
    position: "relative",
    zIndex: 1,
  },
  main: {
    flex: 1,
    padding: "2rem 2.5rem",
    overflowX: "hidden",
    minWidth: 0,
  },
};
