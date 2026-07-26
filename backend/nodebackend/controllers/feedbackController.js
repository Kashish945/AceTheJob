const gemmaService = require("../services/gemmaService");
const Feedback = require("../models/Feedback");

const generateInterviewFeedback = async (req, res) => {
  try {
    const { interviewId, question, userAnswer, jobRole } = req.body;

    const response = await gemmaService.generateFeedback(
      question,
      userAnswer,
      jobRole
    );

    let feedbackData = response.feedback;

    if (typeof feedbackData === "string") {
      try {
        feedbackData = JSON.parse(feedbackData);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid feedback format returned by model",
        });
      }
    }

    const feedback = await Feedback.create({
      userId: req.user.id,
      interviewId,
      question,
      userAnswer,
      correctAnswer: feedbackData.correctAnswer,
      score: feedbackData.score,
      improvements: feedbackData.improvements,
    });

    res.status(201).json({
      success: true,
      message: "Feedback generated successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user.id })
      .populate("interviewId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { generateInterviewFeedback, getUserFeedback };