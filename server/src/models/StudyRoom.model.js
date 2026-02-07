const mongoose = require("mongoose");

// Generate a unique 8-character meeting ID
const generateMeetingId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Generate a 6-digit password
const generatePassword = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const studyRoomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        meetingId: {
            type: String,
            unique: true,
            default: generateMeetingId,
        },
        password: {
            type: String,
            default: generatePassword,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        participants: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                role: {
                    type: String,
                    enum: ['host', 'co-host', 'participant'],
                    default: 'participant',
                },
                joinedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        maxParticipants: {
            type: Number,
            default: 10,
        },
        settings: {
            allowChat: { type: Boolean, default: true },
            allowWhiteboard: { type: Boolean, default: true },
            muteOnJoin: { type: Boolean, default: false },
        },
        messages: [
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                content: String,
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        closedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Index for faster lookups
studyRoomSchema.index({ meetingId: 1 });
studyRoomSchema.index({ isActive: 1, createdAt: -1 });

// Static method to find by meeting ID
studyRoomSchema.statics.findByMeetingId = function (meetingId) {
    return this.findOne({ meetingId: meetingId.toUpperCase(), isActive: true });
};

module.exports = mongoose.model("StudyRoom", studyRoomSchema);
