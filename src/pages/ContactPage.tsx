import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { PlaceholderBadge } from '../components/common/PlaceholderBadge';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    customerType: 'Residential Homeowner',
    propertyType: 'Suburban House',
    serviceRequired: 'Solar installation',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block">
          Direct Engineering Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
          Let's talk about your energy needs.
        </h1>
        <p className="text-sm text-[#9EADA5] leading-relaxed">
          Whether you require a comprehensive commercial load audit, equipment availability schedule, or residential installation assessment, our energy specialists respond promptly with factual engineering advice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-[#141A17] border border-[#24302A] rounded-xl p-6 sm:p-10 shadow-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-[#24302A] pb-4 mb-6">
                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                  Submit Energy Enquiry
                </h3>
                <p className="text-xs text-[#9EADA5]">All fields marked with an asterisk are required.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Johan"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Surname *</label>
                  <input
                    type="text"
                    required
                    value={formData.surname}
                    onChange={e => setFormData({ ...formData, surname: e.target.value })}
                    placeholder="e.g. Pretorius"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@domain.co.za"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+27 82 000 0000"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Customer Classification</label>
                  <select
                    value={formData.customerType}
                    onChange={e => setFormData({ ...formData, customerType: e.target.value })}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                  >
                    <option>Residential Homeowner</option>
                    <option>Commercial Enterprise</option>
                    <option>Industrial Manufacturer</option>
                    <option>Agricultural Farm</option>
                    <option>Property Developer / Architect</option>
                    <option>Electrical Contractor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Service Required</label>
                  <select
                    value={formData.serviceRequired}
                    onChange={e => setFormData({ ...formData, serviceRequired: e.target.value })}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                  >
                    <option>Solar installation</option>
                    <option>Solar equipment</option>
                    <option>Maintenance</option>
                    <option>System upgrade</option>
                    <option>Commercial solar</option>
                    <option>Financing</option>
                    <option>General enquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Message / Project Requirements *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your current electricity bill, load shedding issues, roof material, or specific equipment questions..."
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Enquiry</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white uppercase">Enquiry Successfully Dispatched</h3>
              <p className="text-xs text-[#9EADA5] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{formData.name}</strong>. An energy engineer has been allocated to your enquiry (<span className="font-mono text-white font-semibold">VX-ENQ-{Math.floor(1000 + Math.random() * 9000)}</span>) and will respond within 2 business hours.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Placeholders & Regional Hubs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-[#1B2420] pb-2">
              National Engineering Hubs & Contact Channels
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#286D58] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#6B7B73] block text-[10px] uppercase">Direct National Switchboard</span>
                  <span className="text-white font-semibold">[Phone Number Placeholder]</span>
                  <span className="text-[10px] text-[#9EADA5] block mt-0.5">Toll-Free Escalation Available</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-[#286D58] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#6B7B73] block text-[10px] uppercase">WhatsApp Engineering Desk</span>
                  <span className="text-white font-semibold">[WhatsApp Number Placeholder]</span>
                  <span className="text-[10px] text-[#9EADA5] block mt-0.5">Fast bill & photo submission</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#286D58] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#6B7B73] block text-[10px] uppercase">Official Proposals & Tenders</span>
                  <span className="text-white font-semibold">[Email Address Placeholder]</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#286D58] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#6B7B73] block text-[10px] uppercase">Operating Hours</span>
                  <span className="text-white font-semibold">[Business Hours Placeholder]</span>
                  <span className="text-[10px] text-[#9EADA5] block mt-0.5">Monday – Friday: 07:30 – 17:00 • 24/7 SLA Callout</span>
                </div>
              </div>
            </div>
          </div>

          {/* South African Regional Operations */}
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              South African Regional Operations
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded">
                <span className="text-[#286D58] font-bold block text-[10px] uppercase">Gauteng Hub (Head Office)</span>
                <span className="text-[#9EADA5] block text-[11px] mt-0.5">[Johannesburg / Sandton Facility Placeholder]</span>
              </div>

              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded">
                <span className="text-[#286D58] font-bold block text-[10px] uppercase">Western Cape Hub</span>
                <span className="text-[#9EADA5] block text-[11px] mt-0.5">[Cape Town / Century City Facility Placeholder]</span>
              </div>

              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded">
                <span className="text-[#286D58] font-bold block text-[10px] uppercase">KwaZulu-Natal Operations</span>
                <span className="text-[#9EADA5] block text-[11px] mt-0.5">[Durban / Umhlanga Facility Placeholder]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
