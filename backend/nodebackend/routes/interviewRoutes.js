const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createInterview,
  getUserInterviews,
} = require("../controllers/interviewController");

router.post("/generate-questions", protect, createInterview);
router.get("/history", protect, getUserInterviews);

module.exports = router;