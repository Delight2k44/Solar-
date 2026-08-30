import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, CheckCheck, Sparkles, ExternalLink } from 'lucide-react';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber = '27787808569',
  defaultMessage = 'Hello Kinetix Energy, I would like to inquire about a solar system / quote for my property.'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const formattedDisplayNumber = '078 780 8569';

  const handleLaunchWhatsApp = (textToSend?: string) => {
    const message = textToSend || customMsg || defaultMessage;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const quickPrompts = [
    'I need a solar quote for my home',
    'I want to inquire about 50kW+ Commercial Solar',
    'Need help with an inverter / battery purchase',
    'Speak with a certified technician'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Expanded WhatsApp Modal / Drawer */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-[#0D1117] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 text-xs font-sans">
          
          {/* Header */}
          <div className="bg-[#128C7E] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#128C7E]"></span>
              </div>
              <div>
                <strong className="block text-sm font-bold leading-snug">Kinetix Solar Support</strong>
                <span className="text-[11px] text-white/80 flex items-center gap-1">
                  <span>{formattedDisplayNumber}</span> • <span className="text-emerald-200">Online 24/7</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body Simulation */}
          <div className="p-4 space-y-3 bg-[#05070A]/90 backdrop-blur-md max-h-80 overflow-y-auto">
            {/* Operator Message */}
            <div className="p-3 bg-[#131822] border border-white/10 rounded-xl rounded-tl-none space-y-1 text-white shadow-sm">
              <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                Hello! Welcome to <strong>Kinetix Energy</strong>. How can our engineering team assist you today?
              </p>
              <div className="flex items-center justify-end gap-1 text-[9px] text-[#64748B]">
                <span>Just now</span>
                <CheckCheck className="w-3 h-3 text-[#00D2FF]" />
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase text-[#64748B] font-bold block">
                Quick Select:
              </span>
              <div className="flex flex-col gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLaunchWhatsApp(prompt)}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366]/50 text-[#CBD5E1] hover:text-white transition-all text-[11px] flex items-center justify-between group"
                  >
                    <span className="truncate">{prompt}</span>
                    <ExternalLink className="w-3 h-3 text-[#25D366] opacity-60 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#0D1117] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLaunchWhatsApp();
              }}
              placeholder="Type your message..."
              className="flex-1 bg-[#05070A] border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-[#64748B] focus:border-[#25D366] focus:outline-none"
            />
            <button
              onClick={() => handleLaunchWhatsApp()}
              className="p-2 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-bold rounded-xl transition-colors shadow-md flex items-center justify-center shrink-0"
              title="Send via WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-bold rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/30"
        title="Chat on WhatsApp (078 780 8569)"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-mono font-extrabold uppercase tracking-tight hidden sm:inline">
          WhatsApp Us
        </span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
        </span>
      </button>
    </div>
  );
};
