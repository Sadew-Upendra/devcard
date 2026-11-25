import { getCard } from "@/lib/card-service";
import { GitHubError } from "@/lib/github/types";
import { getRanks } from "@/lib/players";
import { THEMES } from "@/lib/scoring/theme";

const ESC: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c]);

function badge(right: string, bg: string, fg: string): string {
  const leftW = 92;
  const rightW = Math.round(right.length * 7.6 + 24);
  const w = leftW + rightW;
  const label = esc(`DevCard ${right}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="28" viewBox="0 0 ${w} 28" role="img" aria-label="${label}">
  <title>${label}</title>
  <defs>
    <linearGradient id="g" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".18"/>
      <stop offset="1" stop-color="#000" stop-opacity=".12"/>
    </linearGradient>
    <clipPath id="r"><rect width="${w}" height="28" rx="6"/></clipPath>
  </defs>
  <g clip-path="url(#r)">
    <rect width="${leftW}" height="28" fill="#0f172a"/>
    <rect x="${leftW}" width="${rightW}" height="28" fill="${bg}"/>
    <rect width="${w}" height="28" fill="url(#g)"/>
  </g>
  <path d="M8 0 L15 2 V9 Q15 14 8 17 Q1 14 1 9 V2 Z" transform="translate(9 5.5)" fill="#f5b82e"/>
  <g font-family="Verdana,DejaVu Sans,sans-serif" font-size="11" font-weight="700">
    <text x="30" y="18" fill="#f8fafc">DevCard</text>
    <text x="${leftW + rightW / 2}" y="18" text-anchor="middle" fill="${fg}">${esc(right)}</text>
  </g>
</svg>`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  let body: string;
  let cache = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400";

  try {
    const card = await getCard(username);
    const ranks = await getRanks(card);
    const t = THEMES[card.tier] ?? THEMES.Bronze;
    const right =
      `${card.overall} · ${card.tier.toUpperCase()}` +
      (ranks ? ` · #${ranks.global.rank}` : "");
    body = badge(right, t.stops[1], t.text);
  } catch (err) {
    const notFound = err instanceof GitHubError && err.code === "NOT_FOUND";
    body = badge(notFound ? "not found" : "unavailable", "#475569", "#f8fafc");
    cache = "public, max-age=300";
  }

  return new Response(body, {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": cache },
  });
}