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
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);


app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
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