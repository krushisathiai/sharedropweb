import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Clock, Smartphone, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-auto">
      {/* Trust & Highlights Bar */}
      <div className="border-b border-slate-100 bg-slate-50/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Secure & Ephemeral</h4>
                <p className="text-xs text-slate-500">Files transfer directly without permanent server storage</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Auto-Expiring Keys</h4>
                <p className="text-xs text-slate-500">6-digit key and staged files automatically delete after 10 minutes</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Any Device & Network</h4>
                <p className="text-xs text-slate-500">Works across Android, iPhone, Windows, Mac, 4G, 5G & Wi-Fi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                Share<span className="text-rose-500">Drop</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fast, simple, and unlimited cross-device file sharing. Send 4K videos, documents, photos, and folders across mobiles and computers worldwide.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Quick Transfer
            </h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/send" className="hover:text-rose-600 transition-colors">
                  Send Video / Document
                </Link>
              </li>
              <li>
                <Link to="/receive" className="hover:text-rose-600 transition-colors">
                  Enter 6-Digit Key
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-rose-600 transition-colors">
                  Transfer History
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported File Types */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Supported Files
            </h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>Videos (MP4, MKV, 4K, MOV)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Documents (PDF, Word, Excel, PPT)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Photos & RAW Images</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Archives & ZIP Folders</span>
              </li>
            </ul>
          </div>

          {/* Compatibility */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Universal Access
            </h5>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Open ShareDrop in any modern browser (Chrome, Safari, Edge, Firefox). No app installation required.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Android</span>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">iPhone / iOS</span>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Windows</span>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">macOS & Linux</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} ShareDrop. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built with clean white design & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
