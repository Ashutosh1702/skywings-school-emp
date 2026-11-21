import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("skywings_admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.login(email, password);
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem("skywings_admin_user", JSON.stringify(res.data));
        localStorage.setItem("skywings_admin_token", res.data.token || "admin-token");
        return { success: true };
      }
      return { success: false, message: res.message || "Login failed" };
    } catch (err) {
      return { success: false, message: err.message || "Login error" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skywings_admin_user");
    localStorage.removeItem("skywings_admin_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;

