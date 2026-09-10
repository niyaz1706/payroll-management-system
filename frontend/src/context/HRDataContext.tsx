import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Employee, MonthlyAttendance, LeaveRequest } from '../types';
import { calculatePayrollRecord } from '../utils/payrollEngine';
import type { CalculatedPayroll } from '../utils/payrollEngine';

export type DailyStatus = 'Present' | 'Absent' | 'Half Day' | 'On Leave';

export interface DailyAttendanceRecord {
  date: string; // YYYY-MM-DD
  records: Record<string, { status: DailyStatus; isLocked: boolean }>;
}

interface StatutoryConfig {
  pfEmployeeRate: number;
  pfEmployerRate: number;
  pfWageCeiling: number;
  esiGrossLimit: number;
  esiEmployeeRate: number;
  esiEmployerRate: number;
  ptDefault: number;
}

interface HRDataContextType {
  employees: Employee[];
  attendance: Record<string, MonthlyAttendance>;
  dailyAttendance: Record<string, Record<string, DailyStatus>>; // date -> { empId: status }
  lockedWeeks: string[]; // array of Friday dates (YYYY-MM-DD) indicating locked weeks
  leaveRequests: LeaveRequest[];
  payrollCycleMonth: string;
  payrollStatus: 'Draft' | 'Pending Approval' | 'Approved & Locked';
  workingDays: number;
  calculatedPayroll: CalculatedPayroll[];
  currentEmployeeId: string;
  statutoryConfig: StatutoryConfig;
  
  // Actions
  setCurrentEmployeeId: (id: string) => void;
  addEmployee: (emp: Employee) => void;
  markDailyAttendance: (date: string, empId: string, status: DailyStatus) => void;
  lockWeek: (fridayDate: string) => void;
  isDateLocked: (dateStr: string) => boolean;
  handleLeaveDecision: (leaveId: string, status: 'Approved' | 'Rejected') => void;
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status'>) => void;
  submitPayrollToAdmin: () => void;
  approveAndLockPayroll: () => void;
  rejectPayrollBatch: () => void;
  updateStatutoryConfig: (config: Partial<StatutoryConfig>) => void;
  setPayrollCycleMonth: (month: string) => void;
}

const defaultEmployees: Employee[] = [
  {
    id: '1',
    employeeCode: 'EMP001',
    name: 'Aarav Sharma',
    email: 'aarav.s@company.com',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    joiningDate: '2024-03-15',
    status: 'Active',
    bankDetails: {
      accountNumber: '987654321012',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
    },
    statutory: {
      pan: 'ABCDE1234F',
      uan: '100904567890',
      esiNumber: '',
      taxRegime: 'New',
    },
    salaryStructure: {
      ctc: 1200000,
      basic: 50000,
      hra: 25000,
      allowances: 25000,
    },
  },
  {
    id: '2',
    employeeCode: 'EMP002',
    name: 'Priya Patel',
    email: 'priya.p@company.com',
    department: 'Human Resources',
    designation: 'HR Executive',
    joiningDate: '2025-01-10',
    status: 'Active',
    bankDetails: {
      accountNumber: '112233445566',
      ifscCode: 'ICIC0005678',
      bankName: 'ICICI Bank',
    },
    statutory: {
      pan: 'XYZPE9876K',
      uan: '100802345678',
      taxRegime: 'Old',
    },
    salaryStructure: {
      ctc: 600000,
      basic: 25000,
      hra: 12500,
      allowances: 12500,
    },
  },
];

const defaultLeaves: LeaveRequest[] = [
  {
    id: 'REQ-101',
    employeeId: '1',
    employeeName: 'Aarav Sharma',
    leaveType: 'Casual',
    startDate: '2026-09-02',
    endDate: '2026-09-02',
    daysCount: 1,
    reason: 'Family emergency',
    status: 'Approved',
    isLOP: false,
  },
  {
    id: 'REQ-102',
    employeeId: '2',
    employeeName: 'Priya Patel',
    leaveType: 'Sick',
    startDate: '2026-09-01',
    endDate: '2026-09-02',
    daysCount: 2,
    reason: 'Viral fever',
    status: 'Approved',
    isLOP: true,
  },
];

const defaultStatutory: StatutoryConfig = {
  pfEmployeeRate: 12,
  pfEmployerRate: 12,
  pfWageCeiling: 15000,
  esiGrossLimit: 21000,
  esiEmployeeRate: 0.75,
  esiEmployerRate: 3.25,
  ptDefault: 200,
};

// Helper: Calculate Friday of a given date's week
export const getFridayOfWeek = (d: Date): string => {
  const date = new Date(d);
  const day = date.getDay(); // 0 is Sun, 5 is Fri
  const diff = day <= 5 ? 5 - day : 5 - day + 7;
  date.setDate(date.getDate() + diff);
  return date.toISOString().split('T')[0];
};

const HRDataContext = createContext<HRDataContextType | undefined>(undefined);

export const HRDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('hr_employees');
    return saved ? JSON.parse(saved) : defaultEmployees;
  });

  const [dailyAttendance, setDailyAttendance] = useState<Record<string, Record<string, DailyStatus>>>(() => {
    const saved = localStorage.getItem('hr_daily_attendance');
    return saved ? JSON.parse(saved) : {};
  });

  const [lockedWeeks, setLockedWeeks] = useState<string[]>(() => {
    const saved = localStorage.getItem('hr_locked_weeks');
    return saved ? JSON.parse(saved) : [];
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('hr_leaves');
    return saved ? JSON.parse(saved) : defaultLeaves;
  });

  const [payrollCycleMonth, setPayrollCycleMonth] = useState('September 2026');
  const [payrollStatus, setPayrollStatus] = useState<'Draft' | 'Pending Approval' | 'Approved & Locked'>('Draft');
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>('1');
  const [statutoryConfig, setStatutoryConfig] = useState<StatutoryConfig>(defaultStatutory);

  const workingDays = 22;

  useEffect(() => {
    localStorage.setItem('hr_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('hr_daily_attendance', JSON.stringify(dailyAttendance));
  }, [dailyAttendance]);

  useEffect(() => {
    localStorage.setItem('hr_locked_weeks', JSON.stringify(lockedWeeks));
  }, [lockedWeeks]);

  useEffect(() => {
    localStorage.setItem('hr_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const addEmployee = (emp: Employee) => {
    setEmployees((prev) => [emp, ...prev]);
  };

  const isDateLocked = (dateStr: string): boolean => {
    const d = new Date(dateStr);
    const fri = getFridayOfWeek(d);
    return lockedWeeks.includes(fri);
  };

  const markDailyAttendance = (date: string, empId: string, status: DailyStatus) => {
    if (isDateLocked(date)) {
      alert('This week has already been locked on Friday. Changes are restricted.');
      return;
    }

    setDailyAttendance((prev) => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [empId]: status,
      },
    }));
  };

  const lockWeek = (fridayDate: string) => {
    if (!lockedWeeks.includes(fridayDate)) {
      setLockedWeeks((prev) => [...prev, fridayDate]);
    }
  };

  const handleLeaveDecision = (leaveId: string, status: 'Approved' | 'Rejected') => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status } : l))
    );
  };

  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...req,
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending',
    };
    setLeaveRequests((prev) => [newRequest, ...prev]);
  };

  const submitPayrollToAdmin = () => setPayrollStatus('Pending Approval');
  const approveAndLockPayroll = () => setPayrollStatus('Approved & Locked');
  const rejectPayrollBatch = () => setPayrollStatus('Draft');
  const updateStatutoryConfig = (cfg: Partial<StatutoryConfig>) => setStatutoryConfig((p) => ({ ...p, ...cfg }));

  // Dynamic computation of monthly attendance totals from daily logs + approved leaves
  const attendance: Record<string, MonthlyAttendance> = {};
  employees.forEach((emp) => {
    let presentCount = 0;
    let halfCount = 0;
    let absentCount = 0;
    let lopDays = 0;

    // Aggregate from daily logs
    Object.entries(dailyAttendance).forEach(([d, dayRecords]) => {
      const status = dayRecords[emp.id];
      if (status === 'Present') presentCount += 1;
      else if (status === 'Half Day') {
        halfCount += 1;
        presentCount += 0.5;
        lopDays += 0.5;
      } else if (status === 'Absent') {
        absentCount += 1;
        lopDays += 1;
      }
    });

    // Add approved LOP leaves
    const approvedLopLeaves = leaveRequests.filter(
      (l) => l.employeeId === emp.id && l.status === 'Approved' && l.isLOP
    );
    const approvedLopDays = approvedLopLeaves.reduce((acc, l) => acc + l.daysCount, 0);

    const totalLop = Math.max(lopDays, approvedLopDays);
    const finalPresent = Math.max(0, workingDays - totalLop);

    attendance[emp.id] = {
      employeeId: emp.id,
      presentDays: finalPresent,
      absentDays: totalLop,
      halfDays: halfCount,
      lopDays: totalLop,
    };
  });

  const calculatedPayroll: CalculatedPayroll[] = employees.map((emp) => {
    const att = attendance[emp.id];
    return calculatePayrollRecord(emp, att, workingDays);
  });

  return (
    <HRDataContext.Provider
      value={{
        employees,
        attendance,
        dailyAttendance,
        lockedWeeks,
        leaveRequests,
        payrollCycleMonth,
        payrollStatus,
        workingDays,
        calculatedPayroll,
        currentEmployeeId,
        statutoryConfig,
        setCurrentEmployeeId,
        addEmployee,
        markDailyAttendance,
        lockWeek,
        isDateLocked,
        handleLeaveDecision,
        submitLeaveRequest,
        submitPayrollToAdmin,
        approveAndLockPayroll,
        rejectPayrollBatch,
        updateStatutoryConfig,
        setPayrollCycleMonth,
      }}
    >
      {children}
    </HRDataContext.Provider>
  );
};

export const useHRData = () => {
  const context = useContext(HRDataContext);
  if (!context) throw new Error('useHRData must be used within an HRDataProvider');
  return context;
};