const Badge = ({
  children,
  variant = "default",
  className = ""
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground border-transparent",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
    destructive: "bg-destructive text-destructive-foreground border-transparent",
    outline: "text-foreground border-border",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-700/20 dark:text-emerald-400 border-transparent",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-700/20 dark:text-amber-400 border-transparent",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-400 border-transparent",
  };

  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Badge;
