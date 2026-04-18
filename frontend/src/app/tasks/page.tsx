"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type TaskItem = {
  id: string;
  title: string;
  subject?: string;
  dueDate?: string;
  status?: string;
  priority?: string;
};

export default function TasksPage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [statusMsg, setStatusMsg] = useState("");

  const loadTasks = async () => {
    try {
      const data = (await api.getTasks()) as TaskItem[];
      setTasks(data);
    } catch {
      setStatusMsg("Failed to load tasks");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async () => {
    try {
      await api.createTask({
        title,
        subject,
        dueDate,
        priority,
        status: "todo",
      });
      setTitle("");
      setSubject("");
      setDueDate("");
      setPriority("medium");
      setStatusMsg("Task created");
      loadTasks();
    } catch {
      setStatusMsg("Failed to create task");
    }
  };

  const handleMarkDone = async (id: string) => {
    try {
      await api.updateTask(id, { status: "done" });
      setStatusMsg("Task marked as done");
      loadTasks();
    } catch {
      setStatusMsg("Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTask(id);
      setStatusMsg("Task deleted");
      loadTasks();
    } catch {
      setStatusMsg("Failed to delete task");
    }
  };

  return (
    <main className="stack">
      <div className="page-head">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Plan, complete, and manage your study workload.</p>
        </div>
      </div>

      <section className="card">
        <h2>Create Task</h2>

        <div className="form-grid">
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          </div>

          <div className="field">
            <label>Subject</label>
            <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          </div>

          <div className="field">
            <label>Due Date</label>
            <input className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="2026-04-20" />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Priority</label>
            <input className="input" value={priority} onChange={(e) => setPriority(e.target.value)} placeholder="low / medium / high" />
          </div>
        </div>

        <button className="btn" onClick={handleCreate}>Create Task</button>
        {statusMsg && <p className="status-text">{statusMsg}</p>}
      </section>

      <section className="card">
        <h3>All Tasks</h3>
        <div style={{ display: "grid", gap: 12 }}>
          {tasks.map((task) => (
            <div key={task.id} className="card item-card">
              <div><strong>{task.title}</strong></div>
              <div className="item-meta">
                {task.subject ? <span className="chip">{task.subject}</span> : null}
                {task.priority ? <span className="chip">Priority: {task.priority}</span> : null}
                {task.status ? <span className="chip">Status: {task.status}</span> : null}
              </div>
              <div>{task.dueDate ? `Due: ${task.dueDate}` : "No due date"}</div>

              <div className="actions" style={{ marginTop: 12 }}>
                {task.status !== "done" && (
                  <button className="btn ghost" onClick={() => handleMarkDone(task.id)}>
                    Mark as Done
                  </button>
                )}
                <button className="btn warn" onClick={() => handleDelete(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <div className="empty">No tasks yet.</div>}
        </div>
      </section>
    </main>
  );
}