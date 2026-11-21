import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import ImageUpload from "../components/ui/ImageUpload";

const GalleryCMS = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Campus",
    imageUrl: "",
    description: "",
    isFeatured: false,
    order: 1,
  });

  const categories = [
    "All",
    "Campus",
    "Sports",
    "Labs",
    "Cultural",
    "Annual Day",
    "Science Fair",
    "Classrooms",
  ];

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await api.getGallery();
      if (res.success && res.data) setItems(res.data);
    } catch (err) {
      showToast("Error loading gallery: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      title: "",
      category: categoryFilter !== "All" ? categoryFilter : "Campus",
      imageUrl: "",
      description: "",
      isFeatured: false,
      order: items.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || "",
      category: item.category || "Campus",
      imageUrl: item.imageUrl || "",
      description: item.description || "",
      isFeatured: !!item.isFeatured,
      order: item.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      showToast("Please upload or provide an image for the photo card", "error");
      return;
    }

    try {
      setSubmitting(true);
      if (editingItem) {
        const res = await api.updateGalleryItem(editingItem._id, form);
        if (res.success) {
          showToast("Photo updated successfully!", "success");
          setIsModalOpen(false);
          fetchGallery();
        }
      } else {
        const res = await api.createGalleryItem(form);
        if (res.success) {
          showToast("Photo added to school website gallery!", "success");
          setIsModalOpen(false);
          fetchGallery();
        }
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo from the school gallery?")) return;
    try {
      const res = await api.deleteGalleryItem(id);
      if (res.success) {
        showToast("Photo deleted", "success");
        fetchGallery();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const filtered = items.filter(
    (i) => categoryFilter === "All" || i.category === categoryFilter
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
            Media & Campus Showcase
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Photo Gallery CMS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload campus life photography, athletic achievements, and laboratory
            facilities. Photos instantly reflect on the public Gallery page and
            homepage highlights.
          </p>
        </div>

        <Button onClick={openAddModal}>+ Upload New Photo</Button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              categoryFilter === cat
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading gallery photos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-3">
          <span className="text-4xl">📸</span>
          <h3 className="font-bold text-white text-base">No Photos in this Category</h3>
          <p className="text-xs text-slate-400">
            Upload images for {categoryFilter} to showcase them on the public
            website.
          </p>
          <Button onClick={openAddModal}>+ Upload First Photo</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-lg flex flex-col group"
            >
              <div className="relative h-48 bg-slate-800 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold uppercase backdrop-blur-xs">
                  {item.category}
                </span>
                {item.isFeatured && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase shadow-xs">
                    ★ Featured
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-xs font-bold text-slate-300 hover:text-white"
                  >
                    Edit ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300"
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Gallery Item" : "Add Image to Photo Gallery"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUpload
            label="Photo Upload *"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            placeholder="Select photo file from your device"
          />

          <Input
            label="Photo Caption / Title *"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Inter-School Robotics Competition"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              >
                <option value="Campus">Campus Infrastructure</option>
                <option value="Sports">Sports & Athletics</option>
                <option value="Labs">Science & STEM Labs</option>
                <option value="Cultural">Cultural & Arts</option>
                <option value="Annual Day">Annual Day Ceremonies</option>
                <option value="Science Fair">Science & Tech Exhibitions</option>
                <option value="Classrooms">Digital Classrooms</option>
              </select>
            </div>

            <Input
              label="Display Order"
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Brief details about the event, location, or student achievement..."
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
            ></textarea>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeaturedPhoto"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm({ ...form, isFeatured: e.target.checked })
              }
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
            />
            <label
              htmlFor="isFeaturedPhoto"
              className="text-xs font-bold text-slate-300 cursor-pointer"
            >
              Highlight as Featured on Public Website Homepage
            </label>
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
              {editingItem ? "Update Photo" : "Add to Gallery"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GalleryCMS;

