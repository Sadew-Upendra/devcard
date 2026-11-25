/* eslint-disable @next/next/no-img-element */
import type { DevCard } from "@/lib/scoring/card";
import { THEMES } from "@/lib/scoring/theme";
import { countryFromLocation } from "@/lib/location/country";

export const CARD_W = 400;
export const CARD_H = 580;
export const SHIELD_PATH =
  "M36 6 H364 L394 36 V462 C394 520 300 556 200 574 C100 556 6 520 6 462 V36 Z";
const INNER_PATH =
  "M44 20 H356 L380 44 V458 C380 508 296 540 200 557 C104 540 20 508 20 458 V44 Z";
const SPARKLE = "M0 -9 L2.2 -2.2 L9 0 L2.2 2.2 L0 9 L-2.2 2.2 L-9 0 L-2.2 -2.2 Z";

const sized = (url: string, px: number) =>
  url.includes("?") ? `${url}&s=${px}` : `${url}?s=${px}`;

export function PlayerCard({ card }: { card: DevCard }) {
  const t = THEMES[card.tier] ?? THEMES.Bronze;
  const id = card.login.replace(/[^a-z0-9]/gi, "");
  const country = countryFromLocation(card.location);
  const name = card.name.length > 22 ? card.name.slice(0, 21) + "…" : card.name;
  const nameSize = name.length > 16 ? 26 : name.length > 12 ? 30 : 36;

  const cols: [string, number][][] = [
    [["COM", card.stats.COM], ["PRS", card.stats.PRS], ["STR", card.stats.STR]],
    [["FOL", card.stats.FOL], ["REV", card.stats.REV], ["STK", card.stats.STK]],
  ];

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: CARD_W,
        height: CARD_H,
        fontFamily: "Inter",
        color: t.text,
      }}
    >
      {/* Background art */}
      <svg
        width={CARD_W}
        height={CARD_H}
        viewBox={`0 0 ${CARD_W} ${CARD_H}`}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <defs>
          <linearGradient id={`base${id}`} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor={t.stops[0]} />
            <stop offset="0.5" stopColor={t.stops[1]} />
            <stop offset="1" stopColor={t.stops[2]} />
          </linearGradient>
          <linearGradient id={`shade${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000000" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id={`rule${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={t.text} stopOpacity="0" />
            <stop offset="0.5" stopColor={t.text} stopOpacity="0.7" />
            <stop offset="1" stopColor={t.text} stopOpacity="0" />
          </linearGradient>
          <radialGradient
            id={`glow${id}`}
            cx="246"
            cy="152"
            r="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={t.glow} stopOpacity="0.7" />
            <stop offset="1" stopColor={t.glow} stopOpacity="0" />
          </radialGradient>
          <clipPath id={`clip${id}`}>
            <path d={SHIELD_PATH} />
          </clipPath>
        </defs>

        <path d={SHIELD_PATH} fill={`url(#base${id})`} />

        <g clipPath={`url(#clip${id})`}>
          {/* diagonal light bands */}
          <polygon points="0,380 400,60 400,120 0,440" fill="#ffffff" opacity="0.08" />
          <polygon points="0,470 400,150 400,170 0,490" fill="#ffffff" opacity="0.12" />
          <polygon points="0,120 260,-20 320,-20 0,170" fill="#ffffff" opacity="0.10" />
          {/* darker lower half for stats */}
          <rect x="0" y="330" width="400" height="250" fill={`url(#shade${id})`} />
          {/* glow and rings behind avatar */}
          <circle cx="246" cy="152" r="140" fill={`url(#glow${id})`} />
          <circle cx="246" cy="152" r="100" fill="none" stroke={t.text} strokeOpacity="0.18" strokeWidth="1.5" />
          <circle cx="246" cy="152" r="120" fill="none" stroke={t.text} strokeOpacity="0.12" strokeWidth="1.5" />
          <circle cx="246" cy="152" r="142" fill="none" stroke={t.text} strokeOpacity="0.08" strokeWidth="1.5" />
          {/* sparkles */}
          <path d={SPARKLE} transform="translate(352 74)" fill="#ffffff" opacity="0.8" />
          <path d={SPARKLE} transform="translate(150 244) scale(0.6)" fill="#ffffff" opacity="0.7" />
          <path d={SPARKLE} transform="translate(372 232) scale(0.5)" fill="#ffffff" opacity="0.6" />
        </g>

        <path d={SHIELD_PATH} fill="none" stroke={t.border} strokeWidth="5" />
        <path d={INNER_PATH} fill="none" stroke={t.line} strokeWidth="1.5" />
        <line x1="40" y1="346" x2="360" y2="346" stroke={`url(#rule${id})`} strokeWidth="2" />
        <path d="M200 339 L207 346 L200 353 L193 346 Z" fill={t.text} />
      </svg>

      {/* Rating column */}
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 38,
          width: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", fontSize: 74, fontWeight: 700, lineHeight: 1 }}>
          {card.overall}
        </div>
        <div style={{ display: "flex", fontSize: 15, fontWeight: 700, letterSpacing: 3, marginTop: 6 }}>
          {card.tier.toUpperCase()}
        </div>
        <div style={{ display: "flex", width: 54, height: 2, background: t.line, margin: "14px 0" }} />
        {country ? (
          <img
            src={`https://flagcdn.com/w80/${country}.png`}
            width={46}
            height={31}
            style={{ borderRadius: 4, border: `1px solid ${t.line}` }}
            alt=""
          />
        ) : null}
        {card.topLanguage ? (
          <div style={{ display: "flex", fontSize: 14, fontWeight: 700, marginTop: 12, letterSpacing: 0.5 }}>
            {card.topLanguage}
          </div>
        ) : null}
      </div>

      {/* Avatar */}
      <img
        src={sized(card.avatarUrl, 300)}
        width={176}
        height={176}
        style={{
          position: "absolute",
          left: 158,
          top: 64,
          borderRadius: 88,
          border: `4px solid ${t.border}`,
          objectFit: "cover",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}
        alt=""
      />

      {/* Name */}
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 258,
          width: 360,
          display: "flex",
          justifyContent: "center",
          fontSize: nameSize,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {name}
      </div>

      {/* Position pill */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 304,
          width: CARD_W,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "5px 16px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.18)",
            border: `1px solid ${t.line}`,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {card.position}
        </div>
      </div>

      {/* Stats */}
      <div style={{ position: "absolute", left: 50, top: 362, width: 300, display: "flex" }}>
        {cols.map((col, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "center",
              borderLeft: i === 1 ? `2px solid ${t.line}` : "none",
            }}
          >
            {col.map(([key, value]) => (
              <div
                key={key}
                style={{ display: "flex", flexDirection: "column", width: 116, marginBottom: 9 }}
              >
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <div style={{ display: "flex", fontSize: 30, fontWeight: 700, marginRight: 8 }}>
                    {value}
                  </div>
                  <div style={{ display: "flex", fontSize: 17, fontWeight: 700, opacity: 0.85 }}>
                    {key}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    width: 116,
                    height: 4,
                    borderRadius: 2,
                    background: t.line,
                    marginTop: 2,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      height: 4,
                      borderRadius: 2,
                      width: `${Math.round((value / 99) * 100)}%`,
                      background: t.text,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 510,
          width: CARD_W,
          display: "flex",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1.5,
          opacity: 0.8,
        }}
      >
        {`@${card.login} · DEVCARD`}
      </div>
    </div>
  );
}