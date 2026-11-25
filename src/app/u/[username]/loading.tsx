export default function Loading() {
  return (
    <div className="flex w-full flex-col items-center pt-6">
      <div className="h-[420px] w-[min(300px,80vw)] animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
      <p className="mt-6 text-sm tracking-[0.3em] text-slate-400">SCOUTING PLAYER…</p>
    </div>
  );
}