const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true
    },

    password: {
      type: String,
      select: false
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true
    },

    avatar: String,

    token: String,

    educationLevel: {
      type: String,
      enum: ["School", "College"]
    },

    course: {
      type: String,
      enum: ["btech", "other"],
      default: "other"
    },

    stream: String,

    isPlacementEnabled: {
      type: Boolean,
      default: false
    },

    isOnboardingComplete: {
      type: Boolean,
      default: false
    },

    learningHistory: [
      {
        topicName: {
          type: String,
          required: true
        },

        quizScore: {
          type: Number,
          default: 0
        },

        masteryStatus: {
          type: String,
          enum: ["Strong", "Average", "Weak"],
          default: "Average"
        },

        completedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    weakTopics: [
      {
        type: String
      }
    ],

    totalStudyTime: {
      type: Number,
      default: 0 // in minutes
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
