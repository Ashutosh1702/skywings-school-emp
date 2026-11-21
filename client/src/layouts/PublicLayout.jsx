import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import api from "../services/api";

const PublicLayout = () => {
  const [school, setSchool] = useState({
    name: "Skywings International Academy",
    code: "SKYWINGS-001",
    affiliationNumber: "CBSE-2026-9874",
    logo: "",
    phone: "+91 98765 43210",
    email: "admin@skywingsschool.com",
    tagline: "Empowering Young Minds For A Transformative Future",
    address: {
      street: "Plot No. 42, Tech Park Enclave",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
    },
    socialLinks: {
      facebook: "https://facebook.com/skywingsschool",
      twitter: "https://twitter.com/skywingsschool",
      instagram: "https://instagram.com/skywingsschool",
      youtube: "https://youtube.com/skywingsschool",
      linkedin: "https://linkedin.com/school/skywingsschool",
    },
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const res = await api.getSchoolProfile();
        if (res.success && res.data) {
          setSchool((prev) => ({ ...prev, ...res.data }));
        }
      } catch (e) {
        console.warn("Using default school profile:", e.message);
      }
    };
    fetchSchool();
  }, []);

  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About Us" },
    { to: "/principal", label: "Principal's Desk" },
    { to: "/academics", label: "Academics & Timetable" },
    { to: "/faculty", label: "Faculty" },
    { to: "/notices", label: "Notices & Events" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Banner Bar */}
      <header className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-blue-400 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Affiliation: {school.affiliationNumber || "CBSE Affiliated"}
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <a
              href={`tel:${school.phone}`}
              className="hover:text-white transition flex items-center gap-1"
            >
              📞 {school.phone || "+91 98765 43210"}
            </a>
            <span className="hidden md:inline text-slate-600">•</span>
            <a
              href={`mailto:${school.email}`}
              className="hover:text-white transition flex items-center gap-1"
            >
              ✉️ {school.email || "admin@skywingsschool.com"}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-[11px] font-semibold transition"
              title="Open Separate CMS Admin Application"
            >
              ⚙️ Admin CMS Panel
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-500 font-semibold text-[11px] transition shadow-xs"
            >
              🔐 ERP Portal Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main School Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <Link to="/" className="flex items-center gap-3.5 group">
            {school.logo ? (
              <img
                src={school.logo}
                alt={school.name}
                className="w-12 h-12 object-contain rounded-xl shadow-xs border border-slate-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
                S
              </div>
            )}
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition">
                {school.name || "Skywings International Academy"}
              </h1>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block line-clamp-1">
                {school.tagline || "Empowering Young Minds For A Transformative Future"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? "text-blue-600 bg-blue-50/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="ml-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition"
            >
              Admissions
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg animate-fadeIn">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg text-xs font-bold bg-blue-600 text-white"
              >
                Apply for Admission
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg text-xs font-bold bg-slate-900 text-white"
              >
                Portal Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Main Website Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {school.logo ? (
                <img
                  src={school.logo}
                  alt={school.name}
                  className="w-10 h-10 object-contain rounded-lg bg-white p-1"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                  S
                </div>
              )}
              <h3 className="font-extrabold text-white text-base tracking-tight">
                {school.name}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {school.tagline ||
                "A premier co-educational institution fostering academic excellence, moral leadership, and scientific innovation."}
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>
                <strong className="text-slate-300">Affiliation:</strong>{" "}
                {school.affiliationNumber || "CBSE-2026-9874"}
              </p>
              <p>
                <strong className="text-slate-300">School Code:</strong>{" "}
                {school.code || "SKYWINGS-001"}
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">
                  About Our Institution
                </Link>
              </li>
              <li>
                <Link to="/principal" className="hover:text-blue-400 transition">
                  Principal's Desk & Message
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-blue-400 transition">
                  Academics & Timetables
                </Link>
              </li>
              <li>
                <Link to="/faculty" className="hover:text-blue-400 transition">
                  Our Esteemed Faculty
                </Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-blue-400 transition">
                  Circulars & Calendar
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-blue-400 transition">
                  Campus Photo Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Programs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Academic Divisions
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>🌱 Pre-Primary Wing (Nursery & KG)</li>
              <li>📚 Primary School (Grades 1 - 5)</li>
              <li>🔬 Middle School (Grades 6 - 8)</li>
              <li>🎓 Secondary School (Grades 9 - 10)</li>
              <li>🚀 Senior Secondary (Science, Commerce, Arts)</li>
              <li>🤖 NextGen STEM & Robotics Suite</li>
            </ul>
          </div>

          {/* Col 4: Campus Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Campus Address
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {school.address?.street || "Plot No. 42, Tech Park Enclave"}
              <br />
              {school.address?.city || "Bangalore"},{" "}
              {school.address?.state || "Karnataka"} -{" "}
              {school.address?.zipCode || "560001"}
              <br />
              {school.address?.country || "India"}
            </p>
            <div className="pt-2 text-xs space-y-1">
              <p>
                <span className="text-slate-500">Phone:</span>{" "}
                <a
                  href={`tel:${school.phone}`}
                  className="text-slate-300 hover:text-white"
                >
                  {school.phone}
                </a>
              </p>
              <p>
                <span className="text-slate-500">Email:</span>{" "}
                <a
                  href={`mailto:${school.email}`}
                  className="text-slate-300 hover:text-white"
                >
                  {school.email}
                </a>
              </p>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={school.socialLinks?.facebook || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-xs text-white transition"
                title="Facebook"
              >
                FB
              </a>
              <a
                href={school.socialLinks?.twitter || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-400 flex items-center justify-center text-xs text-white transition"
                title="Twitter"
              >
                X
              </a>
              <a
                href={school.socialLinks?.instagram || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center text-xs text-white transition"
                title="Instagram"
              >
                IG
              </a>
              <a
                href={school.socialLinks?.youtube || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 flex items-center justify-center text-xs text-white transition"
                title="YouTube"
              >
                YT
              </a>
            </div>
          </div>
        </div>

        {/* Sub-footer Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <p>
            © {new Date().getFullYear()} {school.name}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-300 transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300 transition">
              Terms of Admission
            </Link>
            <span>•</span>
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold transition"
            >
              School CMS Administration
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

