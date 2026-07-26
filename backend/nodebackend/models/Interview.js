const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    questions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);