import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const TransitionPanel = ({
  activeIndex,
  children,
  className = '',
  transition = { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
}) => {
  const childArray = React.Children.toArray(children);
  const currentChild = childArray[activeIndex];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={transition}
          className="w-full"
        >
          {currentChild}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
