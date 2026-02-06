import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={clsx(
      "flex h-screen overflow-hidden transition-colors duration-200",
      isDark ? "bg-slate-900" : "bg-gray-50"
    )}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />

        <main className={clsx(
          "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 transition-colors duration-200",
          isDark ? "bg-slate-900" : "bg-gray-50"
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
