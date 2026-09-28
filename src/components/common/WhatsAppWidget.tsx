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
    <div className="fixed bottom-6 right-4 sm:right-6 z-40 font-sans">
      {/* Expanded WhatsApp Modal / Drawer */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-96 max-w-96 bg-[#0D1117] border border-[#1E2530] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 text-xs font-sans">
          
          {/* Header */}
          <div className="bg-[#128C7E] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#128C7E]"></span>
              </div>
              <div>
                <strong className="block text-sm font-bold leading-snug">Kinetix Direct Support</strong>
                <span className="text-[11px] text-white/90 flex items-center gap-1 font-mono">
                  <span>{formattedDisplayNumber}</span> • <span className="text-emerald-200 font-bold">Online 24/7</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body Simulation */}
          <div className="p-4 space-y-3 bg-[#0D1117]/95 backdrop-blur-md max-h-80 overflow-y-auto">
            {/* Operator Message */}
            <div className="p-3.5 bg-[#161B22] border border-[#21262D] rounded-2xl rounded-tl-none space-y-1.5 text-white shadow-sm">
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Hello! Welcome to <strong>Kinetix Energy</strong>. How can our engineering team assist your property today?
              </p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-[#64748B] font-mono">
                <span>Just now</span>
                <CheckCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
              </div>
            </div>

            {/* Quick Prompt Chips (Dropdown on Mobile, Chips on Desktop) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase text-[#64748B] font-semibold tracking-wider block">
                Quick Select Option:
              </span>

              {/* Mobile Dropdown Selector */}
              <div className="block sm:hidden">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleLaunchWhatsApp(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full bg-[#161B22] border border-[#30363D] text-[#25D366] text-xs font-medium rounded-xl px-3 py-2.5 outline-none"
                >
                  <option value="" disabled>💬 Tap to choose quick inquiry...</option>
                  {quickPrompts.map((prompt, idx) => (
                    <option key={idx} value={prompt} className="bg-[#0D1117] text-white">
                      {prompt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desktop Chips */}
              <div className="hidden sm:flex flex-col gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLaunchWhatsApp(prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#161B22] hover:bg-[#25D366]/15 border border-[#21262D] hover:border-[#25D366]/50 text-[#CBD5E1] hover:text-white transition-all text-xs flex items-center justify-between group shadow-sm"
                  >
                    <span className="truncate">{prompt}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#25D366] opacity-70 group-hover:opacity-100 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#161B22] border-t border-[#1E2530] flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLaunchWhatsApp();
              }}
              placeholder="Type your WhatsApp message..."
              className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-[#64748B] focus:border-[#25D366] focus:outline-none transition-all"
            />
            <button
              onClick={() => handleLaunchWhatsApp()}
              className="p-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-bold rounded-xl transition-all shadow-md flex items-center justify-center shrink-0"
              title="Send via WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button: Standard 56px Circular FAB with 28px Realistic Icon */}
      <div className="relative group flex items-center justify-end">
        {/* Tooltip on hover */}
        <div className="absolute right-full mr-3 px-3 py-1.5 bg-[#0D1117]/95 border border-[#1E2530] text-white text-xs font-mono rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-2 group-hover:translate-x-0 hidden sm:block z-50">
          <span className="font-bold text-white block">WhatsApp Support</span>
          <span className="text-[10px] text-[#25D366] font-mono">078 780 8569 • Online</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_35px_rgba(37,211,102,0.65)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/25 cursor-pointer relative"
          title="Chat on WhatsApp (078 780 8569)"
          aria-label="Chat on WhatsApp"
        >
          {/* Authentic WhatsApp Vector Icon (28px) */}
          <svg 
            viewBox="0 0 24 24" 
            className="w-7 h-7 fill-current drop-shadow-sm"
          >
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.201.301-.778.978-.953 1.179-.175.2-.351.226-.652.075s-1.272-.469-2.423-1.496c-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.201.05-.376-.025-.527s-.677-1.632-.928-2.234c-.244-.587-.492-.507-.677-.516l-.577-.01c-.201 0-.527.075-.802.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.229 3.111c.15.201 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.635.722.23 1.379.198 1.899.12.579-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351zM12.04 2C6.516 2 2.028 6.488 2.028 12.012c0 1.95.56 3.774 1.528 5.318L2 22l4.81-1.508a9.98 9.98 0 005.23 1.52c5.524 0 10.012-4.488 10.012-10.012C22.052 6.488 17.564 2 12.04 2zm0 18.272a8.26 8.26 0 01-4.218-1.157l-.303-.18-3.136.984.996-3.056-.197-.314a8.26 8.26 0 01-1.276-4.537c0-4.57 3.717-8.288 8.287-8.288 4.57 0 8.288 3.718 8.288 8.288 0 4.57-3.718 8.288-8.288 8.288z" />
          </svg>

          {/* Pulsing online badge */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#25D366] border-2 border-[#0D1117]"></span>
          </span>
        </button>
      </div>
    </div>
  );
};
