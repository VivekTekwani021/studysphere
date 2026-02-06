import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <header className={clsx(
      "h-16 border-b shadow-sm flex items-center justify-between px-4 lg:px-8 z-10 transition-colors duration-200",
      isDark
        ? "bg-slate-800 border-slate-700"
        : "bg-white border-gray-100"
    )}>
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className={clsx(
            "lg:hidden p-2 rounded-md transition-colors",
            isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          )}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden md:block">
            <p className={clsx(
              "text-sm font-medium",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {user?.name}
            </p>
            <p className={clsx(
              "text-xs capitalize",
              isDark ? "text-slate-400" : "text-gray-500"
            )}>
              {user?.educationLevel || 'Student'}
            </p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
