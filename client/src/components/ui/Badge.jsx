import React from 'react';

const Badge = ({ children, status = 'default', className = '' }) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-700 border-slate-200',
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    due: 'bg-amber-50 text-amber-700 border-amber-200',
    overdue: 'bg-rose-50 text-rose-700 border-rose-200',
    upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
    present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    absent: 'bg-rose-50 text-rose-700 border-rose-200',
    late: 'bg-amber-50 text-amber-700 border-amber-200',
    leave: 'bg-purple-50 text-purple-700 border-purple-200',
    important: 'bg-amber-50 text-amber-800 border-amber-200',
    urgent: 'bg-rose-50 text-rose-800 border-rose-200',
    default: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const currentStyle = styles[status?.toLowerCase()] || styles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle} ${className}`}
    >
      {children || status}
    </span>
  );
};

export default Badge;

