import React, { forwardRef } from 'react';

const Input = forwardRef(({ className = '', type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={`
        flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background
        file:border-0 file:bg-transparent file:text-sm file:font-medium
        placeholder:text-muted-foreground
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
        disabled:cursor-not-allowed disabled:opacity-50
        transition-all duration-200
        ${className}
      `}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
