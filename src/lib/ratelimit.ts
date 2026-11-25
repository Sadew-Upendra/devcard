import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { GitHubError } from "./github/types";

let limiters: Ratelimit[] | null | undefined;

function getLimiters(): Ratelimit[] | null {
  if (limiters !== undefined) return limiters;
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    limiters = null;
    return null;
  }
  const redis = new Redis({ url, token });
  limiters = [
    new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "devcard:m" }),
    new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, "1 h"), prefix: "devcard:h" }),
  ];
  return limiters;
}

export async function enforceLimit(): Promise<void> {
  const ls = getLimiters();
  if (!ls) return;

  let ip = "anonymous";
  try {
    const h = await headers();
    ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "anonymous").trim();
  } catch {
    return; // no request context (scripts), nothing to limit
  }

  try {
    for (const l of ls) {
      const r = await l.limit(ip);
      if (!r.success) {
        throw new GitHubError("RATE_LIMITED", "You are searching too fast. Try again in a minute.");
      }
    }
  } catch (err) {
    if (err instanceof GitHubError) throw err;
    console.error("rate limit check failed", err); // fail open
  }
}