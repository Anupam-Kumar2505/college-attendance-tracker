import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import MainLayout from '../layouts/MainLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';

import LoginPage from '../pages/LoginPage.jsx';

import TeacherDashboard from '../pages/teacher/TeacherDashboard.jsx';
import TeacherTimetablePage from '../pages/teacher/TeacherTimetablePage.jsx';
import TeacherLectureDetailPage from '../pages/teacher/TeacherLectureDetailPage.jsx';

import StudentDashboard from '../pages/student/StudentDashboard.jsx';
import StudentTimetablePage from '../pages/student/StudentTimetablePage.jsx';
import StudentApplyLeavePage from '../pages/student/StudentApplyLeavePage.jsx';
import StudentLeaveHistoryPage from '../pages/student/StudentLeaveHistoryPage.jsx';

import NotFoundPage from '../pages/NotFoundPage.jsx';

const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'TEACHER') {
    return <Navigate to="/teacher" replace />;
  }

  return <Navigate to="/student" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes inside Main Application Layout */}
      <Route element={<ProtectedRoute />}>
        {/* Teacher Specific Routes */}
        <Route element={<RoleRoute allowedRoles={['TEACHER']} />}>
          <Route element={<MainLayout />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/timetable" element={<TeacherTimetablePage />} />
            <Route path="/teacher/lecture/:lectureId" element={<TeacherLectureDetailPage />} />
          </Route>
        </Route>

        {/* Student Specific Routes */}
        <Route element={<RoleRoute allowedRoles={['STUDENT']} />}>
          <Route element={<MainLayout />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/timetable" element={<StudentTimetablePage />} />
            <Route path="/student/apply" element={<StudentApplyLeavePage />} />
            <Route path="/student/applications" element={<StudentLeaveHistoryPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
