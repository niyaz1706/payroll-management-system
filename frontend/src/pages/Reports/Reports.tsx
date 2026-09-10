import React, { useState } from 'react';
import { Download, FileText, Printer, Building2, X } from 'lucide-react';
import { useHRData } from '../../context/HRDataContext';
import type { CalculatedPayroll } from '../../utils/payrollEngine';
import * as XLSX from 'xlsx';

export const Reports: React.FC = () => {
  const { calculatedPayroll, payrollCycleMonth } = useHRData();
  const [selectedSlip, setSelectedSlip] = useState<CalculatedPayroll | null>(null);

  // Real client-side Excel download
  const handleExportExcel = () => {
    const exportData = calculatedPayroll.map((p) => ({
      'Employee Code': p.employeeCode,
      'Employee Name': p.employeeName,
      'Department': p.department,
      'Monthly Gross': p.monthlyGross,
      'LOP Days': p.lopDays,
      'LOP Cut': p.lopDeduction,
      'Basic Pay': p.basic,
      'HRA': p.hra,
      'Allowances': p.allowances,
      'PF (Employee)': p.pfEmployee,
      'Prof Tax (PT)': p.pt,
      'TDS (Tax)': p.tds,
      'Total Deductions': p.totalDeductions,
      'Net Pay': p.netPay,
      'Employer PF': p.pfEmployer,
      'Payment Month': payrollCycleMonth,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Salary Register');
    XLSX.writeFile(wb, `Salary_Register_${payrollCycleMonth.replace(' ', '_')}.xlsx`);
  };

  // Grouping costs by department
  const deptSummary = calculatedPayroll.reduce((acc, curr) => {
    if (!acc[curr.department]) {
      acc[curr.department] = { count: 0, netPayout: 0, employerPf: 0 };
    }
    acc[curr.department].count += 1;
    acc[curr.department].netPayout += curr.netPay;
    acc[curr.department].employerPf += curr.pfEmployer;
    return acc;
  }, {} as Record<string, { count: number; netPayout: number; employerPf: number }>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Reports & Payslips</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate client-side Excel salary registers, view departmental payouts, and print individual employee payslips.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Export Excel Sheet
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Print All
          </button>
        </div>
      </div>

      {/* Department-wise Cost Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(deptSummary).map(([dept, data]) => (
          <div key={dept} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {dept}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{data.count} {data.count === 1 ? 'Employee' : 'Employees'}</span>
            </div>
            <div className="mt-3 flex justify-between items-end">
              <div>
                <div className="text-xs text-slate-400">Total Net Payout</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">₹{data.netPayout.toLocaleString('en-IN')}</div>
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-md">
                Employer PF: ₹{data.employerPf.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Payslip Generation Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Generated Payslips — {payrollCycleMonth}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Employee</th>
                <th className="px-5 py-3.5">Designation</th>
                <th className="px-5 py-3.5">Net Payout</th>
                <th className="px-5 py-3.5 text-center">Payslip Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {calculatedPayroll.map((slip) => (
                <tr key={slip.employeeId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{slip.employeeName}</div>
                    <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{slip.employeeCode}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400">{slip.designation}</td>
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">₹{slip.netPay.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => setSelectedSlip(slip)}
                      className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> View & Print Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Formatted Payslip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded text-xs">PR</span>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Payslip — {payrollCycleMonth}</h3>
              </div>
              <button
                onClick={() => setSelectedSlip(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Employee Info Header */}
            <div className="grid grid-cols-2 gap-2 text-xs py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 rounded-lg p-3 my-3">
              <div>
                <p className="text-slate-400">Employee Name:</p>
                <p className="font-bold text-slate-800 dark:text-white">{selectedSlip.employeeName}</p>
                <p className="text-slate-400 mt-1">Designation & Dept:</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">{selectedSlip.designation} ({selectedSlip.department})</p>
              </div>
              <div>
                <p className="text-slate-400">Employee Code / PAN:</p>
                <p className="font-mono text-slate-700 dark:text-slate-300 font-medium">{selectedSlip.employeeCode} / {selectedSlip.pan}</p>
                <p className="text-slate-400 mt-1">Bank / A/C:</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">{selectedSlip.bankName} (•••• {selectedSlip.accountNumber.slice(-4)})</p>
              </div>
            </div>

            {/* Earnings & Deductions Table */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              {/* Earnings Column */}
              <div className="border-r border-slate-200 dark:border-slate-800">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 font-bold text-slate-700 dark:text-slate-200">Earnings</div>
                <div className="p-3 space-y-2 dark:text-slate-300">
                  <div className="flex justify-between"><span>Basic Salary</span><span className="font-medium text-slate-900 dark:text-white">₹{selectedSlip.basic.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>HRA</span><span className="font-medium text-slate-900 dark:text-white">₹{selectedSlip.hra.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Special Allowances</span><span className="font-medium text-slate-900 dark:text-white">₹{selectedSlip.allowances.toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              {/* Deductions Column */}
              <div>
                <div className="bg-slate-100 dark:bg-slate-800 p-2 font-bold text-slate-700 dark:text-slate-200">Deductions</div>
                <div className="p-3 space-y-2 dark:text-slate-300">
                  <div className="flex justify-between"><span>PF (Employee)</span><span className="font-medium text-slate-900 dark:text-white">₹{selectedSlip.pfEmployee.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Prof Tax (PT)</span><span className="font-medium text-slate-900 dark:text-white">₹{selectedSlip.pt.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>TDS / Income Tax</span><span className="font-medium text-slate-900 dark:text-white">₹{selectedSlip.tds.toLocaleString('en-IN')}</span></div>
                  {selectedSlip.lopDeduction > 0 && (
                    <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
                      <span>LOP ({selectedSlip.lopDays} days)</span>
                      <span>- ₹{selectedSlip.lopDeduction.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Net Salary Banner */}
            <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 rounded-xl p-4 my-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold block">Net Salary Payable</span>
                <span className="text-xl font-black text-indigo-950 dark:text-indigo-200">
                  ₹{selectedSlip.netPay.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right text-[11px] text-indigo-600 dark:text-indigo-400">
                Employer PF Contribution: <strong>₹{selectedSlip.pfEmployer.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Print Action */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow"
              >
                <Printer className="w-3.5 h-3.5" /> Print Single Payslip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};