import { PlayerCard } from "@/components/PlayerCard";
import { getCard } from "@/lib/card-service";

export default async function Preview({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const card = await getCard(username);
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b1220",
      }}
    >
      <PlayerCard card={card} />
    </main>
  );
}