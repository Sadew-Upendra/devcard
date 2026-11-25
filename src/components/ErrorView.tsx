import Link from "next/link";
import { SearchBox } from "./SearchBox";

const TITLES: Record<string, string> = {
  NOT_FOUND: "No such player",
  INVALID: "Invalid username",
  RATE_LIMITED: "Too many packs opened",
};

export function ErrorView({ code, message }: { code: string; message: string }) {
  return (
    <div className="flex w-full flex-col items-center pt-16 text-center">
      <div className="text-6xl">🃏</div>
      <h1 className="mt-4 text-2xl font-extrabold">{TITLES[code] ?? "Something broke"}</h1>
      <p className="mt-2 max-w-sm text-slate-400">{message}</p>
      <div className="mt-8 flex w-full justify-center">
        <SearchBox />
      </div>
      <Link href="/" className="mt-6 text-sm text-slate-400 underline">
        Back to home
      </Link>
    </div>
  );
}