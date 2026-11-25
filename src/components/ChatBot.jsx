import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  ChevronDown,
  Wifi,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { QUICK_PROMPTS, getAssistantResponse } from '../services/chatbotKnowledge';
import { useTransfer } from '../context/TransferContext';
import { useAuth } from '../context/AuthContext';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { isOnline } = useTransfer();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial welcome message
  const initialMessages = [
    {
      id: 'welcome',
      sender: 'bot',
      timestamp: Date.now(),
      title: '👋 Namaste! Main ShareDrop AI Assistant hoon.',
      text: `Aapko file transfer, 6-digit key, automatic download, ya cross-network sharing me koi bhi issue aa raha hai?

Neeche diye gaye topics me se choose karein ya apna question Hindi, Hinglish, ya English me type karein!`,
      tips: ['Tip: Pune to Sangamner transfer ya kisi bhi network par automatic download support available hai.'],
    },
  ];

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('sharedrop_chatbot_msgs');
      return saved ? JSON.parse(saved) : initialMessages;
    } catch (e) {
      return initialMessages;
    }
  });

  // Save session messages
  useEffect(() => {
    try {
      sessionStorage.setItem('sharedrop_chatbot_msgs', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking delay for natural conversational feel
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
    }, 450);
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
    setMessages(initialMessages);
  };

  const handleActionClick = (path) => {
    if (path) {
      navigate(path);
      // On mobile close chat to show target screen
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
          <div className="flex items-center gap-2">
            {/* Tooltip / Attention Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md border border-slate-700/50 animate-bounce duration-1000">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Need Help? Chat with AI</span>
            </div>

            {/* Main Floating Button */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open AI Support Chat"
              className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-xl shadow-rose-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-rose-300"
            >
              <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-25 group-hover:opacity-40" />
              <Bot className="w-7 h-7 relative z-10 transition-transform group-hover:rotate-6" />
              {/* Online Indicator */}
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </button>
          </div>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-full sm:w-[420px] h-full sm:h-[620px] sm:max-h-[85vh] bg-white sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-500/30 shrink-0">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white tracking-tight truncate">
                    ShareDrop AI Support
                  </h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-medium">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  Instant Troubleshooting & Help Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetChat}
                title="Restart Chat"
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cloud Server Live Status Pill */}
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span className="font-medium text-[11px]">
                {isOnline ? 'Central Relay: Online (Pune ↔ Any City)' : 'Relay: Connecting...'}
              </span>
            </div>
            {isAuthenticated ? (
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full">
                Logged in: {user?.name?.split(' ')[0]}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500">
                Guest Mode (Active)
              </span>
            )}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
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
                    <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{msg.title}</span>
                    </p>
                  )}

                  {/* Message Content */}
                  <div className="whitespace-pre-line text-slate-700 font-normal">
                    {msg.text}
                  </div>

                  {/* Action Link Button if provided */}
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

                  {/* Tips Box */}
                  {msg.tips && msg.tips.length > 0 && (
                    <div className="mt-2 p-2 bg-amber-50/80 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 font-medium">
                      {msg.tips[0]}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-400 font-medium ml-1">AI typing...</span>
                </div>
              </div>
            )}

            {/* Quick Action Chips (Always visible at bottom of chat) */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-slate-400" />
                <span>Common Troubleshooting Questions:</span>
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
                className="w-10 h-10 rounded-2xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:hover:bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 transition-all shrink-0 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              ShareDrop AI Assistant • Type in Hindi, Hinglish, or English
            </p>
          </div>
        </div>
      )}
    </>
  );
}
