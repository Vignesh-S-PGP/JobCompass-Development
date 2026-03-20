import { forwardRef } from "react";

const Input = forwardRef(({
  className = "",
  type = "text",
  label,
  error,
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${error ? "border-destructive focus-visible:ring-destructive" : ""} ${className}`}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
