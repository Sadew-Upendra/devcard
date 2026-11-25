import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PlayerCard } from "@/components/PlayerCard";
import { getCard, toErrorResponse } from "@/lib/card-service";
import { COUNTRY_NAMES } from "@/lib/location/country";
import { getRanks } from "@/lib/players";
import { THEMES } from "@/lib/scoring/theme";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  try {
    const card = await getCard(username);
    const ranks = await getRanks(card);
    const font = await readFile(
      path.join(process.cwd(), "src/assets/fonts/Inter-Bold.ttf")
    );
    const t = THEMES[card.tier] ?? THEMES.Bronze;

    const tiles: { value: string; label: string }[] = [];
    if (ranks) {
      tiles.push({ value: `#${ranks.global.rank}`, label: "GLOBAL" });
      if (ranks.country) {
        tiles.push({
          value: `#${ranks.country.rank}`,
          label: (COUNTRY_NAMES[ranks.country.code] ?? ranks.country.code).toUpperCase(),
        });
      }
      if (ranks.language) {
        tiles.push({ value: `#${ranks.language.rank}`, label: ranks.language.name.toUpperCase() });
      }
    }

    const name = card.name.length > 22 ? card.name.slice(0, 21) + "…" : card.name;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 1200,
            height: 630,
            fontFamily: "Inter",
            color: "#f8fafc",
            background: "linear-gradient(135deg, #0b1220, #111c33)",
          }}
        >
          {/* tier glow behind the card */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: -80,
              top: 0,
              width: 760,
              height: 630,
              opacity: 0.5,
              background: `radial-gradient(circle, ${t.stops[1]} 0%, transparent 65%)`,
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 520,
              height: 630,
            }}
          >
            <PlayerCard card={card} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              paddingRight: 60,
            }}
          >
            <div style={{ display: "flex", fontSize: 24, letterSpacing: 8, color: "#f5b82e" }}>
              DEVCARD
            </div>
            <div style={{ display: "flex", fontSize: 62, marginTop: 14 }}>{name}</div>
            <div style={{ display: "flex", fontSize: 28, color: "#94a3b8", marginTop: 6 }}>
              {`@${card.login} · ${card.position}`}
            </div>

            <div style={{ display: "flex", alignItems: "baseline", marginTop: 28 }}>
              <div style={{ display: "flex", fontSize: 150, lineHeight: 1, color: t.stops[0] }}>
                {card.overall}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 34,
                  letterSpacing: 6,
                  marginLeft: 24,
                  color: t.stops[0],
                }}
              >
                {card.tier.toUpperCase()}
              </div>
            </div>

            {tiles.length > 0 && (
              <div style={{ display: "flex", marginTop: 24 }}>
                {tiles.map((x) => (
                  <div
                    key={x.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginRight: 36,
                    }}
                  >
                    <div style={{ display: "flex", fontSize: 44 }}>{x.value}</div>
                    <div style={{ display: "flex", fontSize: 16, letterSpacing: 3, color: "#94a3b8" }}>
                      {x.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", fontSize: 24, color: "#64748b", marginTop: 36 }}>
              Get your own GitHub developer card
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [{ name: "Inter", data: font, weight: 700, style: "normal" }],
        headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
      }
    );
  } catch (err) {
    return toErrorResponse(err);
  }
}