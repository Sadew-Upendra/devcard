export interface RankInfo {
  rank: number;
  total: number;
}

export interface Ranks {
  global: RankInfo;
  country: (RankInfo & { code: string }) | null;
  language: (RankInfo & { name: string }) | null;
}

/** "Top X%" only once the table is big enough to mean something. */
export function topPercent(rank: number, total: number): number | null {
  if (total < 100) return null;
  return Math.max(1, Math.ceil((rank / total) * 100));
}