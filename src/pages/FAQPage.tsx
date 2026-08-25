import React, { useState } from 'react';
import { FAQS_DATA } from '../data/mockData';
import { ChevronDown, ChevronUp, Search, HelpCircle, ArrowRight } from 'lucide-react';

interface FAQPageProps {
  openConfigurator: () => void;
  setCurrentRoute: (route: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ openConfigurator, setCurrentRoute }) => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2', 'faq-5']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQS_DATA.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-[#24302A] pb-8 space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
          Everything You Need to Know About Solar in South Africa.
        </h1>
        <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
          Transparent, factual engineering answers covering loadshedding backup, battery storage lifespan, SANS 10142 compliance, and asset financing.
        </p>

        {/* Search */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-[#6B7B73] absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. loadshedding, cost, batteries, financing, CoC)..."
            className="w-full bg-[#141A17] border border-[#24302A] rounded pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-[#6B7B73] focus:border-[#286D58]"
          />
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map(faq => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className={`rounded-lg border transition-colors overflow-hidden ${
                isOpen ? 'bg-[#141A17] border-[#286D58]/60' : 'bg-[#141A17]/60 border-[#24302A]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#286D58] uppercase font-bold bg-[#0E1311] px-2 py-0.5 rounded border border-[#1B2420] shrink-0">
                    {faq.category}
                  </span>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-tight">
                    {faq.question}
                  </h3>
                </div>
                <div className="shrink-0 text-[#9EADA5]">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#9EADA5] leading-relaxed border-t border-[#1B2420] font-sans">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions banner */}
      <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-xl text-center space-y-4">
        <h3 className="text-base font-bold text-white uppercase">Still have specific technical questions?</h3>
        <p className="text-xs text-[#9EADA5] max-w-md mx-auto">
          Our registered energy engineers are available to review your municipal electrical connection and single-line diagram requirements.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentRoute('contact')}
            className="px-5 py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors"
          >
            Contact Engineering Team
          </button>
        </div>
      </div>
    </div>
  );
};
