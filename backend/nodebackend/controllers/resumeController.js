const {
  analyzeResumeForUser,
  getUserHistory,
} = require("../services/resumeAnalysisService");

const analyzeResume = async (req, res, next) => {
  try {
    const { jobRole, jobDescription, resumeText } = req.body;

    if (!jobRole || !resumeText) {
      res.status(400);
      throw new Error("jobRole and resumeText are required");
    }

    const analysis = await analyzeResumeForUser({
      userId: req.user._id,
      jobRole,
      jobDescription,
      resumeText,
    });

    res.json(analysis);
  } catch (err) {
    next(err);
  }
};

const getUserAnalyses = async (req, res, next) => {
  try {
    const analyses = await getUserHistory(req.user._id);
    res.json(analyses);
  } catch (err) {
    next(err);
  }
};

module.exports = { analyzeResume, getUserAnalyses };
