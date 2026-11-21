import React, { useState, useRef } from "react";
import api from "../../services/api";

const ImageUpload = ({ label, value, onChange, placeholder = "Choose or upload an image", aspect = "square" }) => {
  const [uploading, setUploading] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP, SVG)");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      try {
        setUploading(true);
        const res = await api.uploadImage({
          image: base64,
          filename: file.name,
        });
        if (res.success && res.url) {
          onChange(res.url);
        } else {
          // If server returned base64 directly
          onChange(base64);
        }
      } catch (err) {
        console.warn("Upload fallback to base64 data URI:", err.message);
        onChange(base64);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setCustomUrl("");
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
        {/* Preview Container */}
        <div
          className={`shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center relative ${
            aspect === "video" ? "w-36 h-20" : "w-20 h-20"
          }`}
        >
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/200x200?text=Preview";
              }}
            />
          ) : (
            <span className="text-2xl text-slate-500">📷</span>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[10px] font-bold text-blue-400">
              Uploading...
            </div>
          )}
        </div>

        {/* Upload Buttons & URL Input */}
        <div className="flex-1 space-y-2 w-full">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              📤 {uploading ? "Uploading..." : "Upload New Image"}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 text-xs font-semibold transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Or Paste Web Link */}
          <div className="flex items-center gap-1.5 pt-1">
            <input
              type="url"
              placeholder="Or paste external image URL..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition"
            >
              Apply
            </button>
          </div>

          {value && (
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-md">
              Current: {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;

