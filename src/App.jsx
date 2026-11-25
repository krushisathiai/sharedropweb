import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ChatBot from './components/ChatBot';
import KeyDisplayModal from './components/KeyDisplayModal';
import FileReceiveModal from './components/FileReceiveModal';
import Home from './pages/Home';
import SendPage from './pages/SendPage';
import ReceivePage from './pages/ReceivePage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { TransferProvider, useTransfer } from './context/TransferContext';
import { AuthProvider } from './context/AuthContext';

function MainApp() {
  const { activeModal, setActiveModal } = useTransfer();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-rose-100 selection:text-rose-600">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area (Offset for Top Fixed Navbar) */}
      <main className="flex-1 pt-16 sm:pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<SendPage />} />
          <Route path="/receive" element={<ReceivePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Modals */}
      {activeModal?.type === 'key' && (
        <KeyDisplayModal
          data={activeModal.data}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal?.type === 'receive' && (
        <FileReceiveModal
          transfer={activeModal.data}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Floating Toast Notifications */}
      <Toast />

      {/* Intelligent AI Support ChatBot */}
      <ChatBot />

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TransferProvider>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </TransferProvider>
    </AuthProvider>
  );
}
