import React from "react";

const Badge = ({ status = "active", children }) => {
  const norm = String(status).toLowerCase();

  let styles = "bg-slate-800 text-slate-300 border-slate-700";

  if (norm === "active" || norm === "published" || norm === "true") {
    styles = "bg-emerald-950/80 text-emerald-300 border-emerald-800/80";
  } else if (norm === "inactive" || norm === "draft" || norm === "false") {
    styles = "bg-slate-800 text-slate-400 border-slate-700";
  } else if (norm === "urgent") {
    styles = "bg-rose-950/80 text-rose-300 border-rose-800/80";
  } else if (norm === "important") {
    styles = "bg-amber-950/80 text-amber-300 border-amber-800/80";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles}`}
    >
      {children || status}
    </span>
  );
};

export default Badge;

