export type ResourceType = "wood" | "stone" | "food" | "currency" | "metal" | "livestock";

export const RESOURCE_CONFIG: Record<ResourceType, { emoji: string; name: string }> = {
  wood: { emoji: "🌲", name: "Wood" },
  stone: { emoji: "🗿", name: "Stone" },
  food: { emoji: "🍞", name: "Food" },
  currency: { emoji: "💰", name: "Currency" },
  metal: { emoji: "⚒️", name: "Metal" },
  livestock: { emoji: "🐄", name: "Livestock" },
};

export function isValidResourceType(value: string): value is ResourceType {
  return Object.keys(RESOURCE_CONFIG).includes(value);
}

export function getResourceDisplayName(resource: ResourceType): string {
  return RESOURCE_CONFIG[resource].name;
}

export function getResourceEmoji(resource: ResourceType): string {
  return RESOURCE_CONFIG[resource].emoji;
}

