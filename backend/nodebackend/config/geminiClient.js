const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiModel = () => {
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = { getGeminiModel };
