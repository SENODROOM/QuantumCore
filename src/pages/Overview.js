import React from "react";
import StatCard from "../components/StatCard";
import Panel from "../components/Panel";
import ActivityFeed from "../components/ActivityFeed";
import LogBox from "../components/LogBox";
import { timeAgo } from "../utils/time";

export default function Overview({ statsData, statsLoading, logs }) {
  const s = statsData?.stats;
  return (
    <div className="fade-up">
      <h1 style={styles.title}>Overview</h1>

      <div style={styles.statsGrid}>
        <StatCard label="Total Updates" value={s?.total}   color="var(--accent)"  loading={statsLoading} sub="all time" />
        <StatCard label="Successful"    value={s?.success} color="var(--green)"   loading={statsLoading} sub="docs written" />
        <StatCard label="Errors"        value={s?.errors}  color="var(--red)"     loading={statsLoading} sub="failed files" />
        <StatCard
          label="Last Update"
          value={s?.lastUpdate ? timeAgo(s.lastUpdate) : "Never"}
          loading={statsLoading}
          sub={s?.lastUpdate ? new Date(s.lastUpdate).toLocaleDateString() : "—"}
        />
      </div>

      <div style={styles.grid2}>
        <Panel title="Recent Activity">
          <ActivityFeed items={statsData?.recent} loading={statsLoading} />
        </Panel>

        <Panel
          title="Live Log"
          action={<span style={styles.liveBadge}><span style={styles.liveDot} />streaming</span>}
        >
          <LogBox logs={logs} height={320} />
        </Panel>
      </div>
    </div>
  );
}

const styles = {
  title: {
    fontSize: "1.4rem",
    fontWeight: 900,
    marginBottom: "1.5rem",
    color: "var(--text)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontFamily: "var(--mono)",
    fontSize: "0.65rem",
    color: "var(--green)",
    background: "rgba(0,230,118,0.08)",
    border: "1px solid rgba(0,230,118,0.2)",
    borderRadius: 20,
    padding: "2px 9px",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--green)",
    display: "inline-block",
    animation: "pulse 2s infinite",
  },
};
