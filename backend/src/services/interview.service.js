import aiService from "./ai.service.js";

const generateInterviewQuestions = async (phase, data) => {
    let prompt = "";

    if (phase === "technical") {
        prompt = `Generate 5 technical interview questions for a ${data.role} position.`;
    } else if (phase === "jd") {
        prompt = `Based on this job description: ${data.jd}, generate 5 relevant interview questions.`;
    }

    return await aiService.getAIResponse([
        {
            role: "user",
            content: prompt,
        },
    ]);
};

export default {
    generateInterviewQuestions,
};