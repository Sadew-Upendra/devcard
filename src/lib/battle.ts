import type { CardStats, DevCard } from "./scoring/card";

export type StatKey = keyof CardStats;
export const STAT_KEYS: StatKey[] = ["COM", "PRS", "STR", "FOL", "REV", "STK"];

export const STAT_LABELS: Record<StatKey, string> = {
  COM: "Contributions",
  PRS: "Merged PRs",
  STR: "Stars",
  FOL: "Followers",
  REV: "Reviews & issues",
  STK: "Longest streak",
};

type Side = "a" | "b" | "draw";

export interface Round {
  key: StatKey;
  label: string;
  a: number;
  b: number;
  winner: Side;
}

export interface BattleResult {
  rounds: Round[];
  winsA: number;
  winsB: number;
  draws: number;
  winner: Side;
  decidedBy: "stats" | "overall" | "none";
}

const side = (x: number, y: number): Side => (x > y ? "a" : y > x ? "b" : "draw");

export function battle(a: DevCard, b: DevCard): BattleResult {
  const rounds: Round[] = STAT_KEYS.map((key) => ({
    key,
    label: STAT_LABELS[key],
    a: a.stats[key],
    b: b.stats[key],
    winner: side(a.stats[key], b.stats[key]),
  }));

  const winsA = rounds.filter((r) => r.winner === "a").length;
  const winsB = rounds.filter((r) => r.winner === "b").length;
  const draws = rounds.length - winsA - winsB;

  if (winsA !== winsB) {
    return { rounds, winsA, winsB, draws, winner: winsA > winsB ? "a" : "b", decidedBy: "stats" };
  }
  // Tied on stat wins: the unrounded overall score decides.
  const tie = side(a.score, b.score);
  return {
    rounds, winsA, winsB, draws,
    winner: tie,
    decidedBy: tie === "draw" ? "none" : "overall",
  };
}