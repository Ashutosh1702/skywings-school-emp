import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";

const NoticesEventsCMS = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState("notices");
  const [items, setItems] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    priority: "normal",
    category: "notice",
    targetAudience: ["all"],
    eventDate: "",
    location: "",
    status: "published",
  });

  const [sessionForm, setSessionForm] = useState({
    name: "2027-2028",
    startDate: "2027-04-01",
    endDate: "2028-03-31",
    isCurrent: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [annRes, sesRes] = await Promise.all([
        api.getAnnouncements(),
        api.getAcademicSessions(),
      ]);
      if (annRes.success && annRes.data) setItems(annRes.data);
      if (sesRes.success && sesRes.data) setSessions(sesRes.data);
    } catch (err) {
      showToast("Error loading notices: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddNoticeModal = (cat = "notice") => {
    setEditingItem(null);
    setForm({
      title: "",
      message: "",
      priority: "normal",
      category: cat,
      targetAudience: ["all"],
      eventDate: "",
      location: "",
      status: "published",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || "",
      message: item.message || "",
      priority: item.priority || "normal",
      category: item.category || "notice",
      targetAudience: item.targetAudience || ["all"],
      eventDate: item.eventDate ? item.eventDate.split("T")[0] : "",
      location: item.location || "",
      status: item.status || "published",
    });
    setIsModalOpen(true);
  };

  const handleSaveNotice = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingItem) {
        const res = await api.updateAnnouncement(editingItem._id, form);
        if (res.success) {
          showToast("Update published successfully!", "success");
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const res = await api.createAnnouncement(form);
        if (res.success) {
          showToast("Circular published to school website!", "success");
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

  const handleDeleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice/event?"))
      return;
    try {
      const res = await api.deleteAnnouncement(id);
      if (res.success) {
        showToast("Deleted successfully", "success");
        fetchData();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.createAcademicSession(sessionForm);
      if (res.success) {
        showToast("Academic session registered!", "success");
        setIsSessionModalOpen(false);
        fetchData();
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const noticesList = items.filter(
    (i) => i.category === "notice" || i.category === "circular" || !i.category
  );
  const eventsList = items.filter(
    (i) => i.category === "event" || i.category === "calendar"
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
            Communications & Schedules
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Notices, Events & Academic Calendar CMS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish official announcements, calendar cycles, and upcoming school
            functions that broadcast to students, parents, and visitors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tab === "sessions" ? (
            <Button onClick={() => setIsSessionModalOpen(true)}>
              + Add Academic Session
            </Button>
          ) : (
            <Button
              onClick={() =>
                openAddNoticeModal(tab === "events" ? "event" : "notice")
              }
            >
              + Add {tab === "events" ? "Event" : "Notice / Circular"}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setTab("notices")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === "notices"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          📢 Circulars & Notices ({noticesList.length})
        </button>
        <button
          onClick={() => setTab("events")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === "events"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          🎉 Upcoming Events ({eventsList.length})
        </button>
        <button
          onClick={() => setTab("sessions")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === "sessions"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          📅 Academic Sessions ({sessions.length})
        </button>
      </div>

      {/* Tab 1: Notices */}
      {tab === "notices" && (
        <div className="space-y-4">
          {noticesList.map((n) => (
            <div
              key={n._id}
              className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge status={n.priority}>{n.priority || "Normal"}</Badge>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    Audience: {n.targetAudience?.join(", ") || "All"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    • {new Date(n.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-base">
                  {n.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEditModal(n)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
                >
                  Edit ✏️
                </button>
                <button
                  onClick={() => handleDeleteNotice(n._id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-xs font-bold text-rose-300 transition"
                >
                  Delete 🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Events */}
      {tab === "events" && (
        <div className="space-y-4">
          {eventsList.map((ev) => (
            <div
              key={ev._id}
              className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-blue-950 border border-blue-800 text-blue-300 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold">
                    {ev.eventDate
                      ? new Date(ev.eventDate).toLocaleString("default", {
                          month: "short",
                        })
                      : "Date"}
                  </span>
                  <span className="text-lg font-black leading-none">
                    {ev.eventDate
                      ? new Date(ev.eventDate).getDate()
                      : "—"}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge status="published">Event</Badge>
                    {ev.location && (
                      <span className="text-xs text-blue-400 font-semibold">
                        📍 {ev.location}
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-white text-base">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {ev.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEditModal(ev)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
                >
                  Edit ✏️
                </button>
                <button
                  onClick={() => handleDeleteNotice(ev._id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-xs font-bold text-rose-300 transition"
                >
                  Delete 🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Academic Sessions */}
      {tab === "sessions" && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 font-bold">Session Cycle</th>
                <th className="py-4 px-6 font-bold">Start Date</th>
                <th className="py-4 px-6 font-bold">End Date</th>
                <th className="py-4 px-6 font-bold">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sessions.map((s) => (
                <tr key={s._id} className="hover:bg-slate-800/50 transition">
                  <td className="py-4 px-6 font-black text-white text-sm">
                    {s.name}
                  </td>
                  <td className="py-4 px-6 text-slate-300">
                    {new Date(s.startDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-slate-300">
                    {new Date(s.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={s.isCurrent ? "active" : "inactive"}>
                      {s.isCurrent ? "Current Active Term" : "Archived Cycle"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Circular or Event" : "Publish Notice or Event"}
      >
        <form onSubmit={handleSaveNotice} className="space-y-4">
          <Input
            label="Title *"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Mid-Term Date Sheet Published"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              >
                <option value="notice">Official Notice</option>
                <option value="circular">Parent Circular</option>
                <option value="event">School Event</option>
                <option value="calendar">Academic Calendar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              >
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {(form.category === "event" || form.category === "calendar") && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Event Date"
                type="date"
                value={form.eventDate}
                onChange={(e) =>
                  setForm({ ...form, eventDate: e.target.value })
                }
              />
              <Input
                label="Event Location / Venue"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                placeholder="Auditorium / Sports Complex"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Notice Content / Details *
            </label>
            <textarea
              rows={4}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write circular description or instructions..."
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
            ></textarea>
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
              {editingItem ? "Update Notice" : "Broadcast Notice"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Session Modal */}
      <Modal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        title="Add Academic Calendar Cycle"
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          <Input
            label="Cycle Name *"
            required
            placeholder="e.g. 2027-2028"
            value={sessionForm.name}
            onChange={(e) =>
              setSessionForm({ ...sessionForm, name: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              required
              value={sessionForm.startDate}
              onChange={(e) =>
                setSessionForm({ ...sessionForm, startDate: e.target.value })
              }
            />
            <Input
              label="End Date *"
              type="date"
              required
              value={sessionForm.endDate}
              onChange={(e) =>
                setSessionForm({ ...sessionForm, endDate: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="setSessionCurrent"
              checked={sessionForm.isCurrent}
              onChange={(e) =>
                setSessionForm({ ...sessionForm, isCurrent: e.target.checked })
              }
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
            />
            <label
              htmlFor="setSessionCurrent"
              className="text-xs font-bold text-slate-300"
            >
              Set as Current Active Operational Term
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSessionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Create Session
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoticesEventsCMS;

