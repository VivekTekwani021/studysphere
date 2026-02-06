import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  User, Shield, Mail, GraduationCap, Calendar,
  TrendingUp, Award, LogOut, Settings, Edit3,
  BookOpen, CheckCircle, Flame, Target, ChevronRight
} from 'lucide-react';
import { attendanceApi } from '../../api/attendance.api';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    totalSubjects: 0,
    streak: 0
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
            totalSubjects: subjects.length,
            streak: 0
          });
        } else {
          const history = response.data || [];
          const presentDays = history.filter(h => h.status === 'Present').length;
          const percentage = history.length > 0 ? Math.round((presentDays / history.length) * 100) : 0;
          setStats({
            attendancePercentage: percentage,
            totalSubjects: history.length,
            streak: response.streak || 0
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      toast.success('Signed out successfully');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className={clsx("text-3xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
          My Profile
        </h1>
        <p className={clsx(isDark ? "text-slate-400" : "text-slate-600")}>
          Manage your account and view your progress
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl p-1 shadow-xl">
        <div className={clsx("rounded-xl p-6", isDark ? "bg-slate-800" : "bg-white")}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <button className={clsx(
                  "absolute -bottom-2 -right-2 p-2 rounded-full shadow-lg border transition-colors",
                  isDark
                    ? "bg-slate-700 border-slate-600 hover:bg-slate-600"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                )}>
                  <Edit3 className={clsx("w-4 h-4", isDark ? "text-slate-300" : "text-slate-600")} />
                </button>
              </div>
              <div className="mt-4 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Active
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                  {user?.name}
                </h2>
                <p className={clsx(isDark ? "text-slate-400" : "text-slate-500")}>{user?.email}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg",
                  isDark ? "bg-blue-500/20" : "bg-blue-50"
                )}>
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  <span className={clsx("text-sm font-medium", isDark ? "text-blue-400" : "text-blue-700")}>
                    {user?.educationLevel} Student
                  </span>
                </div>
                <div className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg",
                  isDark ? "bg-slate-700" : "bg-slate-100"
                )}>
                  <Calendar className={clsx("w-4 h-4", isDark ? "text-slate-400" : "text-slate-600")} />
                  <span className={clsx("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    Joined {new Date().getFullYear()}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className={clsx("text-center p-3 rounded-xl", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                  <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className={clsx("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {stats.attendancePercentage}%
                  </p>
                  <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Attendance</p>
                </div>
                <div className={clsx("text-center p-3 rounded-xl", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                  <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className={clsx("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {stats.streak}
                  </p>
                  <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Day Streak</p>
                </div>
                <div className={clsx("text-center p-3 rounded-xl", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                  <Target className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className={clsx("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {stats.totalSubjects}
                  </p>
                  <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                    {user?.educationLevel === 'College' ? 'Subjects' : 'Days Tracked'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account Settings Card */}
        <div className={clsx(
          "rounded-xl border p-5 hover:shadow-md transition-shadow",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className={clsx("p-2 rounded-lg", isDark ? "bg-blue-500/20" : "bg-blue-100")}>
              <Settings className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className={clsx("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                Account Settings
              </h3>
              <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Manage your preferences
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className={clsx(
              "flex items-center justify-between p-3 rounded-lg",
              isDark ? "bg-slate-700/50" : "bg-slate-50"
            )}>
              <div className="flex items-center gap-2">
                <Mail className={clsx("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
                <span className={clsx("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>Email</span>
              </div>
              <span className={clsx("text-sm truncate max-w-[180px]", isDark ? "text-slate-400" : "text-slate-500")}>
                {user?.email}
              </span>
            </div>
            <div className={clsx(
              "flex items-center justify-between p-3 rounded-lg",
              isDark ? "bg-slate-700/50" : "bg-slate-50"
            )}>
              <div className="flex items-center gap-2">
                <User className={clsx("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
                <span className={clsx("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>Name</span>
              </div>
              <span className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                {user?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Learning Progress Card */}
        <div className={clsx(
          "rounded-xl border p-5 hover:shadow-md transition-shadow",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className={clsx("p-2 rounded-lg", isDark ? "bg-purple-500/20" : "bg-purple-100")}>
              <BookOpen className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className={clsx("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                Learning Progress
              </h3>
              <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Your study journey
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className={isDark ? "text-slate-400" : "text-slate-600"}>Overall Progress</span>
                <span className={clsx("font-medium", isDark ? "text-white" : "text-slate-900")}>
                  {stats.attendancePercentage}%
                </span>
              </div>
              <div className={clsx("h-2 rounded-full overflow-hidden", isDark ? "bg-slate-700" : "bg-slate-100")}>
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${stats.attendancePercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={clsx("p-3 rounded-lg text-center", isDark ? "bg-purple-500/20" : "bg-purple-50")}>
                <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <p className={clsx("text-sm font-medium", isDark ? "text-purple-400" : "text-purple-700")}>
                  Keep Going!
                </p>
              </div>
              <div className={clsx("p-3 rounded-lg text-center", isDark ? "bg-indigo-500/20" : "bg-indigo-50")}>
                <Flame className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                <p className={clsx("text-sm font-medium", isDark ? "text-indigo-400" : "text-indigo-700")}>
                  {stats.streak} Day Streak
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Placement Card - Only if enabled */}
        {user?.isPlacementEnabled && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold">Placement Access</h3>
                <p className="text-sm text-slate-400">Exclusive opportunities</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-4">
              You have access to exclusive placement opportunities and job listings.
            </p>

            <button
              onClick={() => window.location.href = '/placement'}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              View Opportunities
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sign Out Card */}
        <div className={clsx(
          "rounded-xl border p-5 hover:shadow-md transition-shadow",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className={clsx("p-2 rounded-lg", isDark ? "bg-red-500/20" : "bg-red-100")}>
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className={clsx("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                Sign Out
              </h3>
              <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                End your session
              </p>
            </div>
          </div>

          <p className={clsx("text-sm mb-4", isDark ? "text-slate-400" : "text-slate-600")}>
            Sign out of your account. You'll need to sign in again to access your data.
          </p>

          <button
            onClick={handleLogout}
            className={clsx(
              "w-full py-3 font-medium rounded-lg transition-colors",
              isDark
                ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                : "bg-red-50 hover:bg-red-100 text-red-600"
            )}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
