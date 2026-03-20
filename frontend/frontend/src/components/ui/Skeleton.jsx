const Skeleton = ({
  className = "",
  variant = "text"
}) => {
  const variants = {
    text: "h-4 w-full rounded-md",
    circle: "h-10 w-10 rounded-full",
    card: "h-40 w-full rounded-xl",
  };

  return (
    <div className={`animate-pulse bg-muted/40 ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;
