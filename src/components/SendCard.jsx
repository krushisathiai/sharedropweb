import React, { useState, useRef } from 'react';
import { Upload, Plus, X, ArrowRight, Loader2, Sparkles, FolderUp, Film, FileText, CheckCircle } from 'lucide-react';
import { formatBytes } from '../utils/formatters';
import { FileIcon, FileTypeBadge } from '../utils/fileIcons';
import { uploadFiles } from '../services/api';
import { useTransfer } from '../context/TransferContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function SendCard({ className = '', onTransferComplete = null }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState({ percent: 0, loaded: 0, total: 0, speed: 0 });
  const [durationMinutes, setDurationMinutes] = useState(10);
  const fileInputRef = useRef(null);

  const { setActiveModal, addToHistory, addToast, updateModalData } = useTransfer();
  const { isAuthenticated } = useAuth();

  const validityOptions = isAuthenticated
    ? [10, 30, 60, 360, 1440]
    : [10, 30, 60];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const totalBytes = selectedFiles.reduce((acc, f) => acc + f.size, 0);

  const handleSend = async () => {
    if (selectedFiles.length === 0) {
      addToast('Please select at least one file to send', 'error');
      return;
    }

    const filesToSend = [...selectedFiles];
    const totalBytes = filesToSend.reduce((acc, f) => acc + f.size, 0);

    // 1. Generate 6-digit key INSTANTLY in 1 millisecond
    const instantKey = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + durationMinutes * 60 * 1000;
    const filesMeta = filesToSend.map((f) => ({ name: f.name, size: f.size, mimetype: f.type }));

    // 2. Open KeyDisplayModal IMMEDIATELY in 1 click!
    const modalData = {
      key: instantKey,
      files: filesMeta,
      totalSize: totalBytes,
      expiresAt,
      isUploading: true,
      uploadProgress: 0,
      uploadSpeed: 'Connecting...',
    };

    setActiveModal({
      type: 'key',
      data: modalData,
    });

    if (onTransferComplete) {
      onTransferComplete(modalData);
    }

    // Reset card selection right away
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';

    addToast(`Key generated: ${instantKey}! Uploading in background...`, 'success');

    // 3. Upload files to cloud relay in the background with live progress updates
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStats({ percent: 0, loaded: 0, total: totalBytes, speed: 0 });

      await uploadFiles(
        filesToSend,
        durationMinutes,
        (progress) => {
          if (typeof progress === 'number') {
            setUploadProgress(progress);
            updateModalData({ uploadProgress: progress });
          } else if (progress && typeof progress === 'object') {
            const percent = progress.percent || 0;
            const speedFormatted = progress.speed ? `${formatBytes(progress.speed)}/s` : '';
            setUploadProgress(percent);
            setUploadStats(progress);
            updateModalData({
              uploadProgress: percent,
              uploadSpeed: speedFormatted,
            });
          }
        },
        instantKey
      );

      // Finished upload successfully
      updateModalData({
        isUploading: false,
        uploadProgress: 100,
        uploadSpeed: 'Done',
      });

      // Save to recent history for logged in user
      addToHistory({
        key: instantKey,
        type: 'sent',
        files: filesMeta,
        totalSize: totalBytes,
        expiresAt,
      });

      addToast(`Upload complete for key: ${instantKey}`, 'success');
    } catch (err) {
      console.error(err);
      updateModalData({
        uploadError: err.message || 'Upload failed',
        isUploading: false,
      });
      addToast(err.message || 'Failed to send files', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-4 sm:p-7 flex flex-col justify-between card-hover-effect ${className}`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 font-bold shrink-0 text-sm sm:text-base">
              1
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                Send Files
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Videos, documents, photos, audio & folders
              </p>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <button
              onClick={clearAllFiles}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Dropzone & File Selector */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-5 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden group ${
            isDragging
              ? 'border-rose-500 bg-rose-50/50 scale-[1.01]'
              : 'border-slate-200 hover:border-rose-400 bg-slate-50/50 hover:bg-rose-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="w-14 h-14 rounded-2xl bg-white shadow-md shadow-slate-200/60 border border-slate-100 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform mb-3">
            <Upload className="w-7 h-7" />
          </div>

          <p className="text-sm sm:text-base font-bold text-slate-800 mb-1">
            Drag & drop files or <span className="text-rose-500 underline underline-offset-2">browse</span>
          </p>
          <p className="text-xs text-slate-500 max-w-xs">
            Any format: MP4 videos, PDF docs, ZIP archives, photos, etc.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              <Film className="w-3 h-3 text-rose-500" /> Videos
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              <FileText className="w-3 h-3 text-emerald-500" /> Documents
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              <Plus className="w-3 h-3 text-blue-500" /> Any File
            </span>
          </div>
        </div>

        {/* Selected Files List Preview */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
              <span>{selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected</span>
              <span className="font-bold text-slate-800">{formatBytes(totalBytes)}</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileIcon mimetype={file.type} filename={file.name} className="w-5 h-5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[170px] sm:max-w-xs">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-500">{formatBytes(file.size)}</span>
                        <FileTypeBadge mimetype={file.type} filename={file.name} />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Action Section */}
      <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
        {/* Expiry Selector */}
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-600">Key Validity:</span>
            <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg">
              {validityOptions.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
                    durationMinutes === mins
                      ? 'bg-white text-rose-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>
          {!isAuthenticated && (
            <div className="text-right">
              <Link to="/login" className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors">
                Need up to 24h validity? Sign in (optional)
              </Link>
            </div>
          )}
        </div>

        {/* Progress Bar when uploading */}
        {isUploading && (
          <div className="space-y-1.5 p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 text-rose-600">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {uploadProgress < 5
                  ? 'Connecting to Central Relay...'
                  : uploadProgress >= 100
                  ? 'Finalizing 6-digit key...'
                  : uploadStats.speed > 0
                  ? `Uploading at ${formatBytes(uploadStats.speed)}/s`
                  : 'Fast Streaming Transfer...'}
              </span>
              <span className="font-mono text-rose-600 font-black">{uploadProgress}%</span>
            </div>

            <div className="w-full bg-rose-200/50 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-rose-600 h-full rounded-full transition-all duration-200 shadow-xs"
                style={{ width: `${Math.max(4, uploadProgress)}%` }}
              />
            </div>

            {uploadStats.loaded > 0 && (
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold pt-0.5">
                <span>
                  Transferred: {formatBytes(uploadStats.loaded)} / {formatBytes(uploadStats.total || totalBytes)}
                </span>
                {uploadStats.speed > 0 && uploadProgress < 100 && (
                  <span>
                    ETA: {Math.max(1, Math.round(((uploadStats.total || totalBytes) - uploadStats.loaded) / uploadStats.speed))}s
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={selectedFiles.length === 0 || isUploading}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
            selectedFiles.length === 0 || isUploading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 hover:shadow-rose-500/35 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating 6-Digit Key...</span>
            </>
          ) : (
            <>
              <span>Send & Generate Key</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-500">
          Generates a 6-digit key and QR code to download instantly on another phone or PC.
        </p>
      </div>
    </div>
  );
}
