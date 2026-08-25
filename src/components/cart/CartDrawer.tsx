import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
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
  ArrowLeft
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
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

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'processing' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'instant_eft' | 'card' | 'finance' | 'deposit'>('instant_eft');
  const [selectedBank, setSelectedBank] = useState<string>('Capitec Pay');
  const [paymentRef, setPaymentRef] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Johannesburg',
    address: '',
    propertyType: 'Residential Home',
    roofType: 'Tile Roof',
    notes: '',
  });

  if (!isCartOpen) return null;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('payment');
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('processing');
    const generatedRef = `KX-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    setPaymentRef(generatedRef);

    setTimeout(() => {
      setCheckoutStep('success');
    }, 1800);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => setCheckoutStep('cart'), 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#0E1311] border-l border-[#24302A] text-[#E6ECE8] flex flex-col shadow-2xl">
          
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
              <h2 className="text-base font-extrabold tracking-tight text-white uppercase">
                {checkoutStep === 'cart' && `Hardware Cart (${totalItemsCount})`}
                {checkoutStep === 'shipping' && 'Delivery & Site Details'}
                {checkoutStep === 'payment' && 'Select Payment Method'}
                {checkoutStep === 'processing' && 'Securing Transaction...'}
                {checkoutStep === 'success' && 'Order & Payment Confirmed'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 text-[#9EADA5] hover:text-white rounded border border-transparent hover:border-[#24302A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 font-mono">
            
            {/* STEP 1: CART ITEMS */}
            {checkoutStep === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#141A17] border border-[#24302A] flex items-center justify-center mx-auto text-[#6B7B73]">
                      <Wrench className="w-7 h-7" />
                    </div>
                    <p className="text-sm text-[#9EADA5]">Your equipment cart is currently empty.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#286D58] hover:underline"
                    >
                      Browse Solar Hardware Store <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <div
                        key={item.product.id}
                        className="p-3.5 bg-[#141A17] border border-[#24302A] rounded-xl space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg bg-[#0E1311] border border-[#24302A] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] uppercase text-[#6B7B73] block">
                              {item.product.brand} • SKU: {item.product.sku}
                            </span>
                            <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                              {item.product.name}
                            </h4>
                            <div className="mt-1.5 flex items-center justify-between">
                              <span className="text-xs font-bold text-[#D97706]">
                                R {item.product.priceZAR.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-1.5 border border-[#24302A] rounded bg-[#0E1311] px-1 py-0.5">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-0.5 text-[#9EADA5] hover:text-white"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs px-1.5 font-bold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-0.5 text-[#9EADA5] hover:text-white"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-[#6B7B73] hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Turnkey SANS 10142 Installation Addon */}
                        {item.product.installationAvailable && item.product.installationPriceZAR && (
                          <div className="pt-2 border-t border-[#1B2420] flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={item.includeInstallation}
                                onChange={() => toggleInstallation(item.product.id)}
                                className="rounded bg-[#0E1311] border-[#24302A] text-[#1B4D3E] focus:ring-0"
                              />
                              <span className="text-[#9EADA5] flex items-center gap-1 text-[11px]">
                                <Wrench className="w-3 h-3 text-[#286D58]" /> Turnkey SANS 10142 CoC Installation
                              </span>
                            </label>
                            <span className="text-[11px] text-[#10B981] font-bold">
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
              <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs">
                <div className="p-3 bg-[#141A17] border border-[#24302A] rounded-xl text-[#9EADA5] leading-relaxed text-[11px]">
                  Please specify delivery and property structural details for freight dispatch and technician allocation.
                </div>

                <div>
                  <label className="block uppercase text-[#9EADA5] mb-1">Full Name / Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Johan Van Wyk"
                    className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3 py-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-[#9EADA5] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="johan@domain.co.za"
                      className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-[#9EADA5] mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+27 82 000 0000"
                      className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3 py-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-[#9EADA5] mb-1">City / Region *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-[#9EADA5] mb-1">Roof Structure</label>
                    <select
                      value={formData.roofType}
                      onChange={e => setFormData({ ...formData, roofType: e.target.value })}
                      className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3 py-2.5 text-white"
                    >
                      <option>Tile Roof (Concrete/Slate)</option>
                      <option>Corrugated Iron / IBR</option>
                      <option>Klip-Lok Standing Seam</option>
                      <option>Concrete Flat Slab</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block uppercase text-[#9EADA5] mb-1">Street Address for Delivery / Installation *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. 14 Protea Avenue, Bryanston"
                    className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3 py-2.5 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-bold uppercase rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <span>Continue to Payment Options</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 3: PAYMENT METHODS */}
            {checkoutStep === 'payment' && (
              <form onSubmit={handleExecutePayment} className="space-y-5 text-xs">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase text-[#6B7B73] block">Select South African Payment Method</span>
                  
                  {/* Option 1: Instant EFT */}
                  <label
                    onClick={() => setPaymentMethod('instant_eft')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'instant_eft'
                        ? 'bg-[#1B4D3E]/30 border-[#10B981] text-white ring-1 ring-[#10B981]'
                        : 'bg-[#141A17] border-[#24302A] text-[#9EADA5] hover:border-[#31423A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'instant_eft'}
                      onChange={() => setPaymentMethod('instant_eft')}
                      className="mt-0.5 text-[#1B4D3E]"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white">⚡ Instant EFT (Ozow / Capitec Pay / SiD)</strong>
                        <span className="text-[9px] bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded font-bold">Zero Surcharge</span>
                      </div>
                      <p className="text-[10px] text-[#9EADA5]">Instant clearing from Capitec, Standard Bank, FNB, Nedbank, Absa & Investec.</p>
                      
                      {paymentMethod === 'instant_eft' && (
                        <div className="pt-2">
                          <select
                            value={selectedBank}
                            onChange={e => setSelectedBank(e.target.value)}
                            className="w-full bg-[#0E1311] border border-[#24302A] rounded px-2.5 py-1.5 text-[11px] text-white"
                          >
                            <option>Capitec Pay (Instant QR & Notification)</option>
                            <option>Standard Bank Instant EFT</option>
                            <option>FNB / RMB Pay & Clear</option>
                            <option>Nedbank Direct EFT</option>
                            <option>Absa Online Banking</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 2: Credit / Debit Card */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#1B4D3E]/30 border-[#10B981] text-white ring-1 ring-[#10B981]'
                        : 'bg-[#141A17] border-[#24302A] text-[#9EADA5] hover:border-[#31423A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-0.5 text-[#1B4D3E]"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white">💳 Credit & Debit Card (Visa / Mastercard)</strong>
                        <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                      </div>
                      <p className="text-[10px] text-[#9EADA5]">3D Secure 2.0 encrypted checkout powered by South African gateway.</p>
                    </div>
                  </label>

                  {/* Option 3: 70/30 Milestone Deposit */}
                  <label
                    onClick={() => setPaymentMethod('deposit')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'deposit'
                        ? 'bg-[#1B4D3E]/30 border-[#10B981] text-white ring-1 ring-[#10B981]'
                        : 'bg-[#141A17] border-[#24302A] text-[#9EADA5] hover:border-[#31423A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'deposit'}
                      onChange={() => setPaymentMethod('deposit')}
                      className="mt-0.5 text-[#1B4D3E]"
                    />
                    <div className="flex-1 space-y-1">
                      <strong className="text-white">🏦 70% Initial Deposit & 30% on CoC Handover</strong>
                      <p className="text-[10px] text-[#9EADA5]">Standard commercial contractor terms for turnkey residential & industrial projects.</p>
                    </div>
                  </label>

                  {/* Option 4: Asset Finance */}
                  <label
                    onClick={() => setPaymentMethod('finance')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'finance'
                        ? 'bg-[#1B4D3E]/30 border-[#10B981] text-white ring-1 ring-[#10B981]'
                        : 'bg-[#141A17] border-[#24302A] text-[#9EADA5] hover:border-[#31423A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'finance'}
                      onChange={() => setPaymentMethod('finance')}
                      className="mt-0.5 text-[#1B4D3E]"
                    />
                    <div className="flex-1 space-y-1">
                      <strong className="text-white">📈 Solar Asset Financing (12 - 60 Months)</strong>
                      <p className="text-[10px] text-[#9EADA5]">Monthly repayments offset by Eskom electricity savings.</p>
                    </div>
                  </label>
                </div>

                <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl space-y-2 text-xs">
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
                  <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-[#24302A]">
                    <span>Total Payable (Excl. VAT):</span>
                    <span className="text-[#D97706] font-bold">
                      {paymentMethod === 'deposit' 
                        ? `R ${Math.round(totalCartZAR * 0.7).toLocaleString()} (70% Deposit)`
                        : `R ${totalCartZAR.toLocaleString()}`
                      }
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-bold uppercase rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Lock className="w-4 h-4 text-[#10B981]" />
                  <span>
                    {paymentMethod === 'deposit' 
                      ? `Pay 70% Deposit (R ${Math.round(totalCartZAR * 0.7).toLocaleString()})`
                      : `Complete Payment (R ${totalCartZAR.toLocaleString()})`
                    }
                  </span>
                </button>
              </form>
            )}

            {/* STEP 4: PROCESSING SIMULATION */}
            {checkoutStep === 'processing' && (
              <div className="text-center py-20 space-y-4">
                <div className="w-14 h-14 rounded-full border-4 border-[#286D58] border-t-transparent animate-spin mx-auto" />
                <h3 className="text-base font-bold text-white uppercase">Securing South African Gateway Payment...</h3>
                <p className="text-xs text-[#9EADA5]">Communicating with bank clearing protocol. Please do not close this window.</p>
              </div>
            )}

            {/* STEP 5: SUCCESS RECEIPT */}
            {checkoutStep === 'success' && (
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-[#10B981] font-bold">Payment Cleared Successfully</span>
                  <h3 className="text-xl font-extrabold text-white uppercase">Official Order Logged</h3>
                  <p className="text-xs text-[#9EADA5]">
                    Payment Reference: <strong className="text-white font-bold">{paymentRef}</strong>
                  </p>
                </div>

                <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl text-left text-xs space-y-2 text-[#9EADA5]">
                  <div className="flex justify-between">
                    <span>Client Name:</span>
                    <strong className="text-white">{formData.name || 'Valued Client'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <strong className="text-white uppercase">{paymentMethod.replace('_', ' ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Project Tracker ID:</span>
                    <strong className="text-[#D97706]">KX-9042</strong>
                  </div>
                  <div className="flex justify-between border-t border-[#1B2420] pt-1">
                    <span>Installation Timeline:</span>
                    <strong className="text-[#10B981]">Electrician Site Survey Scheduled</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => alert(`Downloading Official Tax Invoice ${paymentRef}.pdf`)}
                    className="p-3 bg-[#141A17] hover:bg-[#1B2420] border border-[#24302A] text-white rounded-xl text-xs uppercase flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#286D58]" />
                    <span>Tax Invoice PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      clearCart();
                      handleClose();
                    }}
                    className="p-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white rounded-xl text-xs uppercase font-bold"
                  >
                    Return to Portal
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Drawer Footer */}
          {checkoutStep === 'cart' && items.length > 0 && (
            <div className="p-5 border-t border-[#24302A] bg-[#141A17] space-y-3 font-mono">
              <div className="space-y-1.5 text-xs">
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
                <div className="pt-2 border-t border-[#24302A] flex justify-between text-sm font-bold text-white">
                  <span>Total (Excl. VAT):</span>
                  <span className="text-[#D97706]">R {totalCartZAR.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => clearCart()}
                  className="px-3 py-3 border border-[#24302A] hover:border-red-500/50 text-[#9EADA5] hover:text-red-400 text-xs rounded-xl transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setCheckoutStep('shipping')}
                  className="flex-1 py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors text-center shadow-lg"
                >
                  Proceed to Payment Options
                </button>
              </div>

              <p className="text-[10px] text-[#6B7B73] text-center">
                Instant EFT • Visa / Mastercard • 60-Month Asset Financing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
