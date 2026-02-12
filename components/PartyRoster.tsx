import React, { useState, useEffect } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { useAuth } from '../contexts/AuthContext';
import { CharacterData, CampaignMember } from '../types';
import { Heart, Shield, Crown, User, Users, Swords, Copy, Check, Loader2, UserMinus } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firestore';

interface PartyMemberCard {
  member: CampaignMember;
  character: CharacterData | null;
  loading: boolean;
}

const PartyRoster: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const { activeCampaign, members, isDM, removeMember } = useCampaign();
  const [partyCards, setPartyCards] = useState<PartyMemberCard[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [removingUid, setRemovingUid] = useState<string | null>(null);

  // Fetch character data for each member
  useEffect(() => {
    if (!members.length) {
      setPartyCards([]);
      return;
    }

    // Initialize cards with loading state
    setPartyCards(members.map(m => ({ member: m, character: null, loading: !!m.characterId })));

    // Fetch characters for members that have characterId
    members.forEach(async (member) => {
      if (!member.characterId) return;
      try {
        const charDoc = await getDoc(doc(db, 'characters', member.characterId));
        if (charDoc.exists()) {
          const charData = { id: charDoc.id, ...charDoc.data() } as CharacterData;
          setPartyCards(prev =>
            prev.map(c => c.member.uid === member.uid ? { ...c, character: charData, loading: false } : c)
          );
        } else {
          setPartyCards(prev =>
            prev.map(c => c.member.uid === member.uid ? { ...c, loading: false } : c)
          );
        }
      } catch {
        setPartyCards(prev =>
          prev.map(c => c.member.uid === member.uid ? { ...c, loading: false } : c)
        );
      }
    });
  }, [members]);

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
          {partyCards.map(({ member, character, loading }) => {
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

                    {loading ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Loader2 size={10} className="animate-spin text-zinc-600" />
                        <span className="text-[10px] text-zinc-600">Loading...</span>
                      </div>
                    ) : character ? (
                      <>
                        <p className="text-xs text-zinc-500 truncate">
                          {character.race} {character.class} &middot; Lvl {character.level}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <Heart size={10} className="text-red-500" />
                            <span className="text-[10px] font-mono font-bold text-zinc-400">
                              {character.hp?.current ?? 0}/{character.hp?.max ?? 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield size={10} className="text-blue-500" />
                            <span className="text-[10px] font-mono font-bold text-zinc-400">
                              {character.ac ?? 10}
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
    </div>
  );
};

export default PartyRoster;
