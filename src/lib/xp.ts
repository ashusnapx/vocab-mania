export interface Level {
  name: string;
  hindiName: string;
  minXP: number;
  maxXP: number;
  color: string;
}

export const LEVELS: Level[] = [
  {
    name: "Prarambhik",
    hindiName: "प्रारंभिक",
    minXP: 0,
    maxXP: 99,
    color: "#78716c",
  },
  {
    name: "Saksham",
    hindiName: "सक्षम",
    minXP: 100,
    maxXP: 299,
    color: "#2563eb",
  },
  {
    name: "Praveen",
    hindiName: "प्रवीण",
    minXP: 300,
    maxXP: 599,
    color: "#059669",
  },
  {
    name: "Daksh",
    hindiName: "दक्ष",
    minXP: 600,
    maxXP: 999,
    color: "#d97706",
  },
  {
    name: "Mastry",
    hindiName: "मास्टरी",
    minXP: 1000,
    maxXP: Infinity,
    color: "#dc2626",
  },
];

export function getLevel(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(xp: number): {
  current: Level;
  next: Level | null;
  progress: number;
  xpInLevel: number;
  xpNeeded: number;
} {
  const current = getLevel(xp);
  const currentIndex = LEVELS.findIndex((l) => l.name === current.name);
  const next = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

  const xpInLevel = xp - current.minXP;
  const xpRange = next ? next.minXP - current.minXP : current.maxXP - current.minXP + 1;
  const progress = next ? Math.min((xpInLevel / xpRange) * 100, 100) : 100;
  const xpNeeded = next ? next.minXP - xp : 0;

  return { current, next, progress, xpInLevel, xpNeeded };
}

export function calculateQuizXP(score: number, total: number): number {
  if (total === 0) return 0;
  const pct = score / total;
  if (pct === 1) return 50;
  if (pct >= 0.8) return 35;
  if (pct >= 0.6) return 20;
  if (pct >= 0.4) return 10;
  return 5;
}
