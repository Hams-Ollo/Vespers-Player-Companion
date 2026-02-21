import React, { useState } from 'react';
import { CharacterData } from '../types';
import { CONDITIONS } from '../constants';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  data: CharacterData;
  onUpdate: (update: Partial<CharacterData>) => void;
  onClose: () => void;
}

const BASE_CONDITIONS = [
  'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated',
  'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained',
  'Stunned', 'Unconscious', 'Concentrating',
] as const;

const EXHAUSTION_LEVELS = [
  { level: 0, label: 'None' },
  { level: 1, label: 'Disadvantage on ability checks' },
  { level: 2, label: 'Speed halved' },
  { level: 3, label: 'Disadvantage on attack rolls and saving throws' },
  { level: 4, label: 'Hit point maximum halved' },
  { level: 5, label: 'Speed reduced to 0' },
  { level: 6, label: 'Death' },
];

type Severity = 'red' | 'amber' | 'blue';

const conditionSeverity = (name: string): Severity => {
  if (['Paralyzed', 'Petrified', 'Unconscious', 'Incapacitated', 'Stunned'].includes(name)) return 'red';
  if (['Blinded', 'Frightened', 'Poisoned', 'Restrained', 'Grappled', 'Prone'].includes(name)) return 'amber';
  return 'blue';
};

const ACTIVE_STYLES: Record<Severity, string> = {
  red:   'bg-red-900/40 border-red-500/60',
  amber: 'bg-amber-900/30 border-amber-500/50',
  blue:  'bg-blue-900/30 border-blue-500/50',
};
const CHECK_STYLES: Record<Severity, string> = {
  red:   'bg-red-500 border-red-400',
  amber: 'bg-amber-500 border-amber-400',
  blue:  'bg-blue-500 border-blue-400',
};
const TEXT_STYLES: Record<Severity, string> = {
  red:   'text-red-300',
  amber: 'text-amber-300',
  blue:  'text-blue-300',
};

const ConditionsModal: React.FC<Props> = ({ data, onUpdate, onClose }) => {
  const activeConditions = data.activeConditions ?? [];
  const exhaustionLevel = data.exhaustionLevel ?? 0;
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);

  const toggleCondition = (name: string) => {
    const updated = activeConditions.includes(name)
      ? activeConditions.filter(c => c !== name)
      : [...activeConditions, name];
    onUpdate({ activeConditions: updated });
  };

  const totalActive = activeConditions.length + (exhaustionLevel > 0 ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden max-h-[88vh] flex flex-col shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-base">Conditions & Exhaustion</div>
            <div className="text-zinc-600 text-xs">
              {totalActive > 0 ? `${totalActive} active` : 'No active conditions'}
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="p-2 text-zinc-600 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">

          {/* Conditions list */}
          <div className="space-y-1.5">
            {BASE_CONDITIONS.map(name => {
              const sev = conditionSeverity(name);
              const isActive = activeConditions.includes(name);
              const condData = CONDITIONS[name.toLowerCase()];
              const isExpanded = expandedCondition === name;

              return (
                <div
                  key={name}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isActive ? ACTIVE_STYLES[sev] : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleCondition(name)}
                      aria-label={`Toggle ${name}`}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        isActive ? CHECK_STYLES[sev] : 'border-zinc-700 hover:border-zinc-500 bg-transparent'
                      }`}
                    >
                      {isActive && <span className="text-white text-[10px] font-black leading-none">✓</span>}
                    </button>

                    {/* Name */}
                    <span
                      className={`flex-1 text-sm font-bold ${isActive ? TEXT_STYLES[sev] : 'text-zinc-500'}`}
                    >
                      {name}
                    </span>

                    {/* Expand effects toggle */}
                    {condData && (
                      <button
                        onClick={() => setExpandedCondition(isExpanded ? null : name)}
                        className="p-1 text-zinc-700 hover:text-zinc-400 transition-colors"
                        aria-label={isExpanded ? 'Hide effects' : 'Show effects'}
                      >
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    )}
                  </div>

                  {/* Expanded effects */}
                  {isExpanded && condData && (
                    <div className="px-4 pb-3 pt-1 border-t border-zinc-800/50 space-y-1.5">
                      {condData.effects.map((effect, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-500">
                          <span className="text-zinc-700 mt-0.5 shrink-0">•</span>
                          <span>{effect}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Exhaustion ── */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              Exhaustion Level
            </div>

            {/* 0–6 picker */}
            <div className="grid grid-cols-7 gap-1">
              {EXHAUSTION_LEVELS.map(({ level }) => (
                <button
                  key={level}
                  onClick={() => onUpdate({ exhaustionLevel: level })}
                  className={`py-2 rounded-lg text-sm font-black transition-all ${
                    exhaustionLevel === level
                      ? level === 0
                        ? 'bg-zinc-700 border border-zinc-600 text-white'
                        : level <= 3
                        ? 'bg-amber-900/50 border border-amber-500/60 text-amber-300'
                        : level <= 5
                        ? 'bg-red-900/50 border border-red-500/60 text-red-300'
                        : 'bg-red-950 border-2 border-red-400 text-red-200'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {exhaustionLevel > 0 && (
              <div className="text-xs text-amber-400/90 bg-amber-900/10 border border-amber-900/20 rounded-xl px-3 py-2.5 space-y-1">
                {EXHAUSTION_LEVELS.slice(1, exhaustionLevel + 1).map(({ label }) => (
                  <div key={label} className="flex items-start gap-1.5">
                    <span className="text-amber-600 shrink-0 mt-0.5">•</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-zinc-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConditionsModal;
