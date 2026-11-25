import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { CARD_H, CARD_W, PlayerCard } from "@/components/PlayerCard";
import { getCard, toErrorResponse } from "@/lib/card-service";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const raw = Number(new URL(req.url).searchParams.get("scale") ?? 2);
  const s = Math.min(3, Math.max(1, Number.isFinite(raw) ? raw : 2));

  try {
    const card = await getCard(username);
    const font = await readFile(
      path.join(process.cwd(), "src/assets/fonts/Inter-Bold.ttf")
    );

    return new ImageResponse(
      (
        <div style={{ display: "flex", width: CARD_W * s, height: CARD_H * s }}>
          <div
            style={{
              display: "flex",
              transform: `scale(${s})`,
              transformOrigin: "top left",
            }}
          >
            <PlayerCard card={card} />
          </div>
        </div>
      ),
      {
        width: CARD_W * s,
        height: CARD_H * s,
        fonts: [{ name: "Inter", data: font, weight: 700, style: "normal" }],
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
          "Content-Disposition": `inline; filename="devcard-${card.login}.png"`,
        },
      }
    );
  } catch (err) {
    return toErrorResponse(err);
  }
}