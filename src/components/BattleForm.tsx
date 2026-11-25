"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOGIN_RE, cleanUsername } from "@/lib/username";

const field =
  "flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 focus-within:border-amber-300/60";
const input =
  "min-w-0 flex-1 bg-transparent px-1 py-3 text-lg outline-none placeholder:text-slate-500";

export function BattleForm({ a = "", b = "" }: { a?: string; b?: string }) {
  const router = useRouter();
  const [first, setFirst] = useState(a);
  const [second, setSecond] = useState(b);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const x = cleanUsername(first);
    const y = cleanUsername(second);
    if (!LOGIN_RE.test(x) || !LOGIN_RE.test(y)) {
      setError("Enter two valid GitHub usernames.");
      return;
    }
    if (x.toLowerCase() === y.toLowerCase()) {
      setError("Pick two different players.");
      return;
    }
    setError(null);
    router.push(`/battle?a=${x}&b=${y}`);
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-2">
      <div className={field}>
        <span className="flex items-center pl-3 text-slate-400">@</span>
        <input
          value={first}
          onChange={(e) => setFirst(e.target.value)}
          placeholder="first-player"
          aria-label="First GitHub username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={input}
        />
      </div>
      <div className="text-center text-sm font-extrabold tracking-[0.4em] text-amber-300">
        VS
      </div>
      <div className={field}>
        <span className="flex items-center pl-3 text-slate-400">@</span>
        <input
          value={second}
          onChange={(e) => setSecond(e.target.value)}
          placeholder="second-player"
          aria-label="Second GitHub username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={input}
        />
      </div>
      <button
        type="submit"
        className="mt-2 w-full rounded-xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 py-3 text-lg font-extrabold tracking-wide text-slate-900 transition hover:brightness-110 active:scale-95"
      >
        FIGHT
      </button>
      {error && <p className="text-left text-sm text-rose-400">{error}</p>}
    </form>
  );
}