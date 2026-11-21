import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const PrincipalDesk = () => {
  const [school, setSchool] = useState(null);

  useEffect(() => {
    api.getSchoolProfile().then((res) => {
      if (res.success && res.data) setSchool(res.data);
    });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Academic Leadership
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            From The Principal's Desk
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            An inspiring message of purpose, growth, and vision from the helm of{" "}
            {school?.name || "Skywings International Academy"}.
          </p>
        </div>
      </section>

      {/* Main Profile & Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Principal Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl space-y-4">
              <div className="w-full h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={
                    school?.principalPhoto ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={school?.principalName || "Principal"}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {school?.principalName || "Dr. Rajesh Sharma"}
                </h2>
                <p className="text-xs font-bold text-blue-600 mt-0.5">
                  {school?.principalDesignation ||
                    "Principal & Academic Director"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {school?.principalQualifications ||
                    "Ph.D in Education, M.Sc Physics, B.Ed"}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                <p>
                  <strong>Office:</strong> Administrative Block, Ground Floor
                </p>
                <p>
                  <strong>Visiting Hours:</strong> Mon - Fri, 2:00 PM - 4:00 PM
                </p>
                <p>
                  <strong>Email:</strong> {school?.email || "principal@skywingsschool.com"}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="w-full block text-center py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
                >
                  Request Appointment
                </Link>
              </div>
            </div>
          </div>

          {/* Full Message */}
          <div className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <span className="inline-block px-3 py-1 rounded bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider">
              Official Welcome Address
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              "Every Child Is Capable of Remarkable Feats When Guided With Love & Purpose"
            </h2>

            <div className="prose text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                Dear Parents, Students, and Esteemed Well-Wishers,
              </p>

              <p>
                {school?.principalMessage ||
                  "It gives me immense joy to welcome you to Skywings International Academy. In an era where technological innovation is redefining every aspect of human life, education must go far beyond the rote memorization of textbooks. We believe that true learning occurs when knowledge is tested through inquiry, when mistakes are embraced as stepping stones, and when empathy is cultivated alongside intellect."}
              </p>

              <p>
                At Skywings, our classrooms are dynamic laboratories of discovery.
                From our hands-on STEM robotics laboratories to our Olympic-grade
                athletic facilities and classical performing arts studio, we
                strive to ensure that every learner discovers and sharpens their
                God-given talents.
              </p>

              <p>
                To our dear students: Dream without limitations, ask questions with
                courage, and act with unyielding integrity. To our parents: Thank
                you for entrusting us with your most cherished treasures. Together,
                let us build an unforgettable learning journey.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-serif italic text-lg text-slate-900">
                  {school?.principalName || "Dr. Rajesh Sharma"}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {school?.principalDesignation || "Principal & Academic Director"}
                </p>
                <p className="text-xs text-blue-600 font-bold">
                  {school?.name || "Skywings International Academy"}
                </p>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Academic Session: 2026-2027
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrincipalDesk;

