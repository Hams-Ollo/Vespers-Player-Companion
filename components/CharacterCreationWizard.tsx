
import React, { useState, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, Dices, User, BookOpen, Sparkles, Loader2, Wand2, Plus, Minus, Scroll, Mic, ShieldCheck, Zap, Star } from 'lucide-react';
import { CharacterData, StatKey, Skill, Campaign, ProficiencyLevel } from '../types';
import TranscriptionButton from './TranscriptionButton';
import {
  generateId,
  getAllRaceOptions,
  DND_CLASSES,
  DND_BACKGROUNDS,
  DND_ALIGNMENTS,
  DND_SKILLS,
  DND_TOOLS,
  getClassData,
  getRaceSpeed,
  getRacialBonus,
  getRacialBonusDisplay,
  POINT_BUY_COSTS,
  POINT_BUY_TOTAL,
  POINT_BUY_MIN,
  POINT_BUY_MAX,
} from '../constants';
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit } from '../utils';

// ==========================================
// Types
// ==========================================

type StatMethod = 'standard' | 'pointbuy' | 'manual';

interface WizardState {
  // Step 1: Identity
  name: string;
  race: string;
  charClass: string;
  background: string;
  alignment: string;
  campaign: string;
  halfElfBonuses: StatKey[];
  // Step 2: Ability Scores
  statMethod: StatMethod;
  baseStats: Record<StatKey, number>;
  standardAssignment: Record<StatKey, number | null>;
  // Step 3: Skills & Proficiencies
  selectedSkills: string[];
  selectedTools: string[];
  // Step 4: Initial Spells & Powers
  selectedPowers: string[];
  // Step 5: Character Concept
  appearance: string;
  backstory: string;
  motivations: string;
  keyNPCs: string;
}

const INITIAL_STATE: WizardState = {
  name: '',
  race: '',
  charClass: '',
  background: '',
  alignment: '',
  campaign: '',
  halfElfBonuses: [],
  statMethod: 'standard',
  baseStats: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
  standardAssignment: { STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null },
  selectedSkills: [],
  selectedTools: [],
  selectedPowers: [],
  appearance: '',
  backstory: '',
  motivations: '',
  keyNPCs: '',
};

const STAT_KEYS: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const STEPS = [
  { label: 'Identity', icon: User },
  { label: 'Ability Scores', icon: Dices },
  { label: 'Proficiencies', icon: ShieldCheck },
  { label: 'Spells & Powers', icon: Zap },
  { label: 'Concept', icon: BookOpen },
  { label: 'Review', icon: Sparkles },
];

interface WizardProps {
  campaigns: Campaign[];
  onCreate: (data: CharacterData) => void;
  onClose: () => void;
}

// ==========================================
// Step Indicator
// ==========================================

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-1 px-6 py-4 border-b border-zinc-800 bg-zinc-950/50 overflow-x-auto no-scrollbar">
    {STEPS.map((step, idx) => {
      const Icon = step.icon;
      const isActive = idx === currentStep;
      const isDone = idx < currentStep;
      return (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <div className={`h-px w-6 shrink-0 ${isDone ? 'bg-amber-500' : 'bg-zinc-700'}`} />
          )}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 ${
            isActive ? 'bg-amber-600/20 text-amber-400 border border-amber-600/40' :
            isDone ? 'text-amber-500' : 'text-zinc-600'
          }`}>
            <Icon size={14} />
            <span className="hidden sm:inline">{step.label}</span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

// ==========================================
// Step 0: Identity
// ==========================================

const StepIdentity: React.FC<{
  state: WizardState;
  campaigns: Campaign[];
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, campaigns, onChange }) => {
  const races = getAllRaceOptions();
  
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Identity</h2>
        <p className="text-zinc-500 text-sm mt-1">Tell us about your adventurer</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Character Name</label>
          <input 
            type="text" 
            value={state.name}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="Enter name..."
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Race</label>
            <select 
              value={state.race}
              onChange={e => onChange({ race: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Select Race...</option>
              {races.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Class</label>
            <select 
              value={state.charClass}
              onChange={e => onChange({ charClass: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Select Class...</option>
              {DND_CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Background</label>
            <select 
              value={state.background}
              onChange={e => onChange({ background: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Select Background...</option>
              {DND_BACKGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Alignment</label>
            <select 
              value={state.alignment}
              onChange={e => onChange({ alignment: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Select Alignment...</option>
              {DND_ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Campaign</label>
          <select 
            value={state.campaign}
            onChange={e => onChange({ campaign: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Select Campaign...</option>
            {campaigns.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            <option value="Solo Adventure">Solo Adventure</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Step 1: Ability Scores
// ==========================================

const StepAbilityScores: React.FC<{
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, onChange }) => {
  const handleStatChange = (key: StatKey, value: number) => {
    const updated = { ...state.baseStats, [key]: value };
    onChange({ baseStats: updated });
  };

  const handleStandardAssignment = (key: StatKey, value: number | null) => {
    const updated = { ...state.standardAssignment, [key]: value };
    onChange({ standardAssignment: updated });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Ability Scores</h2>
        <div className="flex justify-center gap-2 mt-2">
          {(['standard', 'pointbuy', 'manual'] as StatMethod[]).map(m => (
            <button
              key={m}
              onClick={() => onChange({ statMethod: m })}
              className={`px-3 py-1 text-xs font-bold rounded-full border ${state.statMethod === m ? 'bg-amber-600 border-amber-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {STAT_KEYS.map(key => (
          <div key={key} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
            <label className="text-[10px] font-bold text-zinc-500 uppercase block text-center mb-1">{key}</label>
            {state.statMethod === 'standard' ? (
              <select
                value={state.standardAssignment[key] ?? ''}
                onChange={e => handleStandardAssignment(key, e.target.value ? parseInt(e.target.value) : null)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:outline-none"
              >
                <option value="">--</option>
                {STANDARD_ARRAY.map(val => (
                  <option key={val} value={val} disabled={Object.values(state.standardAssignment).includes(val) && state.standardAssignment[key] !== val}>
                    {val}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <button 
                  onClick={() => handleStatChange(key, Math.max(POINT_BUY_MIN, state.baseStats[key] - 1))}
                  className="p-1 text-zinc-500 hover:text-white"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xl font-bold text-white">{state.baseStats[key]}</span>
                <button 
                  onClick={() => handleStatChange(key, Math.min(POINT_BUY_MAX, state.baseStats[key] + 1))}
                  className="p-1 text-zinc-500 hover:text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
            <div className="text-center mt-1">
              <span className="text-[10px] text-zinc-500">
                Bonus: {getRacialBonusDisplay(state.race)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// Step 3: Skills & Proficiencies
// ==========================================

const StepSkills: React.FC<{
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, onChange }) => {
  const classData = getClassData(state.charClass);
  const skillLimit = classData?.skillsToPick || 2;
  const toolLimit = state.charClass === 'Rogue' ? 1 : 0; // Rogue gets Thieves' Tools

  const toggleSkill = (skill: string) => {
    const current = [...state.selectedSkills];
    const idx = current.indexOf(skill);
    if (idx >= 0) current.splice(idx, 1);
    else if (current.length < skillLimit) current.push(skill);
    onChange({ selectedSkills: current });
  };

  const toggleTool = (tool: string) => {
    const current = [...state.selectedTools];
    const idx = current.indexOf(tool);
    if (idx >= 0) current.splice(idx, 1);
    else if (current.length < toolLimit + 1) current.push(tool); // Backgrounds often grant tools too
    onChange({ selectedTools: current });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Talents & Training</h2>
        <p className="text-zinc-500 text-sm mt-1">Select {skillLimit} skills proficient to your class</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Skill Selection</span>
          <span className={`text-xs font-bold ${state.selectedSkills.length === skillLimit ? 'text-green-500' : 'text-amber-500'}`}>
            {state.selectedSkills.length} / {skillLimit}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DND_SKILLS.map(skill => (
            <button
              key={skill.name}
              onClick={() => toggleSkill(skill.name)}
              className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-left flex items-center justify-between ${
                state.selectedSkills.includes(skill.name)
                ? 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-lg'
                : 'bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:border-zinc-500'
              }`}
            >
              <span>{skill.name}</span>
              {state.selectedSkills.includes(skill.name) && <Star size={10} className="fill-blue-400" />}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center px-1 pt-4">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tool Proficiencies</span>
          <span className="text-xs font-bold text-zinc-600">Optional / Background</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DND_TOOLS.slice(0, 9).map(tool => ( // Showing subset for space
            <button
              key={tool}
              onClick={() => toggleTool(tool)}
              className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-left flex items-center justify-between ${
                state.selectedTools.includes(tool)
                ? 'bg-amber-600/20 border-amber-500 text-amber-200'
                : 'bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:border-zinc-500'
              }`}
            >
              <span>{tool}</span>
              {state.selectedTools.includes(tool) && <Star size={10} className="fill-amber-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Step 4: Initial Spells & Powers
// ==========================================

const StepPowers: React.FC<{
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const classData = getClassData(state.charClass);
  const isCaster = classData?.isCaster;

  const getSuggestions = async () => {
    if (!process.env.API_KEY || loading) return;
    setLoading(true);
    try {
      checkRateLimit();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Suggest 4 starting spells or feats for a Level 1 ${state.race} ${state.charClass} with a ${state.background} background in D&D 5e. Return as a plain comma-separated list of names only.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      const list = response.text?.split(',').map(s => s.trim()) || [];
      setSuggestions(list);
    } catch (e) {
      console.error(e);
      setSuggestions(isCaster ? ["Magic Missile", "Shield", "Mage Armor", "Sleep"] : ["Tough", "Skilled", "Magic Initiate"]);
    } finally {
      setLoading(false);
    }
  };

  const togglePower = (power: string) => {
    const current = [...state.selectedPowers];
    const idx = current.indexOf(power);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(power);
    onChange({ selectedPowers: current });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Magical Arcana</h2>
        <p className="text-zinc-500 text-sm mt-1">Select your starting spells and feats</p>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Chosen Powers</h4>
            <span className="text-[10px] text-zinc-600">Tap suggestions below to add</span>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {state.selectedPowers.map(p => (
              <span key={p} className="bg-purple-900/30 text-purple-200 border border-purple-500/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                {p} <button onClick={() => togglePower(p)}><X size={12} /></button>
              </span>
            ))}
            {state.selectedPowers.length === 0 && <span className="text-zinc-700 italic text-sm">No powers selected...</span>}
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={getSuggestions}
            disabled={loading}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 border border-zinc-700"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-amber-500" />}
            Get AI Suggestions
          </button>

          <div className="grid grid-cols-1 gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => togglePower(s)}
                disabled={state.selectedPowers.includes(s)}
                className={`p-3 rounded-lg border text-sm font-bold transition-all text-left flex justify-between items-center ${
                  state.selectedPowers.includes(s)
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-700 opacity-50'
                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-purple-500'
                }`}
              >
                {s}
                {!state.selectedPowers.includes(s) && <Plus size={14} className="text-purple-500" />}
              </button>
            ))}
          </div>
          
          <div className="relative mt-4">
              <input 
                type="text" 
                placeholder="Type custom spell or feat name..."
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    togglePower(e.target.value.trim());
                    e.target.value = '';
                  }
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
              <span className="absolute right-3 top-3.5 text-zinc-600"><Plus size={16} /></span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Step 5: Character Concept
// ==========================================

const StepConcept: React.FC<{
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, onChange }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Character Concept</h2>
        <p className="text-zinc-500 text-sm mt-1">Flesh out your hero's story</p>
      </div>

      <div className="space-y-4">
        {[
          { id: 'appearance', label: 'Appearance', placeholder: 'Describe your physical features...' },
          { id: 'backstory', label: 'Backstory', placeholder: 'Where do you come from? What led you to adventure?' },
          { id: 'motivations', label: 'Motivations', placeholder: 'What drives your character?' },
          { id: 'keyNPCs', label: 'Key NPCs', placeholder: 'Friends, rivals, or mentors...' },
        ].map(field => (
          <div key={field.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{field.label}</label>
              <TranscriptionButton onTranscription={(text) => onChange({ [field.id]: (state as any)[field.id] + ' ' + text })} />
            </div>
            <textarea
              value={(state as any)[field.id]}
              onChange={e => onChange({ [field.id]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 h-24 resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// Step 6: Review
// ==========================================

const StepReview: React.FC<{
  state: WizardState;
  forging: boolean;
  forgeError: string | null;
}> = ({ state, forging, forgeError }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">The Grand Review</h2>
        <p className="text-zinc-500 text-sm mt-1">Confirm your choices before the ritual begins</p>
      </div>

      <div className="bg-zinc-800 rounded-2xl border border-zinc-700 overflow-hidden divide-y divide-zinc-700/50">
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">Name</span>
            <span className="text-white font-bold">{state.name}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">Race & Class</span>
            <span className="text-white font-bold">{state.race} {state.charClass}</span>
          </div>
        </div>
        <div className="p-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">Abilities</span>
          <div className="grid grid-cols-6 gap-1">
            {STAT_KEYS.map(k => (
              <div key={k} className="text-center">
                <div className="text-[10px] text-zinc-500">{k}</div>
                <div className="text-white font-bold">
                  {state.statMethod === 'standard' ? state.standardAssignment[k] : state.baseStats[k]}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Background & Alignment</span>
          <span className="text-zinc-300 text-sm">{state.background} &middot; {state.alignment}</span>
        </div>
        <div className="p-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Skills</span>
          <div className="flex flex-wrap gap-1">
            {state.selectedSkills.map(s => (
              <span key={s} className="bg-blue-900/30 text-blue-300 text-[10px] px-2 py-0.5 rounded border border-blue-500/30">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {forging && (
        <div className="py-8 text-center space-y-4">
          <Loader2 size={48} className="animate-spin text-amber-500 mx-auto" />
          <p className="text-amber-500 font-display animate-pulse">Forging your destiny in the digital aether...</p>
        </div>
      )}

      {forgeError && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
          <span className="font-bold">Error during forging:</span> {forgeError}
        </div>
      )}
    </div>
  );
};

// =============================
// UPDATED MAIN WIZARD LOGIC
// =============================

const CharacterCreationWizard: React.FC<WizardProps> = ({ campaigns, onCreate, onClose }) => {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>({ ...INITIAL_STATE });
  const [forging, setForging] = useState(false);
  const [forgeError, setForgeError] = useState<string | null>(null);

  const handleChange = (updates: Partial<WizardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const classData = getClassData(state.charClass);

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0: return !!(state.name && state.race && state.charClass && state.background && state.alignment);
      case 1: {
        if (state.statMethod === 'standard') return STAT_KEYS.every(k => state.standardAssignment[k] !== null);
        if (state.statMethod === 'pointbuy') {
          const spent = STAT_KEYS.reduce((s, k) => s + (POINT_BUY_COSTS[state.baseStats[k]] ?? 0), 0);
          return spent <= POINT_BUY_TOTAL;
        }
        return true;
      }
      case 2: return state.selectedSkills.length >= (classData?.skillsToPick || 2);
      case 3: return true; // Spells/Feats are optional-ish
      case 4: return true;
      case 5: return !forging;
      default: return false;
    }
  }, [step, state, forging, classData]);

  const handleForge = async () => {
    setForging(true);
    setForgeError(null);

    let portraitUrl = 'https://picsum.photos/400/400?grayscale';
    let detailedResult = { features: [], spells: [] };

    try {
        if (!process.env.API_KEY) throw new Error("API Key missing");
        checkRateLimit();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // 1. Generate Portrait
        const portraitPrompt = `D&D Portrait: ${state.race} ${state.charClass}. ${state.appearance}`;
        const portraitResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: portraitPrompt }] },
        });
        if (portraitResponse.candidates?.[0]?.content?.parts) {
            for (const part of portraitResponse.candidates[0].content.parts) {
                if (part.inlineData) { portraitUrl = `data:image/png;base64,${part.inlineData.data}`; break; }
            }
        }

        // 2. Fetch Detailed Powers Text
        if (state.selectedPowers.length > 0) {
            const rulesPrompt = `Provide full D&D 5e rules text for these: ${state.selectedPowers.join(', ')}. Return JSON: { "features": [{ "name": "", "source": "Feat", "description": "Short", "fullText": "Full text" }], "spells": [{ "name": "", "level": 0, "school": "", "description": "", "castingTime": "", "range": "", "duration": "", "components": "" }] }`;
            const rulesResponse = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: rulesPrompt,
                config: { responseMimeType: 'application/json' }
            });
            detailedResult = JSON.parse(rulesResponse.text || '{}');
        }

    } catch (err: any) { 
        setForgeError(err.message); 
    }

    const hitDie = classData?.hitDie ?? 8;
    const speed = getRaceSpeed(state.race);
    const profBonus = 2;
    const stats = {} as Record<StatKey, any>;
    STAT_KEYS.forEach(stat => {
      let base = state.statMethod === 'standard' ? (state.standardAssignment[stat] ?? 8) : state.baseStats[stat];
      let rB = getRacialBonus(state.race, stat);
      if (state.race === 'Half-Elf' && state.halfElfBonuses.includes(stat)) rB += 1;
      const score = base + rB;
      const mod = Math.floor((score - 10) / 2);
      const isProf = classData?.savingThrows.includes(stat);
      stats[stat] = { score, modifier: mod, save: isProf ? mod + profBonus : mod, proficientSave: isProf };
    });

    // Populate full skill list
    const finalSkills: Skill[] = DND_SKILLS.map(s => {
        const isProf = state.selectedSkills.includes(s.name);
        return {
            name: s.name,
            ability: s.ability,
            modifier: stats[s.ability].modifier + (isProf ? profBonus : 0),
            proficiency: isProf ? 'proficient' : 'none'
        };
    });

    const character: CharacterData = {
      id: generateId(),
      campaign: state.campaign === 'NEW_PROMPT' ? 'New Adventure' : (state.campaign || 'Solo Adventure'),
      name: state.name,
      race: state.race,
      class: state.charClass,
      background: state.background,
      alignment: state.alignment,
      level: 1,
      portraitUrl,
      stats,
      hp: { current: hitDie + stats.CON.modifier, max: hitDie + stats.CON.modifier },
      hitDice: { current: 1, max: 1, die: `1d${hitDie}` },
      ac: 10 + stats.DEX.modifier,
      initiative: stats.DEX.modifier,
      speed,
      passivePerception: 10 + stats.WIS.modifier,
      skills: finalSkills,
      attacks: [{ name: "Unarmed Strike", bonus: stats.STR.modifier + profBonus, damage: "1", type: "Bludgeoning" }],
      features: detailedResult.features || [],
      spells: detailedResult.spells || [],
      spellSlots: classData?.isCaster ? [{ level: 1, current: 2, max: 2 }] : [],
      inventory: { gold: 150, items: [], load: "Light" },
      journal: [],
      motivations: state.motivations,
      keyNPCs: state.keyNPCs
    };

    setForging(false);
    onCreate(character);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 animate-in fade-in">
      <div className="bg-zinc-900 sm:border border-zinc-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl md:max-w-2xl overflow-hidden flex flex-col shadow-2xl h-[95vh] sm:h-auto sm:max-h-[90vh]">
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-lg sm:text-xl font-display font-bold text-amber-500 flex items-center gap-2">
            <Star size={20} /> Forge New Character
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1" aria-label="Close"><X size={24} /></button>
        </div>

        <StepIndicator currentStep={step} />

        <div className="flex-grow overflow-y-auto">
          {step === 0 && <StepIdentity state={state} campaigns={campaigns} onChange={handleChange} />}
          {step === 1 && <StepAbilityScores state={state} onChange={handleChange} />}
          {step === 2 && <StepSkills state={state} onChange={handleChange} />}
          {step === 3 && <StepPowers state={state} onChange={handleChange} />}
          {step === 4 && <StepConcept state={state} onChange={handleChange} />}
          {step === 5 && <StepReview state={state} forging={forging} forgeError={forgeError} />}
        </div>

        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/50 flex gap-3 shrink-0">
          {step > 0 && !forging && (
            <button onClick={() => setStep(s => s - 1)} className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl flex items-center gap-1">
              <ChevronLeft size={18} /> Back
            </button>
          )}
          <div className="flex-grow" />
          {step < 5 && (
            <button onClick={() => setStep(s => s + 1)} disabled={!canAdvance} className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center gap-1 disabled:opacity-50">
              Next <ChevronRight size={18} />
            </button>
          )}
          {step === 5 && !forging && (
            <button onClick={handleForge} className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl flex items-center gap-2">
              <Sparkles size={18} /> Forge Character
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationWizard;
