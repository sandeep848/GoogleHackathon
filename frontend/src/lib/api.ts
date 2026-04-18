const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `GET failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `POST failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

async function put<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `PUT failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

async function remove<T>(path: string): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `DELETE failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  getNotes: () => get("/notes"),
  createNote: (payload: Record<string, unknown>) => post("/notes", payload),
  updateNote: (id: string, payload: Record<string, unknown>) => put(`/notes/${id}`, payload),
  deleteNote: (id: string) => remove(`/notes/${id}`),

  getTasks: () => get("/tasks"),
  createTask: (payload: Record<string, unknown>) => post("/tasks", payload),
  updateTask: (id: string, payload: Record<string, unknown>) => put(`/tasks/${id}`, payload),
  deleteTask: (id: string) => remove(`/tasks/${id}`),

  getEvents: () => get("/events"),
  createEvent: (payload: Record<string, unknown>) => post("/events", payload),
  updateEvent: (id: string, payload: Record<string, unknown>) => put(`/events/${id}`, payload),
  deleteEvent: (id: string) => remove(`/events/${id}`),

  getProgress: () => get("/progress"),

  summarizeText: (text: string) => post("/summarize", { text }),
  generateQuiz: (text: string) => post("/quiz", { text }),
};
