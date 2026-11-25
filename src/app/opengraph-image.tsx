import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { THEMES } from "@/lib/scoring/theme";

export const runtime = "nodejs";
export const alt = "DevCard · Your GitHub. Your card.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const font = await readFile(
    path.join(process.cwd(), "src/assets/fonts/Inter-Bold.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: 1200,
          height: 630,
          padding: "0 90px",
          fontFamily: "Inter",
          color: "#f8fafc",
          background: "linear-gradient(135deg, #0b1220, #111c33)",
        }}
      >
        <svg width="260" height="300" viewBox="0 0 200 210">
          <defs>
            <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fde68a" />
              <stop offset="0.5" stopColor="#f5b82e" />
              <stop offset="1" stopColor="#b9770e" />
            </linearGradient>
          </defs>
          <path
            d="M100 8 L180 30 L180 112 Q180 168 100 204 Q20 168 20 112 L20 30 Z"
            fill="url(#gold)"
          />
          <polyline points="76,84 52,108 76,132" fill="none" stroke="#1a1000" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="124,84 148,108 124,132" fill="none" stroke="#1a1000" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="108" y1="78" x2="92" y2="138" stroke="#1a1000" strokeWidth="10" strokeLinecap="round" />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", marginLeft: 70 }}>
          <div style={{ display: "flex", fontSize: 120, lineHeight: 1 }}>
            <span>Dev</span>
            <span style={{ color: "#f5b82e" }}>Card</span>
          </div>
          <div style={{ display: "flex", fontSize: 38, color: "#94a3b8", marginTop: 18 }}>
            Type a GitHub username. Get your developer card.
          </div>
          <div style={{ display: "flex", marginTop: 40 }}>
            {Object.entries(THEMES).map(([name, t]) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  marginRight: 12,
                  borderRadius: 999,
                  fontSize: 22,
                  letterSpacing: 2,
                  background: t.stops[1],
                  color: t.text,
                }}
              >
                {name.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: font, weight: 700, style: "normal" }],
    }
  );
}