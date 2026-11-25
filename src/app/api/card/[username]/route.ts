import { NextResponse } from "next/server";
import { getCard, toErrorResponse } from "@/lib/card-service";
import { getRanks } from "@/lib/players";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  try {
    const card = await getCard(username);
    return NextResponse.json({ ...card, ranks: await getRanks(card) });
  } catch (err) {
    return toErrorResponse(err);
  }
}