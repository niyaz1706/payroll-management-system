import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRole: 'hr' | 'admin' | 'employee';
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole, children }) => {
  const userRole = localStorage.getItem('user_role');

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRole) {
    // Redirect to their assigned portal if they attempt to access another role's routes
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    if (userRole === 'employee') return <Navigate to="/employee" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};