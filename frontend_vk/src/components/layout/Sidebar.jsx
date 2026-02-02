import React from 'react';
import { NavLink } from 'react-router-dom';
// import { 
//   LayoutDashboard, 
//   CalendarCheck, 
//   BookOpen, 
//   CheckSquare, 
//   Map, 
//   Briefcase, 
//   User,
//   LogOut
// } from 'lucide-react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BookOpen, 
  CheckSquare, 
  Map, 
  Briefcase, 
  User,
  LogOut,
  HelpCircle
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  
  // Define menu items
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Attendance', icon: CalendarCheck, path: '/attendance' },
    { name: 'Learning Hub', icon: BookOpen, path: '/learning' },
    { name: 'Quiz', icon: HelpCircle, path: '/quiz' },
    { name: 'Habit Tracker', icon: CheckSquare, path: '/habits' },
    { name: 'Roadmap', icon: Map, path: '/roadmap' },
    
    
  ];

  // Conditional placement link
  if (user?.isPlacementEnabled) {
    menuItems.push({ name: 'Placement', icon: Briefcase, path: '/placement' });
  }

  // Profile link
  menuItems.push({ name: 'Profile', icon: User, path: '/profile' });

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={clsx(
          "fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <div 
        className={clsx(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-50">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              StudySphere
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={({ isActive }) => clsx(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer / Logout */}
          <div className="p-4 border-t border-gray-50">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
