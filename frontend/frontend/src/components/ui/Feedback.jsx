import React from "react";

export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded-2xl ${className}`} />
);

export const SkeletonCard = ({ rows = 3 }) => (
  <div className="bg-white border border-slate-100 p-8 rounded-[32px] space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="w-14 h-14" />
      <div className="space-y-2">
        <Skeleton className="w-40 h-5" />
        <Skeleton className="w-24 h-3" />
      </div>
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className={`h-4 w-full ${i === rows - 1 ? 'w-2/3' : ''}`} />
    ))}
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[40px] p-20 text-center flex flex-col items-center animate-in fade-in duration-700">
    {Icon && (
      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-sm mb-8">
        <Icon size={40} />
      </div>
    )}
    <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-400 font-bold max-w-sm mx-auto mb-10">
      {description}
    </p>
    {action && action}
  </div>
);
