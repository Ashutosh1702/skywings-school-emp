import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ImageUpload from "../components/ui/ImageUpload";

const SchoolProfileCMS = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    affiliationNumber: "",
    email: "",
    phone: "",
    website: "",
    tagline: "",
    establishedYear: "",
    logo: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
      linkedin: "",
    },
    stats: {
      totalStudents: 1250,
      totalTeachers: 68,
      classrooms: 45,
      labs: 8,
      awardsCount: 35,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.getSchoolProfile();
        if (res.success && res.data) {
          const d = res.data;
          setForm({
            name: d.name || "",
            code: d.code || "",
            affiliationNumber: d.affiliationNumber || "",
            email: d.email || "",
            phone: d.phone || "",
            website: d.website || "",
            tagline: d.tagline || "",
            establishedYear: d.establishedYear || "2005",
            logo: d.logo || "",
            address: {
              street: d.address?.street || "",
              city: d.address?.city || "",
              state: d.address?.state || "",
              zipCode: d.address?.zipCode || "",
              country: d.address?.country || "India",
            },
            socialLinks: {
              facebook: d.socialLinks?.facebook || "",
              twitter: d.socialLinks?.twitter || "",
              instagram: d.socialLinks?.instagram || "",
              youtube: d.socialLinks?.youtube || "",
              linkedin: d.socialLinks?.linkedin || "",
            },
            stats: {
              totalStudents: d.stats?.totalStudents || 1250,
              totalTeachers: d.stats?.totalTeachers || 68,
              classrooms: d.stats?.classrooms || 45,
              labs: d.stats?.labs || 8,
              awardsCount: d.stats?.awardsCount || 35,
            },
          });
        }
      } catch (err) {
        showToast("Error loading school profile: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateSchoolProfile(form);
      if (res.success) {
        showToast("School Identity & Contact details updated successfully!", "success");
      } else {
        showToast(res.message || "Failed to update profile", "error");
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
        Loading school profile data...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
            Institution CMS
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            School Name, Logo & Contact Details
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Modifications here automatically update the header, footer, contact
            pages, and receipts across the public school website.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          isLoading={saving}
          className="shrink-0"
        >
          💾 Save Changes
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. School Logo */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-base">
            School Logo & Crest
          </h3>
          <p className="text-xs text-slate-400">
            Upload an official PNG, SVG or JPG logo. This renders on the website
            navbar, footer, and fee vouchers.
          </p>
          <ImageUpload
            value={form.logo}
            onChange={(url) => setForm({ ...form, logo: url })}
            placeholder="Upload school crest or logo"
          />
        </div>

        {/* 2. Basic Identity */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="font-extrabold text-white text-base">
            Institutional Identity & Registration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="School Official Name *"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Skywings International Academy"
            />
            <Input
              label="School Registration Code *"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="SKYWINGS-001"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Board Affiliation Number"
              value={form.affiliationNumber}
              onChange={(e) =>
                setForm({ ...form, affiliationNumber: e.target.value })
              }
              placeholder="CBSE-2026-9874"
            />
            <Input
              label="Established Year"
              value={form.establishedYear}
              onChange={(e) =>
                setForm({ ...form, establishedYear: e.target.value })
              }
              placeholder="2005"
            />
          </div>

          <Input
            label="School Motto / Header Tagline"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            placeholder="Empowering Young Minds For A Transformative Future"
          />
        </div>

        {/* 3. Contact & Location */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="font-extrabold text-white text-base">
            Campus Contact & Postal Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Contact Email *"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@skywingsschool.com"
            />
            <Input
              label="Phone Number *"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Official Website URL"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://skywingsschool.com"
            />
          </div>

          <div className="space-y-4 pt-2">
            <Input
              label="Campus Street Address"
              value={form.address.street}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, street: e.target.value },
                })
              }
              placeholder="Plot No. 42, Tech Park Enclave"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="City"
                value={form.address.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: { ...form.address, city: e.target.value },
                  })
                }
                placeholder="Bangalore"
              />
              <Input
                label="State"
                value={form.address.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: { ...form.address, state: e.target.value },
                  })
                }
                placeholder="Karnataka"
              />
              <Input
                label="Postal / Zip Code"
                value={form.address.zipCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: { ...form.address, zipCode: e.target.value },
                  })
                }
                placeholder="560001"
              />
              <Input
                label="Country"
                value={form.address.country}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: { ...form.address, country: e.target.value },
                  })
                }
                placeholder="India"
              />
            </div>
          </div>
        </div>

        {/* 4. Statistics Counter */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="font-extrabold text-white text-base">
            Institutional Highlights Counter (Homepage Stats)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Input
              label="Total Students"
              type="number"
              value={form.stats.totalStudents}
              onChange={(e) =>
                setForm({
                  ...form,
                  stats: { ...form.stats, totalStudents: Number(e.target.value) },
                })
              }
            />
            <Input
              label="Total Faculty"
              type="number"
              value={form.stats.totalTeachers}
              onChange={(e) =>
                setForm({
                  ...form,
                  stats: { ...form.stats, totalTeachers: Number(e.target.value) },
                })
              }
            />
            <Input
              label="Classrooms"
              type="number"
              value={form.stats.classrooms}
              onChange={(e) =>
                setForm({
                  ...form,
                  stats: { ...form.stats, classrooms: Number(e.target.value) },
                })
              }
            />
            <Input
              label="Science Labs"
              type="number"
              value={form.stats.labs}
              onChange={(e) =>
                setForm({
                  ...form,
                  stats: { ...form.stats, labs: Number(e.target.value) },
                })
              }
            />
            <Input
              label="Awards Won"
              type="number"
              value={form.stats.awardsCount}
              onChange={(e) =>
                setForm({
                  ...form,
                  stats: { ...form.stats, awardsCount: Number(e.target.value) },
                })
              }
            />
          </div>
        </div>

        {/* 5. Social Media Channels */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="font-extrabold text-white text-base">
            Social Media Profiles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Facebook URL"
              value={form.socialLinks.facebook}
              onChange={(e) =>
                setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, facebook: e.target.value },
                })
              }
              placeholder="https://facebook.com/skywingsschool"
            />
            <Input
              label="Twitter / X URL"
              value={form.socialLinks.twitter}
              onChange={(e) =>
                setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, twitter: e.target.value },
                })
              }
              placeholder="https://twitter.com/skywingsschool"
            />
            <Input
              label="Instagram URL"
              value={form.socialLinks.instagram}
              onChange={(e) =>
                setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, instagram: e.target.value },
                })
              }
              placeholder="https://instagram.com/skywingsschool"
            />
            <Input
              label="YouTube Channel URL"
              value={form.socialLinks.youtube}
              onChange={(e) =>
                setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, youtube: e.target.value },
                })
              }
              placeholder="https://youtube.com/skywingsschool"
            />
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            isLoading={saving}
            size="lg"
            className="px-8"
          >
            Save All Institutional Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SchoolProfileCMS;

