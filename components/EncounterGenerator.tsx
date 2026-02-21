import React, { useState } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { generateEncounter } from '../lib/gemini';
import {
  CampaignMemberCharacterSummary,
  GeneratedEncounterResponse,
  GeneratedCreature,
  Combatant,
  CombatantType,
} from '../types';
import {
  Swords, Wand2, Loader2, ChevronDown, ChevronUp, Play, AlertTriangle, Shield,
} from 'lucide-react';

interface Props {
  partyCharacters: Map<string, CampaignMemberCharacterSummary>;
}

const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',   color: 'text-green-400',  bg: 'bg-green-900/20 border-green-500/40'  },
  { id: 'medium', label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-500/40' },
  { id: 'hard',   label: 'Hard',   color: 'text-orange-400', bg: 'bg-orange-900/20 border-orange-500/40' },
  { id: 'deadly', label: 'Deadly', color: 'text-red-400',    bg: 'bg-red-900/20 border-red-500/40'      },
] as const;

const ENVIRONMENTS = [
  'Dungeon', 'Forest', 'Mountain', 'Cave', 'City', 'Tavern',
  'Underdark', 'Coastal', 'Desert', 'Arctic', 'Swamp', 'Ruins', 'Planar',
];

function rollInitiative(dexMod: number): number {
  return Math.floor(Math.random() * 20) + 1 + dexMod;
}

function buildMonsterCombatants(creatures: GeneratedCreature[]): Combatant[] {
  return creatures.flatMap(creature =>
    Array.from({ length: creature.count }, (_, i) => {
      const dex = creature.statBlock.abilityScores?.DEX ?? 10;
      const dexMod = Math.floor((dex - 10) / 2);
      return {
        id: `monster-${Date.now()}-${Math.random().toString(36).slice(2)}-${i}`,
        name: creature.count > 1 ? `${creature.name} ${i + 1}` : creature.name,
        initiative: rollInitiative(dexMod),
        hp: creature.statBlock.hp ?? 10,
        maxHp: creature.statBlock.hp ?? 10,
        ac: creature.statBlock.ac ?? 10,
        type: 'monster' as CombatantType,
        conditions: [],
        statBlock: creature.statBlock,
      };
    }),
  );
}

// ─── Stat Block Panel ────────────────────────────────────────────────
const STAT_KEYS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;

const StatBlockPanel: React.FC<{ creature: GeneratedCreature }> = ({ creature }) => {
  const [expanded, setExpanded] = useState(false);
  const sb = creature.statBlock;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/40 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm">{creature.name}</span>
            {creature.count > 1 && (
              <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full font-bold">×{creature.count}</span>
            )}
            {sb.cr && (
              <span className="text-xs bg-amber-900/30 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                CR {sb.cr}
              </span>
            )}
            {sb.xp != null && (
              <span className="text-xs text-zinc-500">{(sb.xp * creature.count).toLocaleString()} XP</span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 italic truncate">
            {[sb.size, sb.creatureType, sb.alignment].filter(Boolean).join(', ')}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-400 shrink-0">
          {sb.ac != null && (
            <span className="flex items-center gap-1" title="Armor Class">
              <Shield size={11} className="text-blue-400" />{sb.ac}
            </span>
          )}
          {sb.hp != null && (
            <span className="flex items-center gap-1" title="Hit Points">
              <span className="text-red-400 text-base leading-none">♥</span>{sb.hp}
            </span>
          )}
          {expanded
            ? <ChevronUp size={14} className="text-zinc-500" />
            : <ChevronDown size={14} className="text-zinc-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-zinc-800 text-xs">
          {/* Ability scores */}
          {sb.abilityScores && (
            <div className="grid grid-cols-6 gap-1 mt-3">
              {STAT_KEYS.map(stat => {
                const val = sb.abilityScores![stat] ?? 10;
                const mod = Math.floor((val - 10) / 2);
                return (
                  <div key={stat} className="bg-zinc-800 rounded-lg p-2 text-center">
                    <div className="text-zinc-500 font-bold" style={{ fontSize: '9px' }}>{stat}</div>
                    <div className="text-white font-black text-sm leading-tight">{val}</div>
                    <div className="text-zinc-400" style={{ fontSize: '10px' }}>
                      {mod >= 0 ? `+${mod}` : mod}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Speed / Senses */}
          {(sb.speed || sb.senses) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-400">
              {sb.speed && <span><span className="text-zinc-600">Speed </span>{sb.speed}</span>}
              {sb.senses && <span><span className="text-zinc-600">Senses </span>{sb.senses}</span>}
            </div>
          )}

          {/* Damage / Condition immunities */}
          {((sb.damageImmunities?.length ?? 0) > 0 || (sb.conditionImmunities?.length ?? 0) > 0) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-400">
              {(sb.damageImmunities?.length ?? 0) > 0 && (
                <span><span className="text-zinc-600">Damage Immunities </span>{sb.damageImmunities!.join(', ')}</span>
              )}
              {(sb.conditionImmunities?.length ?? 0) > 0 && (
                <span><span className="text-zinc-600">Condition Immunities </span>{sb.conditionImmunities!.join(', ')}</span>
              )}
            </div>
          )}

          {/* Traits */}
          {(sb.traits?.length ?? 0) > 0 && (
            <div className="space-y-1 text-zinc-400">
              {sb.traits!.map((trait, i) => (
                <p key={i}>
                  <span className="font-bold text-zinc-200 italic">{trait.name}. </span>
                  {trait.description}
                </p>
              ))}
            </div>
          )}

          {/* Attacks */}
          {(sb.attacks?.length ?? 0) > 0 && (
            <div className="space-y-1.5">
              <div className="text-zinc-500 font-bold uppercase tracking-widest" style={{ fontSize: '9px' }}>
                Actions
              </div>
              {sb.attacks.map((atk, i) => (
                <div key={i} className="bg-zinc-800/80 rounded-lg p-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-zinc-200">{atk.name}.</span>
                    <span className="text-zinc-500 italic">
                      {atk.reach ? `Melee Weapon Attack` : 'Ranged Weapon Attack'},
                    </span>
                    <span className="text-green-400 font-bold">
                      {atk.attackBonus >= 0 ? '+' : ''}{atk.attackBonus} to hit
                    </span>
                    <span className="text-zinc-500">{atk.reach ?? atk.range}, {atk.targets}.</span>
                  </div>
                  <div className="text-zinc-400 mt-0.5">
                    <span className="text-zinc-500">Hit: </span>
                    <span className="text-amber-400 font-bold">{atk.damageExpression}</span>
                    {' '}{atk.damageType} damage
                    {atk.additionalEffects ? `. ${atk.additionalEffects}` : '.'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tactics */}
          {creature.tacticsNotes && (
            <div className="bg-amber-900/10 border border-amber-500/20 rounded-lg p-2.5 text-amber-200/80 leading-relaxed">
              <span className="font-bold text-amber-400">⚔ Tactics: </span>
              {creature.tacticsNotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────
const EncounterGenerator: React.FC<Props> = ({ partyCharacters }) => {
  const { startEncounter } = useCampaign();

  const [scenario, setScenario] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'deadly'>('medium');
  const [environment, setEnvironment] = useState('');
  const [encounter, setEncounter] = useState<GeneratedEncounterResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);

  const partyList = Array.from(partyCharacters.values());
  const partyLevels = partyList.map(c => c.level);
  const partyClasses = partyList.map(c => c.class);

  const handleGenerate = async () => {
    if (!scenario.trim()) return;
    setLoading(true);
    setError(null);
    setEncounter(null);
    try {
      const result = await generateEncounter({
        scenarioDescription: scenario,
        partyLevels,
        partyClasses,
        difficulty,
        environment: environment || undefined,
      });
      setEncounter(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate encounter');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async () => {
    if (!encounter) return;
    setLaunching(true);
    setError(null);
    try {
      const partyCombatants: Combatant[] = partyList.map(char => ({
        id: `pc-${char.id}`,
        name: char.name,
        initiative: rollInitiative(char.initiative),
        hp: char.hpCurrent,
        maxHp: char.hpMax,
        ac: char.ac,
        type: 'pc' as CombatantType,
        characterId: char.id,
        conditions: [],
      }));

      const monsterCombatants = buildMonsterCombatants(encounter.creatures ?? []);
      const allCombatants = [...partyCombatants, ...monsterCombatants]
        .sort((a, b) => b.initiative - a.initiative);

      await startEncounter(encounter.name, allCombatants);
      // CampaignContext subscription will switch DMDashboard to CombatTracker automatically
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to launch encounter');
      setLaunching(false);
    }
  };

  const diffConf = DIFFICULTIES.find(d => d.id === difficulty)!;

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
      {/* ── Left Panel: Form ── */}
      <div className="space-y-5">
        {/* Scenario */}
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
            Scenario Description
          </label>
          <textarea
            value={scenario}
            onChange={e => setScenario(e.target.value)}
            placeholder="Describe the encounter situation… e.g. 'The party disturbs a wight protecting an ancient tomb. Skeletal guardians animate in alcoves around the chamber.'"
            rows={5}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none leading-relaxed"
          />
        </div>

        {/* Party summary */}
        {partyList.length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3.5">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
              Party ({partyList.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {partyList.map(c => (
                <span key={c.id} className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg">
                  {c.name}
                  <span className="text-zinc-500 ml-1">Lv.{c.level} {c.class}</span>
                </span>
              ))}
            </div>
            {partyList.length === 0 && (
              <p className="text-xs text-zinc-600">No party members. XP budget will use average.</p>
            )}
          </div>
        )}

        {/* Difficulty */}
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
            Difficulty
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  difficulty === d.id
                    ? `${d.bg} ${d.color}`
                    : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Environment chips */}
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
            Environment <span className="text-zinc-700 font-normal">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ENVIRONMENTS.map(env => (
              <button
                key={env}
                onClick={() => setEnvironment(environment === env ? '' : env)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  environment === env
                    ? 'bg-amber-900/30 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!scenario.trim() || loading}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
        >
          {loading
            ? <><Loader2 size={15} className="animate-spin" /> Generating…</>
            : <><Wand2 size={15} /> Generate Encounter</>}
        </button>
      </div>

      {/* ── Right Panel: Results ── */}
      <div className="min-h-[400px]">
        {error && (
          <div className="flex items-start gap-2.5 p-4 mb-4 bg-red-900/20 border border-red-500/30 rounded-xl text-sm text-red-300">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {!encounter && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20 p-8">
            <Swords size={40} className="text-zinc-700 mb-4" />
            <p className="text-zinc-500 text-sm leading-relaxed">
              Describe an encounter and hit <strong className="text-zinc-400">Generate Encounter</strong>.<br />
              The AI will design a balanced encounter using the Monster Manual.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-zinc-500 border border-zinc-800/50 rounded-2xl">
            <Loader2 size={32} className="animate-spin text-amber-500" />
            <p className="text-sm">Consulting the Monster Manual…</p>
            <p className="text-xs text-zinc-600">Building stat blocks and tactics</p>
          </div>
        )}

        {encounter && !loading && (
          <div className="space-y-4">
            {/* Encounter header card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-lg font-black text-white leading-tight">{encounter.name}</h2>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs">
                    <span className={`font-black uppercase tracking-wide ${diffConf.color}`}>
                      {encounter.difficultyRating ?? difficulty}
                    </span>
                    {encounter.totalXP != null && (
                      <>
                        <span className="text-zinc-700">·</span>
                        <span className="text-zinc-500">
                          {encounter.totalXP.toLocaleString()} XP raw
                        </span>
                      </>
                    )}
                    {encounter.adjustedXP != null && (
                      <>
                        <span className="text-zinc-700">·</span>
                        <span className="text-zinc-400 font-semibold">
                          {encounter.adjustedXP.toLocaleString()} XP adjusted
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLaunch}
                  disabled={launching}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-bold rounded-xl transition-colors shrink-0"
                >
                  {launching
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Play size={14} />}
                  Launch Combat
                </button>
              </div>

              {/* Narrative hook */}
              {encounter.narrativeHook && (
                <blockquote className="mt-4 pl-4 border-l-2 border-amber-500/40 italic text-zinc-400 text-sm leading-relaxed">
                  {encounter.narrativeHook}
                </blockquote>
              )}

              {/* Terrain features */}
              {(encounter.terrainFeatures?.length ?? 0) > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    Terrain Features
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {encounter.terrainFeatures!.map((tf, i) => (
                      <span
                        key={i}
                        className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg border border-zinc-700"
                      >
                        {tf}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Creature list */}
            {(encounter.creatures?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Creatures — {encounter.creatures!.reduce((s, c) => s + c.count, 0)} combatants
                </div>
                {encounter.creatures!.map((creature, i) => (
                  <StatBlockPanel key={i} creature={creature} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EncounterGenerator;
