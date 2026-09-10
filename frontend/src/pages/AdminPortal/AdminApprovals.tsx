import React, { useState } from 'react';
import { useHRData } from '../../context/HRDataContext';
import { Lock, Unlock, CheckCircle2, XCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

export const AdminApprovals: React.FC = () => {
  const { payrollStatus, payrollCycleMonth, calculatedPayroll, approveAndLockPayroll, rejectPayrollBatch } = useHRData();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const totalPayout = calculatedPayroll.reduce((acc, c) => acc + c.netPay, 0);

  const handleApprove = () => {
    approveAndLockPayroll();
    setSuccessMsg('Payroll has been approved and locked. Salary disbursement file generated.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleReject = () => {
    rejectPayrollBatch();
    setSuccessMsg('Payroll batch rejected and sent back to HR as Draft.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Batch Approvals & Lock Control</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review monthly payroll submissions from HR and authorize final bank transfers.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          {successMsg}
        </div>
      )}

      {/* Main Lock Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Target Cycle</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{payrollCycleMonth} Payroll Batch</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Total Payout Requirement: <strong className="text-slate-900 dark:text-white font-bold text-sm">₹{totalPayout.toLocaleString('en-IN')}</strong> across {calculatedPayroll.length} employees
            </p>
          </div>

          <div className="flex items-center gap-3">
            {payrollStatus === 'Approved & Locked' ? (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-2.5 rounded-xl font-bold text-xs">
                <Lock className="w-4 h-4" /> Locked for Disbursement
              </div>
            ) : (
              <>
                <button
                  onClick={handleReject}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <XCircle className="w-4 h-4" /> Reject to HR
                </button>
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Lock Batch
                </button>
              </>
            )}
          </div>
        </div>

        {/* Warning / Audit details */}
        <div className="mt-5 flex items-start gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl text-xs text-slate-600 dark:text-slate-400">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            Locking payroll finalizes all pro-rata LOP deductions, calculates end-of-month bank liabilities, and enables salary slip access for employees. This action should only be taken after verifying attendance registers.
          </span>
        </div>
      </div>
    </div>
  );
};