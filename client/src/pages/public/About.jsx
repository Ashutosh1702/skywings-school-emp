import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const About = () => {
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
            About Our Institution
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Nurturing Excellence, Inspiring Futures
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Discover the legacy, values, and pedagogical pillars of{" "}
            {school?.name || "Skywings International Academy"}.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-blue-50/70 border border-blue-200/60 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-blue-500/20">
              🎯
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Our Educational Mission
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To provide a safe, intellectually stimulating, and inclusive
              learning sanctuary that challenges students to realize their highest
              potential. We empower young minds to become compassionate, critical
              thinkers, and ethical global leaders equipped for the dynamic 21st
              century.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-indigo-50/70 border border-indigo-200/60 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-500/20">
              🔭
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Our Guiding Vision
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be recognized as a premier institution of academic distinction,
              creative innovation, and character building, cultivating resilient
              graduates who contribute meaningfully to society and inspire positive
              global transformation.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Our Core Institutional Values
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              The fundamental principles that guide every classroom, lesson, and
              interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-3xl">💎</span>
              <h3 className="font-bold text-slate-900 text-base">
                Integrity & Ethics
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fostering honesty, moral courage, and personal accountability in
                all thoughts and actions.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-3xl">💡</span>
              <h3 className="font-bold text-slate-900 text-base">
                Inquiry & Innovation
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Encouraging questions, creative problem-solving, and scientific
                experimentation.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-3xl">🤝</span>
              <h3 className="font-bold text-slate-900 text-base">
                Empathy & Inclusivity
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Celebrating diverse perspectives and nurturing kindness, respect,
                and civic duty.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-3xl">🏆</span>
              <h3 className="font-bold text-slate-900 text-base">
                Perseverance & Excellence
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instilling the dedication, grit, and passion required to master
                complex disciplines.
              </p>
            </div>
          </div>
        </div>

        {/* Board Affiliation & Accreditation Info Box */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-3 py-1 rounded bg-blue-500/30 text-blue-300 font-bold text-xs uppercase tracking-wider">
                Official Accreditation
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                Central Board of Secondary Education (CBSE)
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="block text-xs text-slate-400">Affiliation No.</span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {school?.affiliationNumber || "CBSE-2026-9874"}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our curriculum adheres to the National Curriculum Framework (NCF)
            and CBSE guidelines, integrating modern NEP 2020 pedagogical
            practices with experiential learning, continuous evaluation, and
            vocational readiness.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-blue-200">
            <span>✓ School Registration Code: {school?.code || "SKYWINGS-001"}</span>
            <span>•</span>
            <span>✓ Co-Educational Day School</span>
            <span>•</span>
            <span>✓ English Medium Instruction</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

