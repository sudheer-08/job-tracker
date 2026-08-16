import * as interviewService from "../services/interview.service.js";

export const generateInterview = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const {
      applicationId,
      resumeText,
      jobDescription,
    } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error:
          "resumeText and jobDescription are required",
      });
    }

    const session =
      await interviewService.generateInterviewSession(
        userId,
        applicationId,
        resumeText,
        jobDescription
      );

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(
      "Generate Interview Error:",
      error
    );

    res.status(500).json({
      error:
        "Failed to generate interview session",
    });
  }
};

export const getSession = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const session =
      await interviewService.getInterviewSession(
        userId,
        req.params.id
      );

    if (!session) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(
      "Get Session Error:",
      error
    );

    res.status(500).json({
      error:
        "Failed to fetch interview session",
    });
  }
};

export const submitAnswer =
  async (req, res) => {
    try {
      const { questionId, answer } =
        req.body;

      if (!questionId || !answer) {
        return res.status(400).json({
          error:
            "questionId and answer are required",
        });
      }

      const result =
        await interviewService.submitAnswer(
          req.user.id,
          questionId,
          answer
        );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error(
        "Submit Answer Error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to evaluate answer",
      });
    }
  };

export const getAnalytics =
  async (req, res) => {
    try {
      const analytics =
        await interviewService.getAnalytics(
          req.user.id
        );

      res.json({
        success: true,
        analytics,
      });
    } catch (error) {
      console.error(
        "Analytics Error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to fetch analytics",
      });
    }
  };