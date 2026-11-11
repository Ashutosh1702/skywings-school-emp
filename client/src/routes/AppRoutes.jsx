import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import ParentLayout from '../layouts/ParentLayout';

// Auth & Common Pages
import Login from '../pages/auth/Login';
import NotFound from '../pages/common/NotFound';
import Unauthorized from '../pages/common/Unauthorized';

// Admin Views
import Dashboard from '../pages/admin/Dashboard';
import StudentsView from '../pages/admin/students/StudentsView';
import TeachersView from '../pages/admin/teachers/TeachersView';
import ParentsView from '../pages/admin/parents/ParentsView';
import ClassesView from '../pages/admin/classes/ClassesView';
import AttendanceView from '../pages/admin/attendance/AttendanceView';
import FeesView from '../pages/admin/fees/FeesView';
import ExamsView from '../pages/admin/exams/ExamsView';
import TimetableView from '../pages/admin/timetable/TimetableView';
import HomeworkView from '../pages/admin/homework/HomeworkView';
import AnnouncementsView from '../pages/admin/announcements/AnnouncementsView';
import ReportsView from '../pages/admin/reports/ReportsView';
import UsersView from '../pages/admin/users/UsersView';
import AuditLogsView from '../pages/admin/audit/AuditLogsView';
import LibraryView from '../pages/admin/library/LibraryView';
import TransportView from '../pages/admin/transport/TransportView';
import SchoolSettingsView from '../pages/admin/settings/SchoolSettingsView';

// Teacher Views
import TeacherDashboard from '../pages/teacher/TeacherDashboard';

// Parent Views
import ParentDashboard from '../pages/parent/ParentDashboard';
import ParentChildren from '../pages/parent/ParentChildren';

// Root redirect handler
const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
  if (user.role === 'parent') return <Navigate to="/parent/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<StudentsView />} />
          <Route path="teachers" element={<TeachersView />} />
          <Route path="parents" element={<ParentsView />} />
          <Route path="classes" element={<ClassesView />} />
          <Route path="attendance" element={<AttendanceView />} />
          <Route path="fees" element={<FeesView />} />
          <Route path="exams" element={<ExamsView />} />
          <Route path="timetable" element={<TimetableView />} />
          <Route path="homework" element={<HomeworkView />} />
          <Route path="announcements" element={<AnnouncementsView />} />
          <Route path="reports" element={<ReportsView />} />
          <Route path="users" element={<UsersView />} />
          <Route path="audit" element={<AuditLogsView />} />
          <Route path="library" element={<LibraryView />} />
          <Route path="transport" element={<TransportView />} />
          <Route path="settings" element={<SchoolSettingsView />} />
        </Route>
      </Route>

      {/* Protected Teacher Routes */}
      <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<AttendanceView />} />
          <Route path="exams" element={<ExamsView />} />
          <Route path="homework" element={<HomeworkView />} />
          <Route path="timetable" element={<TimetableView />} />
          <Route path="announcements" element={<AnnouncementsView />} />
        </Route>
      </Route>

      {/* Protected Parent Routes */}
      <Route element={<ProtectedRoute allowedRoles={['parent', 'admin']} />}>
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<Navigate to="/parent/dashboard" replace />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="children" element={<ParentChildren />} />
          <Route path="attendance" element={<AttendanceView />} />
          <Route path="fees" element={<FeesView />} />
          <Route path="exams" element={<ExamsView />} />
          <Route path="homework" element={<HomeworkView />} />
          <Route path="announcements" element={<AnnouncementsView />} />
        </Route>
      </Route>

      {/* 404 Catch-All Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
