import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const RoleRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If student attempts to access teacher page -> redirect to student dashboard
    if (user.role === 'STUDENT') {
      return <Navigate to="/student" replace />;
    }
    // If teacher attempts to access student page -> redirect to teacher dashboard
    if (user.role === 'TEACHER') {
      return <Navigate to="/teacher" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
