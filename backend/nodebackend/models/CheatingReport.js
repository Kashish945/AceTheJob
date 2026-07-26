// models/CheatingReport.js

const mongoose = require("mongoose");

const cheatingReportSchema = new mongoose.Schema(
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
    absenceEvents: [
      {
        type: String,
      },
    ],
    multipleFacesEvents: [
      {
        type: String,
      },
    ],
    prohibitedObjects: [
      {
        type: String,
      },
    ],
    gazeAwayDetails: [
      {
        type: String,
      },
    ],
    screenMonitoringEvents: [
      {
        type: String,
      },
    ],
    emotionDistribution: {
      type: Object,
      default: {},
    },
    primaryEmotion: {
      type: String,
      default: "Neutral",
    },
    handGestures: {
      type: Object,
      default: {},
    },
    finalCheatingScore: {
      type: Number,
      default: 0,
    },
    riskLevel: {
      type: String,
      default: "Low",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CheatingReport", cheatingReportSchema);