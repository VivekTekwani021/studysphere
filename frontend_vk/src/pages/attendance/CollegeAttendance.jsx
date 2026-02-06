import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, CheckCircle, Loader2, BookOpen,
  TrendingUp, Calendar, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { attendanceApi } from '../../api/attendance.api';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const CollegeAttendance = () => {
  const { isDark } = useTheme();
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [markingSubject, setMarkingSubject] = useState(null);
  const [calendarSubject, setCalendarSubject] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const fetchSubjects = async () => {
    try {
      const response = await attendanceApi.getHistory();
      if (response.subjects) {
        setSubjects(response.subjects);
      }
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    try {
      setAdding(true);
      const response = await attendanceApi.addSubject(newSubject.trim());
      if (response.success) {
        toast.success('Subject added!');
        setNewSubject('');
        fetchSubjects();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add subject');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSubject = async (subjectName) => {
    if (!window.confirm(`Delete "${subjectName}"?`)) return;

    try {
      const response = await attendanceApi.deleteSubject(subjectName);
      if (response.success) {
        toast.success('Subject deleted');
        fetchSubjects();
      }
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  const handleMarkAttendance = async (subjectName) => {
    try {
      setMarkingSubject(subjectName);
      const response = await attendanceApi.markSubjectAttendance(subjectName, 'Present');
      if (response.success) {
        toast.success(`Marked present for ${subjectName}`);
        fetchSubjects();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarkingSubject(null);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const isPresentDay = (day, presentDates) => {
    if (!presentDates) return false;
    const checkDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    return presentDates.some(d => new Date(d).toDateString() === checkDate.toDateString());
  };

  const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));

  const MiniCalendar = ({ subject }) => {
    const { daysInMonth, startingDay } = getDaysInMonth(calendarMonth);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 0; i < startingDay; i++) days.push(<div key={`empty-${i}`} className="w-8 h-8" />);

    for (let day = 1; day <= daysInMonth; day++) {
      const isPresent = isPresentDay(day, subject.presentDates);
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCalendarSubject(null)}>
        <div
          className={clsx("rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4", isDark ? "bg-slate-800" : "bg-white")}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={clsx("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>{subject.subjectName}</h3>
              <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{subject.present} present days</p>
            </div>
            <button onClick={() => setCalendarSubject(null)} className={clsx("p-2 rounded-lg transition-colors", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}>
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

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return 'text-emerald-500';
    if (percentage >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Subject Form */}
      <form onSubmit={handleAddSubject} className="flex gap-3">
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Enter subject name..."
          className={clsx(
            "flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
            isDark
              ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400"
              : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
          )}
        />
        <button
          type="submit"
          disabled={adding || !newSubject.trim()}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Add
        </button>
      </form>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className={clsx("text-center py-12 rounded-2xl border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200")}>
          <BookOpen className={clsx("w-12 h-12 mx-auto mb-4", isDark ? "text-slate-600" : "text-slate-300")} />
          <h3 className={clsx("text-lg font-semibold mb-2", isDark ? "text-white" : "text-slate-900")}>No subjects yet</h3>
          <p className={clsx(isDark ? "text-slate-400" : "text-slate-500")}>Add your first subject above to start tracking</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className={clsx(
                "rounded-2xl border overflow-hidden transition-shadow hover:shadow-lg",
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              )}
            >
              <div className={clsx("p-4 border-b flex justify-between items-start", isDark ? "border-slate-700" : "border-slate-100")}>
                <div
                  className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors"
                  onClick={() => { setCalendarSubject(subject); setCalendarMonth(new Date()); }}
                >
                  <h3 className={clsx("font-semibold text-lg", isDark ? "text-white" : "text-slate-900")}>{subject.subjectName}</h3>
                  <Calendar className={clsx("w-4 h-4", isDark ? "text-slate-500" : "text-slate-400")} />
                </div>
                <button
                  onClick={() => handleDeleteSubject(subject.subjectName)}
                  className={clsx("p-2 rounded-lg transition-colors", isDark ? "hover:bg-red-500/20 text-slate-400 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-500")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={getPercentageColor(subject.percentage)} />
                    <span className={clsx("text-2xl font-bold", getPercentageColor(subject.percentage))}>
                      {subject.percentage}%
                    </span>
                  </div>
                  <span className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {subject.present}/{subject.total} classes
                  </span>
                </div>

                {/* Progress Bar */}
                <div className={clsx("h-2 rounded-full overflow-hidden", isDark ? "bg-slate-700" : "bg-slate-100")}>
                  <div
                    className={clsx("h-full rounded-full transition-all",
                      subject.percentage >= 75 ? "bg-emerald-500" :
                        subject.percentage >= 50 ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>

                {/* Mark Present Button */}
                <button
                  onClick={() => handleMarkAttendance(subject.subjectName)}
                  disabled={markingSubject === subject.subjectName}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50 shadow-md"
                >
                  {markingSubject === subject.subjectName ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Mark Present
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {calendarSubject && <MiniCalendar subject={calendarSubject} />}
    </div>
  );
};

export default CollegeAttendance;
