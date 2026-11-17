import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const Unauthorized = () => {
  const { user } = useAuth();

  const getHomePath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'teacher') return '/teacher/dashboard';
    if (user.role === 'parent') return '/parent/dashboard';
    return '/login';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center text-4xl font-extrabold mb-4 shadow-sm">
        🛡️
      </div>
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">403 — Access Denied</h1>
      <p className="text-slate-500 text-sm mt-2 max-w-md">
        You do not have permission to access this module with your current account role ({user?.role || 'guest'}).
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link to={getHomePath()}>
          <Button>Back to My Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;

