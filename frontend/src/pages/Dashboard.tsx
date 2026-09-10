import React from 'react';
import { Users, AlertCircle, Clock, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHRData } from '../context/HRDataContext';

export const Dashboard: React.FC = () => {
  const { employees, leaveRequests, attendance, payrollStatus, payrollCycleMonth } = useHRData();

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
  const unprocessedLOPs = Object.values(attendance).reduce((acc, curr) => acc + (curr.lopDays > 0 ? 1 : 0), 0);

  const stats = [
    {
      label: 'Active Employees',
      value: employees.length.toString(),
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40',
    },
    {
      label: 'Pending Leave Approvals',
      value: pendingLeaves.toString(),
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/40',
    },
    {
      label: 'Employees with LOP Flags',
      value: unprocessedLOPs.toString(),
      icon: AlertCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/40',
    },
    {
      label: 'Current Payroll Cycle',
      value: payrollStatus,
      icon: Banknote,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/40',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">HR Operations Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Active Cycle: <strong>{payrollCycleMonth}</strong> — Monitor daily workforce records and prepare payroll batches.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Payroll Cycle Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
        <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
          Payroll Cycle Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/attendance"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all group"
          >
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm">
              1. Review Attendance
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Import bulk attendance or mark daily manual records.
            </p>
          </Link>

          <Link
            to="/leaves"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all group"
          >
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm">
              2. Clear Leave Queue
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Approve pending leaves to finalize LOP calculations.
            </p>
          </Link>

          <Link
            to="/payroll"
            className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-all"
          >
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm">
              3. Run Monthly Payroll
            </h4>
            <p className="text-xs text-indigo-600/80 dark:text-indigo-400 mt-1.5">
              Calculate PF/ESI/TDS and submit for Admin approval.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};