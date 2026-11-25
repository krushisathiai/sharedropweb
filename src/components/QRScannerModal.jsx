import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Image as ImageIcon, AlertCircle, Loader2, Sparkles, SwitchCamera, CheckCircle2 } from 'lucide-react';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [mode, setMode] = useState('camera'); // 'camera' | 'image'
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Helper to extract 6-digit key from QR code text or URL
  const extractKeyFromQr = (rawText) => {
    if (!rawText) return null;
    const text = rawText.trim();

    // 1. Check if it's a URL with key parameter (e.g. ?key=482910)
    const urlMatch = text.match(/[?&]key=([0-9]{6})/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }

    // 2. Check if raw text contains 6 digits
    const digitsMatch = text.match(/\b([0-9]{6})\b/);
    if (digitsMatch && digitsMatch[1]) {
      return digitsMatch[1];
    }

    // 3. Clean all non-digits and check if length is 6
    const cleanDigits = text.replace(/[^0-9]/g, '');
    if (cleanDigits.length === 6) {
      return cleanDigits;
    }

    return null;
  };

  const handleDecodedText = async (decodedText) => {
    const key = extractKeyFromQr(decodedText);
    if (key) {
      stopCameraScanner();
      onScanSuccess(key);
      onClose();
    } else {
      setCameraError(`Scanned QR code doesn't contain a valid 6-digit key: ${decodedText}`);
    }
  };

  const stopCameraScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (e) {
        console.warn('Error stopping QR scanner:', e);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Start Camera
  const startCameraScanner = async (cameraIdOrConfig = { facingMode: 'environment' }) => {
    try {
      setCameraError(null);
      setIsScanning(true);

      // Stop previous instance if any
      await stopCameraScanner();

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      // Detect available cameras
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCameras(devices);
        }
      } catch (e) {
        // ignore device listing error
      }

      await scanner.start(
        cameraIdOrConfig,
        {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrEdge = Math.floor(minEdge * 0.75);
            return { width: qrEdge, height: qrEdge };
          },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleDecodedText(decodedText);
        },
        (errorMessage) => {
          // ignore scan frame misses
        }
      );
    } catch (err) {
      console.error('Camera start error:', err);
      setCameraError('Camera access denied or unavailable. Please grant camera permission or upload a QR image.');
      setIsScanning(false);
    }
  };

  // Switch between front/back camera
  const handleSwitchCamera = () => {
    if (cameras.length > 1) {
      const nextIndex = (currentCameraIndex + 1) % cameras.length;
      setCurrentCameraIndex(nextIndex);
      startCameraScanner(cameras[nextIndex].id);
    } else {
      const facing = currentCameraIndex === 0 ? 'user' : 'environment';
      setCurrentCameraIndex((prev) => (prev === 0 ? 1 : 0));
      startCameraScanner({ facingMode: facing });
    }
  };

  // Handle image upload scan
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCameraError(null);
      await stopCameraScanner();

      const scanner = new Html5Qrcode('qr-reader-hidden');
      const decodedText = await scanner.scanFile(file, true);
      scanner.clear();

      handleDecodedText(decodedText);
    } catch (err) {
      console.error('File scan error:', err);
      setCameraError('No valid QR code found in this image. Please try another image.');
    }
  };

  useEffect(() => {
    if (isOpen && mode === 'camera') {
      // Small timeout to allow DOM element to render
      const timer = setTimeout(() => {
        startCameraScanner();
      }, 300);
      return () => {
        clearTimeout(timer);
        stopCameraScanner();
      };
    } else {
      stopCameraScanner();
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              Scan QR Code to Auto-Download
            </h3>
          </div>
          <button
            onClick={() => {
              stopCameraScanner();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="p-4 border-b border-slate-100 flex gap-2 bg-slate-50/30">
          <button
            type="button"
            onClick={() => setMode('camera')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'camera'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('image');
              stopCameraScanner();
              fileInputRef.current?.click();
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'image'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload QR Image</span>
          </button>
        </div>

        {/* Hidden elements */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <div id="qr-reader-hidden" className="hidden" />

        {/* Body Viewport */}
        <div className="p-6 flex flex-col items-center justify-center space-y-4">
          
          {mode === 'camera' && (
            <div className="w-full relative rounded-2xl overflow-hidden bg-slate-950 aspect-square max-w-[280px] flex items-center justify-center shadow-inner border-2 border-slate-200">
              {/* QR Reader mount point */}
              <div id="qr-reader" className="w-full h-full" />

              {/* Scanning visual overlay */}
              {isScanning && !cameraError && (
                <div className="pointer-events-none absolute inset-0 border-2 border-rose-500/40 rounded-2xl flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border-2 border-dashed border-rose-500 rounded-xl relative overflow-hidden">
                    {/* Animated Laser Bar */}
                    <div className="w-full h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'image' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-slate-200 hover:border-rose-400 bg-slate-50 p-8 text-center cursor-pointer space-y-3 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-rose-500 mx-auto">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Tap to select QR code photo / screenshot</p>
                <p className="text-[11px] text-slate-500 mt-0.5">JPG, PNG, WEBP supported</p>
              </div>
            </div>
          )}

          {/* Camera controls */}
          {mode === 'camera' && isScanning && (
            <button
              type="button"
              onClick={handleSwitchCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <SwitchCamera className="w-3.5 h-3.5" />
              <span>Switch Camera</span>
            </button>
          )}

          {/* Camera error message */}
          {cameraError && (
            <div className="w-full bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('image');
                    fileInputRef.current?.click();
                  }}
                  className="font-bold underline text-rose-800 hover:text-rose-950"
                >
                  Click here to upload QR screenshot instead
                </button>
              </div>
            </div>
          )}

          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-slate-800">
              Point your camera at the sender's QR code
            </p>
            <p className="text-[11px] text-slate-500 max-w-xs">
              As soon as the QR code is recognized, the video or document will download automatically to your mobile!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Auto-Download Enabled
          </span>
          <button
            onClick={() => {
              stopCameraScanner();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
