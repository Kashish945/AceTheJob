const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    userAnswer: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    improvements: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);