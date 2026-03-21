import React from 'react';

const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'text-foreground border border-input',
    success: 'border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20',
    warning: 'border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20',
    destructive: 'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/80',
  };

  return (
    <div
      className={`
        inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Badge;
