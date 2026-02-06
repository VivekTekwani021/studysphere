import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck, BookOpen, Trophy, Map, HelpCircle,
  TrendingUp, Flame, Target, ChevronRight, Sparkles,
  Clock, Zap, Award, ArrowRight, Play, CheckCircle2
} from 'lucide-react';
import { attendanceApi } from '../../api/attendance.api';
import { clsx } from 'clsx';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    streak: 0,
    subjects: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await attendanceApi.getHistory();
      if (response.found) {
        if (response.type === 'college') {
          const subjects = response.subjects || [];
          const avgPercentage = subjects.length > 0
            ? Math.round(subjects.reduce((acc, s) => acc + s.percentage, 0) / subjects.length)
            : 0;
          setStats({
            attendancePercentage: avgPercentage,
            streak: Math.max(...subjects.map(s => s.streak || 0), 0),
            subjects: subjects.length
          });
        } else {
          const history = response.data || [];
          const presentDays = history.filter(h => h.status === 'Present').length;
          const percentage = history.length > 0 ? Math.round((presentDays / history.length) * 100) : 0;
          setStats({
            attendancePercentage: percentage,
            streak: response.streak || 0,
            subjects: history.length
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    {
      name: 'Start Learning',
      desc: 'Continue your study session',
      icon: BookOpen,
      path: '/learning',
      gradient: 'from-purple-500 to-indigo-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      name: 'Take a Quiz',
      desc: 'Test your knowledge',
      icon: HelpCircle,
      path: '/quiz',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      name: 'Mark Attendance',
      desc: 'Track your presence',
      icon: CalendarCheck,
      path: '/attendance',
      gradient: 'from-emerald-500 to-teal-500',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30'
    },
    {
      name: 'View Roadmap',
      desc: 'Plan your journey',
      icon: Map,
      path: '/roadmap',
      gradient: 'from-orange-500 to-amber-500',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className={clsx(
        "rounded-2xl p-8 relative overflow-hidden",
        "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-blue-200 text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-blue-100 text-lg max-w-md">
            Ready to make today productive? Let's continue your learning journey.
          </p>

          {/* Stats Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span className="text-white text-sm font-medium">{stats.attendancePercentage}% Attendance</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Flame className="w-4 h-4 text-orange-300" />
              <span className="text-white text-sm font-medium">{stats.streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Target className="w-4 h-4 text-cyan-300" />
              <span className="text-white text-sm font-medium">{user?.educationLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={clsx("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            Quick Actions
          </h2>
          <Zap className="w-5 h-5 text-amber-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className={clsx(
                "group p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
                isDark
                  ? "bg-slate-800/50 border-slate-700 hover:border-blue-500/50"
                  : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-blue-100"
              )}
            >
              <div className={clsx(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                isDark ? action.iconBg.replace('dark:', '') : action.iconBg.split(' ')[0]
              )}>
                <action.icon className={clsx("w-6 h-6", `bg-gradient-to-r ${action.gradient} bg-clip-text`)} style={{ color: action.gradient.includes('purple') ? '#8b5cf6' : action.gradient.includes('blue') ? '#3b82f6' : action.gradient.includes('emerald') ? '#10b981' : '#f97316' }} />
              </div>
              <h3 className={clsx("font-semibold mb-1", isDark ? "text-white" : "text-slate-900")}>
                {action.name}
              </h3>
              <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                {action.desc}
              </p>
              <div className={clsx(
                "flex items-center gap-1 mt-3 text-sm font-medium",
                "text-blue-500 group-hover:text-blue-600"
              )}>
                Get started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats & Progress Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats Card */}
        <div className={clsx(
          "lg:col-span-2 p-6 rounded-xl border",
          isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
        )}>
          <h2 className={clsx("text-lg font-bold mb-6", isDark ? "text-white" : "text-slate-900")}>
            Your Progress
          </h2>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className={clsx(
                "w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center",
                isDark ? "bg-emerald-500/20" : "bg-emerald-100"
              )}>
                <TrendingUp className="w-8 h-8 text-emerald-500" />
              </div>
              <p className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                {stats.attendancePercentage}%
              </p>
              <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Attendance
              </p>
            </div>

            <div className="text-center">
              <div className={clsx(
                "w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center",
                isDark ? "bg-orange-500/20" : "bg-orange-100"
              )}>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
              <p className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                {stats.streak}
              </p>
              <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Day Streak
              </p>
            </div>

            <div className="text-center">
              <div className={clsx(
                "w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center",
                isDark ? "bg-purple-500/20" : "bg-purple-100"
              )}>
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
              <p className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                {stats.subjects}
              </p>
              <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                {user?.educationLevel === 'College' ? 'Subjects' : 'Days Tracked'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm mb-2">
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>Overall Progress</span>
              <span className={clsx("font-medium", isDark ? "text-white" : "text-slate-900")}>{stats.attendancePercentage}%</span>
            </div>
            <div className={clsx("h-3 rounded-full overflow-hidden", isDark ? "bg-slate-700" : "bg-slate-100")}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${stats.attendancePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Continue Learning Card */}
        <div className={clsx(
          "p-6 rounded-xl border",
          isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
        )}>
          <h2 className={clsx("text-lg font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
            Continue Learning
          </h2>

          <div className={clsx(
            "p-4 rounded-xl mb-4",
            isDark ? "bg-slate-700/50" : "bg-gradient-to-br from-blue-50 to-indigo-50"
          )}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Play className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className={clsx("font-medium text-sm", isDark ? "text-white" : "text-slate-900")}>
                  Learning Hub
                </p>
                <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                  Pick up where you left off
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/learning')}
              className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Session
            </button>
          </div>

          <div className="space-y-3">
            <Link
              to="/quiz"
              className={clsx(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
              )}
            >
              <div className={clsx("p-2 rounded-lg", isDark ? "bg-indigo-500/20" : "bg-indigo-100")}>
                <HelpCircle className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className={clsx("font-medium text-sm", isDark ? "text-white" : "text-slate-900")}>Quick Quiz</p>
                <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Test yourself</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/roadmap"
              className={clsx(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
              )}
            >
              <div className={clsx("p-2 rounded-lg", isDark ? "bg-cyan-500/20" : "bg-cyan-100")}>
                <Map className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="flex-1">
                <p className={clsx("font-medium text-sm", isDark ? "text-white" : "text-slate-900")}>AI Roadmap</p>
                <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>View your plan</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Motivational Footer */}
      <div className={clsx(
        "text-center p-6 rounded-xl",
        isDark ? "bg-gradient-to-r from-slate-800 to-slate-800/50" : "bg-gradient-to-r from-slate-50 to-white"
      )}>
        <Award className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <p className={clsx("text-lg font-semibold mb-1", isDark ? "text-white" : "text-slate-900")}>
          Keep up the great work! 🎉
        </p>
        <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
          Consistency is key to success. You're doing amazing!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
