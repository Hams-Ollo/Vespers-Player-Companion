
import { CharacterData, StatKey, Attack, ProficiencyLevel } from './types';
import { DND_SKILLS, getSpellSlotsForLevel } from './constants';

let lastCall = 0;
export const checkRateLimit = () => {
  const now = Date.now();
  if (now - lastCall < 2000) throw new Error("Slow down, adventurer! The Weave needs a moment to settle.");
  lastCall = now;
};

export const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

/**
 * Recomputes all derived stats for a character sheet.
 * Use this after stat changes, level ups, or AI generation.
 */
export const recalculateCharacterStats = (data: CharacterData): CharacterData => {
  if (!data) return data;
  
  const level = data.level || 1;
  const profBonus = Math.ceil(level / 4) + 1;
  
  // 1. Update individual Stat Modifiers and Saving Throws
  const stats = { ...data.stats };
  const statKeys: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  
  statKeys.forEach(k => {
    if (!stats[k]) {
        stats[k] = { score: 10, modifier: 0, save: 0, proficientSave: false };
    }
    stats[k].modifier = calculateModifier(stats[k].score);
    stats[k].save = stats[k].modifier + (stats[k].proficientSave ? profBonus : 0);
  });

  // 2. Update Skill Modifiers and Abilities
  const skills = (data.skills || []).map(skill => {
    // Find the standard ability for this skill if missing or incorrect
    const standardSkill = DND_SKILLS.find(s => s.name.toLowerCase() === skill.name.toLowerCase());
    const ability = standardSkill ? standardSkill.ability : (skill.ability || 'STR');
    const baseMod = stats[ability]?.modifier || 0;
    
    let totalMod = baseMod;
    if (skill.proficiency === 'proficient') totalMod += profBonus;
    if (skill.proficiency === 'expertise') totalMod += (profBonus * 2);

    return {
      ...skill,
      ability,
      modifier: totalMod
    };
  });

  // 3. Update AC based on equipped gear
  let ac = 10 + stats.DEX.modifier;
  const items = data.inventory?.items || [];
  const armor = items.find(i => i.type === 'Armor' && i.equipped && i.name !== 'Shield');
  const shield = items.find(i => i.name === 'Shield' && i.equipped);
  
  if (armor) {
    if (armor.name.includes("Leather")) ac = 11 + stats.DEX.modifier;
    else if (armor.name.includes("Studded")) ac = 12 + stats.DEX.modifier;
    else if (armor.name.includes("Chain Shirt")) ac = 13 + Math.min(2, stats.DEX.modifier);
    else if (armor.name.includes("Scale Mail")) ac = 14 + Math.min(2, stats.DEX.modifier);
    else if (armor.name.includes("Plate")) ac = 18;
  }
  if (shield) ac += 2;

  // 4. Update Attacks based on equipped weapons
  const attacks: Attack[] = items
    .filter(i => i.type === 'Weapon' && i.equipped)
    .map(w => {
        const isFinesse = w.notes?.toLowerCase().includes('finesse');
        const isRanged = w.notes?.toLowerCase().includes('range') || w.name.includes('Bow') || w.name.includes('Crossbow');
        const ability = (isFinesse || isRanged) ? 'DEX' : 'STR';
        const mod = stats[ability]?.modifier || 0;
        const damageMatch = w.notes?.match(/(\d+d\d+)/);
        const damageDice = damageMatch ? damageMatch[1] : '1d4';
        
        return {
            name: w.name,
            bonus: mod + profBonus,
            damage: `${damageDice}${mod >= 0 ? '+' : ''}${mod}`,
            type: w.notes?.split(' ')[1] || 'Physical',
            range: w.notes?.match(/Range (\d+\/\d+)/)?.[1],
            properties: w.notes?.split(', ')
        };
    });

  if (attacks.length === 0) {
      attacks.push({ 
        name: "Unarmed Strike", 
        bonus: (stats.STR?.modifier || 0) + profBonus, 
        damage: `1${(stats.STR?.modifier || 0) >= 0 ? '+' : ''}${(stats.STR?.modifier || 0)}`, 
        type: "Bludgeoning" 
      });
  }

  // 5. Update Spell Slots if missing (e.g. for Level 1 quick roll)
  let spellSlots = data.spellSlots || [];
  if (spellSlots.length === 0) {
      spellSlots = getSpellSlotsForLevel(data.class, level).map(s => ({
          level: s.level,
          max: s.max,
          current: s.max
      }));
  }

  // 6. Update Passive Perception
  const perceptionSkill = skills.find(s => s.name === 'Perception');
  const passivePerception = 10 + (perceptionSkill?.modifier || stats.WIS?.modifier || 0);

  // 7. Update HP based on stats if current/max is 0 or malformed
  const currentHp = data.hp?.current || 1;
  const maxHp = data.hp?.max || 1;

  return {
    ...data,
    stats,
    skills,
    ac,
    attacks,
    spellSlots,
    passivePerception,
    hp: { current: currentHp, max: maxHp },
    initiative: stats.DEX?.modifier || 0
  };
};
