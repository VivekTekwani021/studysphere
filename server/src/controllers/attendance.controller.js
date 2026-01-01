const Attendance = require("../models/Attendance.model");
const {
  calculatePercentage,
  calculateStatus
} = require("../utils/calculateAttendance");


// ================= SCHOOL =================
exports.markSchoolAttendance = async (req, res) => {
  try {
    const today = new Date().toDateString();

    let record = await Attendance.findOne({
      user: req.user._id,
      date: today
    });

    if (record) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    const lastRecord = await Attendance.findOne({
      user: req.user._id,
      isPresent: true
    }).sort({ date: -1 });

    let streak = 0;
    if (req.body.isPresent && lastRecord) {
      const diff =
        (new Date(today) - new Date(lastRecord.date)) /
        (1000 * 60 * 60 * 24);

      streak = diff === 1 ? lastRecord.schoolStreak + 1 : 1;
    }

    record = await Attendance.create({
      user: req.user._id,
      date: today,
      isPresent: req.body.isPresent,
      schoolStreak: req.body.isPresent ? streak : 0
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked",
      streak: record.schoolStreak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= COLLEGE =================
exports.markSubjectAttendance = async (req, res) => {
  try {
    const { subjectName, isPresent } = req.body;

    let attendance = await Attendance.findOne({ user: req.user._id });

    if (!attendance) {
      attendance = await Attendance.create({
        user: req.user._id,
        subjects: []
      });
    }

    let subject = attendance.subjects.find(
      (s) => s.subjectName === subjectName
    );

    if (!subject) {
      subject = {
        subjectName,
        totalClasses: 0,
        attendedClasses: 0,
        streak: 0
      };
      attendance.subjects.push(subject);
    }

    subject.totalClasses += 1;

    if (isPresent) {
      subject.attendedClasses += 1;
      subject.streak += 1;
    } else {
      subject.streak = 0;
    }

    await attendance.save();

    const percentage = calculatePercentage(
      subject.attendedClasses,
      subject.totalClasses
    );

    res.status(200).json({
      success: true,
      subject: subject.subjectName,
      attendancePercentage: percentage,
      status: calculateStatus(percentage),
      streak: subject.streak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
