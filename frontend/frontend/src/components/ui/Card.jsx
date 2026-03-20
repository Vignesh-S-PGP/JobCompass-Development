import { forwardRef } from "react";
import { motion } from "framer-motion";

const Card = forwardRef(({
  className = "",
  children,
  hover = true,
  animate = true,
  ...props
}, ref) => {
  const Component = animate ? motion.div : "div";

  return (
    <Component
      ref={ref}
      initial={animate ? { opacity: 0, y: 10 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      whileHover={hover ? { y: -4, shadow: "0 10px 30px -15px rgba(0,0,0,0.1)" } : undefined}
      className={`rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

export default Card;
