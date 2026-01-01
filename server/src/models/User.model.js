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
    token:String,
    educationLevel: {
      type: String,
      enum: ["school", "college"]
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
