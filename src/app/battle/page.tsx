import { BattleForm } from "@/components/BattleForm";
import { BattleView } from "@/components/BattleView";
import { getCard } from "@/lib/card-service";
import { GitHubError } from "@/lib/github/types";
import { cleanUsername } from "@/lib/username";

export const metadata = { title: "Battle · DevCard" };

function Shell({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="flex w-full flex-col items-center pt-6 text-center">
      <h1 className="text-4xl font-extrabold">Battle</h1>
      <p className="mt-2 mb-8 max-w-sm text-slate-400">
        Two GitHub usernames. Six stats. One winner.
      </p>
      {note && <p className="mb-4 text-sm text-rose-400">{note}</p>}
      {children}
    </div>
  );
}

export default async function BattlePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const sp = await searchParams;
  const a = sp.a ? cleanUsername(sp.a) : "";
  const b = sp.b ? cleanUsername(sp.b) : "";

  if (!a || !b) {
    return (
      <Shell>
        <BattleForm a={a} b={b} />
      </Shell>
    );
  }
  if (a.toLowerCase() === b.toLowerCase()) {
    return (
      <Shell note="Pick two different players.">
        <BattleForm a={a} b="" />
      </Shell>
    );
  }

  const [ra, rb] = await Promise.allSettled([getCard(a), getCard(b)]);

  const problems: string[] = [];
  for (const [login, res] of [[a, ra], [b, rb]] as const) {
    if (res.status === "rejected") {
      if (res.reason instanceof GitHubError) {
        problems.push(`@${login}: ${res.reason.message}`);
      } else {
        throw res.reason;
      }
    }
  }
  if (problems.length || ra.status !== "fulfilled" || rb.status !== "fulfilled") {
    return (
      <Shell note={problems.join("  ")}>
        <BattleForm a={a} b={b} />
      </Shell>
    );
  }

  return (
    <div className="flex w-full flex-col items-center pt-4">
      <BattleView a={ra.value} b={rb.value} />
    </div>
  );
}