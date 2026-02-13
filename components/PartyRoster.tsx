import React, { useEffect, useMemo, useState } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { useAuth } from '../contexts/AuthContext';
import { CampaignChatMessage, CampaignMember, CampaignMemberCharacterSummary, Whisper } from '../types';
import { Heart, Shield, Crown, User, Users, Swords, Copy, Check, UserMinus, Eye, X, MessageCircle, Send, Lock, Loader2 } from 'lucide-react';
import {
  markWhisperRead,
  sendCampaignMessage,
  sendWhisper,
  subscribeToCampaignMessages,
  subscribeToWhispers,
  subscribeToWhisperThread,
} from '../lib/campaigns';

interface PartyMemberCard {
  member: CampaignMember;
  character: CampaignMemberCharacterSummary | null;
}

const PartyRoster: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const { activeCampaign, members, isDM, removeMember } = useCampaign();
  const [copiedCode, setCopiedCode] = useState(false);
  const [removingUid, setRemovingUid] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<PartyMemberCard | null>(null);
  const [activeChatTab, setActiveChatTab] = useState<'round_table' | 'party_private' | 'whisper_dm' | 'dm_whispers'>('round_table');
  const [roundTableMessages, setRoundTableMessages] = useState<CampaignChatMessage[]>([]);
  const [partyPrivateMessages, setPartyPrivateMessages] = useState<CampaignChatMessage[]>([]);
  const [whisperMessages, setWhisperMessages] = useState<Whisper[]>([]);
  const [dmWhispers, setDmWhispers] = useState<Whisper[]>([]);
  const [selectedWhisperTarget, setSelectedWhisperTarget] = useState<string>('');
  const [chatInput, setChatInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const partyCards = useMemo<PartyMemberCard[]>(
    () => members.map(member => ({ member, character: member.characterSummary || null })),
    [members],
  );

  const dmMember = useMemo(() => members.find(m => m.role === 'dm') || null, [members]);

  useEffect(() => {
    if (!activeCampaign?.id || !user?.uid) return;

    const unsubs: Array<() => void> = [];

    unsubs.push(
      subscribeToCampaignMessages(
        activeCampaign.id,
        'round_table',
        setRoundTableMessages,
      ),
    );

    if (!isDM) {
      unsubs.push(
        subscribeToCampaignMessages(
          activeCampaign.id,
          'party_private',
          setPartyPrivateMessages,
        ),
      );
    } else {
      setPartyPrivateMessages([]);
    }

    if (!isDM && dmMember?.uid) {
      unsubs.push(
        subscribeToWhisperThread(
          activeCampaign.id,
          user.uid,
          dmMember.uid,
          (thread) => {
            setWhisperMessages(thread);
            thread
              .filter(message => message.toUid === user.uid && !message.read)
              .forEach(message => {
                markWhisperRead(activeCampaign.id, message.id).catch(() => undefined);
              });
          },
        ),
      );
    } else {
      setWhisperMessages([]);
    }

    if (isDM && user?.uid) {
      unsubs.push(
        subscribeToWhispers(
          activeCampaign.id,
          user.uid,
          (messages) => {
            setDmWhispers(messages);
            setSelectedWhisperTarget((current) => {
              if (current) return current;
              const first = messages[0];
              return first?.fromUid || '';
            });
            messages
              .filter(message => !message.read)
              .forEach(message => {
                markWhisperRead(activeCampaign.id, message.id).catch(() => undefined);
              });
          },
        ),
      );
    } else {
      setDmWhispers([]);
    }

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [activeCampaign?.id, user?.uid, isDM, dmMember?.uid]);

  const activeMessages = useMemo(() => {
    if (activeChatTab === 'round_table') return roundTableMessages;
    if (activeChatTab === 'party_private') return partyPrivateMessages;
    if (activeChatTab === 'dm_whispers') {
      if (!selectedWhisperTarget) return dmWhispers;
      return dmWhispers.filter(message => message.fromUid === selectedWhisperTarget);
    }
    return whisperMessages;
  }, [activeChatTab, roundTableMessages, partyPrivateMessages, whisperMessages, dmWhispers, selectedWhisperTarget]);

  const getSenderLabel = (fromUid: string, fallback?: string) => {
    if (fromUid === user?.uid) return 'You';
    const member = members.find(m => m.uid === fromUid);
    return fallback || member?.displayName || 'Unknown';
  };

  const handleSendMessage = async () => {
    if (!activeCampaign?.id || !user?.uid || !chatInput.trim()) return;
    setSendingMessage(true);
    try {
      if (activeChatTab === 'whisper_dm') {
        if (!dmMember?.uid) return;
        await sendWhisper(activeCampaign.id, user.uid, dmMember.uid, chatInput.trim());
      } else if (activeChatTab === 'dm_whispers') {
        if (!selectedWhisperTarget) return;
        await sendWhisper(activeCampaign.id, user.uid, selectedWhisperTarget, chatInput.trim());
      } else {
        await sendCampaignMessage(
          activeCampaign.id,
          activeChatTab,
          user.uid,
          user.displayName || 'Unknown Adventurer',
          chatInput.trim(),
        );
      }
      setChatInput('');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCopyCode = () => {
    if (activeCampaign?.joinCode) {
      navigator.clipboard.writeText(activeCampaign.joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRemoveMember = async (uid: string, name: string) => {
    if (!confirm(`Remove ${name} from the campaign? They can rejoin with the join code.`)) return;
    setRemovingUid(uid);
    try {
      await removeMember(uid);
    } catch (e: any) {
      alert(e.message || 'Failed to remove member');
    } finally {
      setRemovingUid(null);
    }
  };

  if (!activeCampaign) {
    return (
      <div className="p-6 text-center text-zinc-500">
        <p>No active campaign selected.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Campaign Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold text-white">{activeCampaign.name}</h2>
        {activeCampaign.description && (
          <p className="text-zinc-500 text-sm">{activeCampaign.description}</p>
        )}
        <div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
          <span>Session #{activeCampaign.currentSessionNumber || 1}</span>
          <span className="w-1 h-1 bg-zinc-700 rounded-full" />
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1Hover:text-zinc-300 transition-colors font-mono"
            title="Copy join code"
          >
            Code: <span className="text-amber-500 font-bold">{activeCampaign.joinCode}</span>
            {copiedCode ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* Party Members Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Users size={12} /> Party Members ({members.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {partyCards.map(({ member, character }) => {
            const isMe = member.uid === user?.uid;
            const memberIsDM = member.role === 'dm';

            return (
              <div
                key={member.uid}
                className={`bg-zinc-900/50 border rounded-xl p-4 transition-colors ${
                  isMe ? 'border-amber-500/30 ring-1 ring-amber-500/10' : 'border-zinc-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Portrait */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 shrink-0 bg-zinc-800 flex items-center justify-center">
                    {character?.portraitUrl ? (
                      <img src={character.portraitUrl} alt={character.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="text-zinc-600" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white truncate text-sm">
                        {character?.name || member.displayName}
                      </span>
                      {memberIsDM && (
                        <Crown size={12} className="text-amber-500 shrink-0" />
                      )}
                      {isMe && (
                        <span className="text-[9px] bg-amber-900/30 text-amber-500 px-1.5 py-0.5 rounded shrink-0">You</span>
                      )}
                    </div>

                    {character ? (
                      <>
                        <p className="text-xs text-zinc-500 truncate">
                          {character.race} {character.class} &middot; Lvl {character.level}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <Heart size={10} className="text-red-500" />
                            <span className="text-[10px] font-mono font-bold text-zinc-400">
                              {character.hpCurrent}/{character.hpMax}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield size={10} className="text-blue-500" />
                            <span className="text-[10px] font-mono font-bold text-zinc-400">
                              {character.ac}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-zinc-600 italic mt-0.5">
                        {memberIsDM ? 'Dungeon Master' : 'No character assigned'}
                      </p>
                    )}
                  </div>

                    {character && (
                      <button
                        onClick={() => setSelectedCard({ member, character })}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-900/20 transition-colors shrink-0 self-center"
                        title="View read-only character sheet"
                      >
                        <Eye size={14} />
                      </button>
                    )}

                  {/* DM Kick Button — only visible to DM, not on DM's own card */}
                  {isDM && !memberIsDM && !isMe && (
                    <button
                      onClick={() => handleRemoveMember(member.uid, character?.name || member.displayName)}
                      disabled={removingUid === member.uid}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-colors shrink-0 self-center"
                      title={`Remove ${character?.name || member.displayName} from campaign`}
                    >
                      {removingUid === member.uid ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <UserMinus size={14} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Encounter Banner */}
      {activeCampaign.activeEncounterId && (
        <div className="flex items-center gap-3 p-3 bg-red-900/20 border border-red-500/30 rounded-xl">
          <Swords size={16} className="text-red-400" />
          <span className="text-sm text-red-300 font-bold">Combat is active!</span>
        </div>
      )}

      {/* Party Chat */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <MessageCircle size={12} /> Party Channels
        </h3>

        <div className="flex p-1 bg-zinc-900/80 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveChatTab('round_table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeChatTab === 'round_table' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            The Round Table
          </button>
          {!isDM && (
            <button
              onClick={() => setActiveChatTab('party_private')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                activeChatTab === 'party_private' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Lock size={10} /> Party Private
            </button>
          )}
          {!isDM && (
            <button
              onClick={() => setActiveChatTab('whisper_dm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeChatTab === 'whisper_dm' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Whisper DM
            </button>
          )}
          {isDM && (
            <button
              onClick={() => setActiveChatTab('dm_whispers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeChatTab === 'dm_whispers' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Whispers
            </button>
          )}
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 space-y-3">
          {isDM && activeChatTab === 'dm_whispers' && (
            <select
              value={selectedWhisperTarget}
              onChange={(event) => setSelectedWhisperTarget(event.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">All players</option>
              {Array.from(new Set(dmWhispers.map(message => message.fromUid))).map(uid => {
                const member = members.find(item => item.uid === uid);
                return (
                  <option key={uid} value={uid}>
                    {member?.displayName || uid}
                  </option>
                );
              })}
            </select>
          )}

          <div className="h-52 overflow-y-auto space-y-2 pr-1">
            {activeMessages.length === 0 ? (
              <p className="text-xs text-zinc-600 italic text-center py-8">No messages yet.</p>
            ) : activeMessages.map((message) => {
              const fromUid = 'fromUid' in message ? message.fromUid : '';
              const isMine = fromUid === user?.uid;
              const sender = getSenderLabel(fromUid, 'fromDisplayName' in message ? message.fromDisplayName : undefined);
              return (
                <div
                  key={message.id}
                  className={`rounded-lg px-3 py-2 text-xs ${
                    isMine
                      ? 'bg-amber-900/30 border border-amber-500/20 ml-8'
                      : 'bg-zinc-950 border border-zinc-800 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-zinc-300">{sender}</span>
                    <span className="text-[10px] text-zinc-600">
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-zinc-400 whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                activeChatTab === 'round_table'
                  ? 'Message The Round Table...'
                  : activeChatTab === 'party_private'
                  ? 'Message party members (DM cannot see)...'
                  : activeChatTab === 'dm_whispers'
                  ? (selectedWhisperTarget ? 'Reply to selected player...' : 'Select a player to reply...')
                  : 'Whisper to the DM...'
              }
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={sendingMessage || !chatInput.trim() || (activeChatTab === 'dm_whispers' && !selectedWhisperTarget)}
              className="px-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg transition-colors"
              title="Send message"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Read-only member sheet preview */}
      {selectedCard?.character && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/60">
              <div>
                <h4 className="text-lg font-display font-bold text-white">
                  {selectedCard.character.name}
                </h4>
                <p className="text-xs text-zinc-500">
                  {selectedCard.character.race} {selectedCard.character.class} &middot; Lvl {selectedCard.character.level}
                </p>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Vitals</p>
                <p className="text-sm text-zinc-300 mt-2">HP {selectedCard.character.hpCurrent}/{selectedCard.character.hpMax}</p>
                <p className="text-sm text-zinc-300">AC {selectedCard.character.ac}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Combat</p>
                <p className="text-sm text-zinc-300 mt-2">
                  Initiative {selectedCard.character.initiative >= 0 ? '+' : ''}{selectedCard.character.initiative}
                </p>
                <p className="text-sm text-zinc-300">Attack: {selectedCard.character.primaryAttack || 'Unarmed Strike'}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Perception</p>
                <p className="text-sm text-zinc-300 mt-2">Passive {selectedCard.character.passivePerception}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 sm:col-span-2">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCard.character.keySkills.length > 0 ? selectedCard.character.keySkills.map(skill => (
                    <span key={skill.name} className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300">
                      {skill.name} {skill.modifier >= 0 ? '+' : ''}{skill.modifier}
                    </span>
                  )) : <span className="text-xs text-zinc-600">No skill data</span>}
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Features</p>
                <div className="mt-2 space-y-1">
                  {selectedCard.character.topFeatures.length > 0 ? selectedCard.character.topFeatures.map(feature => (
                    <p key={feature} className="text-xs text-zinc-300 truncate">• {feature}</p>
                  )) : <p className="text-xs text-zinc-600">No feature data</p>}
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 lg:col-span-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Journal</p>
                <p className="text-xs text-zinc-400 italic mt-2 line-clamp-3">
                  {selectedCard.character.journalPreview || 'No journal entry yet.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyRoster;
