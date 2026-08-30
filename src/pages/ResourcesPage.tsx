import React, { useState } from 'react';
import { RESOURCE_ARTICLES } from '../data/mockData';
import { ResourceArticle } from '../types';
import { BookOpen, Clock, Tag, ArrowRight, Search, FileText, CheckCircle2 } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<ResourceArticle | null>(RESOURCE_ARTICLES[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Guides', 'Buying Guides', 'Energy Tips', 'Glossary'];

  const filteredArticles = RESOURCE_ARTICLES.filter(art => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-24 space-y-12 text-white font-sans selection:bg-[#00D2FF] selection:text-black">
      {/* Header */}
      <div className="border-b border-[#1E2530] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
            Technical Knowledge Base & Guides
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Resource Centre.
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl">
            Educational engineering articles, equipment buying guides, South African municipal SSEG regulations, and electrical definitions.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors uppercase ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-[#0D1117] text-[#94A3B8] border border-[#1E2530] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Article List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative mb-4 font-mono text-xs">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search guides, glossary, or regulations..."
              className="w-full bg-[#0D1117] border border-[#1E2530] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-[#64748B] focus:border-[#00D2FF] focus:outline-none"
            />
          </div>

          <div className="space-y-3 font-mono">
            {filteredArticles.map(article => {
              const isSelected = activeArticle?.id === article.id;
              return (
                <div
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0D1117] border-[#00D2FF] ring-1 ring-[#00D2FF]/50'
                      : 'bg-[#0D1117]/60 border-[#1E2530] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#64748B] mb-2">
                    <span className="text-[#00D2FF] uppercase font-bold">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1.5 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Article Detail */}
        <div className="lg:col-span-7">
          {activeArticle ? (
            <div className="bg-[#0D1117] border border-[#1E2530] rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
              <div className="space-y-2 border-b border-[#1E2530] pb-6">
                <div className="flex items-center gap-3 text-xs font-mono text-[#00D2FF]">
                  <span className="uppercase font-bold">{activeArticle.category}</span>
                  <span>•</span>
                  <span>{activeArticle.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeArticle.title}
                </h2>
              </div>

              <div className="text-sm text-[#CBD5E1] leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {activeArticle.content}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-[#0D1117] border border-[#1E2530] rounded-3xl text-sm text-[#94A3B8]">
              Select an article on the left to read full engineering guide.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
