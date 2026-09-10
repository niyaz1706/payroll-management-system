import React, { useState } from 'react';
import { 
  Shield, 
  Database, 
  Check, 
  Save, 
  Download, 
  Smartphone 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'security' | 'backup'>('security');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    sessionTimeout: '30',
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">App Settings & Security</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure portal access security, authentication controls, and data exports.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Security settings updated successfully!
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'security' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold' 
              : 'border-transparent hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" /> Security & Access
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'backup' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold' 
              : 'border-transparent hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" /> Data Export & Backups
        </button>
      </div>

      {/* Tab 1: Security & Access */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 max-w-2xl text-xs">
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">Security & Authentication</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage session expiry and dual-factor authentications.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">Two-Factor Authentication (2FA)</p>
                  <p className="text-slate-500 dark:text-slate-400">Require an OTP when running final payroll and downloading salary registers.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={securitySettings.twoFactor}
                onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactor: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Session Inactivity Timeout</label>
              <select
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg p-2.5 outline-none"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="60">1 Hour</option>
                <option value="120">2 Hours</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Data Export & Backups */}
      {activeTab === 'backup' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-2xl text-xs">
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">Data Backups & Export</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Download full snapshots of employee, payroll, and attendance history.</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Full Database JSON Snapshot</p>
                <p className="text-slate-500 dark:text-slate-400">Includes all master settings, salary breakups, and past months.</p>
              </div>
              <button
                onClick={() => alert('Exporting full database JSON...')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download JSON
              </button>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Annual Statutory Audit Report</p>
                <p className="text-slate-500 dark:text-slate-400">Compiled PDF report containing PF, ESI, and Form 16 TDS summary.</p>
              </div>
              <button
                onClick={() => alert('Generating Annual Audit PDF...')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};