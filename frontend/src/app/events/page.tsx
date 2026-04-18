"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type EventItem = {
  id: string;
  title: string;
  subject?: string;
  startTime: string;
  endTime?: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const loadEvents = async () => {
    const data = (await api.getEvents()) as EventItem[];
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreate = async () => {
    await api.createEvent({ title, subject, startTime, endTime });
    loadEvents();
  };

  const handleUpdate = async () => {
    if (!editId) return;
    await api.updateEvent(editId, { title, subject, startTime, endTime });
    setEditId(null);
    loadEvents();
  };

  const handleDelete = async (id: string) => {
    await api.deleteEvent(id);
    loadEvents();
  };

  const handleEdit = (event: EventItem) => {
    setEditId(event.id);
    setTitle(event.title);
    setSubject(event.subject || "");
    setStartTime(event.startTime);
    setEndTime(event.endTime || "");
  };

  return (
    <main className="stack">
      <div className="page-head">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">Schedule and maintain your study events.</p>
        </div>
      </div>

      <section className="card">
        <h2>{editId ? "Edit Event" : "Create Event"}</h2>

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
            <label>Start Time</label>
            <input className="input" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="2026-04-20T10:00:00" />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>End Time</label>
            <input className="input" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="2026-04-20T12:00:00" />
          </div>
        </div>

        <div className="actions">
          {editId ? (
            <button className="btn" onClick={handleUpdate}>Update</button>
          ) : (
            <button className="btn" onClick={handleCreate}>Create</button>
          )}
        </div>
      </section>

      <section className="card">
        <h3>All Events</h3>
        <div className="stack">
        {events.map((event) => (
          <div key={event.id} className="card item-card">
            <strong>{event.title}</strong>
            <div className="item-meta">
              {event.subject ? <span className="chip">{event.subject}</span> : null}
              <span className="chip">Start: {event.startTime}</span>
              {event.endTime ? <span className="chip">End: {event.endTime}</span> : null}
            </div>
            <div className="actions">
              <button className="btn ghost" onClick={() => handleEdit(event)}>Edit</button>
              <button className="btn warn" onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          </div>
        ))}
        {events.length === 0 && <div className="empty">No events yet.</div>}
        </div>
      </section>
    </main>
  );
}
