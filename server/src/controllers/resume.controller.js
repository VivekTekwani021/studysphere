const pdfParse = require("pdf-parse");
const groqService = require("../services/groq.service");
const ResumeAnalysis = require("../models/ResumeAnalysis.model");

/**
 * Analyze a resume from PDF upload with optional job description matching
 * Saves analysis to database for history
 */
exports.analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Check file type
        if (req.file.mimetype !== "application/pdf") {
            return res.status(400).json({ success: false, message: "Only PDF files are allowed" });
        }

        // Extract text from PDF
        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({
                success: false,
                message: "Could not extract enough text from the PDF. Please upload a text-based PDF."
            });
        }

        // Get optional job description from request body
        const jobDescription = req.body.jobDescription || null;

        // Analyze with Groq AI
        const analysis = await groqService.analyzeResume(resumeText, jobDescription);

        // Save analysis to database
        const savedAnalysis = await ResumeAnalysis.create({
            user: req.user._id,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            score: analysis.score,
            atsScore: analysis.atsScore,
            summary: analysis.summary,
            strengths: analysis.strengths,
            improvements: analysis.improvements,
            suggestedKeywords: analysis.suggestedKeywords,
            atsIssues: analysis.atsIssues,
            actionPlan: analysis.actionPlan,
            sectionAnalysis: analysis.sectionAnalysis,
            jobMatch: jobDescription ? {
                jobDescription: jobDescription.substring(0, 1000), // Limit stored JD length
                ...analysis.jobMatch
            } : undefined,
        });

        res.status(200).json({
            success: true,
            data: analysis,
            analysisId: savedAnalysis._id,
        });
    } catch (error) {
        console.error("Resume Analysis Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to analyze resume"
        });
    }
};

/**
 * Get user's resume analysis history
 */
exports.getAnalysisHistory = async (req, res) => {
    try {
        const analyses = await ResumeAnalysis.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('fileName score atsScore createdAt');

        res.status(200).json({
            success: true,
            data: analyses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch analysis history"
        });
    }
};

/**
 * Get a specific analysis by ID
 */
exports.getAnalysis = async (req, res) => {
    try {
        const analysis = await ResumeAnalysis.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found"
            });
        }

        res.status(200).json({
            success: true,
            data: analysis,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch analysis"
        });
    }
};
