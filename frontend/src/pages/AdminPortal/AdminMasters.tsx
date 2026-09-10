import React, { useState } from 'react';
import { useHRData } from '../../context/HRDataContext';
import { Sliders, Save, CheckCircle2 } from 'lucide-react';

export const AdminMasters: React.FC = () => {
  const { statutoryConfig, updateStatutoryConfig } = useHRData();
  const [form, setForm] = useState(statutoryConfig);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatutoryConfig(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Statutory & Formula Masters</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure statutory compliance rates (PF, ESI, Professional Tax) for automatic payroll processing.
          </p>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Statutory configurations successfully updated.
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl text-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Provident Fund (PF) Rules
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Employee Contribution (%)</label>
              <input
                type="number"
                value={form.pfEmployeeRate}
                onChange={(e) => setForm({ ...form, pfEmployeeRate: Number(e.target.value) })}
                className="w-full mt-1 p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Employer Contribution (%)</label>
              <input
                type="number"
                value={form.pfEmployerRate}
                onChange={(e) => setForm({ ...form, pfEmployerRate: Number(e.target.value) })}
                className="w-full mt-1 p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Employee State Insurance (ESI) Rules</h3>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Gross Wage Threshold (INR)</label>
              <input
                type="number"
                value={form.esiGrossLimit}
                onChange={(e) => setForm({ ...form, esiGrossLimit: Number(e.target.value) })}
                className="w-full mt-1 p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Employee Deduction (%)</label>
              <input
                type="number"
                step="0.05"
                value={form.esiEmployeeRate}
                onChange={(e) => setForm({ ...form, esiEmployeeRate: Number(e.target.value) })}
                className="w-full mt-1 p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Professional Tax (PT)</h3>
          <div className="mt-3">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Standard Monthly PT Deduction (INR)</label>
            <input
              type="number"
              value={form.ptDefault}
              onChange={(e) => setForm({ ...form, ptDefault: Number(e.target.value) })}
              className="w-full mt-1 p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg outline-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-colors"
          >
            <Save className="w-4 h-4" /> Save Master Settings
          </button>
        </div>
      </form>
    </div>
  );
};