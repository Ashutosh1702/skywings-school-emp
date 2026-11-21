import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";

const TimetableSubjectsCMS = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState("timetable");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [timetable, setTimetable] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [slotForm, setSlotForm] = useState({
    dayOfWeek: "Monday",
    periodNumber: 1,
    startTime: "08:30",
    endTime: "09:15",
    subject: "",
    teacher: "",
    roomNumber: "Room 301",
  });

  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    type: "theory",
  });

  const [classForm, setClassForm] = useState({
    name: "Grade 11",
    numericGrade: 11,
    sectionName: "A",
  });

  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const [clsRes, subRes, tchRes] = await Promise.all([
        api.getClasses(),
        api.getSubjects(),
        api.getTeachers(),
      ]);

      if (clsRes.success && clsRes.data && clsRes.data.length > 0) {
        setClasses(clsRes.data);
        if (!selectedClassId) {
          setSelectedClassId(clsRes.data[0]._id);
          if (clsRes.data[0].sections?.length > 0) {
            setSelectedSectionId(clsRes.data[0].sections[0]._id);
          }
        }
      }
      if (subRes.success && subRes.data) setSubjects(subRes.data);
      if (tchRes.success && tchRes.data) setTeachers(tchRes.data);
    } catch (err) {
      showToast("Error loading timetable data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  // Fetch timetable slots for selected class
  useEffect(() => {
    if (!selectedClassId) return;
    api.getTimetable(selectedClassId, selectedSectionId).then((res) => {
      if (res.success && res.data) setTimetable(res.data);
    });
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

  const openAddSlotModal = (day = "Monday", period = 1) => {
    setSlotForm({
      dayOfWeek: day,
      periodNumber: period,
      startTime: period === 1 ? "08:30" : period === 2 ? "09:15" : "10:00",
      endTime: period === 1 ? "09:15" : period === 2 ? "10:00" : "10:45",
      subject: subjects[0]?._id || "",
      teacher: teachers[0]?._id || "",
      roomNumber: "Room 301",
    });
    setIsSlotModalOpen(true);
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...slotForm,
        class: selectedClassId,
        section: selectedSectionId,
      };
      const res = await api.createTimetableSlot(payload);
      if (res.success) {
        showToast("Timetable period slot scheduled!", "success");
        setIsSlotModalOpen(false);
        // Refresh timetable
        api.getTimetable(selectedClassId, selectedSectionId).then((r) => {
          if (r.success && r.data) setTimetable(r.data);
        });
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Remove this period slot from schedule?")) return;
    try {
      const res = await api.deleteTimetableSlot(slotId);
      if (res.success) {
        showToast("Slot removed", "success");
        setTimetable((prev) => prev.filter((t) => t._id !== slotId));
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.createSubject(subjectForm);
      if (res.success) {
        showToast("New subject added to curriculum!", "success");
        setIsSubjectModalOpen(false);
        setSubjectForm({ name: "", code: "", type: "theory" });
        fetchMasterData();
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Delete this subject from curriculum?")) return;
    try {
      const res = await api.deleteSubject(id);
      if (res.success) {
        showToast("Subject removed", "success");
        fetchMasterData();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.createClass({
        name: classForm.name,
        numericGrade: Number(classForm.numericGrade),
      });
      if (res.success) {
        showToast("New Grade / Class created!", "success");
        setIsClassModalOpen(false);
        fetchMasterData();
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
            Academic Schedule & Syllabus CMS
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Class-wise Timetables & Subjects
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build and manage class period schedules, subjects, and grade
            assignments. Updates instantly appear on the public Academics page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tab === "timetable" && (
            <Button onClick={() => openAddSlotModal()}>
              + Schedule Period Slot
            </Button>
          )}
          {tab === "subjects" && (
            <Button onClick={() => setIsSubjectModalOpen(true)}>
              + Add Curriculum Subject
            </Button>
          )}
          {tab === "classes" && (
            <Button onClick={() => setIsClassModalOpen(true)}>
              + Create Grade / Class
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setTab("timetable")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === "timetable"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          📅 Class Timetable Matrix
        </button>
        <button
          onClick={() => setTab("subjects")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === "subjects"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          📖 Curriculum Subjects ({subjects.length})
        </button>
        <button
          onClick={() => setTab("classes")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === "classes"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          🏛️ Grades & Sections ({classes.length})
        </button>
      </div>

      {/* Tab 1: Timetable Scheduler */}
      {tab === "timetable" && (
        <div className="space-y-6">
          {/* Class & Section Selector Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Select Grade
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    const found = classes.find((c) => c._id === e.target.value);
                    if (found && found.sections?.length > 0) {
                      setSelectedSectionId(found.sections[0]._id);
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-bold bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedClass && selectedClass.sections?.length > 0 && (
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Select Section
                  </label>
                  <select
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                    className="px-3.5 py-2 text-xs font-bold bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    {selectedClass.sections.map((s) => (
                      <option key={s._id} value={s._id}>
                        Section {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <Button size="sm" onClick={() => openAddSlotModal()}>
              + Add Slot
            </Button>
          </div>

          {/* Timetable Weekly Matrix Table */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="py-4 px-4 font-bold uppercase">Day</th>
                  {periods.map((p) => (
                    <th
                      key={p}
                      className="py-4 px-3 font-bold text-center uppercase min-w-[130px]"
                    >
                      Period {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {daysOfWeek.map((day) => (
                  <tr key={day} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-extrabold text-white bg-slate-950/60 border-r border-slate-800">
                      {day}
                    </td>
                    {periods.map((p) => {
                      const slot = getSlot(day, p);
                      return (
                        <td
                          key={p}
                          className="py-2 px-2 text-center align-middle border-r border-slate-800/80"
                        >
                          {slot ? (
                            <div className="p-2.5 rounded-xl bg-blue-950/70 border border-blue-800/80 space-y-1 relative group">
                              <span className="block font-bold text-white text-[11px]">
                                {slot.subject?.name || "Subject"}
                              </span>
                              <span className="block text-[10px] text-blue-300">
                                {slot.teacher?.name || "Teacher"}
                              </span>
                              <span className="block text-[9px] text-slate-400 font-mono">
                                {slot.startTime}-{slot.endTime} • {slot.roomNumber}
                              </span>

                              <button
                                onClick={() => handleDeleteSlot(slot._id)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm"
                                title="Delete Slot"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => openAddSlotModal(day, p)}
                              className="w-full py-3 rounded-lg border border-dashed border-slate-800 hover:border-slate-600 text-slate-600 hover:text-slate-400 text-[11px] font-bold transition"
                            >
                              +
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Subjects Manager */}
      {tab === "subjects" && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 font-bold">Subject Code</th>
                <th className="py-4 px-6 font-bold">Subject Title</th>
                <th className="py-4 px-6 font-bold">Curriculum Type</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {subjects.map((sub) => (
                <tr key={sub._id} className="hover:bg-slate-800/50 transition">
                  <td className="py-4 px-6 font-mono font-bold text-blue-400 text-sm">
                    {sub.code}
                  </td>
                  <td className="py-4 px-6 font-extrabold text-white text-sm">
                    {sub.name}
                  </td>
                  <td className="py-4 px-6 uppercase font-bold text-[11px] text-slate-400">
                    {sub.type}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDeleteSubject(sub._id)}
                      className="px-3 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-xs font-bold text-rose-300 transition"
                    >
                      Delete 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Grades & Classes */}
      {tab === "classes" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-white text-base">
                  {cls.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 text-xs font-mono font-bold">
                  Grade {cls.numericGrade}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Active Sections:
                </span>
                <div className="flex flex-wrap gap-2">
                  {cls.sections && cls.sections.length > 0 ? (
                    cls.sections.map((sec) => (
                      <span
                        key={sec._id}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
                      >
                        Section {sec.name}{" "}
                        {sec.roomNumber ? `(${sec.roomNumber})` : ""}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Section A</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Slot Modal */}
      <Modal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        title="Schedule Timetable Period Slot"
      >
        <form onSubmit={handleSaveSlot} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Day of Week
              </label>
              <select
                value={slotForm.dayOfWeek}
                onChange={(e) =>
                  setSlotForm({ ...slotForm, dayOfWeek: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              >
                {daysOfWeek.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Period Number (1 - 8)
              </label>
              <select
                value={slotForm.periodNumber}
                onChange={(e) =>
                  setSlotForm({
                    ...slotForm,
                    periodNumber: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              >
                {periods.map((p) => (
                  <option key={p} value={p}>
                    Period {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              value={slotForm.startTime}
              onChange={(e) =>
                setSlotForm({ ...slotForm, startTime: e.target.value })
              }
              placeholder="08:30"
            />
            <Input
              label="End Time"
              value={slotForm.endTime}
              onChange={(e) =>
                setSlotForm({ ...slotForm, endTime: e.target.value })
              }
              placeholder="09:15"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Curriculum Subject *
            </label>
            <select
              value={slotForm.subject}
              onChange={(e) =>
                setSlotForm({ ...slotForm, subject: e.target.value })
              }
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            >
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Assigned Teacher *
            </label>
            <select
              value={slotForm.teacher}
              onChange={(e) =>
                setSlotForm({ ...slotForm, teacher: e.target.value })
              }
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            >
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.designation || "Faculty"})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Room / Lab Location"
            value={slotForm.roomNumber}
            onChange={(e) =>
              setSlotForm({ ...slotForm, roomNumber: e.target.value })
            }
            placeholder="Room 301 / Science Lab 2"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSlotModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Schedule Slot
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Subject Modal */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title="Add Subject to Curriculum"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <Input
            label="Subject Code *"
            required
            value={subjectForm.code}
            onChange={(e) =>
              setSubjectForm({
                ...subjectForm,
                code: e.target.value.toUpperCase(),
              })
            }
            placeholder="e.g. BIO10"
          />
          <Input
            label="Subject Title *"
            required
            value={subjectForm.name}
            onChange={(e) =>
              setSubjectForm({ ...subjectForm, name: e.target.value })
            }
            placeholder="e.g. Biology & Genetics"
          />
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Curriculum Type
            </label>
            <select
              value={subjectForm.type}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, type: e.target.value })
              }
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            >
              <option value="theory">Theory Only</option>
              <option value="practical">Practical / Lab Only</option>
              <option value="both">Both (Theory & Practical)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSubjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Save Subject
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Class Modal */}
      <Modal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        title="Add New Grade / Class"
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
          <Input
            label="Grade Name *"
            required
            value={classForm.name}
            onChange={(e) =>
              setClassForm({ ...classForm, name: e.target.value })
            }
            placeholder="e.g. Grade 11"
          />
          <Input
            label="Numeric Grade *"
            type="number"
            required
            value={classForm.numericGrade}
            onChange={(e) =>
              setClassForm({
                ...classForm,
                numericGrade: Number(e.target.value),
              })
            }
            placeholder="11"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsClassModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Create Grade
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TimetableSubjectsCMS;

