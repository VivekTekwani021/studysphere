const express = require("express");
const router = express.Router();

const {
  markSchoolAttendance,
  markSubjectAttendance
} = require("../controllers/attendance.controller");

const { protect } = require("../middleware/auth.middleware");
const {
  schoolOnly,
  collegeOnly
} = require("../middleware/role.middleware");
const { onboardingRequired } = require("../middleware/onboarding.middleware");

// SCHOOL
router.post(
  "/school",
  protect,
  onboardingRequired,
  schoolOnly,
  markSchoolAttendance
);

// COLLEGE
router.post(
  "/college",
  protect,
  onboardingRequired,
  collegeOnly,
  markSubjectAttendance
);

module.exports = router;
