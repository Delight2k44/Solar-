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
      text: 'Hello! I am your Kinetix Solar Energy Assistant. How can I help you take control of your energy today?',
      timestamp: 'Just now',
      options: [
        { label: '⚡ Recommend a Solar Package', action: () => handleBotRecommend() },
        { label: '💳 Pay for an Existing Quote', action: () => handleBotPayment() },
        { label: '📊 How much will I save?', action: () => handleBotSavings() },
        { label: '🛠️ SANS 10142 CoC Details', action: () => handleBotCompliance() }
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setInputMessage('');
    
    setMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    const lower = userText.toLowerCase();
    if (lower.includes('price') || lower.includes('cost') || lower.includes('quote') || lower.includes('pay') || lower.includes('buy')) {
      setTimeout(() => handleBotRecommend(), 400);
    } else if (lower.includes('battery') || lower.includes('storage') || lower.includes('loadshedding')) {
      setTimeout(() => {
        addBotMessage('We utilize Tier-1 LiFePO4 battery modules (Freedom Won, Dyness) rated for over 6,000 cycles with a 10-year warranty. Would you like a backup recommendation?', [
          { label: '🔋 View Battery Storage Solutions', action: () => handleBotRecommend() }
        ]);
      }, 500);
    } else {
      setTimeout(() => {
        addBotMessage('Thank you! Our engineering dispatch desk is available 24/7. You can request a quote, make an EFT payment, or chat with a master electrician.', [
          { label: '⚡ Request an Official Sizing Quote', action: () => handleBotRecommend() },
          { label: '💳 View Cart & Payment Methods', action: () => { setIsOpen(false); setIsCartOpen(true); } }
        ]);
      }, 600);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-[#1B4D3E] hover:bg-[#286D58] text-white rounded-full shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 border border-[#286D58] ring-4 ring-[#1B4D3E]/20"
          aria-label="Open Solar Engineering Chat"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#1B4D3E]" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider hidden sm:inline">
            Live Solar Chat & Payments
          </span>
        </button>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] bg-[#0E1311] border border-[#24302A] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#141A17] border-b border-[#24302A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1B4D3E] border border-[#286D58] flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white uppercase">Kinetix Solar Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                </div>
                <span className="text-[10px] font-mono text-[#9EADA5]">Live Engineering & Checkout Dispatch</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#9EADA5] hover:text-white rounded-lg hover:bg-[#0E1311] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#141A17] border border-[#24302A] flex items-center justify-center text-[#286D58] shrink-0 mt-0.5">
                    <Zap className="w-3 h-3" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[85%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line text-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#1B4D3E] text-white rounded-tr-none'
                        : 'bg-[#141A17] border border-[#24302A] text-[#E6ECE8] rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Optional Interactive Checkout Card in Chat */}
                  {msg.checkoutCard && (
                    <div className="p-3.5 bg-[#0E1311] border border-[#286D58] rounded-xl space-y-2.5 text-left shadow-md">
                      <span className="text-[10px] uppercase text-[#10B981] font-bold block">
                        Verified Hardware Package
                      </span>
                      <strong className="text-white text-xs block">{msg.checkoutCard.title}</strong>
                      <p className="text-[10px] text-[#9EADA5]">{msg.checkoutCard.specs}</p>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-[#1B2420]">
                        <span className="text-sm font-bold text-[#D97706]">
                          R {msg.checkoutCard.priceZAR.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleInstantChatPay(msg.checkoutCard!)}
                          className="px-3 py-1.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-bold text-[10px] uppercase rounded flex items-center gap-1 transition-colors"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Pay in Chat</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Optional Quick Action Buttons */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={opt.action}
                          className="px-2.5 py-1 bg-[#0E1311] hover:bg-[#1B2420] border border-[#24302A] hover:border-[#286D58] text-white text-[10px] rounded-lg transition-colors text-left"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-[#6B7B73] block px-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-[11px] text-[#9EADA5] font-mono pl-8">
                <span className="w-1.5 h-1.5 bg-[#286D58] rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#286D58] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-[#286D58] rounded-full animate-bounce [animation-delay:0.4s]" />
                <span>Kinetix assistant is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#141A17] border-t border-[#24302A] flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask a question or request payment..."
              className="flex-1 bg-[#0E1311] border border-[#24302A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#6B7B73] focus:border-[#286D58]"
            />
            <button
              type="submit"
              className="p-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white rounded-xl transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
