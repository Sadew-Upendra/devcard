import type { CardStats } from "./card";

// stat = min(99, round(k * log10(value + 1)))
// k is the multiplier per stat. Tune after testing on real profiles.
export const SCALE: Record<keyof CardStats, number> = {
  COM: 26, // 1000 contributions -> 78
  PRS: 30, // 100 merged PRs -> 60
  STR: 20, // 1000 stars -> 60
  FOL: 20, // 1000 followers -> 60
  REV: 30, // 100 reviews+issues -> 60
  STK: 38, // 100-day streak -> 76
};

export const WEIGHTS: Record<keyof CardStats, number> = {
  COM: 0.2,
  PRS: 0.2,
  STR: 0.2,
  FOL: 0.15,
  REV: 0.1,
  STK: 0.15,
};

// Phase 1 tiers use the overall rating. Phase 4 can switch to percentiles.
export const TIERS = [
  { name: "Icon", min: 88 },
  { name: "Rare", min: 75 },
  { name: "Gold", min: 60 },
  { name: "Silver", min: 40 },
  { name: "Bronze", min: 0 },
] as const;

export const POSITIONS: Record<keyof CardStats, string> = {
  COM: "The Grinder",
  PRS: "The Striker",
  STR: "The Star Maker",
  FOL: "The Influencer",
  REV: "The Gatekeeper",
  STK: "The Iron Man",
};