import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import statusHistoryRoutes from "./routes/statusHistory.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import noteRoutes from "./routes/note.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";
import documentRoutes from "./routes/document.routes.js";
// Add this to your existing app.js
import resumeRoutes from "./routes/resume.routes.js";
import interviewRoutes from"./routes/interview.routes.js";


const app = express();

const allowedOrigins = [
  "https://job-tracker-sand-five-83.vercel.app", // production frontend (hardcoded as safety net)
  process.env.FRONTEND_URL,                       // override via Render env var if needed
  "http://localhost:5173",                        // Vite dev server
  "http://localhost:3000",                        // CRA dev server
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server requests (no Origin header)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Diagnostic log — visible in Render's log stream
    console.warn(`[CORS] Rejected origin: "${origin}"`);
    // Use `callback(null, false)` instead of `callback(new Error(...))`.
    // Throwing an error in Express 5 causes the response to be sent without
    // CORS headers, so the browser reports a confusing CORS failure instead
    // of a clear 403. Using `false` lets the cors middleware finish normally
    // (the response simply won't include Access-Control-Allow-Origin).
    callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// ── Explicit preflight handler ──────────────────────────────────────────
// Must come BEFORE cors() + routes. This guarantees every OPTIONS request
// gets a 200 with the correct CORS headers, even if downstream middleware
// or Express 5 error handling interferes.
app.options("*", cors(corsOptions));

// Apply CORS middleware globally (must be before all route declarations)
app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      message: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", statusHistoryRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/documents", documentRoutes);
app.use('/api/resume', resumeRoutes);
app.use("/api/interview", interviewRoutes);

export default app;