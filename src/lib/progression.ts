/**
 * PROGRESSION CONSTANTS
 */
export const BASE_LEVEL = 1;
export const LEVEL_SCALING_FACTOR = 20;
export const LEVEL_EXPONENT = 2;

export interface Tier {
  name: string;
  hindiName: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  badgeEmoji: string;
}

export const TIERS: Tier[] = [
  { name: "Prarambhik", hindiName: "प्रारंभिक", minLevel: 1, maxLevel: 5, color: "#78716c", badgeEmoji: "🐣" },
  { name: "Saksham", hindiName: "सक्षम", minLevel: 6, maxLevel: 15, color: "#2563eb", badgeEmoji: "⚔️" },
  { name: "Praveen", hindiName: "प्रवीण", minLevel: 16, maxLevel: 30, color: "#059669", badgeEmoji: "🎓" },
  { name: "Daksh", hindiName: "दक्ष", minLevel: 31, maxLevel: 50, color: "#d97706", badgeEmoji: "👑" },
  { name: "Acharya", hindiName: "आचार्य", minLevel: 51, maxLevel: 75, color: "#9333ea", badgeEmoji: "🌟" },
  { name: "Maharathi", hindiName: "महारथी", minLevel: 76, maxLevel: Infinity, color: "#dc2626", badgeEmoji: "🐉" },
];

/**
 * Normalizes XP input defensively against NaN, negative, or undefined values.
 */
function sanitizeXP(xp: number | null | undefined): number {
  if (xp === null || xp === undefined || Number.isNaN(xp)) return 0;
  return Math.min(Math.max(0, Math.floor(xp)), Number.MAX_SAFE_INTEGER);
}

/**
 * Calculates the exact XP required to reach a specific level.
 * XP(Level) = LEVEL_SCALING_FACTOR * (Level - 1) ^ LEVEL_EXPONENT
 */
export function getCurrentLevelXP(level: number): number {
  const lvl = Math.max(BASE_LEVEL, Math.floor(level));
  return LEVEL_SCALING_FACTOR * Math.pow(lvl - 1, LEVEL_EXPONENT);
}

/**
 * Calculates the exact XP required to reach the next level.
 */
export function getNextLevelXP(level: number): number {
  const lvl = Math.max(BASE_LEVEL, Math.floor(level));
  return LEVEL_SCALING_FACTOR * Math.pow(lvl, LEVEL_EXPONENT);
}

/**
 * Calculates the Level number from total XP.
 * Level = floor( sqrt( XP / LEVEL_SCALING_FACTOR ) ) + BASE_LEVEL
 */
export function getLevel(xp: number): number {
  const sanitizedXp = sanitizeXP(xp);
  return Math.floor(Math.sqrt(sanitizedXp / LEVEL_SCALING_FACTOR)) + BASE_LEVEL;
}

/**
 * Calculates the user's progress within their current level.
 */
export function getProgress(xp: number) {
  const sanitizedXp = sanitizeXP(xp);
  const currentLevel = getLevel(sanitizedXp);
  const currentLevelMinXP = getCurrentLevelXP(currentLevel);
  const nextLevelMinXP = getNextLevelXP(currentLevel);

  const gained = sanitizedXp - currentLevelMinXP;
  const range = nextLevelMinXP - currentLevelMinXP;
  const percentage = range > 0 ? Math.min((gained / range) * 100, 100) : 100;
  const remaining = Math.max(0, nextLevelMinXP - sanitizedXp);

  return {
    currentLevel,
    currentLevelMinXP,
    nextLevelMinXP,
    gained,
    range,
    percentage,
    remaining,
  };
}

/**
 * Returns the remaining XP to reach the next level.
 */
export function getRemainingXP(xp: number): number {
  const sanitizedXp = sanitizeXP(xp);
  const currentLevel = getLevel(sanitizedXp);
  const nextLevelMinXP = getNextLevelXP(currentLevel);
  return Math.max(0, nextLevelMinXP - sanitizedXp);
}

/**
 * Returns the Tier configuration matching the given numeric level.
 */
export function getTier(level: number): Tier {
  const lvl = Math.max(BASE_LEVEL, Math.floor(level));
  const tier = TIERS.find((t) => lvl >= t.minLevel && lvl <= t.maxLevel);
  return tier ?? TIERS[0];
}

/**
 * Calculates the quiz completion XP reward based on score accuracy.
 */
export function calculateReward(score: number, total: number): number {
  if (total <= 0 || score < 0) return 5; // Default safety reward
  const actualScore = Math.min(score, total);
  const pct = actualScore / total;

  if (pct === 1) return 50;
  if (pct >= 0.9) return 40;
  if (pct >= 0.8) return 30;
  if (pct >= 0.6) return 20;
  if (pct >= 0.4) return 10;
  return 5;
}
