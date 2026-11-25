export interface RawGitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  location: string | null;
  createdAt: string;
  followers: { totalCount: number };
  pullRequests: { totalCount: number };
  repositories: {
    nodes: { stargazerCount: number; primaryLanguage: { name: string } | null }[];
  };
  contributionsCollection: {
    totalCommitContributions: number;
    totalIssueContributions: number;
    totalPullRequestContributions: number;
    totalPullRequestReviewContributions: number;
    contributionCalendar: {
      totalContributions: number;
      weeks: { contributionDays: { contributionCount: number; date: string }[] }[];
    };
  };
}

export type GitHubErrorCode =
  | "INVALID"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "UNAUTHORIZED"
  | "UPSTREAM";

export class GitHubError extends Error {
  constructor(public code: GitHubErrorCode, message: string) {
    super(message);
    this.name = "GitHubError";
  }
}