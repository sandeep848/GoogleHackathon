"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Note {
  id: string;
  title: string;
  content?: string;
  subject?: string;
  createdAt?: any;
}

interface Task {
  id: string;
  title: string;
  subject?: string;
  priority?: string;
  status?: string;
  createdAt?: any;
}

interface Event {
  id: string;
  title: string;
  subject?: string;
  startTime?: string;
  endTime?: string;
  createdAt?: any;
}

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, tasksRes, eventsRes] = await Promise.all([
          api.getNotes(),
          api.getTasks(),
          api.getEvents(),
        ]);

        // Get last 5 items, sorted by creation date (newest first)
        const sortByDate = (items: any[]) =>
          items
            .sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return dateB - dateA;
            })
            .slice(0, 5);

        setNotes(sortByDate(notesRes));
        setTasks(sortByDate(tasksRes));
        setEvents(sortByDate(eventsRes));
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItemCard = (
    item: Note | Task | Event,
    type: "note" | "task" | "event"
  ) => {
    const href =
      type === "note"
        ? "/notes"
        : type === "task"
          ? "/tasks"
          : "/events";

    return (
      <Link href={href} key={item.id}>
        <div className="item-card" style={{ cursor: "pointer", opacity: 0.9, transition: "opacity 0.2s" }}>
          <div style={{ marginBottom: 8 }}>
            <strong>{item.title}</strong>
          </div>
          <div className="item-meta">
            {(item as Note).subject && (
              <span className="chip">{(item as Note).subject}</span>
            )}
            {(item as Task).priority && (
              <span className="chip">{(item as Task).priority}</span>
            )}
            {(item as Task).status && (
              <span
                className="chip"
                style={{
                  backgroundColor: (item as Task).status === "done" ? "#dcfce7" : "#fef3c7",
                  color: (item as Task).status === "done" ? "#15803d" : "#92400e",
                }}
              >
                {(item as Task).status}
              </span>
            )}
            {(item as Event).startTime && (
              <span className="chip" style={{ fontSize: "0.8rem" }}>
                {new Date((item as Event).startTime!).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <main className="stack">
      <div className="page-head">
        <div>
          <h1 className="page-title">Your study buddy</h1>
          <p className="page-subtitle">by UTN Rockstars</p>
          <p className="page-subtitle">Your notes, tasks, and study events in one place.</p>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          Loading your recent items...
        </div>
      ) : (
        <>
          {notes.length > 0 && (
            <section className="card">
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ marginBottom: 8 }}>📝 Recent Notes</h2>
                <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                  Last {notes.length} created notes
                </p>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {notes.map((note) => renderItemCard(note, "note"))}
              </div>
              <Link href="/notes" className="btn ghost" style={{ marginTop: 12 }}>
                View All Notes →
              </Link>
            </section>
          )}

          {tasks.length > 0 && (
            <section className="card">
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ marginBottom: 8 }}>✓ Recent Tasks</h2>
                <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                  Last {tasks.length} created tasks
                </p>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {tasks.map((task) => renderItemCard(task, "task"))}
              </div>
              <Link href="/tasks" className="btn ghost" style={{ marginTop: 12 }}>
                View All Tasks →
              </Link>
            </section>
          )}

          {events.length > 0 && (
            <section className="card">
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ marginBottom: 8 }}>📅 Recent Events</h2>
                <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                  Last {events.length} created events
                </p>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {events.map((event) => renderItemCard(event, "event"))}
              </div>
              <Link href="/events" className="btn ghost" style={{ marginTop: 12 }}>
                View All Events →
              </Link>
            </section>
          )}

          {notes.length === 0 && tasks.length === 0 && events.length === 0 && (
            <section className="card" style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ fontSize: "1rem", color: "var(--muted)" }}>
                No items yet. Create your first{" "}
                <Link href="/notes" style={{ color: "var(--accent)", fontWeight: 600 }}>
                  note
                </Link>
                ,{" "}
                <Link href="/tasks" style={{ color: "var(--accent)", fontWeight: 600 }}>
                  task
                </Link>
                , or{" "}
                <Link href="/events" style={{ color: "var(--accent)", fontWeight: 600 }}>
                  event
                </Link>
                !
              </p>
            </section>
          )}
        </>
      )}
    </main>
  );
}