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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="border-b border-[#24302A] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
            Technical Knowledge Base & Guides
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Renewable Energy Resource Centre
          </h1>
          <p className="text-xs sm:text-sm text-[#9EADA5] mt-1 max-w-2xl">
            Educational engineering articles, equipment buying guides, South African municipal SSEG regulations, and electrical definitions.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors uppercase ${
                selectedCategory === cat
                  ? 'bg-[#1B4D3E] text-white border border-[#286D58] font-semibold'
                  : 'bg-[#141A17] text-[#9EADA5] border border-[#24302A] hover:text-white'
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
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-[#6B7B73] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search guides, glossary, or regulations..."
              className="w-full bg-[#141A17] border border-[#24302A] rounded pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-[#6B7B73] focus:border-[#286D58]"
            />
          </div>

          <div className="space-y-3">
            {filteredArticles.map(article => {
              const isSelected = activeArticle?.id === article.id;
              return (
                <div
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  className={`p-5 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#141A17] border-[#286D58] ring-1 ring-[#286D58]'
                      : 'bg-[#141A17]/50 border-[#24302A] hover:border-[#31423A] hover:bg-[#141A17]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7B73] mb-2">
                    <span className="text-[#286D58] uppercase font-bold">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#9EADA5] mt-1.5 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {article.tags.map((tag, idx) => (
                      <span key={idx} className="text-[9px] font-mono bg-[#0E1311] text-[#9EADA5] px-2 py-0.5 rounded border border-[#1B2420]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Active Article View */}
        <div className="lg:col-span-7">
          {activeArticle ? (
            <div className="bg-[#141A17] border border-[#24302A] rounded-xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-[#24302A] pb-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#6B7B73]">
                  <span className="text-[#286D58] font-bold uppercase">{activeArticle.category}</span>
                  <span>Published {activeArticle.date} • {activeArticle.readTime}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white uppercase leading-tight">
                  {activeArticle.title}
                </h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeArticle.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-[#0E1311] text-[#9EADA5] px-2.5 py-1 rounded border border-[#1B2420]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Article Content */}
              <div className="text-xs sm:text-sm text-[#E6ECE8] space-y-4 leading-relaxed font-sans prose prose-invert max-w-none">
                {activeArticle.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={idx} className="text-sm font-mono font-bold text-white uppercase pt-2 text-[#286D58]">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={idx} className="space-y-1 pl-4 list-disc text-xs text-[#9EADA5]">
                        {paragraph.split('\n').map((item, itemIdx) => (
                          <li key={itemIdx}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-[#141A17] border border-[#24302A] rounded-xl text-xs text-[#9EADA5]">
              Select an article to read.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
