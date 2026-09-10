import type { Employee, MonthlyAttendance } from '../types';

export interface CalculatedPayroll {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  pan: string;
  uan: string;
  bankName: string;
  accountNumber: string;
  ctc: number;
  monthlyGross: number;
  basic: number;
  hra: number;
  allowances: number;
  workingDays: number;
  lopDays: number;
  lopDeduction: number;
  earnedGross: number;
  pfEmployee: number;
  pfEmployer: number;
  esiEmployee: number;
  esiEmployer: number;
  pt: number;
  tds: number;
  totalDeductions: number;
  netPay: number;
}

export const calculatePayrollRecord = (
  employee: Employee,
  attendance: MonthlyAttendance,
  workingDays: number = 22
): CalculatedPayroll => {
  const monthlyGross = Math.round(employee.salaryStructure.ctc / 12);
  const basic = employee.salaryStructure.basic || Math.round(monthlyGross * 0.5);
  const hra = employee.salaryStructure.hra || Math.round(basic * 0.5);
  const allowances = Math.max(0, monthlyGross - basic - hra);

  const perDayRate = workingDays > 0 ? monthlyGross / workingDays : 0;
  const lopDays = attendance.lopDays || 0;
  const lopDeduction = Math.round(perDayRate * lopDays);
  const earnedGross = Math.max(0, monthlyGross - lopDeduction);

  const pfEmployee = Math.round(basic * 0.12);
  const pfEmployer = pfEmployee;

  const esiEmployee = monthlyGross <= 21000 ? Math.round(earnedGross * 0.0075) : 0;
  const esiEmployer = monthlyGross <= 21000 ? Math.round(earnedGross * 0.0325) : 0;

  const pt = monthlyGross > 15000 ? 200 : 0;

  let tds = 0;
  const annualIncome = employee.salaryStructure.ctc;
  if (employee.statutory.taxRegime === 'New') {
    if (annualIncome > 700000) {
      tds = Math.round(((annualIncome - 700000) * 0.1) / 12);
    }
  } else {
    if (annualIncome > 500000) {
      tds = Math.round(((annualIncome - 500000) * 0.2) / 12);
    }
  }

  const totalDeductions = lopDeduction + pfEmployee + esiEmployee + pt + tds;
  const netPay = Math.max(0, monthlyGross - totalDeductions);

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    employeeCode: employee.employeeCode,
    department: employee.department,
    designation: employee.designation,
    pan: employee.statutory.pan,
    uan: employee.statutory.uan,
    bankName: employee.bankDetails.bankName,
    accountNumber: employee.bankDetails.accountNumber,
    ctc: employee.salaryStructure.ctc,
    monthlyGross,
    basic,
    hra,
    allowances,
    workingDays,
    lopDays,
    lopDeduction,
    earnedGross,
    pfEmployee,
    pfEmployer,
    esiEmployee,
    esiEmployer,
    pt,
    tds,
    totalDeductions,
    netPay,
  };
};