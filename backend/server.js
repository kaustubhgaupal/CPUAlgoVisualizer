import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

// 1. Configure CORS to allow your frontend
app.use(cors({
  origin: [
    "https://cpu-algo-visualizer-c5b1.vercel.app", // Your deployed frontend
    "http://localhost:5173"                          // Local development
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 2. Your API Route
app.post("/api/chat", async (req, res) => {
  const { question } = req.body;
  const prompt = `
You are an expert CPU scheduling teacher.
Explain things clearly: FCFS, SJF, Priority, Round Robin,
Gantt chart, waiting time, turnaround time.
User: ${question}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    console.log(data);
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, try again.";
    
    res.json({ answer });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Failed to fetch AI answer" });
  }
});

// 3. Test Route (Optional, good for checking if server is alive)
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// -----------------------------------------------------------------
// CRITICAL FIX FOR VERCEL:
// Vercel needs to "export" the app. It does NOT want app.listen() 
// running in production, because Vercel handles the port itself.
// -----------------------------------------------------------------

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () =>
    console.log(`🔥 Backend running locally: http://localhost:${PORT}`)
  );
}

export default app;