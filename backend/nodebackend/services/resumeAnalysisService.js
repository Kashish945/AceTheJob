const ResumeAnalysis = require("../models/ResumeAnalysis");
const { getGeminiModel } = require("../config/geminiClient");
const { calculateATSScore, isATSFriendly } = require("./atsScoringService");

const analyzeResumeForUser = async ({ userId, jobRole, jobDescription, resumeText }) => {
  const model = getGeminiModel();

  const prompt = `
You are an expert ATS (Applicant Tracking System) and resume reviewer.

Analyze the following resume for the job role: "${jobRole}".

GOALS:
1. Perform a SWOT analysis of the resume.
2. Evaluate whether the resume is ATS-friendly.
3. Estimate an ATS-style score (0–100) based on keyword match, structure, clarity.
4. Estimate a match percentage (0–100) between the resume and the job role/description.
5. Identify missing or weak keywords/skills important for this role.
6. Give clear, bullet-point suggestions to improve the resume.

Return your answer STRICTLY as valid JSON ONLY.
Do NOT write any explanation outside JSON.
Use this exact JSON shape:

{
  "ats_score": number,
  "is_ats_friendly": boolean,
  "match_percentage": number,
  "missing_keywords": string[],
  "swot": {
    "strengths": string[],
    "weaknesses": string[],
    "opportunities": string[],
    "threats": string[]
  },
  "suggestions": string[]
}

Resume:
"""${resumeText}"""

Job Description (may be empty):
"""${jobDescription || ""}"""
`;

  let geminiJson = null;
  let rawGeminiText = "";

  try {
    const result = await model.generateContent(prompt);
    rawGeminiText = result.response.text().trim();

    const cleaned = rawGeminiText
      .replace(/^```json/i, "")
      .replace(/```$/i, "")
      .trim();

    geminiJson = JSON.parse(cleaned);
  } catch (err) {
    console.error("Error calling Gemini or parsing JSON:", err.message);
  }

  
  const backupATS = calculateATSScore(resumeText, jobDescription);
  const finalAtsScore = geminiJson?.ats_score ?? backupATS;
  const finalIsATSFriendly =
    typeof geminiJson?.is_ats_friendly === "boolean"
      ? geminiJson.is_ats_friendly
      : isATSFriendly(finalAtsScore);
  const finalMatchPercentage = geminiJson?.match_percentage ?? finalAtsScore;

  const swot = {
    strengths: geminiJson?.swot?.strengths ?? [],
    weaknesses: geminiJson?.swot?.weaknesses ?? [],
    opportunities: geminiJson?.swot?.opportunities ?? [],
    threats: geminiJson?.swot?.threats ?? [],
  };

  const missingKeywords = geminiJson?.missing_keywords ?? [];
  const suggestions = geminiJson?.suggestions ?? [
    "Tailor your resume to the job description by adding relevant keywords.",
    "Use clear section headings like 'Experience', 'Skills', 'Projects', 'Education'.",
    "Keep formatting simple (no tables or heavy graphics) for better ATS parsing.",
  ];

  const analysis = await ResumeAnalysis.create({
    user: userId,
    jobRole,
    jobDescription,
    resumeText,
    atsScore: finalAtsScore,
    isATSFriendly: finalIsATSFriendly,
    matchPercentage: finalMatchPercentage,
    missingKeywords,
    swot,
    suggestions,
    rawGeminiResponse: rawGeminiText,
  });

  return analysis;
};

const getUserHistory = async (userId) => {
  return ResumeAnalysis.find({ user: userId }).sort({ createdAt: -1 });
};

module.exports = { analyzeResumeForUser, getUserHistory };
