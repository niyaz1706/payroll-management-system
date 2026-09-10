import React, { useState } from 'react';
import { useHRData } from '../../context/HRDataContext';
import { Plus, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const EmployeeLeaves: React.FC = () => {
  const { employees, currentEmployeeId, leaveRequests, submitLeaveRequest } = useHRData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const currentEmp = employees.find((e) => e.id === currentEmployeeId) || employees[0];
  const myLeaves = leaveRequests.filter((l) => l.employeeId === currentEmp.id);

  const [form, setForm] = useState({
    leaveType: 'Casual' as 'Casual' | 'Sick' | 'Earned',
    startDate: '',
    endDate: '',
    daysCount: 1,
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequest({
      employeeId: currentEmp.id,
      employeeName: currentEmp.name,
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      daysCount: Number(form.daysCount),
      reason: form.reason,
      isLOP: form.daysCount > 2, // Flags as LOP if exceeding 2 days for demo
    });

    setIsModalOpen(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Leave Requests & Balances</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Apply for leave and monitor approval status from the HR team.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Leave request submitted successfully and queued for HR review.
        </div>
      )}

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 uppercase font-semibold">Casual Leave (CL)</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">10 / 12 Days Remaining</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 uppercase font-semibold">Sick Leave (SL)</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">11 / 12 Days Remaining</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 uppercase font-semibold">Unpaid Leave (LOP)</div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">Deducts Per-Day Gross</div>
        </div>
      </div>

      {/* My Leave History */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 text-sm">
          My Application History
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {myLeaves.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-400">No leaves applied yet.</p>
          ) : (
            myLeaves.map((req) => (
              <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{req.leaveType} Leave</span>
                    <span className="text-slate-400">({req.daysCount} {req.daysCount === 1 ? 'day' : 'days'})</span>
                    {req.isLOP && (
                      <span className="text-[10px] bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900 font-bold">
                        LOP
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {req.startDate} to {req.endDate} • "{req.reason}"
                  </p>
                </div>
                <span
                  className={`self-start sm:self-auto px-3 py-1 rounded-full font-semibold ${
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

      {/* Apply Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Apply for Leave</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Request will be routed to HR for approval.</p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Leave Type</label>
                <select
                  value={form.leaveType}
                  onChange={(e) => setForm({ ...form, leaveType: e.target.value as any })}
                  className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none"
                >
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Earned">Earned Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
                  <input
                    type="date"
                    required
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">End Date</label>
                  <input
                    type="date"
                    required
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Total Days</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  required
                  value={form.daysCount}
                  onChange={(e) => setForm({ ...form, daysCount: Number(e.target.value) })}
                  className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Reason for Leave</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide a brief explanation..."
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};