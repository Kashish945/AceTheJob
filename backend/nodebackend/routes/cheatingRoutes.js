// routes/cheatingRoutes.js

const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  startCheatingSession,
  generateCheatingReport,
} = require("../controllers/cheatingController");

router.post("/start-session", protect, startCheatingSession);
router.post("/generate-report", protect, generateCheatingReport);

module.exports = router;