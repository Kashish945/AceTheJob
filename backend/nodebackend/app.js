const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const { protect } = require("./middleware/authMiddleware");

app.get("/", (req, res) => {
  res.json({ message: "Resume Analyzer API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/cheating", require("./routes/cheatingRoutes"));

app.use(notFound);
app.use(errorHandler);
//app.use(protect);



module.exports = app;