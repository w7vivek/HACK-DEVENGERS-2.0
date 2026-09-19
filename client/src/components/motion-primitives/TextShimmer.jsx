import React from 'react';
import { motion } from 'motion/react';

export const TextShimmer = ({
  children,
  className = '',
  shimmerColor = '#F97316',
  baseColor = 'rgba(26, 26, 26, 0.45)',
  duration = 2,
}) => {
  return (
    <motion.span
      initial={{ backgroundPosition: '100% 0' }}
      animate={{ backgroundPosition: '-100% 0' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={{
        backgroundImage: `linear-gradient(90deg, ${baseColor} 0%, ${shimmerColor} 50%, ${baseColor} 100%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
      className={`inline-block select-none font-medium ${className}`}
    >
      {children}
    </motion.span>
  );
};
