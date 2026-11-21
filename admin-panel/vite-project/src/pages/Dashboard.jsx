import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    bannersCount: 0,
    galleryCount: 0,
    noticesCount: 0,
    teachersCount: 0,
    studentsCount: 0,
    classesCount: 0,
  });
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const [schRes, banRes, galRes, notRes, tchRes, stuRes, clsRes] =
          await Promise.all([
            api.getSchoolProfile(),
            api.getBanners(),
            api.getGallery(),
            api.getAnnouncements(),
            api.getTeachers(),
            api.getStudents(),
            api.getClasses(),
          ]);

        if (schRes.success && schRes.data) setSchool(schRes.data);

        setStats({
          bannersCount: banRes.data ? banRes.data.length : 0,
          galleryCount: galRes.data ? galRes.data.length : 0,
          noticesCount: notRes.data ? notRes.data.length : 0,
          teachersCount: tchRes.data ? tchRes.data.length : 0,
          studentsCount: stuRes.data ? stuRes.data.length : 0,
          classesCount: clsRes.data ? clsRes.data.length : 0,
        });
      } catch (err) {
        console.warn("Dashboard stats error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const cards = [
    {
      title: "Hero Banners",
      count: stats.bannersCount,
      icon: "🖼️",
      link: "/banners",
      color: "from-blue-600 to-indigo-600",
      desc: "Active carousel slides on website homepage",
    },
    {
      title: "Photo Gallery",
      count: stats.galleryCount,
      icon: "📸",
      link: "/gallery",
      color: "from-purple-600 to-pink-600",
      desc: "Photos organized by Campus, Sports, and Labs",
    },
    {
      title: "Notices & Events",
      count: stats.noticesCount,
      icon: "📢",
      link: "/notices",
      color: "from-amber-600 to-orange-600",
      desc: "School circulars, calendar events & notices",
    },
    {
      title: "Faculty Teachers",
      count: stats.teachersCount,
      icon: "👨‍🏫",
      link: "/teachers",
      color: "from-emerald-600 to-teal-600",
      desc: "Staff directory shown on public Faculty page",
    },
    {
      title: "Enrolled Students",
      count: stats.studentsCount,
      icon: "🎓",
      link: "/students",
      color: "from-sky-600 to-blue-600",
      desc: "Student master database with roll & class",
    },
    {
      title: "Classes & Sections",
      count: stats.classesCount,
      icon: "📅",
      link: "/timetables",
      color: "from-rose-600 to-red-600",
      desc: "Grade levels with live period schedule matrix",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-wider border border-blue-500/30">
            School CMS Command Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {school?.name || "Skywings International Academy"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage institutional branding, principal messages, carousel banners,
            faculty directories, timetables, and circulars without modifying code.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition flex items-center justify-center gap-1.5"
          >
            <span>🌐 View Public School Website</span>
            <span className="text-[10px]">↗</span>
          </a>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md hover:border-slate-700 hover:shadow-xl transition group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition transform`}
              >
                {card.icon}
              </div>
              <span className="text-3xl font-black text-white">
                {card.count}
              </span>
            </div>

            <h3 className="font-extrabold text-slate-100 text-base mb-1">
              {card.title}
            </h3>
            <p className="text-xs text-slate-400 mb-4">{card.desc}</p>

            <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300 flex items-center gap-1 transition">
              Manage Content →
            </span>
          </Link>
        ))}
      </div>

      {/* Quick Launchpad & Principal Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Principal Message Box */}
        <div className="lg:col-span-7 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                Public Website Spotlight
              </span>
              <h3 className="font-extrabold text-white text-base">
                Principal's Message on Homepage
              </h3>
            </div>
            <Link
              to="/principal"
              className="text-xs font-bold text-blue-400 hover:underline"
            >
              Edit Message ✏️
            </Link>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
              <img
                src={
                  school?.principalPhoto ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                }
                alt="Principal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">
                {school?.principalName || "Dr. Rajesh Sharma"}
              </h4>
              <p className="text-[11px] text-blue-400 font-semibold">
                {school?.principalDesignation || "Principal & Academic Director"}
              </p>
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed pt-1">
                "{school?.principalMessage}"
              </p>
            </div>
          </div>
        </div>

        {/* Live Synchronizer Box */}
        <div className="lg:col-span-5 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-extrabold text-white text-sm">
                Automatic Website Synchronization
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every creation, edit, or deletion in this CMS writes directly to
              the MongoDB models and updates the public School Website in real
              time.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/school"
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white text-center transition"
            >
              Update School Name, Logo & Contact
            </Link>
            <Link
              to="/banners"
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white text-center transition"
            >
              Add New Homepage Banner Slide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

