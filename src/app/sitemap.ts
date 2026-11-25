import type { MetadataRoute } from "next";
import { getTopLogins } from "@/lib/players";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const logins = await getTopLogins(1000);
  return [
    { url: site, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/leaderboard`, changeFrequency: "daily", priority: 0.8 },
    { url: `${site}/battle`, changeFrequency: "monthly", priority: 0.6 },
    ...logins.map((l) => ({
      url: `${site}/u/${l}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}