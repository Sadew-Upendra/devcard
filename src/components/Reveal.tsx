"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { DevCard } from "@/lib/scoring/card";
import { THEMES } from "@/lib/scoring/theme";
import { TiltCard } from "./TiltCard";
import type { Ranks } from "@/lib/rank-utils";
import { RankPanel } from "./RankPanel";

const fmt = (n: number) => n.toLocaleString("en-US");

export function Reveal({
  card,
  ranks,
}: {
  card: DevCard;
  ranks: Ranks | null;
}) {
  const t = THEMES[card.tier] ?? THEMES.Bronze;
  const reduce = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [badgeCopied, setBadgeCopied] = useState(false);
  const phase = reduce || opened ? "card" : "pack";

  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setOpened(true), 1900);
    return () => clearTimeout(id);
  }, [reduce]);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${card.name}'s DevCard`, url });
        return;
      } catch {
        /* user cancelled, fall through to copy */
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function copyBadge() {
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const md = `[![DevCard](${site}/api/badge/${card.login})](${site}/u/${card.login})`;
    await navigator.clipboard.writeText(md);
    setBadgeCopied(true);
    setTimeout(() => setBadgeCopied(false), 1800);
  }

  const rows: [string, number][] = [
    ["Contributions (last year)", card.raw.contributions],
    ["Merged pull requests", card.raw.mergedPRs],
    ["Stars on own repos", card.raw.stars],
    ["Followers", card.raw.followers],
    ["Reviews + issues", card.raw.reviewsAndIssues],
    ["Longest streak (days)", card.raw.streak],
  ];

  const btn =
    "flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold transition hover:bg-white/10";

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative flex min-h-[360px] items-center justify-center">
        {phase === "card" && (
          <div
            className="pointer-events-none absolute h-[380px] w-[380px] rounded-full opacity-40 blur-3xl"
            style={{ background: t.stops[1] }}
          />
        )}

        <AnimatePresence mode="wait">
          {phase === "pack" ? (
            <motion.button
              key="pack"
              type="button"
              onClick={() => setOpened(true)}
              className="relative flex h-[340px] w-[230px] flex-col items-center justify-center rounded-3xl border-2 border-white/40 shadow-2xl"
              style={{
                background: `linear-gradient(160deg, ${t.stops[0]}, ${t.stops[1]} 55%, ${t.stops[2]})`,
              }}
              animate={{
                rotate: [0, -3, 3, -3, 3, 0],
                scale: [1, 1.05, 1, 1.05, 1],
              }}
              transition={{ duration: 1.2, repeat: Infinity }}
              exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.35 } }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/devcard-icon.svg" alt="" className="h-24 w-24" />
              <span className="mt-4 text-sm font-bold tracking-[0.3em] text-white/90">
                OPENING…
              </span>
              <span className="absolute bottom-4 text-xs text-white/70">
                tap to skip
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.6, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 70, damping: 14 }}
              style={{ perspective: 1000 }}
            >
              <TiltCard card={card} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {phase === "card" && !reduce && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 bg-white"
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      )}

      {phase === "card" && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 w-full max-w-md space-y-6"
        >
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`/api/card/${card.login}/image?scale=3`}
              download={`devcard-${card.login}.png`}
              className={btn}
            >
              Download
            </a>
            <button type="button" onClick={share} className={btn}>
              {copied ? "Copied!" : "Share"}
            </button>
            <Link href="/" className={btn}>
              New card
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={copyBadge} className={btn}>
              {badgeCopied ? "Copied!" : "Copy README badge"}
            </button>
            <Link href={`/battle?a=${card.login}`} className={btn}>
              Battle a friend
            </Link>
          </div>

          <RankPanel ranks={ranks} />

          <dl className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between px-4 py-3 text-sm"
              >
                <dt className="text-slate-400">{label}</dt>
                <dd className="font-semibold">{fmt(value)}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      )}
    </div>
  );
}
