import React from "react";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-slate-900 px-10 py-8 flex items-center justify-between">
          <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="group bg-slate-800 p-2 rounded-xl hover:bg-rose-500 transition-all"
          >
            <X size={20} className="text-slate-300 group-hover:text-white" />
          </button>
        </div>

        <div className="p-10 space-y-10 max-h-[85vh] overflow-y-auto">
          {children}
        </div>

        {footer && (
          <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
