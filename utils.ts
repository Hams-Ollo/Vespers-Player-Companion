import { CharacterData, Item, Attack } from './types';

// Rate Limiter Configuration
const STORAGE_KEY = 'dnd_rate_limit_timestamps';
const WINDOW_MS = 60000; // 1 minute window
const MAX_REQUESTS = 10; // Max requests per window

export const checkRateLimit = (): void => {
  const now = Date.now();
  let timestamps: number[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    timestamps = stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn("Failed to parse rate limit storage", e);
    timestamps = [];
  }
  timestamps = timestamps.filter(t => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0];
    const waitTime = Math.ceil((WINDOW_MS - (now - oldest)) / 1000);
    throw new Error(`Rate limit reached. Please wait ${waitTime} seconds before trying again.`);
  }
  timestamps.push(now);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
};

// ==========================================
// Game Logic Utilities
// ==========================================

/**
 * Recalculates Derived Stats (AC, Attacks) based on stats and equipment
 */
export const recalculateCharacterStats = (char: CharacterData): CharacterData => {
  const newData = { ...char };
  const { DEX, STR } = char.stats;
  const profBonus = Math.ceil(1 + (char.level / 4));

  // 1. Calculate AC
  let baseAC = 10;
  let dexBonus = DEX.modifier;
  let shieldBonus = 0;
  let armorName = "Unarmored";

  const armor = char.inventory.items.find(i => i.equipped && i.type === 'Armor' && i.name !== 'Shield');
  const shield = char.inventory.items.find(i => i.equipped && i.name === 'Shield');

  if (shield) shieldBonus = 2;

  if (armor) {
    armorName = armor.name.toLowerCase();
    // Rudimentary Armor Type Detection based on SRD names
    if (armorName.includes('leather') || armorName.includes('padded')) {
      // Light Armor: AC + Dex
      baseAC = armor.armorClass || (armorName.includes('studded') ? 12 : 11);
    } else if (armorName.includes('hide') || armorName.includes('chain shirt') || armorName.includes('scale') || armorName.includes('breastplate') || armorName.includes('half')) {
      // Medium Armor: AC + Dex (max 2)
      baseAC = armor.armorClass || (armorName.includes('hide') ? 12 : armorName.includes('half') ? 15 : 14);
      dexBonus = Math.min(2, DEX.modifier);
    } else if (armorName.includes('ring') || armorName.includes('chain') || armorName.includes('splint') || armorName.includes('plate')) {
      // Heavy Armor: Flat AC
      baseAC = armor.armorClass || (armorName.includes('plate') ? 18 : armorName.includes('chain') ? 16 : 14);
      dexBonus = 0;
    }
  } else {
    // Unarmored Defense checks (Monk/Barbarian) could go here
    if (char.class === 'Barbarian') dexBonus += char.stats.CON.modifier;
    if (char.class === 'Monk') dexBonus += char.stats.WIS.modifier;
  }

  newData.ac = baseAC + dexBonus + shieldBonus;

  // 2. Generate Attacks from Equipped Weapons
  const newAttacks: Attack[] = [];
  
  // Always add Unarmed Strike
  const unarmedDmg = 1 + STR.modifier;
  newAttacks.push({
    name: "Unarmed Strike",
    bonus: STR.modifier + profBonus,
    damage: `${Math.max(1, unarmedDmg)}`,
    type: "Bludgeoning",
    range: "5",
    properties: []
  });

  // Equipped Weapons
  char.inventory.items.filter(i => i.equipped && i.type === 'Weapon').forEach(w => {
    const isFinesse = w.notes?.toLowerCase().includes('finesse');
    const isRanged = w.notes?.toLowerCase().includes('range') || w.name.includes('bow') || w.name.includes('crossbow');
    
    // Determine Stat: Dex if Finesse/Ranged AND Dex > Str
    const useDex = isRanged || (isFinesse && DEX.score > STR.score);
    const mod = useDex ? DEX.modifier : STR.modifier;
    
    // Parse Damage (Assume it's in notes like "1d8 slashing")
    // Simple regex to extract "1d8" or "2d6"
    const dmgMatch = w.notes?.match(/(\d+d\d+)/);
    const baseDmg = dmgMatch ? dmgMatch[0] : "1d4"; // Default fallback
    
    const dmgTypeMatch = w.notes?.match(/(slashing|piercing|bludgeoning)/i);
    const dmgType = dmgTypeMatch ? dmgTypeMatch[0] : "Damage";

    newAttacks.push({
      name: w.name,
      bonus: mod + profBonus, // Assuming proficiency with equipped weapons
      damage: `${baseDmg}${mod >= 0 ? '+' : ''}${mod}`,
      type: dmgType,
      range: isRanged ? "80/320" : "5", // Simplified
      properties: w.notes ? [w.notes] : []
    });
  });

  newData.attacks = newAttacks;

  return newData;
};