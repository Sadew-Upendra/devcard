import { LOGIN_RE } from "../username";
import { USER_QUERY } from "./queries";
import { getTokens, markLimited, pickToken } from "./tokens";
import { GitHubError, RawGitHubUser } from "./types";

const ENDPOINT = "https://api.github.com/graphql";
const FALLBACK_COOLDOWN_MS = 10 * 60 * 1000;

function cooldownUntil(res: Response, resetAtIso?: string): number {
  const retryAfter = Number(res.headers.get("retry-after"));
  if (retryAfter > 0) return Date.now() + retryAfter * 1000;
  const reset = Number(res.headers.get("x-ratelimit-reset")); // epoch seconds
  if (reset > 0) return reset * 1000;
  const iso = resetAtIso ? Date.parse(resetAtIso) : NaN;
  return Number.isNaN(iso) ? Date.now() + FALLBACK_COOLDOWN_MS : iso;
}

async function request(login: string, token: string): Promise<RawGitHubUser> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: USER_QUERY, variables: { login } }),
    cache: "no-store",
  });

  if (res.status === 401) {
    markLimited(token, Date.now() + 60 * 60 * 1000); // bad token: skip for an hour
    throw new GitHubError("UNAUTHORIZED", "A GitHub token was rejected.");
  }
  if (res.status === 403 || res.status === 429) {
    markLimited(token, cooldownUntil(res));
    throw new GitHubError("RATE_LIMITED", "GitHub rate limit reached. Try again soon.");
  }
  if (!res.ok) throw new GitHubError("UPSTREAM", `GitHub returned ${res.status}.`);

  const json = await res.json();
  const errors: { type?: string; message?: string }[] = json.errors ?? [];

  if (errors.some((e) => e.type === "NOT_FOUND")) {
    throw new GitHubError("NOT_FOUND", `User "${login}" was not found.`);
  }
  if (errors.some((e) => e.type === "RATE_LIMITED")) {
    markLimited(token, cooldownUntil(res, json.data?.rateLimit?.resetAt));
    throw new GitHubError("RATE_LIMITED", "GitHub rate limit reached. Try again soon.");
  }
  if (!json.data?.user) {
    throw new GitHubError("UPSTREAM", errors[0]?.message ?? "Unexpected GitHub response.");
  }

  // Rest this token early when it is almost empty.
  const rl = json.data.rateLimit as { remaining: number; resetAt: string } | undefined;
  if (rl && rl.remaining < 25) {
    markLimited(token, cooldownUntil(res, rl.resetAt));
  }
  return json.data.user as RawGitHubUser;
}

export async function fetchGitHubUser(login: string): Promise<RawGitHubUser> {
  if (!LOGIN_RE.test(login)) {
    throw new GitHubError("INVALID", "That is not a valid GitHub username.");
  }
  const total = getTokens().length;
  if (total === 0) {
    throw new GitHubError("UNAUTHORIZED", "No GitHub token is configured.");
  }

  let last: GitHubError | null = null;
  for (let i = 0; i < total; i++) {
    const token = pickToken();
    if (!token) break;
    try {
      return await request(login, token);
    } catch (e) {
      if (e instanceof GitHubError && (e.code === "RATE_LIMITED" || e.code === "UNAUTHORIZED")) {
        last = e; // try the next token
        continue;
      }
      throw e;
    }
  }
  throw last ?? new GitHubError("RATE_LIMITED", "GitHub rate limit reached. Try again soon.");
}