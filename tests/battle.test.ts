import { describe, expect, it } from "vitest";
import { battle } from "../src/lib/battle";
import type { CardStats, DevCard } from "../src/lib/scoring/card";

function card(login: string, stats: CardStats, score: number): DevCard {
  return {
    login, name: login, avatarUrl: "", location: null,
    overall: Math.round(score), score, tier: "Gold", position: "x",
    topLanguage: null, stats,
    raw: { contributions: 0, mergedPRs: 0, stars: 0, followers: 0, reviewsAndIssues: 0, streak: 0 },
    generatedAt: "",
  };
}

const s = (n: number, over: Partial<CardStats> = {}): CardStats => ({
  COM: n, PRS: n, STR: n, FOL: n, REV: n, STK: n, ...over,
});

describe("battle", () => {
  it("decides by stat wins", () => {
    const r = battle(card("a", s(50, { COM: 60, PRS: 60, STR: 60, FOL: 60 }), 55),
                     card("b", s(50), 50));
    expect(r.winner).toBe("a");
    expect(r.winsA).toBe(4);
    expect(r.decidedBy).toBe("stats");
  });

  it("falls back to overall score on a stat tie", () => {
    const r = battle(card("a", s(50, { COM: 60, PRS: 60, STR: 60 }), 52.4),
                     card("b", s(50, { FOL: 60, REV: 60, STK: 60 }), 52.1));
    expect(r.winsA).toBe(3);
    expect(r.winsB).toBe(3);
    expect(r.winner).toBe("a");
    expect(r.decidedBy).toBe("overall");
  });

  it("is a draw when everything is equal", () => {
    const r = battle(card("a", s(40), 40), card("b", s(40), 40));
    expect(r.winner).toBe("draw");
    expect(r.decidedBy).toBe("none");
  });
});