import type { RawGitHubUser } from "../github/types";
import { SCALE } from "./config";
import type { CardStats } from "./card";

export const scale = (value: number, k: number): number =>
  Math.max(0, Math.min(99, Math.round(k * Math.log10(value + 1))));

export function longestStreak(
  weeks: RawGitHubUser["contributionsCollection"]["contributionCalendar"]["weeks"]
): number {
  let best = 0;
  let current = 0;
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      if (day.contributionCount > 0) {
        current += 1;
        if (current > best) best = current;
      } else {
        current = 0;
      }
    }
  }
  return best;
}

export interface RawNumbers {
  contributions: number;
  mergedPRs: number;
  stars: number;
  followers: number;
  reviewsAndIssues: number;
  streak: number;
}

export function extractRaw(u: RawGitHubUser): RawNumbers {
  const c = u.contributionsCollection;
  return {
    contributions: c.contributionCalendar.totalContributions,
    mergedPRs: u.pullRequests.totalCount,
    // Top 100 repos by stars. This covers almost all stars in practice.
    stars: u.repositories.nodes.reduce((sum, r) => sum + r.stargazerCount, 0),
    followers: u.followers.totalCount,
    reviewsAndIssues:
      c.totalPullRequestReviewContributions + c.totalIssueContributions,
    streak: longestStreak(c.contributionCalendar.weeks),
  };
}

export function computeStats(raw: RawNumbers): CardStats {
  return {
    COM: scale(raw.contributions, SCALE.COM),
    PRS: scale(raw.mergedPRs, SCALE.PRS),
    STR: scale(raw.stars, SCALE.STR),
    FOL: scale(raw.followers, SCALE.FOL),
    REV: scale(raw.reviewsAndIssues, SCALE.REV),
    STK: scale(raw.streak, SCALE.STK),
  };
}