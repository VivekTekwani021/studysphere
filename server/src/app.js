const express = require("express");
const cors = require("cors");
const onboardingRoutes = require("./routes/onboarding.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const learningRoutes = require("./routes/learning.routes");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());

app.use(express.json());

require("./cron/roadmap.cron");
app.use("/api/auth", authRoutes);

app.use("/api/onboarding", onboardingRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/quiz", require("./routes/quiz.routes"));
app.use("/api/pdf", require("./routes/pdf.routes"));
app.use("/api/habit", require("./routes/habit.routes"));
app.use("/api/placement", require("./routes/placement.routes"));
app.use("/api/resume", require("./routes/resume.routes"));
app.use("/api/rooms", require("./routes/studyRoom.routes"));
app.use("/api/roadmap", require("./routes/roadmap.routes"));
//app.use("/api/roadmap", require("./routes/roadmap.routes"));





app.get("/", (req, res) => {
  res.send("Student Tracker Backend Running 🚀");
});

module.exports = app;



