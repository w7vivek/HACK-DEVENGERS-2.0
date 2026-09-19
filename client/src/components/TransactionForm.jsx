import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Banknote, Building2, ArrowRight, CheckCircle2, User, Send, Lock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { MorphingPopover } from './motion-primitives/MorphingPopover';
import { TextShimmer } from './motion-primitives/TextShimmer';
import { ConfirmDialog } from './ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

const PAYMENT_MODES = [
  { id: 'UPI', label: 'UPI Instant', icon: Zap },
  { id: 'Cash', label: 'Cash Entry', icon: Banknote },
  { id: 'Net Banking', label: 'Net Banking', icon: Building2 },
];

export const TransactionForm = ({ onTransactionCreated }) => {
  const { user } = useAuth();
  const currentUserName = user?.name || 'Vivek';

  // Mode: 'send' (I am Sender) or 'receive' (I am Receiver)
  const [transferType, setTransferType] = useState('send');

  const [form, setForm] = useState({
    sender: currentUserName,
    receiver: '',
    amount: '',
    mode: 'UPI',
    accountHolder: '',
    accountNumber: '',
    ifsc: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [pendingTx, setPendingTx] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-sync sender/receiver when user logs in or switches mode
  useEffect(() => {
    if (transferType === 'send') {
      setForm((prev) => ({
        ...prev,
        sender: currentUserName,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        receiver: currentUserName,
      }));
    }
  }, [transferType, currentUserName]);

  const handleTypeSwitch = (type) => {
    setTransferType(type);
    setError('');
    if (type === 'send') {
      setForm((prev) => ({
        ...prev,
        sender: currentUserName,
        receiver: prev.receiver === currentUserName ? '' : prev.receiver,
        accountHolder: '',
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        receiver: currentUserName,
        sender: prev.sender === currentUserName ? '' : prev.sender,
        accountHolder: currentUserName,
      }));
    }
  };

  const handleChange = (field, val) => {
    setError('');
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.sender.trim() || !form.receiver.trim() || !form.amount) {
      setError('Please provide sender, receiver, and amount.');
      return;
    }

    if (Number(form.amount) <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    if (form.mode === 'Net Banking') {
      if (!form.accountHolder.trim() || !form.accountNumber.trim() || !form.ifsc.trim()) {
        setError('Please complete all Net Banking bank account details.');
        return;
      }
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(form.ifsc.toUpperCase())) {
        setError('IFSC code must be 11 characters, 5th char zero (e.g. HDFC0001234).');
        return;
      }
    }

    setSubmitting(true);
    setGeneratingSummary(true);

    try {
      const res = await api.post('/transactions', {
        ...form,
        amount: Number(form.amount),
        ifsc: form.ifsc.toUpperCase(),
      });

      setPendingTx(res.data);
      setTimeout(() => {
        setGeneratingSummary(false);
        setConfirmOpen(true);
        setSubmitting(false);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate transaction');
      setSubmitting(false);
      setGeneratingSummary(false);
    }
  };

  const handleConfirm = async () => {
    if (!pendingTx) return;
    setSubmitting(true);

    try {
      await api.patch(`/transactions/${pendingTx._id}/confirm`);
      setConfirmOpen(false);
      setToastMessage('Saved. Syncs to Excel automatically via your NAMI desktop app.');
      setForm({
        sender: transferType === 'send' ? currentUserName : '',
        receiver: transferType === 'receive' ? currentUserName : '',
        amount: '',
        mode: 'UPI',
        accountHolder: '',
        accountNumber: '',
        ifsc: '',
      });
      setPendingTx(null);
      onTransactionCreated?.();

      setTimeout(() => {
        setToastMessage('');
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Confirmation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-medium flex items-center gap-2.5 shadow-xl backdrop-blur-xl"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Cinematic Ultra-Glass Form Container */}
      <div className="relative rounded-[28px] p-5 sm:p-6 overflow-hidden bg-black/40 backdrop-blur-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)] text-white transition-all">
        {/* Specular Highlight Arc */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none rounded-t-[28px]" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                {transferType === 'send' ? 'Send Money' : 'Receive Money'}
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                {transferType === 'send'
                  ? 'Record a payment sent to a recipient'
                  : 'Record a payment received into your account'}
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 shadow-xs">
              3 Modes Only
            </span>
          </div>

          {/* Form Mode Switcher: Send vs Receive */}
          <div className="flex p-1 rounded-2xl bg-white/10 border border-white/15 mb-6 backdrop-blur-md shadow-inner">
            <button
              type="button"
              onClick={() => handleTypeSwitch('send')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                transferType === 'send'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Send Form</span>
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-white/90 font-medium">
                {currentUserName}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeSwitch('receive')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                transferType === 'receive'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Receiver Form</span>
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-white/90 font-medium">
                {currentUserName}
              </span>
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-5 p-3 rounded-2xl bg-red-500/20 border border-red-400/30 text-red-200 text-xs font-medium backdrop-blur-md text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sender & Receiver Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sender Field */}
              {transferType === 'send' ? (
                <div className="relative rounded-2xl p-3 bg-white/[0.07] border border-white/15">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                      Sender Name (You)
                    </span>
                    <span className="text-[9px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-1.5 py-0.5 rounded-full">
                      Auto-filled
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-orange-400 shrink-0" />
                    <input
                      type="text"
                      readOnly
                      value={form.sender}
                      className="w-full bg-transparent text-sm text-white font-bold focus:outline-none cursor-default"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl p-3 bg-white/[0.05] border border-white/15 focus-within:border-orange-500 transition-colors">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider block mb-1 font-semibold">
                    Sender Name (Payer)
                  </span>
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-white/40 shrink-0" />
                    <input
                      type="text"
                      required
                      value={form.sender}
                      onChange={(e) => handleChange('sender', e.target.value)}
                      placeholder="e.g. Acme Corp or Client"
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Receiver Field */}
              {transferType === 'receive' ? (
                <div className="relative rounded-2xl p-3 bg-white/[0.07] border border-white/15">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                      Receiver Name (You)
                    </span>
                    <span className="text-[9px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-1.5 py-0.5 rounded-full">
                      Auto-filled
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Send className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      readOnly
                      value={form.receiver}
                      className="w-full bg-transparent text-sm text-white font-bold focus:outline-none cursor-default"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl p-3 bg-white/[0.05] border border-white/15 focus-within:border-orange-500 transition-colors">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider block mb-1 font-semibold">
                    Receiver Name (Recipient)
                  </span>
                  <div className="flex items-center gap-2.5">
                    <Send className="w-3.5 h-3.5 text-white/40 shrink-0" />
                    <input
                      type="text"
                      required
                      value={form.receiver}
                      onChange={(e) => handleChange('receiver', e.target.value)}
                      placeholder="e.g. Rahul Kumar or Merchant"
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none font-medium"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Amount Field */}
            <div className="relative rounded-2xl p-3.5 bg-white/[0.05] border border-white/15 focus-within:border-orange-500 transition-colors">
              <span className="text-[10px] text-white/50 uppercase tracking-wider block mb-1 font-semibold">
                Amount (INR)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-orange-400 font-bold text-xl">₹</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={form.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="2500"
                  className="w-full bg-transparent text-xl font-black text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <span className="text-[10px] text-white/50 uppercase tracking-wider block mb-2 font-semibold">
                Payment Method
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {PAYMENT_MODES.map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = form.mode === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => handleChange('mode', pm.id)}
                      className={`py-3 px-3 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-orange-400 text-white bg-orange-500 shadow-lg shadow-orange-500/30'
                          : 'border-white/15 text-white/70 bg-white/[0.06] hover:bg-white/[0.12]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Net Banking Details Panel */}
            {form.mode === 'Net Banking' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 p-4 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-xl"
              >
                <div className="text-xs font-semibold text-white flex items-center justify-between">
                  <span>Bank Account Details (Net Banking)</span>
                  <span className="text-[10px] text-white/50">NEFT / RTGS / IMPS</span>
                </div>

                <div className="relative rounded-xl p-2.5 bg-black/20 border border-white/10">
                  <span className="text-[10px] text-white/50 uppercase block mb-0.5">
                    Account Holder Name
                  </span>
                  <input
                    type="text"
                    value={form.accountHolder}
                    onChange={(e) => handleChange('accountHolder', e.target.value)}
                    placeholder="e.g. Rahul S. Kumar"
                    className="w-full bg-transparent text-xs text-white focus:outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative rounded-xl p-2.5 bg-black/20 border border-white/10">
                    <span className="text-[10px] text-white/50 uppercase block mb-0.5">
                      Account Number
                    </span>
                    <input
                      type="text"
                      value={form.accountNumber}
                      onChange={(e) => handleChange('accountNumber', e.target.value)}
                      placeholder="5010023491823"
                      className="w-full bg-transparent text-xs font-mono text-white focus:outline-none font-medium"
                    />
                  </div>

                  <div className="relative rounded-xl p-2.5 bg-black/20 border border-white/10">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] text-white/50 uppercase block">
                        IFSC Code
                      </span>
                      <MorphingPopover title="IFSC Code Format">
                        <p className="mb-1 text-xs">
                          11 alphanumeric characters. 5th character is always <strong>0</strong>.
                        </p>
                        <code className="inline-block px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-[10px] text-orange-400">
                          ^[A-Z]{'{4}'}0[A-Z0-9]{'{6}'}$
                        </code>
                      </MorphingPopover>
                    </div>
                    <input
                      type="text"
                      value={form.ifsc}
                      onChange={(e) => handleChange('ifsc', e.target.value.toUpperCase())}
                      placeholder="HDFC0001234"
                      maxLength={11}
                      className="w-full bg-transparent text-xs font-mono uppercase text-white focus:outline-none font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3D Liquid Jelly Orange Lozenge Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="liquid-orange-btn relative w-full py-4 px-8 rounded-full text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75 overflow-hidden shadow-2xl"
              >
                <div className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/20 blur-[1px] pointer-events-none" />
                {generatingSummary ? (
                  <TextShimmer shimmerColor="#FFFFFF" baseColor="rgba(255, 255, 255, 0.6)">
                    Preparing verification…
                  </TextShimmer>
                ) : (
                  <>
                    <span>{transferType === 'send' ? 'Initiate Payment' : 'Record Received Entry'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Security Guarantee Note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/50 pt-1">
              <Lock className="w-3 h-3 text-white/50" />
              <span>Automatically synchronized to local Excel via NAMI desktop companion</span>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        transaction={pendingTx}
        loading={submitting}
      />
    </div>
  );
};