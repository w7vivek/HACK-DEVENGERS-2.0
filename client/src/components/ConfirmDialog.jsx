import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Edit3, ArrowRight, ShieldCheck } from 'lucide-react';
import { MorphingDialog } from './motion-primitives/MorphingDialog';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  loading = false,
}) => {
  if (!transaction) return null;

  const formattedAmount = Number(transaction.amount || 0).toLocaleString('en-IN');
  const summaryLine = `₹${formattedAmount} sent by ${transaction.sender} to ${transaction.receiver} via ${transaction.mode}`;

  return (
    <MorphingDialog
      isOpen={isOpen}
      onClose={onClose}
      triggerLayoutId="pay-now-trigger"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#F97316] mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-[#FAF9F6] data-[role=admin]:text-white mb-2">
          Verify Payment Flow
        </h3>

        <div className="w-full my-4 p-4 rounded-2xl ultra-glass-card-nested text-neutral-800 text-sm font-medium leading-relaxed data-[role=admin]:text-slate-100">
          <p className="font-semibold text-base text-[#FAF9F6] data-[role=admin]:text-white">
            {summaryLine}
          </p>

          {transaction.mode === 'Net Banking' && (
            <div className="mt-3 pt-3 border-t border-black/5 text-xs text-neutral-600 data-[role=admin]:text-slate-300 space-y-1">
              <div>Account Holder: <span className="font-medium">{transaction.accountHolder}</span></div>
              <div>Account Number: <span className="font-mono">{transaction.accountNumber}</span></div>
              <div>IFSC Code: <span className="font-mono uppercase font-semibold">{transaction.ifsc}</span></div>
            </div>
          )}
        </div>

        <p className="text-xs text-neutral-500 mb-6 max-w-sm">
          Once confirmed, this transaction will be queued for automatic local Excel reconciliation via your NAMI desktop agent.
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-neutral-200 text-neutral-700 font-medium text-sm hover:bg-neutral-100 transition-colors disabled:opacity-50 data-[role=admin]:border-slate-700 data-[role=admin]:text-slate-300 data-[role=admin]:hover:bg-slate-800"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#F97316] text-white font-semibold text-sm hover:bg-[#ea580c] transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? (
              <span>Confirming...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Flow</span>
              </>
            )}
          </button>
        </div>
      </div>
    </MorphingDialog>
  );
};
