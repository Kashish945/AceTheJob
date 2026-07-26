const axios = require("axios");

const generateQuestions = async (jobRole, jobDescription, experience) => {
  try {
    const response = await axios.post("http://localhost:8000/generate-questions", {
      jobRole,
      jobDescription,
      experience,
    });

    return response.data;
  } catch (error) {
    console.error("Gemma Question Generation Error:", error.message);
    throw new Error("Failed to generate interview questions");
  }
};

const generateFeedback = async (question, userAnswer, jobRole) => {
  try {
    const response = await axios.post("http://localhost:8000/generate-feedback", {
      question,
      userAnswer,
      jobRole,
    });

    return response.data;
  } catch (error) {
    console.error("Gemma Feedback Error:", error.message);
    throw new Error("Failed to generate interview feedback");
  }
};

module.exports = {
  generateQuestions,
  generateFeedback,
};