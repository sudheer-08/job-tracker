import express from "express";
import { getQuestions } from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/generate-questions", getQuestions);

export default router;