import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Youtube, FileText, Sparkles, ArrowRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { clsx } from "clsx";

const services = [
  {
    id: "content",
    title: "Learning Content",
    subtitle: "AI-Powered Explanations",
    description: "Get step-by-step explanations of any topic with real-world analogies and code examples powered by AI.",
    icon: BookOpen,
    path: "/learning/content",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    shadowColor: "shadow-purple-500/25",
    iconBg: "bg-purple-100",
    iconBgDark: "bg-purple-900/30",
    iconColor: "text-purple-600",
    iconColorDark: "text-purple-400",
    features: ["Step-by-step breakdown", "Real-world analogies", "Code examples"],
  },
  {
    id: "youtube",
    title: "YouTube Learning",
    subtitle: "Video-Based Learning",
    description: "Search and watch curated educational videos on any topic directly within the platform.",
    icon: Youtube,
    path: "/learning/youtube",
    gradient: "from-red-500 via-rose-500 to-pink-500",
    shadowColor: "shadow-red-500/25",
    iconBg: "bg-red-100",
    iconBgDark: "bg-red-900/30",
    iconColor: "text-red-600",
    iconColorDark: "text-red-400",
    features: ["Curated videos", "Topic search", "Embedded player"],
  },
  {
    id: "pdf",
    title: "Generate PDF",
    subtitle: "Downloadable Notes",
    description: "Generate comprehensive PDF notes for any topic to study offline or share with friends.",
    icon: FileText,
    path: "/learning/pdf",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    shadowColor: "shadow-emerald-500/25",
    iconBg: "bg-emerald-100",
    iconBgDark: "bg-emerald-900/30",
    iconColor: "text-emerald-600",
    iconColorDark: "text-emerald-400",
    features: ["Offline study", "Quick revision", "Easy sharing"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const floatingVariants = {
  animate: {
    y: [-5, 5, -5],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function LearningRoom() {
  const nav = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className={clsx(
      "min-h-screen p-6 md:p-10 transition-colors duration-200",
      isDark
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
    )}>
      {/* Header Section */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto mb-12"
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <span className={clsx(
            "text-sm font-medium px-3 py-1 rounded-full",
            isDark ? "text-indigo-400 bg-indigo-900/30" : "text-indigo-600 bg-indigo-50"
          )}>
            Learning Hub
          </span>
        </div>

        <h1 className={clsx(
          "text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4",
          isDark
            ? "bg-gradient-to-r from-white via-slate-200 to-slate-300"
            : "bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800"
        )}>
          Learning Room
        </h1>
        <p className={clsx("text-lg max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
          Choose your preferred learning method and start mastering new concepts today.
        </p>
      </motion.div>

      {/* Service Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onNavigate={nav} isDark={isDark} />
        ))}
      </motion.div>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={clsx(
          "absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse",
          isDark ? "bg-purple-900/30 opacity-50" : "bg-purple-200 opacity-30"
        )} />
        <div className={clsx(
          "absolute bottom-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse",
          isDark ? "bg-cyan-900/30 opacity-50" : "bg-cyan-200 opacity-30"
        )} style={{ animationDelay: '1s' }} />
        <div className={clsx(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse",
          isDark ? "bg-pink-900/20 opacity-40" : "bg-pink-200 opacity-20"
        )} style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}

function ServiceCard({ service, onNavigate, isDark }) {
  const Icon = service.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onNavigate(service.path)}
      className={clsx(
        "relative group cursor-pointer rounded-2xl p-6 border shadow-lg transition-shadow duration-300 overflow-hidden",
        isDark
          ? "bg-slate-800 border-slate-700 hover:shadow-2xl"
          : "bg-white border-slate-200/60",
        service.shadowColor,
        `hover:shadow-2xl hover:${service.shadowColor}`
      )}
    >
      {/* Gradient Border on Hover */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
        bg-gradient-to-br ${service.gradient}
        transition-opacity duration-300
        -z-10
      `} />
      <div className={clsx(
        "absolute inset-[2px] rounded-2xl -z-10",
        isDark ? "bg-slate-800" : "bg-white"
      )} />

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
        className={clsx(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300",
          isDark ? service.iconBgDark : service.iconBg
        )}
      >
        <Icon className={clsx("w-7 h-7", isDark ? service.iconColorDark : service.iconColor)} />
      </motion.div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <span className={clsx("text-sm font-medium block mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
            {service.subtitle}
          </span>
          <h3 className={clsx(
            "text-xl font-bold transition-all",
            isDark ? "text-white" : "text-slate-900"
          )}>
            {service.title}
          </h3>
        </div>

        <p className={clsx("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
          {service.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 pt-2">
          {service.features.map((feature, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={clsx(
                "text-xs font-medium px-2.5 py-1 rounded-full",
                isDark ? "text-slate-400 bg-slate-700" : "text-slate-500 bg-slate-100"
              )}
            >
              {feature}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Hover Arrow */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className={`
          w-10 h-10 rounded-full bg-gradient-to-br ${service.gradient}
          flex items-center justify-center
          shadow-lg
        `}>
          <ArrowRight className="w-5 h-5 text-white" />
        </div>
      </motion.div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 -z-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </motion.div>
  );
}
