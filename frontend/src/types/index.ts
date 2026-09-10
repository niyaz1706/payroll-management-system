export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: 'Onboarding' | 'Active' | 'Exited';
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  statutory: {
    pan: string;
    uan: string;
    esiNumber?: string;
    taxRegime: 'Old' | 'New';
  };
  salaryStructure: {
    ctc: number;
    basic: number;
    hra: number;
    allowances: number;
  };
}

export interface MonthlyAttendance {
  employeeId: string;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  lopDays: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Casual' | 'Sick' | 'Earned';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  isLOP: boolean;
}

export interface PayrollRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  grossSalary: number;
  lopDeduction: number;
  statutoryDeductions: {
    pf: number;
    esi: number;
    professionalTax: number;
    tds: number;
  };
  totalDeductions: number;
  netPay: number;
}