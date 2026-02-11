import { CharacterData, StatKey, Skill, Item } from './types';

// Helper to generate a unique ID
export const generateId = () => Math.random().toString(36).substring(2, 11);

// ==========================================
// D&D 5th Edition Reference Data
// ==========================================

export interface RaceOption {
  name: string;
  speed: number;
  subraces?: string[];
}

export interface ClassOption {
  name: string;
  hitDie: number;
  primaryAbility: string;
  savingThrows: [StatKey, StatKey];
}

export const DND_RACES: RaceOption[] = [
  { name: 'Dragonborn', speed: 30 },
  { name: 'Dwarf', speed: 25, subraces: ['Hill Dwarf', 'Mountain Dwarf'] },
  { name: 'Elf', speed: 30, subraces: ['High Elf', 'Wood Elf', 'Drow Elf'] },
  { name: 'Gnome', speed: 25, subraces: ['Forest Gnome', 'Rock Gnome'] },
  { name: 'Half-Elf', speed: 30 },
  { name: 'Half-Orc', speed: 30 },
  { name: 'Halfling', speed: 25, subraces: ['Lightfoot Halfling', 'Stout Halfling'] },
  { name: 'Human', speed: 30 },
  { name: 'Tiefling', speed: 30 },
];

export const DND_CLASSES: ClassOption[] = [
  { name: 'Barbarian', hitDie: 12, primaryAbility: 'STR', savingThrows: ['STR', 'CON'] },
  { name: 'Bard', hitDie: 8, primaryAbility: 'CHA', savingThrows: ['DEX', 'CHA'] },
  { name: 'Cleric', hitDie: 8, primaryAbility: 'WIS', savingThrows: ['WIS', 'CHA'] },
  { name: 'Druid', hitDie: 8, primaryAbility: 'WIS', savingThrows: ['INT', 'WIS'] },
  { name: 'Fighter', hitDie: 10, primaryAbility: 'STR', savingThrows: ['STR', 'CON'] },
  { name: 'Monk', hitDie: 8, primaryAbility: 'DEX', savingThrows: ['STR', 'DEX'] },
  { name: 'Paladin', hitDie: 10, primaryAbility: 'STR', savingThrows: ['WIS', 'CHA'] },
  { name: 'Ranger', hitDie: 10, primaryAbility: 'DEX', savingThrows: ['STR', 'DEX'] },
  { name: 'Rogue', hitDie: 8, primaryAbility: 'DEX', savingThrows: ['DEX', 'INT'] },
  { name: 'Sorcerer', hitDie: 6, primaryAbility: 'CHA', savingThrows: ['CON', 'CHA'] },
  { name: 'Warlock', hitDie: 8, primaryAbility: 'CHA', savingThrows: ['WIS', 'CHA'] },
  { name: 'Wizard', hitDie: 6, primaryAbility: 'INT', savingThrows: ['INT', 'WIS'] },
];

export const DND_BACKGROUNDS: string[] = [
  'Acolyte',
  'Charlatan',
  'Criminal',
  'Entertainer',
  'Folk Hero',
  'Guild Artisan',
  'Hermit',
  'Noble',
  'Outlander',
  'Sage',
  'Sailor',
  'Soldier',
  'Urchin',
];

export const DND_ALIGNMENTS: string[] = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil',
];

// Comprehensive Shop Inventory
export const SHOP_INVENTORY: Item[] = [
  // --- WEAPONS ---
  { name: "Dagger", cost: 2, weight: 1, type: "Weapon", quantity: 1, notes: "1d4 piercing, Finesse, Light" },
  { name: "Handaxe", cost: 5, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 slashing, Light, Thrown (20/60)" },
  { name: "Shortsword", cost: 10, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 piercing, Finesse, Light" },
  { name: "Longsword", cost: 15, weight: 3, type: "Weapon", quantity: 1, notes: "1d8 slashing, Versatile (1d10)" },
  { name: "Rapier", cost: 25, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 piercing, Finesse" },
  { name: "Greataxe", cost: 30, weight: 7, type: "Weapon", quantity: 1, notes: "1d12 slashing, Heavy, Two-handed" },
  { name: "Greatsword", cost: 50, weight: 6, type: "Weapon", quantity: 1, notes: "2d6 slashing, Heavy, Two-handed" },
  { name: "Warhammer", cost: 15, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 bludgeoning, Versatile (1d10)" },
  { name: "Maul", cost: 10, weight: 10, type: "Weapon", quantity: 1, notes: "2d6 bludgeoning, Heavy, Two-handed" },
  { name: "Shortbow", cost: 25, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 piercing, Range 80/320, Two-handed" },
  { name: "Longbow", cost: 50, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 piercing, Range 150/600, Heavy, Two-handed" },
  { name: "Hand Crossbow", cost: 75, weight: 3, type: "Weapon", quantity: 1, notes: "1d6 piercing, Range 30/120, Light, Loading" },

  // --- ARMOR ---
  { name: "Padded Armor", cost: 5, weight: 8, type: "Armor", quantity: 1, notes: "AC 11 + Dex, Stealth Disadv." },
  { name: "Leather Armor", cost: 10, weight: 10, type: "Armor", quantity: 1, notes: "AC 11 + Dex" },
  { name: "Studded Leather", cost: 45, weight: 13, type: "Armor", quantity: 1, notes: "AC 12 + Dex" },
  { name: "Hide Armor", cost: 10, weight: 12, type: "Armor", quantity: 1, notes: "AC 12 + Dex (max 2)" },
  { name: "Chain Shirt", cost: 50, weight: 20, type: "Armor", quantity: 1, notes: "AC 13 + Dex (max 2)" },
  { name: "Scale Mail", cost: 50, weight: 45, type: "Armor", quantity: 1, notes: "AC 14 + Dex (max 2), Stealth Disadv." },
  { name: "Breastplate", cost: 400, weight: 20, type: "Armor", quantity: 1, notes: "AC 14 + Dex (max 2)" },
  { name: "Half Plate", cost: 750, weight: 40, type: "Armor", quantity: 1, notes: "AC 15 + Dex (max 2), Stealth Disadv." },
  { name: "Ring Mail", cost: 30, weight: 40, type: "Armor", quantity: 1, notes: "AC 14, Stealth Disadv." },
  { name: "Chain Mail", cost: 75, weight: 55, type: "Armor", quantity: 1, notes: "AC 16, Str 13 req, Stealth Disadv." },
  { name: "Splint Armor", cost: 200, weight: 60, type: "Armor", quantity: 1, notes: "AC 17, Str 15 req, Stealth Disadv." },
  { name: "Plate Armor", cost: 1500, weight: 65, type: "Armor", quantity: 1, notes: "AC 18, Str 15 req, Stealth Disadv." },
  { name: "Shield", cost: 10, weight: 6, type: "Armor", quantity: 1, notes: "+2 AC" },

  // --- SPELLCASTING FOCI ---
  { name: "Arcane Focus (Wand)", cost: 10, weight: 1, type: "Gear", quantity: 1, notes: "Wizard/Sorcerer/Warlock Focus" },
  { name: "Arcane Focus (Staff)", cost: 5, weight: 4, type: "Gear", quantity: 1, notes: "Wizard/Sorcerer/Warlock Focus" },
  { name: "Arcane Focus (Crystal)", cost: 10, weight: 1, type: "Gear", quantity: 1, notes: "Wizard/Sorcerer/Warlock Focus" },
  { name: "Druidic Focus (Totem)", cost: 1, weight: 0, type: "Gear", quantity: 1, notes: "Druid Focus" },
  { name: "Druidic Focus (Wooden Staff)", cost: 5, weight: 4, type: "Gear", quantity: 1, notes: "Druid Focus" },
  { name: "Holy Symbol (Amulet)", cost: 5, weight: 1, type: "Gear", quantity: 1, notes: "Cleric/Paladin Focus" },
  { name: "Holy Symbol (Emblem)", cost: 5, weight: 0, type: "Gear", quantity: 1, notes: "Cleric/Paladin Focus" },
  { name: "Component Pouch", cost: 25, weight: 2, type: "Gear", quantity: 1, notes: "Universal Spellcasting Focus" },

  // --- TOOLS & KITS ---
  { name: "Thieves' Tools", cost: 25, weight: 1, type: "Gear", quantity: 1, notes: "Essential for Rogue checks" },
  { name: "Healer's Kit", cost: 5, weight: 3, type: "Gear", quantity: 1, notes: "Stabilize creature without check (10 uses)" },
  { name: "Poisoner's Kit", cost: 50, weight: 2, type: "Gear", quantity: 1, notes: "Create and apply poisons" },
  { name: "Cook's Utensils", cost: 1, weight: 8, type: "Gear", quantity: 1, notes: "Proficiency adds to health during rest" },
  { name: "Lute", cost: 35, weight: 2, type: "Gear", quantity: 1, notes: "Bardic Focus" },

  // --- GEAR & CONSUMABLES ---
  { name: "Potion of Healing", cost: 50, weight: 0.5, type: "Consumable", quantity: 1, notes: "Heals 2d4+2 HP" },
  { name: "Rations (1 day)", cost: 0.5, weight: 2, type: "Consumable", quantity: 1 },
  { name: "Rope, Hempen (50ft)", cost: 1, weight: 10, type: "Gear", quantity: 1 },
  { name: "Grappling Hook", cost: 2, weight: 4, type: "Gear", quantity: 1 },
  { name: "Manacles", cost: 2, weight: 6, type: "Gear", quantity: 1 },
  { name: "Torch", cost: 0.01, weight: 1, type: "Gear", quantity: 1, notes: "Burns for 1 hour" },
  { name: "Backpack", cost: 2, weight: 5, type: "Gear", quantity: 1 },
  { name: "Bedroll", cost: 1, weight: 7, type: "Gear", quantity: 1 },
  { name: "Tent, Two-person", cost: 2, weight: 20, type: "Gear", quantity: 1 },
];

export const RACIAL_BONUSES: Record<string, Partial<Record<StatKey, number>>> = {
  'Dragonborn':          { STR: 2, CHA: 1 },
  'Hill Dwarf':          { CON: 2, WIS: 1 },
  'Mountain Dwarf':      { CON: 2, STR: 2 },
  'High Elf':            { DEX: 2, INT: 1 },
  'Wood Elf':            { DEX: 2, WIS: 1 },
  'Drow Elf':            { DEX: 2, CHA: 1 },
  'Forest Gnome':        { INT: 2, DEX: 1 },
  'Rock Gnome':          { INT: 2, CON: 1 },
  'Half-Elf':            { CHA: 2 },
  'Half-Orc':            { STR: 2, CON: 1 },
  'Lightfoot Halfling':  { DEX: 2, CHA: 1 },
  'Stout Halfling':      { DEX: 2, CON: 1 },
  'Human':               { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
  'Tiefling':            { CHA: 2, INT: 1 },
};

export const getRacialBonus = (race: string, stat: StatKey): number => {
  return RACIAL_BONUSES[race]?.[stat] ?? 0;
};

export const getRacialBonusDisplay = (race: string): string => {
  const bonuses = RACIAL_BONUSES[race];
  if (!bonuses) return 'None';
  return Object.entries(bonuses)
    .map(([stat, val]) => `+${val} ${stat}`)
    .join(', ');
};

export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};
export const POINT_BUY_TOTAL = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;

export const getAllRaceOptions = (): string[] => {
  const options: string[] = [];
  DND_RACES.forEach(race => {
    if (race.subraces && race.subraces.length > 0) {
      race.subraces.forEach(sub => options.push(sub));
    } else {
      options.push(race.name);
    }
  });
  return options;
};

export const getRaceSpeed = (raceName: string): number => {
  for (const race of DND_RACES) {
    if (race.name === raceName) return race.speed;
    if (race.subraces?.includes(raceName)) return race.speed;
  }
  return 30;
};

export const getClassData = (className: string): ClassOption | undefined => {
  return DND_CLASSES.find(c => c.name === className);
};

export const VESPER_DATA: CharacterData = {
  id: "vesper-default",
  campaign: "The Underdark Saga",
  name: "Vesper",
  nickname: "The Whisper",
  race: "Drow Elf",
  class: "Rogue",
  level: 1,
  portraitUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=800&auto=format&fit=crop",
  stats: {
    STR: { score: 8, modifier: -1, save: -1, proficientSave: false },
    DEX: { score: 18, modifier: +4, save: +6, proficientSave: true },
    CON: { score: 14, modifier: +2, save: +2, proficientSave: false },
    INT: { score: 12, modifier: +1, save: +3, proficientSave: true },
    WIS: { score: 10, modifier: +0, save: +0, proficientSave: false },
    CHA: { score: 15, modifier: +2, save: +2, proficientSave: false },
  },
  hp: { current: 10, max: 10 },
  hitDice: { current: 1, max: 1, die: "1d8" },
  ac: 15,
  initiative: 4,
  speed: 30,
  passivePerception: 14,
  skills: [
    { name: "Acrobatics", ability: "DEX", modifier: 6, proficiency: "proficient" },
    { name: "Animal Handling", ability: "WIS", modifier: 0, proficiency: "none" },
    { name: "Arcana", ability: "INT", modifier: 1, proficiency: "none" },
    { name: "Athletics", ability: "STR", modifier: -1, proficiency: "none" },
    { name: "Deception", ability: "CHA", modifier: 4, proficiency: "proficient" },
    { name: "History", ability: "INT", modifier: 1, proficiency: "none" },
    { name: "Insight", ability: "WIS", modifier: 0, proficiency: "none" },
    { name: "Intimidation", ability: "CHA", modifier: 2, proficiency: "none" },
    { name: "Investigation", ability: "INT", modifier: 1, proficiency: "none" },
    { name: "Medicine", ability: "WIS", modifier: 0, proficiency: "none" },
    { name: "Nature", ability: "INT", modifier: 1, proficiency: "none" },
    { name: "Perception", ability: "WIS", modifier: 4, proficiency: "expertise" },
    { name: "Performance", ability: "CHA", modifier: 2, proficiency: "none" },
    { name: "Persuasion", ability: "CHA", modifier: 2, proficiency: "none" },
    { name: "Religion", ability: "INT", modifier: 1, proficiency: "none" },
    { name: "Sleight of Hand", ability: "DEX", modifier: 4, proficiency: "none" },
    { name: "Stealth", ability: "DEX", modifier: 8, proficiency: "expertise" },
    { name: "Survival", ability: "WIS", modifier: 0, proficiency: "none" },
  ],
  attacks: [
    { name: "Dagger (Main)", bonus: 6, damage: "1d4+4", type: "Piercing", range: "20/60", properties: ["Finesse", "Light", "Thrown"] },
    { name: "Dagger (Off)", bonus: 6, damage: "1d4", type: "Piercing", range: "20/60", properties: ["Finesse", "Light", "Thrown"] },
    { name: "Shortbow", bonus: 6, damage: "1d6+4", type: "Piercing", range: "80/320", properties: ["Two-handed"] },
  ],
  features: [
    { 
      name: "Sneak Attack", 
      source: "Class", 
      description: "Deal extra 1d6 damage once per turn.",
      fullText: "Beginning at 1st level, you know how to strike subtly..."
    },
    { 
      name: "Expertise", 
      source: "Class", 
      description: "Double proficiency bonus for Stealth and Perception.",
      fullText: "At 1st level, choose two of your skill proficiencies..."
    },
    { 
      name: "Thieves' Cant", 
      source: "Class", 
      description: "A secret mix of dialect, jargon, and code.",
      fullText: "During your rogue training you learned thieves' cant..."
    },
    { 
      name: "Superior Darkvision", 
      source: "Race", 
      description: "See in dark up to 120ft.",
      fullText: "Your darkvision has a radius of 120 feet."
    },
    { 
      name: "Sunlight Sensitivity", 
      source: "Race", 
      description: "Disadvantage in direct sunlight.",
      fullText: "You have disadvantage on attack rolls..."
    },
  ],
  spells: [],
  spellSlots: [],
  inventory: {
    gold: 150,
    items: [
      { name: "Leather Armor", quantity: 1, notes: "AC 11, Light Armor", cost: 10, type: "Armor", equipped: true },
      { name: "Thieves' Tools", quantity: 1, cost: 25, type: "Gear" },
      { name: "Dagger", quantity: 2, cost: 2, type: "Weapon", equipped: true, notes: "1d4 piercing, Finesse" },
      { name: "Shortbow", quantity: 1, cost: 25, type: "Weapon", equipped: false, notes: "1d6 piercing, Two-handed" },
      { name: "Arrows", quantity: 20, cost: 1, type: "Consumable" },
      { name: "Burglar's Pack", quantity: 1, cost: 16, type: "Gear" },
    ],
    load: "Light"
  },
  journal: [
    { id: '1', timestamp: Date.now(), type: 'note', content: 'We arrived in the Underdark. The air is stale and cold.' },
  ]
};