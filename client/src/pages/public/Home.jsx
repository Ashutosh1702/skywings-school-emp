import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [school, setSchool] = useState(null);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [featuredGallery, setFeaturedGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [websiteRes, bannersRes, galleryRes] = await Promise.all([
          api.getPublicWebsiteData(),
          api.getBanners(),
          api.getGallery(),
        ]);

        if (websiteRes.success && websiteRes.data) {
          if (websiteRes.data.school) setSchool(websiteRes.data.school);
          if (websiteRes.data.notices) setNotices(websiteRes.data.notices);
          if (websiteRes.data.events) setEvents(websiteRes.data.events);
        }

        if (bannersRes.success && bannersRes.data && bannersRes.data.length > 0) {
          setBanners(bannersRes.data);
        }

        if (galleryRes.success && galleryRes.data) {
          setFeaturedGallery(galleryRes.data.slice(0, 6));
        }
      } catch (err) {
        console.warn("Home data fetch:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Slider auto-advance
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[currentSlide] || {
    title: "Empowering Young Minds For A Transformative Future",
    subtitle:
      "Excellence in CBSE Academics, Global STEM Innovation, and Leadership Building since 2005.",
    imageUrl:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80",
    badgeText: "CBSE Affiliated • Admissions 2026-27 Open",
    buttonText: "Apply For Admission",
    linkUrl: "/contact",
  };

  return (
    <div className="space-y-16">
      {/* 1. Hero Carousel Banner */}
      <section className="relative h-[560px] sm:h-[620px] bg-slate-900 overflow-hidden">
        {/* Background Image with Zoom Effect */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform scale-105"
          style={{ backgroundImage: `url('${activeBanner.imageUrl}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-950/40"></div>
        </div>

        {/* Content Box */}
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-8 flex flex-col justify-center">
          <div className="max-w-2xl space-y-6 text-white animate-fadeIn">
            {activeBanner.badgeText && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 backdrop-blur-sm border border-blue-400/30">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                {activeBanner.badgeText}
              </span>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-md">
              {activeBanner.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed drop-shadow">
              {activeBanner.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={activeBanner.linkUrl || "/contact"}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:scale-105 transition transform"
              >
                {activeBanner.buttonText || "Apply For Admission"} →
              </Link>
              <Link
                to="/about"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition"
              >
                Explore Campus Tour
              </Link>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === 0 ? banners.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition"
              aria-label="Previous slide"
            >
              ❮
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % banners.length)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition"
              aria-label="Next slide"
            >
              ❯
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-8 bg-blue-500" : "w-2.5 bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. Notice Ticker Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2.5 shrink-0 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 font-extrabold text-xs uppercase tracking-wider border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Latest Announcements
          </div>

          <div className="flex-1 overflow-hidden w-full">
            {notices.length > 0 ? (
              <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1 text-xs font-semibold text-slate-700">
                {notices.map((n) => (
                  <Link
                    key={n._id}
                    to="/notices"
                    className="hover:text-blue-600 shrink-0 flex items-center gap-2 transition"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">
                      {n.category || "Notice"}
                    </span>
                    <span>{n.title}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Academic Session 2026-27 admission forms and prospectus are now
                available online.
              </p>
            )}
          </div>

          <Link
            to="/notices"
            className="shrink-0 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
          >
            All Circulars →
          </Link>
        </div>
      </section>

      {/* 3. Welcome & Institutional Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider">
              🏛️ Welcome to Skywings
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Legacy of Academic Excellence & Inspiring Character
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              At <strong>{school?.name || "Skywings International Academy"}</strong>,
              we believe education is not merely the filling of a bucket, but the
              lighting of a fire. Established in {school?.establishedYear || "2005"},
              our institution provides world-class educational pathways under CBSE
              affiliation with an unwavering focus on scientific curiosity, moral
              integrity, and athletic prowess.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-center">
                <span className="block text-2xl sm:text-3xl font-black text-blue-700">
                  {school?.stats?.totalStudents || "1,250"}+
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Enrolled Students
                </span>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-center">
                <span className="block text-2xl sm:text-3xl font-black text-indigo-700">
                  {school?.stats?.totalTeachers || "68"}+
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Expert Educators
                </span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                <span className="block text-2xl sm:text-3xl font-black text-emerald-700">
                  100%
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Board Pass Rate
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 font-bold text-sm text-blue-600 hover:text-blue-800 transition"
              >
                Learn more about our vision, leadership & history →
              </Link>
            </div>
          </div>

          {/* Right Image Collage */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=900&q=80"
                alt="Students collaborating"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-200/80 max-w-xs hidden sm:block">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                ⭐ Affiliated To
              </p>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Central Board of Secondary Education
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Affiliation Code: {school?.affiliationNumber || "CBSE-2026-9874"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Principal's Message Spotlight */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Principal Photo */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 border-blue-500/40 shadow-2xl shadow-blue-500/10 mb-4">
                <img
                  src={
                    school?.principalPhoto ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
                  }
                  alt={school?.principalName || "Principal"}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                {school?.principalName || "Dr. Rajesh Sharma"}
              </h3>
              <p className="text-xs text-blue-400 font-semibold mt-0.5">
                {school?.principalDesignation || "Principal & Academic Director"}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {school?.principalQualifications ||
                  "Ph.D in Education, M.Sc Physics, B.Ed"}
              </p>
            </div>

            {/* Principal Quote & Bio */}
            <div className="lg:col-span-8 space-y-6">
              <span className="inline-block px-3 py-1 rounded bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-wider border border-blue-500/30">
                From The Principal's Desk
              </span>

              <blockquote className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed italic border-l-4 border-blue-500 pl-6">
                "{school?.principalMessage ||
                  "Welcome to Skywings International Academy. In an era defined by rapid technological and social transformation, education must transcend traditional boundaries. Here, we nurture each child’s intellectual curiosity, cultivate empathy, and foster leadership grounded in ethical responsibility."}"
              </blockquote>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {school?.principalBio ||
                  "Dr. Rajesh Sharma brings 25+ years of distinguished leadership across premier educational institutions, with a lifelong dedication to student-centric experiential learning."}
              </p>

              <div className="pt-2">
                <Link
                  to="/principal"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
                >
                  Read Full Message & Vision →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Academic Divisions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Holistic Education
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Wings & Curriculum
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tailored learning environments from early childhood discovery to senior
            secondary excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition transform">
              🌱
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Pre-Primary Wing
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Play-based exploratory learning fostering language acquisition, motor
              skills, and emotional resilience.
            </p>
            <span className="text-[11px] font-bold text-blue-600">
              Nursery • LKG • UKG
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition transform">
              📚
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Primary School
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Core literacy, numeracy, environmental studies, and computer logic
              integrated with creative arts.
            </p>
            <span className="text-[11px] font-bold text-blue-600">
              Grades 1 through 5
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition transform">
              🔬
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Middle School
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Advanced scientific inquiry, experiential lab sessions, social
              sciences, and foundational robotics.
            </p>
            <span className="text-[11px] font-bold text-blue-600">
              Grades 6 through 8
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition transform">
              🎓
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Secondary & Senior
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              CBSE board examination rigor with customized coaching in Science,
              Commerce, and Humanities.
            </p>
            <span className="text-[11px] font-bold text-blue-600">
              Grades 9 through 12
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/academics"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-md"
          >
            📅 View Class-wise Timetables & Subjects →
          </Link>
        </div>
      </section>

      {/* 6. Featured Gallery Showcase */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Life at Skywings
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Campus & Activities Gallery
              </h2>
            </div>
            <Link
              to="/gallery"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
            >
              View All Photos ({featuredGallery.length}+) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredGallery.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 hover:shadow-xl transition group flex flex-col"
              >
                <div className="relative h-52 overflow-hidden bg-slate-200">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-[10px] font-bold uppercase backdrop-blur-xs">
                    {item.category || "Campus"}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Upcoming Events & Academic Calendar Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Events Col */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Upcoming Happenings
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  School Events & Functions
                </h3>
              </div>
              <Link
                to="/notices"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                All Events →
              </Link>
            </div>

            <div className="space-y-4">
              {events.slice(0, 3).map((ev) => (
                <div
                  key={ev._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-blue-300 transition"
                >
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center text-center font-bold">
                    <span className="text-xs uppercase">
                      {ev.eventDate
                        ? new Date(ev.eventDate).toLocaleString("default", {
                            month: "short",
                          })
                        : "Nov"}
                    </span>
                    <span className="text-lg leading-none">
                      {ev.eventDate
                        ? new Date(ev.eventDate).getDate()
                        : "20"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">
                        {ev.category || "Event"}
                      </span>
                      {ev.location && (
                        <span className="text-[11px] text-slate-400">
                          📍 {ev.location}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {ev.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admission CTA Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded bg-white/20 text-white font-bold text-xs uppercase tracking-wider">
                Admissions 2026-27
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Begin Your Child's Journey of Limitless Potential
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Experience comprehensive growth, digital classrooms, certified
                faculty, and modern sporting amenities. Limited seats available
                for the forthcoming academic term.
              </p>
              <ul className="space-y-2 text-xs text-blue-100 pt-2">
                <li className="flex items-center gap-2">
                  ✓ CBSE Affiliated Curriculum
                </li>
                <li className="flex items-center gap-2">
                  ✓ State-of-the-Art Science & AI Labs
                </li>
                <li className="flex items-center gap-2">
                  ✓ Safe GPS-Tracked Transportation Fleet
                </li>
                <li className="flex items-center gap-2">
                  ✓ 100% Secure & Green Campus
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to="/contact"
                className="w-full block text-center py-3.5 rounded-xl bg-white text-blue-700 font-extrabold text-xs shadow-lg hover:bg-blue-50 transition"
              >
                Submit Admission Inquiry Now →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

