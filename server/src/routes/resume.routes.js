const express = require("express");
const router = express.Router();
const multer = require("multer");
const resumeController = require("../controllers/resume.controller");
const { protect } = require("../middleware/auth.middleware");

// Configure multer for memory storage (no disk writes)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"), false);
        }
    },
});

// All routes require authentication
router.use(protect);

// POST /api/resume/analyze - Upload and analyze resume
router.post("/analyze", upload.single("resume"), resumeController.analyzeResume);

// GET /api/resume/history - Get user's analysis history
router.get("/history", resumeController.getAnalysisHistory);

// GET /api/resume/:id - Get specific analysis
router.get("/:id", resumeController.getAnalysis);

module.exports = router;
