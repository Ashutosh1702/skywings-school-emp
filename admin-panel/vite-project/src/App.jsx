import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Layout
import AdminLayout from "./components/layout/AdminLayout";

// Auth
import Login from "./pages/auth/Login";

// CMS Modules
import Dashboard from "./pages/Dashboard";
import SchoolProfileCMS from "./pages/SchoolProfileCMS";
import PrincipalCMS from "./pages/PrincipalCMS";
import BannersCMS from "./pages/BannersCMS";
import NoticesEventsCMS from "./pages/NoticesEventsCMS";
import GalleryCMS from "./pages/GalleryCMS";
import TeachersCMS from "./pages/TeachersCMS";
import StudentsCMS from "./pages/StudentsCMS";
import TimetableSubjectsCMS from "./pages/TimetableSubjectsCMS";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin CMS Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/school" element={<SchoolProfileCMS />} />
                <Route path="/principal" element={<PrincipalCMS />} />
                <Route path="/banners" element={<BannersCMS />} />
                <Route path="/notices" element={<NoticesEventsCMS />} />
                <Route path="/gallery" element={<GalleryCMS />} />
                <Route path="/teachers" element={<TeachersCMS />} />
                <Route path="/students" element={<StudentsCMS />} />
                <Route path="/timetables" element={<TimetableSubjectsCMS />} />
              </Route>
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
