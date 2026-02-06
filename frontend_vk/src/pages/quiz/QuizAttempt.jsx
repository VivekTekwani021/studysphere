import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Clock, ArrowRight, ArrowLeft, CheckCircle2,
  Circle, Loader2, Flag, AlertCircle
} from "lucide-react";
import { quizApi } from "../../api/quizApi";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { clsx } from "clsx";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const optionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

const QuizAttempt = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [quizId, setQuizId] = useState(null);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const storedQuiz = localStorage.getItem("quizData");

    if (!storedQuiz) {
      navigate("/quiz");
      return;
    }

    try {
      const parsed = JSON.parse(storedQuiz);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid quiz data");
      }

      setQuizId(parsed.quizId);
      setQuestions(parsed.questions);
      setTopic(parsed.topic || "Quiz");
      setDifficulty(parsed.difficulty || "medium");
      setAnswers(new Array(parsed.questions.length).fill(null));
    } catch (err) {
      console.error("Quiz load failed:", err);
      navigate("/quiz");
    }
  }, [navigate]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions) {
    return (
      <div className={clsx(
        "min-h-screen flex items-center justify-center",
        isDark ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-indigo-50 via-white to-violet-50"
      )}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Brain className={clsx("w-16 h-16", isDark ? "text-indigo-400" : "text-indigo-500")} />
          </motion.div>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>Loading questions...</p>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = answers.filter(a => a !== null).length;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0) {
      toast.error(`You have ${unanswered} unanswered question(s)`);
      return;
    }

    try {
      setSubmitting(true);
      const result = await quizApi.submitQuiz(quizId, answers);
      localStorage.setItem("quizResult", JSON.stringify({ ...result, topic, difficulty, timeElapsed }));
      navigate("/quiz/result");
    } catch (error) {
      console.error("Quiz submission failed", error);
      toast.error("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700';
      case 'hard': return isDark ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700';
      default: return isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className={clsx(
      "min-h-screen p-4 md:p-8 transition-colors duration-200",
      isDark ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-indigo-50 via-white to-violet-50"
    )}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            "rounded-2xl p-4 md:p-6 shadow-lg border mb-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={clsx("p-2 rounded-xl", isDark ? "bg-indigo-900/30" : "bg-indigo-100")}>
                <Brain className={clsx("w-6 h-6", isDark ? "text-indigo-400" : "text-indigo-600")} />
              </div>
              <div>
                <h1 className={clsx("font-bold", isDark ? "text-white" : "text-slate-900")}>{topic}</h1>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor()}`}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={clsx("flex items-center gap-2", isDark ? "text-slate-400" : "text-slate-600")}>
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">{formatTime(timeElapsed)}</span>
              </div>
              <div className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                <span className="font-semibold text-indigo-500">{answeredCount}</span>/{questions.length} answered
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className={clsx("h-2 rounded-full overflow-hidden", isDark ? "bg-slate-700" : "bg-slate-100")}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question Navigation Dots */}
          <div className="flex flex-wrap gap-2 mt-4">
            {questions.map((_, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentIndex(idx)}
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                  idx === currentIndex
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : answers[idx] !== null
                      ? isDark ? 'bg-emerald-900/30 text-emerald-400 border-2 border-emerald-500/50' : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                      : isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                )}
              >
                {idx + 1}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={clsx(
              "rounded-2xl p-6 md:p-8 shadow-lg border",
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}
          >
            {/* Question Number */}
            <div className="flex items-center gap-2 mb-4">
              <span className={clsx(
                "text-sm font-medium px-3 py-1 rounded-full",
                isDark ? "text-indigo-400 bg-indigo-900/30" : "text-indigo-600 bg-indigo-50"
              )}>
                Question {currentIndex + 1} of {questions.length}
              </span>
              {answers[currentIndex] === null && (
                <span className={clsx(
                  "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                  isDark ? "text-amber-400 bg-amber-900/30" : "text-amber-600 bg-amber-50"
                )}>
                  <AlertCircle className="w-3 h-3" />
                  Not answered
                </span>
              )}
            </div>

            {/* Question Text */}
            <h2 className={clsx("text-xl md:text-2xl font-semibold mb-6 leading-relaxed", isDark ? "text-white" : "text-slate-900")}>
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {currentQuestion.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  variants={optionVariants}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelect(idx)}
                  className={clsx(
                    "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4",
                    answers[currentIndex] === idx
                      ? isDark ? 'border-indigo-500 bg-indigo-900/30' : 'border-indigo-500 bg-indigo-50'
                      : isDark ? 'border-slate-600 hover:border-slate-500 hover:bg-slate-700' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    answers[currentIndex] === idx
                      ? 'bg-indigo-500 text-white'
                      : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                  )}>
                    {answers[currentIndex] === idx ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    )}
                  </div>
                  <span className={clsx(
                    "text-base",
                    answers[currentIndex] === idx
                      ? isDark ? 'text-indigo-300 font-medium' : 'text-indigo-900 font-medium'
                      : isDark ? 'text-slate-300' : 'text-slate-700'
                  )}>
                    {option}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.02, x: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={clsx(
              "px-6 py-3 rounded-xl flex items-center gap-2 border disabled:opacity-40 disabled:cursor-not-allowed transition-all",
              isDark ? "text-slate-300 bg-slate-800 border-slate-700 hover:bg-slate-700" : "text-slate-600 bg-white border-slate-200 hover:bg-slate-50"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </motion.button>

          {currentIndex < questions.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="px-6 py-3 rounded-xl flex items-center gap-2 bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/30"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 rounded-xl flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="w-5 h-5" />
                  Submit Quiz
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={clsx(
          "absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse",
          isDark ? "bg-indigo-900/30 opacity-40" : "bg-indigo-200 opacity-20"
        )} />
        <div className={clsx(
          "absolute bottom-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse",
          isDark ? "bg-violet-900/30 opacity-40" : "bg-violet-200 opacity-20"
        )} style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default QuizAttempt;
