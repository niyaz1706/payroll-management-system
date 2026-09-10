import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { EmployeeSidebar } from './EmployeeSidebar';
import { Bell, Sun, Moon, Calendar, UserCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useHRData } from '../../context/HRDataContext';

export const EmployeeLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { employees, currentEmployeeId } = useHRData();
  const navigate = useNavigate();

  const currentEmp = employees.find((e) => e.id === currentEmployeeId) || employees[0];

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('current_employee_id');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      <EmployeeSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 transition-colors duration-200 shadow-sm">
          {/* Left: Fixed Employee Session Badge */}
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3.5 py-1.5 rounded-full border border-teal-200 dark:border-teal-800/60 shadow-sm">
            <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Employee Self-Service (ESS) • {currentEmp?.name}</span>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{formattedDate}</span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-900/60 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};