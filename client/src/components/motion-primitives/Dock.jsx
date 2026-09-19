import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const DEFAULT_SIZE = 44;

export const Dock = ({
  children,
  className = '',
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-full border border-black/5 bg-white/70 backdrop-blur-xl shadow-lg transition-colors duration-300 data-[role=admin]:bg-slate-900/80 data-[role=admin]:border-slate-700/60 ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          mouseX,
          magnification,
          distance,
        });
      })}
    </motion.div>
  );
};

export const DockIcon = ({
  children,
  mouseX,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  className = '',
  onClick,
  label,
  active = false,
}) => {
  const ref = useRef(null);

  const distanceCalc = useTransform(mouseX || { get: () => Infinity }, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [DEFAULT_SIZE, magnification, DEFAULT_SIZE]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <div className="relative group">
      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onClick={onClick}
        type="button"
        className={`flex items-center justify-center rounded-full transition-colors relative ${
          active
            ? 'bg-[#F97316] text-white shadow-md'
            : 'text-neutral-700 hover:text-black hover:bg-black/5'
        } ${className}`}
      >
        {children}
      </motion.button>
      {label && (
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[11px] font-medium tracking-tight bg-neutral-900 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-sm">
          {label}
        </span>
      )}
    </div>
  );
};
