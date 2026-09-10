import React, { useState } from 'react';
import { Plus, Search, UserCheck, Mail, Building2, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import { useHRData } from '../../context/HRDataContext';
import { useToast } from '../../context/ToastContext';
import type { Employee } from '../../types';

export const EmployeeList: React.FC = () => {
  const { employees, addEmployee } = useHRData();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeCode: '',
    department: 'Engineering',
    designation: '',
    joiningDate: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    pan: '',
    uan: '',
    esiNumber: '',
    taxRegime: 'New' as 'New' | 'Old',
    ctc: 600000,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation rules
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    // Indian PAN validation: 5 letters, 4 digits, 1 letter
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.pan.toUpperCase())) {
      errs.pan = 'Invalid PAN format (e.g., ABCDE1234F).';
    }

    // Indian IFSC validation: 4 letters, '0', 6 alphanumeric
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(formData.ifscCode.toUpperCase())) {
      errs.ifscCode = 'Invalid IFSC code (e.g., HDFC0001234).';
    }

    // UAN: 12 digit format
    if (formData.uan.length !== 12 || isNaN(Number(formData.uan))) {
      errs.uan = 'UAN must be exactly 12 numeric digits.';
    }

    // Bank Account: between 9 and 18 digits
    if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
      errs.accountNumber = 'Account number must be between 9 and 18 digits.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the validation errors in the form.', 'error');
      return;
    }

    const monthlyGross = Math.round(formData.ctc / 12);
    const basic = Math.round(monthlyGross * 0.5);
    const hra = Math.round(basic * 0.5);
    const allowances = Math.round(monthlyGross - basic - hra);

    const newEmp: Employee = {
      id: Date.now().toString(),
      employeeCode: formData.employeeCode,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      designation: formData.designation,
      joiningDate: formData.joiningDate,
      status: 'Active',
      bankDetails: {
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode.toUpperCase(),
        bankName: formData.bankName,
      },
      statutory: {
        pan: formData.pan.toUpperCase(),
        uan: formData.uan,
        esiNumber: formData.esiNumber || undefined,
        taxRegime: formData.taxRegime,
      },
      salaryStructure: {
        ctc: Number(formData.ctc),
        basic,
        hra,
        allowances,
      },
    };

    addEmployee(newEmp);
    setIsModalOpen(false);
    showToast(`Employee ${formData.name} (${formData.employeeCode}) onboarded successfully!`, 'success');
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Employee Directory</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage employee personal records, tax regimes, and CTC assignments.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Onboard Employee
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-md">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, code, or department..."
          className="w-full text-sm outline-none bg-transparent text-slate-700 dark:text-slate-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Department & Role</th>
                <th className="px-6 py-3.5">Statutory (PAN / UAN)</th>
                <th className="px-6 py-3.5">Bank Details</th>
                <th className="px-6 py-3.5">Annual CTC</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{emp.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" /> {emp.email} • <span className="font-mono text-indigo-600 dark:text-indigo-400">{emp.employeeCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {emp.department}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{emp.designation}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    <div>PAN: {emp.statutory.pan}</div>
                    <div className="text-slate-500 dark:text-slate-400">UAN: {emp.statutory.uan}</div>
                    <span className="inline-block mt-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-sans font-medium">
                      {emp.statutory.taxRegime} Regime
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" /> {emp.bankDetails.bankName}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 font-mono">A/C: •••• {emp.bankDetails.accountNumber.slice(-4)}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    ₹{(emp.salaryStructure.ctc).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs px-2.5 py-1 rounded-full font-medium">
                      <UserCheck className="w-3 h-3" /> {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboarding Modal with Validation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Onboard New Employee</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Enter valid PAN, IFSC, and bank coordinates for payroll compliance.
            </p>

            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input required className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none" placeholder="e.g. Rahul Sharma" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Employee Code</label>
                  <input required className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none" placeholder="e.g. EMP003" onChange={(e) => setFormData({...formData, employeeCode: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Official Email</label>
                  <input type="email" required className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none" placeholder="rahul@company.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Department</label>
                  <select className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none" onChange={(e) => setFormData({...formData, department: e.target.value})}>
                    <option>Engineering</option>
                    <option>Human Resources</option>
                    <option>Finance</option>
                    <option>Operations</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Designation</label>
                  <input required className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none" placeholder="e.g. Product Analyst" onChange={(e) => setFormData({...formData, designation: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Joining Date</label>
                  <input type="date" required className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none" onChange={(e) => setFormData({...formData, joiningDate: e.target.value})} />
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <p className="font-semibold text-indigo-900 dark:text-indigo-400 mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Statutory & Bank Details (With Regex Validation)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">PAN Number</label>
                    <input
                      required
                      placeholder="ABCDE1234F"
                      className={`w-full mt-1 border rounded-lg p-2 font-mono uppercase outline-none ${
                        errors.pan ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    />
                    {errors.pan && <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="w-3 h-3" /> {errors.pan}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">UAN Number</label>
                    <input
                      required
                      maxLength={12}
                      placeholder="100XXXXXXXXX (12 digits)"
                      className={`w-full mt-1 border rounded-lg p-2 font-mono outline-none ${
                        errors.uan ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                      onChange={(e) => setFormData({ ...formData, uan: e.target.value })}
                    />
                    {errors.uan && <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="w-3 h-3" /> {errors.uan}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Bank Name</label>
                    <input required className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none" placeholder="e.g. HDFC Bank" onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Account Number</label>
                    <input
                      required
                      placeholder="Account Number"
                      className={`w-full mt-1 border rounded-lg p-2 font-mono outline-none ${
                        errors.accountNumber ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    />
                    {errors.accountNumber && <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="w-3 h-3" /> {errors.accountNumber}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">IFSC Code</label>
                    <input
                      required
                      placeholder="HDFC0001234"
                      className={`w-full mt-1 border rounded-lg p-2 font-mono uppercase outline-none ${
                        errors.ifscCode ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    />
                    {errors.ifscCode && <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="w-3 h-3" /> {errors.ifscCode}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Tax Regime</label>
                    <select className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 outline-none" onChange={(e) => setFormData({...formData, taxRegime: e.target.value as 'New' | 'Old'})}>
                      <option value="New">New Tax Regime</option>
                      <option value="Old">Old Tax Regime</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Annual CTC (INR)</label>
                <input type="number" required defaultValue={600000} className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg p-2 font-semibold outline-none" onChange={(e) => setFormData({...formData, ctc: Number(e.target.value)})} />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-sm">Save & Onboard</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};