// controllers/cheatingController.js

const cheatingService = require("../services/cheatingService");
const CheatingReport = require("../models/CheatingReport");

const startCheatingSession = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const response = await cheatingService.startSession(
      req.user._id,
      interviewId
    );

    res.status(200).json({
      success: true,
      message: response.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const generateCheatingReport = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const report = await cheatingService.generateReport(
      req.user._id,
      interviewId
    );

    const savedReport = await CheatingReport.create({
      userId: req.user._id,
      interviewId,
      absenceEvents: report.absence_events || [],
      multipleFacesEvents: report.multiple_faces_events || [],
      prohibitedObjects: report.prohibited_objects || [],
      gazeAwayDetails: report.gaze_away_details || [],
      screenMonitoringEvents: report.screen_monitoring_events || [],
      emotionDistribution: report.emotion_distribution || {},
      primaryEmotion: report.primary_emotion || "Neutral",
      handGestures: report.hand_gestures || {},
      finalCheatingScore: report.final_cheating_score || 0,
      riskLevel: report.risk_level || "Low",
    });

    res.status(201).json({
      success: true,
      report: savedReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startCheatingSession,
  generateCheatingReport,
};