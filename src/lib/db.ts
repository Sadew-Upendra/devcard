import { Pool } from "pg";

const g = globalThis as unknown as { __devcardPool?: Pool };

/** Returns null when DATABASE_URL is not set, so the app still runs without a DB. */
export function getPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  if (!g.__devcardPool) {
    const pool = new Pool({
      connectionString: url,
      max: process.env.VERCEL ? 3 : 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000, // allows for Neon waking up
    });
    pool.on("error", (err) => console.error("pg pool error:", err.message));
    g.__devcardPool = pool;
  }
  return g.__devcardPool;
}