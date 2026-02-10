const express = require("express");
const router = express.Router();
const placementController = require("../controllers/placement.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/role.middleware");

// ============ APPLICATION ROUTES ============

// Student routes
router.post("/applications", protect, placementController.createApplication);
router.get("/applications/my", protect, placementController.getMyApplications);
router.put("/applications/:id", protect, placementController.updateApplication);
router.delete("/applications/:id", protect, placementController.deleteApplication);
router.post("/applications/:id/interview", protect, placementController.addInterviewRound);

// Admin routes
router.get("/applications/admin/all", protect, isAdmin, placementController.getAllApplications);
router.get("/applications/admin/selected", protect, isAdmin, placementController.getSelectedStudents);

// ============ ACTIVITY ROUTES ============

// Public routes (all authenticated users)
router.get("/activities", protect, placementController.getAllActivities);
router.post("/activities/:id/register", protect, placementController.registerForActivity);
router.post("/activities/:id/unregister", protect, placementController.unregisterFromActivity);

// Admin routes
router.post("/activities", protect, isAdmin, placementController.createActivity);
router.put("/activities/:id", protect, isAdmin, placementController.updateActivity);
router.delete("/activities/:id", protect, isAdmin, placementController.deleteActivity);

module.exports = router;
