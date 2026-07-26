const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobRole: { type: String, required: true },
    jobDescription: { type: String },
    resumeText: { type: String, required: true },

    atsScore: { type: Number },
    isATSFriendly: { type: Boolean },
    matchPercentage: { type: Number },

    missingKeywords: [String],

    swot: {
      strengths: [String],
      weaknesses: [String],
      opportunities: [String],
      threats: [String],
    },

    suggestions: [String],
    rawGeminiResponse: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
