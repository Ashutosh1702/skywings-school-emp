import React, { useState, useEffect } from "react";
import api from "../../services/api";

const Faculty = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const res = await api.getTeachers();
        if (res.success && res.data) {
          setTeachers(res.data);
        }
      } catch (err) {
        console.warn("Faculty fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const departments = [
    "All",
    ...new Set(teachers.map((t) => t.department).filter(Boolean)),
  ];

  const filtered = teachers.filter((t) => {
    const matchDept = selectedDept === "All" || t.department === selectedDept;
    const matchSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjects?.some((s) =>
        (s.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Academic Mentors
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Our Distinguished Faculty
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Meet the passionate scholars, researchers, and mentors shaping young
            minds at Skywings International Academy.
          </p>
        </div>
      </section>

      {/* Main Filter & Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Department Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedDept === dept
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search by faculty name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            Loading faculty profiles...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">
            No faculty members found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <div className="h-48 overflow-hidden bg-slate-100 relative">
                  <img
                    src={
                      t.photo ||
                      `https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80`
                    }
                    alt={t.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold uppercase backdrop-blur-xs">
                    {t.department || "General"}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {t.name}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 mt-0.5">
                      {t.designation || "Senior Teacher"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {t.qualification || "M.Ed / M.Sc"}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <p className="font-semibold text-slate-700 mb-1">
                      Subjects Taught:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {t.subjects && t.subjects.length > 0 ? (
                        t.subjects.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]"
                          >
                            {s.name || s}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400">Curriculum Faculty</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Faculty;

