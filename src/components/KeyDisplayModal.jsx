import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Clock, Share2, Smartphone, Download, ShieldCheck, Globe } from 'lucide-react';
import { formatBytes, formatKey, formatTimeRemaining } from '../utils/formatters';
import { FileIcon, FileTypeBadge } from '../utils/fileIcons';
import { useTransfer } from '../context/TransferContext';

export default function KeyDisplayModal({ data, onClose }) {
  const { addToast } = useTransfer();
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, data.expiresAt - Date.now()));

  // Universal share link
  const shareUrl = `${window.location.origin}/receive?key=${data.key}`;

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, data.expiresAt - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [data.expiresAt]);

  const copyKeyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.key);
      setCopiedKey(true);
      addToast('6-digit key copied to clipboard!', 'success');
      setTimeout(() => setCopiedKey(false), 2500);
    } catch (err) {
      addToast('Failed to copy', 'error');
    }
  };

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      addToast('Direct link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      addToast('Failed to copy link', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              Files Ready for Transfer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Big 6-Digit Key Box */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <Globe className="w-3.5 h-3.5" />
              <span>Works on Any Network (4G / 5G / Wi-Fi)</span>
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 pt-1">
              Enter this 6-digit key on recipient device
            </p>

            <div
              onClick={copyKeyToClipboard}
              className="group cursor-pointer inline-flex items-center justify-center gap-4 bg-rose-50/70 hover:bg-rose-100/70 border-2 border-rose-300/80 rounded-2xl px-6 py-4 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="font-mono text-4xl sm:text-5xl font-black text-rose-600 tracking-wider">
                {formatKey(data.key)}
              </span>
              <button
                type="button"
                className="w-10 h-10 rounded-xl bg-white border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs group-hover:bg-rose-500 group-hover:text-white transition-colors"
              >
                {copiedKey ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 pt-1">
              <Clock className="w-4 h-4 text-rose-500" />
              <span>Valid for: </span>
              <span className="font-mono text-rose-600 font-bold">
                {formatTimeRemaining(timeLeft)}
              </span>
            </div>
          </div>

          {/* QR Code Section for instant Mobile Scanning */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
            <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
              <QRCodeSVG
                value={shareUrl}
                size={140}
                level="M"
                includeMargin={false}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
                <Smartphone className="w-4 h-4 text-rose-500" />
                <span>Scan with any Phone Camera to Download</span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Receiver can scan this QR code on any phone or network to open the download page.
              </p>
            </div>

            {/* Share Link Input */}
            <div className="w-full flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1.5">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full text-xs text-slate-600 bg-transparent px-2 outline-none truncate font-mono"
              />
              <button
                type="button"
                onClick={copyLinkToClipboard}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Uploaded Files Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Attached Files ({data.files?.length || 0})</span>
              <span className="font-bold text-slate-800">{formatBytes(data.totalSize)}</span>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {data.files?.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileIcon mimetype={f.mimetype} filename={f.name} className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                      {f.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">{formatBytes(f.size)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Files delete automatically after 10 mins</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
