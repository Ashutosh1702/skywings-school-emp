import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const NotFound = () => {
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
      <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center text-4xl font-extrabold mb-4 shadow-sm">
        404
      </div>
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Page Not Found</h1>
      <p className="text-slate-500 text-sm mt-2 max-w-md">
        The requested URL was not found on this school portal or you might have entered an invalid route.
      </p>
      <div className="mt-6">
        <Link to={getHomePath()}>
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

