import Link from "next/link";

export function Header() {
  return (
    <header className="mx-auto flex h-16 w-full max-w-5xl items-center px-4">
      <Link href="/" className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/devcard-icon.svg" alt="" className="h-9 w-9" />
        <span className="text-lg font-extrabold tracking-tight">
          Dev
          <span className="bg-gradient-to-br from-amber-200 to-amber-500 bg-clip-text text-transparent">
            Card
          </span>
        </span>
      </Link>
      <nav className="ml-auto flex items-center gap-5 text-sm font-semibold text-slate-300">
        <Link href="/battle" className="hover:text-white">
          Battle
        </Link>
        <Link href="/leaderboard" className="hover:text-white">
          Leaderboard
        </Link>
      </nav>
    </header>
  );
}