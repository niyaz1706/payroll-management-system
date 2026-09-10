import React, { useState } from 'react';
import { Check, X, AlertTriangle, Calendar, User } from 'lucide-react';
import { useHRData } from '../../context/HRDataContext';

export const LeaveApprovals: React.FC = () => {
  const { leaveRequests, handleLeaveDecision } = useHRData();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');

  const filteredRequests = leaveRequests.filter((r) =>
    filter === 'All' ? true : r.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Leave Approvals & Balances</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review leave requests. Approving an LOP-flagged leave automatically updates the attendance deduction.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-slate-200/70 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Balances Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            CL
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Standard Casual Leave</div>
            <div className="text-sm font-semibold text-slate-800 dark:text-white">12 Days / Year</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            SL
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Standard Sick Leave</div>
            <div className="text-sm font-semibold text-slate-800 dark:text-white">12 Days / Year</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Auto-LOP Safeguard</div>
            <div className="text-sm font-semibold text-slate-800 dark:text-white">Deducts from current month</div>
          </div>
        </div>
      </div>

      {/* Requests Queue */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-400">
            No {filter.toLowerCase()} leave requests found.
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    {req.employeeName}
                  </span>
                  <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    {req.leaveType} Leave
                  </span>
                  {req.isLOP && (
                    <span className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      LOP Flagged (Exceeds Balance)
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">#{req.id}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {req.startDate} to {req.endDate} ({req.daysCount} {req.daysCount === 1 ? 'day' : 'days'})
                  </div>
                  <div>• Reason: <span className="text-slate-700 dark:text-slate-300 font-medium">"{req.reason}"</span></div>
                </div>
              </div>

              {/* Actions or Status */}
              <div className="shrink-0">
                {req.status === 'Pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLeaveDecision(req.id, 'Approved')}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleLeaveDecision(req.id, 'Rejected')}
                      className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      req.status === 'Approved'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {req.status === 'Approved' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};