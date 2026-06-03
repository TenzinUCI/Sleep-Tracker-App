import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Sleep Tracker server is running.",
  });
});

app.post("/api/sleep-suggestion", async (req, res) => {
  try {
    console.log("Received AI suggestion request");

    if (!process.env.OPENAI_API_KEY) {
      console.log("Missing OPENAI_API_KEY");

      return res.status(500).json({
        suggestion: "Missing OpenAI API key on the server.",
      });
    }

    const logs = Array.isArray(req.body.logs) ? req.body.logs : [];

    const recentLogs = logs.slice(0, 7).map((log) => ({
      startTime: log.startTime,
      endTime: log.endTime,
      totalDuration: log.totalDuration,
      rating: log.rating,
      comment: log.comment,
    }));

    console.log("Recent logs sent to AI:", recentLogs.length);

    if (recentLogs.length === 0) {
      return res.json({
        suggestion: "Log your first sleep session to receive an AI sleep suggestion.",
      });
    }

    console.log("Calling OpenAI...");

    const response = await openai.responses.create({
      model: "gpt-5.5",
      max_output_tokens: 120,
      input: [
        {
          role: "system",
          content:
            "You are a sleep wellness assistant. Give short, friendly, non-medical sleep suggestions. Do not diagnose health conditions. Keep the answer under two sentences.",
        },
        {
          role: "user",
          content: `Analyze these recent sleep logs and give one useful suggestion:\n${JSON.stringify(
            recentLogs,
            null,
            2
          )}`,
        },
      ],
    });

    const suggestion =
      response.output_text?.trim() ||
      "Your sleep data was received, but no suggestion was generated.";

    console.log("AI suggestion:", suggestion);

    return res.json({
      suggestion,
    });
  } catch (error) {
    console.error("AI sleep suggestion error:", error);

    return res.status(500).json({
      suggestion: "Could not generate an AI suggestion right now.",
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});