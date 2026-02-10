const mongoose = require("mongoose");

const placementActivitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ["Drive", "Training", "Mock Interview", "Workshop", "Deadline"],
            required: true
        },
        description: {
            type: String,
            trim: true
        },
        date: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date
        },
        location: {
            type: String,
            default: "TBD"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        maxParticipants: {
            type: Number,
            default: null // null means unlimited
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

// Index for faster queries
placementActivitySchema.index({ date: 1, type: 1 });
placementActivitySchema.index({ isActive: 1 });

module.exports = mongoose.model("PlacementActivity", placementActivitySchema);
