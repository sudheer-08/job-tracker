import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Analyzes a resume against a job description based on specific engineering 
 * capability and project-based scoring rules.
 */
export const getResumeAnalysis = async (resumeText, jobDescription) => {
  const prompt = `
You are a Senior Technical Recruiter and Career Coach. 
Analyze the candidate's resume against the job description using these strict scoring rules:

SCORING RULES:
1. Evaluate demonstrated engineering capability and production deployment experience over keyword count.
2. Grant significant credit for independently built and deployed SaaS products.
3. Treat technology equivalents as matches (e.g., PostgreSQL ≈ MySQL; Express ≈ Spring Boot; Node.js ≈ backend development; Redis ≈ distributed systems).
4. Missing specific languages (e.g., Ruby/Java) should only reduce the score moderately.
5. High weight is assigned to: End-to-end ownership, system design, deployment, API development, database design, and real-world impact.
6. Score ranges: 90-100 (Excellent), 75-89 (Strong), 60-74 (Moderate), 40-59 (Partial), 0-39 (Weak).

Return ONLY valid JSON in this structure:
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
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1, // Low temperature for deterministic scoring
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to generate resume analysis.");
  }
};

/**
 * Generic AI response function for general queries.
 */
export const getAIResponse = async (messages) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in AI response:", error);
    return "I'm sorry, I encountered an error processing your request.";
  }
};

export default {
  getAIResponse,
  getResumeAnalysis,
};