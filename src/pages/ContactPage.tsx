import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { sendContactInquiryEmail } from '../services/emailService';

export const ContactPage: React.FC = () => {
  const { createContactEnquiry } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Technical Inquiry',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);

    try {
      createContactEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });

      setIsSubmitted(true);
      sendContactInquiryEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      }).catch(e => console.log('Email notice:', e));
    } catch (err) {
      console.warn('Contact enquiry notice:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 space-y-16 text-white font-sans selection:bg-[#00D2FF] selection:text-black">
      <div className="max-w-3xl space-y-3">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
          Sandton Central Operations
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Contact Our Engineering Team.
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          Need technical consultation, warranty support, or commercial load profiling? Connect directly with our certified engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-mono">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 bg-[#0D1117] border border-[#1E2530] rounded-2xl space-y-6 text-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <strong className="text-white block text-sm">Gauteng Headquarters & QA Hub</strong>
                <p className="text-[#94A3B8]">Sandton City Office Tower, 5th Floor, Sandhurst, Johannesburg, 2196</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <strong className="text-white block text-sm">National Hotline</strong>
                <p className="text-[#94A3B8]">+27 11 800 4500 (Mon - Sat, 07:00 - 18:00)</p>
                <span className="text-[10px] text-[#00D2FF]">24/7 Priority SLA Dispatch for active contracts</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <strong className="text-white block text-sm">Direct Desk</strong>
                <p className="text-[#94A3B8]">support@kinetixenergy.co.za</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-7">
          <div className="p-8 bg-[#0D1117] border border-[#1E2530] rounded-2xl">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#00D2FF] mx-auto" />
                <h3 className="text-lg font-bold text-white uppercase">Inquiry Transmitted</h3>
                <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                  A certified technical engineer has received your message and will respond within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-[#94A3B8] uppercase text-[10px] mb-1">Your Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Johan Van Wyk"
                      className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-[#00D2FF] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-[#94A3B8] uppercase text-[10px] mb-1">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. johan@example.co.za"
                      className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-[#00D2FF] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-[#94A3B8] uppercase text-[10px] mb-1">Contact Phone *</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+27 82 000 0000"
                      className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-[#00D2FF] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-[#94A3B8] uppercase text-[10px] mb-1">Inquiry Subject *</label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-[#00D2FF] transition-colors"
                    >
                      <option>General Technical Inquiry</option>
                      <option>Commercial 50kW+ Microgrid Sizing</option>
                      <option>Hardware Store & Supply Order</option>
                      <option>SANS 10142 CoC Compliance Audit</option>
                      <option>Warranty & Service Ticket</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-[#94A3B8] uppercase text-[10px] mb-1">Message / Site Details *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your site location, current load shedding challenges or requirements..."
                    className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-[#00D2FF] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#00D2FF] hover:bg-[#38BDF8] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Transmit Technical Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
