
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
  const profBonus = Math.ceil(data.level / 4) + 1;
  
  // 1. Update individual Stat Modifiers and Saving Throws
  const stats = { ...data.stats };
  (Object.keys(stats) as StatKey[]).forEach(k => {
    stats[k].modifier = calculateModifier(stats[k].score);
    stats[k].save = stats[k].modifier + (stats[k].proficientSave ? profBonus : 0);
  });

  // 2. Update Skill Modifiers and Abilities
  const skills = data.skills.map(skill => {
    // Find the standard ability for this skill if missing or incorrect
    const standardSkill = DND_SKILLS.find(s => s.name.toLowerCase() === skill.name.toLowerCase());
    const ability = standardSkill ? standardSkill.ability : skill.ability;
    const baseMod = stats[ability].modifier;
    
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
  const armor = data.inventory.items.find(i => i.type === 'Armor' && i.equipped && i.name !== 'Shield');
  const shield = data.inventory.items.find(i => i.name === 'Shield' && i.equipped);
  
  if (armor) {
    if (armor.name.includes("Leather")) ac = 11 + stats.DEX.modifier;
    if (armor.name.includes("Studded")) ac = 12 + stats.DEX.modifier;
    if (armor.name.includes("Chain Shirt")) ac = 13 + Math.min(2, stats.DEX.modifier);
    if (armor.name.includes("Scale Mail")) ac = 14 + Math.min(2, stats.DEX.modifier);
    if (armor.name.includes("Plate")) ac = 18;
  }
  if (shield) ac += 2;

  // 4. Update Attacks based on equipped weapons
  const attacks: Attack[] = data.inventory.items
    .filter(i => i.type === 'Weapon' && i.equipped)
    .map(w => {
        const isFinesse = w.notes?.toLowerCase().includes('finesse');
        const isRanged = w.notes?.toLowerCase().includes('range') || w.name.includes('Bow') || w.name.includes('Crossbow');
        const ability = (isFinesse || isRanged) ? 'DEX' : 'STR';
        const mod = stats[ability].modifier;
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
        bonus: stats.STR.modifier + profBonus, 
        damage: `1${stats.STR.modifier >= 0 ? '+' : ''}${stats.STR.modifier}`, 
        type: "Bludgeoning" 
      });
  }

  // 5. Update Spell Slots if missing (e.g. for Level 1 quick roll)
  let spellSlots = data.spellSlots;
  if (!spellSlots || spellSlots.length === 0) {
      spellSlots = getSpellSlotsForLevel(data.class, data.level).map(s => ({
          level: s.level,
          max: s.max,
          current: s.max
      }));
  }

  // 6. Update Passive Perception
  const perceptionSkill = skills.find(s => s.name === 'Perception');
  const passivePerception = 10 + (perceptionSkill?.modifier || stats.WIS.modifier);

  return {
    ...data,
    stats,
    skills,
    ac,
    attacks,
    spellSlots,
    passivePerception,
    initiative: stats.DEX.modifier
  };
};
