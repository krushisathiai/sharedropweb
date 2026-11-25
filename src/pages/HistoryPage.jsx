import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, ArrowUpRight, ArrowDownLeft, Clock, File } from 'lucide-react';
import { useTransfer } from '../context/TransferContext';
import { formatBytes, formatKey } from '../utils/formatters';

export default function HistoryPage() {
  const { history, clearHistory, addToast } = useTransfer();

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your transfer history?')) {
      clearHistory();
      addToast('History cleared successfully', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      <div className="text-center space-y-2 max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Transfer History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Local record of files sent and received in this browser.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {history.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No transfers yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              You haven't sent or received any files yet. Send your first document or video to see it here!
            </p>
            <Link
              to="/send"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-sm hover:bg-rose-600 transition-colors"
            >
              Send Files Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => {
              const isSent = item.type === 'sent';
              const dateStr = new Date(item.timestamp).toLocaleString();

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSent
                          ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}
                    >
                      {isSent ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 uppercase">
                          {isSent ? 'Sent Transfer' : 'Received File'}
                        </span>
                        <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {formatKey(item.key)}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 truncate max-w-xs sm:max-w-md">
                        {item.files?.map((f) => f.name).join(', ') || 'Files'}
                      </div>

                      <p className="text-[11px] text-slate-500">{dateStr}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-xs font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {formatBytes(item.totalSize)}
                    </span>

                    <Link
                      to={`/receive?key=${item.key}`}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
