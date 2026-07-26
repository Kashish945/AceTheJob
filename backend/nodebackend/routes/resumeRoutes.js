const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  analyzeResume,
  getUserAnalyses,
} = require("../controllers/resumeController");

router.post("/analyze", protect, analyzeResume);
router.get("/history", protect, getUserAnalyses);

module.exports = router;
