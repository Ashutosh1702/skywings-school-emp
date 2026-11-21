import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import ImageUpload from "../components/ui/ImageUpload";

const StudentsCMS = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedClassFilter, setSelectedClassFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    admissionNumber: "",
    rollNumber: "",
    firstName: "",
    lastName: "",
    gender: "male",
    dateOfBirth: "2012-01-01",
    bloodGroup: "O+",
    class: "",
    section: "",
    photo: "",
    status: "active",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stuRes, clsRes] = await Promise.all([
        api.getStudents(),
        api.getClasses(),
      ]);
      if (stuRes.success && stuRes.data) setStudents(stuRes.data);
      if (clsRes.success && clsRes.data) setClasses(clsRes.data);
    } catch (err) {
      showToast("Error loading students: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingStudent(null);
    const firstClass = classes[0];
    const firstSection = firstClass?.sections?.[0];
    setForm({
      admissionNumber: `ADM-2026-${String(students.length + 101).padStart(3, "0")}`,
      rollNumber: String(students.length + 1),
      firstName: "",
      lastName: "",
      gender: "male",
      dateOfBirth: "2012-05-15",
      bloodGroup: "O+",
      class: firstClass?._id || "",
      section: firstSection?._id || "",
      photo: "",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingStudent(s);
    setForm({
      admissionNumber: s.admissionNumber || "",
      rollNumber: s.rollNumber || "",
      firstName: s.firstName || "",
      lastName: s.lastName || "",
      gender: s.gender || "male",
      dateOfBirth: s.dateOfBirth ? s.dateOfBirth.split("T")[0] : "2012-01-01",
      bloodGroup: s.bloodGroup || "O+",
      class: s.class?._id || s.class || "",
      section: s.section?._id || s.section || "",
      photo: s.photo || "",
      status: s.status || "active",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingStudent) {
        const res = await api.updateStudent(editingStudent._id, form);
        if (res.success) {
          showToast("Student profile updated!", "success");
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const res = await api.createStudent(form);
        if (res.success) {
          showToast("New student registered into database!", "success");
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student profile?"))
      return;
    try {
      const res = await api.deleteStudent(id);
      if (res.success) {
        showToast("Student record removed", "success");
        fetchData();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const filtered = students.filter((s) => {
    const classId = s.class?._id || s.class;
    const matchClass =
      selectedClassFilter === "All" || classId === selectedClassFilter;
    const matchSearch =
      (s.firstName + " " + s.lastName)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      s.admissionNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber?.includes(search);
    return matchClass && matchSearch;
  });

  const selectedFormClass = classes.find((c) => c._id === form.class);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
            Student Information System (SIS)
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Students Directory & Profiles
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain master student records, admission IDs, roll numbers, and
            class enrollments integrated with the backend database.
          </p>
        </div>

        <Button onClick={openAddModal}>+ Register New Student</Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by student name or Admission No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
          >
            <option value="All">All Grades</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-semibold">
          Total Students: {students.length}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading student directory...
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 font-bold">Student Name</th>
                <th className="py-4 px-6 font-bold">Admission No.</th>
                <th className="py-4 px-6 font-bold">Roll</th>
                <th className="py-4 px-6 font-bold">Class & Sec</th>
                <th className="py-4 px-6 font-bold">Gender</th>
                <th className="py-4 px-6 font-bold">Blood Group</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((s) => (
                <tr key={s._id} className="hover:bg-slate-800/50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400">
                        {s.photo ? (
                          <img
                            src={s.photo}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (s.firstName?.[0] || "S") + (s.lastName?.[0] || "")
                        )}
                      </div>
                      <span className="font-bold text-white text-sm">
                        {s.firstName} {s.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-blue-400">
                    {s.admissionNumber}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-300">
                    #{s.rollNumber}
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-semibold">
                    {s.class?.name || "Grade 10"}{" "}
                    {s.section?.name ? `(${s.section.name})` : ""}
                  </td>
                  <td className="py-4 px-6 uppercase text-[11px] text-slate-400 font-semibold">
                    {s.gender}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-300">
                    {s.bloodGroup || "O+"}
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={s.status} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-xs font-bold text-rose-300 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? "Edit Student Record" : "Enroll New Student"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUpload
            label="Student Photograph"
            value={form.photo}
            onChange={(url) => setForm({ ...form, photo: url })}
            placeholder="Select student ID photo"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Admission Number *"
              required
              value={form.admissionNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  admissionNumber: e.target.value.toUpperCase(),
                })
              }
              placeholder="ADM-2026-001"
            />
            <Input
              label="Roll Number *"
              required
              value={form.rollNumber}
              onChange={(e) =>
                setForm({ ...form, rollNumber: e.target.value })
              }
              placeholder="101"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name *"
              required
              value={form.firstName}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
              placeholder="e.g. Aarav"
            />
            <Input
              label="Last Name *"
              required
              value={form.lastName}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
              placeholder="e.g. Sharma"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Gender *
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Blood Group
              </label>
              <select
                value={form.bloodGroup}
                onChange={(e) =>
                  setForm({ ...form, bloodGroup: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Assigned Class / Grade *
              </label>
              <select
                value={form.class}
                onChange={(e) => {
                  setForm({ ...form, class: e.target.value });
                  const c = classes.find((cls) => cls._id === e.target.value);
                  if (c?.sections?.length > 0) {
                    setForm((f) => ({ ...f, section: c.sections[0]._id }));
                  }
                }}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedFormClass && selectedFormClass.sections?.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Section *
                </label>
                <select
                  value={form.section}
                  onChange={(e) =>
                    setForm({ ...form, section: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                >
                  {selectedFormClass.sections.map((sec) => (
                    <option key={sec._id} value={sec._id}>
                      Section {sec.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Save Student Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentsCMS;

