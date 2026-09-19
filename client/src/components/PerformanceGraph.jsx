import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

export const PerformanceGraph = ({ transactions = [] }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Performance data points mapped across months matching the reference UI
  const points = [
    { month: 'Jan', val: 35, displayVal: '₹35,000', txCount: 4, x: 20, y: 115 },
    { month: 'Feb', val: 95, displayVal: '₹95,000', txCount: 9, x: 90, y: 65 },
    { month: 'Mar', val: 75, displayVal: '₹75,000', txCount: 7, x: 160, y: 85 },
    { month: 'Apr', val: 130, displayVal: '₹1,30,000', txCount: 14, x: 230, y: 45 },
    { month: 'May', val: 105, displayVal: '₹1,05,000', txCount: 11, x: 300, y: 70 },
    { month: 'Jun', val: 145, displayVal: '₹1,45,000', txCount: 16, x: 370, y: 35 },
    { month: 'Dec', val: 190, displayVal: '₹1,90,000', txCount: 22, x: 470, y: 15 },
  ];

  // SVG Path for smooth cubic bezier wave curve matching reference screenshot
  const linePath = 'M 20,115 C 55,45 70,60 90,65 C 120,72 135,90 160,85 C 190,80 205,40 230,45 C 265,50 275,75 300,70 C 330,65 345,30 370,35 C 410,42 435,20 470,15';
  const areaPath = `${linePath} L 470,130 L 20,130 Z`;

  return (
    <div className="relative rounded-[28px] p-5 sm:p-6 overflow-hidden bg-black/40 backdrop-blur-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)] text-white transition-all">
      {/* Specular Highlight Arc */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none rounded-t-[28px]" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold tracking-tight text-white drop-shadow-md">
              Performance
            </h3>
            <span className="text-[11px] text-white/50 font-medium">
              Flow Velocity
            </span>
          </div>
          <p className="text-[11px] text-white/60 mt-0.5">
            Real-time transaction volume & settlement index
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/25 text-[11px] font-bold text-amber-300 backdrop-blur-xl shadow-sm">
            <TrendingUp className="w-3 h-3 text-amber-400" />
            <span>Growth +18%</span>
          </span>
        </div>
      </div>

      {/* Graph Visual Area */}
      <div className="relative z-10 flex gap-3">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[10px] font-mono text-white/50 py-0.5 text-right select-none h-32 w-6 shrink-0">
          <span>200</span>
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>

        {/* SVG Curve Container */}
        <div className="relative flex-1 h-32">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="w-full border-b border-white/10" />
            <div className="w-full border-b border-white/10" />
            <div className="w-full border-b border-white/10" />
            <div className="w-full border-b border-white/10" />
            <div className="w-full border-b border-white/15" />
          </div>

          <svg
            viewBox="0 0 500 135"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="performanceAreaGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
              </linearGradient>

              <filter id="lineShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#F97316" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Glowing Area Fill */}
            <motion.path
              initial={{ opacity: 0, d: 'M 20,130 L 470,130 L 470,130 L 20,130 Z' }}
              animate={{ opacity: 1, d: areaPath }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              fill="url(#performanceAreaGlow)"
            />

            {/* Glowing Wave Stroke Line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              d={linePath}
              fill="none"
              stroke="#F97316"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#lineShadow)"
            />

            {/* Interactive Data Nodes */}
            {points.map((pt, idx) => (
              <g key={pt.month}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint === idx ? 6.5 : 4}
                  className="cursor-pointer transition-all duration-200"
                  fill="#FFFFFF"
                  stroke="#F97316"
                  strokeWidth="2.5"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
          </svg>

          {/* Tooltip Overlay */}
          {hoveredPoint !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute pointer-events-none px-3 py-1.5 rounded-xl bg-black/95 text-white text-[11px] font-semibold shadow-2xl border border-white/20 backdrop-blur-xl z-30"
              style={{
                left: `${(points[hoveredPoint].x / 500) * 100}%`,
                top: `${(points[hoveredPoint].y / 135) * 100 - 35}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="font-bold text-orange-400">
                {points[hoveredPoint].month}: {points[hoveredPoint].displayVal}
              </div>
              <div className="text-[10px] text-white/70">
                {points[hoveredPoint].txCount} transfers settled
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* X-Axis Month Labels */}
      <div className="flex justify-between pl-9 pr-2 pt-2 text-[11px] font-medium text-white/60 select-none relative z-10 border-t border-white/10 mt-2">
        {points.map((pt) => (
          <span key={pt.month} className="hover:text-orange-400 transition-colors cursor-default">
            {pt.month}
          </span>
        ))}
      </div>
    </div>
  );
};
