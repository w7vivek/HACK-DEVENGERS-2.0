import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const MorphingDialog = ({
  isOpen,
  onClose,
  children,
  triggerLayoutId = 'morphing-dialog-id',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10"
          />
          <motion.div
            layoutId={triggerLayoutId}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 28,
            }}
            className="ultra-glass relative w-full max-w-lg rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-hidden"
          >
            {/* Top specular highlight arc */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none rounded-t-[32px]" />
            <div className="relative z-10">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
