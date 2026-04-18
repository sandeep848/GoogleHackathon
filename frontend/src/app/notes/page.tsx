"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type NoteItem = {
  id: string;
  title: string;
  content: string;
  subject?: string;
};

type QuizQuestion = {
  type: "mcq" | "short";
  question: string;
  options?: string[];
  answer: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);

  const loadNotes = async () => {
    const data = (await api.getNotes()) as NoteItem[];
    setNotes(data);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setContent("");
    setSubject("");
  };

  const handleCreate = async () => {
    await api.createNote({ title, content, subject });
    resetForm();
    loadNotes();
  };

  const handleUpdate = async () => {
    if (!editId) return;
    await api.updateNote(editId, { title, content, subject });
    resetForm();
    loadNotes();
  };

  const handleDelete = async (id: string) => {
    await api.deleteNote(id);
    loadNotes();
  };

  const handleEdit = (note: NoteItem) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSubject(note.subject || "");
    setSummary("");
    setQuiz([]);
  };

  const handleSummarize = async () => {
    try {
      const res = await api.summarizeText(content) as { summary: string };
      setSummary(res.summary);
      setStatus("Summary generated");
    } catch {
      setStatus("Failed to summarize");
    }
  };

  const handleGenerateQuiz = async () => {
    try {
      const res = await api.generateQuiz(content) as { questions: QuizQuestion[] };
      setQuiz(res.questions || []);
      setStatus("Quiz generated");
    } catch {
      setStatus("Failed to generate quiz");
    }
  };

  return (
    <main className="stack">
      <div className="page-head">
        <div>
          <h1 className="page-title">Notes</h1>
          <p className="page-subtitle">Capture study content, then summarize it or generate quiz questions.</p>
        </div>
      </div>

      <section className="card">
        <h2>{editId ? "Edit Note" : "Create Note"}</h2>

        <div className="form-grid">
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Title</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
            />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Subject</label>
            <input
              className="input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
          </div>
        </div>

        <div className="actions">
          {editId ? (
            <button className="btn" onClick={handleUpdate}>Update Note</button>
          ) : (
            <button className="btn" onClick={handleCreate}>Create Note</button>
          )}

          <button className="btn ghost" onClick={handleSummarize}>Summarize</button>
          <button className="btn ghost" onClick={handleGenerateQuiz}>Generate Quiz</button>
        </div>

        {status && <p className="status-text">{status}</p>}

        {summary && (
          <div className="card" style={{ marginTop: 16 }}>
            <h3>Summary</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{summary}</pre>
          </div>
        )}

        {quiz.length > 0 && (
          <div className="card" style={{ marginTop: 16 }}>
            <h3>Quiz</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {quiz.map((q, index) => (
                <div key={index} className="card">
                  <strong>{index + 1}. {q.question}</strong>
                  {q.type === "mcq" && q.options && (
                    <ul>
                      {q.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                  )}
                  <div><strong>Answer:</strong> {q.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <h3>All Notes</h3>
        <div style={{ display: "grid", gap: 12 }}>
          {notes.map((note) => (
            <div key={note.id} className="card item-card">
              <strong>{note.title}</strong>
              <div className="item-meta">
                {note.subject ? <span className="chip">{note.subject}</span> : null}
              </div>
              <div>{note.content}</div>

              <div className="actions" style={{ marginTop: 12 }}>
                <button className="btn ghost" onClick={() => handleEdit(note)}>Edit</button>
                <button className="btn warn" onClick={() => handleDelete(note.id)}>Delete</button>
              </div>
            </div>
          ))}
          {notes.length === 0 && <div className="empty">No notes yet.</div>}
        </div>
      </section>
    </main>
  );
}