import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";

const EXAMPLES = ["torvalds", "gaearon", "sindresorhus", "antfu"];

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center pt-8 text-center sm:pt-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/devcard-icon.svg" alt="" className="h-28 w-28 drop-shadow-2xl" />
      <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-7xl">
        Dev
        <span className="bg-gradient-to-br from-amber-200 to-amber-500 bg-clip-text text-transparent">
          Card
        </span>
      </h1>
      <p className="mt-4 max-w-md text-lg text-slate-400">
        Type a GitHub username. Open your developer player card.
      </p>

      <div className="mt-8 flex w-full justify-center">
        <SearchBox />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-slate-500">Try:</span>
        {EXAMPLES.map((u) => (
          <Link
            key={u}
            href={`/u/${u}`}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300 transition hover:bg-white/10"
          >
            @{u}
          </Link>
        ))}
      </div>
    </div>
  );
}
