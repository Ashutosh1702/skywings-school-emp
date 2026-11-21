import React, { useState, useEffect } from "react";
import api from "../../services/api";

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [zoomItem, setZoomItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await api.getGallery();
        if (res.success && res.data) {
          setItems(res.data);
        }
      } catch (err) {
        console.warn("Gallery load error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = [
    "All",
    "Campus",
    "Sports",
    "Labs",
    "Cultural",
    "Annual Day",
    "Science Fair",
  ];

  const filtered = items.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Visual Highlights
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Campus Life & Photo Gallery
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Explore moments of triumph, scientific discovery, artistic expression,
            and athletic achievement captured across our campus.
          </p>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            Loading photo gallery...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">
            No gallery photos in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <div
                key={item._id}
                onClick={() => setZoomItem(item)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                    <span className="text-white text-xs font-bold flex items-center gap-1">
                      🔍 Click to zoom
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold uppercase backdrop-blur-xs">
                    {item.category || "Campus"}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 mb-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Zoom Modal */}
      {zoomItem && (
        <div
          onClick={() => setZoomItem(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-fadeIn"
          >
            <div className="relative h-[450px] bg-black">
              <img
                src={zoomItem.imageUrl}
                alt={zoomItem.title}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setZoomItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white font-bold flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                {zoomItem.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {zoomItem.title}
              </h3>
              {zoomItem.description && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {zoomItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

