import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import ImageUpload from "../components/ui/ImageUpload";

const TeachersCMS = () => {
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    designation: "Senior Teacher",
    department: "Mathematics",
    qualification: "M.Sc, M.Ed",
    photo: "",
    status: "active",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tchRes, subRes] = await Promise.all([
        api.getTeachers(),
        api.getSubjects(),
      ]);
      if (tchRes.success && tchRes.data) setTeachers(tchRes.data);
      if (subRes.success && subRes.data) setSubjects(subRes.data);
    } catch (err) {
      showToast("Error loading faculty: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingTeacher(null);
    setForm({
      employeeId: `EMP-T-${100 + teachers.length + 1}`,
      name: "",
      email: "",
      phone: "",
      designation: "Senior Teacher",
      department: "General",
      qualification: "M.Sc, B.Ed",
      photo: "",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTeacher(t);
    setForm({
      employeeId: t.employeeId || "",
      name: t.name || "",
      email: t.email || "",
      phone: t.phone || "",
      designation: t.designation || "Senior Teacher",
      department: t.department || "General",
      qualification: t.qualification || "",
      photo: t.photo || "",
      status: t.status || "active",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingTeacher) {
        const res = await api.updateTeacher(editingTeacher._id, form);
        if (res.success) {
          showToast("Faculty profile updated!", "success");
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const res = await api.createTeacher(form);
        if (res.success) {
          showToast("Faculty member added to school directory!", "success");
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
    if (!window.confirm("Remove this faculty member from directory?")) return;
    try {
      const res = await api.deleteTeacher(id);
      if (res.success) {
        showToast("Teacher record removed", "success");
        fetchData();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const filtered = teachers.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.department?.toLowerCase().includes(search.toLowerCase()) ||
      t.employeeId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
            Academic Mentors CMS
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Faculty & Teachers Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage teacher profiles, designations, qualifications, and portrait
            photos displayed on the public Faculty page.
          </p>
        </div>

        <Button onClick={openAddModal}>+ Add Faculty Member</Button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <input
          type="text"
          placeholder="Search by teacher name, department, or Employee ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-xs text-slate-400 font-semibold hidden sm:block">
          Total Faculty: {teachers.length}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading faculty list...
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 font-bold">Faculty Member</th>
                <th className="py-4 px-6 font-bold">Emp ID</th>
                <th className="py-4 px-6 font-bold">Department</th>
                <th className="py-4 px-6 font-bold">Qualification</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((t) => (
                <tr key={t._id} className="hover:bg-slate-800/50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                        <img
                          src={
                            t.photo ||
                            "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
                          }
                          alt={t.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block">
                          {t.name}
                        </span>
                        <span className="text-[11px] text-blue-400">
                          {t.designation || "Senior Teacher"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-slate-300">
                    {t.employeeId}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-300">
                    {t.department || "General"}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {t.qualification || "—"}
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={t.status} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? "Edit Teacher Profile" : "Add Faculty Member"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUpload
            label="Teacher Portrait Photo"
            value={form.photo}
            onChange={(url) => setForm({ ...form, photo: url })}
            placeholder="Select teacher passport portrait"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Employee ID *"
              required
              value={form.employeeId}
              onChange={(e) =>
                setForm({ ...form, employeeId: e.target.value.toUpperCase() })
              }
              placeholder="EMP-T-104"
            />
            <Input
              label="Teacher Name *"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Dr. Anand Verma"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address *"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="teacher@skywings.com"
            />
            <Input
              label="Phone Number *"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98450 12345"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Official Designation"
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
              placeholder="e.g. PGT Physics"
            />
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Department
              </label>
              <select
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science & Technology</option>
                <option value="English">English Literature</option>
                <option value="Computer Science">Computer Applications & AI</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Arts & Sports">Arts & Physical Education</option>
              </select>
            </div>
          </div>

          <Input
            label="Degrees & Qualification"
            value={form.qualification}
            onChange={(e) =>
              setForm({ ...form, qualification: e.target.value })
            }
            placeholder="e.g. Ph.D Physics, B.Ed"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeachersCMS;

