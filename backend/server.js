import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { question } = req.body;

  // Validate API Key existence
  if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is missing in .env file");
    return res.status(500).json({ answer: "Server configuration error: API Key missing." });
  }

  const prompt = `
You are an expert CPU scheduling teacher.
Explain things clearly: FCFS, SJF, Priority, Round Robin,
Gantt chart, waiting time, turnaround time.
User: ${question}
`;




  try {
    // FIX 1 & 2: Corrected URL syntax and Model Name (using v1beta for 1.5-flash)
    const response = await fetch(
      

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    // Check if Google returned an error structure
    if (data.error) {
      console.error("Gemini API returned error:", data.error);
      return res.json({ answer: `AI Error: ${data.error.message}` });
    }

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    res.json({ answer });
  } catch (err) {
    console.error("Server Logic Error:", err);
    res.status(500).json({ answer: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () =>
    console.log(`🔥 Backend running locally: http://localhost:${PORT}`)
  );
}