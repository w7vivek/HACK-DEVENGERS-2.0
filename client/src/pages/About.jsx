import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Layers, Laptop, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextRoll } from '../components/motion-primitives/TextRoll';

export const About = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const sections = [
    {
      title: 'Intentional Simplicity',
      desc: 'NAMI rejects unnecessary form fields and payment clutter. By strictly supporting UPI, Cash, and Net Banking, operations stay focused and resilient. There are no redundant card gateways or third-party redirect loops.',
      icon: Layers,
      tag: 'Zero Distractions',
    },
    {
      title: 'Local Ledger Ownership',
      desc: 'Browsers cannot write directly to local files on your operating system for security reasons. NAMI bridges this gap with an ultra-lightweight, native background agent that lives in your system tray, appending transactions directly to your local Excel sheets the instant they are approved.',
      icon: Laptop,
      tag: 'Desktop Companion',
    },
    {
      title: 'Role-Based Architecture',
      desc: 'NAMI provides unified UI layers where visual themes adapt to authorization states without fragmenting codebase logic: warm cream aesthetics for regular operators and dark slate precision for administrative auditing.',
      icon: Shield,
      tag: 'Adaptive Theme',
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
        <div className="absolute top-[15%] left-[8%] w-80 h-80 rounded-full bg-orange-500/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-88 h-88 rounded-full bg-amber-400/20 blur-[130px] pointer-events-none" />
      </div>

      {/* Ambient Floating Glass Bubbles */}
      <motion.div
        animate={{
          y: [0, -22, 0],
          x: [0, 14, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[10%] w-52 h-52 rounded-full bg-gradient-to-br from-white/30 via-white/10 to-transparent backdrop-blur-xl border border-white/40 shadow-[inset_0_4px_16px_rgba(255,255,255,0.4),0_20px_40px_rgba(0,0,0,0.3)] pointer-events-none z-10"
      />

      <motion.div
        animate={{
          y: [0, 18, 0],
          x: [0, -12, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-36 right-[8%] w-44 h-44 rounded-full bg-gradient-to-tr from-white/35 via-orange-400/15 to-transparent backdrop-blur-xl border border-white/45 shadow-[inset_0_4px_16px_rgba(255,255,255,0.5),0_15px_30px_rgba(0,0,0,0.3)] pointer-events-none z-10"
      />

      <div className="max-w-4xl mx-auto px-6 pt-12 sm:pt-16 w-full flex-1 flex flex-col justify-center relative z-20">
        {/* Header Section */}
        <header className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-200 mb-4 shadow-xs">
            MANIFESTO & CORE PRINCIPLES
          </div>

          <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-[1.08]">
            About <span className="font-sans font-black tracking-widest text-[#FF8A3D] inline-block drop-shadow-md"><TextRoll duration={0.6}>NAMI</TextRoll></span>
          </h1>

          <p className="text-white/80 mt-4 text-sm sm:text-base leading-relaxed drop-shadow-sm">
            "The payment that flow." Born out of frustration with bloated fintech tools that isolate your financial records inside closed gardens.
          </p>
        </header>

        {/* 3 Aesthetic Ultra-Glass Cards */}
        <div className="space-y-6">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -4 }}
                className="relative rounded-[32px] p-8 overflow-hidden transition-all duration-300 group bg-white/[0.12] hover:bg-white/[0.18] backdrop-blur-2xl border border-white/30 hover:border-white/50 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.45),0_25px_50px_-12px_rgba(0,0,0,0.5)]"
              >
                {/* Specular Highlight Arc */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[32px]" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-orange-400 shadow-sm backdrop-blur-md group-hover:scale-105 transition-transform shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl font-bold text-white drop-shadow-xs">
                        {sec.title}
                      </h2>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-orange-300 px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/30">
                        {sec.tag}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed drop-shadow-xs">
                      {sec.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info & cursor attribution */}
        <footer className="mt-14 text-center text-xs text-white/50 space-y-1">
          <p>© {new Date().getFullYear()} NAMI. The payment that flow.</p>
          <p className="text-[11px] text-white/40">
            Pay Cursor created by <a href="https://www.flaticon.com/authors/juicy_fish" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/70">juicy_fish</a> from Flaticon
          </p>
        </footer>
      </div>
    </div>
  );
};
