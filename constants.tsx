import { CharacterData, StatKey, Item } from './types';

export const generateId = () => Math.random().toString(36).substring(2, 11);

export interface RaceOption {
  name: string;
  speed: number;
  subraces?: string[];
}

export interface ClassOption {
  name: string;
  hitDie: number;
  primaryAbility: StatKey;
  savingThrows: [StatKey, StatKey];
  skillsToPick: number;
  skillChoices: string[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies?: string[];
  isCaster: boolean;
  spellcastingAbility?: StatKey;
  subclassLevel: number;
  subclassName: string;
  asiLevels: number[];
  expertiseLevels?: number[];
}

export const DND_SKILLS: { name: string; ability: StatKey }[] = [
  { name: 'Acrobatics', ability: 'DEX' },
  { name: 'Animal Handling', ability: 'WIS' },
  { name: 'Arcana', ability: 'INT' },
  { name: 'Athletics', ability: 'STR' },
  { name: 'Deception', ability: 'CHA' },
  { name: 'History', ability: 'INT' },
  { name: 'Insight', ability: 'WIS' },
  { name: 'Intimidation', ability: 'CHA' },
  { name: 'Investigation', ability: 'INT' },
  { name: 'Medicine', ability: 'WIS' },
  { name: 'Nature', ability: 'INT' },
  { name: 'Perception', ability: 'WIS' },
  { name: 'Performance', ability: 'CHA' },
  { name: 'Persuasion', ability: 'CHA' },
  { name: 'Religion', ability: 'INT' },
  { name: 'Sleight of Hand', ability: 'DEX' },
  { name: 'Stealth', ability: 'DEX' },
  { name: 'Survival', ability: 'WIS' },
];

export const DND_TOOLS = [
  "Thieves' Tools", "Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies", 
  "Carpenter's Tools", "Cartographer's Tools", "Cook's Utensils", "Glassblower's Tools",
  "Jeweler's Tools", "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies",
  "Potter's Tools", "Smith's Tools", "Tinker's Tools", "Weaver's Tools", "Woodcarver's Tools"
];

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
  { name: 'Barbarian', hitDie: 12, primaryAbility: 'STR', savingThrows: ['STR', 'CON'],
    skillsToPick: 2, skillChoices: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
    armorProficiencies: ['Light', 'Medium', 'Shields'], weaponProficiencies: ['Simple', 'Martial'],
    isCaster: false, subclassLevel: 3, subclassName: 'Primal Path', asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Bard', hitDie: 8, primaryAbility: 'CHA', savingThrows: ['DEX', 'CHA'],
    skillsToPick: 3, skillChoices: ['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'],
    armorProficiencies: ['Light'], weaponProficiencies: ['Simple', 'Hand crossbow', 'Longsword', 'Rapier', 'Shortsword'],
    toolProficiencies: ['Three musical instruments of your choice'],
    isCaster: true, spellcastingAbility: 'CHA', subclassLevel: 3, subclassName: 'Bard College',
    asiLevels: [4, 8, 12, 16, 19], expertiseLevels: [3, 10] },
  { name: 'Cleric', hitDie: 8, primaryAbility: 'WIS', savingThrows: ['WIS', 'CHA'],
    skillsToPick: 2, skillChoices: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    armorProficiencies: ['Light', 'Medium', 'Shields'], weaponProficiencies: ['Simple'],
    isCaster: true, spellcastingAbility: 'WIS', subclassLevel: 1, subclassName: 'Divine Domain',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Druid', hitDie: 8, primaryAbility: 'WIS', savingThrows: ['INT', 'WIS'],
    skillsToPick: 2, skillChoices: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    armorProficiencies: ['Light', 'Medium (nonmetal)', 'Shields (nonmetal)'],
    weaponProficiencies: ['Club', 'Dagger', 'Dart', 'Javelin', 'Mace', 'Quarterstaff', 'Scimitar', 'Sickle', 'Sling', 'Spear'],
    toolProficiencies: ['Herbalism kit'],
    isCaster: true, spellcastingAbility: 'WIS', subclassLevel: 2, subclassName: 'Druid Circle',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Fighter', hitDie: 10, primaryAbility: 'STR', savingThrows: ['STR', 'CON'],
    skillsToPick: 2, skillChoices: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    armorProficiencies: ['Light', 'Medium', 'Heavy', 'Shields'], weaponProficiencies: ['Simple', 'Martial'],
    isCaster: false, subclassLevel: 3, subclassName: 'Martial Archetype',
    asiLevels: [4, 6, 8, 12, 14, 16, 19] },
  { name: 'Monk', hitDie: 8, primaryAbility: 'DEX', savingThrows: ['STR', 'DEX'],
    skillsToPick: 2, skillChoices: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    armorProficiencies: [], weaponProficiencies: ['Simple', 'Shortsword'],
    toolProficiencies: ['One artisan tool or musical instrument'],
    isCaster: false, subclassLevel: 3, subclassName: 'Monastic Tradition',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Paladin', hitDie: 10, primaryAbility: 'STR', savingThrows: ['WIS', 'CHA'],
    skillsToPick: 2, skillChoices: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    armorProficiencies: ['Light', 'Medium', 'Heavy', 'Shields'], weaponProficiencies: ['Simple', 'Martial'],
    isCaster: true, spellcastingAbility: 'CHA', subclassLevel: 3, subclassName: 'Sacred Oath',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Ranger', hitDie: 10, primaryAbility: 'DEX', savingThrows: ['STR', 'DEX'],
    skillsToPick: 3, skillChoices: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
    armorProficiencies: ['Light', 'Medium', 'Shields'], weaponProficiencies: ['Simple', 'Martial'],
    isCaster: true, spellcastingAbility: 'WIS', subclassLevel: 3, subclassName: 'Ranger Archetype',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Rogue', hitDie: 8, primaryAbility: 'DEX', savingThrows: ['DEX', 'INT'],
    skillsToPick: 4, skillChoices: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
    armorProficiencies: ['Light'], weaponProficiencies: ['Simple', 'Hand crossbow', 'Longsword', 'Rapier', 'Shortsword'],
    toolProficiencies: ["Thieves' Tools"],
    isCaster: false, subclassLevel: 3, subclassName: 'Roguish Archetype',
    asiLevels: [4, 8, 10, 12, 16, 19], expertiseLevels: [1, 6] },
  { name: 'Sorcerer', hitDie: 6, primaryAbility: 'CHA', savingThrows: ['CON', 'CHA'],
    skillsToPick: 2, skillChoices: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    armorProficiencies: [], weaponProficiencies: ['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light crossbow'],
    isCaster: true, spellcastingAbility: 'CHA', subclassLevel: 1, subclassName: 'Sorcerous Origin',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Warlock', hitDie: 8, primaryAbility: 'CHA', savingThrows: ['WIS', 'CHA'],
    skillsToPick: 2, skillChoices: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
    armorProficiencies: ['Light'], weaponProficiencies: ['Simple'],
    isCaster: true, spellcastingAbility: 'CHA', subclassLevel: 1, subclassName: 'Otherworldly Patron',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Wizard', hitDie: 6, primaryAbility: 'INT', savingThrows: ['INT', 'WIS'],
    skillsToPick: 2, skillChoices: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    armorProficiencies: [], weaponProficiencies: ['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light crossbow'],
    isCaster: true, spellcastingAbility: 'INT', subclassLevel: 2, subclassName: 'Arcane Tradition',
    asiLevels: [4, 8, 12, 16, 19] },
];

export const DND_BACKGROUNDS = ['Acolyte', 'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero', 'Noble', 'Sage', 'Soldier', 'Urchin'];
export const DND_ALIGNMENTS = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];

export const RACIAL_BONUSES: Record<string, Partial<Record<StatKey, number>>> = {
  'Dragonborn': { STR: 2, CHA: 1 },
  'Hill Dwarf': { CON: 2, WIS: 1 },
  'Mountain Dwarf': { CON: 2, STR: 2 },
  'High Elf': { DEX: 2, INT: 1 },
  'Wood Elf': { DEX: 2, WIS: 1 },
  'Drow Elf': { DEX: 2, CHA: 1 },
  'Forest Gnome': { INT: 2, DEX: 1 },
  'Rock Gnome': { INT: 2, CON: 1 },
  'Half-Elf': { CHA: 2 },
  'Half-Orc': { STR: 2, CON: 1 },
  'Lightfoot Halfling': { DEX: 2, CHA: 1 },
  'Stout Halfling': { DEX: 2, CON: 1 },
  'Human': { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
  'Tiefling': { CHA: 2, INT: 1 },
};

export const POINT_BUY_COSTS: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const POINT_BUY_TOTAL = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;

export const SHOP_INVENTORY: Item[] = [
  // ======================================
  // SIMPLE MELEE WEAPONS (PHB Ch.5)
  // ======================================
  { name: "Club", cost: 0.1, weight: 2, type: "Weapon", quantity: 1, notes: "1d4 bludgeoning, Light" },
  { name: "Dagger", cost: 2, weight: 1, type: "Weapon", quantity: 1, notes: "1d4 piercing, Finesse, Light, Thrown (20/60)" },
  { name: "Greatclub", cost: 0.2, weight: 10, type: "Weapon", quantity: 1, notes: "1d8 bludgeoning, Two-handed" },
  { name: "Handaxe", cost: 5, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 slashing, Light, Thrown (20/60)" },
  { name: "Javelin", cost: 0.5, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 piercing, Thrown (30/120)" },
  { name: "Light Hammer", cost: 2, weight: 2, type: "Weapon", quantity: 1, notes: "1d4 bludgeoning, Light, Thrown (20/60)" },
  { name: "Mace", cost: 5, weight: 4, type: "Weapon", quantity: 1, notes: "1d6 bludgeoning" },
  { name: "Quarterstaff", cost: 0.2, weight: 4, type: "Weapon", quantity: 1, notes: "1d6 bludgeoning, Versatile (1d8)" },
  { name: "Sickle", cost: 1, weight: 2, type: "Weapon", quantity: 1, notes: "1d4 slashing, Light" },
  { name: "Spear", cost: 1, weight: 3, type: "Weapon", quantity: 1, notes: "1d6 piercing, Thrown (20/60), Versatile (1d8)" },

  // ======================================
  // SIMPLE RANGED WEAPONS (PHB Ch.5)
  // ======================================
  { name: "Crossbow, Light", cost: 25, weight: 5, type: "Weapon", quantity: 1, notes: "1d8 piercing, Ammunition, Loading, Range 80/320, Two-handed" },
  { name: "Dart", cost: 0.05, weight: 0.25, type: "Weapon", quantity: 1, notes: "1d4 piercing, Finesse, Thrown (20/60)" },
  { name: "Shortbow", cost: 25, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 piercing, Ammunition, Range 80/320, Two-handed" },
  { name: "Sling", cost: 0.1, weight: 0, type: "Weapon", quantity: 1, notes: "1d4 bludgeoning, Ammunition, Range 30/120" },

  // ======================================
  // MARTIAL MELEE WEAPONS (PHB Ch.5)
  // ======================================
  { name: "Battleaxe", cost: 10, weight: 4, type: "Weapon", quantity: 1, notes: "1d8 slashing, Versatile (1d10)" },
  { name: "Flail", cost: 10, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 bludgeoning" },
  { name: "Glaive", cost: 20, weight: 6, type: "Weapon", quantity: 1, notes: "1d10 slashing, Heavy, Reach, Two-handed" },
  { name: "Greataxe", cost: 30, weight: 7, type: "Weapon", quantity: 1, notes: "1d12 slashing, Heavy, Two-handed" },
  { name: "Greatsword", cost: 50, weight: 6, type: "Weapon", quantity: 1, notes: "2d6 slashing, Heavy, Two-handed" },
  { name: "Halberd", cost: 20, weight: 6, type: "Weapon", quantity: 1, notes: "1d10 slashing, Heavy, Reach, Two-handed" },
  { name: "Lance", cost: 10, weight: 6, type: "Weapon", quantity: 1, notes: "1d12 piercing, Reach, Special" },
  { name: "Longsword", cost: 15, weight: 3, type: "Weapon", quantity: 1, notes: "1d8 slashing, Versatile (1d10)" },
  { name: "Maul", cost: 10, weight: 10, type: "Weapon", quantity: 1, notes: "2d6 bludgeoning, Heavy, Two-handed" },
  { name: "Morningstar", cost: 15, weight: 4, type: "Weapon", quantity: 1, notes: "1d8 piercing" },
  { name: "Pike", cost: 5, weight: 18, type: "Weapon", quantity: 1, notes: "1d10 piercing, Heavy, Reach, Two-handed" },
  { name: "Rapier", cost: 25, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 piercing, Finesse" },
  { name: "Scimitar", cost: 25, weight: 3, type: "Weapon", quantity: 1, notes: "1d6 slashing, Finesse, Light" },
  { name: "Shortsword", cost: 10, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 piercing, Finesse, Light" },
  { name: "Trident", cost: 5, weight: 4, type: "Weapon", quantity: 1, notes: "1d6 piercing, Thrown (20/60), Versatile (1d8)" },
  { name: "War Pick", cost: 5, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 piercing" },
  { name: "Warhammer", cost: 15, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 bludgeoning, Versatile (1d10)" },
  { name: "Whip", cost: 2, weight: 3, type: "Weapon", quantity: 1, notes: "1d4 slashing, Finesse, Reach" },

  // ======================================
  // MARTIAL RANGED WEAPONS (PHB Ch.5)
  // ======================================
  { name: "Blowgun", cost: 10, weight: 1, type: "Weapon", quantity: 1, notes: "1 piercing, Ammunition, Loading, Range 25/100" },
  { name: "Crossbow, Hand", cost: 75, weight: 3, type: "Weapon", quantity: 1, notes: "1d6 piercing, Ammunition, Light, Loading, Range 30/120" },
  { name: "Crossbow, Heavy", cost: 50, weight: 18, type: "Weapon", quantity: 1, notes: "1d10 piercing, Ammunition, Heavy, Loading, Range 100/400, Two-handed" },
  { name: "Longbow", cost: 50, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 piercing, Ammunition, Heavy, Range 150/600, Two-handed" },
  { name: "Net", cost: 1, weight: 3, type: "Weapon", quantity: 1, notes: "Special, Thrown (5/15)" },

  // ======================================
  // AMMUNITION (PHB Ch.5)
  // ======================================
  { name: "Arrows (20)", cost: 1, weight: 1, type: "Gear", quantity: 1, notes: "Ammunition for bows" },
  { name: "Blowgun Needles (50)", cost: 1, weight: 1, type: "Gear", quantity: 1, notes: "Ammunition for blowguns" },
  { name: "Crossbow Bolts (20)", cost: 1, weight: 1.5, type: "Gear", quantity: 1, notes: "Ammunition for crossbows" },
  { name: "Sling Bullets (20)", cost: 0.04, weight: 1.5, type: "Gear", quantity: 1, notes: "Ammunition for slings" },

  // ======================================
  // LIGHT ARMOR (PHB Ch.5)
  // ======================================
  { name: "Padded Armor", cost: 5, weight: 8, type: "Armor", quantity: 1, notes: "AC 11 + Dex, Disadvantage on Stealth" },
  { name: "Leather Armor", cost: 10, weight: 10, type: "Armor", quantity: 1, notes: "AC 11 + Dex" },
  { name: "Studded Leather", cost: 45, weight: 13, type: "Armor", quantity: 1, notes: "AC 12 + Dex" },

  // ======================================
  // MEDIUM ARMOR (PHB Ch.5)
  // ======================================
  { name: "Hide Armor", cost: 10, weight: 12, type: "Armor", quantity: 1, notes: "AC 12 + Dex (max 2)" },
  { name: "Chain Shirt", cost: 50, weight: 20, type: "Armor", quantity: 1, notes: "AC 13 + Dex (max 2)" },
  { name: "Scale Mail", cost: 50, weight: 45, type: "Armor", quantity: 1, notes: "AC 14 + Dex (max 2), Disadvantage on Stealth" },
  { name: "Breastplate", cost: 400, weight: 20, type: "Armor", quantity: 1, notes: "AC 14 + Dex (max 2)" },
  { name: "Half Plate", cost: 750, weight: 40, type: "Armor", quantity: 1, notes: "AC 15 + Dex (max 2), Disadvantage on Stealth" },

  // ======================================
  // HEAVY ARMOR (PHB Ch.5)
  // ======================================
  { name: "Ring Mail", cost: 30, weight: 40, type: "Armor", quantity: 1, notes: "AC 14, Disadvantage on Stealth" },
  { name: "Chain Mail", cost: 75, weight: 55, type: "Armor", quantity: 1, notes: "AC 16, Str 13 required, Disadvantage on Stealth" },
  { name: "Splint Armor", cost: 200, weight: 60, type: "Armor", quantity: 1, notes: "AC 17, Str 15 required, Disadvantage on Stealth" },
  { name: "Plate Armor", cost: 1500, weight: 65, type: "Armor", quantity: 1, notes: "AC 18, Str 15 required, Disadvantage on Stealth" },

  // ======================================
  // SHIELDS (PHB Ch.5)
  // ======================================
  { name: "Shield", cost: 10, weight: 6, type: "Armor", quantity: 1, notes: "+2 AC" },

  // ======================================
  // ADVENTURING GEAR (PHB Ch.5)
  // ======================================
  { name: "Abacus", cost: 2, weight: 2, type: "Gear", quantity: 1, notes: "Counting tool" },
  { name: "Acid (vial)", cost: 25, weight: 1, type: "Gear", quantity: 1, notes: "2d6 acid damage, Ranged attack (20 ft)" },
  { name: "Alchemist's Fire (flask)", cost: 50, weight: 1, type: "Gear", quantity: 1, notes: "1d4 fire/turn, Ranged attack (20 ft)" },
  { name: "Antitoxin (vial)", cost: 50, weight: 0, type: "Gear", quantity: 1, notes: "Advantage on saves vs poison for 1 hour" },
  { name: "Backpack", cost: 2, weight: 5, type: "Gear", quantity: 1, notes: "Holds 30 lbs / 1 cu. ft." },
  { name: "Ball Bearings (bag of 1000)", cost: 1, weight: 2, type: "Gear", quantity: 1, notes: "10 ft area, DEX DC 10 or fall prone" },
  { name: "Barrel", cost: 2, weight: 70, type: "Gear", quantity: 1, notes: "Holds 40 gal liquid / 4 cu. ft. dry" },
  { name: "Basket", cost: 0.4, weight: 2, type: "Gear", quantity: 1, notes: "Holds 2 cu. ft. / 40 lbs" },
  { name: "Bedroll", cost: 1, weight: 7, type: "Gear", quantity: 1, notes: "Sleeping gear" },
  { name: "Bell", cost: 1, weight: 0, type: "Gear", quantity: 1, notes: "Small bell" },
  { name: "Blanket", cost: 0.5, weight: 3, type: "Gear", quantity: 1, notes: "Keeps warm" },
  { name: "Block and Tackle", cost: 1, weight: 5, type: "Gear", quantity: 1, notes: "Pulley system, lift 4x normal weight" },
  { name: "Book", cost: 25, weight: 5, type: "Gear", quantity: 1, notes: "Blank journal, 100 pages" },
  { name: "Bottle, Glass", cost: 2, weight: 2, type: "Gear", quantity: 1, notes: "Holds 1.5 pints" },
  { name: "Bucket", cost: 0.05, weight: 2, type: "Gear", quantity: 1, notes: "Holds 3 gal liquid / 0.5 cu. ft." },
  { name: "Burglar's Pack", cost: 16, weight: 44.5, type: "Gear", quantity: 1, notes: "Backpack, ball bearings, string, bell, 5 candles, crowbar, hammer, pitons, lantern, oil, rations, waterskin, rope" },
  { name: "Caltrops (bag of 20)", cost: 1, weight: 2, type: "Gear", quantity: 1, notes: "5 ft area, DEX DC 15 or 1 piercing + stop" },
  { name: "Candle", cost: 0.01, weight: 0, type: "Gear", quantity: 1, notes: "5 ft bright + 5 ft dim, 1 hour" },
  { name: "Case, Crossbow Bolt", cost: 1, weight: 1, type: "Gear", quantity: 1, notes: "Holds 20 bolts" },
  { name: "Case, Map or Scroll", cost: 1, weight: 1, type: "Gear", quantity: 1, notes: "Holds 10 sheets of paper or 5 scrolls" },
  { name: "Chain (10 feet)", cost: 5, weight: 10, type: "Gear", quantity: 1, notes: "AC 19, 10 HP, break DC 20" },
  { name: "Chalk (1 piece)", cost: 0.01, weight: 0, type: "Gear", quantity: 1, notes: "For marking" },
  { name: "Chest", cost: 5, weight: 25, type: "Gear", quantity: 1, notes: "Holds 12 cu. ft. / 300 lbs" },
  { name: "Climber's Kit", cost: 25, weight: 12, type: "Gear", quantity: 1, notes: "Pitons, boot tips, gloves, harness. Advantage on climbing checks" },
  { name: "Common Clothes", cost: 0.5, weight: 3, type: "Gear", quantity: 1, notes: "Standard clothing" },
  { name: "Component Pouch", cost: 25, weight: 2, type: "Gear", quantity: 1, notes: "Spellcasting focus (material components)" },
  { name: "Costume Clothes", cost: 5, weight: 4, type: "Gear", quantity: 1, notes: "Disguise or performance clothing" },
  { name: "Crowbar", cost: 2, weight: 5, type: "Gear", quantity: 1, notes: "Advantage on STR checks to pry" },
  { name: "Diplomat's Pack", cost: 39, weight: 36, type: "Gear", quantity: 1, notes: "Chest, 2 map cases, fine clothes, ink, pen, lamp, oil, paper, perfume, sealing wax, soap" },
  { name: "Dragonchess Set", cost: 1, weight: 0.5, type: "Gear", quantity: 1, notes: "Gaming set" },
  { name: "Dungeoneer's Pack", cost: 12, weight: 61.5, type: "Gear", quantity: 1, notes: "Backpack, crowbar, hammer, pitons, torches, tinderbox, rations, waterskin, rope" },
  { name: "Entertainer's Pack", cost: 40, weight: 38, type: "Gear", quantity: 1, notes: "Backpack, bedroll, 2 costumes, candles, rations, waterskin, disguise kit" },
  { name: "Explorer's Pack", cost: 10, weight: 59, type: "Gear", quantity: 1, notes: "Backpack, bedroll, mess kit, tinderbox, torches, rations, waterskin, rope" },
  { name: "Fine Clothes", cost: 15, weight: 6, type: "Gear", quantity: 1, notes: "High-quality clothing" },
  { name: "Fishing Tackle", cost: 1, weight: 4, type: "Gear", quantity: 1, notes: "Rod, line, hooks, bobbers, bait" },
  { name: "Flask or Tankard", cost: 0.02, weight: 1, type: "Gear", quantity: 1, notes: "Holds 1 pint" },
  { name: "Grappling Hook", cost: 2, weight: 4, type: "Gear", quantity: 1, notes: "Attach to rope for climbing" },
  { name: "Hammer", cost: 1, weight: 3, type: "Gear", quantity: 1, notes: "Standard hammer" },
  { name: "Hammer, Sledge", cost: 2, weight: 10, type: "Gear", quantity: 1, notes: "Heavy hammer" },
  { name: "Healer's Kit", cost: 5, weight: 3, type: "Gear", quantity: 1, notes: "10 uses, stabilize at 0 HP without Medicine check" },
  { name: "Holy Symbol (Amulet)", cost: 5, weight: 1, type: "Gear", quantity: 1, notes: "Spellcasting focus (divine)" },
  { name: "Holy Symbol (Emblem)", cost: 5, weight: 0, type: "Gear", quantity: 1, notes: "Spellcasting focus (divine), attach to shield" },
  { name: "Holy Symbol (Reliquary)", cost: 5, weight: 2, type: "Gear", quantity: 1, notes: "Spellcasting focus (divine)" },
  { name: "Holy Water (flask)", cost: 25, weight: 1, type: "Gear", quantity: 1, notes: "2d6 radiant to fiends/undead, Ranged (20 ft)" },
  { name: "Hourglass", cost: 25, weight: 1, type: "Gear", quantity: 1, notes: "Measure 1 minute intervals" },
  { name: "Hunting Trap", cost: 5, weight: 25, type: "Gear", quantity: 1, notes: "1d4 piercing, DC 13 STR to escape" },
  { name: "Ink (1 oz. bottle)", cost: 10, weight: 0, type: "Gear", quantity: 1, notes: "Writing ink" },
  { name: "Ink Pen", cost: 0.02, weight: 0, type: "Gear", quantity: 1, notes: "Writing pen" },
  { name: "Jug or Pitcher", cost: 0.02, weight: 4, type: "Gear", quantity: 1, notes: "Holds 1 gallon" },
  { name: "Ladder (10-foot)", cost: 0.1, weight: 25, type: "Gear", quantity: 1, notes: "10-foot wooden ladder" },
  { name: "Lamp", cost: 0.5, weight: 1, type: "Gear", quantity: 1, notes: "15 ft bright + 30 ft dim, 6 hours on 1 flask oil" },
  { name: "Lantern, Bullseye", cost: 10, weight: 2, type: "Gear", quantity: 1, notes: "60 ft cone bright + 60 ft dim, 6 hours" },
  { name: "Lantern, Hooded", cost: 5, weight: 2, type: "Gear", quantity: 1, notes: "30 ft bright + 30 ft dim, 6 hours, can dim to 5 ft" },
  { name: "Lock", cost: 10, weight: 1, type: "Gear", quantity: 1, notes: "DC 15 to pick (Dexterity check with thieves' tools)" },
  { name: "Magnifying Glass", cost: 100, weight: 0, type: "Gear", quantity: 1, notes: "Start fire in sunlight, +5 Appraise checks" },
  { name: "Manacles", cost: 2, weight: 6, type: "Gear", quantity: 1, notes: "DC 20 DEX to escape, DC 20 STR to break" },
  { name: "Mess Kit", cost: 0.2, weight: 1, type: "Gear", quantity: 1, notes: "Tin box with cup, cutlery, pan" },
  { name: "Mirror, Steel", cost: 5, weight: 0.5, type: "Gear", quantity: 1, notes: "Handheld steel mirror" },
  { name: "Oil (flask)", cost: 0.1, weight: 1, type: "Gear", quantity: 1, notes: "5 damage fire if lit, 15 ft bright + 15 ft dim, 6 hours in lamp" },
  { name: "Paper (one sheet)", cost: 0.2, weight: 0, type: "Gear", quantity: 1, notes: "Writing paper" },
  { name: "Parchment (one sheet)", cost: 0.1, weight: 0, type: "Gear", quantity: 1, notes: "Writing surface" },
  { name: "Perfume (vial)", cost: 5, weight: 0, type: "Gear", quantity: 1, notes: "Fragrance" },
  { name: "Pick, Miner's", cost: 2, weight: 10, type: "Gear", quantity: 1, notes: "Mining tool" },
  { name: "Piton", cost: 0.05, weight: 0.25, type: "Gear", quantity: 1, notes: "Iron spike for climbing" },
  { name: "Pole (10-foot)", cost: 0.05, weight: 7, type: "Gear", quantity: 1, notes: "10-foot wooden pole" },
  { name: "Pot, Iron", cost: 2, weight: 10, type: "Gear", quantity: 1, notes: "Holds 1 gallon" },
  { name: "Pouch", cost: 0.5, weight: 1, type: "Gear", quantity: 1, notes: "Holds 6 lbs / 0.2 cu. ft." },
  { name: "Priest's Pack", cost: 19, weight: 24, type: "Gear", quantity: 1, notes: "Backpack, blanket, candles, tinderbox, alms box, incense, censer, vestments, rations, waterskin" },
  { name: "Quiver", cost: 1, weight: 1, type: "Gear", quantity: 1, notes: "Holds 20 arrows" },
  { name: "Ram, Portable", cost: 4, weight: 35, type: "Gear", quantity: 1, notes: "+4 to STR checks to break down doors" },
  { name: "Rations (1 day)", cost: 0.5, weight: 2, type: "Gear", quantity: 1, notes: "Dried food for 1 day" },
  { name: "Robes", cost: 1, weight: 4, type: "Gear", quantity: 1, notes: "Standard robes" },
  { name: "Rope, Hempen (50 feet)", cost: 1, weight: 10, type: "Gear", quantity: 1, notes: "2 HP, burst DC 17" },
  { name: "Rope, Silk (50 feet)", cost: 10, weight: 5, type: "Gear", quantity: 1, notes: "2 HP, burst DC 17. Easier to climb" },
  { name: "Sack", cost: 0.01, weight: 0.5, type: "Gear", quantity: 1, notes: "Holds 30 lbs / 1 cu. ft." },
  { name: "Scale, Merchant's", cost: 5, weight: 3, type: "Gear", quantity: 1, notes: "Measures up to 2 lbs precisely" },
  { name: "Scholar's Pack", cost: 40, weight: 10, type: "Gear", quantity: 1, notes: "Backpack, book of lore, ink, pen, parchment, small knife, little bag of sand" },
  { name: "Sealing Wax", cost: 0.5, weight: 0, type: "Gear", quantity: 1, notes: "For sealing letters" },
  { name: "Shovel", cost: 2, weight: 5, type: "Gear", quantity: 1, notes: "Digging tool" },
  { name: "Signal Whistle", cost: 0.05, weight: 0, type: "Gear", quantity: 1, notes: "Audible up to 600 ft" },
  { name: "Signet Ring", cost: 5, weight: 0, type: "Gear", quantity: 1, notes: "Personal seal" },
  { name: "Soap", cost: 0.02, weight: 0, type: "Gear", quantity: 1, notes: "Cleaning" },
  { name: "Spellbook", cost: 50, weight: 3, type: "Gear", quantity: 1, notes: "100-page book for wizard spells" },
  { name: "Spike, Iron (10)", cost: 1, weight: 5, type: "Gear", quantity: 1, notes: "Iron spikes for securing doors or climbing" },
  { name: "Spyglass", cost: 1000, weight: 1, type: "Gear", quantity: 1, notes: "Objects appear 2x closer" },
  { name: "Tent, Two-Person", cost: 2, weight: 20, type: "Gear", quantity: 1, notes: "Shelter for 2 people" },
  { name: "Thieves' Tools", cost: 25, weight: 1, type: "Gear", quantity: 1, notes: "Pick locks & disarm traps (DEX check)" },
  { name: "Tinderbox", cost: 0.5, weight: 1, type: "Gear", quantity: 1, notes: "Start fire in 1 action (1 min without dry tinder)" },
  { name: "Torch", cost: 0.01, weight: 1, type: "Gear", quantity: 1, notes: "20 ft bright + 20 ft dim, 1 hour, 1 fire damage" },
  { name: "Traveler's Clothes", cost: 2, weight: 4, type: "Gear", quantity: 1, notes: "Durable traveling clothing" },
  { name: "Vial", cost: 1, weight: 0, type: "Gear", quantity: 1, notes: "Holds 4 oz liquid" },
  { name: "Waterskin", cost: 0.2, weight: 5, type: "Gear", quantity: 1, notes: "Holds 4 pints water" },
  { name: "Whetstone", cost: 0.01, weight: 1, type: "Gear", quantity: 1, notes: "Sharpen blades" },

  // ======================================
  // ARCANE FOCUSES (PHB Ch.5)
  // ======================================
  { name: "Arcane Focus — Crystal", cost: 10, weight: 1, type: "Gear", quantity: 1, notes: "Spellcasting focus (arcane)" },
  { name: "Arcane Focus — Orb", cost: 20, weight: 3, type: "Gear", quantity: 1, notes: "Spellcasting focus (arcane)" },
  { name: "Arcane Focus — Rod", cost: 10, weight: 2, type: "Gear", quantity: 1, notes: "Spellcasting focus (arcane)" },
  { name: "Arcane Focus — Staff", cost: 5, weight: 4, type: "Gear", quantity: 1, notes: "Spellcasting focus (arcane)" },
  { name: "Arcane Focus — Wand", cost: 10, weight: 1, type: "Gear", quantity: 1, notes: "Spellcasting focus (arcane)" },

  // ======================================
  // DRUIDIC FOCUSES (PHB Ch.5)
  // ======================================
  { name: "Druidic Focus — Sprig of Mistletoe", cost: 1, weight: 0, type: "Gear", quantity: 1, notes: "Spellcasting focus (druidic)" },
  { name: "Druidic Focus — Totem", cost: 1, weight: 0, type: "Gear", quantity: 1, notes: "Spellcasting focus (druidic)" },
  { name: "Druidic Focus — Wooden Staff", cost: 5, weight: 4, type: "Gear", quantity: 1, notes: "Spellcasting focus (druidic)" },
  { name: "Druidic Focus — Yew Wand", cost: 10, weight: 1, type: "Gear", quantity: 1, notes: "Spellcasting focus (druidic)" },

  // ======================================
  // MUSICAL INSTRUMENTS (PHB Ch.5)
  // ======================================
  { name: "Bagpipes", cost: 30, weight: 6, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Drum", cost: 6, weight: 3, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Dulcimer", cost: 25, weight: 10, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Flute", cost: 2, weight: 1, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Lute", cost: 35, weight: 2, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Lyre", cost: 30, weight: 2, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Horn", cost: 3, weight: 2, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Pan Flute", cost: 12, weight: 2, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Shawm", cost: 2, weight: 1, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Viol", cost: 30, weight: 1, type: "Gear", quantity: 1, notes: "Musical instrument" },

  // ======================================
  // TOOLS & KITS (PHB Ch.5)
  // ======================================
  { name: "Alchemist's Supplies", cost: 50, weight: 8, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Brewer's Supplies", cost: 20, weight: 9, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Calligrapher's Supplies", cost: 10, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Carpenter's Tools", cost: 8, weight: 6, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Cartographer's Tools", cost: 15, weight: 6, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Cobbler's Tools", cost: 5, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Cook's Utensils", cost: 1, weight: 8, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Disguise Kit", cost: 25, weight: 3, type: "Gear", quantity: 1, notes: "Proficiency lets you create disguises" },
  { name: "Forgery Kit", cost: 15, weight: 5, type: "Gear", quantity: 1, notes: "Proficiency lets you forge documents" },
  { name: "Glassblower's Tools", cost: 30, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Herbalism Kit", cost: 5, weight: 3, type: "Gear", quantity: 1, notes: "Create antitoxin and potions of healing" },
  { name: "Jeweler's Tools", cost: 25, weight: 2, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Leatherworker's Tools", cost: 5, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Mason's Tools", cost: 10, weight: 8, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Navigator's Tools", cost: 25, weight: 2, type: "Gear", quantity: 1, notes: "Determine position at sea" },
  { name: "Painter's Supplies", cost: 10, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Playing Card Set", cost: 0.5, weight: 0, type: "Gear", quantity: 1, notes: "Gaming set" },
  { name: "Poisoner's Kit", cost: 50, weight: 2, type: "Gear", quantity: 1, notes: "Create and apply poisons" },
  { name: "Potter's Tools", cost: 10, weight: 3, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Smith's Tools", cost: 20, weight: 8, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Three-Dragon Ante Set", cost: 1, weight: 0, type: "Gear", quantity: 1, notes: "Gaming set" },
  { name: "Tinker's Tools", cost: 50, weight: 10, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Weaver's Tools", cost: 1, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Woodcarver's Tools", cost: 1, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },

  // ======================================
  // CONSUMABLES & POTIONS
  // ======================================
  { name: "Potion of Healing", cost: 50, weight: 0.5, type: "Consumable", quantity: 1, notes: "Heals 2d4+2 HP" },
  { name: "Potion of Greater Healing", cost: 150, weight: 0.5, type: "Consumable", quantity: 1, notes: "Heals 4d4+4 HP" },
  { name: "Potion of Climbing", cost: 75, weight: 0.5, type: "Consumable", quantity: 1, notes: "Climbing speed equal to walking speed for 1 hour" },
  { name: "Oil of Slipperiness", cost: 100, weight: 0.5, type: "Consumable", quantity: 1, notes: "Freedom of Movement for 8 hours" },
  { name: "Philter of Love", cost: 90, weight: 0.5, type: "Consumable", quantity: 1, notes: "Charmed for 1 hour after drinking" },
  { name: "Potion of Animal Friendship", cost: 100, weight: 0.5, type: "Consumable", quantity: 1, notes: "Animal Friendship (save DC 13) for 1 hour" },
  { name: "Potion of Fire Breath", cost: 150, weight: 0.5, type: "Consumable", quantity: 1, notes: "Exhale fire 30 ft, 4d6 fire (DEX DC 13), 3 uses, 1 hour" },
  { name: "Potion of Resistance", cost: 300, weight: 0.5, type: "Consumable", quantity: 1, notes: "Resistance to one damage type for 1 hour" },
  { name: "Potion of Water Breathing", cost: 100, weight: 0.5, type: "Consumable", quantity: 1, notes: "Breathe underwater for 1 hour" },
];

// ==========================================
// Racial Traits (PHB)
// ==========================================
export interface RacialTrait { name: string; description: string; }
export interface RacialSpell { name: string; level: number; minCharLevel: number; }
export interface RaceTraitData {
  traits: RacialTrait[]; languages: string[]; darkvision?: number; size: 'Small' | 'Medium';
  racialSpells?: RacialSpell[]; skillProficiencies?: string[]; weaponProficiencies?: string[];
  armorProficiencies?: string[]; toolProficiencyChoices?: string[]; resistances?: string[];
  extraSkillChoices?: number; extraLanguageChoices?: number; hpBonusPerLevel?: number;
}
export const RACE_TRAITS: Record<string, RaceTraitData> = {
  'Dragonborn': { traits: [
    { name: 'Draconic Ancestry', description: 'Choose a dragon type for breath weapon and damage resistance.' },
    { name: 'Breath Weapon', description: 'Action: exhale destructive energy. DC 8+CON mod+prof. 2d6 at 1st, 3d6 at 6th, 4d6 at 11th, 5d6 at 16th.' },
    { name: 'Damage Resistance', description: 'Resistance to your ancestry damage type.' },
  ], languages: ['Common', 'Draconic'], size: 'Medium' },
  'Hill Dwarf': { traits: [
    { name: 'Dwarven Resilience', description: 'Advantage on saves vs poison; resistance to poison damage.' },
    { name: 'Stonecunning', description: 'Double proficiency on History checks related to stonework.' },
    { name: 'Dwarven Toughness', description: 'HP max increases by 1 per level.' },
  ], languages: ['Common', 'Dwarvish'], darkvision: 60, size: 'Medium',
    weaponProficiencies: ['Battleaxe', 'Handaxe', 'Light hammer', 'Warhammer'],
    toolProficiencyChoices: ["Smith's Tools", "Brewer's Supplies", "Mason's Tools"],
    resistances: ['Poison'], hpBonusPerLevel: 1 },
  'Mountain Dwarf': { traits: [
    { name: 'Dwarven Resilience', description: 'Advantage on saves vs poison; resistance to poison damage.' },
    { name: 'Stonecunning', description: 'Double proficiency on History checks related to stonework.' },
    { name: 'Dwarven Armor Training', description: 'Proficiency with light and medium armor.' },
  ], languages: ['Common', 'Dwarvish'], darkvision: 60, size: 'Medium',
    weaponProficiencies: ['Battleaxe', 'Handaxe', 'Light hammer', 'Warhammer'],
    armorProficiencies: ['Light', 'Medium'],
    toolProficiencyChoices: ["Smith's Tools", "Brewer's Supplies", "Mason's Tools"],
    resistances: ['Poison'] },
  'High Elf': { traits: [
    { name: 'Keen Senses', description: 'Proficiency in Perception.' },
    { name: 'Fey Ancestry', description: 'Advantage on saves vs charmed; immune to magical sleep.' },
    { name: 'Trance', description: 'Meditate 4 hours instead of sleeping 8.' },
    { name: 'Cantrip', description: 'One wizard cantrip of your choice. INT is your spellcasting ability.' },
  ], languages: ['Common', 'Elvish'], darkvision: 60, size: 'Medium',
    skillProficiencies: ['Perception'], weaponProficiencies: ['Longsword', 'Shortsword', 'Shortbow', 'Longbow'],
    extraLanguageChoices: 1 },
  'Wood Elf': { traits: [
    { name: 'Keen Senses', description: 'Proficiency in Perception.' },
    { name: 'Fey Ancestry', description: 'Advantage on saves vs charmed; immune to magical sleep.' },
    { name: 'Trance', description: 'Meditate 4 hours instead of sleeping 8.' },
    { name: 'Fleet of Foot', description: 'Base walking speed is 35 feet.' },
    { name: 'Mask of the Wild', description: 'Hide when lightly obscured by natural phenomena.' },
  ], languages: ['Common', 'Elvish'], darkvision: 60, size: 'Medium',
    skillProficiencies: ['Perception'], weaponProficiencies: ['Longsword', 'Shortsword', 'Shortbow', 'Longbow'] },
  'Drow Elf': { traits: [
    { name: 'Superior Darkvision', description: 'Darkvision 120 feet.' },
    { name: 'Keen Senses', description: 'Proficiency in Perception.' },
    { name: 'Fey Ancestry', description: 'Advantage on saves vs charmed; immune to magical sleep.' },
    { name: 'Trance', description: 'Meditate 4 hours instead of sleeping 8.' },
    { name: 'Sunlight Sensitivity', description: 'Disadvantage on attacks and Perception in direct sunlight.' },
    { name: 'Drow Magic', description: 'Dancing Lights at 1st. Faerie Fire 1/long rest at 3rd. Darkness 1/long rest at 5th. CHA spellcasting.' },
  ], languages: ['Common', 'Elvish'], darkvision: 120, size: 'Medium',
    skillProficiencies: ['Perception'], weaponProficiencies: ['Rapier', 'Shortsword', 'Hand crossbow'],
    racialSpells: [{ name: 'Dancing Lights', level: 0, minCharLevel: 1 }, { name: 'Faerie Fire', level: 1, minCharLevel: 3 }, { name: 'Darkness', level: 2, minCharLevel: 5 }] },
  'Forest Gnome': { traits: [
    { name: 'Gnome Cunning', description: 'Advantage on INT/WIS/CHA saves against magic.' },
    { name: 'Natural Illusionist', description: 'You know Minor Illusion cantrip. INT spellcasting.' },
    { name: 'Speak with Small Beasts', description: 'Communicate simple ideas with Small or smaller beasts.' },
  ], languages: ['Common', 'Gnomish'], darkvision: 60, size: 'Small',
    racialSpells: [{ name: 'Minor Illusion', level: 0, minCharLevel: 1 }] },
  'Rock Gnome': { traits: [
    { name: 'Gnome Cunning', description: 'Advantage on INT/WIS/CHA saves against magic.' },
    { name: "Artificer's Lore", description: 'Double proficiency on History checks for magic items, alchemical objects, or tech.' },
    { name: 'Tinker', description: "Proficiency with tinker's tools. Construct Tiny clockwork devices (10 gp, 1 hour)." },
  ], languages: ['Common', 'Gnomish'], darkvision: 60, size: 'Small',
    toolProficiencyChoices: ["Tinker's Tools"] },
  'Half-Elf': { traits: [
    { name: 'Fey Ancestry', description: 'Advantage on saves vs charmed; immune to magical sleep.' },
    { name: 'Skill Versatility', description: 'Gain proficiency in two skills of your choice.' },
  ], languages: ['Common', 'Elvish'], darkvision: 60, size: 'Medium',
    extraSkillChoices: 2, extraLanguageChoices: 1 },
  'Half-Orc': { traits: [
    { name: 'Menacing', description: 'Proficiency in Intimidation.' },
    { name: 'Relentless Endurance', description: 'Drop to 1 HP instead of 0 once per long rest.' },
    { name: 'Savage Attacks', description: 'On a melee crit, roll one extra weapon damage die.' },
  ], languages: ['Common', 'Orc'], darkvision: 60, size: 'Medium',
    skillProficiencies: ['Intimidation'] },
  'Lightfoot Halfling': { traits: [
    { name: 'Lucky', description: 'Reroll 1s on d20 attack rolls, ability checks, and saving throws.' },
    { name: 'Brave', description: 'Advantage on saves vs frightened.' },
    { name: 'Halfling Nimbleness', description: 'Move through space of creatures one size larger.' },
    { name: 'Naturally Stealthy', description: 'Hide when obscured by a creature at least one size larger.' },
  ], languages: ['Common', 'Halfling'], size: 'Small' },
  'Stout Halfling': { traits: [
    { name: 'Lucky', description: 'Reroll 1s on d20 attack rolls, ability checks, and saving throws.' },
    { name: 'Brave', description: 'Advantage on saves vs frightened.' },
    { name: 'Halfling Nimbleness', description: 'Move through space of creatures one size larger.' },
    { name: 'Stout Resilience', description: 'Advantage on saves vs poison; resistance to poison damage.' },
  ], languages: ['Common', 'Halfling'], size: 'Small', resistances: ['Poison'] },
  'Human': { traits: [
    { name: 'Versatile', description: '+1 to all ability scores. One extra language of your choice.' },
  ], languages: ['Common'], size: 'Medium', extraLanguageChoices: 1 },
  'Tiefling': { traits: [
    { name: 'Hellish Resistance', description: 'Resistance to fire damage.' },
    { name: 'Infernal Legacy', description: 'Thaumaturgy at 1st. Hellish Rebuke (2nd-level) 1/long rest at 3rd. Darkness 1/long rest at 5th. CHA spellcasting.' },
  ], languages: ['Common', 'Infernal'], darkvision: 60, size: 'Medium', resistances: ['Fire'],
    racialSpells: [{ name: 'Dancing Lights', level: 0, minCharLevel: 1 }, { name: 'Hellish Rebuke', level: 1, minCharLevel: 3 }, { name: 'Darkness', level: 2, minCharLevel: 5 }] },
};

export const getRaceTraits = (race: string): RaceTraitData | undefined => RACE_TRAITS[race];

export const getAllRaceOptions = () => DND_RACES.flatMap(r => r.subraces ? r.subraces : [r.name]);
export const getRaceSpeed = (n: string) => DND_RACES.find(r => r.name === n || r.subraces?.includes(n))?.speed || 30;
export const getClassData = (n: string) => DND_CLASSES.find(c => c.name === n);
export const getRacialBonus = (r: string, s: StatKey) => RACIAL_BONUSES[r]?.[s] ?? 0;
export const getRacialBonusDisplay = (r: string) => Object.entries(RACIAL_BONUSES[r] || {}).map(([s,v]) => `+${v} ${s}`).join(', ') || 'None';

// ==========================================
// Class Feature Progression (PHB)
// ==========================================
export interface ClassFeatureEntry { name: string; description: string; }
export const CLASS_FEATURES: Record<string, Record<number, ClassFeatureEntry[]>> = {
  'Barbarian': {
    1: [{ name: 'Rage', description: 'Bonus action: advantage on STR checks/saves, +2 rage damage, resistance to bludgeoning/piercing/slashing. 2/long rest.' },
        { name: 'Unarmored Defense', description: 'AC = 10 + DEX mod + CON mod (no armor).' }],
    2: [{ name: 'Reckless Attack', description: 'Advantage on melee STR attacks; attacks against you have advantage until next turn.' },
        { name: 'Danger Sense', description: 'Advantage on DEX saves against effects you can see.' }],
    3: [{ name: 'Primal Path', description: 'Choose: Berserker or Totem Warrior.' }],
    5: [{ name: 'Extra Attack', description: 'Attack twice per Attack action.' }, { name: 'Fast Movement', description: '+10 ft speed (no heavy armor).' }],
    7: [{ name: 'Feral Instinct', description: 'Advantage on initiative. Act normally if surprised and you rage.' }],
    9: [{ name: 'Brutal Critical (1 die)', description: '+1 weapon damage die on critical hits.' }],
    11: [{ name: 'Relentless Rage', description: 'DC 10 CON save to stay at 1 HP instead of 0 while raging.' }],
    15: [{ name: 'Persistent Rage', description: 'Rage only ends if you fall unconscious or choose to end it.' }],
    18: [{ name: 'Indomitable Might', description: 'Use STR score if STR check result is lower.' }],
    20: [{ name: 'Primal Champion', description: 'STR and CON +4 (max 24).' }],
  },
  'Bard': {
    1: [{ name: 'Spellcasting', description: 'CHA-based. Cantrips and spells known from bard list.' },
        { name: 'Bardic Inspiration (d6)', description: 'Bonus action: give creature within 60ft a d6 inspiration die. CHA mod uses/long rest.' }],
    2: [{ name: 'Jack of All Trades', description: 'Add half proficiency to unproficient ability checks.' },
        { name: 'Song of Rest (d6)', description: 'Allies regain extra 1d6 HP during short rest if they spend Hit Dice.' }],
    3: [{ name: 'Bard College', description: 'Choose: College of Lore or College of Valor.' },
        { name: 'Expertise', description: 'Double proficiency for two skills.' }],
    5: [{ name: 'Bardic Inspiration (d8)', description: 'Inspiration die becomes d8.' },
        { name: 'Font of Inspiration', description: 'Regain all Bardic Inspiration on short rest.' }],
    6: [{ name: 'Countercharm', description: 'Allies within 30ft have advantage vs frightened/charmed.' }],
    10: [{ name: 'Bardic Inspiration (d10)', description: 'Inspiration die becomes d10.' },
         { name: 'Expertise (2)', description: 'Double proficiency for two more skills.' },
         { name: 'Magical Secrets', description: 'Learn 2 spells from any class.' }],
    15: [{ name: 'Bardic Inspiration (d12)', description: 'Inspiration die becomes d12.' }],
    18: [{ name: 'Magical Secrets (3)', description: 'Learn 2 more spells from any class.' }],
    20: [{ name: 'Superior Inspiration', description: 'Regain 1 Bardic Inspiration if you have none on initiative.' }],
  },
  'Cleric': {
    1: [{ name: 'Spellcasting', description: 'WIS-based prepared caster.' },
        { name: 'Divine Domain', description: 'Choose: Knowledge, Life, Light, Nature, Tempest, Trickery, or War.' }],
    2: [{ name: 'Channel Divinity (1/rest)', description: 'Turn Undead + domain channel divinity.' }],
    5: [{ name: 'Destroy Undead (CR 1/2)', description: 'Turned undead CR 1/2 or lower are destroyed.' }],
    6: [{ name: 'Channel Divinity (2/rest)', description: 'Two uses between rests.' }],
    8: [{ name: 'Destroy Undead (CR 1)', description: 'Destroy undead CR 1 or lower.' }],
    10: [{ name: 'Divine Intervention', description: 'Call on deity: d100 roll ≤ cleric level = success.' }],
    17: [{ name: 'Destroy Undead (CR 4)', description: 'Destroy undead CR 4 or lower.' }],
    18: [{ name: 'Channel Divinity (3/rest)', description: 'Three uses between rests.' }],
    20: [{ name: 'Divine Intervention Improvement', description: 'Auto-success.' }],
  },
  'Druid': {
    1: [{ name: 'Druidic', description: 'Secret druid language.' },
        { name: 'Spellcasting', description: 'WIS-based prepared caster.' }],
    2: [{ name: 'Wild Shape', description: 'Transform into beast. Max CR 1/4, no fly/swim. 2/short rest.' },
        { name: 'Druid Circle', description: 'Choose: Circle of the Land or Circle of the Moon.' }],
    4: [{ name: 'Wild Shape (CR 1/2)', description: 'Max CR 1/2, no flying.' }],
    8: [{ name: 'Wild Shape (CR 1)', description: 'Max CR 1, flying allowed.' }],
    18: [{ name: 'Timeless Body', description: 'Age 10x slower.' }, { name: 'Beast Spells', description: 'Cast spells in Wild Shape.' }],
    20: [{ name: 'Archdruid', description: 'Unlimited Wild Shape. Ignore V/S components.' }],
  },
  'Fighter': {
    1: [{ name: 'Fighting Style', description: 'Choose: Archery, Defense, Dueling, Great Weapon Fighting, Protection, or Two-Weapon Fighting.' },
        { name: 'Second Wind', description: 'Bonus action: regain 1d10 + fighter level HP. 1/short rest.' }],
    2: [{ name: 'Action Surge', description: 'One additional action. 1/short rest.' }],
    3: [{ name: 'Martial Archetype', description: 'Choose: Champion, Battle Master, or Eldritch Knight.' }],
    5: [{ name: 'Extra Attack', description: 'Attack twice per Attack action.' }],
    9: [{ name: 'Indomitable (1)', description: 'Reroll a failed save. 1/long rest.' }],
    11: [{ name: 'Extra Attack (2)', description: 'Three attacks per Attack action.' }],
    13: [{ name: 'Indomitable (2)', description: 'Two rerolls per long rest.' }],
    17: [{ name: 'Action Surge (2)', description: 'Two uses per short rest.' }, { name: 'Indomitable (3)', description: 'Three rerolls per long rest.' }],
    20: [{ name: 'Extra Attack (3)', description: 'Four attacks per Attack action.' }],
  },
  'Monk': {
    1: [{ name: 'Unarmored Defense', description: 'AC = 10 + DEX mod + WIS mod (no armor).' },
        { name: 'Martial Arts', description: 'Use DEX for monk weapons. Unarmed = 1d4. Bonus action unarmed strike.' }],
    2: [{ name: 'Ki', description: 'Ki points = monk level. Flurry of Blows, Patient Defense, Step of the Wind.' },
        { name: 'Unarmored Movement (+10ft)', description: '+10ft speed without armor/shield.' }],
    3: [{ name: 'Monastic Tradition', description: 'Choose: Open Hand, Shadow, or Four Elements.' },
        { name: 'Deflect Missiles', description: 'Reduce ranged attack damage by 1d10 + DEX mod + level.' }],
    4: [{ name: 'Slow Fall', description: 'Reduce fall damage by 5 × monk level.' }],
    5: [{ name: 'Extra Attack', description: 'Attack twice per Attack action.' },
        { name: 'Stunning Strike', description: '1 ki: target CON save or stunned.' }],
    6: [{ name: 'Ki-Empowered Strikes', description: 'Unarmed strikes count as magical.' }],
    7: [{ name: 'Evasion', description: 'No damage on DEX save success; half on fail.' },
        { name: 'Stillness of Mind', description: 'End one charmed/frightened effect as action.' }],
    10: [{ name: 'Purity of Body', description: 'Immune to disease and poison.' }],
    14: [{ name: 'Diamond Soul', description: 'Proficient in all saves. 1 ki to reroll failed save.' }],
    18: [{ name: 'Empty Body', description: '4 ki: invisible 1 min. 8 ki: Astral Projection.' }],
    20: [{ name: 'Perfect Self', description: 'Regain 4 ki if you have none on initiative.' }],
  },
  'Paladin': {
    1: [{ name: 'Divine Sense', description: 'Detect celestials/fiends/undead within 60ft. 1+CHA mod uses/long rest.' },
        { name: 'Lay on Hands', description: 'Pool = 5 × paladin level. Heal HP or cure disease/poison (5 HP each).' }],
    2: [{ name: 'Fighting Style', description: 'Choose: Defense, Dueling, Great Weapon Fighting, or Protection.' },
        { name: 'Spellcasting', description: 'CHA-based prepared caster (half-caster).' },
        { name: 'Divine Smite', description: 'On melee hit, expend slot: +2d8 radiant (+1d8/slot above 1st, max 5d8). +1d8 vs undead/fiend.' }],
    3: [{ name: 'Divine Health', description: 'Immune to disease.' },
        { name: 'Sacred Oath', description: 'Choose: Devotion, Ancients, or Vengeance.' }],
    5: [{ name: 'Extra Attack', description: 'Attack twice per Attack action.' }],
    6: [{ name: 'Aura of Protection', description: 'You + allies within 10ft add CHA mod to saves.' }],
    10: [{ name: 'Aura of Courage', description: "You + allies within 10ft can't be frightened." }],
    11: [{ name: 'Improved Divine Smite', description: 'All melee hits deal +1d8 radiant.' }],
    14: [{ name: 'Cleansing Touch', description: 'End one spell on yourself/ally. CHA mod uses/long rest.' }],
    18: [{ name: 'Aura Improvements', description: 'Auras extend to 30 feet.' }],
  },
  'Ranger': {
    1: [{ name: 'Favored Enemy', description: 'Choose enemy type. Advantage on Survival to track, INT to recall info.' },
        { name: 'Natural Explorer', description: 'Choose terrain. Travel benefits and advantage on INT/WIS checks.' }],
    2: [{ name: 'Fighting Style', description: 'Choose: Archery, Defense, Dueling, or Two-Weapon Fighting.' },
        { name: 'Spellcasting', description: 'WIS-based known caster (half-caster, starts at level 2).' }],
    3: [{ name: 'Ranger Archetype', description: 'Choose: Hunter or Beast Master.' },
        { name: 'Primeval Awareness', description: 'Spend slot to sense aberrations/celestials/dragons/elementals/fey/fiends/undead within 1 mile.' }],
    5: [{ name: 'Extra Attack', description: 'Attack twice per Attack action.' }],
    8: [{ name: "Land's Stride", description: 'No extra cost for nonmagical difficult terrain.' }],
    10: [{ name: 'Hide in Plain Sight', description: '+10 Stealth when pressed against solid surface.' }],
    14: [{ name: 'Vanish', description: 'Hide as bonus action. Cannot be tracked nonmagically.' }],
    18: [{ name: 'Feral Senses', description: 'No disadvantage vs invisible creatures. Sense invisible within 30ft.' }],
    20: [{ name: 'Foe Slayer', description: 'Add WIS mod to attack or damage vs favored enemy, once/turn.' }],
  },
  'Rogue': {
    1: [{ name: 'Expertise', description: 'Double proficiency for two skills or one skill + thieves\' tools.' },
        { name: 'Sneak Attack (1d6)', description: 'Once/turn extra damage with advantage or ally adjacent. +1d6 every 2 levels.' },
        { name: "Thieves' Cant", description: 'Secret rogue language.' }],
    2: [{ name: 'Cunning Action', description: 'Bonus action: Dash, Disengage, or Hide.' }],
    3: [{ name: 'Roguish Archetype', description: 'Choose: Thief, Assassin, or Arcane Trickster.' }],
    5: [{ name: 'Uncanny Dodge', description: 'Reaction: halve damage from one attack.' }],
    6: [{ name: 'Expertise (2)', description: 'Double proficiency for two more skills.' }],
    7: [{ name: 'Evasion', description: 'No damage on DEX save success; half on fail.' }],
    11: [{ name: 'Reliable Talent', description: 'Minimum 10 on d20 for proficient ability checks.' }],
    14: [{ name: 'Blindsense', description: 'Sense hidden/invisible creatures within 10ft.' }],
    15: [{ name: 'Slippery Mind', description: 'Proficiency in WIS saves.' }],
    18: [{ name: 'Elusive', description: 'No attack has advantage against you.' }],
    20: [{ name: 'Stroke of Luck', description: 'Turn miss into hit, or failed check into 20. 1/short rest.' }],
  },
  'Sorcerer': {
    1: [{ name: 'Spellcasting', description: 'CHA-based known caster.' },
        { name: 'Sorcerous Origin', description: 'Choose: Draconic Bloodline or Wild Magic.' }],
    2: [{ name: 'Font of Magic', description: 'Sorcery points = sorcerer level. Convert between points and spell slots.' }],
    3: [{ name: 'Metamagic', description: 'Choose 2: Careful, Distant, Empowered, Extended, Heightened, Quickened, Subtle, Twinned.' }],
    10: [{ name: 'Metamagic (3)', description: 'Learn one more Metamagic option.' }],
    17: [{ name: 'Metamagic (4)', description: 'Learn one more Metamagic option.' }],
    20: [{ name: 'Sorcerous Restoration', description: 'Regain 4 sorcery points on short rest.' }],
  },
  'Warlock': {
    1: [{ name: 'Otherworldly Patron', description: 'Choose: Archfey, Fiend, or Great Old One.' },
        { name: 'Pact Magic', description: 'CHA-based known caster. Slots recharge on short rest, all same level.' }],
    2: [{ name: 'Eldritch Invocations', description: 'Choose 2 invocations (Agonizing Blast, Devil\'s Sight, etc.).' }],
    3: [{ name: 'Pact Boon', description: 'Choose: Pact of Chain (familiar), Blade (weapon), or Tome (cantrips).' }],
    11: [{ name: 'Mystic Arcanum (6th)', description: 'One 6th-level spell 1/long rest.' }],
    13: [{ name: 'Mystic Arcanum (7th)', description: 'One 7th-level spell 1/long rest.' }],
    15: [{ name: 'Mystic Arcanum (8th)', description: 'One 8th-level spell 1/long rest.' }],
    17: [{ name: 'Mystic Arcanum (9th)', description: 'One 9th-level spell 1/long rest.' }],
    20: [{ name: 'Eldritch Master', description: 'Regain all Pact Magic slots (1 min). 1/long rest.' }],
  },
  'Wizard': {
    1: [{ name: 'Spellcasting', description: 'INT-based prepared caster via spellbook. Start with 6 1st-level spells.' },
        { name: 'Arcane Recovery', description: 'After short rest: recover slots totaling ≤ half wizard level (rounded up). 1/day.' }],
    2: [{ name: 'Arcane Tradition', description: 'Choose school: Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, or Transmutation.' }],
    18: [{ name: 'Spell Mastery', description: 'Choose a 1st + 2nd level spell to cast at will.' }],
    20: [{ name: 'Signature Spells', description: 'Two 3rd-level spells always prepared, cast each 1/short rest free.' }],
  },
};

// ==========================================
// Spell Slot Progression (PHB)
// ==========================================
// Full casters: Bard, Cleric, Druid, Sorcerer, Wizard — [1st,2nd,3rd,4th,5th,6th,7th,8th,9th]
export const FULL_CASTER_SLOTS: Record<number, number[]> = {
  1:[2,0,0,0,0,0,0,0,0], 2:[3,0,0,0,0,0,0,0,0], 3:[4,2,0,0,0,0,0,0,0], 4:[4,3,0,0,0,0,0,0,0],
  5:[4,3,2,0,0,0,0,0,0], 6:[4,3,3,0,0,0,0,0,0], 7:[4,3,3,1,0,0,0,0,0], 8:[4,3,3,2,0,0,0,0,0],
  9:[4,3,3,3,1,0,0,0,0], 10:[4,3,3,3,2,0,0,0,0], 11:[4,3,3,3,2,1,0,0,0], 12:[4,3,3,3,2,1,0,0,0],
  13:[4,3,3,3,2,1,1,0,0], 14:[4,3,3,3,2,1,1,0,0], 15:[4,3,3,3,2,1,1,1,0], 16:[4,3,3,3,2,1,1,1,0],
  17:[4,3,3,3,2,1,1,1,1], 18:[4,3,3,3,3,1,1,1,1], 19:[4,3,3,3,3,2,1,1,1], 20:[4,3,3,3,3,2,2,1,1],
};
// Half casters: Paladin, Ranger — [1st,2nd,3rd,4th,5th]
export const HALF_CASTER_SLOTS: Record<number, number[]> = {
  1:[0,0,0,0,0], 2:[2,0,0,0,0], 3:[3,0,0,0,0], 4:[3,0,0,0,0], 5:[4,2,0,0,0],
  6:[4,2,0,0,0], 7:[4,3,0,0,0], 8:[4,3,0,0,0], 9:[4,3,2,0,0], 10:[4,3,2,0,0],
  11:[4,3,3,0,0], 12:[4,3,3,0,0], 13:[4,3,3,1,0], 14:[4,3,3,1,0], 15:[4,3,3,2,0],
  16:[4,3,3,2,0], 17:[4,3,3,3,1], 18:[4,3,3,3,1], 19:[4,3,3,3,2], 20:[4,3,3,3,2],
};
// Warlock Pact Magic
export const WARLOCK_PACT_SLOTS: Record<number, { count: number; level: number }> = {
  1:{count:1,level:1}, 2:{count:2,level:1}, 3:{count:2,level:2}, 4:{count:2,level:2},
  5:{count:2,level:3}, 6:{count:2,level:3}, 7:{count:2,level:4}, 8:{count:2,level:4},
  9:{count:2,level:5}, 10:{count:2,level:5}, 11:{count:3,level:5}, 12:{count:3,level:5},
  13:{count:3,level:5}, 14:{count:3,level:5}, 15:{count:3,level:5}, 16:{count:3,level:5},
  17:{count:4,level:5}, 18:{count:4,level:5}, 19:{count:4,level:5}, 20:{count:4,level:5},
};
// Cantrips known at level thresholds (use highest threshold ≤ char level)
export const CANTRIPS_KNOWN: Record<string, Record<number, number>> = {
  'Bard':{ 1:2, 4:3, 10:4 }, 'Cleric':{ 1:3, 4:4, 10:5 }, 'Druid':{ 1:2, 4:3, 10:4 },
  'Sorcerer':{ 1:4, 4:5, 10:6 }, 'Warlock':{ 1:2, 4:3, 10:4 }, 'Wizard':{ 1:3, 4:4, 10:5 },
};
// Spells known for "known" casters (level thresholds)
export const SPELLS_KNOWN: Record<string, Record<number, number>> = {
  'Bard':{ 1:4, 2:5, 3:6, 4:7, 5:8, 6:9, 7:10, 8:11, 9:12, 10:14, 11:15, 13:16, 14:18, 15:19, 17:20, 18:22 },
  'Ranger':{ 2:2, 3:3, 5:4, 7:5, 9:6, 11:7, 13:8, 15:9, 17:10, 19:11 },
  'Sorcerer':{ 1:2, 2:3, 3:4, 4:5, 5:6, 6:7, 7:8, 8:9, 9:10, 10:11, 11:12, 13:13, 15:14, 17:15 },
  'Warlock':{ 1:2, 2:3, 3:4, 4:5, 5:6, 6:7, 7:8, 8:9, 9:10, 11:11, 13:12, 15:13, 17:14, 19:15 },
  'Wizard':{ 1:6, 2:8, 3:10, 4:12, 5:14, 6:16, 7:18, 8:20, 9:22, 10:24, 11:26, 12:28, 13:30, 14:32, 15:34, 16:36, 17:38, 18:40, 19:42, 20:44 },
};

// ==========================================
// Class Cantrip Lists (PHB SRD)
// ==========================================
export const CLASS_CANTRIPS: Record<string, string[]> = {
  'Bard': ['Blade Ward','Dancing Lights','Friends','Light','Mage Hand','Mending','Message','Minor Illusion','Prestidigitation','True Strike','Vicious Mockery'],
  'Cleric': ['Guidance','Light','Mending','Resistance','Sacred Flame','Spare the Dying','Thaumaturgy'],
  'Druid': ['Druidcraft','Guidance','Mending','Poison Spray','Produce Flame','Resistance','Shillelagh','Thorn Whip'],
  'Sorcerer': ['Acid Splash','Blade Ward','Chill Touch','Dancing Lights','Fire Bolt','Friends','Light','Mage Hand','Mending','Message','Minor Illusion','Poison Spray','Prestidigitation','Ray of Frost','Shocking Grasp','True Strike'],
  'Warlock': ['Blade Ward','Chill Touch','Eldritch Blast','Friends','Mage Hand','Minor Illusion','Poison Spray','Prestidigitation','True Strike'],
  'Wizard': ['Acid Splash','Blade Ward','Chill Touch','Dancing Lights','Fire Bolt','Friends','Light','Mage Hand','Mending','Message','Minor Illusion','Poison Spray','Prestidigitation','Ray of Frost','Shocking Grasp','True Strike'],
};

// ==========================================
// Class 1st-Level Spell Lists (PHB SRD)
// ==========================================
export const CLASS_SPELLS_1ST: Record<string, string[]> = {
  'Bard': ['Animal Friendship','Bane','Charm Person','Comprehend Languages','Cure Wounds','Detect Magic','Disguise Self','Dissonant Whispers','Faerie Fire','Feather Fall','Healing Word','Heroism','Identify','Longstrider','Silent Image','Sleep','Speak with Animals','Thunderwave','Unseen Servant'],
  'Cleric': ['Bane','Bless','Command','Create or Destroy Water','Cure Wounds','Detect Evil and Good','Detect Magic','Detect Poison and Disease','Guiding Bolt','Healing Word','Inflict Wounds','Protection from Evil and Good','Purify Food and Drink','Sanctuary','Shield of Faith'],
  'Druid': ['Animal Friendship','Charm Person','Create or Destroy Water','Cure Wounds','Detect Magic','Detect Poison and Disease','Entangle','Faerie Fire','Fog Cloud','Goodberry','Healing Word','Jump','Longstrider','Purify Food and Drink','Speak with Animals','Thunderwave'],
  'Paladin': ['Bless','Command','Compelled Duel','Cure Wounds','Detect Evil and Good','Detect Magic','Detect Poison and Disease','Divine Favor','Heroism','Protection from Evil and Good','Purify Food and Drink','Searing Smite','Shield of Faith','Thunderous Smite','Wrathful Smite'],
  'Ranger': ['Alarm','Animal Friendship','Cure Wounds','Detect Magic','Detect Poison and Disease','Ensnaring Strike','Fog Cloud','Goodberry','Hail of Thorns','Hunter\'s Mark','Jump','Longstrider','Speak with Animals'],
  'Sorcerer': ['Burning Hands','Charm Person','Chromatic Orb','Color Spray','Comprehend Languages','Detect Magic','Disguise Self','Expeditious Retreat','False Life','Feather Fall','Fog Cloud','Jump','Mage Armor','Magic Missile','Ray of Sickness','Shield','Silent Image','Sleep','Thunderwave','Witch Bolt'],
  'Warlock': ['Armor of Agathys','Arms of Hadar','Charm Person','Comprehend Languages','Expeditious Retreat','Hellish Rebuke','Hex','Illusory Script','Protection from Evil and Good','Unseen Servant','Witch Bolt'],
  'Wizard': ['Alarm','Burning Hands','Charm Person','Chromatic Orb','Color Spray','Comprehend Languages','Detect Magic','Disguise Self','Expeditious Retreat','False Life','Feather Fall','Find Familiar','Fog Cloud','Grease','Identify','Illusory Script','Jump','Longstrider','Mage Armor','Magic Missile','Protection from Evil and Good','Ray of Sickness','Shield','Silent Image','Sleep','Tasha\'s Hideous Laughter','Thunderwave','Unseen Servant','Witch Bolt'],
};

// ==========================================
// Helper Functions
// ==========================================
export const getClassFeatures = (className: string, level: number): ClassFeatureEntry[] =>
  CLASS_FEATURES[className]?.[level] || [];

export const isASILevel = (className: string, level: number): boolean => {
  const cls = DND_CLASSES.find(c => c.name === className);
  return cls?.asiLevels.includes(level) ?? false;
};

export const isExpertiseLevel = (className: string, level: number): boolean => {
  const cls = DND_CLASSES.find(c => c.name === className);
  return cls?.expertiseLevels?.includes(level) ?? false;
};

export const getSpellSlotsForLevel = (className: string, charLevel: number): { level: number; max: number }[] => {
  const cls = DND_CLASSES.find(c => c.name === className);
  if (!cls?.isCaster) return [];
  if (className === 'Warlock') {
    const pact = WARLOCK_PACT_SLOTS[charLevel];
    return pact ? [{ level: pact.level, max: pact.count }] : [];
  }
  const isHalf = className === 'Paladin' || className === 'Ranger';
  const table = isHalf ? HALF_CASTER_SLOTS : FULL_CASTER_SLOTS;
  const slots = table[charLevel] || [];
  return slots.map((max, i) => ({ level: i + 1, max })).filter(s => s.max > 0);
};

export const getCantripsKnownCount = (className: string, charLevel: number): number => {
  const table = CANTRIPS_KNOWN[className];
  if (!table) return 0;
  let count = 0;
  for (const [lvl, cnt] of Object.entries(table)) {
    if (charLevel >= parseInt(lvl)) count = cnt;
  }
  return count;
};

export const getSpellsKnownCount = (className: string, charLevel: number): number => {
  const table = SPELLS_KNOWN[className];
  if (!table) return 0;
  let count = 0;
  for (const [lvl, cnt] of Object.entries(table)) {
    if (charLevel >= parseInt(lvl)) count = cnt;
  }
  return count;
};

export const getSneakAttackDice = (rogueLevel: number): string =>
  `${Math.ceil(rogueLevel / 2)}d6`;

export const VESPER_DATA: CharacterData = {
  id: "vesper-default",
  name: "Vesper",
  race: "Drow Elf",
  class: "Rogue",
  level: 1,
  campaign: "The Underdark Saga",
  portraitUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=800&auto=format&fit=crop",
  stats: {
    STR: { score: 8, modifier: -1, save: -1, proficientSave: false },
    DEX: { score: 18, modifier: 4, save: 6, proficientSave: true },
    CON: { score: 14, modifier: 2, save: 2, proficientSave: false },
    INT: { score: 12, modifier: 1, save: 3, proficientSave: true },
    WIS: { score: 10, modifier: 0, save: 0, proficientSave: false },
    CHA: { score: 15, modifier: 2, save: 2, proficientSave: false },
  },
  hp: { current: 10, max: 10 },
  hitDice: { current: 1, max: 1, die: "1d8" },
  ac: 15,
  initiative: 4,
  speed: 30,
  passivePerception: 14,
  skills: [
    { name: "Stealth", ability: "DEX", modifier: 8, proficiency: "expertise" },
    { name: "Perception", ability: "WIS", modifier: 4, proficiency: "expertise" },
  ],
  attacks: [
    { name: "Dagger", bonus: 6, damage: "1d4+4", type: "Piercing", range: "20/60" }
  ],
  features: [
    { name: "Sneak Attack", source: "Class", description: "Extra 1d6 damage once per turn.", fullText: "Beginning at 1st level..." }
  ],
  spells: [
    { name: "Dancing Lights", level: 0, school: "Evocation", castingTime: "1 action", range: "120 ft", components: "V, S, M", duration: "Concentration, up to 1 minute", description: "Create four torch-sized lights." }
  ],
  spellSlots: [
    { level: 1, current: 2, max: 2 },
    { level: 2, current: 0, max: 0 }
  ],
  inventory: { gold: 150.00, items: [], load: "Light" },
  journal: []
};