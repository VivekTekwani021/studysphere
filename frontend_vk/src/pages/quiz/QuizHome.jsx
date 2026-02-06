import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Sparkles, Target, Trophy, Clock, Zap,
  CircleHelp, ArrowRight, Loader2, CheckCircle2
} from "lucide-react";
import { quizApi } from "../../api/quizApi";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { clsx } from "clsx";

const features = [
  { icon: Brain, title: "AI-Generated", desc: "Smart questions tailored to your topic" },
  { icon: Clock, title: "10 Questions", desc: "Complete quiz in under 10 minutes" },
  { icon: Trophy, title: "Track Mastery", desc: "Know your Strong & Weak areas" },
];

const difficulties = [
  { id: "easy", label: "Easy", desc: "Basic concepts, fundamentals", color: "emerald", icon: "🌱" },
  { id: "medium", label: "Medium", desc: "Intermediate level, applications", color: "amber", icon: "⚡" },
  { id: "hard", label: "Hard", desc: "Advanced, interview-level", color: "rose", icon: "🔥" },
];

const suggestedTopics = [
  "Binary Search", "React Hooks", "SQL Joins", "OOPs",
  "Recursion", "Dynamic Programming", "REST API", "System Design"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

const QuizHome = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleStartQuiz = async () => {
    if (!topic.trim()) {
      return toast.error("Please enter a topic");
    }

    try {
      setLoading(true);
      const data = await quizApi.generateQuiz(topic, difficulty);
      localStorage.setItem("quizData", JSON.stringify({ ...data, topic, difficulty }));
      navigate("/quiz/attempt");
    } catch (err) {
      toast.error("Failed to generate quiz. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) handleStartQuiz();
  };

  return (
    <div className={clsx(
      "min-h-screen p-6 md:p-10 transition-colors duration-200",
      isDark
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        : "bg-gradient-to-br from-indigo-50 via-white to-violet-50"
    )}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/30"
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <span className={clsx(
              "text-sm font-medium px-3 py-1 rounded-full",
              isDark ? "text-indigo-400 bg-indigo-900/30" : "text-indigo-600 bg-indigo-50"
            )}>
              Knowledge Check
            </span>
          </div>

          <h1 className={clsx("text-3xl md:text-4xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>
            Quiz Challenge
          </h1>
          <p className={clsx("max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
            Test your knowledge with AI-generated quizzes. Get 10 MCQs based on your topic and
            difficulty level, then see how you score!
          </p>
        </motion.div>

        {/* Features Row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4, scale: 1.02 }}
              className={clsx(
                "rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow flex items-start gap-3",
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-indigo-100"
              )}
            >
              <div className={clsx("p-2 rounded-lg", isDark ? "bg-indigo-900/30" : "bg-indigo-100")}>
                <feature.icon className={clsx("w-5 h-5", isDark ? "text-indigo-400" : "text-indigo-600")} />
              </div>
              <div>
                <h3 className={clsx("font-semibold text-sm", isDark ? "text-white" : "text-slate-900")}>{feature.title}</h3>
                <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className={clsx(
            "rounded-2xl p-6 md:p-8 border shadow-lg",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}
        >
          {/* Topic Input */}
          <div className="mb-6">
            <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
              Quiz Topic <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CircleHelp className={clsx("absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5", isDark ? "text-slate-500" : "text-slate-400")} />
              <input
                type="text"
                placeholder="Enter topic (e.g., Binary Search, React Hooks...)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                className={clsx(
                  "w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all",
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                )}
              />
            </div>
          </div>

          {/* Quick Topic Suggestions */}
          <div className="mb-6">
            <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
              Quick Picks
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((t, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTopic(t)}
                  className={clsx(
                    "px-3 py-1.5 text-sm rounded-full border transition-all",
                    topic === t
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : isDark
                        ? 'bg-slate-700 text-slate-300 border-slate-600 hover:border-indigo-400 hover:text-indigo-400'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  )}
                >
                  {t}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <label className={clsx("block text-sm font-medium mb-3", isDark ? "text-slate-300" : "text-slate-700")}>
              Difficulty Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {difficulties.map((diff) => (
                <motion.button
                  key={diff.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDifficulty(diff.id)}
                  className={clsx(
                    "relative p-4 rounded-xl border-2 transition-all text-left",
                    difficulty === diff.id
                      ? diff.color === 'emerald'
                        ? isDark ? 'border-emerald-500 bg-emerald-900/30' : 'border-emerald-500 bg-emerald-50'
                        : diff.color === 'amber'
                          ? isDark ? 'border-amber-500 bg-amber-900/30' : 'border-amber-500 bg-amber-50'
                          : isDark ? 'border-rose-500 bg-rose-900/30' : 'border-rose-500 bg-rose-50'
                      : isDark ? 'border-slate-600 bg-slate-700 hover:border-slate-500' : 'border-slate-200 bg-white hover:border-slate-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{diff.icon}</span>
                    <div>
                      <h4 className={clsx("font-semibold", isDark ? "text-white" : "text-slate-900")}>{diff.label}</h4>
                      <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{diff.desc}</p>
                    </div>
                  </div>
                  {difficulty === diff.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      <CheckCircle2 className={`w-5 h-5 ${diff.color === 'emerald' ? 'text-emerald-500' :
                        diff.color === 'amber' ? 'text-amber-500' : 'text-rose-500'
                        }`} />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartQuiz}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                  Generating Quiz...
                </motion.div>
              ) : (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Start Quiz
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          variants={itemVariants}
          className="mt-8 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">How it works</h3>
              <p className="text-indigo-100 text-sm">
                Our AI generates 10 unique MCQ questions based on your topic and difficulty.
                After completing the quiz, you'll see your score, accuracy, and mastery status
                (Strong, Average, or Weak). Wrong answers include detailed explanations!
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={clsx(
          "absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse",
          isDark ? "bg-indigo-900/30 opacity-50" : "bg-indigo-200 opacity-30"
        )} />
        <div className={clsx(
          "absolute bottom-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse",
          isDark ? "bg-violet-900/30 opacity-50" : "bg-violet-200 opacity-30"
        )} style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default QuizHome;
