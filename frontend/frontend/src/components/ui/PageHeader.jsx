import React from "react";
import { ChevronLeft } from "lucide-react";

export const PageHeader = ({ title, description, actions, onBack }) => (
  <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8 animate-in fade-in slide-in-from-top-4 duration-700">
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
          {title}
        </h1>
      </div>
      {description && (
        <p className="text-slate-500 font-bold ml-1">{description}</p>
      )}
    </div>
    {actions && (
      <div className="flex items-center gap-4">
        {actions}
      </div>
    )}
  </div>
);
