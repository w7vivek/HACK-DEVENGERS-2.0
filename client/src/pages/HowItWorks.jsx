import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, FileSpreadsheet, ArrowRight, Shield, Cpu, Sparkles, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextRoll } from '../components/motion-primitives/TextRoll';

export const HowItWorks = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Initiate Transfer',
      desc: 'Fill in sender, recipient, and amount. Choose strictly between UPI, Cash, or Net Banking using the expandable toolbar selector.',
      icon: Send,
      badge: 'Zero Friction',
      tag: 'Phase 01 of 3',
    },
    {
      num: '02',
      title: 'Morphing Verification',
      desc: 'The Pay Now button fluidly morphs into a verification card summarizing the transaction. Confirm to instantly lock the record in MongoDB Atlas.',
      icon: CheckCircle,
      badge: 'Atomic Guarantee',
      tag: 'Phase 02 of 3',
    },
    {
      num: '03',
      title: 'Desktop Excel Sync',
      desc: 'The NAMI desktop companion daemon polls in the background. On finding unsynced transactions, it automatically appends formatted rows to your local Excel ledger.',
      icon: FileSpreadsheet,
      badge: 'Local Sovereignty',
      tag: 'Phase 03 of 3',
    },
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col justify-between selection:bg-orange-500/30 selection:text-orange-200 pb-28">
      {/* FULLSCREEN BACKGROUND VIDEO (/background.mp4) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src="/background.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
        />

        {/* Frosted Vignette Overlays for optical depth and text contrast */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[3px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80 pointer-events-none" />

        {/* Ambient warm glowing light orbs behind frosted cards */}
        <div className="absolute top-[12%] right-[10%] w-80 h-80 rounded-full bg-orange-500/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[8%] w-88 h-88 rounded-full bg-amber-400/20 blur-[130px] pointer-events-none" />
      </div>

      {/* Floating Glass Bubbles */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 12, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 right-[12%] w-56 h-56 rounded-full bg-gradient-to-br from-white/30 via-white/10 to-transparent backdrop-blur-xl border border-white/40 shadow-[inset_0_4px_16px_rgba(255,255,255,0.4),0_20px_40px_rgba(0,0,0,0.3)] pointer-events-none z-10"
      />

      <motion.div
        animate={{
          y: [0, 18, 0],
          x: [0, -10, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-40 left-[8%] w-40 h-40 rounded-full bg-gradient-to-tr from-white/35 via-orange-400/15 to-transparent backdrop-blur-xl border border-white/45 shadow-[inset_0_4px_16px_rgba(255,255,255,0.5),0_15px_30px_rgba(0,0,0,0.3)] pointer-events-none z-10"
      />

      <div className="max-w-6xl mx-auto px-6 pt-12 sm:pt-16 w-full flex-1 flex flex-col justify-center relative z-20">
        {/* Header Section */}
        <header className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-200 mb-4 shadow-xs">
            SYSTEM ARCHITECTURE & FLOW
          </div>
          
          <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-[1.08]">
            How <span className="font-sans font-black tracking-widest text-[#FF8A3D] inline-block drop-shadow-md"><TextRoll duration={0.6}>NAMI</TextRoll></span> Flows.
          </h1>

          <p className="text-white/80 mt-4 text-sm sm:text-base leading-relaxed max-w-xl mx-auto drop-shadow-sm">
            A hybrid architecture combining real-time cloud transaction processing with guaranteed local file system Excel automation.
          </p>
        </header>

        {/* 3 Aesthetic Ultra-Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="relative rounded-[32px] p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 group bg-white/[0.12] hover:bg-white/[0.18] backdrop-blur-2xl border border-white/30 hover:border-white/50 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.45),0_25px_50px_-12px_rgba(0,0,0,0.5)]"
              >
                {/* Specular Highlight Arc at Top Edge */}
                <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[32px]" />

                <div className="relative z-10">
                  {/* Top Row: Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-white/30 tracking-tight group-hover:text-orange-400/90 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-orange-400 shadow-sm backdrop-blur-md group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Badge Tag */}
                  <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-orange-300 mb-2 px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/30">
                    {step.badge}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 drop-shadow-xs">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed drop-shadow-xs">
                    {step.desc}
                  </p>
                </div>

                {/* Footer status */}
                <div className="relative z-10 mt-8 pt-4 border-t border-white/15 text-[11px] text-white/50 font-medium flex items-center justify-between">
                  <span>{step.tag}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="liquid-orange-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-bold text-sm shadow-2xl hover:scale-[1.02] cursor-pointer"
          >
            <span>Try Payment Flow Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
