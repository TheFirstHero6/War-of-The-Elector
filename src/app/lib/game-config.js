// Game Configuration - Imperium Fragmentum (2nd Edition)
// This file contains all game balance values and building production rates

// Building production rates by tier - Imperium Fragmentum (2nd Edition) rules
export const BUILDING_PRODUCTION_RATES = {
  // Common Buildings - Production rates by tier
  Sawmill: {
    1: { food: 0, wood: 3, stone: 0, metal: 0, livestock: 0, currency: 0 }, // T1: 3 Wood (matches CSV Tier 2)
    2: { food: 0, wood: 5, stone: 0, metal: 0, livestock: 0, currency: 0 }, // T2: 5 Wood (matches CSV Tier 3)
    3: { food: 0, wood: 7, stone: 0, metal: 0, livestock: 0, currency: 0 }, // T3: 7 Wood (matches CSV Tier 4)
    4: { food: 0, wood: 9, stone: 0, metal: 0, livestock: 0, currency: 0 }, // T4: 9 Wood (matches CSV Tier 5)
  },
  Quarry: {
    1: { food: 0, wood: 0, stone: 3, metal: 0, livestock: 0, currency: 0 }, // T1: 3 Stone (matches CSV Tier 2)
    2: { food: 0, wood: 0, stone: 5, metal: 0, livestock: 0, currency: 0 }, // T2: 5 Stone (matches CSV Tier 3)
    3: { food: 0, wood: 0, stone: 7, metal: 0, livestock: 0, currency: 0 }, // T3: 7 Stone (matches CSV Tier 4)
    4: { food: 0, wood: 0, stone: 9, metal: 0, livestock: 0, currency: 0 }, // T4: 9 Stone (matches CSV Tier 5)
  },
  Forge: {
    1: { food: 0, wood: 0, stone: 0, metal: 1, livestock: 0, currency: 0 }, // T1: 1 Metal
    2: { food: 0, wood: 0, stone: 0, metal: 2, livestock: 0, currency: 0 }, // T2: 2 Metal
    3: { food: 0, wood: 0, stone: 0, metal: 3, livestock: 0, currency: 0 }, // T3: 3 Metal
  },
  Farm: {
    1: { food: 2, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // T1: 2 Food
    2: { food: 4, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // T2: 4 Food
    3: { food: 6, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // T3: 6 Food
  },

  // Rare Buildings
  Market: {
    1: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 5 }, // T1: 5 Currency
    2: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 10 }, // T2: 10 Currency
    3: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 15 }, // T3: 15 Currency
  },

  // Additional buildings from Imperium Fragmentum ruleset
  Fields: {
    1: { food: 3, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // T1: 3 Crops (matches CSV Tier 2)
    2: { food: 5, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // T2: 5 Crops (matches CSV Tier 3)
    3: { food: 7, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // T3: 7 Crops (matches CSV Tier 4)
    4: { food: 9, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // T4: 9 Crops (matches CSV Tier 5)
  },
  Pastures: {
    1: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 3, currency: 0 }, // T1: 3 Livestock (matches CSV Tier 2)
    2: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 5, currency: 0 }, // T2: 5 Livestock (matches CSV Tier 3)
    3: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 7, currency: 0 }, // T3: 7 Livestock (matches CSV Tier 4)
    4: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 9, currency: 0 }, // T4: 9 Livestock (matches CSV Tier 5)
  },
  Mine: {
    1: { food: 0, wood: 0, stone: 0, metal: 3, livestock: 0, currency: 0 }, // T1: 3 Metal (matches CSV Tier 2)
    2: { food: 0, wood: 0, stone: 0, metal: 5, livestock: 0, currency: 0 }, // T2: 5 Metal (matches CSV Tier 3)
    3: { food: 0, wood: 0, stone: 0, metal: 7, livestock: 0, currency: 0 }, // T3: 7 Metal (matches CSV Tier 4)
    4: { food: 0, wood: 0, stone: 0, metal: 9, livestock: 0, currency: 0 }, // T4: 9 Metal (matches CSV Tier 5)
  },
  "Infantry Barracks": {
    1: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
    2: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
    3: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
    4: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
  },
  "Ranged Barracks": {
    1: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
    2: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
    3: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
    4: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
  },
  "Cavalry Barracks": {
    1: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
    2: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
    3: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
    4: { food: 0, wood: 0, stone: 0, metal: 0, livestock: 0, currency: 0 }, // Military - no production
  },
};

// City income based on upgrade tier (Local Trade gain) - Imperium Fragmentum rules
export const CITY_TIER_INCOME = {
  1: 10, // Level 1: 10
  2: 15, // Level 2: 15
  3: 40, // Level 3: 40
  4: 55, // Level 4: 55
  5: 70, // Level 5: 70
};

// City upgrade costs
export const CITY_UPGRADE_COSTS = {
  2: { currency: 100, wood: 20, stone: 20, metal: 0, food: 0, livestock: 0 },
  3: { currency: 300, wood: 40, stone: 40, metal: 0, food: 0, livestock: 0 },
  4: { currency: 900, wood: 90, stone: 90, metal: 0, food: 0, livestock: 0 },
  5: { currency: 2700, wood: 180, stone: 180, metal: 0, food: 0, livestock: 0 },
};

// Building limits - fixed for all cities
// All cities can have exactly 4 buildings, regardless of tier
export const MAX_BUILDINGS_PER_CITY = 4;

// Building costs (for reference)
export const BUILDING_COSTS = {
  Sawmill: {
    currency: 100,
    wood: 0,
    stone: 0,
    metal: 0,
    food: 0,
    livestock: 0,
  },
  Quarry: { currency: 100, wood: 0, stone: 0, metal: 0, food: 0, livestock: 0 },
  Forge: { currency: 150, wood: 50, stone: 0, metal: 0, food: 0, livestock: 0 },
  Farm: { currency: 80, wood: 20, stone: 0, metal: 0, food: 0, livestock: 0 },
  Market: {
    currency: 200,
    wood: 100,
    stone: 50,
    metal: 0,
    food: 0,
    livestock: 0,
  },
};

// Building upgrade costs - Imperium Fragmentum rules
export const BUILDING_UPGRADE_COSTS = {
  2: { currency: 50, wood: 20, stone: 10, metal: 0, food: 0, livestock: 0 }, // Level 2 upgrade
  3: { currency: 100, wood: 20, stone: 20, metal: 0, food: 0, livestock: 0 }, // Level 3 upgrade
  4: { currency: 100, wood: 20, stone: 20, metal: 0, food: 0, livestock: 0 }, // Level 4 upgrade
};

// Unit recruitment costs from official Unit Costs Table
export const UNIT_COSTS = {
  "Militia-At-Arms": { currency: 50, wood: 3, stone: 3, metal: 0, food: 0, livestock: 0 },
  "Pike Men": { currency: 100, wood: 8, stone: 2, metal: 0, food: 0, livestock: 0 },
  "Swordsmen": { currency: 150, wood: 3, stone: 0, metal: 6, food: 0, livestock: 0 },
  "Matchlocks": { currency: 100, wood: 4, stone: 0, metal: 4, food: 0, livestock: 0 },
  "Flintlocks": { currency: 150, wood: 4, stone: 2, metal: 6, food: 0, livestock: 0 },
  "Light Calvary": { currency: 150, wood: 3, stone: 0, metal: 6, food: 0, livestock: 4 },
  "Dragons": { currency: 150, wood: 4, stone: 2, metal: 6, food: 0, livestock: 4 },
  "Heavy Calvary": { currency: 300, wood: 3, stone: 0, metal: 10, food: 0, livestock: 4 },
  "Banner Guard": { currency: 500, wood: 3, stone: 0, metal: 12, food: 0, livestock: 4 },
  "Light Artilery": { currency: 150, wood: 10, stone: 5, metal: 5, food: 0, livestock: 0 },
  "Medium Artilery": { currency: 300, wood: 10, stone: 5, metal: 8, food: 0, livestock: 1 },
  "Heavy Artilery": { currency: 500, wood: 10, stone: 5, metal: 12, food: 0, livestock: 2 },
};

// Population Unit Cap provided per city tier from official table
// Sum caps across all cities owned by a player
export const POPULATION_UNIT_CAP_BY_TIER = {
  1: 2,
  2: 3,
  3: 7,
  4: 10,
  5: 15,
};

// Per-unit upkeep cost per turn
export const PER_UNIT_UPKEEP = { food: 2 };

// Unit upgrade cost (flat rate per upgrade)
export const UNIT_UPGRADE_COST = 20;