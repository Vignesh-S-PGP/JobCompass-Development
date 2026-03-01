import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 ${hover ? 'hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
