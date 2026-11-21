import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error,
  helpText,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 text-xs bg-slate-800/90 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
          error ? "border-rose-500" : "border-slate-700/80"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
        {...props}
      />
      {helpText && <p className="text-[11px] text-slate-400">{helpText}</p>}
      {error && <p className="text-[11px] text-rose-400 font-semibold">{error}</p>}
    </div>
  );
};

export default Input;

