import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  FileSpreadsheet,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TextShimmer } from '../components/motion-primitives/TextShimmer';
import { TextRoll } from '../components/motion-primitives/TextRoll';

export const Auth = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  useEffect(() => {
    if (location.pathname === '/signup') {
      setMode('signup');
    } else if (location.pathname === '/login') {
      setMode('login');
    }
  }, [location.pathname]);

  const triggerShake = (msg) => {
    setErrorMessage(msg);
    setShakeKey((prev) => prev + 1);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail || !loginPassword) {
      triggerShake('Please enter your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      setSuccessMessage('Logged in successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      triggerShake(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signupName || !signupEmail || !signupPassword) {
      triggerShake('Please complete all required fields.');
      return;
    }

    if (signupPassword.length < 6) {
      triggerShake('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        phone: signupPhone,
        role: 'user',
      });
      setSuccessMessage('Account created! Entering workspace...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      triggerShake(err.response?.data?.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-neutral-900 overflow-hidden flex flex-col justify-between selection:bg-orange-500/20 selection:text-orange-900 pb-24 font-sans">
      {/* Background Soft Organic Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[750px] h-[750px] bg-gradient-to-bl from-orange-200/30 via-amber-100/25 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[550px] h-[550px] bg-orange-100/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/6 w-[450px] h-[450px] bg-amber-400/10 rounded-full blur-[100px]" />
      </div>

      {/* TOP HEADER */}
      <header className="relative z-30 w-full px-6 sm:px-14 py-6 flex items-center justify-between">
        <Link to="/" className="group flex flex-col">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl sm:text-4xl font-black tracking-widest text-[#1A1A1A] inline-flex items-center">
              <TextRoll duration={0.6} getEnterDelay={(i) => i * 0.08} getExitDelay={(i) => i * 0.08 + 0.15}>
                NAMI
              </TextRoll>
            </span>
            <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-[#FFF3EB] text-[#F97316] border border-[#FFD9C2]">
              FLOW
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 font-medium tracking-tight -mt-0.5">
            The payment that flow.
          </span>
        </Link>

        {/* Floating Saved to Excel Badge (top right area) */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 border border-emerald-400/40 shadow-[0_8px_25px_rgba(16,185,129,0.15)] backdrop-blur-md">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div className="text-left text-xs leading-tight">
            <p className="font-bold text-neutral-900">Saved to Excel</p>
            <p className="text-[10px] text-neutral-500 font-medium">Automatically</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setErrorMessage('');
            setSuccessMessage('');
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-neutral-800 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <span>{mode === 'login' ? 'Create Account' : 'Sign In'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* MAIN HERO & BUBBLE CONTAINER */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: Editorial Presentation */}
        <div className="lg:col-span-6 flex flex-col justify-center relative">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-300 bg-white/70 text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-600 w-fit mb-4 backdrop-blur-sm shadow-xs"
          >
            <span>FAST / SECURE / EFFORTLESS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1A1A] mb-4 font-serif-editorial leading-[1.08]"
          >
            Payments <br />
            that{' '}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E0E] to-[#FFA066] font-normal">
              Flow.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-neutral-600 max-w-md leading-relaxed mb-6 font-medium"
          >
            Collect payments. Store data automatically in Excel. Focus on what matters.
          </motion.p>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <button
              type="button"
              onClick={() => {
                setMode('signup');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1A1A] hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <span>Start Accepting Payments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3.5 pt-2"
          >
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&auto=format&fit=crop&q=80"
                alt="Member"
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&auto=format&fit=crop&q=80"
                alt="Member"
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&auto=format&fit=crop&q=80"
                alt="Member"
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
              />
            </div>
            <div className="text-xs leading-tight">
              <p className="font-bold text-neutral-900">Trusted by 10,000+</p>
              <p className="text-neutral-500 text-[11px]">students, creators & businesses</p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 3D Liquid Glass Bubble with Floating Nodes & Form */}
        <div className="lg:col-span-6 flex items-center justify-center relative min-h-[540px]">
          
          {/* SVG CURVED CONNECTOR LINES */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible hidden sm:block"
            viewBox="0 0 500 500"
            fill="none"
          >
            {/* Rahul connector */}
            <path
              d="M 50 80 C 120 80, 160 140, 230 170"
              stroke="#E2D9CC"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Sneha connector */}
            <path
              d="M 80 240 C 140 240, 170 230, 210 235"
              stroke="#E2D9CC"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Aman connector */}
            <path
              d="M 50 420 C 130 420, 160 360, 220 310"
              stroke="#E2D9CC"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>

          {/* FLOATING PAYMENT NODE PILLS */}
          {/* Node 1: Rahul */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-3 left-2 sm:-left-6 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/95 border border-white shadow-[0_8px_20px_rgba(0,0,0,0.06)] backdrop-blur-md select-none"
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&auto=format&fit=crop&q=80"
              alt="Rahul"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-left text-[11px] leading-tight">
              <p className="text-neutral-500 text-[10px]">Rahul just paid</p>
              <p className="font-bold text-neutral-900 flex items-center gap-1">
                ₹500 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              </p>
            </div>
          </motion.div>

          {/* Node 2: Sneha */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="absolute top-1/2 -translate-y-12 -left-32 sm:-left-40 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/95 border border-white shadow-[0_8px_20px_rgba(0,0,0,0.06)] backdrop-blur-md select-none"
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&auto=format&fit=crop&q=80"
              alt="Sneha"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-left text-[11px] leading-tight">
              <p className="text-neutral-500 text-[10px]">Sneha just paid</p>
              <p className="font-bold text-neutral-900 flex items-center gap-1">
                ₹1,200 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              </p>
            </div>
          </motion.div>

          {/* Node 3: Aman */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-4 left-4 sm:-left-4 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/95 border border-white shadow-[0_8px_20px_rgba(0,0,0,0.06)] backdrop-blur-md select-none"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&auto=format&fit=crop&q=80"
              alt="Aman"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-left text-[11px] leading-tight">
              <p className="text-neutral-500 text-[10px]">Aman just paid</p>
              <p className="font-bold text-neutral-900 flex items-center gap-1">
                ₹750 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              </p>
            </div>
          </motion.div>

          {/* Handwritten Annotation */}
          <div className="absolute -bottom-1 left-28 sm:left-24 z-10 select-none pointer-events-none">
            <span className="font-handwriting text-xl sm:text-2xl text-neutral-600 block -rotate-6">
              Small Payments Big Possibilities
            </span>
          </div>

          {/* SIGNATURE 3D LIQUID GLASS BUBBLE VESSEL */}
          <motion.div
            key={shakeKey}
            animate={
              errorMessage
                ? {
                    x: [0, -8, 8, -6, 6, -3, 3, 0],
                    transition: { duration: 0.35 },
                  }
                : {}
            }
            className="relative w-full max-w-[430px] rounded-[42px] p-7 sm:p-9 liquid-glass-blob shadow-[0_30px_70px_rgba(180,130,90,0.2),inset_0_2px_4px_rgba(255,255,255,0.95)] z-10"
          >
            {/* Organic 3D Bubble Vessel Frame Graphic */}
            <img
              src="/bubble-vessel.png"
              alt=""
              className="absolute -inset-8 sm:-inset-10 w-[calc(100%+64px)] sm:w-[calc(100%+80px)] h-[calc(100%+64px)] sm:h-[calc(100%+80px)] object-contain pointer-events-none select-none opacity-90 scale-105 z-0 drop-shadow-xl"
            />

            {/* Inner Content (Z-10 so it's above bubble vessel) */}
            <div className="relative z-10 flex flex-col">
              
              {/* Mode Switcher Pill */}
              <div className="flex items-center justify-center mb-5">
                <div className="inline-flex p-1 rounded-full bg-neutral-200/60 backdrop-blur-md border border-white/60 shadow-inner">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      mode === 'login'
                        ? 'bg-[#1A1A1A] text-white shadow-md'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      mode === 'signup'
                        ? 'bg-[#1A1A1A] text-white shadow-md'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="text-center mb-5">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A1A1A]">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1 font-medium">
                  {mode === 'login'
                    ? 'Quick • Secure • Reliable'
                    : 'Instant local Excel ledger synchronization'}
                </p>
              </div>

              {/* Alerts */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs font-semibold text-center backdrop-blur-md"
                >
                  {errorMessage}
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-semibold text-center backdrop-blur-md"
                >
                  {successMessage}
                </motion.div>
              )}

              {/* LOGIN FORM */}
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-1 pl-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/90 border border-neutral-300/80 focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-orange-400/20 shadow-xs transition-all">
                      <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="vivekwadhwani1@gmail.com"
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-1 pl-1">
                      Password
                    </label>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/90 border border-neutral-300/80 focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-orange-400/20 shadow-xs transition-all">
                      <Lock className="w-4 h-4 text-neutral-400 shrink-0" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="liquid-orange-btn w-full py-3.5 px-6 rounded-full text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 shadow-lg shadow-orange-500/30"
                    >
                      {submitting ? (
                        <TextShimmer shimmerColor="#FFFFFF" baseColor="rgba(255, 255, 255, 0.7)">
                          Signing in…
                        </TextShimmer>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* SIGNUP FORM */
                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-0.5 pl-1">
                      Full Name
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-neutral-300/80 focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-orange-400/20 shadow-xs transition-all">
                      <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Vivek Sharma"
                        className="w-full bg-transparent text-xs font-semibold text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-0.5 pl-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-neutral-300/80 focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-orange-400/20 shadow-xs transition-all">
                      <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="vivekwadhwani1@gmail.com"
                        className="w-full bg-transparent text-xs font-semibold text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-0.5 pl-1">
                        Phone
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-neutral-300/80 focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-orange-400/20 shadow-xs transition-all">
                        <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <input
                          type="tel"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full bg-transparent text-xs font-semibold text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-0.5 pl-1">
                        Password
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-neutral-300/80 focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-orange-400/20 shadow-xs transition-all">
                        <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <input
                          type="password"
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-transparent text-xs font-semibold text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="liquid-orange-btn w-full py-3.5 px-6 rounded-full text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 shadow-lg shadow-orange-500/30"
                    >
                      {submitting ? (
                        <TextShimmer shimmerColor="#FFFFFF" baseColor="rgba(255, 255, 255, 0.7)">
                          Creating account…
                        </TextShimmer>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Excel Sync Note */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 pt-3 mt-1">
                <Lock className="w-3 h-3 text-neutral-400" />
                <span>Your data will be automatically saved to Excel</span>
              </div>

              {/* Bottom Switch Link */}
              <div className="text-center text-xs text-neutral-600 mt-2">
                {mode === 'login' ? (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="font-bold text-[#1A1A1A] underline hover:text-[#F97316] cursor-pointer"
                    >
                      Create one
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-bold text-[#1A1A1A] underline hover:text-[#F97316] cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

