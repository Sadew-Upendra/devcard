/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { COUNTRY_NAMES } from "@/lib/location/country";
import { getFilters, getLeaderboard } from "@/lib/players";
import { THEMES } from "@/lib/scoring/theme";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leaderboard · DevCard" };

const avatar = (u: string) => u + (u.includes("?") ? "&" : "?") + "s=80";

function href(p: { country?: string | null; lang?: string | null }) {
  const q = new URLSearchParams();
  if (p.country) q.set("country", p.country);
  if (p.lang) q.set("lang", p.lang);
  const s = q.toString();
  return `/leaderboard${s ? `?${s}` : ""}`;
}

export default async function Leaderboard({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; lang?: string }>;
}) {
  const sp = await searchParams;
  const country = sp.country ? sp.country.toLowerCase().slice(0, 2) : null;
  const lang = sp.lang ? sp.lang.slice(0, 40) : null;

  const [rows, filters] = await Promise.all([
    getLeaderboard({ country, language: lang, limit: 50 }),
    getFilters(),
  ]);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition ${
      active
        ? "border-amber-300/70 bg-amber-300/15 text-amber-200"
        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
    }`;

  return (
    <div className="w-full max-w-2xl pt-4">
      <h1 className="text-3xl font-extrabold">Leaderboard</h1>
      <p className="mt-1 text-sm text-slate-400">
        Top players among everyone searched on DevCard.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={href({})} className={chip(!country && !lang)}>
          All
        </Link>
        {filters.countries.map((c) => (
          <Link
            key={c.code}
            href={href({ country: country === c.code ? null : c.code, lang })}
            className={chip(country === c.code)}
          >
            {COUNTRY_NAMES[c.code] ?? c.code.toUpperCase()}
          </Link>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {filters.languages.map((l) => (
          <Link
            key={l.name}
            href={href({ country, lang: lang === l.name ? null : l.name })}
            className={chip(lang === l.name)}
          >
            {l.name}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 text-center text-slate-400">
          No players here yet. Search a username on the home page to add one.
        </p>
      ) : (
        <ol className="mt-6 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {rows.map((r, i) => {
            const t = THEMES[r.tier] ?? THEMES.Bronze;
            return (
              <li key={r.login}>
                <Link
                  href={`/u/${r.login}`}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/5"
                >
                  <span className="w-8 text-right text-sm font-bold text-slate-400">
                    {i + 1}
                  </span>
                  <img
                    src={avatar(r.avatarUrl)}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{r.name}</span>
                    <span className="block truncate text-xs text-slate-400">
                      @{r.login}
                      {r.language ? ` · ${r.language}` : ""}
                    </span>
                  </span>
                  {r.country ? (
                    <img
                      src={`https://flagcdn.com/w40/${r.country}.png`}
                      alt={r.country}
                      className="h-4 w-6 rounded-sm"
                    />
                  ) : null}
                  <span
                    className="rounded-md px-2 py-0.5 text-xs font-bold"
                    style={{ background: t.stops[1], color: t.text }}
                  >
                    {r.overall}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}