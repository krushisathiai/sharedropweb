import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ReceiveCard from '../components/ReceiveCard';
import { ArrowLeft, Loader2, Download, AlertCircle, FileCheck, CheckCircle2, Smartphone, Globe, Sparkles } from 'lucide-react';
import { getTransferByKey, getDownloadUrl } from '../services/api';
import { formatBytes, formatKey } from '../utils/formatters';
import { FileIcon, FileTypeBadge } from '../utils/fileIcons';
import { useTransfer } from '../context/TransferContext';

export default function ReceivePage() {
  const [searchParams] = useSearchParams();
  const urlKey = searchParams.get('key');
  const { addToast, addToHistory } = useTransfer();

  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState(null);
  const [error, setError] = useState(null);
  const [autoDownloaded, setAutoDownloaded] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // Trigger download function
  const triggerAutoDownload = async (data) => {
    if (!data?.files || data.files.length === 0) return;

    try {
      addToast(`Found ${data.files.length} file(s)! Starting automatic download...`, 'success');

      for (let i = 0; i < data.files.length; i++) {
        const file = data.files[i];
        const url = getDownloadUrl(data.key, file.id);

        // Immediate browser download trigger to mobile Downloads folder
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addToHistory({
          key: data.key,
          type: 'received',
          files: [file],
          totalSize: file.size,
        });

        if (data.files.length > 1) {
          await new Promise((r) => setTimeout(r, 600));
        }
      }

      setAutoDownloaded(true);
      addToast('Files downloaded automatically to your device!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Download error: ' + err.message, 'error');
    }
  };

  // Auto-fetch and AUTO-DOWNLOAD if key is in URL (e.g., recipient clicks link or scans QR in Sangamner)
  useEffect(() => {
    if (urlKey) {
      const fetchAndDownload = async () => {
        try {
          setLoading(true);
          setError(null);
          let data = await getTransferByKey(urlKey);
          let attempts = 0;
          while (data && data.status === 'uploading' && attempts < 40) {
            setTransferData(data);
            await new Promise((r) => setTimeout(r, 2000));
            data = await getTransferByKey(urlKey);
            attempts++;
          }
          setTransferData(data);
          // AUTOMATIC DOWNLOAD IMMEDIATELY:
          if (data && data.files && data.files.length > 0) {
            await triggerAutoDownload(data);
          }
        } catch (err) {
          setError(err.message || 'Key invalid or expired');
          addToast(err.message || 'Failed to load transfer', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchAndDownload();
    }
  }, [urlKey]);

  const handleManualRedownload = (file) => {
    const url = getDownloadUrl(transferData.key, file.id);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`Downloading ${file.name} again...`, 'info');
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

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <Globe className="w-3.5 h-3.5" />
          <span>Cross-City Transfer (Different Networks)</span>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Receive & Auto-Download Files
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter the 6-digit key. As soon as you enter the key, your video or document downloads automatically to your mobile!
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        {/* Loading state */}
        {loading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">Fetching files from cloud relay...</p>
            <p className="text-xs text-slate-500">Preparing automatic download...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Transfer Not Found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setTransferData(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white"
            >
              Try Another Key
            </button>
          </div>
        )}

        {/* Ready and Auto-Downloaded state */}
        {!loading && transferData && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-7 space-y-6">
            
            {/* Auto-Download Banner */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-black text-emerald-900">
                  Files Downloaded Automatically!
                </h4>
                <p className="text-xs text-emerald-700">
                  Transferred via Cloud Relay across cities. Check your device's Downloads folder.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Transfer Details
                </h3>
                <p className="text-xs text-slate-500">
                  Key: <span className="font-mono font-bold text-slate-900">{formatKey(transferData.key)}</span>
                </p>
              </div>

              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                {formatBytes(transferData.totalSize)}
              </span>
            </div>

            {/* List */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Downloaded Files ({transferData.files.length})
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {transferData.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <FileIcon mimetype={file.mimetype} filename={file.name} className="w-5 h-5" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[170px] sm:max-w-xs">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-slate-500">{formatBytes(file.size)}</span>
                          <FileTypeBadge mimetype={file.mimetype} filename={file.name} />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleManualRedownload(file)}
                      className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save Again</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Redownload All */}
            <div className="pt-2">
              <button
                onClick={() => triggerAutoDownload(transferData)}
                className="w-full py-3 rounded-2xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Re-Download All Files</span>
              </button>
            </div>
          </div>
        )}

        {/* Default input card (Auto-downloads on 6th digit) */}
        {!loading && !transferData && !error && (
          <ReceiveCard onReceiveSuccess={(data) => setTransferData(data)} />
        )}
      </div>
    </div>
  );
}
