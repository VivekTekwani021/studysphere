import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Search, Play, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import { learningApi } from '../../api/learning.api';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

const features = [
  { icon: Search, title: "Smart Search", desc: "Find relevant educational videos instantly" },
  { icon: Play, title: "Embedded Player", desc: "Watch videos without leaving the platform" },
  { icon: Clock, title: "Save Time", desc: "Curated content for efficient learning" },
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

const YouTubeLearning = () => {
  const [topic, setTopic] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const fetchVideos = async () => {
    if (!topic) return toast.error('Please enter a topic');

    setLoading(true);
    try {
      const data = await learningApi.getContent({ topic });
      setVideos(data.videos || []);
      if (data.videos?.length === 0) {
        toast.error('No videos found for this topic');
      }
    } catch {
      toast.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchVideos();
  };

  return (
    <div className={clsx(
      "min-h-screen p-6 md:p-10 transition-colors duration-200",
      isDark
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        : "bg-gradient-to-br from-red-50 via-white to-rose-50"
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
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg shadow-red-500/30"
            >
              <Youtube className="w-6 h-6 text-white" />
            </motion.div>
            <span className={clsx(
              "text-sm font-medium px-3 py-1 rounded-full",
              isDark ? "text-red-400 bg-red-900/30" : "text-red-600 bg-red-50"
            )}>
              Video Learning
            </span>
          </div>

          <h1 className={clsx("text-3xl md:text-4xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>
            YouTube Learning
          </h1>
          <p className={clsx("max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
            Search for educational videos on any topic and watch them directly within StudySphere.
            Learn at your own pace with curated content from YouTube's vast library.
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
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-red-100"
              )}
            >
              <div className={clsx("p-2 rounded-lg", isDark ? "bg-red-900/30" : "bg-red-100")}>
                <feature.icon className={clsx("w-5 h-5", isDark ? "text-red-400" : "text-red-600")} />
              </div>
              <div>
                <h3 className={clsx("font-semibold text-sm", isDark ? "text-white" : "text-slate-900")}>{feature.title}</h3>
                <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search Section */}
        <motion.div
          variants={itemVariants}
          className={clsx(
            "rounded-2xl p-6 border shadow-lg mb-8",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={clsx("absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5", isDark ? "text-slate-500" : "text-slate-400")} />
              <input
                type="text"
                placeholder="Enter a topic (e.g., React Hooks, Machine Learning...)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                className={clsx(
                  "w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all",
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                )}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchVideos}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search Videos
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Videos Grid */}
        <AnimatePresence mode="wait">
          {videos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className={clsx("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                  Found {videos.length} videos
                </h2>
                <span className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Click on a video to start learning
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.videoId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={clsx(
                      "rounded-2xl overflow-hidden border shadow-lg hover:shadow-xl transition-all group",
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                    )}
                  >
                    <div className="relative aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-4">
                      <h3 className={clsx(
                        "font-semibold line-clamp-2 group-hover:text-red-500 transition-colors",
                        isDark ? "text-white" : "text-slate-900"
                      )}>
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open in YouTube
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {videos.length === 0 && !loading && (
          <motion.div
            variants={itemVariants}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={clsx("w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6", isDark ? "bg-red-900/30" : "bg-red-100")}
            >
              <Youtube className={clsx("w-10 h-10", isDark ? "text-red-400" : "text-red-500")} />
            </motion.div>
            <h3 className={clsx("text-xl font-semibold mb-2", isDark ? "text-white" : "text-slate-900")}>
              Ready to learn?
            </h3>
            <p className={clsx("max-w-md mx-auto", isDark ? "text-slate-400" : "text-slate-500")}>
              Enter a topic above to search for educational videos.
              We'll find the best content to help you master any subject.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={clsx(
          "absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse",
          isDark ? "bg-red-900/30 opacity-50" : "bg-red-200 opacity-30"
        )} />
        <div className={clsx(
          "absolute bottom-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse",
          isDark ? "bg-rose-900/30 opacity-50" : "bg-rose-200 opacity-30"
        )} style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default YouTubeLearning;
