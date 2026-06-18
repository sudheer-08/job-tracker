import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getResumeAnalysis = async (
  resumeText,
  jobDescription
) => {
  const prompt = `
You are an expert recruiter.

Analyze the following resume against the job description.

Return ONLY valid JSON in this exact format:

{
  "matchScore": 0,
  "missingSkills": [],
  "strengths": [],
  "improvementTips": []
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;

  return JSON.parse(content);
};