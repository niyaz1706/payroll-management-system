import React from 'react';
import { 
  Calculator, 
  Send, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useHRData } from '../../context/HRDataContext';

export const PayrollRun: React.FC = () => {
  const { calculatedPayroll, payrollCycleMonth, payrollStatus, submitPayrollToAdmin } = useHRData();

  const totalGross = calculatedPayroll.reduce((acc, curr) => acc + curr.monthlyGross, 0);
  const totalDeductions = calculatedPayroll.reduce((acc, curr) => acc + curr.totalDeductions, 0);
  const totalNetPayout = calculatedPayroll.reduce((acc, curr) => acc + curr.netPay, 0);

  const isSubmitted = payrollStatus !== 'Draft';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Run Payroll & Compliance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamic statutory calculations, live LOP adjustments, and batch submission for approval.
          </p>
        </div>

        <button
          onClick={submitPayrollToAdmin}
          disabled={isSubmitted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all ${
            isSubmitted
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isSubmitted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Submitted for Approval
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Submit to Admin
            </>
          )}
        </button>
      </div>

      {/* Submission Status Alert */}
      {isSubmitted && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 px-4 py-3 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Payroll batch for <strong>{payrollCycleMonth}</strong> has been locked by HR and sent to the <strong>Owner/Admin</strong> for final payout approval.
            </span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded">
            Status: {payrollStatus}
          </span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Gross Wages</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">₹{totalGross.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400 mt-1">Before LOP and Statutory cuts</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Deductions (LOP + Tax)</div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1.5">- ₹{totalDeductions.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400 mt-1">PF, PT, TDS & Leave adjustments</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 shadow-sm bg-gradient-to-br from-indigo-50/50 dark:from-indigo-950/30 to-white dark:to-slate-900">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Net Payout Amount</div>
          <div className="text-2xl font-bold text-indigo-950 dark:text-indigo-200 mt-1.5">₹{totalNetPayout.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400 mt-1">Estimated bank disbursement</div>
        </div>
      </div>

      {/* Calculations Preview Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm">
            <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Payroll Calculation Sheet ({payrollCycleMonth})
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> PF (12%) • PT (₹200) • Live Engine Computed
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Employee</th>
                <th className="px-5 py-3.5 text-right">Gross Pay</th>
                <th className="px-5 py-3.5 text-right">LOP Deduction</th>
                <th className="px-5 py-3.5 text-right">PF (12%)</th>
                <th className="px-5 py-3.5 text-right">Prof Tax</th>
                <th className="px-5 py-3.5 text-right">TDS (IT)</th>
                <th className="px-5 py-3.5 text-right text-indigo-900 dark:text-indigo-300 font-bold">Net Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {calculatedPayroll.map((rec) => (
                <tr key={rec.employeeId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{rec.employeeName}</div>
                    <div className="text-xs text-slate-400">{rec.department}</div>
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-slate-800 dark:text-slate-200">
                    ₹{rec.monthlyGross.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-right text-rose-600 dark:text-rose-400 font-medium">
                    {rec.lopDeduction > 0 ? `- ₹${rec.lopDeduction.toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-400 font-mono text-xs">
                    ₹{rec.pfEmployee.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-400 font-mono text-xs">
                    ₹{rec.pt.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-400 font-mono text-xs">
                    ₹{rec.tds.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-indigo-600 dark:text-indigo-400 text-base">
                    ₹{rec.netPay.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};