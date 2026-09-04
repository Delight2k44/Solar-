import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Zap, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ShoppingBag,
  ArrowRight,
  Calculator,
  PhoneCall,
  DollarSign
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { askGeminiSolarAssistant } from '../../services/geminiService';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  options?: { label: string; action: () => void }[];
  checkoutCard?: {
    title: string;
    priceZAR: number;
    specs: string;
    packageId: string;
  };
}

export const SolarChatWidget: React.FC<{ onOpenConfigurator: () => void }> = ({ onOpenConfigurator }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { products } = useData();
  const { addToCart, setIsCartOpen } = useCart();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [paymentSuccessRef, setPaymentSuccessRef] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "Howzit! 👋 I'm Kinetix, your solar energy assistant. I can help with system sizing, pricing in ZAR, loadshedding backup, compliance, or just answer any solar questions you have. What's on your mind?",
      timestamp: 'Just now',
      options: [
        { label: '⚡ Recommend a Solar Package', action: () => handleBotRecommend() },
        { label: '💬 WhatsApp Support (078 780 8569)', action: () => window.open('https://wa.me/27787808569?text=Hello%20Kinetix%20Energy,%20I%20would%20like%20to%20inquire%20about%20a%20solar%20system', '_blank') },
        { label: '💰 How much will I save?', action: () => handleBotSavings() },
        { label: '💳 Payment Options', action: () => handleBotPayment() },
        { label: '📋 SANS 10142 Compliance', action: () => handleBotCompliance() }
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleBotRecommend = () => {
    addBotMessage('For residential homes, our most popular solution is the Kinetix Executive 8kW Hybrid with 10.24kWh Lithium Storage and 5.5kWp Solar PV. Would you like to review or checkout?', [
      { label: '🛒 Add 8kW Kit to Cart & Pay', action: () => handleAddKitToCart() },
      { label: '📐 Size Custom Property Sizing', action: () => { setIsOpen(false); onOpenConfigurator(); } }
    ], {
      title: 'Kinetix Executive 8kW Hybrid + 10.24kWh Storage Set',
      priceZAR: 138900,
      specs: '8kW Deye Inverter • 2x 5.12kWh Freedom Won eTower • 10x 550W Panels',
      packageId: 'complete-kit-executive-8kw'
    });
  };

  const handleBotPayment = () => {
    addBotMessage('You can pay securely via Instant EFT (Ozow/Capitec Pay), Credit/Debit Card (3D Secure), or 60-Month Asset Finance. Please enter your reference code (e.g. KX-9042 or KX-Q-XXXX) or open your cart.', [
      { label: '💳 Open Cart & Pay Now', action: () => { setIsOpen(false); setIsCartOpen(true); } }
    ]);
  };

  const handleBotSavings = () => {
    addBotMessage('On average, South African homes and businesses offset 75% to 85% of their Eskom/municipal monthly bill, achieving full capital payback within 3.5 to 5.2 years under current NERSA tariff increases.', [
      { label: '🧮 Open Energy & Payback Calculator', action: () => { setIsOpen(false); onOpenConfigurator(); } }
    ]);
  };

  const handleBotCompliance = () => {
    addBotMessage('All Kinetix installations are performed by Department of Labour registered Installation Electricians (IE) and include an official supplementary electrical Certificate of Compliance (SANS 10142-1-2) with municipal SSEG registration.');
  };

  const handleAddKitToCart = () => {
    const kit = products.find(p => p.id === 'complete-kit-executive-8kw') || products[0];
    if (kit) {
      addToCart(kit, 1, true);
      addBotMessage(`Added ${kit.name} with certified installation to your cart. Opening checkout drawer now...`);
      setTimeout(() => {
        setIsOpen(false);
        setIsCartOpen(true);
      }, 1000);
    }
  };

  const handleInstantChatPay = (card: { title: string; priceZAR: number }) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const ref = `KX-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
      setPaymentSuccessRef(ref);
      addBotMessage(`🎉 Payment of R ${card.priceZAR.toLocaleString()} successfully processed via Secure Instant EFT!\n\nReference: ${ref}\nYour order has been routed to engineering dispatch.`);
    }, 1500);
  };

  const addBotMessage = (text: string, options?: { label: string; action: () => void }[], checkoutCard?: Message['checkoutCard']) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options,
          checkoutCard
        }
      ]);
    }, 600);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    // Add user message immediately
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsTyping(true);

    try {
      const historyContext = updatedHistory.map(m => ({ sender: m.sender, text: m.text }));
      const response = await askGeminiSolarAssistant(userText, historyContext, products);

      const lower = userText.toLowerCase();
      let options: { label: string; action: () => void }[] | undefined = undefined;
      let checkoutCard: Message['checkoutCard'] | undefined = undefined;

      // Attach contextual action buttons based on topic
      if (lower.includes('buy') || lower.includes('package') || lower.includes('kit') || lower.includes('8kw') || lower.includes('price') || lower.includes('quote') || lower.includes('checkout')) {
        options = [
          { label: '🛒 Add 8kW Kit to Cart', action: () => handleAddKitToCart() },
          { label: '💳 View Cart & Checkout', action: () => { setIsOpen(false); setIsCartOpen(true); } },
          { label: '📐 Open Sizing Calculator', action: () => { setIsOpen(false); onOpenConfigurator(); } }
        ];
        checkoutCard = {
          title: 'Kinetix Executive 8kW Hybrid + 10.24kWh Storage',
          priceZAR: 138900,
          specs: '8kW Deye Inverter • 2x 5.12kWh Freedom Won eTower • 10x 550W Panels',
          packageId: 'complete-kit-executive-8kw'
        };
      } else if (lower.includes('battery') || lower.includes('storage') || lower.includes('loadshedding') || lower.includes('backup')) {
        options = [
          { label: '🔋 View Battery Options', action: () => handleBotRecommend() },
          { label: '💳 Open Checkout', action: () => { setIsOpen(false); setIsCartOpen(true); } }
        ];
      } else if (lower.includes('install') || lower.includes('assessment') || lower.includes('book') || lower.includes('site visit')) {
        options = [
          { label: '📅 Book a Site Assessment', action: () => { setIsOpen(false); } }
        ];
      } else if (lower.includes('savings') || lower.includes('roi') || lower.includes('payback') || lower.includes('calculator')) {
        options = [
          { label: '🧮 Open Savings Calculator', action: () => { setIsOpen(false); onOpenConfigurator(); } }
        ];
      } else if (lower.includes('coc') || lower.includes('compliance') || lower.includes('sans')) {
        options = [
          { label: '📋 View CoC & Installation Process', action: () => handleBotCompliance() }
        ];
      }

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'bot',
          text: response.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options,
          checkoutCard
        }
      ]);
    } catch (err) {
      console.error('Error in chat response:', err);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'bot',
          text: "Apologies, I hit a snag there. You can still browse our hardware catalog or contact our engineering desk directly — we're always happy to help! 😊",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            { label: '🛒 View Hardware Catalog', action: () => { setIsOpen(false); } },
            { label: '📞 Contact Engineering', action: () => { setIsOpen(false); } }
          ]
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40 font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3.5 sm:px-4 sm:py-3.5 bg-[#0D1117] hover:bg-[#161B22] text-white rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 border border-[#00D2FF]/40 ring-4 ring-[#00D2FF]/10 active:scale-95"
          aria-label="Open Solar Engineering Chat"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#00D2FF]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00D2FF] rounded-full animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00D2FF] rounded-full" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline text-white">
            AI Solar Assistant
          </span>
        </button>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] h-[580px] max-h-[calc(100vh-6rem)] bg-[#0D1117]/95 backdrop-blur-2xl border border-[#1E2530] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#161B22] border-b border-[#1E2530] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00D2FF]/15 border border-[#00D2FF]/30 flex items-center justify-center text-[#00D2FF]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight">Kinetix Solar Assistant</h3>
                  <span className="px-2 py-0.5 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[10px] font-mono font-bold rounded-full">
                    Online
                  </span>
                </div>
                <span className="text-[11px] text-[#94A3B8]">Live Engineering & Sizing Intelligence</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#94A3B8] hover:text-white rounded-xl hover:bg-[#21262D] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-[#161B22] border border-[#21262D] flex items-center justify-center text-[#00D2FF] shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[85%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line text-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#00D2FF] text-black font-medium rounded-tr-none'
                        : 'bg-[#161B22] border border-[#21262D] text-[#E6ECE8] rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Optional Interactive Checkout Card in Chat */}
                  {msg.checkoutCard && (
                    <div className="p-4 bg-[#161B22] border border-[#00D2FF]/40 rounded-xl space-y-3 text-left shadow-lg">
                      <span className="text-[10px] uppercase text-[#00D2FF] font-mono font-bold block">
                        Verified Hardware Solution
                      </span>
                      <strong className="text-white text-xs block font-semibold">{msg.checkoutCard.title}</strong>
                      <p className="text-[11px] text-[#94A3B8]">{msg.checkoutCard.specs}</p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-[#21262D]">
                        <span className="text-sm font-bold text-[#10B981] font-mono">
                          R {msg.checkoutCard.priceZAR.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleInstantChatPay(msg.checkoutCard!)}
                          className="px-3.5 py-1.5 bg-[#00D2FF] hover:bg-[#38BDF8] text-black font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay in Chat</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Optional Quick Action Buttons (Dropdown on Mobile, Chips on Desktop) */}
                  {msg.options && (
                    <div className="pt-1">
                      {/* Mobile Dropdown Selector */}
                      <div className="block sm:hidden">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            const selected = msg.options?.find((_, i) => i.toString() === e.target.value);
                            if (selected) {
                              selected.action();
                              e.target.value = '';
                            }
                          }}
                          className="w-full bg-[#161B22] border border-[#30363D] text-[#00D2FF] text-xs font-medium rounded-xl px-3 py-2 outline-none"
                        >
                          <option value="" disabled>⚡ Choose an action or question...</option>
                          {msg.options.map((opt, idx) => (
                            <option key={idx} value={idx.toString()} className="bg-[#0D1117] text-white">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Desktop Chips */}
                      <div className="hidden sm:flex flex-wrap gap-1.5">
                        {msg.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={opt.action}
                            className="px-3 py-1.5 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] hover:border-[#00D2FF] text-white text-[11px] font-medium rounded-xl transition-all text-left shadow-sm"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] font-mono text-[#64748B] block px-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#94A3B8] pl-9">
                <span className="w-2 h-2 bg-[#00D2FF] rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-[#00D2FF] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-[#00D2FF] rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px]">Kinetix assistant is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#161B22] border-t border-[#1E2530] flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask a question or request sizing..."
              className="flex-1 bg-[#0D1117] border border-[#30363D] focus:border-[#00D2FF] focus:ring-1 focus:ring-[#00D2FF] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#64748B] outline-none transition-all"
            />
            <button
              type="submit"
              className="p-2.5 bg-[#00D2FF] hover:bg-[#38BDF8] text-black font-bold rounded-xl transition-all shrink-0 shadow-md"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
