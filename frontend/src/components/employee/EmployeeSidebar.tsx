import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CalendarCheck2, 
  CalendarPlus, 
  Building2, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useHRData } from '../../context/HRDataContext';

interface EmployeeSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { name: 'Overview', href: '/employee', icon: LayoutDashboard },
  { name: 'My Payslips', href: '/employee/payslips', icon: FileText },
  { name: 'Apply & Manage Leaves', href: '/employee/leaves', icon: CalendarPlus },
  { name: 'Attendance Record', href: '/employee/attendance', icon: CalendarCheck2 },
];

export const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { employees, currentEmployeeId } = useHRData();
  const navigate = useNavigate();
  const currentEmp = employees.find((e) => e.id === currentEmployeeId) || employees[0];

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  return (
    <aside
      className={`relative bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 flex flex-col shrink-0 min-h-screen transition-all duration-300 ease-in-out z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                Acme Corp
              </h1>
              <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider block">
                Employee Portal
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 p-1.5 rounded-full shadow-md hover:scale-105 transition-all"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/employee'}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Current Employee Info & Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <div className={`flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 ${isCollapsed ? 'justify-center p-2' : ''}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center text-xs shrink-0">
              {currentEmp.name.split(' ').map((n) => n[0]).join('')}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentEmp.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentEmp.employeeCode}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};