import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  ShieldCheck,
  Zap,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TextRoll } from '../components/motion-primitives/TextRoll';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, visible: false });
  const [lang, setLang] = useState('en');

  // Strictly play /background.mp4 silently without sound
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
    });
  };

  const handleMouseLeave = () => {
    setCursorPos((prev) => ({ ...prev, visible: false }));
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen overflow-hidden bg-black text-white select-none flex flex-col justify-between"
    >
      {/* Top coral/pink hairline border as seen in Petra Garmon */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-[#FF8DA1] z-50 pointer-events-none" />

      {/* FULLSCREEN BACKGROUND VIDEO (/background.mp4 ONLY, NO UPLOAD) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/background.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
        />

        {/* Cinematic Vignette Overlays for perfect legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* FLOATING MOUSE FOLLOWER: "View Project" Pill & Pink Silhouette Contour */}
      <AnimatePresence>
        {cursorPos.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: cursorPos.x - 70,
              y: cursorPos.y - 25,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 300,
              mass: 0.4,
            }}
            className="pointer-events-none absolute z-40 hidden md:flex items-center gap-2"
          >

            
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER: Project Name in Petra style (Dock handles full navigation) */}
      <header className="relative z-30 w-full px-8 sm:px-12 py-7 flex items-center justify-between text-white text-xs font-medium tracking-wide">
        {/* Brand Left: Extra Large NAMI with official motion-primitives TextRoll */}
        <Link to="/" className="group flex items-center gap-3 hover:opacity-95 transition-opacity">
          <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-widest text-white inline-flex items-center drop-shadow-2xl">
            <TextRoll duration={0.6} getEnterDelay={(i) => i * 0.08} getExitDelay={(i) => i * 0.08 + 0.15}>
              NAMI
            </TextRoll>
          </span>
        </Link>

        {/* Right Section: Language switcher & Action pill */}
        <div className="flex items-center gap-5">

          <button
            type="button"
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            className="px-5 py-2 rounded-full border border-white/70 text-white text-xs font-medium hover:bg-white hover:text-black transition-all shadow-sm"
          >
            {user ? 'Open Dashboard' : "Let's chat"}
          </button>
        </div>
      </header>

      {/* MAIN HERO CONTENT: "Payments that Flow." with TextRoll */}
      <main className="relative z-20 w-full px-8 sm:px-14 flex-1 flex flex-col justify-center max-w-4xl pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >

          {/* Grand Headline with TextRoll */}
          <h1 className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight text-white leading-[1.03]">
            Payments <br />
            that{' '}
            <span className="italic text-[#F97316] font-normal inline-block">
              <TextRoll duration={0.8} stagger={0.06} delay={0.2}>
                Flow.
              </TextRoll>
            </span>
          </h1>

          {/* Byline and Description */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/80 font-normal pt-1">
            <span className="font-medium text-white">The payment that flow.</span>
            <span className="text-white/40">•</span>
            <span className="text-xs sm:text-sm text-white/70 max-w-xl leading-relaxed">
              Frictionless transaction entry for UPI, Cash, and Net Banking. Synchronized automatically with local Excel spreadsheets.
            </span>
          </div>

          {/* Action CTA */}
          <div className="pt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-neutral-100 transition-all shadow-xl hover:scale-[1.02]"
            >
              <span>Start Accepting Payments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </main>

      {/* BOTTOM STRIP: Video Controls & Attribution */}
      <footer className="relative z-30 w-full px-8 sm:px-14 pb-8 flex items-center justify-between">
        <div className="text-xs text-white/50 tracking-wider hidden sm:block">
          POWERING A BRIGHTER TOMORROW
        </div>

        {/* Video Controls on Bottom-Right */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? 'Pause video' : 'Play video'}
            className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/25 backdrop-blur-md transition-all shadow-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? 'Unmute video' : 'Mute video'}
            className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/25 backdrop-blur-md transition-all shadow-sm"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </footer>
    </div>
  );
};
