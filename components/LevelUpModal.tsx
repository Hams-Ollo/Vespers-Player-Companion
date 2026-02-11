import React, { useState } from 'react';
import { CharacterData, Feature, Spell } from '../types';
import { X, ArrowUpCircle, Sparkles, Loader2, Check, BookOpen, Crown, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit } from '../utils';

interface LevelUpModalProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
  onClose: () => void;
}

interface LevelUpPlan {
    hpAverage: number;
    newFeatures: { name: string; description: string }[];
    choices: {
        id: string;
        label: string; // e.g., "Choose 2 Spells", "Feat or ASI"
        type: 'spell' | 'feat' | 'language' | 'other';
        count: number;
        suggestions?: string[]; // AI suggested options
    }[];
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ data, onUpdate, onClose }) => {
  const [step, setStep] = useState<'intro' | 'analyzing' | 'deciding' | 'finalizing'>('intro');
  const [plan, setPlan] = useState<LevelUpPlan | null>(null);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [loadingText, setLoadingText] = useState("");
  
  const nextLevel = data.level + 1;

  // 1. Analyze Step: Ask AI what happens
  const handleStartLevelUp = async () => {
    if (!process.env.API_KEY) {
        alert("API Key required.");
        return;
    }
    
    checkRateLimit();
    setStep('analyzing');
    setLoadingText("Consulting the Weave for guidance...");

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            My D&D 5e character is a Level ${data.level} ${data.race} ${data.class} (Subclass: check if implied by level). 
            They are leveling up to Level ${nextLevel}.
            
            Return a JSON object describing the level up gains. 
            Format:
            {
              "hpAverage": number (class average + CON mod ${data.stats.CON.modifier}),
              "newFeatures": [{ "name": "Feature Name", "description": "Short summary" }],
              "choices": [
                 { 
                   "id": "c1", 
                   "label": "Select New Spell", 
                   "type": "spell", 
                   "count": 1, 
                   "suggestions": ["Fireball", "Fly", "Haste"] 
                 }
              ]
            }
            If no choices are needed, choices should be empty array.
            Include specific suggestions for spells/feats based on a standard build.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        const result = JSON.parse(response.text || '{}');
        setPlan(result);
        setStep('deciding');

    } catch (e) {
        console.error(e);
        alert("The spirits are silent. Please try again.");
        setStep('intro');
    }
  };

  // 2. Finalize Step: Get details for choices
  const handleFinalize = async () => {
    if (!plan) return;
    
    // Validate selections
    for (const choice of plan.choices) {
        const userSelected = selections[choice.id] || [];
        if (userSelected.length < choice.count) {
            alert(`Please complete selection: ${choice.label}`);
            return;
        }
    }

    setStep('analyzing'); // Reuse loading state
    setLoadingText("Inscribing new powers into your sheet...");

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Construct prompt to get full text for everything
        const featsToFetch = plan.newFeatures.map(f => f.name);
        const choicesToFetch = Object.values(selections).flat();
        
        const prompt = `
            Provide detailed D&D 5e rules text for the following features/spells/feats:
            ${JSON.stringify([...featsToFetch, ...choicesToFetch])}
            
            Return JSON:
            {
                "features": [{ "name": "", "source": "Class/Race/Feat", "description": "Short", "fullText": "Long rules" }],
                "spells": [{ "name": "", "level": 1, "school": "", "description": "", "castingTime": "", "range": "", "duration": "", "components": "" }]
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const result = JSON.parse(response.text || '{}');
        
        // Merge Data
        const updatedFeatures = [...data.features, ...(result.features || [])];
        const updatedSpells = [...(data.spells || []), ...(result.spells || [])];
        
        onUpdate({
            level: nextLevel,
            hp: {
                current: data.hp.current + plan.hpAverage,
                max: data.hp.max + plan.hpAverage
            },
            features: updatedFeatures,
            spells: updatedSpells
        });
        
        setStep('finalizing');

    } catch (e) {
        console.error(e);
        alert("Failed to transcribe features.");
        setStep('deciding');
    }
  };

  const handleSelectionChange = (choiceId: string, val: string, index: number) => {
      setSelections(prev => {
          const current = prev[choiceId] || [];
          const newArr = [...current];
          newArr[index] = val;
          return { ...prev, [choiceId]: newArr };
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <ArrowUpCircle className="text-green-500" size={20} />
            Level Up Wizard
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto">
            {step === 'intro' && (
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-green-900/20 rounded-full flex items-center justify-center mx-auto border-4 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)] animate-pulse">
                        <span className="font-display font-bold text-5xl text-green-400">{nextLevel}</span>
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">Ascend to Level {nextLevel}</h2>
                        <p className="text-zinc-400 text-sm">
                            The Dungeon Master AI will analyze your class path and guide you through selecting new spells, feats, or abilities.
                        </p>
                    </div>

                    <button 
                        onClick={handleStartLevelUp}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                        <Sparkles size={20} /> Begin Ascension
                    </button>
                </div>
            )}

            {step === 'analyzing' && (
                <div className="py-20 text-center">
                    <Loader2 size={48} className="animate-spin text-green-500 mx-auto mb-6" />
                    <p className="text-lg text-zinc-300 font-display animate-pulse">{loadingText}</p>
                </div>
            )}

            {step === 'deciding' && plan && (
                <div className="space-y-6">
                    {/* Fixed Gains */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg border border-zinc-700">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-900/30 p-2 rounded text-red-400"><ArrowUpCircle size={18} /></div>
                                <span className="font-bold text-zinc-200">Max HP</span>
                            </div>
                            <span className="text-xl font-bold text-green-400">+{plan.hpAverage}</span>
                        </div>

                        {plan.newFeatures.map((f, i) => (
                            <div key={i} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 flex gap-3">
                                <div className="mt-1 text-purple-400 shrink-0"><Crown size={18} /></div>
                                <div>
                                    <h4 className="font-bold text-white">{f.name}</h4>
                                    <p className="text-xs text-zinc-400 mt-1">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Choices */}
                    {plan.choices.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-amber-900/30 pb-2">Decisions Required</h4>
                            {plan.choices.map((choice) => (
                                <div key={choice.id} className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-300 block">{choice.label}</label>
                                    {Array.from({ length: choice.count }).map((_, i) => (
                                        <div key={i} className="relative">
                                            <input 
                                                type="text"
                                                list={`suggestions-${choice.id}`}
                                                placeholder={`Select option ${i + 1}...`}
                                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                                                onChange={(e) => handleSelectionChange(choice.id, e.target.value, i)}
                                            />
                                            {choice.suggestions && (
                                                <datalist id={`suggestions-${choice.id}`}>
                                                    {choice.suggestions.map(s => <option key={s} value={s} />)}
                                                </datalist>
                                            )}
                                            <div className="absolute right-3 top-3 text-zinc-600 pointer-events-none">
                                                {choice.type === 'spell' ? <BookOpen size={16} /> : <Zap size={16} />}
                                            </div>
                                        </div>
                                    ))}
                                    {choice.suggestions && (
                                        <p className="text-[10px] text-zinc-500">Suggestions: {choice.suggestions.join(', ')}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button 
                        onClick={handleFinalize}
                        className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-green-900/20"
                    >
                        <Check size={20} /> Confirm Level Up
                    </button>
                </div>
            )}

            {step === 'finalizing' && (
                <div className="text-center py-10 space-y-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-black shadow-[0_0_40px_rgba(34,197,94,0.6)]">
                        <Check size={48} strokeWidth={4} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Level {nextLevel} Reached!</h2>
                        <p className="text-zinc-400">Your stats have been updated and new powers transcribed.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
                    >
                        Return to Sheet
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;