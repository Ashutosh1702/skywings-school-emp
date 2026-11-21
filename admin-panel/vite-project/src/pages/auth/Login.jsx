import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "admin@skywings.com",
    password: "Admin@123",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await login(formData.email, formData.password);
    setSubmitting(false);

    if (res.success) {
      showToast("Signed in successfully to School CMS Panel!", "success");
      navigate("/");
    } else {
      setError(res.message || "Invalid email or password");
      showToast(res.message || "Authentication failed", "error");
    }
  };

  const handleQuickFill = () => {
    setFormData({
      email: "admin@skywings.com",
      password: "Admin@123",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20">
            S
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            School CMS Administration
          </h1>
          <p className="text-xs text-slate-400">
            Official Content Management Panel for SkyWings School
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Admin Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="admin@skywings.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
          />

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full py-3"
              isLoading={submitting}
            >
              Sign In to Admin Panel →
            </Button>
          </div>
        </form>

        {/* Quick Demo Credentials Pill */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-300">Quick Test Credentials:</span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 underline"
            >
              Fill Credentials
            </button>
          </div>
          <p className="font-mono text-[11px] text-slate-300">
            admin@skywings.com / Admin@123
          </p>
        </div>

        <div className="text-center pt-2">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition"
          >
            ← Return to Public School Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

