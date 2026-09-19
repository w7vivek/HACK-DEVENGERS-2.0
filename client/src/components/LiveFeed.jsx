import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Zap, Banknote, Building2 } from 'lucide-react';
import { ProgressiveBlur } from './motion-primitives/ProgressiveBlur';

const INITIAL_FEED = [
  { id: '1', sender: 'Aarav Mehta', receiver: 'Rohit Verma', amount: 3500, mode: 'UPI', time: 'Just now' },
  { id: '2', sender: 'Sneha Patel', receiver: 'Ananya Roy', amount: 12000, mode: 'Net Banking', time: '1m ago' },
  { id: '3', sender: 'Vikram Sethi', receiver: 'Karan Malhotra', amount: 850, mode: 'Cash', time: '2m ago' },
  { id: '4', sender: 'Pooja Iyer', receiver: 'Devika Nair', amount: 6400, mode: 'UPI', time: '4m ago' },
  { id: '5', sender: 'Sameer Khan', receiver: 'Zoya Merchant', amount: 18500, mode: 'Net Banking', time: '6m ago' },
  { id: '6', sender: 'Rajesh Gupta', receiver: 'Sunil Joshi', amount: 2200, mode: 'Cash', time: '9m ago' },
];

export const LiveFeed = () => {
  const [feed, setFeed] = useState(INITIAL_FEED);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Aditya Rao', 'Neha Sharma', 'Rohan Das', 'Kavita Pillai', 'Manoj Bajpai', 'Deepak Sen'];
      const receivers = ['Chaitanya K', 'Isha Mathur', 'Varun Dhawan', 'Tanvi Shah', 'Gaurav T', 'Preeti C'];
      const modes = ['UPI', 'Net Banking', 'Cash'];
      const randomAmount = Math.floor(Math.random() * 250 + 5) * 100;

      const newItem = {
        id: Date.now().toString(),
        sender: names[Math.floor(Math.random() * names.length)],
        receiver: receivers[Math.floor(Math.random() * receivers.length)],
        amount: randomAmount,
        mode: modes[Math.floor(Math.random() * modes.length)],
        time: 'Just now',
      };

      setFeed((prev) => [newItem, ...prev.slice(0, 7)]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'UPI':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'Cash':
        return <Banknote className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Net Banking':
        return <Building2 className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F97316]"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase text-neutral-600 data-[role=admin]:text-slate-400">
            Live Stream Feed
          </span>
        </div>
        <span className="text-xs text-neutral-500">Auto-updating ledger</span>
      </div>

      <ProgressiveBlur direction="horizontal" className="py-2">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar">
          {feed.map((tx, index) => {
            const isNearEdge = index === 0 || index >= feed.length - 2;

            return (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`shrink-0 w-64 p-3.5 rounded-2xl border border-black/5 bg-white/75 backdrop-blur-xl shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-md hover:filter-none data-[role=admin]:bg-slate-900/80 data-[role=admin]:border-slate-800 ${
                  isNearEdge ? 'blur-[0.6px] hover:blur-none' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-100 text-[11px] font-medium text-neutral-700 data-[role=admin]:bg-slate-800 data-[role=admin]:text-slate-300">
                    {getModeIcon(tx.mode)}
                    <span>{tx.mode}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">{tx.time}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-neutral-800 data-[role=admin]:text-slate-200">
                  <span className="truncate max-w-[80px]">{tx.sender}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate max-w-[80px]">{tx.receiver}</span>
                </div>

                <div className="mt-2 text-base font-bold text-[#1A1A1A] data-[role=admin]:text-white">
                  ₹{tx.amount.toLocaleString('en-IN')}
                </div>
              </motion.div>
            );
          })}
        </div>
      </ProgressiveBlur>
    </div>
  );
};
