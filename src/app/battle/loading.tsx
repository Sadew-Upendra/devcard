export default function Loading() {
  return (
    <div className="flex w-full flex-col items-center pt-10">
      <div className="flex gap-6">
        <div className="h-[380px] w-[min(240px,40vw)] animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
        <div className="h-[380px] w-[min(240px,40vw)] animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
      </div>
      <p className="mt-6 text-sm tracking-[0.3em] text-slate-400">FACING OFF…</p>
    </div>
  );
}