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
You are a Senior Technical Recruiter, ATS (Applicant Tracking System) specialist, and Career Coach.

Your task is to analyze the candidate's resume against the provided job description and calculate a realistic job-match score from 0 to 100.

IMPORTANT SCORING RULES:

1. Do NOT score based only on exact keyword matching.
2. Consider:
   - Required and preferred technical skills
   - Programming languages
   - Frameworks and libraries
   - Databases
   - Cloud and deployment experience
   - Projects
   - Internships and work experience
   - Education
   - Certifications
   - Problem-solving and engineering skills
   - Relevance and quality of projects
3. Give credit for transferable and equivalent technologies.
   For example:
   - Express.js demonstrates Node.js backend experience.
   - MySQL/PostgreSQL/MongoDB demonstrate database knowledge.
   - REST API experience is valuable even if a different backend framework was used.
   - Vercel, AWS, Azure, GCP, or similar platforms demonstrate cloud/deployment experience.
4. Do NOT give 0 points simply because a specific keyword is missing if the candidate has demonstrated an equivalent skill.
5. Do NOT penalize the candidate heavily for one or two missing technologies.
6. Do NOT invent skills or experience that are not present in the resume.
7. Projects should receive significant credit when they demonstrate real-world engineering ability, such as:
   - Full-stack applications
   - REST APIs
   - Authentication
   - Databases
   - Cloud deployment
   - AI/ML integration
   - Third-party APIs
   - Scalable architecture
8. A strong candidate with several relevant skills and projects should normally receive a score above 60.
9. Use the following score ranges:

90-100: Exceptional match; candidate strongly satisfies the role requirements.
80-89: Very strong match; candidate satisfies most important requirements.
70-79: Strong match; candidate is competitive with some gaps.
60-69: Good match; candidate has relevant skills but noticeable gaps.
50-59: Moderate match; candidate has some relevant skills but significant gaps.
40-49: Weak match; limited relevance.
0-39: Poor match; very little relevance to the position.

SCORING PRIORITY:

Give the highest importance to:
- Required technical skills
- Relevant practical experience
- Relevant projects
- Ability to demonstrate the technologies in practice

Give lower importance to:
- Exact keyword matching
- Minor preferred requirements
- Resume formatting

The final score should represent the candidate's realistic competitiveness for the job, NOT how closely the resume copies the job description.

For missingSkills:
- Include only important skills explicitly required by the job description that the candidate genuinely lacks.
- Do not list every missing keyword.
- Do not include a skill if the candidate has a reasonable equivalent or transferable skill.

For strengths:
- Identify the strongest aspects of the candidate's resume relative to the job.
- Mention relevant technologies, projects, experience, or achievements.

For improvementTips:
- Give specific and actionable recommendations.
- Focus on skills, projects, resume content, measurable achievements, and missing job requirements.
- Do not give generic advice such as "improve your resume."

For summary:
- Write a concise recruiter-style assessment explaining why the candidate received the score.
- Mention major strengths and the most important gaps.

IMPORTANT:
Return ONLY valid JSON.
Do not include markdown.
Do not include \`\`\`json.
Do not include explanations outside the JSON.

The JSON must have exactly this structure:

{
  "matchScore": number,
  "summary": "string",
  "strengths": ["string"],
  "missingSkills": ["string"],
  "improvementTips": ["string"]
}

matchScore must be an integer between 0 and 100.

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