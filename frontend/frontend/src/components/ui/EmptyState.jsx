import React from 'react';
import { Search } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  title = "No results found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  actionLabel,
  onAction,
  icon: Icon = Search
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 md:p-24 text-center bg-white border border-slate-200 rounded-[2.5rem] shadow-sm animate-in fade-in">
      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100">
        <Icon size={32} className="text-slate-200" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto mb-8">
        {description}
      </p>
      {actionLabel && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
