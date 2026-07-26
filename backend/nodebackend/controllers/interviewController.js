const gemmaService = require("../services/gemmaService");
const Interview = require("../models/Interview");

const authMiddleware = require("../middleware/authMiddleware");

const createInterview = async (req, res) => {
  try {
    const { jobRole, jobDescription, experience } = req.body;

    const response = await gemmaService.generateQuestions(
      jobRole,
      jobDescription,
      experience
    );

    let questions = response.questions;

    if (typeof questions === "string") {
      try {
        questions = JSON.parse(questions);
      } catch (error) {
        questions = [questions];
      }
    }

    const interview = await Interview.create({
      userId: req.user.id,
      jobRole,
      experience,
      jobDescription,
      questions,
    });

    res.status(201).json({
      success: true,
      message: "Interview questions generated successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createInterview, getUserInterviews };