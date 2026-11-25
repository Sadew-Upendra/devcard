import Link from "next/link";
import { battle } from "@/lib/battle";
import type { DevCard } from "@/lib/scoring/card";
import { TiltCard } from "./TiltCard";

const hi = (on: boolean) => (on ? "text-amber-300" : "text-slate-500");

export function BattleView({ a, b }: { a: DevCard; b: DevCard }) {
  const r = battle(a, b);
  const winner = r.winner === "a" ? a : r.winner === "b" ? b : null;

  const score = `${r.winsA}–${r.winsB}${r.draws ? ` (${r.draws} drawn)` : ""}`;
  const sub =
    r.decidedBy === "stats"
      ? `${score} on stats`
      : r.decidedBy === "overall"
        ? `${score} on stats · decided by overall rating`
        : `${score} on stats · identical overall rating`;

  const ovr: "a" | "b" | "draw" =
    a.score > b.score ? "a" : b.score > a.score ? "b" : "draw";

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="text-center">
        <div className="text-4xl">{winner ? "🏆" : "🤝"}</div>
        <h2 className="mt-2 text-3xl font-extrabold">
          {winner ? `@${winner.login} wins` : "It's a draw"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{sub}</p>
      </div>

      <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:justify-center lg:gap-10">
        <TiltCard card={a} />

        <div className="w-full max-w-xs divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center bg-white/5 px-4 py-3">
            <span className={`text-left text-2xl font-extrabold ${hi(ovr === "a")}`}>
              {a.overall}
            </span>
            <span className="px-3 text-xs font-bold uppercase tracking-widest text-slate-300">
              OVR
            </span>
            <span className={`text-right text-2xl font-extrabold ${hi(ovr === "b")}`}>
              {b.overall}
            </span>
          </div>
          {r.rounds.map((rd) => (
            <div
              key={rd.key}
              title={rd.label}
              className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3"
            >
              <span className={`text-left text-lg font-extrabold ${hi(rd.winner === "a")}`}>
                {rd.a}
              </span>
              <span className="px-3 text-xs uppercase tracking-widest text-slate-400">
                {rd.key}
              </span>
              <span className={`text-right text-lg font-extrabold ${hi(rd.winner === "b")}`}>
                {rd.b}
              </span>
            </div>
          ))}
        </div>

        <TiltCard card={b} />
      </div>

      <Link
        href="/battle"
        className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
      >
        New battle
      </Link>
    </div>
  );
}