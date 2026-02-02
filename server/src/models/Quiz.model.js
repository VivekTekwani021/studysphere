const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"]
  }
});

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    topic: {
      type: String,
      required: true
    },

    // questions: [questionSchema],

    // answers: [String], // user answers (index-wise)
    correctAnswer: Number,
     answers: [Number],

    score: Number,
    accuracy: Number,

    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
