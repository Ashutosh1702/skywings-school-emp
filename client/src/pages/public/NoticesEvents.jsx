import React, { useState, useEffect } from "react";
import api from "../../services/api";

const NoticesEvents = () => {
  const [items, setItems] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [annRes, sesRes] = await Promise.all([
          api.getAnnouncements(),
          api.getAcademicSessions(),
        ]);
        if (annRes.success && annRes.data) {
          setItems(annRes.data);
        }
        if (sesRes.success && sesRes.data) {
          setSessions(sesRes.data);
        }
      } catch (err) {
        console.warn("Notices load error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = items.filter((item) => {
    const cat = item.category || "notice";
    const matchFilter =
      filter === "all" ||
      (filter === "notices" && (cat === "notice" || cat === "circular")) ||
      (filter === "events" && cat === "event") ||
      (filter === "calendar" && cat === "calendar");

    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Official Circulars & Calendar
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Notices, Events & Academic Calendar
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Stay informed with institution updates, parent circulars, examination
            dates, and upcoming school functions.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Navigation Tabs & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Updates
            </button>
            <button
              onClick={() => setFilter("notices")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === "notices"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              📢 Circulars & Notices
            </button>
            <button
              onClick={() => setFilter("events")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === "events"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              🎉 Upcoming Events
            </button>
            <button
              onClick={() => setFilter("calendar")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === "calendar"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              📅 Academic Terms
            </button>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search circulars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Academic Session Cycles Banner */}
        {sessions.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                Active Institutional Term
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Academic Session: {sessions.find((s) => s.isCurrent)?.name || "2026-2027"}
              </h4>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Term Begins:</span>
                <span className="font-bold">
                  {sessions[0]?.startDate ? new Date(sessions[0].startDate).toLocaleDateString() : "01 Apr 2026"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Term Concludes:</span>
                <span className="font-bold">
                  {sessions[0]?.endDate ? new Date(sessions[0].endDate).toLocaleDateString() : "31 Mar 2027"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notices & Events Cards List */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            Loading notices and circulars...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">
            No circulars or events found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.priority === "urgent"
                          ? "bg-rose-100 text-rose-700"
                          : item.priority === "important"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.priority || "Normal"}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase">
                      {item.category || "Notice"}
                    </span>
                    {item.eventDate && (
                      <span className="text-xs text-slate-500 font-semibold">
                        🗓️ Event Date: {new Date(item.eventDate).toLocaleDateString()}
                      </span>
                    )}
                    {item.location && (
                      <span className="text-xs text-slate-400">
                        📍 {item.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="block text-[11px] text-slate-400">
                    Posted on {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  <span className="text-xs font-bold text-blue-600 mt-1 inline-block">
                    View Circular →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal for Full Circular View */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                {selectedItem.category || "Circular"}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              {selectedItem.title}
            </h3>

            {selectedItem.eventDate && (
              <p className="text-xs font-semibold text-blue-600">
                Event Scheduled For:{" "}
                {new Date(selectedItem.eventDate).toLocaleDateString()}
                {selectedItem.location ? ` • Venue: ${selectedItem.location}` : ""}
              </p>
            )}

            <div className="pt-2 text-sm text-slate-700 leading-relaxed border-t border-slate-100">
              {selectedItem.message}
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Circular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesEvents;

