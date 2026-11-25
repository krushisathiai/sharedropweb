import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getServerHealth } from '../services/api';

const TransferContext = createContext(null);

export function TransferProvider({ children }) {
  // Recent transfers history (saved in localStorage)
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('sharedrop_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Active modal state
  const [activeModal, setActiveModal] = useState(null);

  // Server & Network info
  const [serverInfo, setServerInfo] = useState({
    status: 'checking',
    serverType: 'Cloud Relay',
    clientUrl: window.location.origin,
  });

  // Toast notifications (Max 1 toast at a time with deduplication)
  const [toasts, setToasts] = useState([]);
  const lastToastRef = useRef({ message: '', time: 0 });

  useEffect(() => {
    try {
      localStorage.setItem('sharedrop_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Check server health on load
  useEffect(() => {
    let mounted = true;
    const checkHealth = async () => {
      const info = await getServerHealth();
      if (mounted) {
        setServerInfo(info);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Strict 1-Toast Policy: Replaces any current toast, prevents double popups on 1 click
  const addToast = (message, type = 'info', duration = 3000) => {
    if (!message) return;
    const now = Date.now();

    // Prevent duplicate toast if identical message was triggered within 2 seconds
    if (lastToastRef.current.message === message && now - lastToastRef.current.time < 2000) {
      return;
    }
    lastToastRef.current = { message, time: now };

    const id = now.toString();
    // Only 1 toast visible at a time
    setToasts([{ id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToHistory = (transferItem) => {
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...transferItem,
      },
      ...prev.slice(0, 49),
    ]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('sharedrop_history');
  };

  return (
    <TransferContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        activeModal,
        setActiveModal,
        serverInfo,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
}

export function useTransfer() {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error('useTransfer must be used within a TransferProvider');
  }
  return context;
}
