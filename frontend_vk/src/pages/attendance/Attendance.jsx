import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import CollegeAttendance from './CollegeAttendance';
import SchoolAttendance from './SchoolAttendance';
import { CalendarCheck, GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';

const Attendance = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const isCollege = user?.educationLevel === 'College';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
            <CalendarCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            Attendance
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
            isCollege
              ? isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"
              : isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"
          )}>
            <GraduationCap className="w-4 h-4" />
            {isCollege ? 'College Mode' : 'School Mode'}
          </span>
          <span className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            • Track your daily attendance
          </span>
        </div>
      </div>

      {/* Content */}
      {isCollege ? <CollegeAttendance /> : <SchoolAttendance />}
    </div>
  );
};

export default Attendance;
