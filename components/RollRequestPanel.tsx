import React, { useState } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { RollRequest } from '../types';
import { Dice5, Users, User, Send, Check, X, Clock, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Preset roll categories ───────────────────────────────────────────
const PRESET_ROLLS: { group: string; rolls: string[] }[] = [
  { group: 'Saving Throws',  rolls: ['STR Save', 'DEX Save', 'CON Save', 'INT Save', 'WIS Save', 'CHA Save'] },
  { group: 'Perception',     rolls: ['Perception Check', 'Investigation Check', 'Insight Check'] },
  { group: 'Stealth',        rolls: ['Stealth Check', 'Sleight of Hand', 'Acrobatics Check'] },
  { group: 'Social',         rolls: ['Deception Check', 'Persuasion Check', 'Intimidation Check', 'Performance Check'] },
  { group: 'Knowledge',      rolls: ['Arcana Check', 'History Check', 'Religion Check', 'Nature Check', 'Medicine Check'] },
  { group: 'Physical',       rolls: ['Athletics Check', 'Strength Check', 'Constitution Check', 'Animal Handling'] },
  { group: 'Other',          rolls: ['Survival Check', 'Initiative Roll', 'Death Save', 'Concentration Check'] },
];

// ─── Single request row ───────────────────────────────────────────────
const RequestRow: React.FC<{ req: RollRequest; members: { uid: string; displayName: string }[] }> = ({ req, members }) => {
  const [expanded, setExpanded] = useState(false);

  const getDisplayName = (uid: string) =>
    members.find(m => m.uid === uid)?.displayName ?? uid.slice(0, 8);

  const pending = req.targetUids.filter(
    uid => !req.responses.find(r => r.uid === uid),
  );

  const age = Date.now() - req.createdAt;
  const mins = Math.floor(age / 60000);
  const timeStr = mins < 1 ? 'just now' : mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 p-3.5 hover:bg-zinc-800/40 transition-colors text-left"
      >
        <Dice5 size={14} className="text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white">{req.type}</span>
            {req.dc && (
              <span className="text-xs bg-zinc-800 text-zinc-400 border border-zinc-700 px-1.5 py-0.5 rounded-full">
                DC {req.dc}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
            <span>{req.responses.length}/{req.targetUids.length} responded</span>
            <span>·</span>
            <span>{timeStr}</span>
            {pending.length > 0 && (
              <>
                <span>·</span>
                <span className="text-amber-500 font-medium">Waiting: {pending.map(getDisplayName).join(', ')}</span>
              </>
            )}
          </div>
        </div>
        {expanded ? <ChevronUp size={13} className="text-zinc-600 shrink-0" /> : <ChevronDown size={13} className="text-zinc-600 shrink-0" />}
      </button>

      {expanded && req.responses.length > 0 && (
        <div className="border-t border-zinc-800 px-4 pb-3 pt-2 space-y-1.5">
          {req.responses.map((resp, i) => {
            const passed = req.dc ? resp.result.total >= req.dc : true;
            return (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="text-zinc-400 font-medium">{resp.displayName}</span>
                <span className="font-black text-white text-base leading-none">{resp.result.total}</span>
                <span className="text-zinc-600">({resp.result.expression})</span>
                {req.dc && (
                  <span className={`ml-auto font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                    {passed ? <Check size={13} /> : <X size={13} />}
                    {passed ? 'Pass' : 'Fail'}
                  </span>
                )}
              </div>
            );
          })}
          {pending.map(uid => (
            <div key={uid} className="flex items-center gap-3 text-xs text-zinc-600">
              <span>{getDisplayName(uid)}</span>
              <span className="italic ml-auto flex items-center gap-1">
                <Clock size={10} />waiting…
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main panel ───────────────────────────────────────────────────────
interface Props {
  members: { uid: string; displayName: string; role: string }[];
}

const RollRequestPanel: React.FC<Props> = ({ members }) => {
  const { rollRequests, sendRollRequest } = useCampaign();

  const [rollType, setRollType] = useState('');
  const [dc, setDc] = useState('');
  const [targetAll, setTargetAll] = useState(true);
  const [targetUids, setTargetUids] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const players = members.filter(m => m.role === 'player');

  const effectiveTargets = targetAll ? players.map(p => p.uid) : targetUids;

  const handleSend = async () => {
    const type = rollType.trim();
    if (!type || effectiveTargets.length === 0) return;
    setSending(true);
    try {
      await sendRollRequest(type, effectiveTargets, dc ? parseInt(dc, 10) : undefined);
      setRollType('');
      setDc('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Create panel ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Request a Roll</h3>

        {/* Preset grid */}
        <div className="space-y-2">
          {PRESET_ROLLS.map(group => (
            <div key={group.group}>
              <button
                onClick={() => setOpenGroup(openGroup === group.group ? null : group.group)}
                className="w-full flex items-center justify-between text-xs font-bold text-zinc-600 uppercase tracking-widest py-1 hover:text-zinc-400 transition-colors"
              >
                {group.group}
                {openGroup === group.group ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
              {openGroup === group.group && (
                <div className="flex flex-wrap gap-1.5 pt-1 pb-1">
                  {group.rolls.map(r => (
                    <button
                      key={r}
                      onClick={() => setRollType(r)}
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                        rollType === r
                          ? 'bg-amber-900/40 border-amber-500/60 text-amber-300'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Custom type input */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={rollType}
            onChange={e => setRollType(e.target.value)}
            placeholder="Or type custom roll…"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500 font-bold">DC</span>
            <input
              type="number"
              min="1"
              max="30"
              value={dc}
              onChange={e => setDc(e.target.value)}
              placeholder="–"
              className="w-14 bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 text-center"
            />
          </div>
        </div>

        {/* Target selector */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Target Players</div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTargetAll(true)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-bold transition-all ${
                targetAll
                  ? 'bg-blue-900/30 border-blue-500/50 text-blue-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              <Users size={11} />All ({players.length})
            </button>
            <button
              onClick={() => setTargetAll(false)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-bold transition-all ${
                !targetAll
                  ? 'bg-blue-900/30 border-blue-500/50 text-blue-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              <User size={11} />Specific
            </button>
          </div>
          {!targetAll && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {players.map(p => (
                <button
                  key={p.uid}
                  onClick={() =>
                    setTargetUids(prev =>
                      prev.includes(p.uid) ? prev.filter(u => u !== p.uid) : [...prev, p.uid],
                    )
                  }
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                    targetUids.includes(p.uid)
                      ? 'bg-amber-900/30 border-amber-500/50 text-amber-300'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  {p.displayName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={sending || !rollType.trim() || effectiveTargets.length === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <Send size={13} />
          {sending ? 'Sending…' : `Request Roll${!targetAll && targetUids.length > 0 ? ` (${targetUids.length})` : ''}`}
        </button>
      </div>

      {/* ── Recent requests ── */}
      {rollRequests.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Recent Requests</div>
          {rollRequests.slice(0, 10).map(req => (
            <RequestRow key={req.id} req={req} members={members} />
          ))}
        </div>
      )}

      {rollRequests.length === 0 && (
        <div className="text-center py-8 text-zinc-700 text-sm border border-dashed border-zinc-800 rounded-xl">
          No roll requests sent yet this session.
        </div>
      )}
    </div>
  );
};

export default RollRequestPanel;
