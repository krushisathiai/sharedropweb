import React, { useState } from 'react';
import { X, Download, CheckCircle, ShieldCheck, FileCheck, ArrowDownToLine, Loader2 } from 'lucide-react';
import { formatBytes, formatKey } from '../utils/formatters';
import { FileIcon, FileTypeBadge } from '../utils/fileIcons';
import { getDownloadUrl } from '../services/api';
import { useTransfer } from '../context/TransferContext';

export default function FileReceiveModal({ transfer, onClose }) {
  const { addToast, addToHistory } = useTransfer();
  const [downloadingFileId, setDownloadingFileId] = useState(null);
  const [downloadedFiles, setDownloadedFiles] = useState(new Set());
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handleDownloadSingle = async (file) => {
    try {
      setDownloadingFileId(file.id);
      const url = getDownloadUrl(transfer.key, file.id);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadedFiles((prev) => new Set(prev).add(file.id));

      addToHistory({
        key: transfer.key,
        type: 'received',
        files: [file],
        totalSize: file.size,
      });

      addToast(`Downloaded ${file.name}`, 'success');
    } catch (err) {
      console.error(err);
      addToast(`Failed to download ${file.name}`, 'error');
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleDownloadAll = async () => {
    if (!transfer.files || transfer.files.length === 0) return;

    try {
      setIsDownloadingAll(true);
      for (let i = 0; i < transfer.files.length; i++) {
        const file = transfer.files[i];
        await handleDownloadSingle(file);
        await new Promise((r) => setTimeout(r, 600));
      }
      addToast('All files downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Download Received Files
              </h3>
              <p className="text-xs text-slate-500">
                Key: <span className="font-mono font-bold text-slate-800">{formatKey(transfer.key)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Summary Box */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-700">Ready to Save</p>
                <h4 className="text-sm font-bold text-slate-900">
                  {transfer.files?.length || 0} File{transfer.files?.length > 1 ? 's' : ''} available
                </h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
                {formatBytes(transfer.totalSize)}
              </span>
            </div>
          </div>

          {/* Files List */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Files in this transfer
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {transfer.files?.map((file) => {
                const isDownloaded = downloadedFiles.has(file.id);
                const isCurrent = downloadingFileId === file.id;

                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                        <FileIcon mimetype={file.mimetype} filename={file.name} className="w-5 h-5" />
                      </div>
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
                      onClick={() => handleDownloadSingle(file)}
                      disabled={isCurrent}
                      className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isDownloaded
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs shadow-rose-500/20'
                      }`}
                    >
                      {isCurrent ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isDownloaded ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Direct original quality download</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/10 transition-all"
            >
              {isDownloadingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download All</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
