import React from 'react';
import SendCard from '../components/SendCard';
import { ArrowLeft, Zap, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SendPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Back button and page title */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Clock className="w-3.5 h-3.5 text-rose-500" />
          <span>10-Minute Ephemeral Transfer</span>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Send Videos, Documents & Files
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Select files from this device to generate a 6-digit key and QR code. Download on any mobile or computer worldwide.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <SendCard />
      </div>
    </div>
  );
}
