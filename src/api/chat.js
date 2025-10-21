// src/api/chat.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { spawnSync } from "child_process";
import { google } from "googleapis";
import * as chrono from "chrono-node";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🧠 Supabase connection
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const pythonPath = process.env.PYTHON_PATH || "python";

// ⚙️ Memory session for scheduling
let schedulingSession = { active: false, expires: null };

// 🔹 Local embedding helper
function getLocalEmbedding(text) {
  const result = spawnSync(pythonPath, ["scripts/embed_text.py"], {
    input: text,
    encoding: "utf-8",
  });

  if (result.error || !result.stdout.trim()) {
    console.error("❌ Embedding error:", result.error || result.stderr);
    return null;
  }

  try {
    return JSON.parse(result.stdout);
  } catch {
    console.error("⚠️ Could not parse embedding:", result.stdout.slice(0, 200));
    return null;
  }
}

// 🔹 Google OAuth2 setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

if (process.env.GOOGLE_REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
}

const DEFAULT_TZ =
  process.env.GOOGLE_TIMEZONE ||
  Intl.DateTimeFormat().resolvedOptions().timeZone ||
  "UTC";

// ✅ Calendar helper
async function createCalendarEvent(summary, startIso, endIso, email, timeZone = DEFAULT_TZ) {
  try {
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const event = {
      summary,
      start: { dateTime: startIso, timeZone },
      end: { dateTime: endIso, timeZone },
      attendees: email ? [{ email }] : [],
      reminders: { useDefault: true },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      sendUpdates: "all",
    });

    console.log("📅 Google Calendar insert response:", {
      id: response.data.id,
      link: response.data.htmlLink,
      attendees: response.data.attendees,
      creator: response.data.creator,
      start: response.data.start,
    });

    return response.data;
  } catch (err) {
    console.error("❌ Calendar creation failed:", err.message);
    return null;
  }
}

// 🧩 Main streaming endpoint
  app.get("/api/chat", async (req, res) => {
    const userMessage = req.query.message;
    if (!userMessage) return res.status(400).send("Message is required");

    const lower = userMessage.toLowerCase();

    console.log("📩 Incoming message:", userMessage);
    console.log("📆 Scheduling session active:", schedulingSession.active);

    // ---------- Improved booking intent detection ----------
    const startsBooking =
      /(^(please\s*)?(book|schedule|set\s?up|create|add)\b)/i.test(userMessage) &&
      !/\b(check|confirm|did|are\s*you\s*sure|already|verify)\b/i.test(userMessage);

    const restartBooking =
      /\b(another|again|new|more)\b/i.test(userMessage) &&
      /(book|schedule|set up|appointment)/i.test(userMessage);

    // Trigger scheduling session if it looks like a new/another booking
    if ((startsBooking || restartBooking) && !schedulingSession.active) {
      schedulingSession.active = true;
      schedulingSession.expires = Date.now() + 5 * 60 * 1000; // 5 mins
      res.setHeader("Content-Type", "text/event-stream");
      res.write(
        `data: ${JSON.stringify({
          token:
            "I can help you create a calendar event! Please reply in this format (comma separated):\n" +
            "`your-email@example.com, Event title, Oct 22 2025 9am`\n\nOr provide the details in a single sentence.",
        })}\n\n`
      );
      res.write("data: [DONE]\n\n");
      return res.end();
    }

    // ---------- Follow-up scheduling input ----------
    if (schedulingSession.active) {
      const isExpired = Date.now() > (schedulingSession.expires || 0);

      // Expired session: reset
      if (isExpired) {
        schedulingSession = { active: false, expires: null };
      } else {
        // Detect if message looks like scheduling data (has email/date)
        const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(userMessage);
        const hasDate = chrono.parse(userMessage, new Date(), { forwardDate: true }).length > 0;

        if (!hasEmail && !hasDate) {
          // Not a valid scheduling message → exit session
          console.log("📭 Message not valid for scheduling. Exiting scheduling session.");
          schedulingSession = { active: false, expires: null };
        } else {
          // Proceed with scheduling
          let email = null;
          let title = null;
          let dateText = null;

          const parts = userMessage
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);

          if (parts.length >= 3 && parts[0].includes("@")) {
            email = parts[0];
            title = parts[1];
            dateText = parts.slice(2).join(", ");
          } else {
            const emailMatch = userMessage.match(
              /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
            );
            if (emailMatch) email = emailMatch[0];
            const quoted = userMessage.match(/"(.*?)"|'(.*?)'/);
            if (quoted) title = quoted[1] || quoted[2];
            if (!title) {
              const beforeDate = userMessage.split(
                /\b(?:on|at|tomorrow|next|this|am|pm|morning|afternoon)\b/i
              )[0];
              title =
                beforeDate.length < 200 ? beforeDate.trim() || "Appointment" : "Appointment";
            }
            dateText = userMessage;
          }

          const chronoResults = chrono.parse(dateText, new Date(), {
            forwardDate: true,
          });
          let startDate = null;
          if (chronoResults && chronoResults.length > 0)
            startDate = chronoResults[0].start.date();

          if (!email || !startDate) {
            res.setHeader("Content-Type", "text/event-stream");
            res.write(
              `data: ${JSON.stringify({
                token:
                  'Please include a valid **email** and a **date/time**. Example: `myemail@gmail.com, Demo, October 22 2025 9am`',
              })}\n\n`
            );
            res.write("data: [DONE]\n\n");
            return res.end();
          }

          const timeZone = process.env.GOOGLE_TIMEZONE || DEFAULT_TZ;
          const startIso = new Date(startDate).toISOString();
          const endIso = new Date(startDate.getTime() + 60 * 60 * 1000).toISOString();

          const created = await createCalendarEvent(
            title || "Appointment",
            startIso,
            endIso,
            email,
            timeZone
          );

          schedulingSession = { active: false, expires: null }; // Reset session

          res.setHeader("Content-Type", "text/event-stream");
          if (created && created.id) {
            const pretty = new Date(startDate).toLocaleString(undefined, {
              timeZone,
            });
            res.write(
              `data: ${JSON.stringify({
                token: `✅ Event "${title}" booked for ${pretty}. An invite has been sent to ${email}. [View in Google Calendar](${created.htmlLink})`,
              })}\n\n`
            );
          } else {
            res.write(
              `data: ${JSON.stringify({
                token:
                  "⚠️ I couldn't create the event. Please check calendar credentials and try again.",
              })}\n\n`
            );
          }
          res.write("data: [DONE]\n\n");
          return res.end();
        }
      }
    }

    // ---------- FALLBACK to normal chat (Ollama + Supabase) ----------
    console.log("🔹 Embedding text...");
    const embedding = getLocalEmbedding(userMessage);
    if (!embedding) return res.status(500).send("Embedding failed");

    console.log("🔹 Searching Supabase...");
    const { data: matches, error } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 7,
    });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).send("Database search failed");
    }

    const context =
        matches
          ?.map(
            (m, idx) =>
              `[#${idx+1}] Instruction:\n${m.metadata?.instruction || "Unknown"}\n\nResponse:\n${m.content}`
          )
          .join("\n\n---\n\n") || "";

      // If context is empty or very low quality, we can short‑circuit
      if (!matches || matches.length === 0) {
          res.setHeader("Content-Type", "text/event-stream");
          res.write(`data: ${JSON.stringify({
            token: "🤖 I'm sorry, I couldn't find enough information to answer that. You may want to rephrase or ask something else.",
          })}\n\n`);
          res.write("data: [DONE]\n\n");
          return res.end();
        }

      const prompt = `
          You are CozyCabin's official AI assistant.
          Be warm, concise, and professional.
          Use the following context to answer the question.

          Context:
          ${context}

          User:
          ${userMessage}
        `;

    // 🔹 Stream from Ollama
    console.log("🦙 Connecting to Ollama (stream)...");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3", prompt, stream: true }),
      });

      if (!ollamaResponse.body) {
        console.error("⚠️ No Ollama stream body!");
        res.write(`data: ${JSON.stringify({ token: "⚠️ No stream from Ollama" })}\n\n`);
        return res.end("data: [DONE]\n\n");
      }

      const decoder = new TextDecoder();
      ollamaResponse.body.on("data", (chunk) => {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split("\n").filter((l) => l.trim());
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response)
              res.write(`data: ${JSON.stringify({ token: json.response })}\n\n`);
          } catch (err) {
            console.warn("⚠️ Skipping malformed line:", line);
          }
        }
      });

      ollamaResponse.body.on("end", () => {
        res.write("data: [DONE]\n\n");
        res.end();
        console.log("✅ Stream complete.");
      });
    } catch (err) {
      console.error("🚨 Ollama error:", err);
      res.write(`data: ${JSON.stringify({ token: "⚠️ Stream failed." })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    }
  });


app.listen(3001, () => console.log("🚀 CozyCabin AI server running on port 3001"));
