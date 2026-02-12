import React from 'react';
import { CharacterData, CampaignMember } from '../types';
import { Heart, Shield, Eye, Crown, User, Loader2, Swords, Brain, Ear } from 'lucide-react';

interface DMPartyOverviewProps {
  members: CampaignMember[];
  partyCharacters: Map<string, CharacterData>;
  loadingChars: boolean;
}

const DMPartyOverview: React.FC<DMPartyOverviewProps> = ({ members, partyCharacters, loadingChars }) => {
  const playerMembers = members.filter(m => m.role !== 'dm');

  // Party-level stats
  const characters = Array.from(partyCharacters.values());
  const avgLevel = characters.length > 0
    ? Math.round(characters.reduce((sum, c) => sum + (c.level || 1), 0) / characters.length)
    : 0;
  const lowestHP = characters.length > 0
    ? Math.min(...characters.map(c => (c.hp?.current ?? 0) / (c.hp?.max ?? 1) * 100))
    : 100;

  if (loadingChars) {
    return (
      <div className="text-center py-20">
        <Loader2 className="animate-spin text-amber-500 mx-auto" size={32} />
        <p className="text-zinc-500 text-sm mt-3">Loading party data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Party Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Party Size</span>
          <span className="text-2xl font-display font-black text-white">{playerMembers.length}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Avg Level</span>
          <span className="text-2xl font-display font-black text-amber-400">{avgLevel}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Lowest HP %</span>
          <span className={`text-2xl font-display font-black ${
            lowestHP > 50 ? 'text-green-400' : lowestHP > 25 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {Math.round(lowestHP)}%
          </span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Characters</span>
          <span className="text-2xl font-display font-black text-blue-400">{characters.length}</span>
        </div>
      </div>

      {/* Live Vitals Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Heart size={12} /> Live Party Vitals
        </h3>

        {playerMembers.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
            <p className="text-zinc-600 italic">No players have joined yet. Share the join code!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playerMembers.map(member => {
              const character = partyCharacters.get(member.uid);

              return (
                <div
                  key={member.uid}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Portrait */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-700 shrink-0 bg-zinc-800 flex items-center justify-center">
                      {character?.portraitUrl ? (
                        <img src={character.portraitUrl} alt={character.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={22} className="text-zinc-600" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate">
                          {character?.name || member.displayName}
                        </span>
                        {character && (
                          <span className="text-[10px] text-zinc-600 font-bold shrink-0 ml-2">Lvl {character.level}</span>
                        )}
                      </div>

                      {character ? (
                        <>
                          <p className="text-xs text-zinc-500">
                            {character.race} {character.class}
                          </p>

                          {/* HP Bar */}
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="flex items-center gap-1 text-zinc-500">
                                <Heart size={9} className="text-red-500" /> HP
                              </span>
                              <span className="font-mono font-bold text-zinc-400">
                                {character.hp?.current ?? 0} / {character.hp?.max ?? 0}
                              </span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  ((character.hp?.current ?? 0) / (character.hp?.max ?? 1)) > 0.5
                                    ? 'bg-green-500'
                                    : ((character.hp?.current ?? 0) / (character.hp?.max ?? 1)) > 0.25
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.max(0, Math.min(100, ((character.hp?.current ?? 0) / (character.hp?.max ?? 1)) * 100))}%` }}
                              />
                            </div>
                          </div>

                          {/* Quick Stats Row */}
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Shield size={10} className="text-blue-500" />
                              <span className="text-[10px] font-mono font-bold text-zinc-400">AC {character.ac ?? 10}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Swords size={10} className="text-orange-500" />
                              <span className="text-[10px] font-mono font-bold text-zinc-400">
                                Init {character.initiative >= 0 ? '+' : ''}{character.initiative ?? 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={10} className="text-purple-500" />
                              <span className="text-[10px] font-mono font-bold text-zinc-400">
                                PP {10 + (character.skills?.find(s => s.name === 'Perception')?.modifier ?? 0)}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-zinc-600 italic mt-1">No character assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Passive Scores Panel */}
      {characters.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Eye size={12} /> Passive Scores
          </h3>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Character</th>
                  <th className="text-center px-3 py-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    <span className="flex items-center justify-center gap-1"><Eye size={9} /> Percep.</span>
                  </th>
                  <th className="text-center px-3 py-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    <span className="flex items-center justify-center gap-1"><Brain size={9} /> Invest.</span>
                  </th>
                  <th className="text-center px-3 py-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    <span className="flex items-center justify-center gap-1"><Ear size={9} /> Insight</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.filter(m => m.role !== 'dm').map(member => {
                  const character = partyCharacters.get(member.uid);
                  if (!character) return null;

                  const passivePerception = 10 + (character.skills?.find(s => s.name === 'Perception')?.modifier ?? 0);
                  const passiveInvestigation = 10 + (character.skills?.find(s => s.name === 'Investigation')?.modifier ?? 0);
                  const passiveInsight = 10 + (character.skills?.find(s => s.name === 'Insight')?.modifier ?? 0);

                  return (
                    <tr key={member.uid} className="border-b border-zinc-800/50 last:border-0">
                      <td className="px-4 py-2 font-bold text-white text-xs">{character.name}</td>
                      <td className="text-center px-3 py-2 font-mono font-bold text-purple-400 text-xs">{passivePerception}</td>
                      <td className="text-center px-3 py-2 font-mono font-bold text-cyan-400 text-xs">{passiveInvestigation}</td>
                      <td className="text-center px-3 py-2 font-mono font-bold text-yellow-400 text-xs">{passiveInsight}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DMPartyOverview;
