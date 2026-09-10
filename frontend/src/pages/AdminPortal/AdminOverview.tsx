import React from 'react';
import { useHRData } from '../../context/HRDataContext';
import { Landmark, Users, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOverview: React.FC = () => {
  const { calculatedPayroll, payrollStatus, payrollCycleMonth, employees } = useHRData();

  const totalGrossLiability = calculatedPayroll.reduce((acc, c) => acc + c.monthlyGross, 0);
  const totalNetDisbursement = calculatedPayroll.reduce((acc, c) => acc + c.netPay, 0);
  const totalEmployerPf = calculatedPayroll.reduce((acc, c) => acc + c.pfEmployer, 0);
  const totalStatutoryLiability = calculatedPayroll.reduce(
    (acc, c) => acc + c.pfEmployee + c.pfEmployer + c.pt + c.tds,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-purple-200 text-xs font-bold uppercase tracking-wider">Executive Command Center</span>
          <h2 className="text-2xl font-black mt-1">Company Payroll & Liability Summary</h2>
          <p className="text-purple-200 text-xs mt-0.5">
            Active Cycle: <strong>{payrollCycleMonth}</strong> • Current Batch Status: <strong>{payrollStatus}</strong>
          </p>
        </div>
        <Link
          to="/admin/approvals"
          className="self-start md:self-auto inline-flex items-center gap-2 bg-white text-purple-900 hover:bg-purple-50 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          Review Approvals <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Net Salary Disbursement
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">
            ₹{totalNetDisbursement.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 mt-1">Direct Bank Payout to {employees.length} Staff</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Gross CTC Wage Liability
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">
            ₹{totalGrossLiability.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 mt-1">Pre-LOP and Pre-deductions</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Statutory Deposit Due
          </span>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1.5">
            ₹{totalStatutoryLiability.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 mt-1">PF (Empr+Empe), PT & TDS</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Batch Approval Status
          </span>
          <div className="mt-1.5">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                payrollStatus === 'Approved & Locked'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : payrollStatus === 'Pending Approval'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {payrollStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Cycle: {payrollCycleMonth}</p>
        </div>
      </div>

      {/* Compliance & Bank Status Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
          <Landmark className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Department Payout Breakdown
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Designation</th>
                <th className="px-5 py-3 text-right">Gross Wage</th>
                <th className="px-5 py-3 text-right">Statutory Cuts</th>
                <th className="px-5 py-3 text-right">Bank Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {calculatedPayroll.map((rec) => (
                <tr key={rec.employeeId}>
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{rec.employeeName}</td>
                  <td className="px-5 py-3.5">{rec.designation}</td>
                  <td className="px-5 py-3.5 text-right font-medium">₹{rec.monthlyGross.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-right text-rose-600 dark:text-rose-400">
                    - ₹{rec.totalDeductions.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-purple-600 dark:text-purple-400 text-sm">
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