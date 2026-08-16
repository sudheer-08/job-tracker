import express from "express";

import {
  generateInterview,
  getSession,
  submitAnswer,
  getAnalytics,
} from "../controllers/interview.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/generate",
  authenticate,
  generateInterview
);

router.get(
  "/session/:id",
  authenticate,
  getSession
);

router.post(
  "/answer",
  authenticate,
  submitAnswer
);

router.get(
  "/analytics",
  authenticate,
  getAnalytics
);

export default router;