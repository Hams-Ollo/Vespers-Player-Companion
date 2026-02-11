
import React, { useState } from 'react';
import { X, Dices, Sparkles, Loader2, Wand2, Star, ChevronDown, Activity } from 'lucide-react';
import { CharacterData, StatKey, ProficiencyLevel } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { checkRateLimit, recalculateCharacterStats } from '../utils';
import { 
  generateId, 
  getAllRaceOptions, 
  DND_CLASSES, 
  getClassData, 
  getRaceSpeed 
} from '../constants';

interface QuickRollModalProps {
  onCreate: (data: CharacterData) => void;
  onClose: () => void;
}

const QuickRollModal: React.FC<QuickRollModalProps> = ({ onCreate, onClose }) => {
  const [race, setRace] = useState('');
  const [charClass, setCharClass] = useState('');
  const [vibe, setVibe] = useState('');
  const [isForging, setIsForging] = useState(false);
  const [ritualMessage, setRitualMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const races = getAllRaceOptions();
  const classes = DND_CLASSES.map(c => c.name);

  const handleRoll = async () => {
    if (!race || !charClass) {
        setError("Please choose a lineage and calling.");
        return;
    }

    if (!process.env.API_KEY) {
        setError("AI Neural Link unavailable. Check environment.");
        return;
    }

    setIsForging(true);
    setError(null);
    setRitualMessage("Consulting the ancient scrolls...");

    try {
        checkRateLimit();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // 1. Generate Character Data
        setRitualMessage("Weaving the threads of destiny...");
        
        const characterSchema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "A unique D&D name matching the race/vibe" },
                stats: {
                    type: Type.OBJECT,
                    properties: {
                        STR: { type: Type.INTEGER },
                        DEX: { type: Type.INTEGER },
                        CON: { type: Type.INTEGER },
                        INT: { type: Type.INTEGER },
                        WIS: { type: Type.INTEGER },
                        CHA: { type: Type.INTEGER },
                    },
                    required: ["STR", "DEX", "CON", "INT", "WIS", "CHA"]
                },
                background: { type: Type.STRING },
                alignment: { type: Type.STRING },
                skills: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            proficiency: { type: Type.STRING, enum: ["proficient", "expertise", "none"] }
                        },
                        required: ["name", "proficiency"]
                    }
                },
                features: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            source: { type: Type.STRING },
                            description: { type: Type.STRING },
                            fullText: { type: Type.STRING }
                        },
                        required: ["name", "source", "description", "fullText"]
                    }
                },
                spells: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            level: { type: Type.INTEGER },
                            school: { type: Type.STRING },
                            description: { type: Type.STRING },
                            castingTime: { type: Type.STRING },
                            range: { type: Type.STRING },
                            duration: { type: Type.STRING },
                            components: { type: Type.STRING }
                        },
                        required: ["name", "level", "school", "description"]
                    }
                },
                appearance: { type: Type.STRING, description: "A detailed physical description for portrait generation" },
                backstory: { type: Type.STRING }
            },
            required: ["name", "stats", "background", "alignment", "skills", "features", "spells", "appearance", "backstory"]
        };

        const dataResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a detailed Level 1 D&D 5e character. 
                      Race: ${race}. Class: ${charClass}. Vibe: ${vibe || 'Traditional'}.
                      Ability scores must be valid Standard Array (15, 14, 13, 12, 10, 8) distributed correctly for the class, BEFORE racial bonuses.
                      Apply these racial bonuses to the scores: ${race}.
                      Pick relevant Level 1 features and starting spells for ${charClass}.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: characterSchema,
                temperature: 0.8
            }
        });

        const charResult = JSON.parse(dataResponse.text || '{}');

        // 2. Generate Portrait
        setRitualMessage("Manifesting the physical form...");
        
        let portraitUrl = "https://picsum.photos/400/400?grayscale";
        try {
            const portraitPrompt = `A stunning, professional high-fantasy digital art portrait of a ${race} ${charClass}. ${charResult.appearance}. Cinematic lighting, intricate detail, 1:1 aspect ratio.`;
            const portraitResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: portraitPrompt }] },
            });
            
            if (portraitResponse.candidates?.[0]?.content?.parts) {
                for (const part of portraitResponse.candidates[0].content.parts) {
                    if (part.inlineData) {
                        portraitUrl = `data:image/png;base64,${part.inlineData.data}`;
                        break;
                    }
                }
            }
        } catch (imgErr) {
            console.warn("Portrait failed, using fallback", imgErr);
        }

        // 3. Assemble Final Object
        setRitualMessage("Binding the spirit to the sheet...");
        
        const classData = getClassData(charClass);
        const hitDie = classData?.hitDie ?? 8;
        const stats: any = {};
        
        (Object.keys(charResult.stats) as StatKey[]).forEach(k => {
            const score = charResult.stats[k];
            const mod = Math.floor((score - 10) / 2);
            stats[k] = { 
                score, 
                modifier: mod, 
                save: mod, 
                proficientSave: classData?.savingThrows.includes(k) ?? false 
            };
        });

        const finalCharacter: CharacterData = {
            id: generateId(),
            name: charResult.name,
            race: race,
            class: charClass,
            level: 1,
            campaign: 'Quick Start',
            portraitUrl,
            stats,
            hp: { 
                current: hitDie + stats.CON.modifier, 
                max: hitDie + stats.CON.modifier 
            },
            hitDice: { current: 1, max: 1, die: `1d${hitDie}` },
            ac: 10 + stats.DEX.modifier,
            initiative: stats.DEX.modifier,
            speed: getRaceSpeed(race),
            passivePerception: 10 + stats.WIS.modifier,
            skills: charResult.skills.map((s: any) => ({
                name: s.name,
                ability: 'DEX', // Default fallback, recalculate will fix it
                modifier: 0,
                proficiency: s.proficiency as ProficiencyLevel
            })),
            attacks: [],
            features: charResult.features,
            spells: charResult.spells,
            spellSlots: [], // Recalculate will populate this
            inventory: { gold: 10, items: [], load: "Light" },
            journal: [{ 
                id: 'origin', 
                timestamp: Date.now(), 
                type: 'note', 
                content: charResult.backstory 
            }]
        };

        const readyChar = recalculateCharacterStats(finalCharacter);
        onCreate(readyChar);
        onClose();

    } catch (err: any) {
        setError(err.message || "The ritual was interrupted. Try again.");
        setIsForging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-700/50 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-white/10">
        
        {!isForging && (
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        )}

        {isForging ? (
          <div className="p-12 text-center space-y-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
                <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin relative" />
                <Dices size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 animate-bounce" />
            </div>
            <div className="space-y-3">
                <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase animate-pulse">Forging Destiny</h2>
                <p className="text-zinc-500 font-medium italic">"{ritualMessage}"</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-indigo-500/20 rounded-xl">
                    <Activity className="text-indigo-400" size={24} />
                 </div>
                 <h2 className="text-3xl font-display font-bold text-white">Quick Roll</h2>
              </div>
              <p className="text-zinc-500 text-sm">Let the AI forge a complete guest character instantly.</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Lineage</label>
                  <div className="relative">
                    <select 
                      value={race}
                      onChange={e => setRace(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                    >
                      <option value="">Select Race</option>
                      {races.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Calling</label>
                  <div className="relative">
                    <select 
                      value={charClass}
                      onChange={e => setCharClass(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                    >
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Character Vibe (Optional)</label>
                    <Star size={10} className="text-amber-500" />
                </div>
                <textarea 
                  placeholder="e.g. A grumpy pirate, a mysterious noble, a bubbly hermit..."
                  value={vibe}
                  onChange={e => setVibe(e.target.value)}
                  className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-sm"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold animate-in shake duration-300">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={handleRoll}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3 transform active:scale-[0.98]"
                >
                  <Sparkles size={20} />
                  Forge Spirit
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 text-center">
                <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">
                    AI will roll stats, pick skills, and create a backstory
                </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickRollModal;
