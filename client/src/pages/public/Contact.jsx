import React, { useState, useEffect } from "react";
import api from "../../services/api";

const Contact = () => {
  const [school, setSchool] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    childName: "",
    grade: "Grade 1",
    message: "",
  });

  useEffect(() => {
    api.getSchoolProfile().then((res) => {
      if (res.success && res.data) setSchool(res.data);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        parentName: "",
        email: "",
        phone: "",
        childName: "",
        grade: "Grade 1",
        message: "",
      });
    }, 4000);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Connect With Skywings
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Contact Us & Admissions Desk
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Reach our administrative office, arrange a personalized campus tour,
            or submit an online admission inquiry.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Institutional Contact Info
              </h2>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <strong className="block text-slate-800 text-sm">
                      Campus Location:
                    </strong>
                    <p className="mt-1 leading-relaxed">
                      {school?.address?.street || "Plot No. 42, Tech Park Enclave"}
                      <br />
                      {school?.address?.city || "Bangalore"},{" "}
                      {school?.address?.state || "Karnataka"} -{" "}
                      {school?.address?.zipCode || "560001"},{" "}
                      {school?.address?.country || "India"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <strong className="block text-slate-800 text-sm">
                      Phone Helpdesk:
                    </strong>
                    <p className="mt-1">
                      <a
                        href={`tel:${school?.phone}`}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        {school?.phone || "+91 98765 43210"}
                      </a>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Lines open Monday - Saturday (8:00 AM - 4:30 PM)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl">✉️</span>
                  <div>
                    <strong className="block text-slate-800 text-sm">
                      Admissions Email:
                    </strong>
                    <p className="mt-1">
                      <a
                        href={`mailto:${school?.email}`}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        {school?.email || "admin@skywingsschool.com"}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl">🏫</span>
                  <div>
                    <strong className="block text-slate-800 text-sm">
                      Board Affiliation:
                    </strong>
                    <p className="mt-1 font-mono text-slate-700">
                      Code: {school?.affiliationNumber || "CBSE-2026-9874"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* School Map Placeholder Box */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-3">
              <h3 className="font-bold text-base">Campus Visiting Guidelines</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Parents wishing to tour our science robotics lab, Olympic sports
                pavilion, and digital classrooms are welcomed on all working
                weekdays between 10:00 AM and 2:00 PM. Prior scheduling is
                recommended.
              </p>
            </div>
          </div>

          {/* Right: Admission Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Admission Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Online Admission & General Inquiry
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the application below. Our admissions counselor will
                contact you within 24 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 animate-fadeIn">
                <h4 className="font-bold text-base">
                  ✅ Inquiry Submitted Successfully!
                </h4>
                <p className="text-xs">
                  Thank you for your interest in {school?.name}. Our admissions
                  coordinator has received your inquiry and will reach out to{" "}
                  <strong>{formData.phone || formData.email}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Roy"
                      value={formData.parentName}
                      onChange={(e) =>
                        setFormData({ ...formData, parentName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. parent@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Admission Grade Seeking *
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pre-Primary">Pre-Primary (Nursery, KG)</option>
                      <option value="Primary">Primary (Grades 1 to 5)</option>
                      <option value="Middle">Middle (Grades 6 to 8)</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11 Science">Grade 11 (Science)</option>
                      <option value="Grade 11 Commerce">Grade 11 (Commerce)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Student's Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aryan Roy"
                    value={formData.childName}
                    onChange={(e) =>
                      setFormData({ ...formData, childName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Inquiry Message / Questions
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about previous schooling, transport requirements, or questions..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 transition"
                  >
                    Send Admission Inquiry →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

