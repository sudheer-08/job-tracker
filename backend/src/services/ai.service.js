import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Resume Analysis
 */
export const getResumeAnalysis = async (
  resumeText,
  jobDescription
) => {
  const prompt = `
You are a Senior Technical Recruiter and Career Coach.

Analyze the candidate's resume against the job description.

Return ONLY valid JSON:

{
  "matchScore": number,
  "summary": "string",
  "strengths": ["string"],
  "missingSkills": ["string"],
  "improvementTips": ["string"]
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  try {
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        response_format: {
          type: "json_object",
        },
      });

    return JSON.parse(
      completion.choices[0].message.content
    );
  } catch (error) {
    console.error(
      "Resume Analysis Error:",
      error
    );

    throw new Error(
      "Failed to analyze resume."
    );
  }
};

/**
 * Interview Question Generation
 */
export const getInterviewQuestions = async (
  resumeText,
  jobDescription
) => {
  const prompt = `
You are a Senior Software Engineering Interviewer.

Analyze the resume and job description.

Generate:

- 10 Technical Questions
- 5 Project Questions
- 5 Behavioral Questions
- 5 HR Questions

Each question must contain:

{
  "question": "",
  "difficulty": "EASY|MEDIUM|HARD",
  "concept": ""
}

Return ONLY valid JSON:

{
  "technical": [],
  "project": [],
  "behavioral": [],
  "hr": []
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  try {
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: {
          type: "json_object",
        },
      });

    return JSON.parse(
      completion.choices[0].message.content
    );
  } catch (error) {
    console.error(
      "Interview Question Error:",
      error
    );

    throw new Error(
      "Failed to generate interview questions."
    );
  }
};

/**
 * Interview Answer Evaluation
 */
export const evaluateInterviewAnswer =
  async (
    question,
    candidateAnswer
  ) => {
    const prompt = `
You are a Senior Technical Interviewer.

Question:
${question}

Candidate Answer:
${candidateAnswer}

Evaluate the answer.

Return ONLY valid JSON:

{
  "score": 0,
  "strengths": [],
  "missingConcepts": [],
  "feedback": "",
  "improvedAnswer": ""
}
`;

    try {
      const completion =
        await groq.chat.completions.create({
          model:
            "llama-3.3-70b-versatile",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.2,

          response_format: {
            type: "json_object",
          },
        });

      return JSON.parse(
        completion.choices[0].message.content
      );
    } catch (error) {
      console.error(
        "Interview Evaluation Error:",
        error
      );

      throw new Error(
        "Failed to evaluate answer."
      );
    }
  };

/**
 * Generic AI Chat
 */
export const getAIResponse = async (
  messages
) => {
  try {
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
      });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(
      "AI Response Error:",
      error
    );

    return "AI response unavailable.";
  }
};

export default {
  getAIResponse,
  getResumeAnalysis,
  getInterviewQuestions,
  evaluateInterviewAnswer,
};