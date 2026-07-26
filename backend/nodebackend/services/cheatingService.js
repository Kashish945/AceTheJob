// services/cheatingService.js

const axios = require("axios");

const CHEATING_API = "http://localhost:9000";

const startSession = async (userId, interviewId) => {
  try {
    const response = await axios.post(`${CHEATING_API}/start-session`, {
      userId,
      interviewId,
    });

    return response.data;
  } catch (error) {
    console.error("Start cheating session error:", error.message);
    throw new Error("Failed to start cheating detection session");
  }
};

const generateReport = async (userId, interviewId) => {
  try {
    const response = await axios.post(`${CHEATING_API}/generate-report`, {
      userId,
      interviewId,
    });

    return response.data.report;
  } catch (error) {
    console.error("Generate cheating report error:", error.message);
    throw new Error("Failed to generate cheating report");
  }
};

module.exports = {
  startSession,
  generateReport,
};