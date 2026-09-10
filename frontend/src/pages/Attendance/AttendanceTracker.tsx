import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Lock, 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useHRData, getFridayOfWeek } from '../../context/HRDataContext';
import type { DailyStatus } from '../../context/HRDataContext';
import { useToast } from '../../context/ToastContext';

export const AttendanceTracker: React.FC = () => {
  const { 
    employees, 
    dailyAttendance, 
    markDailyAttendance, 
    leaveRequests, 
    lockedWeeks, 
    lockWeek, 
    isDateLocked 
  } = useHRData();

  const { showToast } = useToast();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [showLockModal, setShowLockModal] = useState(false);

  const currentDateObj = new Date(selectedDate);
  const currentFriday = getFridayOfWeek(currentDateObj);
  const isCurrentWeekLocked = lockedWeeks.includes(currentFriday);
  const dateLocked = isDateLocked(selectedDate);

  const getApprovedLeave = (empId: string, dateStr: string) => {
    return leaveRequests.find(
      (l) =>
        l.employeeId === empId &&
        l.status === 'Approved' &&
        dateStr >= l.startDate &&
        dateStr <= l.endDate
    );
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const confirmFridayLock = () => {
    lockWeek(currentFriday);
    setShowLockModal(false);
    showToast(`Week ending Friday (${currentFriday}) locked successfully! Records frozen for payroll.`, 'success');
  };

  const handleMarkAllPresent = () => {
    if (dateLocked) {
      showToast('Cannot modify records for a locked week.', 'error');
      return;
    }
    employees.forEach((emp) => {
      const leave = getApprovedLeave(emp.id, selectedDate);
      if (!leave) {
        markDailyAttendance(selectedDate, emp.id, 'Present');
      }
    });
    showToast(`Marked all available employees as Present for ${selectedDate}`, 'info');
  };

  const handleStatusChange = (empId: string, empName: string, status: DailyStatus) => {
    if (dateLocked) {
      showToast('This date falls in a locked Friday cycle.', 'error');
      return;
    }
    markDailyAttendance(selectedDate, empId, status);
    showToast(`${empName} marked as ${status}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Daily Attendance & Roll-Call</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Take daily attendance, auto-sync approved leaves, and lock the register every Friday.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isCurrentWeekLocked ? (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold shadow-sm">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Week Locked (Ending Fri, {currentFriday})</span>
            </div>
          ) : (
            <button
              onClick={() => setShowLockModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Week (Friday Lock)</span>
            </button>
          )}
        </div>
      </div>

      {/* Date Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-1.5">
            <CalendarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-white outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-2">
            {new Intl.DateTimeFormat('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(currentDateObj)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {dateLocked && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 px-3 py-1.5 rounded-lg">
              <Lock className="w-3.5 h-3.5" /> Week Locked
            </span>
          )}

          <button
            onClick={handleMarkAllPresent}
            disabled={dateLocked}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-all ${
              dateLocked
                ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            Mark All Available as Present
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="font-bold text-sm text-slate-800 dark:text-white">
            Daily Register — {selectedDate}
          </span>
          <span className="text-xs text-slate-400">{employees.length} Employees Enrolled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Approved Leave Status</th>
                <th className="px-6 py-3.5 text-center">Daily Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {employees.map((emp) => {
                const leave = getApprovedLeave(emp.id, selectedDate);
                const currentStatus: DailyStatus = leave
                  ? 'On Leave'
                  : dailyAttendance[selectedDate]?.[emp.id] || 'Present';

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{emp.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{emp.employeeCode} • {emp.designation}</div>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{emp.department}</td>

                    <td className="px-6 py-4">
                      {leave ? (
                        <div className="inline-flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-md font-semibold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{leave.leaveType} Leave {leave.isLOP ? '(LOP)' : '(Paid)'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No Leave Scheduled</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {leave ? (
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 italic">
                          Locked by Approved Leave
                        </span>
                      ) : (
                        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 gap-1">
                          <button
                            disabled={dateLocked}
                            onClick={() => handleStatusChange(emp.id, emp.name, 'Present')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            } ${dateLocked ? 'cursor-not-allowed opacity-60' : ''}`}
                          >
                            <Check className="w-3.5 h-3.5" /> Present
                          </button>

                          <button
                            disabled={dateLocked}
                            onClick={() => handleStatusChange(emp.id, emp.name, 'Half Day')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'Half Day'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            } ${dateLocked ? 'cursor-not-allowed opacity-60' : ''}`}
                          >
                            <Clock className="w-3.5 h-3.5" /> Half Day
                          </button>

                          <button
                            disabled={dateLocked}
                            onClick={() => handleStatusChange(emp.id, emp.name, 'Absent')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            } ${dateLocked ? 'cursor-not-allowed opacity-60' : ''}`}
                          >
                            <X className="w-3.5 h-3.5" /> Absent
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Friday Lock Confirmation Modal */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Confirm Friday Attendance Freeze
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to freeze attendance for the week ending <strong>Friday, {currentFriday}</strong>? Once locked, swipe adjustments are prohibited and cumulative LOP totals will be passed directly to the Run Payroll engine.
            </p>

            <div className="flex justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setShowLockModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmFridayLock}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
              >
                Confirm & Lock Week
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};