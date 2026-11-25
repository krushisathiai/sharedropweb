import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Smartphone,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { QUICK_PROMPTS, getAssistantResponse } from '../services/chatbotKnowledge';
import { useTransfer } from '../context/TransferContext';
import { useAuth } from '../context/AuthContext';

/**
 * Modern High-Resolution AI Assistant SVG Icon
 */
function ModernBotIcon({ className = 'w-7 h-7' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Bot Antenna with Sparkle */}
      <path d="M12 2v3" strokeWidth="2.2" />
      <circle cx="12" cy="2" r="1" fill="currentColor" />
      {/* Bot Head */}
      <rect x="4" y="5" width="16" height="13" rx="4" strokeWidth="2" />
      {/* Glowing Screen Eyes */}
      <circle cx="9" cy="11.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="11.5" r="1.5" fill="currentColor" stroke="none" />
      {/* Smiling Mouth */}
      <path d="M9.5 15c.8.7 1.7 1 2.5 1s1.7-.3 2.5-1" strokeWidth="1.8" />
      {/* Side Audio Ears */}
      <path d="M2 11h2" strokeWidth="2.5" />
      <path d="M20 11h2" strokeWidth="2.5" />
    </svg>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { isOnline } = useTransfer();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Starts completely EMPTY as requested by user
  const [messages, setMessages] = useState([]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    // 1. Add user message
    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // 2. Automatic AI reply with realistic thinking delay
    setTimeout(() => {
      const botReply = getAssistantResponse(query, {
        isOnline,
        isAuthenticated,
        user,
      });

      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        timestamp: Date.now(),
        ...botReply,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPromptClick = (prompt) => {
    handleSendMessage(prompt.query);
  };

  const handleResetChat = () => {
    // Reset to empty state
    setMessages([]);
  };

  const handleActionClick = (path) => {
    if (path) {
      navigate(path);
      if (window.innerWidth < 640) {
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center">
        {!isOpen && (
          <div className="flex items-center gap-2.5">
            {/* Attention Badge on Desktop */}
            <div
              onClick={() => setIsOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-slate-900/95 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-xl backdrop-blur-md border border-slate-700/60 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI • Instant Help</span>
            </div>

            {/* Premium Floating Bot Button */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open ShareDrop AI Support"
              className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white shadow-xl shadow-rose-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-rose-300/50"
            >
              {/* Animated pulse halo */}
              <div className="absolute inset-0 rounded-2xl bg-rose-400 animate-ping opacity-20 group-hover:opacity-35" />
              
              {/* Bot Icon with glowing style */}
              <div className="relative z-10 flex items-center justify-center transition-transform group-hover:scale-110">
                <ModernBotIcon className="w-7 h-7 text-white drop-shadow-sm" />
              </div>

              {/* Online Green Indicator Dot */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-full sm:w-[430px] h-full sm:h-[630px] sm:max-h-[85vh] bg-white sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-sm border-b border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/30 shrink-0">
                <ModernBotIcon className="w-5 h-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white tracking-tight truncate">
                    ShareDrop AI Assistant
                  </h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  Instant Troubleshooting & Help Support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetChat}
                title="Clear Chat"
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close Support"
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cloud Server Live Status Pill */}
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span className="font-semibold text-[11px] text-slate-700">
                {isOnline ? 'Central Relay: Online (Cross-Network Active)' : 'Relay: Connecting...'}
              </span>
            </div>
            {isAuthenticated ? (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full">
                Account: {user?.name?.split(' ')[0]}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-medium">
                Guest Mode
              </span>
            )}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            
            {/* EMPTY STATE: Shown when no messages exist yet */}
            {messages.length === 0 && (
              <div className="py-6 sm:py-8 px-2 text-center space-y-5 animate-fade-in">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 via-rose-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-500/20">
                  <ModernBotIcon className="w-9 h-9" />
                </div>

                <div className="space-y-1.5 max-w-xs mx-auto">
                  <h4 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                    How can I help you today?
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Type your question below or click a topic for instant automatic troubleshooting.
                  </p>
                </div>

                {/* Common Suggested Topics */}
                <div className="pt-2 text-left space-y-2 max-w-sm mx-auto">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 px-1">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>Frequently Asked Questions:</span>
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {QUICK_PROMPTS.slice(0, 5).map((prompt) => (
                      <button
                        key={prompt.id}
                        type="button"
                        onClick={() => handleQuickPromptClick(prompt)}
                        className="w-full text-left p-3 rounded-2xl bg-white hover:bg-rose-50/60 border border-slate-200 hover:border-rose-200 shadow-2xs transition-all flex items-center justify-between text-xs font-semibold text-slate-800 hover:text-rose-600 group active:scale-[0.99]"
                      >
                        <span>{prompt.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <ModernBotIcon className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-rose-500 text-white font-medium rounded-tr-xs shadow-md shadow-rose-500/10'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs space-y-2.5'
                  }`}
                >
                  {/* Bot Title if present */}
                  {msg.title && (
                    <p className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{msg.title}</span>
                    </p>
                  )}

                  {/* Message Content */}
                  <div className="whitespace-pre-line text-slate-700 font-normal leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Direct Action Navigation Button */}
                  {msg.action && (
                    <button
                      type="button"
                      onClick={() => handleActionClick(msg.action.path)}
                      className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs"
                    >
                      <span>{msg.action.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Pro Tip Box */}
                  {msg.tips && msg.tips.length > 0 && (
                    <div className="mt-2 p-2.5 bg-rose-50/70 border border-rose-200/60 rounded-xl text-[11px] text-rose-900 font-medium">
                      {msg.tips[0]}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Real-time Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <ModernBotIcon className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-400 font-medium ml-1">AI Assistant is typing...</span>
                </div>
              </div>
            )}

            {/* Quick Action Chips when conversation is ongoing */}
            {messages.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>Other Topics:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handleQuickPromptClick(prompt)}
                      className="text-left text-[11px] font-medium bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all active:scale-95"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask any issue (e.g. download failed)..."
                className="flex-1 bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:opacity-40 disabled:hover:from-rose-500 disabled:hover:to-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 transition-all shrink-0 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-slate-600 text-center mt-2 font-medium">
              ShareDrop AI Support • Instant Automatic Troubleshooting
            </p>
          </div>
        </div>
      )}
    </>
  );
}
