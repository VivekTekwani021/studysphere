import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Target, Clock, Brain, CheckCircle2, XCircle,
  ArrowRight, RefreshCw, Lightbulb, TrendingUp, Award
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { clsx } from "clsx";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
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

const QuizResult = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const storedResult = localStorage.getItem("quizResult");

    if (!storedResult) {
      navigate("/quiz");
      return;
    }

    const parsed = JSON.parse(storedResult);
    setResult(parsed);

    // Show confetti for good scores
    if (parsed.accuracy >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [navigate]);

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMasteryInfo = (status) => {
    switch (status) {
      case 'Strong':
        return {
          color: 'emerald',
          icon: Trophy,
          message: "Excellent! You've mastered this topic!",
          gradient: 'from-emerald-500 to-teal-500'
        };
      case 'Average':
        return {
          color: 'amber',
          icon: TrendingUp,
          message: "Good job! Keep practicing to improve.",
          gradient: 'from-amber-500 to-orange-500'
        };
      default:
        return {
          color: 'rose',
          icon: Target,
          message: "Needs work. Review this topic and try again!",
          gradient: 'from-rose-500 to-pink-500'
        };
    }
  };

  const handleNewQuiz = () => {
    localStorage.removeItem("quizData");
    localStorage.removeItem("quizResult");
    navigate("/quiz");
  };

  if (!result) {
    return (
      <div className={clsx(
        "min-h-screen flex items-center justify-center",
        isDark ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-indigo-50 via-white to-violet-50"
      )}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Brain className={clsx("w-12 h-12", isDark ? "text-indigo-400" : "text-indigo-500")} />
        </motion.div>
      </div>
    );
  }

  const masteryInfo = getMasteryInfo(result.masteryStatus);
  const MasteryIcon = masteryInfo.icon;

  return (
    <div className={clsx(
      "min-h-screen p-6 md:p-10 transition-colors duration-200",
      isDark ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-indigo-50 via-white to-violet-50"
    )}>
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  y: -20,
                  x: Math.random() * window.innerWidth,
                  rotate: 0,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  ease: "linear"
                }}
                className={`absolute w-3 h-3 rounded-sm ${['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][Math.floor(Math.random() * 5)]
                  }`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header Card */}
        <motion.div
          variants={itemVariants}
          className={`bg-gradient-to-r ${masteryInfo.gradient} rounded-3xl p-8 text-white mb-8 relative overflow-hidden`}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
              >
                <MasteryIcon className="w-8 h-8" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold">Quiz Complete!</h1>
                <p className="text-white/80">{result.topic}</p>
              </div>
            </div>
            <p className="text-lg text-white/90">{masteryInfo.message}</p>
          </div>

          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ y: -4 }}
            className={clsx("rounded-2xl p-5 border shadow-sm", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={clsx("p-2 rounded-lg", isDark ? "bg-indigo-900/30" : "bg-indigo-100")}>
                <Award className={clsx("w-5 h-5", isDark ? "text-indigo-400" : "text-indigo-600")} />
              </div>
            </div>
            <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{result.score}</p>
            <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Score</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className={clsx("rounded-2xl p-5 border shadow-sm", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={clsx("p-2 rounded-lg", isDark ? "bg-emerald-900/30" : "bg-emerald-100")}>
                <Target className={clsx("w-5 h-5", isDark ? "text-emerald-400" : "text-emerald-600")} />
              </div>
            </div>
            <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{result.accuracy}%</p>
            <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Accuracy</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className={clsx("rounded-2xl p-5 border shadow-sm", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={clsx("p-2 rounded-lg", isDark ? "bg-amber-900/30" : "bg-amber-100")}>
                <Clock className={clsx("w-5 h-5", isDark ? "text-amber-400" : "text-amber-600")} />
              </div>
            </div>
            <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{formatTime(result.timeElapsed)}</p>
            <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Time Taken</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className={clsx(
              "rounded-2xl p-5 border-2 shadow-sm",
              result.masteryStatus === 'Strong'
                ? isDark ? 'bg-slate-800 border-emerald-500/50' : 'bg-white border-emerald-300'
                : result.masteryStatus === 'Average'
                  ? isDark ? 'bg-slate-800 border-amber-500/50' : 'bg-white border-amber-300'
                  : isDark ? 'bg-slate-800 border-rose-500/50' : 'bg-white border-rose-300'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={clsx("p-2 rounded-lg",
                result.masteryStatus === 'Strong' ? isDark ? 'bg-emerald-900/30' : 'bg-emerald-100' :
                  result.masteryStatus === 'Average' ? isDark ? 'bg-amber-900/30' : 'bg-amber-100' :
                    isDark ? 'bg-rose-900/30' : 'bg-rose-100'
              )}>
                <Trophy className={clsx("w-5 h-5",
                  result.masteryStatus === 'Strong' ? isDark ? 'text-emerald-400' : 'text-emerald-600' :
                    result.masteryStatus === 'Average' ? isDark ? 'text-amber-400' : 'text-amber-600' :
                      isDark ? 'text-rose-400' : 'text-rose-600'
                )} />
              </div>
            </div>
            <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{result.masteryStatus}</p>
            <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Mastery</p>
          </motion.div>
        </motion.div>

        {/* Wrong Answers Review */}
        {result.wrongAnswers?.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-rose-500" />
              <h2 className={clsx("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                Review Your Mistakes ({result.wrongAnswers.length})
              </h2>
            </div>

            <div className="space-y-4">
              {result.wrongAnswers.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className={clsx("rounded-2xl p-6 border shadow-sm", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}
                >
                  <p className={clsx("font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
                    {idx + 1}. {item.question}
                  </p>

                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div className={clsx("flex items-start gap-2 p-3 rounded-xl border", isDark ? "bg-rose-900/20 border-rose-500/30" : "bg-rose-50 border-rose-200")}>
                      <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className={clsx("text-xs font-medium mb-1", isDark ? "text-rose-400" : "text-rose-600")}>Your Answer</p>
                        <p className={clsx("text-sm", isDark ? "text-rose-300" : "text-rose-800")}>{item.options?.[item.yourAnswer] || `Option ${item.yourAnswer + 1}`}</p>
                      </div>
                    </div>
                    <div className={clsx("flex items-start gap-2 p-3 rounded-xl border", isDark ? "bg-emerald-900/20 border-emerald-500/30" : "bg-emerald-50 border-emerald-200")}>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className={clsx("text-xs font-medium mb-1", isDark ? "text-emerald-400" : "text-emerald-600")}>Correct Answer</p>
                        <p className={clsx("text-sm", isDark ? "text-emerald-300" : "text-emerald-800")}>{item.options?.[item.correctAnswer] || `Option ${item.correctAnswer + 1}`}</p>
                      </div>
                    </div>
                  </div>

                  {item.explanation && (
                    <div className={clsx("flex items-start gap-2 p-3 rounded-xl border", isDark ? "bg-indigo-900/20 border-indigo-500/30" : "bg-indigo-50 border-indigo-200")}>
                      <Lightbulb className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className={clsx("text-xs font-medium mb-1", isDark ? "text-indigo-400" : "text-indigo-600")}>Explanation</p>
                        <p className={clsx("text-sm", isDark ? "text-indigo-300" : "text-indigo-800")}>{item.explanation}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Correct Message */}
        {(!result.wrongAnswers || result.wrongAnswers.length === 0) && (
          <motion.div
            variants={itemVariants}
            className={clsx("rounded-2xl p-6 mb-8 text-center border", isDark ? "bg-emerald-900/20 border-emerald-500/30" : "bg-emerald-50 border-emerald-200")}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className={clsx("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4", isDark ? "bg-emerald-900/30" : "bg-emerald-100")}
            >
              <CheckCircle2 className={clsx("w-8 h-8", isDark ? "text-emerald-400" : "text-emerald-600")} />
            </motion.div>
            <h3 className={clsx("text-xl font-bold mb-2", isDark ? "text-emerald-400" : "text-emerald-800")}>Perfect Score!</h3>
            <p className={isDark ? "text-emerald-300" : "text-emerald-600"}>You answered all questions correctly. Amazing work!</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewQuiz}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Start New Quiz
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            className={clsx(
              "px-8 py-4 font-semibold rounded-xl border shadow-sm transition-all flex items-center justify-center gap-2",
              isDark ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            )}
          >
            Back to Dashboard
            <ArrowRight className="w-5 h-5" />
          </motion.button>
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

export default QuizResult;
