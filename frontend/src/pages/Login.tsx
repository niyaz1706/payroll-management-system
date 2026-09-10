import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, User, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { useHRData } from '../context/HRDataContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { employees, setCurrentEmployeeId } = useHRData();

  const [selectedRole, setSelectedRole] = useState<'hr' | 'admin' | 'employee'>('hr');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '1');
  const [email, setEmail] = useState('hr@company.com');
  const [password, setPassword] = useState('••••••••');

  const handleRoleChange = (role: 'hr' | 'admin' | 'employee') => {
    setSelectedRole(role);
    if (role === 'hr') {
      setEmail('hr@company.com');
    } else if (role === 'admin') {
      setEmail('owner@company.com');
    } else {
      const emp = employees.find((e) => e.id === selectedEmpId) || employees[0];
      setEmail(emp?.email || 'aarav.s@company.com');
    }
  };

  const handleEmployeeSelect = (empId: string) => {
    setSelectedEmpId(empId);
    const emp = employees.find((e) => e.id === empId);
    if (emp) setEmail(emp.email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_role', selectedRole);

    if (selectedRole === 'employee') {
      setCurrentEmployeeId(selectedEmpId);
      localStorage.setItem('current_employee_id', selectedEmpId);
      navigate('/employee');
    } else if (selectedRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-slate-800 dark:text-slate-100">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Acme Corp Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise Payroll & Workforce Compliance System
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          {/* Step 1: Select Role */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Select Your Access Portal
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleChange('hr')}
                className={`flex flex-col items-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  selectedRole === 'hr'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <User className="w-4 h-4 mb-1" />
                <span>HR Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex flex-col items-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  selectedRole === 'admin'
                    ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Shield className="w-4 h-4 mb-1" />
                <span>Admin / Owner</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('employee')}
                className={`flex flex-col items-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  selectedRole === 'employee'
                    ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <UserCheck className="w-4 h-4 mb-1" />
                <span>Employee</span>
              </button>
            </div>
          </div>

          {/* Employee Sub-Selection */}
          {selectedRole === 'employee' && (
            <div className="p-3 bg-teal-50/50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 rounded-xl space-y-1.5">
              <label className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                Select Active Employee Account
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 rounded-lg p-2 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employeeCode} - {emp.designation})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Official Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 outline-none font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 outline-none font-medium text-slate-800 dark:text-slate-200"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all mt-4 ${
                selectedRole === 'hr'
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                  : selectedRole === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                  : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'
              }`}
            >
              <span>Sign In to {selectedRole === 'hr' ? 'HR Portal' : selectedRole === 'admin' ? 'Admin Portal' : 'Employee Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Security badge footer */}
        <p className="text-center text-[11px] text-slate-400 mt-5">
          🔒 Secure 256-Bit Statutory Client-Side Compliance Engine
        </p>
      </div>
    </div>
  );
};