import React from 'react';

export const ProgressiveBlur = ({
  children,
  className = '',
  direction = 'horizontal',
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      {direction === 'horizontal' ? (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#F7F1E9] via-[#F7F1E9]/80 to-transparent backdrop-blur-[2px] z-10 [mask-image:linear-gradient(to_right,black,transparent)] data-[role=admin]:from-slate-950 data-[role=admin]:via-slate-950/80" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#F7F1E9] via-[#F7F1E9]/80 to-transparent backdrop-blur-[2px] z-10 [mask-image:linear-gradient(to_left,black,transparent)] data-[role=admin]:from-slate-950 data-[role=admin]:via-slate-950/80" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#F7F1E9] to-transparent backdrop-blur-[2px] z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F7F1E9] to-transparent backdrop-blur-[2px] z-10" />
        </>
      )}
    </div>
  );
};
