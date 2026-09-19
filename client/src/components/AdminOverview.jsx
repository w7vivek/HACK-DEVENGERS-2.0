import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowUpDown, Filter, ChevronLeft, ChevronRight, RefreshCw, Layers } from 'lucide-react';
import api from '../api/axiosInstance';

export const AdminOverview = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalVolume: 0, avgAmount: 0, count: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [modeFilter, setModeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions/all', {
        params: {
          page,
          limit: 10,
          sortBy,
          order,
          mode: modeFilter || undefined,
        },
      });
      setTransactions(res.data.transactions);
      setTotalPages(res.data.totalPages);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [page, sortBy, order, modeFilter]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setOrder('desc');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Admin Global Ledger</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 text-xs font-semibold">
                Elevated
              </span>
            </div>
            <p className="text-xs text-slate-400">System-wide transaction visibility & audit stream</p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchAdminData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Volume</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            ₹{Number(stats.totalVolume || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500">Across all system users</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg Transaction</span>
          <div className="text-2xl font-black text-slate-100 mt-1">
            ₹{Math.round(stats.avgAmount || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500">Per confirmed transfer</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Records</span>
          <div className="text-2xl font-black text-slate-100 mt-1">
            {stats.count || 0}
          </div>
          <span className="text-[11px] text-slate-500">Entries processed</span>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold">Payment Mode Filter:</span>
            <div className="flex items-center gap-1.5 ml-2">
              {['', 'UPI', 'Cash', 'Net Banking'].map((m) => (
                <button
                  key={m || 'all'}
                  type="button"
                  onClick={() => {
                    setModeFilter(m);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    modeFilter === m
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {m || 'All Modes'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Sort by:</span>
            <button
              type="button"
              onClick={() => toggleSort('createdAt')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                sortBy === 'createdAt' ? 'text-amber-400 bg-slate-800' : 'hover:text-slate-200'
              }`}
            >
              <span>Date</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => toggleSort('amount')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                sortBy === 'amount' ? 'text-amber-400 bg-slate-800' : 'hover:text-slate-200'
              }`}
            >
              <span>Amount</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 font-semibold">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">User Account</th>
                <th className="py-3 px-3">Sender & Receiver</th>
                <th className="py-3 px-3">Mode</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Confirmed</th>
                <th className="py-3 px-3 text-center">Excel Synced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No transactions match the selected parameters.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-mono">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <div className="font-medium">{tx.userId?.name || 'Unknown'}</div>
                      <div className="text-[10px] text-slate-500">{tx.userId?.email}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      <div className="font-semibold">{tx.sender}</div>
                      <div className="text-[11px] text-slate-400">→ {tx.receiver}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700">
                        {tx.mode}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                      ₹{Number(tx.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          tx.confirmed ? 'bg-emerald-400' : 'bg-red-400'
                        }`}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          tx.syncedToExcel ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
