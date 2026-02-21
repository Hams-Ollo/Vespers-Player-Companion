import React, { useState, useRef, useEffect } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { Combatant } from '../types';
import { DND_CONDITIONS } from '../constants';
import {
  ChevronRight, SkipForward, XCircle, Shield, Heart, ChevronDown, ChevronUp,
  Plus, X, ScrollText, Skull, User, Swords,
} from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────

const HPBar: React.FC<{ hp: number; maxHp: number }> = ({ hp, maxHp }) => {
  const pct = maxHp > 0 ? Math.max(0, Math.min(1, hp / maxHp)) : 0;
  const color =
    pct > 0.5 ? 'bg-green-500' :
    pct > 0.25 ? 'bg-yellow-500' :
    pct > 0 ? 'bg-orange-500' : 'bg-red-700';

  return (
    <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct * 100}%` }} />
    </div>
  );
};

const typeStyle = (type: string) => {
  switch (type) {
    case 'pc':      return { bg: 'bg-blue-900/30 text-blue-300 border-blue-500/30',  icon: <User size={10} /> };
    case 'npc':     return { bg: 'bg-amber-900/30 text-amber-300 border-amber-500/30', icon: <User size={10} /> };
    case 'monster': return { bg: 'bg-red-900/30 text-red-300 border-red-500/30',    icon: <Skull size={10} /> };
    default:        return { bg: 'bg-zinc-800 text-zinc-400 border-zinc-600',       icon: null };
  }
};

// ─── Inline HP Editor ────────────────────────────────────────────────
interface HPEditorProps {
  combatant: Combatant;
  onApply: (newHp: number) => void;
}

const HPEditor: React.FC<HPEditorProps> = ({ combatant, onApply }) => {
  const [mode, setMode] = useState<null | 'dmg' | 'heal'>(null);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode) {
      setValue('');
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [mode]);

  const apply = () => {
    const n = parseInt(value, 10);
    if (!isNaN(n) && n > 0) {
      const newHp = mode === 'dmg'
        ? Math.max(0, combatant.hp - n)
        : Math.min(combatant.maxHp, combatant.hp + n);
      onApply(newHp);
    }
    setMode(null);
  };

  if (mode) {
    return (
      <form
        onSubmit={e => { e.preventDefault(); apply(); }}
        className="flex items-center gap-1"
      >
        <span className={`text-xs font-bold ${mode === 'dmg' ? 'text-red-400' : 'text-green-400'}`}>
          {mode === 'dmg' ? '−' : '+'}
        </span>
        <input
          ref={inputRef}
          type="number"
          min="1"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={() => { if (!value) setMode(null); else apply(); }}
          className="w-14 bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-0.5 text-xs text-white text-center focus:outline-none focus:border-amber-500"
          placeholder={mode === 'dmg' ? 'dmg' : 'heal'}
        />
        <button type="submit" className="text-xs text-zinc-500 hover:text-white">✓</button>
        <button type="button" onClick={() => setMode(null)} className="text-xs text-zinc-600 hover:text-white">✕</button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => setMode('dmg')}
        className="w-6 h-6 flex items-center justify-center bg-red-900/30 hover:bg-red-900/60 rounded text-red-400 text-sm font-bold transition-colors"
        title="Deal damage"
      >−</button>
      <div className="text-center min-w-[50px]">
        <span className="text-sm font-bold text-white">{combatant.hp}</span>
        <span className="text-zinc-600 text-xs">/{combatant.maxHp}</span>
      </div>
      <button
        onClick={() => setMode('heal')}
        className="w-6 h-6 flex items-center justify-center bg-green-900/30 hover:bg-green-900/60 rounded text-green-400 text-sm font-bold transition-colors"
        title="Heal"
      >+</button>
    </div>
  );
};

// ─── Condition Chips ──────────────────────────────────────────────────
interface ConditionEditorProps {
  conditions: string[];
  onAdd: (c: string) => void;
  onRemove: (c: string) => void;
}

const ConditionEditor: React.FC<ConditionEditorProps> = ({ conditions, onAdd, onRemove }) => {
  const [open, setOpen] = useState(false);
  const available = DND_CONDITIONS.filter(c => !conditions.includes(c));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="flex items-center flex-wrap gap-1 relative" ref={ref}>
      {conditions.map(c => (
        <span
          key={c}
          className="inline-flex items-center gap-1 text-xs bg-purple-900/30 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full"
        >
          {c}
          <button onClick={() => onRemove(c)} className="hover:text-white transition-colors">
            <X size={10} />
          </button>
        </span>
      ))}
      {available.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setOpen(v => !v)}
            className="w-5 h-5 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 border border-zinc-700 transition-colors"
            title="Add condition"
          >
            <Plus size={11} />
          </button>
          {open && (
            <div className="absolute left-0 top-6 z-50 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-2 w-44 max-h-56 overflow-y-auto">
              {available.map(c => (
                <button
                  key={c}
                  onClick={() => { onAdd(c); setOpen(false); }}
                  className="w-full text-left text-xs px-2.5 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Stat Block Mini-View ──────────────────────────────────────────────
const STAT_KEYS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;

const StatBlockMini: React.FC<{ combatant: Combatant }> = ({ combatant }) => {
  const sb = combatant.statBlock;
  if (!sb) return null;

  return (
    <div className="mt-3 pt-3 border-t border-zinc-700/50 space-y-2 text-xs">
      {/* Ability scores */}
      {sb.abilityScores && (
        <div className="grid grid-cols-6 gap-1">
          {STAT_KEYS.map(stat => {
            const val = sb.abilityScores![stat] ?? 10;
            const mod = Math.floor((val - 10) / 2);
            return (
              <div key={stat} className="bg-zinc-800 rounded-md p-1.5 text-center">
                <div className="text-zinc-600 font-bold" style={{ fontSize: '8px' }}>{stat}</div>
                <div className="text-white font-black text-sm leading-tight">{val}</div>
                <div className="text-zinc-400" style={{ fontSize: '9px' }}>{mod >= 0 ? `+${mod}` : mod}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Misc */}
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-zinc-500">
        {sb.speed && <span><span className="text-zinc-600">Speed </span>{sb.speed}</span>}
        {sb.creatureType && <span className="italic">{[sb.size, sb.creatureType].filter(Boolean).join(', ')}</span>}
        {sb.senses && <span><span className="text-zinc-600">Senses </span>{sb.senses}</span>}
      </div>

      {/* Traits */}
      {(sb.traits?.length ?? 0) > 0 && (
        <div className="space-y-0.5 text-zinc-500">
          {sb.traits!.map((trait, i) => (
            <p key={i}><span className="font-bold text-zinc-400 italic">{trait.name}. </span>{trait.description}</p>
          ))}
        </div>
      )}

      {/* Attacks */}
      {(sb.attacks?.length ?? 0) > 0 && (
        <div className="space-y-1">
          <div className="text-zinc-600 font-bold uppercase tracking-widest" style={{ fontSize: '8px' }}>Actions</div>
          {sb.attacks.map((atk, i) => (
            <div key={i} className="bg-zinc-800/60 rounded-lg p-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-zinc-200">{atk.name}.</span>
                <span className="text-green-400 font-bold">{atk.attackBonus >= 0 ? '+' : ''}{atk.attackBonus} to hit</span>
                <span className="text-zinc-500">{atk.reach ?? atk.range}, {atk.targets}.</span>
              </div>
              <div className="text-zinc-400 mt-0.5">
                Hit: <span className="text-amber-400 font-bold">{atk.damageExpression}</span> {atk.damageType}
                {atk.additionalEffects ? `. ${atk.additionalEffects}` : '.'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Combatant Row ────────────────────────────────────────────────────
interface CombatantRowProps {
  combatant: Combatant;
  isActive: boolean;
  onHpChange: (newHp: number) => void;
  onConditionAdd: (c: string) => void;
  onConditionRemove: (c: string) => void;
}

const CombatantRow: React.FC<CombatantRowProps> = ({
  combatant, isActive, onHpChange, onConditionAdd, onConditionRemove,
}) => {
  const [expanded, setExpanded] = useState(false);
  const ts = typeStyle(combatant.type);
  const isDown = combatant.hp <= 0;

  return (
    <div
      className={`rounded-xl border transition-all ${
        isActive
          ? 'border-amber-500/60 bg-amber-950/20 shadow-lg shadow-amber-900/10'
          : isDown
          ? 'border-zinc-800 bg-zinc-900/30 opacity-60'
          : 'border-zinc-800 bg-zinc-900/50'
      }`}
    >
      <div className="p-3 sm:p-4">
        {/* Top row: initiative + name + badges + HP + AC */}
        <div className="flex items-start gap-3 flex-wrap">
          {/* Initiative badge */}
          <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${
            isActive ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}>
            <span className="text-xs font-black leading-tight">{combatant.initiative}</span>
            <span className="text-zinc-500" style={{ fontSize: '8px' }}>INIT</span>
          </div>

          {/* Name + type */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-bold text-sm ${isDown ? 'line-through text-zinc-600' : 'text-white'}`}>
                {combatant.name}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border ${ts.bg}`}>
                {ts.icon}
                <span className="capitalize">{combatant.type}</span>
              </span>
              {isActive && (
                <span className="text-xs font-bold text-amber-400 animate-pulse">◆ Active Turn</span>
              )}
              {isDown && (
                <span className="text-xs font-bold text-red-500">✕ Down</span>
              )}
            </div>
            {/* HP bar */}
            <div className="mt-1.5">
              <HPBar hp={combatant.hp} maxHp={combatant.maxHp} />
            </div>
          </div>

          {/* HP editor */}
          <div className="shrink-0">
            <HPEditor combatant={combatant} onApply={onHpChange} />
          </div>

          {/* AC */}
          <div className="flex items-center gap-1 text-xs text-zinc-400 shrink-0" title="Armor Class">
            <Shield size={12} className="text-blue-400" />
            <span className="font-bold text-zinc-200">{combatant.ac}</span>
          </div>

          {/* Stat block toggle (monsters/npcs only) */}
          {combatant.statBlock && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="shrink-0 text-zinc-600 hover:text-zinc-300 transition-colors"
              title={expanded ? 'Hide stat block' : 'Show stat block'}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>

        {/* Conditions */}
        <div className="mt-2 pl-0 sm:pl-13">
          <ConditionEditor
            conditions={combatant.conditions}
            onAdd={onConditionAdd}
            onRemove={onConditionRemove}
          />
        </div>

        {/* Stat block expansion */}
        {expanded && <StatBlockMini combatant={combatant} />}
      </div>
    </div>
  );
};

// ─── Combat Log ───────────────────────────────────────────────────────
const CombatLog: React.FC<{ log: { timestamp: number; type: string; actorName?: string; description: string }[] }> = ({ log }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log.length]);

  const entryIcon = (type: string) => {
    switch (type) {
      case 'turn_change':     return '⚔';
      case 'damage':          return '💥';
      case 'heal':            return '💚';
      case 'condition':       return '⚗️';
      case 'encounter_start': return '🎲';
      case 'encounter_end':   return '🏁';
      default:                return '·';
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800">
        <ScrollText size={13} className="text-zinc-500" />
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Combat Log</span>
        <span className="ml-auto text-xs text-zinc-700">{log.length} entries</span>
      </div>
      <div className="max-h-48 overflow-y-auto px-4 py-2 space-y-1">
        {log.length === 0 && (
          <p className="text-xs text-zinc-700 py-2 text-center">No events yet</p>
        )}
        {log.map((entry, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span className="shrink-0 text-zinc-600 mt-0.5">{entryIcon(entry.type)}</span>
            <span className="text-zinc-400">{entry.description}</span>
            <span className="ml-auto text-zinc-700 shrink-0">
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────
const CombatTracker: React.FC = () => {
  const { activeEncounter, nextTurn, endCombat, updateCombatant, addCombatLogEntry } = useCampaign();
  const [endConfirm, setEndConfirm] = useState(false);
  const [ending, setEnding] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  if (!activeEncounter) {
    return (
      <div className="text-center py-20 text-zinc-600">
        <Swords size={36} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">No active encounter.</p>
      </div>
    );
  }

  const { combatants, currentTurnIndex, round, log } = activeEncounter;
  const activeCombatant = combatants[currentTurnIndex];

  const handleHpChange = async (combatantId: string, oldHp: number, newHp: number, name: string) => {
    await updateCombatant(combatantId, { hp: newHp });
    const delta = newHp - oldHp;
    await addCombatLogEntry({
      timestamp: Date.now(),
      type: delta < 0 ? 'damage' : 'heal',
      actorName: name,
      description: delta < 0
        ? `${name} takes ${Math.abs(delta)} damage (${newHp}/${combatants.find(c => c.id === combatantId)?.maxHp ?? '?'} HP remaining)`
        : `${name} heals ${delta} HP (${newHp}/${combatants.find(c => c.id === combatantId)?.maxHp ?? '?'} HP)`,
    });
  };

  const handleConditionAdd = async (combatantId: string, condition: string, name: string) => {
    const c = combatants.find(cb => cb.id === combatantId);
    if (!c || c.conditions.includes(condition)) return;
    await updateCombatant(combatantId, { conditions: [...c.conditions, condition] });
    await addCombatLogEntry({
      timestamp: Date.now(),
      type: 'condition',
      actorName: name,
      description: `${name} is now ${condition}`,
    });
  };

  const handleConditionRemove = async (combatantId: string, condition: string, name: string) => {
    const c = combatants.find(cb => cb.id === combatantId);
    if (!c) return;
    await updateCombatant(combatantId, { conditions: c.conditions.filter(con => con !== condition) });
    await addCombatLogEntry({
      timestamp: Date.now(),
      type: 'condition',
      actorName: name,
      description: `${name} is no longer ${condition}`,
    });
  };

  const handleNextTurn = async () => {
    if (advancing) return;
    setAdvancing(true);
    try {
      await nextTurn();
    } finally {
      setAdvancing(false);
    }
  };

  const handleEndCombat = async () => {
    if (ending) return;
    setEnding(true);
    try {
      await endCombat();
    } finally {
      setEnding(false);
      setEndConfirm(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header + controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white leading-tight">{activeEncounter.name}</h2>
          <div className="flex items-center gap-3 mt-1 text-xs">
            <span className="text-amber-400 font-bold">Round {round}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500">
              Turn {currentTurnIndex + 1}/{combatants.length}
              {activeCombatant ? ` — ${activeCombatant.name}` : ''}
            </span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {!endConfirm ? (
            <>
              <button
                onClick={handleNextTurn}
                disabled={advancing}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-bold rounded-xl transition-colors"
              >
                <SkipForward size={14} />
                {advancing ? 'Advancing…' : 'Next Turn'}
              </button>
              <button
                onClick={() => setEndConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-sm font-bold rounded-xl transition-colors border border-zinc-700"
              >
                <XCircle size={14} />
                End Combat
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400 font-bold">End this encounter?</span>
              <button
                onClick={handleEndCombat}
                disabled={ending}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors"
              >
                {ending ? 'Ending…' : 'Confirm'}
              </button>
              <button
                onClick={() => setEndConfirm(false)}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Initiative order */}
      <div className="space-y-2">
        {combatants.map((combatant, idx) => (
          <CombatantRow
            key={combatant.id}
            combatant={combatant}
            isActive={idx === currentTurnIndex}
            onHpChange={newHp => handleHpChange(combatant.id, combatant.hp, newHp, combatant.name)}
            onConditionAdd={cond => handleConditionAdd(combatant.id, cond, combatant.name)}
            onConditionRemove={cond => handleConditionRemove(combatant.id, cond, combatant.name)}
          />
        ))}
      </div>

      {/* Combat log */}
      <CombatLog log={log ?? []} />
    </div>
  );
};

export default CombatTracker;
