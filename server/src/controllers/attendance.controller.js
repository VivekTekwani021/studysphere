// const Attendance = require("../models/Attendance.model");
// const {
//   calculatePercentage,
//   calculateStatus
// } = require("../utils/calculateAttendance");


// const sameDate = (d1, d2) =>
//   new Date(d1).toDateString() === new Date(d2).toDateString();

// // ================= SCHOOL =================
// exports.markSchoolAttendance = async (req, res) => {
//   try {
//     const { isPresent, date } = req.body;
//     let userattend = await Attendance.findOne({ user: req.user._id });
//     const targetDate = new Date(date);
//     if (!userattend) {
//       userattend = await Attendance.create({
//         user: req.user._id,
//         totalClasses: 0,
//         attendedClasses: 0,
//         streak: 0,
//         presentDates: [],
//         absentDates: []
//       });

//     }
//     const presentIndex = userattend.presentDates.findIndex(d =>
//       sameDate(d, targetDate)
//     );

//     const absentIndex = userattend.absentDates.findIndex(d =>
//       sameDate(d, targetDate)
//     );

//     if (presentIndex !== -1) {
//       if (!isPresent) {
//         userattend.presentDates.splice(presentIndex, 1);
//         userattend.absentDates.push(targetDate);
//         userattend.attendedClasses -= 1;
//         userattend.streak = 0;
//       }
//     }

//     // ---------------- CASE 2: Already ABSENT ----------------
//     else if (absentIndex !== -1) {
//       if (isPresent) {
//         userattend.absentDates.splice(absentIndex, 1);
//         userattend.presentDates.push(targetDate);
//         userattend.attendedClasses += 1;
//         userattend.streak += 1;
//       }
//     }
//     else {

//       userattend.totalClasses += 1;

//       if (isPresent) {
//         userattend.presentDates.push(targetDate);
//         userattend.attendedClasses += 1;
//         userattend.streak += 1;
//       } else {
//         userattend.absentDates.push(targetDate);
//         userattend.streak = 0;
//       }
//     }
//     await userattend.save();

//     res.status(200).json({
//       message: "Attendance updated successfully",
//       attendance: userattend
//     });


//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// // ================= COLLEGE =================
// exports.markSubjectAttendance = async (req, res) => {
//   try {
//     const { subjectName, isPresent, date } = req.body;
//     const targetDate = new Date(date);

//     let attendance = await Attendance.findOne({ user: req.user._id });

//     if (!attendance) {
//       attendance = await Attendance.create({
//         user: req.user._id,
//         subjects: []
//       });
//     }

//     let subject = attendance.subjects.find(
//       (s) => s.subjectName === subjectName
//     );

//     if (!subject) {
//       subject = {
//         subjectName,
//         totalClasses: 0,
//         attendedClasses: 0,
//         streak: 0,
//         presentDates: [],
//         absentDates: []
//       };
//       attendance.subjects.push(subject);
//     }

//     // ensure arrays exist
//     subject.presentDates ||= [];
//     subject.absentDates ||= [];

//     const presentIndex = subject.presentDates.findIndex(d =>
//       sameDate(d, targetDate)
//     );

//     const absentIndex = subject.absentDates.findIndex(d =>
//       sameDate(d, targetDate)
//     );

//     // -------- CASE 1: already PRESENT --------
//     if (presentIndex !== -1) {
//       if (!isPresent) {
//         subject.presentDates.splice(presentIndex, 1);
//         subject.absentDates.push(targetDate);
//         subject.attendedClasses -= 1;
//         subject.streak = 0;
//       }
//     }

//     // -------- CASE 2: already ABSENT --------
//     else if (absentIndex !== -1) {
//       if (isPresent) {
//         subject.absentDates.splice(absentIndex, 1);
//         subject.presentDates.push(targetDate);
//         subject.attendedClasses += 1;
//         subject.streak += 1;
//       }
//     }

//     // -------- CASE 3: NEW DATE --------
//     else {
//       subject.totalClasses += 1;

//       if (isPresent) {
//         subject.presentDates.push(targetDate);
//         subject.attendedClasses += 1;
//         subject.streak += 1;
//       } else {
//         subject.absentDates.push(targetDate);
//         subject.streak = 0;
//       }
//     }

//     await attendance.save();

//     const percentage = calculatePercentage(
//       subject.attendedClasses,
//       subject.totalClasses
//     );

//     res.status(200).json({
//       success: true,
//       subject: subject.subjectName,
//       attendancePercentage: percentage,
//       status: calculateStatus(percentage),
//       streak: subject.streak
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // GET Attendance (Unified for both types)
// exports.getAttendance = async (req, res) => {
//   try {
//     const { educationLevel } = req.user;

//     // For now we return the raw document, frontend can parse what it needs
//     const attendance = await Attendance.findOne({ user: req.user._id });

//     if (!attendance) {
//       return res.status(200).json({
//         found: false,
//         streak: 0,
//         history: []
//       });
//     }

//     if (educationLevel === 'school') {
//       return res.status(200).json({
//         found: true,
//         type: 'school',
//         streak: attendance.streak,
//         presentDates: attendance.presentDates,
//         absentDates: attendance.absentDates,
//         totalClasses: attendance.totalClasses,
//         attendedClasses: attendance.attendedClasses
//       });
//     } else {
//       // College - return all subjects
//       return res.status(200).json({
//         found: true,
//         type: 'college',
//         subjects: attendance.subjects
//       });
//     }

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Attendance = require("../models/Attendance.model");
const { sameDate, isWeekend } = require("../utils/attendanceHelpers");
const {
  calculatePercentage,
  calculateStatus
} = require("../utils/calculateAttendance");

// ================= SCHOOL =================
exports.markSchoolAttendance = async (req, res) => {
  try {
    // Accept both 'isPresent' (boolean) and 'status' (string) formats
    let { isPresent, status, date } = req.body;

    // Convert status string to isPresent boolean if needed
    if (status !== undefined) {
      isPresent = status === 'Present';
    }

    // Use today's date if not provided
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    if (isWeekend(targetDate, "school")) {
      return res.status(400).json({ success: false, message: "No classes on Sunday" });
    }

    let attendance = await Attendance.findOne({ user: req.user._id });

    if (!attendance) {
      attendance = await Attendance.create({
        user: req.user._id,
        presentDates: [],
        absentDates: [],
        schoolStreak: 0
      });
    }

    const presentIndex = attendance.presentDates.findIndex(d =>
      sameDate(d, targetDate)
    );
    const absentIndex = attendance.absentDates.findIndex(d =>
      sameDate(d, targetDate)
    );

    if (presentIndex !== -1) {
      if (!isPresent) {
        attendance.presentDates.splice(presentIndex, 1);
        attendance.absentDates.push(targetDate);
        attendance.schoolStreak = 0;
      }
    } else if (absentIndex !== -1) {
      if (isPresent) {
        attendance.absentDates.splice(absentIndex, 1);
        attendance.presentDates.push(targetDate);
        attendance.schoolStreak = (attendance.schoolStreak || 0) + 1;
      }
    } else {
      if (isPresent) {
        attendance.presentDates.push(targetDate);
        attendance.schoolStreak = (attendance.schoolStreak || 0) + 1;
      } else {
        attendance.absentDates.push(targetDate);
        attendance.schoolStreak = 0;
      }
    }

    await attendance.save();

    const totalDays =
      attendance.presentDates.length + attendance.absentDates.length;

    const percentage = calculatePercentage(
      attendance.presentDates.length,
      totalDays
    );

    res.json({
      success: true,
      message: "Attendance updated",
      percentage,
      status: calculateStatus(percentage),
      streak: attendance.schoolStreak || 0
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= COLLEGE =================
exports.markSubjectAttendance = async (req, res) => {
  try {
    // Accept both 'isPresent' (boolean) and 'status' (string) formats
    let { subjectName, isPresent, status, date } = req.body;

    // Convert status string to isPresent boolean if needed
    if (status !== undefined) {
      isPresent = status === 'Present';
    }

    // Use today's date if not provided
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    if (isWeekend(targetDate, "college")) {
      return res.status(400).json({ success: false, message: "No classes on weekend" });
    }

    const attendance = await Attendance.findOne({ user: req.user._id });

    if (!attendance || attendance.subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subjects not set up"
      });
    }

    const subject = attendance.subjects.find(
      (s) => s.subjectName === subjectName
    );

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject"
      });
    }

    const presentIndex = subject.presentDates.findIndex(d =>
      sameDate(d, targetDate)
    );
    const absentIndex = subject.absentDates.findIndex(d =>
      sameDate(d, targetDate)
    );

    if (presentIndex !== -1) {
      if (!isPresent) {
        subject.presentDates.splice(presentIndex, 1);
        subject.absentDates.push(targetDate);
        subject.streak = 0;
      }
    } else if (absentIndex !== -1) {
      if (isPresent) {
        subject.absentDates.splice(absentIndex, 1);
        subject.presentDates.push(targetDate);
        subject.streak = (subject.streak || 0) + 1;
      }
    } else {
      if (isPresent) {
        subject.presentDates.push(targetDate);
        subject.streak = (subject.streak || 0) + 1;
      } else {
        subject.absentDates.push(targetDate);
        subject.streak = 0;
      }
    }

    await attendance.save();

    const totalDays =
      subject.presentDates.length + subject.absentDates.length;

    const percentage = calculatePercentage(
      subject.presentDates.length,
      totalDays
    );

    res.json({
      success: true,
      subject: subject.subjectName,
      percentage,
      status: calculateStatus(percentage),
      streak: subject.streak || 0
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ATTENDANCE =================
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ user: req.user._id });

    if (!attendance) {
      return res.status(200).json({
        success: true,
        found: false,
        data: [],
        subjects: []
      });
    }

    if (req.user.educationLevel === "School") {
      // Convert dates to history array format the frontend expects
      const history = [];

      // Add present dates
      attendance.presentDates.forEach(date => {
        history.push({
          _id: `present_${new Date(date).getTime()}`,
          date: date,
          status: 'Present'
        });
      });

      // Add absent dates
      attendance.absentDates.forEach(date => {
        history.push({
          _id: `absent_${new Date(date).getTime()}`,
          date: date,
          status: 'Absent'
        });
      });

      // Sort by date descending
      history.sort((a, b) => new Date(b.date) - new Date(a.date));

      return res.json({
        success: true,
        found: true,
        type: "school",
        data: history,
        totalDays: history.length,
        streak: attendance.schoolStreak || 0
      });
    }

    // COLLEGE - calculate percentages for each subject
    const subjects = attendance.subjects.map(s => {
      const total = s.presentDates.length + s.absentDates.length;
      const percentage = total > 0
        ? Math.round((s.presentDates.length / total) * 100)
        : 0;

      return {
        _id: s._id,
        subjectName: s.subjectName,
        present: s.presentDates.length,
        total: total,
        percentage: percentage,
        streak: s.streak || 0,
        presentDates: s.presentDates // Include for calendar view
      };
    });

    return res.json({
      success: true,
      found: true,
      type: "college",
      subjects: subjects
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
