require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
const { db } = require("./firebase");

const app = express();
const ai = new GoogleGenAI({});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Study Buddy backend running");
});

app.get("/test-db", async (req, res) => {
  try {
    const testRef = db.collection("test").doc("hello");
    await testRef.set({
      message: "Firestore connected",
      createdAt: new Date(),
    });

    const doc = await testRef.get();
    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =========================
// NOTES API
// =========================

// Create note
app.post("/notes", async (req, res) => {
  try {
    const { title, content, subject } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const newNote = {
      title,
      content,
      subject: subject || "",
      createdAt: new Date(),
    };

    const docRef = await db.collection("notes").add(newNote);

    res.status(201).json({
      id: docRef.id,
      ...newNote,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all notes
app.get("/notes", async (req, res) => {
  try {
    const snapshot = await db.collection("notes").get();
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get one note
app.get("/notes/:id", async (req, res) => {
  try {
    const doc = await db.collection("notes").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update note
app.put("/notes/:id", async (req, res) => {
  try {
    const { title, content, subject } = req.body;

    const noteRef = db.collection("notes").doc(req.params.id);
    const doc = await noteRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Note not found" });
    }

    const current = doc.data();

    const updatedNote = {
      title: title ?? current.title,
      content: content ?? current.content,
      subject: subject ?? current.subject ?? "",
      updatedAt: new Date(),
    };

    await noteRef.update(updatedNote);

    const updatedDoc = await noteRef.get();
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete note
app.delete("/notes/:id", async (req, res) => {
  try {
    const noteRef = db.collection("notes").doc(req.params.id);
    const doc = await noteRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Note not found" });
    }

    await noteRef.delete();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =========================
// TASKS API
// =========================

// Create task
app.post("/tasks", async (req, res) => {
  try {
    const { title, subject, dueDate, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newTask = {
      title,
      subject: subject || "",
      dueDate: dueDate || null,
      status: status || "todo",
      priority: priority || "medium",
      createdAt: new Date(),
    };

    const docRef = await db.collection("tasks").add(newTask);

    res.status(201).json({
      id: docRef.id,
      ...newTask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const snapshot = await db.collection("tasks").get();
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get one task
app.get("/tasks/:id", async (req, res) => {
  try {
    const doc = await db.collection("tasks").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, subject, dueDate, status, priority } = req.body;

    const taskRef = db.collection("tasks").doc(req.params.id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    const current = doc.data();

    const updatedTask = {
      title: title ?? current.title,
      subject: subject ?? current.subject ?? "",
      dueDate: dueDate ?? current.dueDate ?? null,
      status: status ?? current.status ?? "todo",
      priority: priority ?? current.priority ?? "medium",
      updatedAt: new Date(),
    };

    await taskRef.update(updatedTask);

    const updatedDoc = await taskRef.get();
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const taskRef = db.collection("tasks").doc(req.params.id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    await taskRef.delete();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =========================
// EVENTS API
// =========================

// Create event
app.post("/events", async (req, res) => {
  try {
    const { title, subject, startTime, endTime } = req.body;

    if (!title || !startTime) {
      return res.status(400).json({ error: "Title and startTime are required" });
    }

    const newEvent = {
      title,
      subject: subject || "",
      startTime,
      endTime: endTime || null,
      createdAt: new Date(),
    };

    const docRef = await db.collection("events").add(newEvent);

    res.status(201).json({
      id: docRef.id,
      ...newEvent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events
app.get("/events", async (req, res) => {
  try {
    const snapshot = await db.collection("events").get();
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get one event
app.get("/events/:id", async (req, res) => {
  try {
    const doc = await db.collection("events").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update event
app.put("/events/:id", async (req, res) => {
  try {
    const { title, subject, startTime, endTime } = req.body;

    const eventRef = db.collection("events").doc(req.params.id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const current = doc.data();

    const updatedEvent = {
      title: title ?? current.title,
      subject: subject ?? current.subject ?? "",
      startTime: startTime ?? current.startTime,
      endTime: endTime ?? current.endTime ?? null,
      updatedAt: new Date(),
    };

    await eventRef.update(updatedEvent);

    const updatedDoc = await eventRef.get();
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete event
app.delete("/events/:id", async (req, res) => {
  try {
    const eventRef = db.collection("events").doc(req.params.id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    await eventRef.delete();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =========================
// PROGRESS API
// =========================

app.get("/progress", async (req, res) => {
  try {
    const [notesSnap, tasksSnap, eventsSnap] = await Promise.all([
      db.collection("notes").get(),
      db.collection("tasks").get(),
      db.collection("events").get(),
    ]);

    const totalNotes = notesSnap.size;
    const totalTasks = tasksSnap.size;
    const totalEvents = eventsSnap.size;

    const tasks = tasksSnap.docs.map((doc) => doc.data());
    const completedTasks = tasks.filter((task) => task.status === "done").length;
    const pendingTasks = totalTasks - completedTasks;

    const completionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.json({
      totalNotes,
      totalTasks,
      completedTasks,
      pendingTasks,
      totalEvents,
      completionRate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const prompt = `
You are a study assistant.
Summarize the following study note clearly and briefly.
Return:
1. A short summary
2. 3 key points

Study note:
${text}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    res.json({
      summary: response.text,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/quiz", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const prompt = `
You are a study assistant.
Create 5 quiz questions from the study note below.

Rules:
- Make them clear and useful for revision
- Use a mix of short answer and multiple choice
- Return ONLY valid JSON
- JSON format:
{
  "questions": [
    {
      "type": "mcq" | "short",
      "question": "string",
      "options": ["a", "b", "c", "d"],
      "answer": "string"
    }
  ]
}

Study note:
${text}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    let raw = response.text;

    // Strip markdown code blocks if present
    if (raw.includes("```json")) {
      raw = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    } else if (raw.includes("```")) {
      raw = raw.replace(/```\n?/g, "").trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({
        error: "Model did not return valid JSON",
        raw,
      });
    }

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});