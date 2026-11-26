import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Download,
  Zap,
  ShieldCheck,
  Smartphone,
  Laptop,
  ArrowRight,
  Sparkles,
  Film,
  FileText,
  FileCheck2,
  Lock,
  ChevronDown,
  ChevronUp,
  Globe,
  QrCode,
  Layers,
  CheckCircle2,
  Signal,
  Wifi,
} from 'lucide-react';
import SendCard from '../components/SendCard';
import ReceiveCard from '../components/ReceiveCard';
import { useTransfer } from '../context/TransferContext';

export default function Home() {
  const { serverInfo } = useTransfer();
  const [activeTab, setActiveTab] = useState('send');
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'Can the sender and recipient be on different networks (e.g. 5G and home Wi-Fi)?',
      a: 'Yes, absolutely! ShareDrop uses a central cloud relay architecture. The sender can be connected to mobile cellular data (4G/5G) in one city, while the recipient is on Wi-Fi in another city. As long as the recipient has the 6-digit key or QR link, they can download the file directly.',
    },
    {
      q: 'How do I transfer a video or document from my phone to another device?',
      a: 'Simply choose your document or video on the "Send" card and tap "Send & Generate Key". A unique 6-digit PIN (e.g., 482 910) and QR code will appear. On the recipient mobile or PC, open ShareDrop, enter the 6-digit PIN (or scan the QR code), and click Download to save the file immediately.',
    },
    {
      q: 'Does ShareDrop compress or resize large videos and photos?',
      a: 'No. Unlike messaging apps that downscale your media, ShareDrop preserves 100% of the original uncompressed quality. 4K video clips, RAW photographs, and high-resolution PDFs are transferred bit-for-bit.',
    },
    {
      q: 'Do I need to sign up or create an account?',
      a: 'No account, password, email address, or phone number is ever required. ShareDrop is completely anonymous and provides instant peer-to-cloud file sharing.',
    },
    {
      q: 'How long is the 6-digit transfer key valid?',
      a: 'Each transfer key is valid for 10 minutes by default (customizable up to 60 minutes). Once the timer expires, all staged files are permanently and automatically purged from the server for your privacy.',
    },
  ];

  const features = [
    {
      icon: <Globe className="w-6 h-6 text-rose-500" />,
      title: 'Any Network Supported',
      desc: 'Sender on 4G/5G cellular, recipient on Wi-Fi in any location. No network boundaries.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Instant 6-Digit Key',
      desc: 'No login, no complex Bluetooth pairing. Just enter the 6-digit PIN or scan QR code.',
    },
    {
      icon: <Film className="w-6 h-6 text-emerald-500" />,
      title: 'Original File Quality',
      desc: 'Send 4K videos, heavy PDF manuals, and RAW photos without compression or quality loss.',
    },
    {
      icon: <Lock className="w-6 h-6 text-purple-500" />,
      title: 'Auto-Expiring & Secure',
      desc: 'Files automatically delete from the server after 10 minutes. Nothing is stored permanently.',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-12 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-14 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-50/70 via-slate-50/30 to-transparent pointer-events-none -z-10 rounded-full blur-3xl opacity-60" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Hero Headings */}
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 animate-fade-in">
            {/* Global Relay Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] sm:text-xs font-bold tracking-wide shadow-2xs animate-float">
              <Globe className="w-3.5 h-3.5" />
              <span>Global Cloud Relay • Works Across 4G / 5G / Wi-Fi Networks</span>
            </div>

            {/* Concise Title with Send & Receive Icons */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <span className="inline-flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 shadow-xs" title="Send Files">
                <Send className="w-4 h-4 sm:w-5 sm:h-5 -rotate-12" />
              </span>
              <span>
                Send & Receive <span className="text-rose-500">Files Instantly</span>
              </span>
              <span className="inline-flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xs" title="Receive Files">
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto px-1">
              Transfer videos, documents & photos between any phone and computer across any network with a simple 6-digit key.
            </p>

            {/* Intuitive 2-Step Workflow Indicator */}
            <div className="inline-flex items-center justify-center gap-2 sm:gap-3 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold shadow-2xs">
                <Send className="w-3.5 h-3.5 text-rose-600" />
                <span>1. Send & Get Key</span>
              </div>
              <span className="text-slate-300 font-bold text-xs">➔</span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-bold shadow-2xs">
                <Download className="w-3.5 h-3.5 text-slate-900" />
                <span>2. Enter Key & Download</span>
              </div>
            </div>
          </div>

          {/* Dual Card Section (Send & Receive) */}
          <div className="mt-8 sm:mt-12 max-w-5xl mx-auto animate-fade-in-delayed">
            {/* Mobile Tab Switcher */}
            <div className="flex sm:hidden p-1 bg-slate-200/80 rounded-xl mb-3 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('send')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'send'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Send Files
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('receive')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'receive'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Receive Key
              </button>
            </div>

            {/* Desktop Side-by-Side / Mobile Tabbed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              <div className={`${activeTab === 'send' ? 'block' : 'hidden sm:block'}`}>
                <SendCard className="h-full" />
              </div>
              <div className={`${activeTab === 'receive' ? 'block' : 'hidden sm:block'}`}>
                <ReceiveCard className="h-full" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works (Visual 3-Step Interactive Guide) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How Does Cross-Device Transfer Work?
            </h2>
            <p className="text-sm text-slate-600">
              Share any file between different phones and computers in three seamless steps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-6 relative flex flex-col items-center text-center group hover:bg-white card-hover-effect">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 font-black text-xl mb-4 group-hover:scale-110 transition-transform">
                <Film className="w-7 h-7 text-rose-500" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold mb-2">
                STEP 1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Select Files on Device A
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose any video, document, photo, or folder in the Send card and click "Send & Generate Key".
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-6 relative flex flex-col items-center text-center group hover:bg-white card-hover-effect">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 font-black text-xl mb-4 group-hover:scale-110 transition-transform">
                <QrCode className="w-7 h-7 text-amber-500" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold mb-2">
                STEP 2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Get 6-Digit Key & QR Code
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A unique 6-digit key (e.g. 482 910) and scannable QR code is generated, valid for 10 minutes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-6 relative flex flex-col items-center text-center group hover:bg-white card-hover-effect">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 font-black text-xl mb-4 group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-7 h-7 text-emerald-500" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold mb-2">
                STEP 3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Enter Key on Device B & Save
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                On the recipient device, enter the 6-digit key or scan the QR code to instantly download the original files.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Cross-Network Visual Demonstration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              Cloud Relay Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How Transfers Work Across Different Networks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              ShareDrop connects devices across cellular data, home broadband, and office networks globally:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Sender on Mobile 4G/5G */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-3 card-hover-effect">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto transition-transform hover:scale-110">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-100/60 px-2 py-0.5 rounded-full">
                  Network 1: Mobile Data (4G / 5G)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Sender Device</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Uploads the video or document via ShareDrop web app. Files are staged and encrypted with a 6-digit PIN.
                </p>
              </div>
            </div>

            {/* Central Cloud Server */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-2xl p-6 text-center space-y-3 shadow-xl card-hover-effect relative border border-slate-700/60">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-rose-400 flex items-center justify-center mx-auto animate-pulse-glow">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  ShareDrop Cloud Server
                </span>
                <h3 className="text-base font-bold text-white mt-2">Key: 482 910</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Server matches the 6-digit key, verifies validity, and automatically purges all files after 10 minutes.
                </p>
              </div>
            </div>

            {/* Receiver on Different WiFi / City */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-3 card-hover-effect">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto transition-transform hover:scale-110">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                  Network 2: Home Wi-Fi / Any City
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Recipient Device</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Enters the 6-digit key on ShareDrop and downloads the uncompressed document or video instantly.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
            Why Choose ShareDrop
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Engineered for Ultra-Fast File Transfer
          </h2>
          <p className="text-sm text-slate-600">
            No cables, no Bluetooth pairing, and no cloud account setups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 group card-hover-effect"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported File Types Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Unlimited File Types
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Documents, Videos, Photos, ZIP & Folders
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Send large MP4/MKV videos, PDF contracts, Word documents, Excel sheets, and audio files between any two devices without size or format restrictions.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">🎬 MP4, MKV, AVI, MOV</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">📄 PDF, DOCX, XLSX, PPT</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">📸 PNG, JPG, RAW, HEIC</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">📦 ZIP, RAR, 7Z</span>
            </div>

            <div className="pt-4">
              <Link
                to="/send"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition-all hover:scale-105"
              >
                <span>Send Files Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-bold text-slate-800 text-sm sm:text-base hover:text-rose-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-rose-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
