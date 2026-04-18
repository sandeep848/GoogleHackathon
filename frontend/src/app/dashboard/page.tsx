"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type ProgressData = {
  totalNotes: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalEvents: number;
  completionRate: number;
};

export default function DashboardPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [error, setError] = useState("");

  const loadProgress = async () => {
    try {
      const data = (await api.getProgress()) as ProgressData;
      setProgress(data);
    } catch {
      setError("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  if (error) return <main className="empty">{error}</main>;
  if (!progress) return <main className="empty">Loading dashboard...</main>;

  return (
    <main className="stack">
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track study progress across notes, tasks, and events.</p>
        </div>
      </div>

      <section className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="card">
          <h3>Total Notes</h3>
          <p className="metric-value">{progress.totalNotes}</p>
        </div>

        <div className="card">
          <h3>Total Tasks</h3>
          <p className="metric-value">{progress.totalTasks}</p>
        </div>

        <div className="card">
          <h3>Completed Tasks</h3>
          <p className="metric-value">{progress.completedTasks}</p>
        </div>

        <div className="card">
          <h3>Pending Tasks</h3>
          <p className="metric-value">{progress.pendingTasks}</p>
        </div>

        <div className="card">
          <h3>Total Events</h3>
          <p className="metric-value">{progress.totalEvents}</p>
        </div>

        <div className="card">
          <h3>Completion Rate</h3>
          <p className="metric-value">{progress.completionRate}%</p>
        </div>
      </section>
    </main>
  );
}
