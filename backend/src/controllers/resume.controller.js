
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfParse = require("pdf-parse");

import { getResumeAnalysis } from "../services/ai.service.js";

export const analyzeResumeController = async (req, res) => {
  try {
    // Check file upload

    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No resume file uploaded",
      });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Could not extract text from PDF",
      });
    }

    // Check job description
    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        error: "Job description is required",
      });
    }

    // AI Analysis
    const analysis = await getResumeAnalysis(
      resumeText,
      jobDescription
    );

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Resume Analysis Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};