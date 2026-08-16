import prisma from "../config/prisma.js";
import aiService from "./ai.service.js";

export const generateInterviewSession =
  async (
    userId,
    applicationId,
    resumeText,
    jobDescription
  ) => {
    const generated =
      await aiService.getInterviewQuestions(
        resumeText,
        jobDescription
      );

    const session =
      await prisma.interviewSession.create({
        data: {
          userId,
          applicationId,
        },
      });

    const questions = [
      ...generated.technical.map((q) => ({
        ...q,
        category: "TECHNICAL",
      })),

      ...generated.project.map((q) => ({
        ...q,
        category: "PROJECT",
      })),

      ...generated.behavioral.map((q) => ({
        ...q,
        category: "BEHAVIORAL",
      })),

      ...generated.hr.map((q) => ({
        ...q,
        category: "HR",
      })),
    ];

    await prisma.interviewQuestion.createMany({
      data: questions.map((q) => ({
        sessionId: session.id,
        category: q.category,
        difficulty: q.difficulty,
        question: q.question,
        concept: q.concept,
      })),
    });

    return prisma.interviewSession.findUnique({
      where: {
        id: session.id,
      },
      include: {
        questions: true,
      },
    });
  };

export const getInterviewSession =
  async (userId, sessionId) => {
    return prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        questions: true,
      },
    });
  };

export const submitAnswer =
  async (
    userId,
    questionId,
    answer
  ) => {
    const question =
      await prisma.interviewQuestion.findUnique({
        where: {
          id: questionId,
        },
      });

    if (!question) {
      throw new Error(
        "Question not found"
      );
    }

    const evaluation =
      await aiService.evaluateInterviewAnswer(
        question.question,
        answer
      );

    const response =
      await prisma.interviewResponse.create({
        data: {
          questionId,
          userAnswer: answer,
          score: evaluation.score,
          feedback:
            evaluation.feedback,
        },
      });

    return {
      response,
      evaluation,
    };
  };

export const getAnalytics =
  async (userId) => {
    const responses =
      await prisma.interviewResponse.findMany({
        where: {
          question: {
            session: {
              userId,
            },
          },
        },
      });

    const averageScore =
      responses.length === 0
        ? 0
        : responses.reduce(
            (sum, r) =>
              sum + r.score,
            0
          ) / responses.length;

    return {
      totalResponses:
        responses.length,
      averageScore:
        Number(
          averageScore.toFixed(2)
        ),
    };
  };