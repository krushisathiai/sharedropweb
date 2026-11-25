import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, ArrowUpRight, ArrowDownLeft, Clock, Lock, ShieldCheck, User } from 'lucide-react';
import { useTransfer } from '../context/TransferContext';
import { useAuth } from '../context/AuthContext';
import { formatBytes, formatKey } from '../utils/formatters';

export default function HistoryPage() {
  const { history, clearHistory, addToast } = useTransfer();
  const { user, isAuthenticated } = useAuth();

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your transfer history?')) {
      clearHistory();
      addToast('History cleared successfully', 'info');
    }
  };

  // If user is NOT logged in, require login to see private history!
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Private Gate Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sign In to View History
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              Transfer history is private. Please sign in to view your personal sent and received files.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs text-slate-600 flex items-center gap-2 text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Each user can only access their own private transfer history.</span>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              to="/login"
              className="w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 transition-all hover:scale-[1.01]"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/signup"
              className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // When logged in: Show user's own transfer history
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
          <User className="w-3.5 h-3.5 text-rose-500" />
          <span>{user?.name} ({user?.email})</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Your Transfer History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Private record of files sent and received under your account.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {history.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No transfers recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Files you send or receive while logged in will appear here in your private account history.
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
