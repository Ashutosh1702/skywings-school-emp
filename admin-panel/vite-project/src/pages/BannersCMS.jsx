import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import ImageUpload from "../components/ui/ImageUpload";

const BannersCMS = () => {
  const { showToast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    badgeText: "CBSE Affiliated • Admissions Open",
    buttonText: "Apply For Admission",
    linkUrl: "/contact",
    order: 1,
    isActive: true,
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.getBanners();
      if (res.success && res.data) {
        setBanners(res.data);
      }
    } catch (err) {
      showToast("Error loading banners: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setForm({
      title: "",
      subtitle: "",
      imageUrl: "",
      badgeText: "CBSE Affiliated • Admissions Open",
      buttonText: "Apply For Admission",
      linkUrl: "/contact",
      order: (banners.length + 1),
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBanner(b);
    setForm({
      title: b.title || "",
      subtitle: b.subtitle || "",
      imageUrl: b.imageUrl || "",
      badgeText: b.badgeText || "",
      buttonText: b.buttonText || "",
      linkUrl: b.linkUrl || "",
      order: b.order || 1,
      isActive: b.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      showToast("Please provide or upload a banner background image", "error");
      return;
    }

    try {
      setSubmitting(true);
      if (editingBanner) {
        const res = await api.updateBanner(editingBanner._id, form);
        if (res.success) {
          showToast("Homepage Banner updated successfully!", "success");
          setIsModalOpen(false);
          fetchBanners();
        }
      } else {
        const res = await api.createBanner(form);
        if (res.success) {
          showToast("New Homepage Banner slide created!", "success");
          setIsModalOpen(false);
          fetchBanners();
        }
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hero banner?"))
      return;
    try {
      const res = await api.deleteBanner(id);
      if (res.success) {
        showToast("Banner deleted successfully", "success");
        fetchBanners();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleToggle = async (b) => {
    try {
      const res = await api.updateBanner(b._id, { isActive: !b.isActive });
      if (res.success) {
        showToast(
          `Banner ${!b.isActive ? "activated" : "deactivated"}`,
          "success"
        );
        fetchBanners();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
            Homepage Hero Slider CMS
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Homepage Carousel Banners
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Slides created here appear in rotation on the public website hero
            section with CTA buttons and smooth transitions.
          </p>
        </div>

        <Button onClick={openAddModal} className="shrink-0">
          + Add New Banner Slide
        </Button>
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading homepage banners...
        </div>
      ) : banners.length === 0 ? (
        <div className="py-20 text-center bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-4">
          <span className="text-4xl">🖼️</span>
          <h3 className="font-bold text-white text-base">
            No Banners Created Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create your first hero carousel banner to welcome prospective
            parents and students on the homepage.
          </p>
          <Button onClick={openAddModal}>+ Add First Banner</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((b) => (
            <div
              key={b._id}
              className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-lg flex flex-col group"
            >
              {/* Image Preview with Overlay */}
              <div className="relative h-48 bg-slate-800 overflow-hidden">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 text-white font-mono text-[10px] font-bold">
                    Order: #{b.order}
                  </span>
                  <Badge status={b.isActive ? "active" : "inactive"}>
                    {b.isActive ? "Active on Website" : "Hidden"}
                  </Badge>
                </div>
              </div>

              {/* Banner Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {b.badgeText && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                      {b.badgeText}
                    </span>
                  )}
                  <h3 className="font-extrabold text-white text-base line-clamp-2">
                    {b.title}
                  </h3>
                  {b.subtitle && (
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {b.subtitle}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Button: {b.buttonText || "Learn More"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 truncate max-w-[120px]">
                    {b.linkUrl}
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleToggle(b)}
                    className="text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    {b.isActive ? "Hide" : "Show"}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(b)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
                    >
                      Edit ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-xs font-bold text-rose-300 transition"
                    >
                      Delete 🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? "Edit Homepage Banner Slide" : "Create Homepage Banner Slide"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <ImageUpload
            label="Banner Background Image *"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            aspect="video"
            placeholder="Upload banner wallpaper (16:9 recommended)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Slide Title *"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Empowering Tomorrow's Global Leaders"
            />
            <Input
              label="Highlight Pill / Badge Text"
              value={form.badgeText}
              onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
              placeholder="e.g. CBSE Affiliated • Admissions 2026-27"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Slide Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Brief secondary statement explaining academic achievements or campus features..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Action Button Label"
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
              placeholder="Apply For Admission"
            />
            <Input
              label="Button Target Link"
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              placeholder="/contact"
            />
            <Input
              label="Display Order (1, 2, 3...)"
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveBanner"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
            />
            <label
              htmlFor="isActiveBanner"
              className="text-xs font-bold text-slate-300 cursor-pointer"
            >
              Active and visible in homepage slider rotation
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
              {editingBanner ? "Update Banner Slide" : "Publish Banner Slide"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BannersCMS;

