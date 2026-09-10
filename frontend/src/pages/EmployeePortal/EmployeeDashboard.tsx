import React from 'react';
import { useHRData } from '../../context/HRDataContext';
import { Banknote, Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployeeDashboard: React.FC = () => {
  const { employees, currentEmployeeId, calculatedPayroll, attendance, leaveRequests, payrollCycleMonth } = useHRData();

  const currentEmp = employees.find((e) => e.id === currentEmployeeId) || employees[0];
  const myPayroll = calculatedPayroll.find((p) => p.employeeId === currentEmp.id);
  const myAttendance = attendance[currentEmp.id] || { presentDays: 22, absentDays: 0, halfDays: 0, lopDays: 0 };
  const myLeaves = leaveRequests.filter((l) => l.employeeId === currentEmp.id);
  const pendingLeaves = myLeaves.filter((l) => l.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-teal-100 text-xs font-semibold uppercase tracking-wider">Employee Workspace</span>
          <h2 className="text-2xl font-black mt-1">Hello, {currentEmp.name}! 👋</h2>
          <p className="text-teal-100 text-sm mt-0.5">
            {currentEmp.designation} • {currentEmp.department} Department • {currentEmp.employeeCode}
          </p>
        </div>
        <Link
          to="/employee/leaves"
          className="self-start md:self-auto inline-flex items-center gap-2 bg-white text-teal-900 hover:bg-teal-50 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          Apply for Leave <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Latest Payout */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Latest Est. Net Pay ({payrollCycleMonth})
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            ₹{myPayroll ? myPayroll.netPay.toLocaleString('en-IN') : '0'}
          </div>
          <p className="text-xs text-slate-400 mt-1">Gross: ₹{myPayroll?.monthlyGross.toLocaleString('en-IN')} (Before statutory cuts)</p>
        </div>

        {/* Attendance Days */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Days Present ({payrollCycleMonth})
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {myAttendance.presentDays} Days
          </div>
          <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">
            {myAttendance.lopDays > 0 ? `${myAttendance.lopDays} LOP deduction days flagged` : 'No LOP deductions'}
          </p>
        </div>

        {/* Leave Queue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Leave Approvals
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {pendingLeaves}
          </div>
          <p className="text-xs text-slate-400 mt-1">Requests pending HR approval</p>
        </div>
      </div>

      {/* Recent Leave Statuses */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">Recent Leave Requests</span>
          <Link to="/employee/leaves" className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline">
            View All
          </Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {myLeaves.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-400">No leave applications submitted yet.</p>
          ) : (
            myLeaves.slice(0, 3).map((req) => (
              <div key={req.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{req.leaveType} Leave ({req.daysCount} days)</p>
                  <p className="text-slate-400 mt-0.5">{req.startDate} to {req.endDate} • Reason: "{req.reason}"</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full font-semibold ${
                    req.status === 'Approved'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : req.status === 'Rejected'
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};