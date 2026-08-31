import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { PlayCircle, ShieldAlert, Swords, Skull, Info } from 'lucide-react';
import ChampionCard from './ChampionCard';

export default function StoryGuideView({ allChampions = [], onSelectChampion, onAddToRoster }) {
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selection state
  const [selectedActIdx, setSelectedActIdx] = useState(0);
  const [selectedQuestIdx, setSelectedQuestIdx] = useState(0);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true);
        const data = await api.getStoryGuide();
        if (data && !data.error) {
          // The parser returns a dict with "quests", representing Act 8
          // For future proofing, we can wrap it in an array if it's just one act
          setGuideData([data]); 
        }
      } catch (err) {
        console.error("Failed to load story guide", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#0c0c0e]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
      </div>
    );
  }

  if (!guideData || guideData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#0c0c0e] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-gray-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Guide Not Found</h2>
        <p className="text-gray-400">The story guide data could not be loaded. Please ensure the backend is running and data is parsed.</p>
      </div>
    );
  }

  const act = guideData[selectedActIdx];
  if (!act) return null;
  
  const quest = act.quests[selectedQuestIdx];

  // Helper to find full champion object
  const getChampionObj = (nameStr) => {
    // Basic normalization for matching (e.g., "Spider-man (2099)" vs "Spider-Man 2099")
    const searchName = nameStr.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = allChampions.find(c => {
      const cName = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cName === searchName || cName.includes(searchName) || searchName.includes(cName);
    });
    
    return found || {
      name: nameStr,
      class: 'Cosmic', // Default fallback
      image: `/images/classes/cosmic.svg`,
      tier: 'Unknown'
    };
  };

  return (
    <section className="bg-[#0c0c0e] min-h-[80vh] flex flex-col md:flex-row border-t border-[#222226]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#141416] border-r border-[#222226] flex-shrink-0">
        <div className="p-4 border-b border-[#222226]">
          <h3 className="font-black text-white tracking-widest uppercase text-sm">Story Navigation</h3>
        </div>
        <div className="p-2">
          {guideData.map((actItem, aIdx) => (
            <div key={aIdx} className="mb-4">
              <div 
                className={`px-3 py-2 rounded text-sm font-bold tracking-wider uppercase mb-1 cursor-pointer transition-colors ${
                  selectedActIdx === aIdx ? 'bg-[#222226] text-brand-yellow' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1e]'
                }`}
                onClick={() => { setSelectedActIdx(aIdx); setSelectedQuestIdx(0); }}
              >
                {actItem.title}
              </div>
              
              {selectedActIdx === aIdx && (
                <div className="pl-4 flex flex-col space-y-1">
                  {actItem.quests.map((q, qIdx) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestIdx(qIdx)}
                      className={`text-left px-3 py-1.5 rounded text-xs font-bold tracking-wider transition-all duration-200 ${
                        selectedQuestIdx === qIdx 
                          ? 'bg-brand-yellow text-black shadow-[0_0_10px_rgba(255,255,0,0.2)]' 
                          : 'text-gray-500 hover:text-white hover:bg-[#222226]'
                      }`}
                    >
                      {actItem.title} \u2192 {q.id}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-[1200px] mx-auto w-full">
        
        {quest ? (
          <div className="space-y-10">
            
            {/* Header & Video Link */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#222226] pb-6 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-brand-yellow text-black text-[10px] font-black px-2 py-0.5 tracking-wider rounded-sm">
                    {act.title}
                  </span>
                  <span className="text-gray-500 text-sm font-bold">\u2022</span>
                  <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">
                    Quest {quest.id}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-wider text-white">
                  PATH & BOSS STRATEGY
                </h2>
              </div>
              
              {quest.video_url && (
                <a 
                  href={quest.video_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded shadow-lg transition-transform transform hover:-translate-y-0.5"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span className="font-black tracking-widest text-xs uppercase">Watch Guide</span>
                </a>
              )}
            </div>

            {/* Path Nodes Section */}
            {quest.path_nodes && quest.path_nodes.length > 0 && (
              <section>
                <div className="flex items-center space-x-3 mb-4">
                  <Info className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-bold text-white tracking-widest uppercase">Global & Path Nodes</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quest.path_nodes.map((node, nIdx) => (
                    <div key={nIdx} className="bg-[#141418] border border-[#2a2a30] p-4 rounded hover:border-gray-500 transition-colors">
                      <h4 className="text-brand-yellow font-extrabold text-sm tracking-wider mb-2">{node.name}</h4>
                      <p className="text-gray-300 text-xs font-inter leading-relaxed whitespace-pre-wrap">{node.effect}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Path Defenders Section */}
            {quest.path_defenders && quest.path_defenders.length > 0 && (
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <Swords className="w-5 h-5 text-brand-yellow" />
                  <h3 className="text-xl font-bold text-white tracking-widest uppercase">Path Defenders</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {quest.path_defenders.map((def, dIdx) => {
                    const champObj = getChampionObj(def.champion);
                    return (
                      <div key={dIdx} className="relative group">
                        {/* Difficulty Badge */}
                        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 z-30 text-[8px] font-black px-2 py-0.5 rounded shadow ${
                          def.difficulty.toLowerCase() === 'easy' ? 'bg-green-500 text-white' : 
                          def.difficulty.toLowerCase() === 'mid' ? 'bg-yellow-500 text-black' : 
                          'bg-red-500 text-white'
                        }`}>
                          {def.difficulty.toUpperCase()}
                        </div>
                        
                        <ChampionCard 
                          champion={champObj}
                          onSelectChampion={onSelectChampion}
                          onAddToRoster={onAddToRoster}
                          isFavorite={false}
                          onToggleFavorite={() => {}}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Boss Section */}
            {quest.boss && quest.boss.name && (
              <section className="bg-[#1a1012] border border-red-900/50 p-6 rounded-lg relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
                  <Skull className="w-96 h-96 text-red-500" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6 border-b border-red-900/30 pb-4">
                    <div className="bg-red-950 p-2 rounded">
                      <Skull className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-red-500 text-[10px] font-black tracking-widest uppercase mb-1">Final Challenge</h4>
                      <h3 className="text-2xl font-extrabold text-white tracking-widest uppercase">{quest.boss.name}</h3>
                    </div>
                  </div>

                  {/* Boss Nodes */}
                  {quest.boss.nodes && quest.boss.nodes.length > 0 && (
                    <div className="mb-8">
                      <h5 className="text-white font-bold text-sm tracking-widest uppercase mb-4 opacity-80">Boss Nodes</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {quest.boss.nodes.map((node, nIdx) => (
                          <div key={nIdx} className="bg-black/40 border border-red-900/30 p-4 rounded">
                            <h4 className="text-red-400 font-bold text-sm tracking-wider mb-2">{node.name}</h4>
                            <p className="text-gray-300 text-xs font-inter leading-relaxed">{node.effect}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Boss Phases */}
                  {quest.boss.phases && quest.boss.phases.length > 0 && (
                    <div>
                      <h5 className="text-white font-bold text-sm tracking-widest uppercase mb-4 opacity-80">Phase Mechanics</h5>
                      <div className="space-y-4">
                        {quest.boss.phases.map((phase, pIdx) => (
                          <div key={pIdx} className="bg-black/60 border border-gray-800 rounded overflow-hidden">
                            <div className="bg-gray-900 px-4 py-2 border-b border-gray-800">
                              <h6 className="text-brand-yellow font-bold text-xs tracking-wider uppercase">{phase.name}</h6>
                            </div>
                            <div className="p-0">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-black/40">
                                    <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-1/3 border-b border-gray-800">Mechanic</th>
                                    <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-800">Action / Strategy</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {phase.steps.map((step, sIdx) => (
                                    <tr key={sIdx} className="border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-colors">
                                      <td className="px-4 py-3 text-xs font-bold text-gray-300">{step.mechanic}</td>
                                      <td className="px-4 py-3 text-xs text-gray-400 font-inter">{step.action}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>
              </section>
            )}

          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 font-bold tracking-wider">
            Select a quest from the navigation menu
          </div>
        )}
      </div>
    </section>
  );
}
