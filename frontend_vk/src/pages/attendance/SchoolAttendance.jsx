import React, { useState, useEffect } from 'react';
import {
  CheckCircle, Calendar, Loader2,
  TrendingUp, Flame, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { attendanceApi } from '../../api/attendance.api';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const SchoolAttendance = () => {
  const { isDark } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayStatus, setTodayStatus] = useState(null);
  const [marking, setMarking] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const fetchHistory = async () => {
    try {
      const response = await attendanceApi.getHistory();
      if (response.success) {
        setHistory(response.data || []);
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRecord = response.data?.find(r => r.date?.startsWith(todayStr));
        if (todayRecord) {
          setTodayStatus(todayRecord.status);
        }
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleMarkAttendance = async (status) => {
    try {
      setMarking(true);
      const response = await attendanceApi.markSchoolDaily(status);
      if (response.success) {
        toast.success(`Marked ${status}!`);
        setTodayStatus(status);
        fetchHistory();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  // Calculate stats
  const totalDays = history.length;
  const presentDays = history.filter(r => r.status === 'Present').length;
  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const calculateStreak = () => {
    let streak = 0;
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const record of sortedHistory) {
      if (record.status === 'Present') streak++;
      else break;
    }
    return streak;
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const isPresentDay = (day) => {
    const checkDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    return history.some(h => {
      if (h.status !== 'Present') return false;
      const presentDate = new Date(h.date);
      return presentDate.toDateString() === checkDate.toDateString();
    });
  };

  const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));

  const MiniCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(calendarMonth);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 0; i < startingDay; i++) days.push(<div key={`empty-${i}`} className="w-8 h-8" />);

    for (let day = 1; day <= daysInMonth; day++) {
      const isPresent = isPresentDay(day);
      const isToday = new Date().toDateString() === new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          className={clsx(
            "w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors",
            isPresent && "bg-emerald-500 text-white font-medium",
            isToday && !isPresent && "ring-2 ring-blue-400",
            !isPresent && (isDark ? "text-slate-400" : "text-slate-600")
          )}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCalendar(false)}>
        <div
          className={clsx("rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4", isDark ? "bg-slate-800" : "bg-white")}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={clsx("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Attendance Calendar</h3>
              <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{presentDays} present days</p>
            </div>
            <button onClick={() => setShowCalendar(false)} className={clsx("p-2 rounded-lg transition-colors", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}>
              <X className={clsx("w-5 h-5", isDark ? "text-slate-400" : "text-slate-500")} />
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className={clsx("p-2 rounded-lg transition-colors", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}>
              <ChevronLeft className={clsx("w-5 h-5", isDark ? "text-slate-400" : "text-slate-600")} />
            </button>
            <span className={clsx("font-semibold", isDark ? "text-white" : "text-slate-900")}>
              {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
            </span>
            <button onClick={nextMonth} className={clsx("p-2 rounded-lg transition-colors", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}>
              <ChevronRight className={clsx("w-5 h-5", isDark ? "text-slate-400" : "text-slate-600")} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className={clsx("w-8 h-8 flex items-center justify-center text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">{days}</div>

          <div className={clsx("flex items-center gap-4 mt-4 pt-4 border-t", isDark ? "border-slate-700" : "border-slate-100")}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500" />
              <span className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-600")}>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-blue-400" />
              <span className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-600")}>Today</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Today's Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Today's Attendance</span>
          </div>
          <button
            onClick={() => { setShowCalendar(true); setCalendarMonth(new Date()); }}
            className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
          >
            <Calendar className="w-4 h-4" />
            View Calendar
          </button>
        </div>

        <p className="text-blue-100 text-sm mb-4">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>

        {todayStatus ? (
          <div className={clsx("flex items-center justify-center gap-3 p-4 rounded-xl",
            todayStatus === 'Present' ? "bg-white/20" : "bg-red-500/20"
          )}>
            {todayStatus === 'Present' ? (
              <CheckCircle className="w-8 h-8" />
            ) : (
              <X className="w-8 h-8" />
            )}
            <span className="text-xl font-semibold">Marked {todayStatus}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleMarkAttendance('Present')}
              disabled={marking}
              className="flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-lg"
            >
              {marking ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              Mark Present
            </button>
            <button
              onClick={() => handleMarkAttendance('Absent')}
              disabled={marking}
              className="flex items-center justify-center gap-2 py-4 bg-red-500 hover:bg-red-400 rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-lg"
            >
              {marking ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
              Mark Absent
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={clsx("rounded-xl p-4 border shadow-sm text-center", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
          <TrendingUp className="w-4 h-4 text-blue-500 mx-auto mb-2" />
          <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{percentage}%</p>
          <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Attendance</p>
        </div>

        <div className={clsx("rounded-xl p-4 border shadow-sm text-center", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
          <Flame className="w-4 h-4 text-orange-500 mx-auto mb-2" />
          <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{calculateStreak()}</p>
          <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Day Streak</p>
        </div>

        <div
          className={clsx("rounded-xl p-4 border shadow-sm text-center cursor-pointer transition-all",
            isDark ? "bg-slate-800 border-slate-700 hover:border-emerald-500" : "bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md"
          )}
          onClick={() => { setShowCalendar(true); setCalendarMonth(new Date()); }}
        >
          <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto mb-2" />
          <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{presentDays}</p>
          <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Present Days</p>
        </div>

        <div
          className={clsx("rounded-xl p-4 border shadow-sm text-center cursor-pointer transition-all",
            isDark ? "bg-slate-800 border-slate-700 hover:border-red-500" : "bg-white border-slate-200 hover:border-red-300 hover:shadow-md"
          )}
          onClick={() => { setShowCalendar(true); setCalendarMonth(new Date()); }}
        >
          <X className="w-4 h-4 text-red-500 mx-auto mb-2" />
          <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{history.length - presentDays}</p>
          <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Absent Days</p>
        </div>
      </div>

      {/* Recent History */}
      <div className={clsx("rounded-2xl border overflow-hidden", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
        <div className={clsx("p-4 border-b flex items-center justify-between", isDark ? "border-slate-700" : "border-slate-100")}>
          <div className="flex items-center gap-2">
            <Calendar className={clsx("w-5 h-5", isDark ? "text-slate-400" : "text-slate-600")} />
            <h3 className={clsx("font-semibold", isDark ? "text-white" : "text-slate-900")}>Recent Attendance</h3>
          </div>
          <button
            onClick={() => { setShowCalendar(true); setCalendarMonth(new Date()); }}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
          >
            View All
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className={clsx("text-center py-8", isDark ? "text-slate-400" : "text-slate-500")}>
              <Calendar className={clsx("w-10 h-10 mx-auto mb-2", isDark ? "text-slate-600" : "text-slate-300")} />
              <p>No attendance records yet</p>
              <p className="text-sm">Mark present above to start tracking</p>
            </div>
          ) : (
            <div className={clsx("divide-y", isDark ? "divide-slate-700" : "divide-slate-100")}>
              {history
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 7)
                .map((record) => (
                  <div key={record._id} className={clsx("flex justify-between items-center p-4 transition-colors", isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50")}>
                    <div className="flex items-center gap-3">
                      <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center",
                        record.status === 'Present'
                          ? isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                          : isDark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-400"
                      )}>
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={clsx("font-medium", isDark ? "text-white" : "text-slate-900")}>{format(new Date(record.date), 'EEEE')}</p>
                        <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{format(new Date(record.date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <span className={clsx("px-3 py-1 rounded-full text-sm font-medium",
                      record.status === 'Present'
                        ? isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                        : isDark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-600"
                    )}>{record.status}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {showCalendar && <MiniCalendar />}
    </div>
  );
};

export default SchoolAttendance;
