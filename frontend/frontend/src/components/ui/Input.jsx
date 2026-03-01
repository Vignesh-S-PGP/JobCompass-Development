import React from 'react';

const Input = ({ label, error, className = '', icon: Icon, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
        )}
        <input
          className={`
            w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium
            placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600/10 focus:border-primary-600
            transition-all duration-200
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-rose-500 ring-rose-500/10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
