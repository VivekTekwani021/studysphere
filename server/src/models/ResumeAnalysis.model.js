const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
        },
        score: {
            type: Number,
            required: true,
        },
        atsScore: {
            type: Number,
        },
        summary: {
            type: String,
        },
        strengths: [
            {
                title: String,
                description: String,
                impact: String,
            }
        ],
        improvements: [
            {
                title: String,
                description: String,
                suggestion: String,
                priority: {
                    type: String,
                    enum: ['high', 'medium', 'low'],
                },
            }
        ],
        suggestedKeywords: [String],
        atsIssues: [String],
        actionPlan: [String],
        sectionAnalysis: {
            education: { score: Number, feedback: String },
            experience: { score: Number, feedback: String },
            skills: { score: Number, feedback: String },
            projects: { score: Number, feedback: String },
            formatting: { score: Number, feedback: String },
        },
        jobMatch: {
            jobDescription: String,
            matchScore: Number,
            matchedSkills: [String],
            missingSkills: [String],
            recommendations: [String],
        },
    },
    { timestamps: true }
);

// Index for user's analysis history
resumeAnalysisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
