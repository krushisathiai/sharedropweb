import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Toast notifications
  const [toasts, setToasts] = useState([]);

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

  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
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
