import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, Wrench, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

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

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    propertyType: 'Residential',
    notes: '',
  });

  if (!isCartOpen) return null;

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('success');
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => setCheckoutStep('cart'), 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0E1311] border-l border-[#24302A] text-[#E6ECE8] flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#24302A] flex items-center justify-between bg-[#141A17]">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight text-white uppercase">
                {checkoutStep === 'cart' && `Equipment Cart (${totalItemsCount})`}
                {checkoutStep === 'checkout' && 'Request Official Quote'}
                {checkoutStep === 'success' && 'Quotation Request Sent'}
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
          <div className="flex-1 overflow-y-auto p-5">
            {checkoutStep === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 rounded bg-[#141A17] border border-[#24302A] flex items-center justify-center mx-auto mb-3 text-[#6B7B73]">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-[#9EADA5]">Your equipment cart is currently empty.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#286D58] hover:underline"
                    >
                      Browse Equipment Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <div
                        key={item.product.id}
                        className="p-3.5 bg-[#141A17] border border-[#24302A] rounded-md space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded bg-[#0E1311] border border-[#24302A] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono uppercase text-[#6B7B73] block">
                              {item.product.brand} • SKU: {item.product.sku}
                            </span>
                            <h4 className="text-xs font-medium text-white line-clamp-2 leading-snug">
                              {item.product.name}
                            </h4>
                            <div className="mt-1.5 flex items-center justify-between">
                              <span className="text-xs font-mono font-semibold text-[#E6ECE8]">
                                R {item.product.priceZAR.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-1.5 border border-[#24302A] rounded bg-[#0E1311] px-1 py-0.5">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-0.5 text-[#9EADA5] hover:text-white"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-mono px-1.5 font-semibold">
                                  {item.quantity}
                                </span>
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

                        {/* Installation Addon Option */}
                        {item.product.installationAvailable && item.product.installationPriceZAR && (
                          <div className="pt-2 border-t border-[#1B2420] flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={item.includeInstallation}
                                onChange={() => toggleInstallation(item.product.id)}
                                className="rounded bg-[#0E1311] border-[#24302A] text-[#1B4D3E] focus:ring-0"
                              />
                              <span className="text-[#9EADA5] flex items-center gap-1">
                                <Wrench className="w-3 h-3 text-[#286D58]" /> Add Certified Installation
                              </span>
                            </label>
                            <span className="font-mono text-[11px] text-[#9EADA5]">
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

            {checkoutStep === 'checkout' && (
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div className="p-3 bg-[#141A17] border border-[#24302A] rounded text-xs text-[#9EADA5] leading-relaxed">
                  Submit your details to receive an itemized commercial quotation including equipment availability, freight logistics, and optional installation scheduling.
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#141A17] border border-[#24302A] rounded px-3 py-2 text-sm text-white focus:border-[#286D58]"
                    placeholder="e.g. Johan van der Merwe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#141A17] border border-[#24302A] rounded px-3 py-2 text-sm text-white focus:border-[#286D58]"
                      placeholder="client@domain.co.za"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#141A17] border border-[#24302A] rounded px-3 py-2 text-sm text-white focus:border-[#286D58]"
                      placeholder="+27 82 000 0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">City / Region *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#141A17] border border-[#24302A] rounded px-3 py-2 text-sm text-white focus:border-[#286D58]"
                      placeholder="e.g. Johannesburg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Property Type</label>
                    <select
                      value={formData.propertyType}
                      onChange={e => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full bg-[#141A17] border border-[#24302A] rounded px-3 py-2 text-sm text-white focus:border-[#286D58]"
                    >
                      <option>Residential</option>
                      <option>Commercial Office</option>
                      <option>Industrial / Warehouse</option>
                      <option>Agricultural</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Project Notes / Roof Type</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#141A17] border border-[#24302A] rounded px-3 py-2 text-sm text-white focus:border-[#286D58]"
                    placeholder="Specific inverter questions, tile vs IBR roof, 3-phase requirements..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-semibold text-xs uppercase tracking-wider rounded transition-colors"
                >
                  Send Official Quote Request
                </button>
              </form>
            )}

            {checkoutStep === 'success' && (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#1B4D3E]/20 border border-[#1B4D3E] flex items-center justify-center mx-auto text-[#10B981]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white">Quotation Request Logged</h3>
                <p className="text-xs text-[#9EADA5] leading-relaxed max-w-xs mx-auto">
                  Reference: <span className="font-mono text-white font-semibold">KX-REQ-{Math.floor(1000 + Math.random() * 9000)}</span>
                  <br /><br />
                  Our engineering support team has received your equipment schedule. An itemized quote with freight & installation estimates will be emailed within 2 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      clearCart();
                      handleClose();
                    }}
                    className="px-6 py-2.5 bg-[#141A17] hover:bg-[#1A221E] border border-[#24302A] text-xs font-mono text-white uppercase rounded"
                  >
                    Return to Platform
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {checkoutStep === 'cart' && items.length > 0 && (
            <div className="p-5 border-t border-[#24302A] bg-[#141A17] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#9EADA5]">
                  <span>Equipment Total:</span>
                  <span className="font-mono text-white">R {totalEquipmentZAR.toLocaleString()}</span>
                </div>
                {totalInstallationZAR > 0 && (
                  <div className="flex justify-between text-[#9EADA5]">
                    <span>Installation Addon:</span>
                    <span className="font-mono text-[#286D58]">+ R {totalInstallationZAR.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#24302A] flex justify-between text-sm font-semibold text-white">
                  <span>Estimated Total (Excl VAT / Delivery):</span>
                  <span className="font-mono text-[#D97706]">R {totalCartZAR.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => clearCart()}
                  className="px-3 py-2.5 border border-[#24302A] hover:border-red-500/50 text-[#9EADA5] hover:text-red-400 text-xs rounded transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="flex-1 py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-semibold text-xs uppercase tracking-wider rounded transition-colors text-center"
                >
                  Proceed to Quote Request
                </button>
              </div>

              <p className="text-[10px] text-[#6B7B73] font-mono text-center">
                Prices in South African Rand (ZAR). Subject to stock availability.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
