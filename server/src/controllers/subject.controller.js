// const Attendance = require("../models/Attendance.model");

// exports.setupSubjects = async (req, res) => {
//   try {
//     const { subjects } = req.body;

//     if (!subjects || subjects.length === 0) {
//       return res.status(400).json({ message: "Subjects required" });
//     }

//     let attendance = await Attendance.findOne({ user: req.user._id });

//     if (!attendance) {
//       attendance = await Attendance.create({
//         user: req.user._id,
//         subjects: []
//       });
//     }

//     if (attendance.subjects.length > 0) {
//       return res.status(400).json({
//         message: "Subjects already set up"
//       });
//     }

//     attendance.subjects = subjects.map((name) => ({
//       subjectName: name,
//       presentDates: [],
//       absentDates: [],
//       streak: 0
//     }));

//     await attendance.save();

//     res.status(201).json({
//       message: "Subjects created successfully",
//       subjects: attendance.subjects
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Attendance = require("../models/Attendance.model");

/**
 * ===============================
 * 1️⃣ SETUP SUBJECTS (ONE TIME)
 * ===============================
 */
exports.setupSubjects = async (req, res) => {
  try {
    const { subjects } = req.body;

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({ message: "Subjects required" });
    }

    let attendance = await Attendance.findOne({ user: req.user._id });

    if (!attendance) {
      attendance = await Attendance.create({
        user: req.user._id,
        subjects: []
      });
    }

    // Prevent re-setup
    if (attendance.subjects.length > 0) {
      return res.status(400).json({
        message: "Subjects already set up"
      });
    }

    attendance.subjects = subjects.map((name) => ({
      subjectName: name.trim(),
      presentDates: [],
      absentDates: [],
      streak: 0
    }));

    await attendance.save();

    res.status(201).json({
      message: "Subjects created successfully",
      subjects: attendance.subjects
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * 2️⃣ ADD SUBJECT (AFTER SETUP)
 * ===============================
 */
exports.addSubject = async (req, res) => {
  try {
    const { subjectName } = req.body;

    if (!subjectName || !subjectName.trim()) {
      return res.status(400).json({ success: false, message: "Subject name is required" });
    }

    let attendance = await Attendance.findOne({ user: req.user._id });

    // ✅ CREATE IF NOT EXISTS
    if (!attendance) {
      attendance = await Attendance.create({
        user: req.user._id,
        subjects: []
      });
    }

    // Prevent duplicates
    const exists = attendance.subjects.find(
      (s) => s.subjectName.toLowerCase() === subjectName.trim().toLowerCase()
    );

    if (exists) {
      return res.status(400).json({ success: false, message: "Subject already exists" });
    }

    attendance.subjects.push({
      subjectName: subjectName.trim(),
      presentDates: [],
      absentDates: [],
      streak: 0
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: "Subject added successfully",
      subjects: attendance.subjects.map(s => ({
        subjectName: s.subjectName,
        present: s.presentDates.length,
        total: s.presentDates.length + s.absentDates.length,
        percentage: s.presentDates.length + s.absentDates.length > 0
          ? Math.round((s.presentDates.length / (s.presentDates.length + s.absentDates.length)) * 100)
          : 0,
        streak: s.streak
      }))
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * ===============================
 * 3️⃣ DELETE SUBJECT
 * ===============================
 */
exports.deleteSubject = async (req, res) => {
  try {
    const { subjectName } = req.params;

    const attendance = await Attendance.findOne({ user: req.user._id });

    if (!attendance || attendance.subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No subjects found"
      });
    }

    const index = attendance.subjects.findIndex(
      (s) => s.subjectName === subjectName
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    attendance.subjects.splice(index, 1);
    await attendance.save();

    res.json({
      success: true,
      message: "Subject deleted successfully",
      subjects: attendance.subjects
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
