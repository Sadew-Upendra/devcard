"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOGIN_RE, cleanUsername } from "@/lib/username";

export function SearchBox({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const login = cleanUsername(value);
    if (!LOGIN_RE.test(login)) {
      setError("Enter a valid GitHub username.");
      return;
    }
    setError(null);
    router.push(`/u/${login}`);
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur focus-within:border-amber-300/60">
        <span className="flex items-center pl-3 text-slate-400">@</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="github-username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-label="GitHub username"
          className="min-w-0 flex-1 bg-transparent px-1 py-3 text-lg outline-none placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 px-6 text-lg font-bold text-slate-900 transition hover:brightness-110 active:scale-95"
        >
          OK
        </button>
      </div>
      {error && <p className="mt-2 text-left text-sm text-rose-400">{error}</p>}
    </form>
  );
}