// Unit data structures and utilities based on CSV files

// Hit target matrix: [attackerTier][defenderTier] = hit target (x+)
// From Tiers_of_all_units.csv
export const HIT_TARGET_MATRIX: Record<number, Record<number, string>> = {
  1: { 1: "9+", 2: "12+", 3: "15+", 4: "18+", 5: "20+" },
  2: { 1: "7+", 2: "9+", 3: "12+", 4: "15+", 5: "18+" },
  3: { 1: "5+", 2: "7+", 3: "9+", 4: "12+", 5: "15+" },
  4: { 1: "3+", 2: "5+", 3: "7+", 4: "9+", 5: "12+" },
  5: { 1: "2+", 2: "3+", 3: "5+", 4: "7+", 5: "9+" },
};

// Unit health and special abilities
// From Unit_Special_abilities.csv
export const UNIT_STATS: Record<string, { health: number; specialAbilities: string }> = {
  Militia: { health: 16, specialAbilities: "-" },
  Pikemen: { health: 16, specialAbilities: "2+ to hit mounted units" },
  Swordsmen: { health: 16, specialAbilities: "3+ to hit infantry units" },
  Matchlocks: { health: 8, specialAbilities: "2+ to hit shooting" },
  Flintlocks: { health: 8, specialAbilities: "2+ to hit (m) infantry units" },
  Dragoons: { health: 5, specialAbilities: "Dismount and Shoot" },
  "Light Cav": { health: 7, specialAbilities: "Can run and charge" },
  "Heavy Cav": { health: 9, specialAbilities: "+3 charge bonus" },
  "Banner Guard": { health: 12, specialAbilities: "Free Reaction" },
  Artillery: { health: 5, specialAbilities: "Hit Unit = - 3 Morale Check" },
};

// Artillery special abilities
// From Artillery_special_abilities.csv
export const ARTILLERY_SPECIAL_ABILITIES: Record<string, string> = {
  "Light Arty": "+6\" move",
  Medium: "Additional Shot per fire",
  Heavy: "Can fire in a arc",
};

// Charge/flanking bonuses
// From charge_special_abilities.csv
export const CHARGE_BONUSES = {
  "Side Charge": "+2 to # of attack",
  "Back Charge": "+3 to # of attack",
  Cav: "+4 to hit if they charged",
};

// Unit ranges
// From range.csv
export const UNIT_RANGES: Record<string, string> = {
  "Matchlock, Dragoons, and Flintlocks": "18\"",
  "Light Arty": "24\"",
  "Medium Arty": "36\"",
  "Heavy Arty": "48\"",
};

// Unit type mappings (game uses different names than CSV)
const UNIT_TYPE_MAP: Record<string, string> = {
  "Militia-At-Arms": "Militia",
  "Pike Men": "Pikemen",
  Swordsmen: "Swordsmen",
  Matchlocks: "Matchlocks",
  Flintlocks: "Flintlocks",
  Dragoons: "Dragoons",
  Dragons: "Dragoons", // Game config uses "Dragons" but CSV uses "Dragoons"
  "Light Calvary": "Light Cav",
  "Heavy Calvary": "Heavy Cav",
  "Banner Guard": "Banner Guard",
  "Light Artilery": "Light Arty",
  "Medium Artilery": "Medium",
  "Heavy Artilery": "Heavy",
};

// Movement speeds
export const UNIT_MOVEMENT: Record<string, number> = {
  "Militia-At-Arms": 6,
  "Pike Men": 6,
  Swordsmen: 6,
  Matchlocks: 6,
  Flintlocks: 6,
  Dragoons: 12, // Cavalry
  Dragons: 12, // Cavalry (game config name)
  "Light Calvary": 12, // Cavalry
  "Heavy Calvary": 12, // Cavalry
  "Banner Guard": 12, // Cavalry
  "Light Artilery": 12, // 6 base + 6 bonus
  "Medium Artilery": 6,
  "Heavy Artilery": 6,
};

// Utility functions
export function getHitTarget(attackerTier: number, defenderTier: number): string {
  return HIT_TARGET_MATRIX[attackerTier]?.[defenderTier] || "20+";
}

export function getUnitHealth(unitType: string): number {
  const mappedType = UNIT_TYPE_MAP[unitType] || unitType;
  return UNIT_STATS[mappedType]?.health || 0;
}

export function getUnitSpecialAbilities(unitType: string): string {
  const mappedType = UNIT_TYPE_MAP[unitType] || unitType;
  const baseAbility = UNIT_STATS[mappedType]?.specialAbilities || "-";
  
  // Add artillery-specific abilities
  if (unitType === "Light Artilery" || unitType === "Medium Artilery" || unitType === "Heavy Artilery") {
    const artyType = unitType === "Light Artilery" ? "Light Arty" : 
                     unitType === "Medium Artilery" ? "Medium" : "Heavy";
    const artyAbility = ARTILLERY_SPECIAL_ABILITIES[artyType] || "";
    return baseAbility + (artyAbility ? `; ${artyAbility}` : "");
  }
  
  return baseAbility;
}

export function getUnitRange(unitType: string): string | null {
  if (unitType === "Matchlocks" || unitType === "Flintlocks" || unitType === "Dragoons" || unitType === "Dragons") {
    return UNIT_RANGES["Matchlock, Dragoons, and Flintlocks"];
  }
  if (unitType === "Light Artilery") {
    return UNIT_RANGES["Light Arty"];
  }
  if (unitType === "Medium Artilery") {
    return UNIT_RANGES["Medium Arty"];
  }
  if (unitType === "Heavy Artilery") {
    return UNIT_RANGES["Heavy Arty"];
  }
  return null;
}

export function getUnitMovement(unitType: string): number {
  return UNIT_MOVEMENT[unitType] || 6;
}

export interface UnitStats {
  unitType: string;
  tier: number;
  hitTargets: Record<number, string>;
  health: number;
  specialAbilities: string;
  range: string | null;
  movement: number;
  attacks: number;
}

export function getUnitStats(unitType: string, tier: number): UnitStats {
  const hitTargets: Record<number, string> = {};
  for (let defTier = 1; defTier <= 5; defTier++) {
    hitTargets[defTier] = getHitTarget(tier, defTier);
  }
  
  return {
    unitType,
    tier,
    hitTargets,
    health: getUnitHealth(unitType),
    specialAbilities: getUnitSpecialAbilities(unitType),
    range: getUnitRange(unitType),
    movement: getUnitMovement(unitType),
    attacks: 2, // Base 2 attacks
  };
}

