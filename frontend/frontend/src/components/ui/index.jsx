import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl";

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-200",
    secondary: "bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-50",
    outline: "bg-transparent text-slate-600 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-100",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-[11px]",
    lg: "px-8 py-4 text-xs",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", hover = true }) => (
  <div className={`bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm transition-all duration-300 ${hover ? 'hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5' : ''} ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, variant = "slate" }) => {
  const variants = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span className={`px-3 py-1 border rounded-lg text-[10px] font-black uppercase tracking-tighter ${variants[variant]}`}>
      {children}
    </span>
  );
};

export const Input = ({ label, error, className = "", ...props }) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
    <input
      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
      {...props}
    />
    {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-wide ml-1">{error}</p>}
  </div>
);

export const StatCard = ({ title, value, icon: Icon, color = "indigo" }) => {
  const colors = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", shadow: "shadow-indigo-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", shadow: "shadow-emerald-100" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", shadow: "shadow-rose-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", shadow: "shadow-amber-100" },
  };

  const theme = colors[color] || colors.indigo;

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm group hover:border-indigo-500 transition-all duration-300">
      <div className={`w-12 h-12 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center mb-6 shadow-lg ${theme.shadow} transition-transform group-hover:scale-110`}>
        {Icon && <Icon size={24} />}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
    </div>
  );
};
