import React, { useState } from 'react';
import { Building2, Percent, Calendar, Layers, Plus } from 'lucide-react';

export const Masters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'company' | 'statutory' | 'salary' | 'holidays'>('company');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">System Masters & Settings</h2>
        <p className="text-sm text-slate-500">Configure global rules, statutory rates, departments, and holiday calendar.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-medium text-slate-500">
        <button
          onClick={() => setActiveTab('company')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'company' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent hover:text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" /> Organization & Depts
        </button>
        <button
          onClick={() => setActiveTab('statutory')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'statutory' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent hover:text-slate-700'
          }`}
        >
          <Percent className="w-4 h-4" /> Statutory Rates (PF/ESI/PT)
        </button>
        <button
          onClick={() => setActiveTab('salary')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'salary' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" /> Salary Components
        </button>
        <button
          onClick={() => setActiveTab('holidays')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'holidays' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" /> Holiday Calendar
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'company' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 text-sm">Company Profile</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-600">Company Legal Name</label>
                <input defaultValue="Acme Corp Private Limited" className="w-full mt-1 p-2 border rounded-lg" />
              </div>
              <div>
                <label className="font-medium text-slate-600">Company PAN / TAN</label>
                <input defaultValue="AAACA1234F / BLRA12345E" className="w-full mt-1 p-2 border rounded-lg font-mono" />
              </div>
              <div>
                <label className="font-medium text-slate-600">Registered Office Location</label>
                <input defaultValue="Bangalore, Karnataka, India" className="w-full mt-1 p-2 border rounded-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 text-sm">Active Departments</h3>
              <button className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add Dept
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {['Engineering', 'Human Resources', 'Finance & Accounts', 'Operations & Sales'].map((dept) => (
                <div key={dept} className="p-2.5 bg-slate-50 border rounded-lg flex justify-between items-center">
                  <span className="font-medium text-slate-700">{dept}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'statutory' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl space-y-4 text-xs">
          <h3 className="font-semibold text-slate-800 text-sm">Statutory Deduction Rules</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border rounded-lg space-y-1">
              <label className="font-semibold text-slate-700">Provident Fund (PF %)</label>
              <p className="text-[11px] text-slate-500">Employee & Employer contribution rate</p>
              <input type="number" defaultValue={12} className="w-full mt-1 p-2 border rounded font-semibold" />
            </div>
            <div className="p-3 bg-slate-50 border rounded-lg space-y-1">
              <label className="font-semibold text-slate-700">ESI Rate (%)</label>
              <p className="text-[11px] text-slate-500">Applicable if gross salary &lt;= 21,000</p>
              <input type="number" defaultValue={0.75} className="w-full mt-1 p-2 border rounded font-semibold" />
            </div>
            <div className="p-3 bg-slate-50 border rounded-lg space-y-1">
              <label className="font-semibold text-slate-700">Professional Tax (PT Slab)</label>
              <p className="text-[11px] text-slate-500">Fixed deduction per state rules</p>
              <input type="number" defaultValue={200} className="w-full mt-1 p-2 border rounded font-semibold" />
            </div>
            <div className="p-3 bg-slate-50 border rounded-lg space-y-1">
              <label className="font-semibold text-slate-700">Default Tax Slabs</label>
              <p className="text-[11px] text-slate-500">New Regime Default Slabs</p>
              <input defaultValue="FY 2026-27 Active" disabled className="w-full mt-1 p-2 border rounded bg-slate-100 font-semibold" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
          <h3 className="font-semibold text-slate-800 text-sm">Salary Formula Components (Section 4.4)</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border rounded-lg bg-slate-50">
              <div>
                <p className="font-bold text-slate-800">Basic Pay</p>
                <p className="text-slate-500">Fixed formula: 50% of Monthly CTC</p>
              </div>
              <span className="text-indigo-600 font-mono font-semibold">Formula-based</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg bg-slate-50">
              <div>
                <p className="font-bold text-slate-800">House Rent Allowance (HRA)</p>
                <p className="text-slate-500">Fixed formula: 50% of Basic Pay</p>
              </div>
              <span className="text-indigo-600 font-mono font-semibold">Formula-based</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg bg-slate-50">
              <div>
                <p className="font-bold text-slate-800">Special Allowances</p>
                <p className="text-slate-500">Balancing figure (CTC - Basic - HRA)</p>
              </div>
              <span className="text-indigo-600 font-mono font-semibold">Calculated</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'holidays' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
          <h3 className="font-semibold text-slate-800 text-sm">2026 Holiday Calendar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { date: '15 Aug 2026', name: 'Independence Day', type: 'National' },
              { date: '02 Oct 2026', name: 'Gandhi Jayanti', type: 'National' },
              { date: '20 Oct 2026', name: 'Dussehra', type: 'Regional' },
              { date: '08 Nov 2026', name: 'Diwali', type: 'National' },
            ].map((h) => (
              <div key={h.name} className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{h.name}</p>
                  <p className="text-slate-500">{h.date}</p>
                </div>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold text-[10px]">{h.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};