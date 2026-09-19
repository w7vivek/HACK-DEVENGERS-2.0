import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const ToolbarExpandable = ({
  items = [],
  value,
  onChange,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`relative inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/80 border border-black/10 shadow-sm backdrop-blur-md transition-colors data-[role=admin]:bg-slate-900/80 data-[role=admin]:border-slate-700/60 ${className}`}
    >
      {items.map((item) => {
        const isSelected = value === item.id;
        const Icon = item.icon;

        return (
          <motion.button
            key={item.id}
            layout
            type="button"
            onClick={() => {
              onChange?.(item.id);
              setIsExpanded(true);
            }}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors z-10 ${
              isSelected
                ? 'text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/5 data-[role=admin]:text-slate-300'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="toolbar-active-bg"
                className="absolute inset-0 rounded-xl bg-[#F97316] shadow-sm -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <AnimatePresence initial={false}>
              {(isExpanded || isSelected) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </motion.div>
  );
};
