import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const SOLAR_FAQS: FAQItem[] = [
  {
    question: 'How fast does the system switch over during loadshedding?',
    answer: 'Kinetix hybrid solar systems switch from the municipal Eskom grid to battery backup in less than 20 milliseconds (< 20ms). This is virtually instantaneous (UPS grade), ensuring uninterrupted power to WiFi routers, TV, desktop computers, fridges, and lighting without resetting electronics.',
    category: 'Loadshedding & Backup'
  },
  {
    question: 'What is a SANS 10142-1-2 Certificate of Compliance (CoC)?',
    answer: 'Under South African electrical safety law, any embedded solar and battery installation connected to a premises distribution board must be certified by a Department of Labour (DoL) accredited Master Electrician. A supplementary CoC verifies that your system is legal, safe, and fully covered under your building and home insurance policy.',
    category: 'Regulations & Compliance'
  },
  {
    question: 'How long do LiFePO4 (Lithium Iron Phosphate) batteries last?',
    answer: 'Our Tier-1 LiFePO4 batteries (such as Freedom Won and Dyness) are rated for 6,000+ full charge/discharge cycles at 80% Depth of Discharge (DoD). Under normal South African residential daily cycling, this represents approximately 15+ years of operational service life, backed by a 10-year manufacturer warranty.',
    category: 'Battery Storage'
  },
  {
    question: 'Can I add more solar panels or another battery tower later?',
    answer: 'Yes. All Sunsynk and Deye hybrid inverters installed by Kinetix feature scalable low-voltage DC bus architectures. You can start with an Essential 5kW kit and expand your battery storage or add extra solar panels as your energy needs grow over time.',
    category: 'System Expansion'
  },
  {
    question: 'What is the Section 12B SARS Tax Incentive for businesses?',
    answer: 'Under South African Tax legislation, qualifying commercial and industrial solar PV installations qualify for an accelerated 125% upfront tax deduction against company taxable income in the first year of commissioning, significantly shortening capital payback periods to under 3 years.',
    category: 'Commercial Tax'
  },
  {
    question: 'Does the system feed back into the municipal grid?',
    answer: 'Yes, provided your property is registered under your municipality\'s Small-Scale Embedded Generation (SSEG) scheme (e.g. City Power in Johannesburg or City of Cape Town). Our turnkey installation includes complete municipal application support and bi-directional meter documentation.',
    category: 'Grid-Tie'
  }
];

interface FAQPageProps {
  openConfigurator: () => void;
  setCurrentRoute?: (route: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ openConfigurator }) => {
  const [openQuestion, setOpenQuestion] = useState<string | null>(SOLAR_FAQS[0]?.question ?? null);
  const [search, setSearch] = useState('');

  const filteredFaqs = SOLAR_FAQS.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-24 space-y-12 text-white font-sans selection:bg-[#00D2FF] selection:text-black">
      <div className="space-y-2 border-b border-[#1E2530] pb-8 text-center sm:text-left">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
          Knowledge Base & Help
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Frequently Asked Questions.
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          Answers to common questions regarding inverter sizing, lithium battery cycles, SANS certificates, and Eskom grid-tie regulations.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative font-mono text-xs">
        <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search questions (e.g. loadshedding, batteries, warranty, CoC)..."
          className="w-full bg-[#0D1117] border border-[#1E2530] rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#64748B] focus:border-[#00D2FF] focus:outline-none"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3 font-mono">
        {filteredFaqs.map((faq) => {
          const isOpen = openQuestion === faq.question;
          return (
            <div
              key={faq.question}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen ? 'bg-[#0D1117] border-[#00D2FF]/40 shadow-lg' : 'bg-[#0D1117]/60 border-[#1E2530] hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setOpenQuestion(isOpen ? null : faq.question)}
                aria-expanded={isOpen}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <strong className="text-sm font-bold text-white">{faq.question}</strong>
                {isOpen ? <ChevronUp className="w-4 h-4 text-[#00D2FF] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#CBD5E1] leading-relaxed border-t border-[#1E2530]">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Assistance Card */}
      <div className="p-8 bg-[#0D1117] border border-[#1E2530] rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-mono text-xs">
        <div className="space-y-1">
          <strong className="text-white text-sm block">Still have technical questions?</strong>
          <p className="text-[#94A3B8]">Our certified solar engineers are available to review your load requirements.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openConfigurator}
            className="px-5 py-3 bg-[#00D2FF] hover:bg-[#38BDF8] text-black font-bold uppercase rounded-xl transition-colors shadow-md flex items-center gap-1.5"
          >
            <span>Size System</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
