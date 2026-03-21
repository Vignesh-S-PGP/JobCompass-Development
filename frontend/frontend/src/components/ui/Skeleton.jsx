import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className = '', variant = 'rect', ...props }) => {
  const baseClasses = "bg-muted animate-pulse relative overflow-hidden";
  const variantClasses = {
    rect: "rounded-md",
    circle: "rounded-full",
    text: "rounded h-4 w-full mb-2 last:mb-0",
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 dark:via-white/10 to-transparent"
      />
    </div>
  );
};

export default Skeleton;
