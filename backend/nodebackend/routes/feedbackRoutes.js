const express = require("express");
const router = express.Router();
const {
  generateInterviewFeedback,
  getUserFeedback,
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate-feedback", protect, generateInterviewFeedback);
router.get("/history", protect, getUserFeedback);

module.exports = router;