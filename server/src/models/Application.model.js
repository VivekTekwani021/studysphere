const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        company: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: [
                "Applied",
                "Test Scheduled",
                "Test Completed",
                "Interview Scheduled",
                "Interview Completed",
                "Selected",
                "Rejected"
            ],
            default: "Applied"
        },
        appliedDate: {
            type: Date,
            default: Date.now
        },
        testResults: {
            score: String,
            feedback: String,
            date: Date
        },
        interviewRounds: [
            {
                round: {
                    type: Number,
                    required: true
                },
                type: {
                    type: String,
                    enum: ["Technical", "HR", "Managerial", "Group Discussion"],
                    default: "Technical"
                },
                date: Date,
                feedback: String,
                status: {
                    type: String,
                    enum: ["Scheduled", "Completed", "Cleared", "Rejected"],
                    default: "Scheduled"
                }
            }
        ],
        package: String,
        location: String,
        notes: String
    },
    { timestamps: true }
);

// Index for faster queries
applicationSchema.index({ student: 1, status: 1 });
applicationSchema.index({ company: 1 });

module.exports = mongoose.model("Application", applicationSchema);
