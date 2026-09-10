import React, { useState } from 'react';
import { useHRData } from '../../context/HRDataContext';
import { FileText, Printer, Download, X } from 'lucide-react';

export const EmployeePayslips: React.FC = () => {
  const { employees, currentEmployeeId, calculatedPayroll, payrollCycleMonth } = useHRData();
  const [showSlipModal, setShowSlipModal] = useState(false);

  const currentEmp = employees.find((e) => e.id === currentEmployeeId) || employees[0];
  const slip = calculatedPayroll.find((p) => p.employeeId === currentEmp.id);

  if (!slip) {
    return <div className="text-slate-400 text-sm">No payroll record found for the current cycle.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Salary Payslips</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access, view, and print your itemized monthly payslips.
          </p>
        </div>
      </div>

      {/* Available Payslips Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Payroll Month</th>
              <th className="px-5 py-3.5">Gross Pay</th>
              <th className="px-5 py-3.5">Deductions</th>
              <th className="px-5 py-3.5">Net Disbursed</th>
              <th className="px-5 py-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 text-xs">
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">{payrollCycleMonth}</td>
              <td className="px-5 py-4">₹{slip.monthlyGross.toLocaleString('en-IN')}</td>
              <td className="px-5 py-4 text-rose-600 dark:text-rose-400 font-medium">
                - ₹{slip.totalDeductions.toLocaleString('en-IN')}
              </td>
              <td className="px-5 py-4 font-bold text-teal-600 dark:text-teal-400 text-sm">
                ₹{slip.netPay.toLocaleString('en-IN')}
              </td>
              <td className="px-5 py-4 text-center">
                <button
                  onClick={() => setShowSlipModal(true)}
                  className="inline-flex items-center gap-1.5 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" /> View Payslip
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payslip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-teal-600 text-white font-bold px-2 py-0.5 rounded text-xs">AC</span>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Payslip — {payrollCycleMonth}</h3>
              </div>
              <button
                onClick={() => setShowSlipModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Employee Details */}
            <div className="grid grid-cols-2 gap-2 text-xs py-3 my-3 bg-slate-50/70 dark:bg-slate-950/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-slate-400">Employee Name:</p>
                <p className="font-bold text-slate-800 dark:text-white">{slip.employeeName}</p>
                <p className="text-slate-400 mt-1">Designation & Dept:</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">{slip.designation} ({slip.department})</p>
              </div>
              <div>
                <p className="text-slate-400">Employee Code / PAN:</p>
                <p className="font-mono text-slate-700 dark:text-slate-300 font-medium">{slip.employeeCode} / {slip.pan}</p>
                <p className="text-slate-400 mt-1">Bank / A/C:</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">{slip.bankName} (•••• {slip.accountNumber.slice(-4)})</p>
              </div>
            </div>

            {/* Earnings & Deductions Breakup */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <div className="border-r border-slate-200 dark:border-slate-800">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 font-bold text-slate-700 dark:text-slate-200">Earnings</div>
                <div className="p-3 space-y-2 dark:text-slate-300">
                  <div className="flex justify-between"><span>Basic Salary</span><span className="font-medium text-slate-900 dark:text-white">₹{slip.basic.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>HRA</span><span className="font-medium text-slate-900 dark:text-white">₹{slip.hra.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Allowances</span><span className="font-medium text-slate-900 dark:text-white">₹{slip.allowances.toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              <div>
                <div className="bg-slate-100 dark:bg-slate-800 p-2 font-bold text-slate-700 dark:text-slate-200">Deductions</div>
                <div className="p-3 space-y-2 dark:text-slate-300">
                  <div className="flex justify-between"><span>PF (Employee)</span><span className="font-medium text-slate-900 dark:text-white">₹{slip.pfEmployee.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Prof Tax</span><span className="font-medium text-slate-900 dark:text-white">₹{slip.pt.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>TDS (Tax)</span><span className="font-medium text-slate-900 dark:text-white">₹{slip.tds.toLocaleString('en-IN')}</span></div>
                  {slip.lopDeduction > 0 && (
                    <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
                      <span>LOP ({slip.lopDays} days)</span>
                      <span>- ₹{slip.lopDeduction.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Net Salary Payable */}
            <div className="bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900/60 rounded-xl p-4 my-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-700 dark:text-teal-300 font-semibold block">Net Disbursed</span>
                <span className="text-xl font-black text-teal-950 dark:text-teal-200">₹{slip.netPay.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right text-[11px] text-teal-600 dark:text-teal-400">
                Employer PF Contribution: <strong>₹{slip.pfEmployer.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow"
              >
                <Printer className="w-3.5 h-3.5" /> Print Payslip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};