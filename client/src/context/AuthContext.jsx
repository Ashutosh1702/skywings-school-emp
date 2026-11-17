import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("skywings_token");
      const savedUser = localStorage.getItem("skywings_user");

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Validate with backend in background
          const res = await api.getMe();
          if (res.success && res.data) {
            setUser({ ...res.data, token });
            localStorage.setItem(
              "skywings_user",
              JSON.stringify({ ...res.data, token }),
            );
          }
        } catch (err) {
          console.warn("Session expired or invalid, logging out:", err.message);
          localStorage.removeItem("skywings_token");
          localStorage.removeItem("skywings_user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        localStorage.setItem("skywings_token", res.data.token);
        localStorage.setItem("skywings_user", JSON.stringify(res.data));
        setUser(res.data);
        return { success: true };
      }
      return { success: false, message: res.message || "Login failed" };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Network error or invalid credentials",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("skywings_token");
    localStorage.removeItem("skywings_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
