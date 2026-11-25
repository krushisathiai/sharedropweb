import React from 'react';
import { useTransfer } from '../context/TransferContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useTransfer();

  if (toasts.length === 0) return null;

  // Render only the latest single toast
  const toast = toasts[0];

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const bgColors = {
    success: 'bg-white border-emerald-200 text-slate-800 shadow-xl shadow-emerald-500/10',
    error: 'bg-white border-rose-200 text-slate-800 shadow-xl shadow-rose-500/10',
    info: 'bg-white border-blue-200 text-slate-800 shadow-xl shadow-blue-500/10',
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 flex justify-center sm:justify-end pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border max-w-sm w-full ${
          bgColors[toast.type] || bgColors.info
        } transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {icons[toast.type] || icons.info}
          <p className="text-xs sm:text-sm font-semibold truncate leading-snug">{toast.message}</p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 shrink-0 rounded-lg"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
