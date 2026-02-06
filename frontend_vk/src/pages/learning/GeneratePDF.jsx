import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Wifi, Share2, Clock, ArrowLeft, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { pdfApi } from '../../api/pdf.api';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

const features = [
  { icon: Wifi, title: "Offline Access", desc: "Study anywhere without internet connection" },
  { icon: Clock, title: "Quick Revision", desc: "Condensed notes for fast review sessions" },
  { icon: Share2, title: "Easy Sharing", desc: "Share PDF notes with classmates easily" },
];

const topics = [
  "Data Structures", "Algorithms", "Machine Learning", "React Hooks",
  "Python Basics", "SQL Queries", "System Design", "OOPs Concepts"
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

const GeneratePDF = () => {
  const [topic, setTopic] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const generatePDF = async () => {
    if (!topic) return toast.error('Please enter a topic');

    setLoading(true);
    setDownloaded(false);
    try {
      const blob = await pdfApi.downloadNotes(topic, prompt);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic}_notes.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
      setDownloaded(true);
      toast.success('PDF generated and downloaded!');

      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') generatePDF();
  };

  return (
    <div className={clsx(
      "min-h-screen p-6 md:p-10 transition-colors duration-200",
      isDark
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        : "bg-gradient-to-br from-emerald-50 via-white to-teal-50"
    )}>
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -5 }}
        onClick={() => navigate('/learning')}
        className={clsx(
          "flex items-center gap-2 mb-6 group transition-colors",
          isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
        )}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Learning Hub</span>
      </motion.button>

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
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30"
            >
              <FileText className="w-6 h-6 text-white" />
            </motion.div>
            <span className={clsx(
              "text-sm font-medium px-3 py-1 rounded-full",
              isDark ? "text-emerald-400 bg-emerald-900/30" : "text-emerald-600 bg-emerald-50"
            )}>
              PDF Generator
            </span>
          </div>

          <h1 className={clsx("text-3xl md:text-4xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>
            Generate PDF Notes
          </h1>
          <p className={clsx("max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
            Create comprehensive PDF study notes for any topic. Perfect for offline study,
            quick revisions, or sharing with your study group.
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
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-emerald-100"
              )}
            >
              <div className={clsx("p-2 rounded-lg", isDark ? "bg-emerald-900/30" : "bg-emerald-100")}>
                <feature.icon className={clsx("w-5 h-5", isDark ? "text-emerald-400" : "text-emerald-600")} />
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
            "rounded-2xl p-6 border shadow-lg mb-8",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}
        >
          <div className="space-y-5">
            <div>
              <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                Topic <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className={clsx("absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5", isDark ? "text-slate-500" : "text-slate-400")} />
                <input
                  type="text"
                  placeholder="Enter topic for PDF notes..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={clsx(
                    "w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all",
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                  )}
                />
              </div>
            </div>

            {/* Quick Topic Suggestions */}
            <div>
              <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                Quick Suggestions
              </label>
              <div className="flex flex-wrap gap-2">
                {topics.map((t, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTopic(t)}
                    className={clsx(
                      "px-3 py-1.5 text-sm rounded-full border transition-all",
                      topic === t
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : isDark
                          ? 'bg-slate-700 text-slate-300 border-slate-600 hover:border-emerald-400 hover:text-emerald-400'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                    )}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                Additional Details (Optional)
              </label>
              <textarea
                placeholder="Any specific focus areas? (e.g., 'include examples', 'focus on interviews'...)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className={clsx(
                  "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none",
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                )}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generatePDF}
              disabled={loading}
              className={clsx(
                "w-full py-4 font-semibold rounded-xl shadow-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2",
                downloaded
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40'
              )}
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
                    Generating PDF...
                  </motion.div>
                ) : downloaded ? (
                  <motion.div
                    key="downloaded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Downloaded Successfully!
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Generate & Download PDF
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Pro Tip</h3>
              <p className="text-emerald-100 text-sm">
                Add specific instructions in the "Additional Details" field to customize your PDF.
                For example, request interview-focused content, practical examples, or comparison tables.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Empty State Decoration */}
        <motion.div
          variants={itemVariants}
          className="text-center py-12 mt-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className={clsx("w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg", isDark ? "bg-emerald-900/30" : "bg-emerald-100")}
          >
            <FileText className={clsx("w-12 h-12", isDark ? "text-emerald-400" : "text-emerald-500")} />
          </motion.div>
          <h3 className={clsx("text-xl font-semibold mb-2", isDark ? "text-white" : "text-slate-900")}>
            Create Study Notes Instantly
          </h3>
          <p className={clsx("max-w-md mx-auto", isDark ? "text-slate-400" : "text-slate-500")}>
            Enter any topic and we'll generate comprehensive PDF notes that you can
            download and study offline anytime, anywhere.
          </p>
        </motion.div>
      </motion.div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={clsx(
          "absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse",
          isDark ? "bg-emerald-900/30 opacity-50" : "bg-emerald-200 opacity-30"
        )} />
        <div className={clsx(
          "absolute bottom-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse",
          isDark ? "bg-teal-900/30 opacity-50" : "bg-teal-200 opacity-30"
        )} style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default GeneratePDF;
