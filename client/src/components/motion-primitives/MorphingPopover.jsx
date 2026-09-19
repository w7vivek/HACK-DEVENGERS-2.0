import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X } from 'lucide-react';

export const MorphingPopover = ({
  title = 'IFSC Format',
  children,
  triggerLabel,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <motion.button
        layoutId="popover-trigger-btn"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 hover:bg-[#F97316] hover:text-white transition-colors text-xs font-semibold"
        title="Format information"
      >
        {triggerLabel || <Info className="w-3 h-3" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="popover-trigger-btn"
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute z-40 top-7 left-0 sm:-left-20 w-64 p-3.5 rounded-2xl bg-white/95 border border-black/10 shadow-xl backdrop-blur-xl text-left data-[role=admin]:bg-slate-900/95 data-[role=admin]:border-slate-700"
          >
            <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-black/5">
              <span className="text-xs font-semibold text-[#1A1A1A] data-[role=admin]:text-white">
                {title}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-neutral-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-xs text-neutral-600 leading-relaxed data-[role=admin]:text-slate-300">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
