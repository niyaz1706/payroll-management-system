import React from 'react';
import { useHRData } from '../../context/HRDataContext';
import { Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

export const EmployeeAttendance: React.FC = () => {
  const { employees, currentEmployeeId, attendance, payrollCycleMonth, workingDays } = useHRData();

  const currentEmp = employees.find((e) => e.id === currentEmployeeId) || employees[0];
  const myAtt = attendance[currentEmp.id] || { presentDays: workingDays, absentDays: 0, halfDays: 0, lopDays: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance Summary</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your attendance logs and Loss-of-Pay (LOP) records for <strong>{payrollCycleMonth}</strong>.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Month Days</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">{workingDays} Days</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Days Present</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">{myAtt.presentDays} Days</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-amber-500 font-semibold uppercase">Half Days</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">{myAtt.halfDays} Days</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold uppercase">LOP Deductions</div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1.5">{myAtt.lopDays} Days</div>
        </div>
      </div>

      {/* Compliance Note */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3 text-xs">
        <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-200">Discrepancy in Attendance?</p>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            If you notice mismatched swipe records or unapproved leaves converted to LOP, please raise a regularisation request with your reporting manager or HR department.
          </p>
        </div>
      </div>
    </div>
  );
};