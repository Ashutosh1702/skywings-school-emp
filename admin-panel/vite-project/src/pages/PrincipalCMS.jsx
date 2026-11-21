import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ImageUpload from "../components/ui/ImageUpload";

const PrincipalCMS = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    principalName: "",
    principalDesignation: "",
    principalQualifications: "",
    principalPhoto: "",
    principalMessage: "",
    principalBio: "",
  });

  useEffect(() => {
    const fetchPrincipal = async () => {
      try {
        setLoading(true);
        const res = await api.getSchoolProfile();
        if (res.success && res.data) {
          const d = res.data;
          setForm({
            principalName: d.principalName || "Dr. Rajesh Sharma",
            principalDesignation:
              d.principalDesignation || "Principal & Academic Director",
            principalQualifications:
              d.principalQualifications ||
              "Ph.D in Educational Leadership, M.Sc Physics, B.Ed",
            principalPhoto: d.principalPhoto || "",
            principalMessage: d.principalMessage || "",
            principalBio: d.principalBio || "",
          });
        }
      } catch (err) {
        showToast("Error loading principal details: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPrincipal();
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateSchoolProfile(form);
      if (res.success) {
        showToast("Principal profile & welcome message updated!", "success");
      } else {
        showToast(res.message || "Failed to update", "error");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Loading Principal's Desk data...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
            Executive Leadership
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Principal Name, Photo & Message CMS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage the Principal's portrait, credentials, and full welcome
            address that features on the public homepage and dedicated desk page.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          isLoading={saving}
          className="shrink-0"
        >
          💾 Save Principal Profile
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photo Upload */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-base">
            Principal's Portrait Photograph
          </h3>
          <p className="text-xs text-slate-400">
            Upload an official high-resolution photograph. This image is
            featured on the school website homepage spotlight and the
            Principal's Desk page.
          </p>
          <ImageUpload
            value={form.principalPhoto}
            onChange={(url) => setForm({ ...form, principalPhoto: url })}
            placeholder="Upload Principal portrait photo"
          />
        </div>

        {/* Credentials */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="font-extrabold text-white text-base">
            Principal Information & Qualifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              required
              value={form.principalName}
              onChange={(e) =>
                setForm({ ...form, principalName: e.target.value })
              }
              placeholder="Dr. Rajesh Sharma"
            />
            <Input
              label="Official Designation *"
              required
              value={form.principalDesignation}
              onChange={(e) =>
                setForm({ ...form, principalDesignation: e.target.value })
              }
              placeholder="Principal & Academic Director"
            />
          </div>

          <Input
            label="Degrees & Academic Qualifications"
            value={form.principalQualifications}
            onChange={(e) =>
              setForm({ ...form, principalQualifications: e.target.value })
            }
            placeholder="Ph.D in Educational Leadership, M.Sc Physics, B.Ed"
          />
        </div>

        {/* Message & Bio */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="font-extrabold text-white text-base">
            Welcome Address & Educational Philosophy
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Principal's Welcome Message (Full Text) *
            </label>
            <textarea
              rows={6}
              required
              value={form.principalMessage}
              onChange={(e) =>
                setForm({ ...form, principalMessage: e.target.value })
              }
              placeholder="Compose an inspirational welcome message to parents and students..."
              className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            ></textarea>
            <p className="text-[11px] text-slate-500 mt-1">
              Appears on the homepage quote block and the dedicated Principal's
              Desk page.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Short Professional Biography
            </label>
            <textarea
              rows={3}
              value={form.principalBio}
              onChange={(e) =>
                setForm({ ...form, principalBio: e.target.value })
              }
              placeholder="Summary of experience, awards, previous administrative roles..."
              className="w-full px-4 py-3 text-xs bg-slate-800 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            isLoading={saving}
            size="lg"
            className="px-8"
          >
            Save Principal Profile & Message
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PrincipalCMS;

