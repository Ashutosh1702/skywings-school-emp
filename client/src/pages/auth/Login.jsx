import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const Login = () => {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "admin@skywings.com",
    password: "Admin@123",
  });
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to role dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "admin")
        navigate("/admin/dashboard", { replace: true });
      else if (user.role === "teacher")
        navigate("/teacher/dashboard", { replace: true });
      else if (user.role === "parent")
        navigate("/parent/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await login(formData.email, formData.password);
    setIsLoading(false);

    if (res.success) {
      showToast("Logged in successfully! Welcome to SkyWings ERP.", "success");
      // Redirect according to role
      const savedUser = JSON.parse(
        localStorage.getItem("skywings_user") || "{}",
      );
      const role = savedUser.role || "admin";

      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });  
      } else if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else if (role === "parent") {
        navigate("/parent/dashboard", { replace: true });
      }
    } else {
      showToast(res.message || "Invalid credentials", "error");
    }
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-800 p-8">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-600 items-center justify-center text-white font-black text-2xl shadow-lg mb-3">
            S
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            SkyWings School ERP
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Skywings Nextgen Tech Pvt. Ltd.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="admin@skywings.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
            required
          />

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign In to Portal
          </Button>
        </form>

        {/* Demo Persona Quick Selectors */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
            Quick Persona Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() =>
                handleQuickLogin("admin@skywings.com", "Admin@123")
              }
              className="py-2 px-1 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 transition"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickLogin("teacher@skywings.com", "Teacher@123")
              }
              className="py-2 px-1 text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 transition"
            >
              👨‍🏫 Teacher
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickLogin("parent@skywings.com", "Parent@123")
              }
              className="py-2 px-1 text-center bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold border border-purple-200 transition"
            >
              👨‍👩‍👦 Parent
            </button>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-3">
            💡 Auto-fallback active: Seamless preview with preloaded records if backend is offline.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
