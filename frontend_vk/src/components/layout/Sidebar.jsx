import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  Map,
  Briefcase,
  User,
  LogOut,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Moon,
  Sun,
  Video
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  // Define menu sections
  const mainMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', color: 'text-blue-500' },
    { name: 'Learning Hub', icon: BookOpen, path: '/learning', color: 'text-purple-500' },
    { name: 'Quiz', icon: HelpCircle, path: '/quiz', color: 'text-indigo-500' },
    { name: 'Study Rooms', icon: Video, path: '/study-rooms', color: 'text-cyan-500' },
  ];

  const trackingMenuItems = [
    { name: 'Attendance', icon: CalendarCheck, path: '/attendance', color: 'text-emerald-500' },
    { name: 'Roadmap', icon: Map, path: '/roadmap', color: 'text-cyan-500' },
  ];

  const otherMenuItems = [];

  // Show placement links for all college students
  if (user?.educationLevel === 'College') {
    otherMenuItems.push({ name: 'Placement', icon: Briefcase, path: '/placement', color: 'text-amber-500' });
    otherMenuItems.push({ name: 'Resume Analysis', icon: User, path: '/placement/resume', color: 'text-violet-500' });
  }

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;

    return (
      <NavLink
        to={item.path}
        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
        className={clsx(
          "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          isActive
            ? isDark
              ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white shadow-sm"
              : "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-slate-900 shadow-sm"
            : isDark
              ? "text-slate-400 hover:bg-slate-800 hover:text-white"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <div className={clsx(
          "p-1.5 rounded-lg transition-colors",
          isActive
            ? isDark ? "bg-slate-700 shadow-sm" : "bg-white shadow-sm"
            : isDark ? "bg-slate-800 group-hover:bg-slate-700" : "bg-slate-100 group-hover:bg-white"
        )}>
          <item.icon className={clsx("w-4 h-4", isActive ? item.color : isDark ? "text-slate-400 group-hover:text-slate-200" : "text-slate-500")} />
        </div>
        <span className="flex-1">{item.name}</span>
        {isActive && <ChevronRight className="w-4 h-4 text-slate-400" />}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isDark
            ? "bg-slate-900 border-r border-slate-800 shadow-2xl lg:shadow-none"
            : "bg-gradient-to-b from-white to-slate-50 border-r border-slate-200 shadow-2xl lg:shadow-none"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={clsx(
            "h-16 flex items-center gap-3 px-6 border-b",
            isDark ? "border-slate-800" : "border-slate-100"
          )}>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
              StudySphere
            </span>
          </div>

          {/* User Quick Info */}
          <div className={clsx("p-4 border-b", isDark ? "border-slate-800" : "border-slate-100")}>
            <NavLink
              to="/profile"
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer",
                isDark
                  ? "bg-slate-800 border border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                  : "bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md"
              )}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className={clsx("font-semibold text-sm truncate", isDark ? "text-white" : "text-slate-900")}>
                  {user?.name}
                </p>
                <p className={clsx("text-xs truncate", isDark ? "text-slate-400" : "text-slate-500")}>
                  {user?.educationLevel} Student
                </p>
              </div>
              <ChevronRight className={clsx("w-4 h-4", isDark ? "text-slate-600" : "text-slate-400")} />
            </NavLink>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
            {/* Main Section */}
            <div>
              <p className={clsx("px-3 mb-2 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>
                Main
              </p>
              <div className="space-y-1">
                {mainMenuItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </div>

            {/* Tracking Section */}
            <div>
              <p className={clsx("px-3 mb-2 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>
                Tracking
              </p>
              <div className="space-y-1">
                {trackingMenuItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </div>

            {/* Other Section */}
            {otherMenuItems.length > 0 && (
              <div>
                <p className={clsx("px-3 mb-2 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>
                  Career
                </p>
                <div className="space-y-1">
                  {otherMenuItems.map((item) => (
                    <NavItem key={item.path} item={item} />
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Theme Toggle & Logout */}
          <div className={clsx("p-4 border-t space-y-2", isDark ? "border-slate-800" : "border-slate-100")}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={clsx(
                "flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all group",
                isDark
                  ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <div className={clsx(
                "p-1.5 rounded-lg transition-colors",
                isDark ? "bg-slate-800 group-hover:bg-slate-700" : "bg-slate-100 group-hover:bg-white"
              )}>
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </div>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className={clsx(
                "flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all group",
                isDark
                  ? "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                  : "text-slate-600 hover:bg-red-50 hover:text-red-600"
              )}
            >
              <div className={clsx(
                "p-1.5 rounded-lg transition-colors",
                isDark ? "bg-slate-800 group-hover:bg-red-500/20" : "bg-slate-100 group-hover:bg-red-100"
              )}>
                <LogOut className={clsx("w-4 h-4", isDark ? "text-slate-500 group-hover:text-red-400" : "text-slate-500 group-hover:text-red-500")} />
              </div>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
