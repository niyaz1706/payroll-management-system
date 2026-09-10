import React from 'react';
import { useHRData } from '../../context/HRDataContext';
import { Landmark, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export const AdminDisbursements: React.FC = () => {
  const { calculatedPayroll, payrollCycleMonth } = useHRData();

  const handleExportBankAdvice = () => {
    const data = calculatedPayroll.map((p) => ({
      'Beneficiary Name': p.employeeName,
      'Account Number': p.accountNumber,
      'Bank Name': p.bankName,
      'IFSC Code': 'HDFC0001234',
      'Net Payout (INR)': p.netPay,
      'Narration': `Salary for ${payrollCycleMonth}`,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bank_Transfer_Advice');
    XLSX.writeFile(wb, `Bank_Advice_${payrollCycleMonth.replace(' ', '_')}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Bank Transfer Advice</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Download standard bank file format for corporate bulk disbursement.
          </p>
        </div>

        <button
          onClick={handleExportBankAdvice}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export Bank File (.xlsx)
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
          <Landmark className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Beneficiary Account Schedule ({payrollCycleMonth})
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase">
            <tr>
              <th className="px-5 py-3">Beneficiary</th>
              <th className="px-5 py-3">Bank & Account</th>
              <th className="px-5 py-3 text-right">Net Transfer Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {calculatedPayroll.map((rec) => (
              <tr key={rec.employeeId}>
                <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{rec.employeeName}</td>
                <td className="px-5 py-3.5 font-mono text-slate-500 dark:text-slate-400">{rec.bankName} (•••• {rec.accountNumber.slice(-4)})</td>
                <td className="px-5 py-3.5 text-right font-bold text-purple-600 dark:text-purple-400 text-sm">
                  ₹{rec.netPay.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};