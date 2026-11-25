import { getPool } from "./db";
import { countryFromLocation } from "./location/country";
import type { DevCard } from "./scoring/card";
import type { Pool } from "pg";
import type { RankInfo, Ranks } from "./rank-utils";

function isMissingTable(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "42P01";
}

/** A stored card younger than 24h, or null. */
export async function getStoredCard(login: string): Promise<DevCard | null> {
  const pool = getPool();
  if (!pool) return null;
  try {
    const { rows } = await pool.query(
      `SELECT card FROM players
       WHERE login = $1 AND updated_at > now() - interval '24 hours'`,
      [login.toLowerCase()]
    );
    return (rows[0]?.card as DevCard) ?? null;
  } catch (err) {
    if (isMissingTable(err)) return null;
    console.error("getStoredCard failed", err);
    return null;
  }
}

export async function savePlayer(card: DevCard): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO players
         (login, display_login, country, top_language, score, overall, tier, card)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
       ON CONFLICT (login) DO UPDATE SET
         display_login = EXCLUDED.display_login,
         country       = EXCLUDED.country,
         top_language  = EXCLUDED.top_language,
         score         = EXCLUDED.score,
         overall       = EXCLUDED.overall,
         tier          = EXCLUDED.tier,
         card          = EXCLUDED.card,
         updated_at    = now()`,
      [
        card.login.toLowerCase(),
        card.login,
        countryFromLocation(card.location),
        card.topLanguage,
        card.score,
        card.overall,
        card.tier,
        JSON.stringify(card),
      ]
    );
  } catch (err) {
    if (isMissingTable(err)) return;
    console.error("savePlayer failed", err);
  }
}

async function rankIn(
  pool: Pool,
  where: string,
  params: unknown[],
  score: number
): Promise<RankInfo> {
  const { rows } = await pool.query(
    `SELECT (count(*) FILTER (WHERE score > $1))::int + 1 AS rank,
            count(*)::int AS total
     FROM players ${where}`,
    [score, ...params]
  );
  const { rank, total } = rows[0] as RankInfo;
  return { rank, total: Math.max(total, rank) };
}

export async function getRanks(card: DevCard): Promise<Ranks | null> {
  const pool = getPool();
  if (!pool) return null;
  try {
    const code = countryFromLocation(card.location);
    const lang = card.topLanguage;
    const [global, country, language] = await Promise.all([
      rankIn(pool, "", [], card.score),
      code ? rankIn(pool, "WHERE country = $2", [code], card.score) : null,
      lang ? rankIn(pool, "WHERE top_language = $2", [lang], card.score) : null,
    ]);
    return {
      global,
      country: country && code ? { ...country, code } : null,
      language: language && lang ? { ...language, name: lang } : null,
    };
  } catch (err) {
    if (isMissingTable(err)) return null;
    console.error("getRanks failed", err);
    return null;
  }
}

export interface LeaderRow {
  login: string;
  name: string;
  avatarUrl: string;
  country: string | null;
  language: string | null;
  overall: number;
  tier: string;
}

export async function getLeaderboard(opts: {
  country: string | null;
  language: string | null;
  limit: number;
}): Promise<LeaderRow[]> {
  const pool = getPool();
  if (!pool) return [];
  try {
    const { rows } = await pool.query(
      `SELECT display_login AS login,
              card->>'name' AS name,
              card->>'avatarUrl' AS "avatarUrl",
              country, top_language AS language, overall, tier
       FROM players
       WHERE ($1::text IS NULL OR country = $1)
         AND ($2::text IS NULL OR top_language = $2)
       ORDER BY score DESC, login ASC
       LIMIT $3`,
      [opts.country, opts.language, opts.limit]
    );
    return rows as LeaderRow[];
  } catch (err) {
    if (isMissingTable(err)) return [];
    console.error("getLeaderboard failed", err);
    return [];
  }
}

export async function getFilters(): Promise<{
  countries: { code: string; n: number }[];
  languages: { name: string; n: number }[];
}> {
  const pool = getPool();
  if (!pool) return { countries: [], languages: [] };
  try {
    const [c, l] = await Promise.all([
      pool.query(
        `SELECT country AS code, count(*)::int AS n FROM players
         WHERE country IS NOT NULL GROUP BY country ORDER BY n DESC LIMIT 12`
      ),
      pool.query(
        `SELECT top_language AS name, count(*)::int AS n FROM players
         WHERE top_language IS NOT NULL GROUP BY top_language ORDER BY n DESC LIMIT 12`
      ),
    ]);
    return {
      countries: c.rows as { code: string; n: number }[],
      languages: l.rows as { name: string; n: number }[],
    };
  } catch (err) {
    if (isMissingTable(err)) return { countries: [], languages: [] };
    console.error("getFilters failed", err);
    return { countries: [], languages: [] };
  }
}

export async function getTopLogins(limit: number): Promise<string[]> {
  const pool = getPool();
  if (!pool) return [];
  try {
    const { rows } = await pool.query(
      `SELECT display_login FROM players ORDER BY score DESC LIMIT $1`,
      [limit]
    );
    return rows.map((r) => r.display_login as string);
  } catch (err) {
    if (isMissingTable(err)) return [];
    console.error("getTopLogins failed", err);
    return [];
  }
}