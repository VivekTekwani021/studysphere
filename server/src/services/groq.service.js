const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Analyze a resume using Groq AI with detailed feedback
 * @param {string} resumeText - The extracted text from a resume PDF
 * @param {string} jobDescription - Optional job description for matching
 * @returns {Promise<Object>} - AI analysis with detailed insights
 */
exports.analyzeResume = async (resumeText, jobDescription = null) => {
    const systemPrompt = `You are an expert career counselor and ATS (Applicant Tracking System) specialist with 15+ years of experience reviewing resumes for top tech companies. Provide a comprehensive analysis.

${jobDescription ? `
IMPORTANT: A job description has been provided. Analyze how well the resume matches this specific role.
` : ''}

Analyze the resume and respond ONLY in valid JSON format with this structure:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence executive summary of the resume quality>",
  
  "strengths": [
    {
      "title": "<strength category>",
      "description": "<detailed explanation of why this is a strength>",
      "impact": "<how this helps in job applications>"
    }
  ],
  
  "improvements": [
    {
      "title": "<area to improve>",
      "description": "<what's wrong or missing>",
      "suggestion": "<specific actionable advice to fix this>",
      "priority": "<high/medium/low>"
    }
  ],
  
  "suggestedKeywords": [
    "<keyword 1>",
    "<keyword 2>",
    "<keyword 3>"
  ],
  
  "atsScore": <number 0-100 - how well optimized for ATS systems>,
  "atsIssues": ["<issue 1>", "<issue 2>"],
  
  "sectionAnalysis": {
    "education": { "score": <0-100>, "feedback": "<brief feedback>" },
    "experience": { "score": <0-100>, "feedback": "<brief feedback>" },
    "skills": { "score": <0-100>, "feedback": "<brief feedback>" },
    "projects": { "score": <0-100>, "feedback": "<brief feedback>" },
    "formatting": { "score": <0-100>, "feedback": "<brief feedback>" }
  },
  
  "actionPlan": [
    "<Step 1: Most important action to take>",
    "<Step 2: Second priority>",
    "<Step 3: Third priority>"
  ]
  
  ${jobDescription ? `,
  "jobMatch": {
    "matchScore": <0-100 - how well resume matches the job>,
    "matchedSkills": ["<skill that matches>"],
    "missingSkills": ["<required skill not on resume>"],
    "recommendations": ["<specific advice to better match this role>"]
  }` : ''}
}

IMPORTANT GUIDELINES:
- Be specific and actionable in all feedback
- Suggest 5-8 relevant keywords for the industry/role
- For improvements, always provide the "suggestion" field with concrete steps
- Prioritize improvements by impact on job search success
- Consider modern ATS systems when analyzing formatting
- For college students, focus on projects, internships, and transferable skills`;

    const userMessage = jobDescription
        ? `Analyze this resume against the job description:\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`
        : `Analyze this resume:\n\n${resumeText}`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 2048,
            response_format: { type: "json_object" },
        });

        const responseText = completion.choices[0]?.message?.content;
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Groq API Error:", error.message);
        throw new Error("Failed to analyze resume with AI");
    }
};
