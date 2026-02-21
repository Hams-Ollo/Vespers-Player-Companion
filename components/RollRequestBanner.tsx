import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCampaign } from '../contexts/CampaignContext';
import { rollDice } from '../lib/dice';
import { RollResult } from '../types';
import { Dice5, Check } from 'lucide-react';

type RollMode = 'normal' | 'advantage' | 'disadvantage';

const RollRequestBanner: React.FC = () => {
  const { user } = useAuth();
  const { rollRequests, submitRollResponse } = useCampaign();

  const [result, setResult] = useState<RollResult | null>(null);
  const [modifier, setModifier] = useState('0');
  const [mode, setMode] = useState<RollMode>('normal');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentReqId, setCurrentReqId] = useState<string | null>(null);

  // Find the earliest unanswered request for this player
  const pending = rollRequests.filter(
    r =>
      user &&
      r.targetUids.includes(user.uid) &&
      !r.responses.find(resp => resp.uid === user.uid),
  );
  const req = pending[pending.length - 1] ?? null; // oldest first (list is createdAt desc)

  // Reset state whenever the request changes
  useEffect(() => {
    if (req && req.id !== currentReqId) {
      setCurrentReqId(req.id);
      setResult(null);
      setModifier('0');
      setMode('normal');
      setSubmitted(false);
    }
  }, [req, currentReqId]);

  if (!req || !user) return null;

  const handleRoll = () => {
    const mod = parseInt(modifier, 10) || 0;
    const rolled = rollDice('1d20', mod, mode);
    setResult(rolled);
  };

  const handleSubmit = async () => {
    if (!result) return;
    setSubmitting(true);
    try {
      await submitRollResponse(req.id, {
        uid: user.uid,
        displayName: user.displayName ?? 'Player',
        result,
        timestamp: Date.now(),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const passed = req.dc ? (result?.total ?? 0) >= req.dc : true;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <div
        className="w-full max-w-md bg-zinc-950 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-900/20 pointer-events-auto overflow-hidden"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-zinc-800">
          <div className="w-7 h-7 bg-amber-900/30 border border-amber-500/40 rounded-full flex items-center justify-center shrink-0">
            <Dice5 size={14} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm leading-tight">{req.type}</div>
            <div className="text-zinc-500 text-xs">Your Dungeon Master is requesting a roll</div>
          </div>
          {req.dc && (
            <div className="shrink-0 text-center px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-0.5">DC</div>
              <div className="text-white font-black text-base leading-none">{req.dc}</div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {submitted ? (
            // ── Submitted state ──
            <div className="flex flex-col items-center gap-2 py-3">
              <div className="w-10 h-10 bg-green-900/30 border border-green-500/40 rounded-full flex items-center justify-center">
                <Check size={20} className="text-green-400" />
              </div>
              <div className="text-white font-bold">Result Submitted!</div>
              <div className="text-zinc-500 text-sm">
                Your roll of <strong className="text-white">{result?.total}</strong> has been sent to your DM.
              </div>
            </div>
          ) : result ? (
            // ── Result shown, awaiting confirm ──
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-5">
                <div
                  className={`text-center px-6 py-4 rounded-2xl border-2 ${
                    req.dc
                      ? passed
                        ? 'bg-green-900/20 border-green-500/50'
                        : 'bg-red-900/20 border-red-500/50'
                      : 'bg-zinc-900 border-zinc-700'
                  }`}
                >
                  <div className={`text-6xl font-black leading-none ${req.dc ? (passed ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
                    {result.total}
                  </div>
                  {req.dc && (
                    <div className={`text-sm font-bold mt-1 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                      {passed ? 'SUCCESS' : 'FAILURE'}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center text-xs text-zinc-600">
                {result.expression} → {result.diceGroups?.map(g => `[${g.rolls.join(', ')}]`).join(' + ')}{result.modifier !== 0 ? ` + ${result.modifier}` : ''}
                {mode !== 'normal' && (
                  <span className="ml-2 text-amber-500 capitalize">({mode})</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 py-2.5 text-sm font-bold text-zinc-400 bg-zinc-900 border border-zinc-700 rounded-xl hover:border-zinc-600 transition-colors"
                >
                  Reroll
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? 'Sending…' : 'Submit Roll'}
                </button>
              </div>
            </div>
          ) : (
            // ── Pre-roll ──
            <div className="space-y-3">
              {/* Roll mode */}
              <div className="flex gap-2">
                {(['normal', 'advantage', 'disadvantage'] as RollMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 capitalize text-xs py-2 rounded-xl border font-bold transition-all ${
                      mode === m
                        ? m === 'advantage'
                          ? 'bg-green-900/30 border-green-500/50 text-green-300'
                          : m === 'disadvantage'
                          ? 'bg-red-900/30 border-red-500/50 text-red-300'
                          : 'bg-zinc-700 border-zinc-600 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Modifier */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Modifier</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModifier(v => String((parseInt(v, 10) || 0) - 1))}
                    className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-lg font-bold hover:bg-zinc-700 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={modifier}
                    onChange={e => setModifier(e.target.value)}
                    aria-label="Modifier value"
                    title="Modifier value"
                    placeholder="0"
                    className="w-14 text-center bg-zinc-800 border border-zinc-700 rounded-xl py-1.5 text-sm text-white font-bold focus:outline-none focus:border-amber-500/50"
                  />
                  <button
                    onClick={() => setModifier(v => String((parseInt(v, 10) || 0) + 1))}
                    className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-lg font-bold hover:bg-zinc-700 transition-colors"
                  >
                    +
                  </button>
                </div>
                {pending.length > 1 && (
                  <span className="ml-auto text-xs text-amber-500 font-bold">+{pending.length - 1} more pending</span>
                )}
              </div>

              {/* Roll button */}
              <button
                onClick={handleRoll}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-base rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30"
              >
                <Dice5 size={18} />
                Roll 1d20{modifier !== '0' && modifier !== '' ? ` ${parseInt(modifier, 10) >= 0 ? '+' : ''}${modifier}` : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RollRequestBanner;
