// const express = require("express");
// const router = express.Router();
// const ctrl = require("../controllers/roadmap.controller");
// const protect = require("../middleware/auth"); // your auth middleware

// router.post("/generate", protect, ctrl.generateRoadmap);
// router.get("/today", protect, ctrl.getTodayTasks);
// router.post("/complete", protect, ctrl.completeTask);

// module.exports = router;
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/roadmap.controller");

// ✅ correct import
const { protect } = require("../middleware/auth.middleware");

router.post("/generate", protect, ctrl.generateRoadmap);
router.get("/active", protect, ctrl.getActiveRoadmap);  // Full roadmap
router.get("/today", protect, ctrl.getTodayTasks);
router.post("/complete", protect, ctrl.completeTask);

module.exports = router;

