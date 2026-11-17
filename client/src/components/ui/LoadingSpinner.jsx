import React from 'react';

const LoadingSpinner = ({ label = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
};

export default LoadingSpinner;

