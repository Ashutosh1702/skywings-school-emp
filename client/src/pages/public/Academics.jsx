import React, { useState, useEffect } from "react";
import api from "../../services/api";

const Academics = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [loadingTimetable, setLoadingTimetable] = useState(false);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [clsRes, subRes] = await Promise.all([
          api.getClasses(),
          api.getSubjects(),
        ]);
        if (clsRes.success && clsRes.data && clsRes.data.length > 0) {
          setClasses(clsRes.data);
          setSelectedClassId(clsRes.data[0]._id);
          if (clsRes.data[0].sections && clsRes.data[0].sections.length > 0) {
            setSelectedSectionId(clsRes.data[0].sections[0]._id);
          }
        }
        if (subRes.success && subRes.data) {
          setSubjects(subRes.data);
        }
      } catch (err) {
        console.warn("Academics master load:", err.message);
      }
    };
    fetchMasterData();
  }, []);

  // Fetch timetable whenever selected class/section changes
  useEffect(() => {
    if (!selectedClassId) return;
    const loadTimetable = async () => {
      try {
        setLoadingTimetable(true);
        const res = await api.getPublicTimetable(
          selectedClassId,
          selectedSectionId
        );
        if (res.success && res.data) {
          setTimetable(res.data);
        }
      } catch (err) {
        console.warn("Timetable load error:", err.message);
      } finally {
        setLoadingTimetable(false);
      }
    };
    loadTimetable();
  }, [selectedClassId, selectedSectionId]);

  const selectedClass = classes.find((c) => c._id === selectedClassId);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  const getSlot = (day, period) => {
    return timetable.find(
      (t) => t.dayOfWeek === day && Number(t.periodNumber) === period
    );
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Curriculum & Schedules
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Academics & Live Timetables
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Explore our curriculum framework, subjects, and transparent
            class-wise period schedules.
          </p>
        </div>
      </section>

      {/* Curriculum Subjects Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Curriculum Matrix
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Approved Curriculum Subjects
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Aligned with CBSE syllabus incorporating theory, laboratory practicals,
            and continuous internal evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub._id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {sub.code}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {sub.type}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{sub.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Class Timetable Viewer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Live Timetable Viewer
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Class-wise Period Schedule
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your class and section to view the official weekly
                timetable managed via the Admin Panel.
              </p>
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Grade / Class
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    const found = classes.find((c) => c._id === e.target.value);
                    if (found && found.sections && found.sections.length > 0) {
                      setSelectedSectionId(found.sections[0]._id);
                    } else {
                      setSelectedSectionId("");
                    }
                  }}
                  className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedClass && selectedClass.sections && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Section
                  </label>
                  <select
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {selectedClass.sections.map((sec) => (
                      <option key={sec._id} value={sec._id}>
                        Section {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Timetable Table */}
          {loadingTimetable ? (
            <div className="py-16 text-center text-xs text-slate-500">
              Loading class timetable schedule...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="py-3.5 px-4 font-bold border border-slate-800">
                      Day
                    </th>
                    {periods.map((p) => (
                      <th
                        key={p}
                        className="py-3.5 px-3 font-bold text-center border border-slate-800"
                      >
                        Period {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map((day) => (
                    <tr key={day} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 bg-slate-100/70 border border-slate-200">
                        {day}
                      </td>
                      {periods.map((p) => {
                        const slot = getSlot(day, p);
                        return (
                          <td
                            key={p}
                            className="py-2.5 px-3 border border-slate-200 text-center align-middle min-w-[120px]"
                          >
                            {slot ? (
                              <div className="p-2 rounded-lg bg-blue-50/80 border border-blue-200/70 space-y-0.5">
                                <span className="block font-bold text-blue-800 text-[11px]">
                                  {slot.subject?.name || "Subject"}
                                </span>
                                <span className="block text-[10px] text-slate-600">
                                  {slot.teacher?.name || "Teacher"}
                                </span>
                                <span className="block text-[9px] text-slate-400 font-mono">
                                  {slot.startTime} - {slot.endTime} • {slot.roomNumber || "301"}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-mono text-[11px]">
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Academics;

