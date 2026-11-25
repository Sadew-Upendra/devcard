"use client";

import { useEffect, useRef, useState } from "react";
import type { DevCard } from "@/lib/scoring/card";
import { CARD_H, CARD_W, PlayerCard, SHIELD_PATH } from "./PlayerCard";

const HOLO =
  "linear-gradient(115deg, transparent 20%, rgba(255,0,200,.28) 40%, rgba(0,220,255,.28) 55%, rgba(255,230,0,.22) 70%, transparent 85%)";

export function TiltCard({ card }: { card: DevCard }) {
  const tilt = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);

  useEffect(() => {
    const update = () => setFit(Math.min(1, (window.innerWidth - 32) / CARD_W));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  function onMove(e: React.PointerEvent) {
    const el = tilt.current;
    const sh = shine.current;
    if (!el || !sh) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transition = "transform 60ms linear";
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 22}deg) rotateX(${(0.5 - py) * 22}deg) scale(1.03)`;
    sh.style.opacity = "1";
    sh.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.55), transparent 45%), ${HOLO}`;
  }

  function onLeave() {
    const el = tilt.current;
    const sh = shine.current;
    if (!el || !sh) return;
    el.style.transition = "transform 400ms ease";
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)";
    sh.style.opacity = "0";
  }

  return (
    <div style={{ width: CARD_W * fit, height: CARD_H * fit }}>
      <div
        style={{
          width: CARD_W,
          height: CARD_H,
          transform: `scale(${fit})`,
          transformOrigin: "top left",
          filter: "drop-shadow(0 24px 32px rgba(0,0,0,0.55))",
        }}
      >
        <div
          ref={tilt}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={{ position: "relative", width: CARD_W, height: CARD_H, touchAction: "pan-y" }}
        >
          <PlayerCard card={card} />
          <div
            ref={shine}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              transition: "opacity 300ms",
              mixBlendMode: "overlay",
              pointerEvents: "none",
              clipPath: `path('${SHIELD_PATH}')`,
            }}
          />
        </div>
      </div>
    </div>
  );
}