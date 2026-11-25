import type { RawGitHubUser } from "../github/types";
import { POSITIONS, TIERS, WEIGHTS } from "./config";
import { computeStats, extractRaw, RawNumbers } from "./stats";

export interface CardStats {
  COM: number;
  PRS: number;
  STR: number;
  FOL: number;
  REV: number;
  STK: number;
}

export interface DevCard {
  login: string;
  name: string;
  avatarUrl: string;
  location: string | null;
  overall: number;
  score: number;
  tier: string;
  position: string;
  topLanguage: string | null;
  stats: CardStats;
  raw: RawNumbers;
  generatedAt: string;
}

function pickTier(overall: number): string {
  return TIERS.find((t) => overall >= t.min)?.name ?? "Bronze";
}

function pickPosition(stats: CardStats): string {
  const keys = Object.keys(stats) as (keyof CardStats)[];
  const best = keys.reduce((a, b) => (stats[b] > stats[a] ? b : a));
  return POSITIONS[best];
}

function topLanguage(u: RawGitHubUser): string | null {
  const weight = new Map<string, number>();
  for (const r of u.repositories.nodes) {
    const lang = r.primaryLanguage?.name;
    if (!lang) continue;
    weight.set(lang, (weight.get(lang) ?? 0) + r.stargazerCount + 1);
  }
  let best: string | null = null;
  let max = 0;
  for (const [lang, w] of weight) {
    if (w > max) {
      best = lang;
      max = w;
    }
  }
  return best;
}

export function buildCard(u: RawGitHubUser): DevCard {
  const raw = extractRaw(u);
  const stats = computeStats(raw);
  const keys = Object.keys(WEIGHTS) as (keyof CardStats)[];
  const weighted = keys.reduce((sum, k) => sum + stats[k] * WEIGHTS[k], 0);
  const score = Math.round(weighted * 100) / 100;
  const overall = Math.min(99, Math.round(score));

  return {
    login: u.login,
    name: u.name ?? u.login,
    avatarUrl: u.avatarUrl,
    location: u.location,
    overall,
    score,
    tier: pickTier(overall),
    position: pickPosition(stats),
    topLanguage: topLanguage(u),
    stats,
    raw,
    generatedAt: new Date().toISOString(),
  };
}