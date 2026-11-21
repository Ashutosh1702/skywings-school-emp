import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [schoolName, setSchoolName] = useState("SkyWings School");
  const [schoolLogo, setSchoolLogo] = useState("");
  const [isApiOnline, setIsApiOnline] = useState(true);

  useEffect(() => {
    api.getSchoolProfile().then((res) => {
      if (res.success && res.data) {
        if (res.data.name) setSchoolName(res.data.name);
        if (res.data.logo) setSchoolLogo(res.data.logo);
      }
    });

    // Check API health
    fetch("http://localhost:5000/api/health")
      .then((r) => r.json())
      .then(() => setIsApiOnline(true))
      .catch(() => setIsApiOnline(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/", label: "Dashboard & Overview", icon: "📊", end: true },
    { to: "/school", label: "School Identity & Branding", icon: "🏫" },
    { to: "/principal", label: "Principal's Desk CMS", icon: "👤" },
    { to: "/banners", label: "Hero Banners & Slider", icon: "🖼️" },
    { to: "/notices", label: "Notices, Events & Calendar", icon: "📢" },
    { to: "/gallery", label: "Photo Gallery CMS", icon: "📸" },
    { to: "/teachers", label: "Faculty & Staff", icon: "👨‍🏫" },
    { to: "/students", label: "Student Information (SIS)", icon: "🎓" },
    { to: "/timetables", label: "Timetables & Subjects", icon: "📅" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-slate-900 border-r border-slate-800 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3.5">
          {schoolLogo ? (
            <img
              src={schoolLogo}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-1"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20">
              S
            </div>
          )}
          <div className="overflow-hidden">
            <h2 className="font-extrabold text-sm text-white tracking-tight truncate">
              {schoolName}
            </h2>
            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
              CMS Admin Control Center
            </p>
          </div>
        </div>

        {/* Backend Connectivity Status Pill */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Database API:</span>
            <span
              className={`flex items-center gap-1.5 font-bold ${
                isApiOnline ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isApiOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              ></span>
              {isApiOnline ? "Live MongoDB" : "Standalone Sync"}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 py-1">
            Content Modules
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Sidebar: View Website Quick Button */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/50">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
          >
            <span>🌐 View Public Website</span>
            <span className="text-[10px] opacity-75">↗</span>
          </a>

          <div className="flex items-center justify-between text-xs px-1 text-slate-400">
            <span className="truncate">{user?.name || "Dr. Rajesh Sharma"}</span>
            <button
              onClick={handleLogout}
              className="text-rose-400 hover:text-rose-300 font-bold hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-18 bg-slate-900 border-b border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              ☰
            </button>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight">
                School Website Content Management System
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Updates made here automatically reflect across the public school portal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <span>Live Website</span>
              <span className="text-[10px]">↗</span>
            </a>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                👑
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-white leading-none">
                  {user?.name || "Dr. Rajesh Sharma"}
                </span>
                <span className="text-[10px] text-blue-400 font-semibold uppercase">
                  Super Admin
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition"
              title="Sign Out"
            >
              🚪
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="block text-center py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs mt-3"
            >
              🌐 View Public Website ↗
            </a>
          </div>
        )}

        {/* Main Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

