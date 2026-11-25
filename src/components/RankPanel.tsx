import Link from "next/link";
import { COUNTRY_NAMES } from "@/lib/location/country";
import { topPercent, type Ranks } from "@/lib/rank-utils";

const n = (v: number) => v.toLocaleString("en-US");

function Tile({
  label,
  rank,
  total,
  extra,
  note,
  href,
}: {
  label: string;
  rank?: number;
  total?: number;
  extra?: string | null;
  note: string;
  href?: string;
}) {
  const body = (
    <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-4 text-center transition hover:bg-white/10">
      <div className={`text-2xl font-extrabold ${rank ? "" : "text-slate-500"}`}>
        {rank ? `#${n(rank)}` : "—"}
      </div>
      <div className="mt-1 truncate text-xs uppercase tracking-widest text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-[11px] text-slate-500">
        {rank && total ? `of ${n(total)}${extra ? ` · ${extra}` : ""}` : note}
      </div>
    </div>
  );
  return href && rank ? <Link href={href}>{body}</Link> : body;
}

export function RankPanel({ ranks }: { ranks: Ranks | null }) {
  const g = ranks?.global;
  const c = ranks?.country;
  const l = ranks?.language;
  const pct = g ? topPercent(g.rank, g.total) : null;

  return (
    <div className="grid grid-cols-3 gap-2">
      <Tile
        label="Global"
        rank={g?.rank}
        total={g?.total}
        extra={pct ? `top ${pct}%` : null}
        note="Not ranked yet"
        href="/leaderboard"
      />
      <Tile
        label={c ? COUNTRY_NAMES[c.code] ?? c.code.toUpperCase() : "Country"}
        rank={c?.rank}
        total={c?.total}
        note="No country on profile"
        href={c ? `/leaderboard?country=${c.code}` : undefined}
      />
      <Tile
        label={l ? l.name : "Language"}
        rank={l?.rank}
        total={l?.total}
        note="No main language"
        href={l ? `/leaderboard?lang=${encodeURIComponent(l.name)}` : undefined}
      />
    </div>
  );
}