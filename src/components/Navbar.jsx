import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Send, Download, History, Menu, X, Globe, User, LogOut, ChevronDown, Zap } from 'lucide-react';
import { useTransfer } from '../context/TransferContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { history, addToast } = useTransfer();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Transfer', path: '/' },
    { name: 'Send', path: '/send' },
    { name: 'Receive', path: '/receive' },
    { name: 'History', path: '/history', badge: isAuthenticated && history.length > 0 ? history.length : null },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    addToast('You have been logged out.', 'info');
    navigate('/');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Share<span className="text-rose-500">Drop</span>
                </span>
                <span className="text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/60 rounded px-1.5 py-0.2">
                  Cloud Relay
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Instant Cross-Network File Sharing
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/60">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive(link.path)
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className="w-4 h-4 text-[10px] bg-rose-500 text-white rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action / Auth & Network Status */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Global Online Status Badge */}
            <div
              title="Transfers work across 4G, 5G, and Wi-Fi worldwide"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>Any Network</span>
            </div>

            {/* User Auth Section (Optional) */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
                    {userInitial}
                  </div>
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/history"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <History className="w-4 h-4 text-slate-400" />
                      <span>Transfer History</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}

            <Link
              to="/send"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-sm shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Send Files</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/send"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600"
            >
              Send
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive(link.path)
                    ? 'bg-rose-50 text-rose-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="w-5 h-5 text-xs bg-rose-500 text-white rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 bg-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
