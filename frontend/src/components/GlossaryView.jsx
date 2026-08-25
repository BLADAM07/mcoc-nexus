import React, { useState } from 'react';

export default function GlossaryView({ glossaryList = [] }) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? glossaryList.filter(g => g.term.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase()))
    : glossaryList;

  return (
    <section className="py-8 sm:py-12 bg-[#0c0c0e] min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#222226] mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 tracking-wider">
                STRATEGY & MECHANICS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
                BEGINNER GUIDE & NODE GLOSSARY
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1 font-inter">
              Master combat mechanics, node cancelers, and champion viability tips from the dataset guide.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search glossary terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#18181c] border border-[#333] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>
        </div>

        {/* Glossary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <div key={idx} className="bg-[#141416] border border-[#242428] p-5 hover:border-gray-500 transition-colors">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
                <h4 className="font-extrabold text-sm text-white tracking-wide">
                  {item.term}
                </h4>
              </div>
              <p className="text-xs text-gray-300 font-inter leading-relaxed mb-3">
                {item.description}
              </p>
              {item.tips && (
                <div className="bg-[#1a1a20] border border-[#2c2c36] p-3 text-[11px] font-inter text-gray-300">
                  <span className="text-brand-yellow font-bold uppercase text-[10px] block mb-1">
                    Playstyle & Handling Tip:
                  </span>
                  {item.tips}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
