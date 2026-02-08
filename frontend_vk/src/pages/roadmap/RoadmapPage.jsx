import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Map, Plus, Calendar, Target, Flame, Clock,
    CheckCircle2, Circle, ChevronDown, ChevronUp,
    Sparkles, Loader2, BookOpen, GraduationCap,
    AlertCircle, Trophy, Zap, ArrowRight
} from "lucide-react";
import { roadmapApi } from "../../api/roadmapApi";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { clsx } from "clsx";

const levels = [
    { id: "beginner", label: "Beginner", icon: "🌱", desc: "Start from scratch" },
    { id: "intermediate", label: "Intermediate", icon: "📚", desc: "Know the basics" },
    { id: "advanced", label: "Advanced", icon: "🚀", desc: "Deep dive mastery" },
];

const durations = [3, 5, 7, 14, 21, 30];

const RoadmapPage = () => {
    const { isDark } = useTheme();
    const [view, setView] = useState("loading"); // loading, create, roadmap
    const [roadmapData, setRoadmapData] = useState(null);
    const [todayData, setTodayData] = useState(null);
    const [expandedDays, setExpandedDays] = useState({});

    // Form state
    const [topic, setTopic] = useState("");
    const [duration, setDuration] = useState(7);
    const [level, setLevel] = useState("beginner");
    const [generating, setGenerating] = useState(false);

    // Load existing roadmap on mount
    useEffect(() => {
        loadRoadmap();
    }, []);

    const loadRoadmap = async () => {
        try {
            // Fetch full roadmap from database
            const roadmap = await roadmapApi.getActiveRoadmap();

            if (roadmap) {
                setRoadmapData(roadmap);

                // Find today's day and backlog
                const todayStr = new Date().toDateString();
                const todayDay = roadmap.days.find(d => new Date(d.date).toDateString() === todayStr);
                setTodayData({
                    roadmapId: roadmap._id,
                    today: todayDay,
                    backlog: roadmap.days.filter(d => d.backlog)
                });

                setView("roadmap");
            } else {
                setView("create");
            }
        } catch (err) {
            console.error("Failed to load roadmap:", err);
            setView("create");
        }
    };

    const handleGenerateRoadmap = async () => {
        if (!topic.trim()) {
            return toast.error("Please enter a topic");
        }

        try {
            setGenerating(true);
            const data = await roadmapApi.generateRoadmap(topic, duration, level);
            localStorage.setItem("currentRoadmap", JSON.stringify(data));
            setRoadmapData(data);

            const todayStr = new Date().toDateString();
            const todayDay = data.days.find(d => new Date(d.date).toDateString() === todayStr);
            setTodayData({
                roadmapId: data._id,
                today: todayDay,
                backlog: data.days.filter(d => d.backlog)
            });

            setView("roadmap");
            toast.success("Roadmap generated successfully!");
        } catch (err) {
            toast.error("Failed to generate roadmap");
        } finally {
            setGenerating(false);
        }
    };

    const handleCompleteTask = async (dayId, taskId, taskTitle) => {
        try {
            const updated = await roadmapApi.completeTask(todayData.roadmapId, dayId, taskId);
            localStorage.setItem("currentRoadmap", JSON.stringify(updated));
            setRoadmapData(updated);

            const todayStr = new Date().toDateString();
            const todayDay = updated.days.find(d => new Date(d.date).toDateString() === todayStr);
            setTodayData(prev => ({
                ...prev,
                today: todayDay,
                backlog: updated.days.filter(d => d.backlog)
            }));

            toast.success(`Completed: ${taskTitle}`);
        } catch (err) {
            toast.error("Failed to complete task");
        }
    };

    const toggleDayExpansion = (dayIndex) => {
        setExpandedDays(prev => ({
            ...prev,
            [dayIndex]: !prev[dayIndex]
        }));
    };

    const isToday = (dateStr) => {
        return new Date(dateStr).toDateString() === new Date().toDateString();
    };

    const isPast = (dateStr) => {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const getProgress = () => {
        if (!roadmapData?.days) return 0;
        const total = roadmapData.days.reduce((acc, d) => acc + d.tasks.length, 0);
        const completed = roadmapData.days.reduce((acc, d) =>
            acc + d.tasks.filter(t => t.completed).length, 0);
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    // Loading State
    if (view === "loading") {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className={clsx("w-12 h-12 animate-spin mx-auto mb-4", isDark ? "text-teal-400" : "text-teal-500")} />
                    <p className={clsx(isDark ? "text-slate-400" : "text-slate-600")}>Loading your roadmap...</p>
                </div>
            </div>
        );
    }

    // Create Roadmap View
    if (view === "create") {
        return (
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                            <Map className="w-6 h-6 text-white" />
                        </div>
                        <span className={clsx("text-sm font-medium px-3 py-1 rounded-full", isDark ? "text-teal-400 bg-teal-900/30" : "text-teal-600 bg-teal-50")}>
                            Learning Path
                        </span>
                    </div>

                    <h1 className={clsx("text-3xl font-bold mb-3", isDark ? "text-white" : "text-slate-900")}>
                        Create Your Roadmap
                    </h1>
                    <p className={clsx("max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
                        Generate a personalized study roadmap with daily tasks. AI will create a structured
                        learning path based on your topic, duration, and skill level.
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: Target, title: "Goal-Oriented", desc: "Clear daily objectives" },
                        { icon: Calendar, title: "Structured", desc: "Day-by-day schedule" },
                        { icon: Flame, title: "Track Progress", desc: "Mark tasks complete" },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className={clsx(
                                "rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow flex items-start gap-3",
                                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-teal-100"
                            )}
                        >
                            <div className={clsx("p-2 rounded-lg", isDark ? "bg-teal-900/30" : "bg-teal-100")}>
                                <feature.icon className={clsx("w-5 h-5", isDark ? "text-teal-400" : "text-teal-600")} />
                            </div>
                            <div>
                                <h3 className={clsx("font-semibold text-sm", isDark ? "text-white" : "text-slate-900")}>{feature.title}</h3>
                                <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className={clsx(
                    "rounded-2xl p-6 md:p-8 border shadow-lg",
                    isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                )}>
                    {/* Topic Input */}
                    <div className="mb-6">
                        <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                            What do you want to learn? <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <BookOpen className={clsx(
                                "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5",
                                isDark ? "text-slate-500" : "text-slate-400"
                            )} />
                            <input
                                type="text"
                                placeholder="e.g., React.js, Data Structures, Machine Learning..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className={clsx(
                                    "w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all",
                                    isDark
                                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                                )}
                            />
                        </div>
                    </div>

                    {/* Duration Selection */}
                    <div className="mb-6">
                        <label className={clsx("block text-sm font-medium mb-3", isDark ? "text-slate-300" : "text-slate-700")}>
                            Duration (days)
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {durations.map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={clsx(
                                        "px-4 py-2 rounded-xl font-medium transition-all",
                                        duration === d
                                            ? "bg-teal-500 text-white shadow-lg"
                                            : isDark
                                                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    {d} days
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Level Selection */}
                    <div className="mb-8">
                        <label className={clsx("block text-sm font-medium mb-3", isDark ? "text-slate-300" : "text-slate-700")}>
                            Your Level
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {levels.map((l) => (
                                <button
                                    key={l.id}
                                    onClick={() => setLevel(l.id)}
                                    className={clsx(
                                        "relative p-4 rounded-xl border-2 transition-all text-left",
                                        level === l.id
                                            ? isDark ? "border-teal-500 bg-teal-900/20" : "border-teal-500 bg-teal-50"
                                            : isDark ? "border-slate-700 bg-slate-800 hover:border-slate-600" : "border-slate-200 bg-white hover:border-slate-300"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{l.icon}</span>
                                        <div>
                                            <h4 className={clsx("font-semibold", isDark ? "text-white" : "text-slate-900")}>{l.label}</h4>
                                            <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{l.desc}</p>
                                        </div>
                                    </div>
                                    {level === l.id && (
                                        <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-teal-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerateRoadmap}
                        disabled={generating}
                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating Roadmap...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Generate Roadmap
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // Roadmap View
    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                        <Map className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{roadmapData?.topic || "Your Roadmap"}</h1>
                        <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{roadmapData?.duration || 0} day journey</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem("currentRoadmap");
                        setRoadmapData(null);
                        setTodayData(null);
                        setView("create");
                    }}
                    className={clsx(
                        "px-4 py-2 border rounded-xl flex items-center gap-2",
                        isDark
                            ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                >
                    <Plus className="w-4 h-4" />
                    New Roadmap
                </button>
            </div>

            {/* Progress & Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className={clsx("rounded-xl p-4 border shadow-sm", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-teal-500" />
                        <span className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Progress</span>
                    </div>
                    <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{getProgress()}%</p>
                </div>

                <div className={clsx("rounded-xl p-4 border shadow-sm", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
                    <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Streak</span>
                    </div>
                    <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{roadmapData?.streak || 0} days</p>
                </div>

                <div className={clsx("rounded-xl p-4 border shadow-sm", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        <span className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Days Left</span>
                    </div>
                    <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {roadmapData?.days ? roadmapData.days.filter(d => !isPast(d.date) || isToday(d.date)).length : 0}
                    </p>
                </div>

                <div className={clsx("rounded-xl p-4 border shadow-sm", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <span className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Completed</span>
                    </div>
                    <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {roadmapData?.days?.filter(d => d.isCompleted).length || 0} days
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className={clsx("h-3 rounded-full overflow-hidden", isDark ? "bg-slate-700" : "bg-slate-100")}>
                    <div
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${getProgress()}%` }}
                    />
                </div>
            </div>

            {/* Today's Tasks Highlight */}
            {todayData?.today && (
                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5" />
                            <span className="font-semibold">Today's Tasks</span>
                            <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">Day {todayData.today.day}</span>
                        </div>

                        <div className="space-y-3">
                            {todayData.today.tasks.map((task) => (
                                <div
                                    key={task._id}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${task.completed ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                >
                                    <button
                                        onClick={() => !task.completed && handleCompleteTask(todayData.today._id, task._id, task.title)}
                                        disabled={task.completed}
                                        className="flex-shrink-0"
                                    >
                                        {task.completed ? (
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-white/60 hover:text-white" />
                                        )}
                                    </button>
                                    <span className={task.completed ? 'line-through opacity-70' : ''}>
                                        {task.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>
            )}

            {/* Backlog Warning */}
            {todayData?.backlog?.length > 0 && (
                <div className={clsx(
                    "rounded-xl p-4 mb-8 flex items-start gap-3 border",
                    isDark ? "bg-amber-900/20 border-amber-800" : "bg-amber-50 border-amber-200"
                )}>
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className={clsx("font-semibold", isDark ? "text-amber-200" : "text-amber-800")}>You have backlog tasks!</p>
                        <p className={clsx("text-sm", isDark ? "text-amber-400" : "text-amber-600")}>
                            {todayData.backlog.reduce((acc, d) => acc + d.tasks.filter(t => !t.completed).length, 0)} incomplete tasks from previous days
                        </p>
                    </div>
                </div>
            )}

            {/* All Days Timeline */}
            <div>
                <h2 className={clsx("text-lg font-bold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                    <Calendar className="w-5 h-5 text-teal-500" />
                    Full Roadmap
                </h2>

                <div className="space-y-3">
                    {roadmapData?.days?.map((day, index) => {
                        const isTodayDay = isToday(day.date);
                        const isPastDay = isPast(day.date) && !isTodayDay;
                        const isExpanded = expandedDays[index] ?? isTodayDay;
                        const completedTasks = day.tasks.filter(t => t.completed).length;
                        const totalTasks = day.tasks.length;

                        let borderClass = '';
                        let bgClass = isDark ? 'bg-slate-800' : 'bg-white';

                        if (isTodayDay) {
                            borderClass = isDark ? 'border-teal-700 ring-2 ring-teal-900/50' : 'border-teal-300 ring-2 ring-teal-100';
                        } else if (day.isCompleted) {
                            borderClass = isDark ? 'border-emerald-800' : 'border-emerald-200';
                        } else if (isPastDay) {
                            borderClass = isDark ? 'border-amber-800' : 'border-amber-200';
                        } else {
                            borderClass = isDark ? 'border-slate-700' : 'border-slate-200';
                        }

                        return (
                            <div
                                key={day._id || index}
                                className={clsx("rounded-xl border overflow-hidden", bgClass, borderClass)}
                            >
                                {/* Day Header */}
                                <button
                                    onClick={() => toggleDayExpansion(index)}
                                    className={clsx(
                                        "w-full p-4 flex items-center justify-between transition-colors",
                                        isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${day.isCompleted
                                            ? isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                                            : isTodayDay
                                                ? isDark ? 'bg-teal-900/30 text-teal-400' : 'bg-teal-100 text-teal-600'
                                                : isPastDay
                                                    ? isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'
                                                    : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {day.isCompleted ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                <span className="font-semibold text-sm">{day.day}</span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2">
                                                <span className={clsx("font-semibold", isDark ? "text-white" : "text-slate-900")}>Day {day.day}</span>
                                                {isTodayDay && (
                                                    <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", isDark ? "bg-teal-900/30 text-teal-400" : "bg-teal-100 text-teal-700")}>
                                                        TODAY
                                                    </span>
                                                )}
                                                {isPastDay && !day.isCompleted && (
                                                    <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700")}>
                                                        BACKLOG
                                                    </span>
                                                )}
                                            </div>
                                            <span className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-medium ${completedTasks === totalTasks
                                            ? 'text-emerald-500'
                                            : isDark ? 'text-slate-400' : 'text-slate-500'
                                            }`}>
                                            {completedTasks}/{totalTasks}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUp className={clsx("w-5 h-5", isDark ? "text-slate-500" : "text-slate-400")} />
                                        ) : (
                                            <ChevronDown className={clsx("w-5 h-5", isDark ? "text-slate-500" : "text-slate-400")} />
                                        )}
                                    </div>
                                </button>

                                {/* Tasks */}
                                {isExpanded && (
                                    <div className={clsx("border-t p-4 space-y-2", isDark ? "border-slate-700" : "border-slate-100")}>
                                        {day.tasks.map((task) => (
                                            <div
                                                key={task._id}
                                                className={clsx(
                                                    "flex items-center gap-3 p-3 rounded-lg transition-all",
                                                    task.completed
                                                        ? isDark ? "bg-emerald-900/10" : "bg-emerald-50"
                                                        : isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-slate-50 hover:bg-slate-100"
                                                )}
                                            >
                                                <button
                                                    onClick={() => !task.completed && handleCompleteTask(day._id, task._id, task.title)}
                                                    disabled={task.completed}
                                                    className="flex-shrink-0"
                                                >
                                                    {task.completed ? (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-slate-400 hover:text-teal-500 transition-colors" />
                                                    )}
                                                </button>
                                                <span className={clsx(
                                                    "text-sm",
                                                    task.completed
                                                        ? "text-slate-500 line-through"
                                                        : isDark ? "text-slate-300" : "text-slate-700"
                                                )}>
                                                    {task.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RoadmapPage;
