import React from 'react';
import { motion } from 'motion/react';

export const GlowEffect = ({
  children,
  className = '',
  colors = ['#0894FF', '#C959DD', '#FF2E54', '#FF9004'],
  mode = 'rotate', // 'rotate' | 'static' | 'pulse'
  blur = 'medium', // 'soft' | 'medium' | 'strong'
  duration = 4,
  scale = 1,
  active = true,
}) => {
  if (!active) return children || null;

  const blurMap = {
    soft: 'blur-sm',
    medium: 'blur-md',
    strong: 'blur-xl',
  };

  const blurClass = blurMap[blur] || (typeof blur === 'string' ? blur : 'blur-md');
  const gradientString = `conic-gradient(from 0deg, ${colors.join(', ')}, ${colors[0]})`;

  const glowElement = (
    <motion.div
      initial={mode === 'rotate' ? { rotate: 0 } : { opacity: 0.8 }}
      animate={
        mode === 'rotate'
          ? { rotate: 360 }
          : mode === 'pulse'
          ? { opacity: [0.6, 0.95, 0.6], scale: [0.98, 1.02, 0.98] }
          : {}
      }
      transition={
        mode === 'rotate'
          ? { duration, repeat: Infinity, ease: 'linear' }
          : mode === 'pulse'
          ? { duration, repeat: Infinity, ease: 'easeInOut' }
          : undefined
      }
      style={{
        background: gradientString,
        transformOrigin: 'center center',
      }}
      className={`absolute -inset-1 rounded-[inherit] ${blurClass} opacity-85 pointer-events-none -z-10`}
    />
  );

  if (!children) {
    return glowElement;
  }

  return (
    <div className={`relative inline-flex items-center justify-center rounded-2xl ${className}`}>
      {glowElement}
      {children}
    </div>
  );
};

export default GlowEffect;
