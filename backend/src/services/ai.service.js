import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getResumeAnalysis = async (resumeText, jobDescription) => {
  const prompt = `
You are a Senior Technical Recruiter and Career Coach. 
Analyze the provided candidate resume against the job description.

INSTRUCTIONS:
1. Holistic Scoring: Do not just look for exact keyword matches. Evaluate if the candidate's actual projects and technical stack demonstrate the ability to perform the job requirements.
2. Skill Mapping: Treat modern alternatives as equivalents (e.g., PostgreSQL/Supabase is a valid substitute for MySQL; modern state management/APIs are equivalent to legacy frameworks).
3. Be an Advocate: Focus on the candidate's real-world impact (like building multi-tenant SaaS, AI integration, and CI/CD pipelines) over missing legacy keywords like 'Apache' or 'C#'.

Return ONLY valid JSON in this exact structure:
{
  "matchScore": number (0-100),
  "summary": "A 2-sentence assessment highlighting the candidate's actual architectural impact.",
  "strengths": ["List top 3-4 strengths based on the project experience in the resume"],
  "missingSkills": ["List only truly missing critical skills required for the role"],
  "improvementTips": ["Actionable advice on how to bridge the skill gap if necessary"]
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