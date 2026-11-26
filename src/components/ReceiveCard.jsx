import React, { useState } from 'react';
import { Download, QrCode, Clipboard, ArrowRight, Loader2, Smartphone, Check, Sparkles, CheckCircle2 } from 'lucide-react';
import { getTransferByKey, getDownloadUrl } from '../services/api';
import { useTransfer } from '../context/TransferContext';
import { formatBytes } from '../utils/formatters';
import QRScannerModal from './QRScannerModal';

export default function ReceiveCard({ className = '', onReceiveSuccess = null }) {
  const [keyInput, setKeyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  const { setActiveModal, addToast, addToHistory } = useTransfer();

  // Auto-receive function that IMMEDIATELY downloads the file to mobile
  const executeAutoDownload = async (keyToUse) => {
    const cleanKey = keyToUse.trim().replace(/\s+/g, '');
    if (cleanKey.length !== 6) return;

    try {
      setIsLoading(true);
      setDownloadSuccess(null);

      // 1. Fetch file info from central cloud server
      let transfer = await getTransferByKey(cleanKey);
      let attempts = 0;
      while (transfer && transfer.status === 'uploading' && attempts < 40) {
        addToast('Sender is finalizing upload... waiting a moment', 'info');
        await new Promise((r) => setTimeout(r, 2000));
        transfer = await getTransferByKey(cleanKey);
        attempts++;
      }

      if (!transfer || !transfer.files || transfer.files.length === 0) {
        throw new Error('No files ready for download yet. Please try again in a few seconds.');
      }

      // 2. AUTOMATIC DOWNLOAD: Trigger browser download for every file immediately!
      for (let i = 0; i < transfer.files.length; i++) {
        const file = transfer.files[i];
        const downloadUrl = getDownloadUrl(transfer.key, file.id);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addToHistory({
          key: transfer.key,
          type: 'received',
          files: [file],
          totalSize: file.size,
        });

        if (transfer.files.length > 1) {
          await new Promise((r) => setTimeout(r, 600));
        }
      }

      setDownloadSuccess({
        files: transfer.files,
        totalSize: transfer.totalSize,
        key: cleanKey,
      });

      // ONLY 1 Single Clear Toast!
      addToast(`Downloading ${transfer.files.length} file(s) automatically...`, 'success');

      if (onReceiveSuccess) {
        onReceiveSuccess(transfer);
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Key invalid or expired', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setKeyInput(val);

    // AUTOMATIC TRIGGER: As soon as user types 6th digit, start download!
    if (val.length === 6) {
      executeAutoDownload(val);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const digits = text.replace(/[^0-9]/g, '').slice(0, 6);
      if (digits.length > 0) {
        setKeyInput(digits);
        if (digits.length === 6) {
          executeAutoDownload(digits);
        } else {
          addToast(`Pasted key: ${digits}`, 'info');
        }
      } else {
        addToast('No 6-digit key found in clipboard', 'error');
      }
    } catch (err) {
      addToast('Please paste the 6-digit key manually', 'info');
    }
  };

  const handleManualSubmit = (e) => {
    if (e) e.preventDefault();
    executeAutoDownload(keyInput);
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-4 sm:p-7 flex flex-col justify-between card-hover-effect ${className}`}
    >
      <div>
        {/* Card Header (Responsive wrap on small mobile) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-bold shrink-0 text-sm sm:text-base">
              2
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                Receive Files
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Auto-downloads when 6-digit key is typed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1.5 rounded-lg transition-colors border border-rose-200/80 shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5 text-rose-500" />
              <span>Scan QR</span>
            </button>

            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Clipboard className="w-3.5 h-3.5 text-slate-500" />
              <span>Paste</span>
            </button>
          </div>
        </div>

        {/* 6-Digit Key Input Box */}
        <form onSubmit={handleManualSubmit} className="mt-5 sm:mt-6 space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Enter 6-Digit Key
              </label>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ⚡ Instant Auto-Download
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={keyInput}
                onChange={handleInputChange}
                placeholder="000 000"
                className="w-full text-center tracking-[0.2em] sm:tracking-[0.35em] font-mono text-2xl sm:text-3xl md:text-4xl font-extrabold py-3.5 sm:py-5 px-2 sm:px-4 rounded-2xl border-2 border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-900 bg-slate-50/50"
              />
              {isLoading && (
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 animate-spin" />
                </div>
              )}
              {!isLoading && keyInput.length === 6 && (
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}
            </div>
          </div>

          {/* Quick Digit Status Indicators */}
          <div className="flex justify-center gap-1.5 sm:gap-2 pt-1">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                  keyInput.length > idx ? 'bg-rose-500 scale-110' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Success Auto-Download Notification Box */}
          {downloadSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 space-y-2 animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                <span>Download Started Automatically!</span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-700 leading-relaxed">
                {downloadSuccess.files.length} file ({formatBytes(downloadSuccess.totalSize)}) is saving to your device.
              </p>
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => executeAutoDownload(keyInput)}
                  className="text-xs font-bold text-emerald-800 underline underline-offset-2 hover:text-emerald-950"
                >
                  Click here if download didn't start
                </button>
              </div>
            </div>
          )}

          {/* Cross-City Info Hint */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
              <strong>Cross-City Transfer:</strong> Sender in Pune uploads & shares key. When you enter it in Sangamner, the file downloads automatically!
            </p>
          </div>
        </form>
      </div>

      {/* Card Action Section */}
      <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 space-y-2.5 sm:space-y-3">
        {/* Receive Button */}
        <button
          onClick={handleManualSubmit}
          disabled={keyInput.length !== 6 || isLoading}
          className={`w-full py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
            keyInput.length !== 6 || isLoading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/25 hover:shadow-slate-900/35 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting & Downloading...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Files Now</span>
            </>
          )}
        </button>

        <p className="text-[10px] sm:text-[11px] text-center text-slate-500">
          Transfers directly through cloud relay across any distance. No account needed.
        </p>
      </div>

      {/* QR Code In-App Camera Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(scannedKey) => {
          setKeyInput(scannedKey);
          executeAutoDownload(scannedKey);
        }}
      />
    </div>
  );
}
