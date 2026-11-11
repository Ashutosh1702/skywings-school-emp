import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || "admin";

  const adminMenu = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/students", label: "Students (SIS)", icon: "🎓" },
    { to: "/admin/teachers", label: "Teachers & Staff", icon: "👨‍🏫" },
    { to: "/admin/parents", label: "Parents", icon: "👨‍👩‍👧" },
    { to: "/admin/classes", label: "Classes & Sections", icon: "🏫" },
    { to: "/admin/attendance", label: "Attendance", icon: "📋" },
    { to: "/admin/fees", label: "Fee Management", icon: "💳" },
    { to: "/admin/exams", label: "Exams & Results", icon: "📝" },
    { to: "/admin/timetable", label: "Timetable", icon: "🗓️" },
    { to: "/admin/homework", label: "Homework", icon: "📖" },
    { to: "/admin/announcements", label: "Announcements", icon: "📢" },
    { to: "/admin/reports", label: "Reports & Export", icon: "📈" },
    { to: "/admin/users", label: "Users & Roles", icon: "🔐" },
    { to: "/admin/audit", label: "Audit Trail", icon: "🛡️" },
    { to: "/admin/library", label: "Library", icon: "📚" },
    { to: "/admin/transport", label: "Transport Fleet", icon: "🚌" },
    { to: "/admin/settings", label: "School Settings", icon: "⚙️" },
  ];

  const teacherMenu = [
    { to: "/teacher/dashboard", label: "Teacher Dashboard", icon: "📊" },
    { to: "/teacher/attendance", label: "Mark Attendance", icon: "📋" },
    { to: "/teacher/exams", label: "Enter Exam Marks", icon: "📝" },
    { to: "/teacher/homework", label: "Manage Homework", icon: "📖" },
    { to: "/teacher/timetable", label: "My Timetable", icon: "🗓️" },
    { to: "/teacher/announcements", label: "School Circulars", icon: "📢" },
  ];

  const parentMenu = [
    { to: "/parent/dashboard", label: "Parent Portal", icon: "📊" },
    { to: "/parent/children", label: "My Children", icon: "👶" },
    { to: "/parent/attendance", label: "Attendance Records", icon: "📋" },
    { to: "/parent/fees", label: "Fee Dues & Receipts", icon: "💳" },
    { to: "/parent/exams", label: "Exam Results", icon: "📝" },
    { to: "/parent/homework", label: "Assigned Homework", icon: "📖" },
    { to: "/parent/announcements", label: "Announcements", icon: "📢" },
  ];

  const menu =
    role === "admin"
      ? adminMenu
      : role === "teacher"
        ? teacherMenu
        : parentMenu;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          S
        </div>
        <div className="leading-tight">
          <h1 className="font-bold text-white text-base tracking-tight">
            SkyWings ERP
          </h1>
          <p className="text-[10px] text-blue-400 font-medium tracking-wide uppercase">
            {role.toUpperCase()} PORTAL
          </p>
        </div>
      </div>

      {/* Navigation Links using NavLink */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
        Skywings Nextgen Tech © 2026
      </div>
    </aside>
  );
};

export default Sidebar;
