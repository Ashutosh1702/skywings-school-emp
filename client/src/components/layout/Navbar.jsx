import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Generate breadcrumb segments from current pathname
  const pathnames = location.pathname.split('/').filter((x) => x);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500">
        <span className="text-slate-400">Portal</span>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <React.Fragment key={to}>
              <span className="text-slate-300">/</span>
              {isLast ? (
                <span className="text-slate-900 font-bold capitalize">{value.replace('-', ' ')}</span>
              ) : (
                <Link to={to} className="hover:text-blue-600 capitalize">
                  {value.replace('-', ' ')}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Academic Session indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Session: 2026-2027</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-500 capitalize mt-0.5">{user?.role || 'Guest'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 text-xs font-medium text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition"
            title="Log out"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
