import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { HRDataProvider } from './context/HRDataContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Login
import { Login } from './pages/Login';

// HR Portal Components
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { EmployeeList } from './pages/Employees/EmployeeList';
import { AttendanceTracker } from './pages/Attendance/AttendanceTracker';
import { LeaveApprovals } from './pages/Leaves/LeaveApprovals';
import { PayrollRun } from './pages/Payroll/PayrollRun';
import { Reports } from './pages/Reports/Reports';
import { Settings } from './pages/Settings';

// Employee Portal Components
import { EmployeeLayout } from './components/employee/EmployeeLayout';
import { EmployeeDashboard } from './pages/EmployeePortal/EmployeeDashboard';
import { EmployeePayslips } from './pages/EmployeePortal/EmployeePayslips';
import { EmployeeLeaves } from './pages/EmployeePortal/EmployeeLeaves';
import { EmployeeAttendance } from './pages/EmployeePortal/EmployeeAttendance';

// Admin Portal Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './pages/AdminPortal/AdminOverview';
import { AdminApprovals } from './pages/AdminPortal/AdminApprovals';
import { AdminMasters } from './pages/AdminPortal/AdminMasters';
import { AdminDisbursements } from './pages/AdminPortal/AdminDisbursements';

export default function App() {
  return (
    <ThemeProvider>
      <HRDataProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* HR Portal */}
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRole="hr">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="employees" element={<EmployeeList />} />
                <Route path="attendance" element={<AttendanceTracker />} />
                <Route path="leaves" element={<LeaveApprovals />} />
                <Route path="payroll" element={<PayrollRun />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Employee Portal */}
              <Route
                path="/employee"
                element={
                  <ProtectedRoute allowedRole="employee">
                    <EmployeeLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<EmployeeDashboard />} />
                <Route path="payslips" element={<EmployeePayslips />} />
                <Route path="leaves" element={<EmployeeLeaves />} />
                <Route path="attendance" element={<EmployeeAttendance />} />
              </Route>

              {/* Admin Portal */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="approvals" element={<AdminApprovals />} />
                <Route path="masters" element={<AdminMasters />} />
                <Route path="disbursements" element={<AdminDisbursements />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </HRDataProvider>
    </ThemeProvider>
  );
}