import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet,
  X,
  RefreshCw,
  CheckCircle2,
  Eye,
  Copy,
  Check,
  Building2,
  Pencil,
  Loader2,
} from 'lucide-react';
import { TransactionForm } from '../components/TransactionForm';
import { PerformanceGraph } from '../components/PerformanceGraph';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

export const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const videoRef = useRef(null);

  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [checkingUnsynced, setCheckingUnsynced] = useState(false);
  const [myTransactions, setMyTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [selectedNetBankingTx, setSelectedNetBankingTx] = useState(null);
  const [copiedKey, setCopiedKey] = useState('');

  // Inline Name Editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Auto-play background video safely
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setSavingName(true);
    try {
      if (updateProfile) {
        await updateProfile({ name: nameInput.trim() });
      }
      setIsEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update name', err);
    } finally {
      setSavingName(false);
    }
  };

  const fetchUnsynced = async () => {
    setCheckingUnsynced(true);
    try {
      const res = await api.get('/transactions/unsynced');
      setUnsyncedCount(res.data.count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingUnsynced(false);
    }
  };

  const fetchMyTransactions = async () => {
    setLoadingTx(true);
    try {
      const res = await api.get('/transactions?limit=25');
      // Exclude unconfirmed drafts so only confirmed entries are shown
      const txs = (res.data.transactions || []).filter((tx) => tx.confirmed !== false);
      setMyTransactions(txs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    fetchUnsynced();
    fetchMyTransactions();
  }, []);

  const totalVolume = myTransactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const syncedCount = myTransactions.filter((tx) => tx.syncedToExcel).length;

  return (
    <div className="min-h-screen text-white relative overflow-hidden pb-24 selection:bg-orange-500/30 selection:text-orange-200">
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
        {/* Cinematic Dark Vignette & Ambient Light Caustics */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90 backdrop-blur-[1.5px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-500/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 pt-5 max-w-7xl mx-auto space-y-4">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/15">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
                    Hello,
                  </span>
                  <input
                    type="text"
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                    placeholder="Enter your name"
                    className="px-3 py-1 bg-white/15 border border-orange-500 rounded-xl text-base sm:text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    disabled={savingName || !nameInput.trim()}
                    className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
                    title="Save Name"
                  >
                    {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white/80 transition-all cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
                    Hello, {user?.name || 'Operator'}
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      setNameInput(user?.name || '');
                      setIsEditingName(true);
                    }}
                    title="Edit Name"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-orange-500/30 text-white/60 hover:text-orange-300 border border-white/15 hover:border-orange-400/40 transition-all cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Personal Workspace
              </span>

              {nameSuccess && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-emerald-400 font-semibold flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Name updated
                </motion.span>
              )}
            </div>
            <p className="text-[11px] text-white/60 mt-0.5 font-medium">
              {user?.email} • Synchronized with MongoDB Atlas & Local Excel
            </p>
          </div>
        </div>

        {/* Unsynced Banner Notification */}
        <AnimatePresence>
          {!bannerDismissed && unsyncedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 shadow-xl backdrop-blur-2xl flex items-center justify-between gap-3 text-amber-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300 shrink-0 border border-amber-400/30">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {unsyncedCount} Unsynced {unsyncedCount === 1 ? 'Transaction' : 'Transactions'} Awaiting Excel
                  </h4>
                  <p className="text-[11px] text-amber-200/90 leading-tight">
                    Sync via <strong>NAMI Desktop Companion</strong> into <code className="bg-black/30 px-1 py-0.2 rounded font-mono text-[10px]">NAMI_Transactions.xlsx</code>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                className="text-amber-300 hover:text-white p-1 cursor-pointer transition-colors"
                title="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Side-by-Side Unified Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (5 Cols): Transaction Form */}
          <div className="lg:col-span-5 w-full">
            <TransactionForm
              onTransactionCreated={() => {
                fetchUnsynced();
                fetchMyTransactions();
              }}
            />
          </div>

          {/* Right Column (7 Cols): KPI Cards + Performance Wave Graph + Recent Entries */}
          <div className="lg:col-span-7 space-y-4 w-full">
            {/* 3 KPI Cards Row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Card 1: Total Volume */}
              <div className="relative rounded-2xl p-3.5 bg-black/40 backdrop-blur-2xl border border-white/20 shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider truncate">
                    Volume
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
                    +18.4%
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-white mt-1 tracking-tight">
                  ₹{totalVolume.toLocaleString('en-IN')}
                </div>
                <div className="h-5 mt-1">
                  <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
                    <path d="M 0,20 Q 25,5 50,15 T 100,5" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Card 2: Excel Sync */}
              <div className="relative rounded-2xl p-3.5 bg-black/40 backdrop-blur-2xl border border-white/20 shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider truncate">
                    Excel Sync
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
                    {myTransactions.length > 0 && syncedCount === myTransactions.length ? '100%' : `${syncedCount}/${myTransactions.length}`}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-white mt-1 tracking-tight">
                  {syncedCount} <span className="text-[10px] font-normal text-white/50">/ {myTransactions.length}</span>
                </div>
                <div className="h-5 mt-1">
                  <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
                    <path d="M 0,22 Q 30,10 60,18 T 100,2" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Card 3: Active Protocols */}
              <div className="relative rounded-2xl p-3.5 bg-black/40 backdrop-blur-2xl border border-white/20 shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider truncate">
                    Protocols
                  </span>
                  <span className="text-[10px] font-bold text-orange-300 bg-orange-500/20 border border-orange-500/30 px-1.5 py-0.2 rounded-full">
                    3 Modes
                  </span>
                </div>
                <div className="text-[11px] font-bold text-white mt-1.5 tracking-tight truncate">
                  UPI • Cash • Net
                </div>
                <div className="h-5 mt-1">
                  <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
                    <path d="M 0,18 Q 20,24 45,8 T 100,12" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Performance Wave Graph */}
            <PerformanceGraph transactions={myTransactions} />

            {/* Recent Ledger Entries Table */}
            <div className="rounded-[28px] p-4 sm:p-5 bg-black/40 backdrop-blur-3xl border border-white/20 shadow-2xl text-white">
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-white drop-shadow-sm">
                    Recent Ledger Entries
                  </h3>
                  <p className="text-[10px] text-white/50">History of transfers from this account</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    fetchMyTransactions();
                    fetchUnsynced();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-[11px] text-white font-medium transition-all shadow-sm cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingTx ? 'animate-spin text-orange-400' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="overflow-x-auto max-h-48 overflow-y-auto pr-1">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="text-white/50 font-semibold border-b border-white/10 text-[10px]">
                      <th className="py-2 px-2">Date</th>
                      <th className="py-2 px-2">Flow</th>
                      <th className="py-2 px-2">Mode</th>
                      <th className="py-2 px-2 text-right">Amount</th>
                      <th className="py-2 px-2 text-center">Status</th>
                      <th className="py-2 px-2 text-center">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {myTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-5 text-center text-white/50 text-xs">
                          No transactions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      myTransactions.map((tx) => (
                        <tr key={tx._id} className="hover:bg-white/[0.05] transition-colors">
                          <td className="py-2 px-2 text-white/60 font-mono text-[10px]">
                            {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-2 px-2">
                            <span className="font-semibold text-white">
                              {tx.sender}
                            </span>
                            <span className="text-white/40 mx-1">→</span>
                            <span className="text-white/80">
                              {tx.receiver}
                            </span>
                          </td>
                          <td className="py-2 px-2">
                            {tx.mode === 'Net Banking' ? (
                              <span className="px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold text-[10px]">
                                Net Banking
                              </span>
                            ) : tx.mode === 'UPI' ? (
                              <span className="px-2 py-0.2 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 font-semibold text-[10px]">
                                UPI
                              </span>
                            ) : (
                              <span className="px-2 py-0.2 rounded-full bg-white/10 text-white/80 border border-white/20 font-medium text-[10px]">
                                Cash
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-right font-mono font-bold text-white text-xs">
                            ₹{Number(tx.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.2 rounded-full">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Confirmed</span>
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            {tx.mode === 'Net Banking' ? (
                              <button
                                type="button"
                                onClick={() => setSelectedNetBankingTx(tx)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-semibold text-white transition-all shadow-xs cursor-pointer"
                                title="View Bank Account & IFSC Details"
                              >
                                <Eye className="w-3 h-3 text-white/70" />
                                <span>Details</span>
                              </button>
                            ) : (
                              <span className="text-white/40 text-[10px]">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Net Banking Details Modal */}
        <AnimatePresence>
          {selectedNetBankingTx && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
              onClick={() => setSelectedNetBankingTx(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-[28px] bg-black/85 backdrop-blur-3xl border border-white/20 p-6 shadow-2xl text-white"
              >
                <div className="flex items-start justify-between pb-3.5 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Net Banking Details</h3>
                      <p className="text-[10px] text-white/50 font-mono">ID: {selectedNetBankingTx._id}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedNetBankingTx(null)}
                    className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Content */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10">
                    <span className="text-[10px] uppercase font-semibold text-white/50 block mb-0.5">
                      Account Holder Name
                    </span>
                    <div className="text-xs font-bold text-white">
                      {selectedNetBankingTx.accountHolder || selectedNetBankingTx.receiver || 'N/A'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-white/50 block mb-0.5">
                        Account Number
                      </span>
                      <div className="text-xs font-mono font-bold text-white tracking-wider">
                        {selectedNetBankingTx.accountNumber || 'N/A'}
                      </div>
                    </div>
                    {selectedNetBankingTx.accountNumber && (
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedNetBankingTx.accountNumber, 'acc')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-medium text-white transition-all shadow-xs cursor-pointer"
                      >
                        {copiedKey === 'acc' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-white/70" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-white/50 block mb-0.5">
                        IFSC Code
                      </span>
                      <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        {selectedNetBankingTx.ifsc || 'N/A'}
                      </div>
                    </div>
                    {selectedNetBankingTx.ifsc && (
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedNetBankingTx.ifsc, 'ifsc')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-medium text-white transition-all shadow-xs cursor-pointer"
                      >
                        {copiedKey === 'ifsc' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-white/70" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10">
                      <span className="text-[10px] uppercase font-semibold text-white/50 block mb-0.5">
                        Transfer Amount
                      </span>
                      <div className="text-sm font-bold text-orange-400">
                        ₹{Number(selectedNetBankingTx.amount).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10">
                      <span className="text-[10px] uppercase font-semibold text-white/50 block mb-0.5">
                        Transfer Date
                      </span>
                      <div className="text-[11px] font-medium text-white/80">
                        {new Date(selectedNetBankingTx.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedNetBankingTx(null)}
                    className="w-full py-2 px-4 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 transition-colors cursor-pointer"
                  >
                    Close Details
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
