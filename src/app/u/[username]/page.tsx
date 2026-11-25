import { ErrorView } from "@/components/ErrorView";
import { Reveal } from "@/components/Reveal";
import { getCard } from "@/lib/card-service";
import { GitHubError } from "@/lib/github/types";
import { getRanks } from "@/lib/players";
import type { DevCard } from "@/lib/scoring/card";

async function loadUser(
  username: string
): Promise<{ card: DevCard; ranks: Awaited<ReturnType<typeof getRanks>> } | { error: unknown }> {
  try {
    const card = await getCard(username);
    const ranks = await getRanks(card);
    return { card, ranks };
  } catch (error) {
    return { error };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  try {
    const card = await getCard(username);
    const title = `${card.name} · ${card.overall} ${card.tier} · DevCard`;
    const description = `${card.position}${card.topLanguage ? ` · ${card.topLanguage}` : ""}. Get your own GitHub developer card.`;
    const image = `/api/card/${card.login}/og`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: [{ url: image, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return { title: `@${username} · DevCard` };
  }
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const result = await loadUser(username);
  if ("error" in result) {
    if (result.error instanceof GitHubError) {
      return <ErrorView code={result.error.code} message={result.error.message} />;
    }
    throw result.error;
  }
  return <Reveal card={result.card} ranks={result.ranks} />;
}