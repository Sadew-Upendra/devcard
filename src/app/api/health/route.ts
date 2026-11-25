import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getTokens } from "@/lib/github/tokens";

export const dynamic = "force-dynamic";

export async function GET() {
  let db: "ok" | "down" | "off" = "off";
  const pool = getPool();
  if (pool) {
    try {
      await pool.query("select 1");
      db = "ok";
    } catch {
      db = "down";
    }
  }
  const githubTokens = getTokens().length;
  const rateLimit = Boolean(
    (process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL) &&
      (process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN)
  );
  const ok = db !== "down" && githubTokens > 0;
  return NextResponse.json({ ok, db, githubTokens, rateLimit }, { status: ok ? 200 : 503 });
}