import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Wrench, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  CreditCard, 
  DollarSign, 
  Building2, 
  Lock, 
  Download,
  Zap,
  ArrowLeft,
  Calendar,
  Sparkles,
  Smartphone,
  Check,
  HelpCircle,
  Truck
} from 'lucide-react';

export interface CartDrawerProps {
  onNavigate?: (route: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    toggleInstallation,
    clearCart,
    totalEquipmentZAR,
    totalInstallationZAR,
    totalCartZAR,
    totalItemsCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const { createOrder } = useData();
  const { currentUser, isAuthenticated } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'processing' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'payflex' | 'instant_eft' | 'deposit'>('card');
  const [selectedBank, setSelectedBank] = useState<string>('Capitec Pay');
  const [paymentRef, setPaymentRef] = useState<string>('');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('4532 8821 9012 3456');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Johan Van Wyk');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('882');

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    city: currentUser?.city || 'Johannesburg',
    address: currentUser?.address || '',
    propertyType: 'Residential Home',
    roofType: 'Tile Roof',
    notes: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        city: currentUser.city || prev.city,
        address: currentUser.address || prev.address
      }));
      if (currentUser.name) {
        setCardHolder(currentUser.name);
      }
    }
  }, [currentUser]);

  if (!isCartOpen) return null;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('payment');
  };

  const vatZAR = Math.round((totalCartZAR * 0.15) * 100) / 100;
  const finalTotalZAR = Math.round((totalCartZAR + vatZAR) * 100) / 100;
  const payflexInstallment = Math.round((finalTotalZAR / 4) * 100) / 100;

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('processing');

    const orderItems = items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      brand: item.product.brand,
      sku: item.product.sku,
      image: item.product.image,
      quantity: item.quantity,
      unitPriceZAR: item.product.priceZAR,
      includeInstallation: item.includeInstallation,
      installationPriceZAR: item.includeInstallation && item.product.installationPriceZAR ? item.product.installationPriceZAR : 0
    }));

    const generatedOrderId = createOrder({
      userId: currentUser?.id,
      customerName: formData.name || currentUser?.name || 'Valued Client',
      customerEmail: formData.email || currentUser?.email || 'client@kinetixenergy.co.za',
      customerPhone: formData.phone || '+27 82 000 0000',
      shippingAddress: formData.address || 'Standard Delivery Address',
      city: formData.city || 'Johannesburg',
      propertyType: formData.propertyType,
      roofType: formData.roofType,
      notes: formData.notes,
      items: orderItems,
      equipmentSubtotalZAR: totalEquipmentZAR,
      installationSubtotalZAR: totalInstallationZAR,
      vatZAR: vatZAR,
      totalCartZAR: finalTotalZAR,
      paymentMethod: paymentMethod,
      selectedBank: paymentMethod === 'instant_eft' ? selectedBank : undefined,
      paymentStatus: 'completed'
    });

    setPaymentRef(generatedOrderId);

    setTimeout(() => {
      setCheckoutStep('success');
      clearCart();
    }, 1800);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => setCheckoutStep('cart'), 300);
  };

  // Detect card brand based on card number digits
  const isVisa = cardNumber.replace(/\s/g, '').startsWith('4');
  const isMastercard = cardNumber.replace(/\s/g, '').startsWith('5') || cardNumber.replace(/\s/g, '').startsWith('2');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xl bg-[#0E1311] border-l border-[#24302A] text-[#E6ECE8] flex flex-col shadow-2xl">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#24302A] flex items-center justify-between bg-[#141A17]">
            <div className="flex items-center gap-2">
              {checkoutStep !== 'cart' && checkoutStep !== 'success' && checkoutStep !== 'processing' && (
                <button
                  onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'shipping' : 'cart')}
                  className="p-1 text-[#9EADA5] hover:text-white rounded mr-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h2 className="text-base font-extrabold uppercase tracking-tight text-white flex items-center gap-2 font-mono">
                {checkoutStep === 'cart' && `Shopping Cart (${totalItemsCount})`}
                {checkoutStep === 'shipping' && 'Delivery & Property Details'}
                {checkoutStep === 'payment' && 'Secure Checkout & Payment'}
                {checkoutStep === 'processing' && 'Processing Transaction'}
                {checkoutStep === 'success' && 'Order Confirmed'}
              </h2>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 text-[#9EADA5] hover:text-white rounded-lg hover:bg-[#1B2420] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* STEP 1: CART ITEMS */}
            {checkoutStep === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#141A17] border border-[#24302A] flex items-center justify-center mx-auto text-[#6B7B73]">
                      ⚡
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white uppercase">Your cart is empty</h3>
                      <p className="text-xs text-[#9EADA5]">Explore our engineered solar kits, inverters, and battery towers.</p>
                    </div>
                    <button
                      onClick={() => {
                        handleClose();
                        onNavigate?.('shop');
                      }}
                      className="px-5 py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white text-xs font-mono font-bold uppercase rounded-xl transition-colors"
                    >
                      Browse Equipment Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <div
                        key={item.product.id}
                        className="p-4 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-3 shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-xl border border-[#24302A] bg-[#0E1311] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-mono text-[#6B7B73] uppercase block">{item.product.brand}</span>
                                <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-[#6B7B73] hover:text-red-400 p-1 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center border border-[#24302A] rounded-lg bg-[#0E1311] overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="px-2.5 py-1 hover:bg-[#1B2420] text-[#9EADA5] hover:text-white"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 py-1 text-xs font-mono font-bold text-white">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="px-2.5 py-1 hover:bg-[#1B2420] text-[#9EADA5] hover:text-white"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="text-right">
                                <span className="text-xs font-mono font-bold text-white">
                                  R {(item.product.priceZAR * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Optional Installation Checkbox */}
                        {item.product.installationAvailable && item.product.installationPriceZAR && (
                          <div className="pt-2 border-t border-[#24302A] flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.includeInstallation}
                                onChange={() => toggleInstallation(item.product.id)}
                                className="rounded bg-[#0E1311] border-[#24302A] text-[#10B981] focus:ring-0"
                              />
                              <span className="text-[#9EADA5] flex items-center gap-1 text-[11px] font-mono">
                                <Wrench className="w-3 h-3 text-[#10B981]" /> Add SANS 10142 CoC Installation
                              </span>
                            </label>
                            <span className="text-[11px] font-mono text-[#10B981] font-bold">
                              + R {(item.product.installationPriceZAR * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: SHIPPING & SITE DETAILS */}
            {checkoutStep === 'shipping' && (
              <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs font-mono">
                <div className="p-3.5 bg-[#141A17] border border-[#24302A] rounded-xl text-[#9EADA5] leading-relaxed text-[11px] flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Freight dispatched via RAM Specialized Logistics with real-time GPS tracking.</span>
                </div>

                <div>
                  <label className="block uppercase text-[#9EADA5] text-[10px] mb-1 font-bold">Full Name / Business Entity *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Johan Van Wyk"
                    className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-[#9EADA5] text-[10px] mb-1 font-bold">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="client@domain.co.za"
                      className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-[#9EADA5] text-[10px] mb-1 font-bold">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+27 82 000 0000"
                      className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-[#9EADA5] text-[10px] mb-1 font-bold">City / Municipality *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-[#9EADA5] text-[10px] mb-1 font-bold">Roof Structure</label>
                    <select
                      value={formData.roofType}
                      onChange={e => setFormData({ ...formData, roofType: e.target.value })}
                      className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-white"
                    >
                      <option>Tile Roof (Concrete/Slate)</option>
                      <option>Corrugated Iron / IBR</option>
                      <option>Klip-Lok Standing Seam</option>
                      <option>Concrete Flat Slab</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block uppercase text-[#9EADA5] text-[10px] mb-1 font-bold">Delivery Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. 14 Protea Avenue, Bryanston"
                    className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] text-black font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg"
                >
                  <span>Continue to Secure Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 3: PAYMENT METHODS & LOGOS OVERHAUL */}
            {checkoutStep === 'payment' && (
              <form onSubmit={handleExecutePayment} className="space-y-6 text-xs font-mono">
                
                {/* 1. Official Payment Logos Strip */}
                <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9EADA5]">
                      Supported Payment Gateways
                    </span>
                    <span className="text-[9px] bg-[#1B4D3E] text-[#10B981] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> 256-Bit SSL Encrypted
                    </span>
                  </div>

                  {/* High Quality Logo Showcase */}
                  <div className="grid grid-cols-4 gap-2.5 pt-1">
                    <div className="bg-white/95 rounded-xl p-2.5 flex items-center justify-center h-12 shadow-sm border border-white/20">
                      <img src="/payment-visa.png" alt="Visa" className="h-6 object-contain" />
                    </div>
                    <div className="bg-white/95 rounded-xl p-2.5 flex items-center justify-center h-12 shadow-sm border border-white/20">
                      <img src="/payment-mastercard.png" alt="MasterCard" className="h-7 object-contain" />
                    </div>
                    <div className="bg-white/95 rounded-xl p-2.5 flex items-center justify-center h-12 shadow-sm border border-white/20">
                      <img src="/payment-applepay.png" alt="Apple Pay" className="h-7 object-contain" />
                    </div>
                    <div className="bg-[#BFA4F8] rounded-xl p-2.5 flex items-center justify-center h-12 shadow-sm border border-purple-300">
                      <img src="/payment-payflex.png" alt="Payflex" className="h-6 object-contain" />
                    </div>
                  </div>
                </div>

                {/* 2. Interactive Payment Method Selectors */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-[#6B7B73] block">
                    Choose Payment Channel
                  </span>

                  {/* OPTION 1: Credit & Debit Card (Visa / MasterCard) */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      paymentMethod === 'card'
                        ? 'bg-[#1B4D3E]/25 border-[#10B981] ring-1 ring-[#10B981]'
                        : 'bg-[#141A17] border-[#24302A] hover:border-[#31423A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_opt"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="text-[#10B981] focus:ring-0"
                        />
                        <div>
                          <strong className="text-white text-xs block">Credit or Debit Card</strong>
                          <span className="text-[10px] text-[#9EADA5]">Visa & MasterCard 3D Secure 2.0</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="bg-white rounded px-1.5 py-0.5">
                          <img src="/payment-visa.png" alt="Visa" className="h-3.5 object-contain" />
                        </div>
                        <div className="bg-white rounded px-1.5 py-0.5">
                          <img src="/payment-mastercard.png" alt="MasterCard" className="h-3.5 object-contain" />
                        </div>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="pt-3 border-t border-[#24302A] space-y-3 animate-in fade-in zoom-in-95">
                        {/* Interactive Dark Card Preview */}
                        <div className="p-4 rounded-xl bg-gradient-to-tr from-[#0E1311] via-[#1B2420] to-[#24302A] border border-[#31423A] shadow-xl relative overflow-hidden space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-[#10B981] font-bold tracking-widest uppercase">
                              Kinetix Secure Pay
                            </span>
                            <div className="h-6 bg-white rounded px-2 py-0.5 flex items-center">
                              {isVisa ? (
                                <img src="/payment-visa.png" alt="Visa" className="h-3.5" />
                              ) : isMastercard ? (
                                <img src="/payment-mastercard.png" alt="MasterCard" className="h-4" />
                              ) : (
                                <CreditCard className="w-4 h-4 text-black" />
                              )}
                            </div>
                          </div>

                          <div className="text-sm font-mono tracking-widest text-white font-bold py-1">
                            {cardNumber || '•••• •••• •••• ••••'}
                          </div>

                          <div className="flex justify-between text-[10px] text-[#9EADA5]">
                            <div>
                              <span className="block text-[8px] text-[#6B7B73] uppercase">Cardholder</span>
                              <strong className="text-white uppercase">{cardHolder || 'NAME ON CARD'}</strong>
                            </div>
                            <div className="text-right">
                              <span className="block text-[8px] text-[#6B7B73] uppercase">Expires</span>
                              <strong className="text-white">{cardExpiry || 'MM/YY'}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Card Inputs */}
                        <div className="space-y-2.5">
                          <div>
                            <label className="block text-[10px] text-[#9EADA5] uppercase mb-1">Card Number *</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={e => setCardNumber(e.target.value)}
                              placeholder="4532 0000 0000 0000"
                              className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-[#9EADA5] uppercase mb-1">Expiry Date *</label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={e => setCardExpiry(e.target.value)}
                                placeholder="MM/YY"
                                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-[#9EADA5] uppercase mb-1">CVV / CVC *</label>
                              <input
                                type="password"
                                maxLength={4}
                                value={cardCvv}
                                onChange={e => setCardCvv(e.target.value)}
                                placeholder="•••"
                                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OPTION 2: Apple Pay */}
                  <div
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      paymentMethod === 'applepay'
                        ? 'bg-[#1B4D3E]/25 border-[#10B981] ring-1 ring-[#10B981]'
                        : 'bg-[#141A17] border-[#24302A] hover:border-[#31423A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_opt"
                          checked={paymentMethod === 'applepay'}
                          onChange={() => setPaymentMethod('applepay')}
                          className="text-[#10B981] focus:ring-0"
                        />
                        <div>
                          <strong className="text-white text-xs block">Apple Pay</strong>
                          <span className="text-[10px] text-[#9EADA5]">1-Touch Touch ID / Face ID Biometric Pay</span>
                        </div>
                      </div>

                      <div className="bg-white rounded px-2 py-0.5">
                        <img src="/payment-applepay.png" alt="Apple Pay" className="h-4 object-contain" />
                      </div>
                    </div>

                    {paymentMethod === 'applepay' && (
                      <div className="pt-3 border-t border-[#24302A] space-y-2 text-[11px] text-[#9EADA5] animate-in fade-in">
                        <div className="p-3 bg-black/60 border border-[#24302A] rounded-xl flex items-center justify-center gap-2 text-white font-bold">
                          <Smartphone className="w-4 h-4 text-[#10B981]" />
                          <span>Apple Pay Device Ready • Instant Authorisation</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OPTION 3: Payflex (Pay in 4 Interest-Free) */}
                  <div
                    onClick={() => setPaymentMethod('payflex')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      paymentMethod === 'payflex'
                        ? 'bg-[#1B4D3E]/25 border-[#10B981] ring-1 ring-[#10B981]'
                        : 'bg-[#141A17] border-[#24302A] hover:border-[#31423A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_opt"
                          checked={paymentMethod === 'payflex'}
                          onChange={() => setPaymentMethod('payflex')}
                          className="text-[#10B981] focus:ring-0"
                        />
                        <div>
                          <strong className="text-white text-xs block">Payflex — Pay in 4</strong>
                          <span className="text-[10px] text-[#9EADA5]">4x Equal Installments • 0% Interest</span>
                        </div>
                      </div>

                      <div className="bg-[#BFA4F8] rounded px-2 py-0.5">
                        <img src="/payment-payflex.png" alt="Payflex" className="h-4 object-contain" />
                      </div>
                    </div>

                    {paymentMethod === 'payflex' && (
                      <div className="pt-3 border-t border-[#24302A] space-y-3 animate-in fade-in">
                        <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">
                          Your 4-Installment Schedule (0% Interest):
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                          <div className="p-2.5 bg-[#0E1311] border border-[#10B981] rounded-xl space-y-1">
                            <span className="text-[9px] text-[#10B981] font-bold block">1. Today</span>
                            <strong className="text-white block">R {payflexInstallment.toLocaleString()}</strong>
                          </div>
                          <div className="p-2.5 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-1">
                            <span className="text-[9px] text-[#9EADA5] block">2. In 2 Weeks</span>
                            <strong className="text-white block">R {payflexInstallment.toLocaleString()}</strong>
                          </div>
                          <div className="p-2.5 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-1">
                            <span className="text-[9px] text-[#9EADA5] block">3. In 4 Weeks</span>
                            <strong className="text-white block">R {payflexInstallment.toLocaleString()}</strong>
                          </div>
                          <div className="p-2.5 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-1">
                            <span className="text-[9px] text-[#9EADA5] block">4. In 6 Weeks</span>
                            <strong className="text-white block">R {payflexInstallment.toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OPTION 4: Instant EFT */}
                  <div
                    onClick={() => setPaymentMethod('instant_eft')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      paymentMethod === 'instant_eft'
                        ? 'bg-[#1B4D3E]/25 border-[#10B981] ring-1 ring-[#10B981]'
                        : 'bg-[#141A17] border-[#24302A] hover:border-[#31423A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_opt"
                          checked={paymentMethod === 'instant_eft'}
                          onChange={() => setPaymentMethod('instant_eft')}
                          className="text-[#10B981] focus:ring-0"
                        />
                        <div>
                          <strong className="text-white text-xs block">⚡ Instant EFT / Capitec Pay</strong>
                          <span className="text-[10px] text-[#9EADA5]">Direct clearance across all SA major banks</span>
                        </div>
                      </div>

                      <span className="text-[9px] bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded font-bold">
                        Zero Surcharge
                      </span>
                    </div>

                    {paymentMethod === 'instant_eft' && (
                      <div className="pt-3 border-t border-[#24302A] space-y-2">
                        <label className="block text-[10px] text-[#9EADA5] uppercase">Select Banking Institution</label>
                        <select
                          value={selectedBank}
                          onChange={e => setSelectedBank(e.target.value)}
                          className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white text-xs font-mono"
                        >
                          <option>Capitec Pay (Instant QR & App Authorisation)</option>
                          <option>Standard Bank Instant EFT</option>
                          <option>FNB / RMB Pay & Clear</option>
                          <option>Nedbank Direct EFT</option>
                          <option>Absa Online Banking</option>
                          <option>Investec Private Bank</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* OPTION 5: 70/30 Milestone Contractor Deposit */}
                  <div
                    onClick={() => setPaymentMethod('deposit')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      paymentMethod === 'deposit'
                        ? 'bg-[#1B4D3E]/25 border-[#10B981] ring-1 ring-[#10B981]'
                        : 'bg-[#141A17] border-[#24302A] hover:border-[#31423A]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_opt"
                        checked={paymentMethod === 'deposit'}
                        onChange={() => setPaymentMethod('deposit')}
                        className="text-[#10B981] focus:ring-0"
                      />
                      <div>
                        <strong className="text-white text-xs block">🏦 70% Initial Deposit & 30% on CoC Sign-Off</strong>
                        <span className="text-[10px] text-[#9EADA5]">Standard engineering terms for full turnkey installations</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary Breakdown */}
                <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between text-[#9EADA5]">
                    <span>Hardware Subtotal:</span>
                    <span className="text-white font-bold">R {totalEquipmentZAR.toLocaleString()}</span>
                  </div>

                  {totalInstallationZAR > 0 && (
                    <div className="flex justify-between text-[#9EADA5]">
                      <span>Turnkey Installation:</span>
                      <span className="text-[#10B981] font-bold">+ R {totalInstallationZAR.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#9EADA5]">
                    <span>VAT (15% SARS Compliant):</span>
                    <span className="text-white font-bold">R {vatZAR.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-white font-extrabold text-sm pt-2.5 border-t border-[#24302A]">
                    <span>Total Amount (ZAR):</span>
                    <span className="text-[#10B981] font-bold text-base">
                      {paymentMethod === 'deposit' 
                        ? `R ${Math.round(finalTotalZAR * 0.7).toLocaleString()} (70% Deposit)`
                        : paymentMethod === 'payflex'
                        ? `R ${payflexInstallment.toLocaleString()} (1st of 4)`
                        : `R ${finalTotalZAR.toLocaleString()}`
                      }
                    </span>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#10B981] hover:bg-[#059669] text-black font-extrabold uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl text-xs tracking-wider"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'applepay' && `Pay with Apple Pay (R ${finalTotalZAR.toLocaleString()})`}
                    {paymentMethod === 'payflex' && `Authorise 1st Installment (R ${payflexInstallment.toLocaleString()})`}
                    {paymentMethod === 'deposit' && `Pay 70% Deposit (R ${Math.round(finalTotalZAR * 0.7).toLocaleString()})`}
                    {paymentMethod === 'card' && `Pay R ${finalTotalZAR.toLocaleString()} with Card`}
                    {paymentMethod === 'instant_eft' && `Pay R ${finalTotalZAR.toLocaleString()} via Instant EFT`}
                  </span>
                </button>
              </form>
            )}

            {/* STEP 4: PROCESSING SIMULATION */}
            {checkoutStep === 'processing' && (
              <div className="text-center py-20 space-y-4 font-mono">
                <div className="w-14 h-14 rounded-full border-4 border-[#10B981] border-t-transparent animate-spin mx-auto" />
                <h3 className="text-base font-bold text-white uppercase">Securing South African Gateway Payment...</h3>
                <p className="text-xs text-[#9EADA5]">Communicating with 3D Secure / SARB clearing switch. Please do not refresh.</p>
              </div>
            )}

            {/* STEP 5: SUCCESS RECEIPT */}
            {checkoutStep === 'success' && (
              <div className="text-center py-8 space-y-5 font-mono">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-[#10B981] font-bold">Payment Verified & Settled</span>
                  <h3 className="text-xl font-extrabold text-white uppercase">Official Order Confirmed</h3>
                  <p className="text-xs text-[#9EADA5]">
                    Order Tracking Ref: <strong className="text-white font-bold">{paymentRef}</strong>
                  </p>
                </div>

                <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl text-left text-xs space-y-2 text-[#9EADA5]">
                  <div className="flex justify-between">
                    <span>Client Name:</span>
                    <strong className="text-white">{formData.name || 'Valued Client'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Channel:</span>
                    <strong className="text-white uppercase">{paymentMethod.replace('_', ' ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Project Tracker ID:</span>
                    <strong className="text-[#10B981] font-mono font-bold">{paymentRef}</strong>
                  </div>
                  <div className="flex justify-between border-t border-[#1B2420] pt-1">
                    <span>Status:</span>
                    <strong className="text-[#D97706]">Awaiting Technical Dispatch Approval</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => alert(`Downloading SARS Tax Invoice for Order ${paymentRef}...`)}
                    className="p-3 bg-[#141A17] hover:bg-[#1B2420] border border-[#24302A] text-white rounded-xl text-xs uppercase flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Tax Invoice PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      handleClose();
                      onNavigate?.('portal');
                    }}
                    className="p-3 bg-[#10B981] hover:bg-[#059669] text-black rounded-xl text-xs uppercase font-bold"
                  >
                    View in Customer Portal
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Cart Footer */}
          {checkoutStep === 'cart' && items.length > 0 && (
            <div className="p-5 border-t border-[#24302A] bg-[#141A17] space-y-4 font-mono">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#9EADA5]">
                  <span>Equipment Subtotal:</span>
                  <span className="text-white font-bold">R {totalEquipmentZAR.toLocaleString()}</span>
                </div>
                {totalInstallationZAR > 0 && (
                  <div className="flex justify-between text-[#9EADA5]">
                    <span>Turnkey Installation:</span>
                    <span className="text-[#10B981] font-bold">+ R {totalInstallationZAR.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#9EADA5]">
                  <span>Estimated 15% VAT:</span>
                  <span className="text-white font-bold">R {vatZAR.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-[#24302A]">
                  <span>Estimated Total:</span>
                  <span className="text-[#10B981] font-bold text-base">R {finalTotalZAR.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep('shipping')}
                className="w-full py-4 bg-[#10B981] hover:bg-[#059669] text-black font-extrabold uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl text-xs tracking-wider"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
