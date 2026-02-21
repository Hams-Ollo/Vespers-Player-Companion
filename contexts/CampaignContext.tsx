import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Campaign,
  CampaignMember,
  CampaignMemberCharacterSummary,
  CampaignInvite,
  CombatEncounter,
  Combatant,
  CombatLogEntry,
  DMNote,
  CampaignRole,
} from '../types';
import { useAuth } from './AuthContext';
import { useCharacters } from './CharacterContext';
import {
  subscribeUserCampaigns,
  subscribeToCampaign,
  subscribeToMembers,
  subscribeToMyInvites,
  subscribeToActiveEncounter,
  subscribeToNotes,
  migrateCampaignMemberUids,
  createCampaign as firestoreCreateCampaign,
  updateCampaign as firestoreUpdateCampaign,
  archiveCampaign as firestoreArchiveCampaign,
  deleteCampaign as firestoreDeleteCampaign,
  joinCampaignByCode,
  leaveCampaign as firestoreLeaveCampaign,
  removeMember as firestoreRemoveMember,
  acceptInvite as firestoreAcceptInvite,
  declineInvite as firestoreDeclineInvite,
  createInvite as firestoreCreateInvite,
  updateMemberCharacter as firestoreUpdateMemberCharacter,
  regenerateJoinCode as firestoreRegenerateJoinCode,
  createEncounter as firestoreCreateEncounter,
  updateEncounter as firestoreUpdateEncounter,
  endEncounter as firestoreEndEncounter,
} from '../lib/campaigns';

// ─── Types ──────────────────────────────────────────────────────────

interface CampaignContextType {
  /** All campaigns the user is a member of */
  campaigns: Campaign[];
  /** The currently selected/active campaign */
  activeCampaign: Campaign | null;
  activeCampaignId: string | null;
  setActiveCampaignId: (id: string | null) => void;

  /** Members of the active campaign */
  members: CampaignMember[];
  /** Current user's role in the active campaign */
  myRole: CampaignRole | null;
  /** Whether current user is the DM of the active campaign */
  isDM: boolean;

  /** Active combat encounter (if any) */
  activeEncounter: CombatEncounter | null;

  /** DM notes for the active campaign */
  notes: DMNote[];

  /** Pending invites for the current user */
  pendingInvites: CampaignInvite[];

  /** Loading state */
  isLoading: boolean;

  // ── Actions ─────────────────────────────────────────────────────
  createCampaign: (name: string, description?: string) => Promise<Campaign>;
  updateCampaign: (updates: Partial<Pick<Campaign, 'name' | 'description' | 'settings' | 'currentSessionNumber'>>) => Promise<void>;
  archiveCampaign: () => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  joinByCode: (code: string, characterId?: string) => Promise<Campaign | null>;
  leaveCampaign: () => Promise<void>;
  acceptInvite: (inviteId: string, characterId?: string) => Promise<void>;
  declineInvite: (inviteId: string) => Promise<void>;
  sendInvite: (email: string) => Promise<void>;
  updateMemberCharacter: (characterId: string | null) => Promise<void>;
  removeMember: (targetUid: string) => Promise<void>;
  regenerateJoinCode: () => Promise<string>;

  // ── Combat Actions ────────────────────────────────────────────────
  startEncounter: (name: string, combatants: Combatant[]) => Promise<string>;
  updateCombatant: (combatantId: string, patch: Partial<Combatant>) => Promise<void>;
  nextTurn: () => Promise<void>;
  endCombat: () => Promise<void>;
  addCombatLogEntry: (entry: CombatLogEntry) => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

// ─── Local storage key for selected campaign ────────────────────────
const ACTIVE_CAMPAIGN_KEY = 'vesper_active_campaign';

// ─── Provider ───────────────────────────────────────────────────────
export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { characters, activeCharacterId, updateCharacterById } = useCharacters();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaignId, setActiveCampaignIdRaw] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_CAMPAIGN_KEY),
  );
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [members, setMembers] = useState<CampaignMember[]>([]);
  const [activeEncounter, setActiveEncounter] = useState<CombatEncounter | null>(null);
  const [notes, setNotes] = useState<DMNote[]>([]);
  const [pendingInvites, setPendingInvites] = useState<CampaignInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscription refs for cleanup
  const unsubCampaignsRef = useRef<(() => void) | null>(null);
  const unsubCampaignRef = useRef<(() => void) | null>(null);
  const unsubMembersRef = useRef<(() => void) | null>(null);
  const unsubEncounterRef = useRef<(() => void) | null>(null);
  const unsubNotesRef = useRef<(() => void) | null>(null);
  const unsubInvitesRef = useRef<(() => void) | null>(null);

  // Persist active campaign selection
  const setActiveCampaignId = useCallback((id: string | null) => {
    setActiveCampaignIdRaw(id);
    if (id) {
      localStorage.setItem(ACTIVE_CAMPAIGN_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_CAMPAIGN_KEY);
    }
  }, []);

  // ── Subscribe to user's campaigns list ───────────────────────────
  useEffect(() => {
    if (unsubCampaignsRef.current) {
      unsubCampaignsRef.current();
      unsubCampaignsRef.current = null;
    }

    if (!user?.uid) {
      setCampaigns([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // One-time migration: patch pre-memberUids campaigns, then subscribe
    migrateCampaignMemberUids(user.uid).finally(() => {
      const unsub = subscribeUserCampaigns(
        user.uid,
        (data) => {
          setCampaigns(data);
          setIsLoading(false);
        },
        (err) => {
          console.error('[CampaignContext] campaigns error:', err);
          setIsLoading(false);
        },
      );

      unsubCampaignsRef.current = unsub;
    });

    return () => {
      if (unsubCampaignsRef.current) {
        unsubCampaignsRef.current();
        unsubCampaignsRef.current = null;
      }
    };
  }, [user?.uid]);

  // ── Subscribe to active campaign details when selected ────────────
  useEffect(() => {
    // Cleanup previous subscriptions
    [unsubCampaignRef, unsubMembersRef, unsubEncounterRef, unsubNotesRef].forEach(ref => {
      if (ref.current) {
        ref.current();
        ref.current = null;
      }
    });

    if (!activeCampaignId) {
      setActiveCampaign(null);
      setMembers([]);
      setActiveEncounter(null);
      setNotes([]);
      return;
    }

    // Subscribe to campaign doc
    unsubCampaignRef.current = subscribeToCampaign(
      activeCampaignId,
      (campaign) => {
        setActiveCampaign(campaign);

        // If campaign has an active encounter, subscribe to it
        if (campaign?.activeEncounterId) {
          if (unsubEncounterRef.current) unsubEncounterRef.current();
          unsubEncounterRef.current = subscribeToActiveEncounter(
            activeCampaignId,
            campaign.activeEncounterId,
            setActiveEncounter,
          );
        } else {
          setActiveEncounter(null);
        }
      },
    );

    // Subscribe to members
    unsubMembersRef.current = subscribeToMembers(
      activeCampaignId,
      setMembers,
    );

    // Subscribe to notes
    unsubNotesRef.current = subscribeToNotes(
      activeCampaignId,
      setNotes,
    );

    return () => {
      [unsubCampaignRef, unsubMembersRef, unsubEncounterRef, unsubNotesRef].forEach(ref => {
        if (ref.current) {
          ref.current();
          ref.current = null;
        }
      });
    };
  }, [activeCampaignId]);

  // ── Subscribe to invites ──────────────────────────────────────────
  useEffect(() => {
    if (unsubInvitesRef.current) {
      unsubInvitesRef.current();
      unsubInvitesRef.current = null;
    }

    if (!user?.email) {
      setPendingInvites([]);
      return;
    }

    const unsub = subscribeToMyInvites(
      user.email,
      setPendingInvites,
    );

    unsubInvitesRef.current = unsub;
    return () => unsub();
  }, [user?.email]);

  // ── Derived state ─────────────────────────────────────────────────
  const myMembership = members.find(m => m.uid === user?.uid);
  const myRole = myMembership?.role ?? null;
  const isDM = myRole === 'dm';

  const buildCharacterSummary = useCallback(
    (characterId?: string): CampaignMemberCharacterSummary | undefined => {
      if (!characterId) return undefined;
      const character = characters.find(c => c.id === characterId);
      if (!character) return undefined;

      const sortedSkills = [...(character.skills || [])]
        .sort((left, right) => right.modifier - left.modifier)
        .slice(0, 3)
        .map(skill => ({ name: skill.name, modifier: skill.modifier }));

      return {
        id: character.id,
        name: character.name,
        race: character.race,
        class: character.class,
        level: character.level,
        portraitUrl: character.portraitUrl,
        hpCurrent: character.hp?.current ?? 0,
        hpMax: character.hp?.max ?? 0,
        ac: character.ac ?? 10,
        initiative: character.initiative ?? 0,
        passivePerception: character.passivePerception ?? 10,
        keySkills: sortedSkills,
        topFeatures: (character.features || []).slice(0, 3).map(feature => feature.name),
        primaryAttack: character.attacks?.[0]?.name,
        journalPreview: character.journal?.[0]?.content,
      };
    },
    [characters],
  );

  // ── Actions ───────────────────────────────────────────────────────
  const createCampaignAction = useCallback(
    async (name: string, description?: string) => {
      if (!user?.uid || !user.displayName) {
        throw new Error('Must be signed in to create a campaign');
      }
      const campaign = await firestoreCreateCampaign(
        user.uid,
        user.displayName,
        name,
        description,
      );
      setActiveCampaignId(campaign.id);
      return campaign;
    },
    [user?.uid, user?.displayName, setActiveCampaignId],
  );

  const updateCampaignAction = useCallback(
    async (updates: Partial<Pick<Campaign, 'name' | 'description' | 'settings' | 'currentSessionNumber'>>) => {
      if (!activeCampaignId) throw new Error('No active campaign');
      await firestoreUpdateCampaign(activeCampaignId, updates);
    },
    [activeCampaignId],
  );

  const archiveCampaignAction = useCallback(async () => {
    if (!activeCampaignId) throw new Error('No active campaign');
    await firestoreArchiveCampaign(activeCampaignId);
    setActiveCampaignId(null);
  }, [activeCampaignId, setActiveCampaignId]);

  const deleteCampaignAction = useCallback(async (campaignId: string) => {
    if (!user?.uid) throw new Error('Must be signed in');
    // Tear down active subscriptions BEFORE deleting to prevent permission errors from listeners
    if (activeCampaignId === campaignId) {
      setActiveCampaignId(null);
    }
    await firestoreDeleteCampaign(campaignId, user.uid);
  }, [user?.uid, activeCampaignId, setActiveCampaignId]);

  const joinByCode = useCallback(
    async (code: string, characterId?: string) => {
      if (!user?.uid || !user.displayName) {
        throw new Error('Must be signed in to join a campaign');
      }
      const characterSummary = buildCharacterSummary(characterId);
      const campaign = await joinCampaignByCode(
        code,
        user.uid,
        user.displayName,
        characterId,
        characterSummary,
      );
      if (campaign) {
        setActiveCampaignId(campaign.id);
        // Sync CharacterData.campaign/campaignId for the character being enrolled
        if (characterId) {
          updateCharacterById(characterId, { campaign: campaign.name, campaignId: campaign.id });
        }
      }
      return campaign;
    },
    [user?.uid, user?.displayName, setActiveCampaignId, updateCharacterById, buildCharacterSummary],
  );

  const leaveCampaignAction = useCallback(async () => {
    if (!activeCampaignId || !user?.uid) return;
    // Clear campaign reference from all characters in this campaign
    characters
      .filter(c => c.campaignId === activeCampaignId)
      .forEach(c => updateCharacterById(c.id, { campaign: 'Solo Adventure', campaignId: undefined }));
    await firestoreLeaveCampaign(activeCampaignId, user.uid);
    setActiveCampaignId(null);
  }, [activeCampaignId, user?.uid, setActiveCampaignId, characters, updateCharacterById]);

  const acceptInviteAction = useCallback(
    async (inviteId: string, characterId?: string) => {
      if (!user?.uid || !user.displayName) throw new Error('Must be signed in');
      const characterSummary = buildCharacterSummary(characterId);
      const accepted = await firestoreAcceptInvite(
        inviteId,
        user.uid,
        user.displayName,
        characterId,
        characterSummary,
      );
      setActiveCampaignId(accepted.campaignId);
      if (characterId) {
        updateCharacterById(characterId, {
          campaign: accepted.campaignName,
          campaignId: accepted.campaignId,
        });
      }
    },
    [user?.uid, user?.displayName, buildCharacterSummary, setActiveCampaignId, updateCharacterById],
  );

  const declineInviteAction = useCallback(
    async (inviteId: string) => {
      await firestoreDeclineInvite(inviteId);
    },
    [],
  );

  const sendInviteAction = useCallback(
    async (email: string) => {
      if (!activeCampaignId || !activeCampaign) throw new Error('No active campaign');
      if (!user?.uid || !user.displayName) throw new Error('Must be signed in');
      await firestoreCreateInvite(
        activeCampaignId,
        activeCampaign.name,
        email,
        user.uid,
        user.displayName,
      );
    },
    [activeCampaignId, activeCampaign, user?.uid, user?.displayName],
  );

  const updateMemberCharacterAction = useCallback(
    async (characterId: string | null) => {
      if (!activeCampaignId || !user?.uid) throw new Error('No active campaign or not signed in');
      await firestoreUpdateMemberCharacter(
        activeCampaignId,
        user.uid,
        characterId,
        buildCharacterSummary(characterId || undefined),
      );
    },
    [activeCampaignId, user?.uid, buildCharacterSummary],
  );

  const removeMemberAction = useCallback(
    async (targetUid: string) => {
      if (!activeCampaignId) throw new Error('No active campaign');
      if (!isDM) throw new Error('Only the DM can remove members');
      await firestoreRemoveMember(activeCampaignId, targetUid);
    },
    [activeCampaignId, isDM],
  );

  const regenerateJoinCodeAction = useCallback(
    async () => {
      if (!activeCampaignId) throw new Error('No active campaign');
      if (!isDM) throw new Error('Only the DM can regenerate the join code');
      return await firestoreRegenerateJoinCode(activeCampaignId);
    },
    [activeCampaignId, isDM],
  );

  // ── Combat Actions ─────────────────────────────────────────────────

  const startEncounterAction = useCallback(
    async (name: string, combatants: Combatant[]): Promise<string> => {
      if (!activeCampaignId) throw new Error('No active campaign');
      if (!isDM) throw new Error('Only the DM can start encounters');
      const id = await firestoreCreateEncounter(activeCampaignId, {
        campaignId: activeCampaignId,
        name,
        active: true,
        round: 1,
        currentTurnIndex: 0,
        combatants,
        log: [{
          timestamp: Date.now(),
          type: 'encounter_start',
          description: `Encounter "${name}" has begun! Round 1 starts.`,
        }],
      });
      return id;
    },
    [activeCampaignId, isDM],
  );

  const updateCombatantAction = useCallback(
    async (combatantId: string, patch: Partial<Combatant>): Promise<void> => {
      if (!activeCampaignId || !activeEncounter) throw new Error('No active encounter');
      const combatants = activeEncounter.combatants.map(c =>
        c.id === combatantId ? { ...c, ...patch } : c,
      );
      await firestoreUpdateEncounter(activeCampaignId, activeEncounter.id, { combatants });
    },
    [activeCampaignId, activeEncounter],
  );

  const nextTurnAction = useCallback(
    async (): Promise<void> => {
      if (!activeCampaignId || !activeEncounter) throw new Error('No active encounter');
      const { combatants, currentTurnIndex, round } = activeEncounter;
      const nextIndex = (currentTurnIndex + 1) % combatants.length;
      const nextRound = nextIndex === 0 ? round + 1 : round;
      const nextCombatant = combatants[nextIndex];
      const logEntry: CombatLogEntry = {
        timestamp: Date.now(),
        type: 'turn_change',
        actorName: nextCombatant?.name,
        description: nextIndex === 0
          ? `⚔ Round ${nextRound} begins — ${nextCombatant?.name}'s turn`
          : `${nextCombatant?.name}'s turn`,
      };
      await firestoreUpdateEncounter(activeCampaignId, activeEncounter.id, {
        currentTurnIndex: nextIndex,
        round: nextRound,
        log: [...activeEncounter.log, logEntry],
      });
    },
    [activeCampaignId, activeEncounter],
  );

  const endCombatAction = useCallback(
    async (): Promise<void> => {
      if (!activeCampaignId || !activeEncounter) throw new Error('No active encounter');
      await firestoreEndEncounter(activeCampaignId, activeEncounter.id);
    },
    [activeCampaignId, activeEncounter],
  );

  const addCombatLogEntryAction = useCallback(
    async (entry: CombatLogEntry): Promise<void> => {
      if (!activeCampaignId || !activeEncounter) throw new Error('No active encounter');
      await firestoreUpdateEncounter(activeCampaignId, activeEncounter.id, {
        log: [...activeEncounter.log, entry],
      });
    },
    [activeCampaignId, activeEncounter],
  );

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        activeCampaign,
        activeCampaignId,
        setActiveCampaignId,
        members,
        myRole,
        isDM,
        activeEncounter,
        notes,
        pendingInvites,
        isLoading,
        createCampaign: createCampaignAction,
        updateCampaign: updateCampaignAction,
        archiveCampaign: archiveCampaignAction,
        deleteCampaign: deleteCampaignAction,
        joinByCode,
        leaveCampaign: leaveCampaignAction,
        acceptInvite: acceptInviteAction,
        declineInvite: declineInviteAction,
        sendInvite: sendInviteAction,
        updateMemberCharacter: updateMemberCharacterAction,
        removeMember: removeMemberAction,
        regenerateJoinCode: regenerateJoinCodeAction,
        startEncounter: startEncounterAction,
        updateCombatant: updateCombatantAction,
        nextTurn: nextTurnAction,
        endCombat: endCombatAction,
        addCombatLogEntry: addCombatLogEntryAction,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

// ─── Hook ───────────────────────────────────────────────────────────
export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
