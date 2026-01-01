const mongoose = require("mongoose");

const subjectAttendanceSchema = new mongoose.Schema({
  subjectName: String,
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 },
  streak: { type: Number, default: 0 }
});

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // SCHOOL
    date: {
      type: Date
    },
    isPresent: {
      type: Boolean
    },
    schoolStreak: {
      type: Number,
      default: 0
    },

    // COLLEGE
    subjects: [subjectAttendanceSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
