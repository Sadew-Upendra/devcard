import { NextResponse } from "next/server";
import { cached } from "./cache";
import { fetchGitHubUser } from "./github/client";
import { GitHubError, GitHubErrorCode } from "./github/types";
import { buildCard } from "./scoring/card";
import { getStoredCard, savePlayer } from "./players";
import { isBlocked } from "./blocklist";
import { enforceLimit } from "./ratelimit";

const DAY = 24 * 60 * 60 * 1000;

const STATUS: Record<GitHubErrorCode, number> = {
  INVALID: 400,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  UNAUTHORIZED: 500,
  UPSTREAM: 502,
};

export function getCard(username: string) {
  const key = username.toLowerCase();
  return cached(`card:${key}`, DAY, async () => {
    if (isBlocked(key)) {
      throw new GitHubError(
        "NOT_FOUND",
        "This player has asked not to be listed on DevCard."
      );
    }
    const stored = await getStoredCard(key);
    if (stored) return stored; // free: no GitHub call, no rate-limit hit

    await enforceLimit(); // only fresh GitHub lookups are limited
    const card = buildCard(await fetchGitHubUser(username));
    await savePlayer(card);
    return card;
  });
}

export function toErrorResponse(err: unknown) {
  if (err instanceof GitHubError) {
    return NextResponse.json(
      { error: err.code, message: err.message },
      { status: STATUS[err.code] }
    );
  }
  return NextResponse.json(
    { error: "UPSTREAM", message: "Server error." },
    { status: 500 }
  );
}