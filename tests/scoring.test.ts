import { describe, expect, it } from "vitest";
import { longestStreak, scale } from "../src/lib/scoring/stats";

describe("scale", () => {
  it("returns 0 for 0", () => expect(scale(0, 20)).toBe(0));
  it("caps at 99", () => expect(scale(10_000_000, 20)).toBe(99));
  it("grows with value", () => expect(scale(1000, 20)).toBeGreaterThan(scale(100, 20)));
});

describe("longestStreak", () => {
  it("finds the longest run across weeks", () => {
    const day = (n: number) => ({ contributionCount: n, date: "" });
    const weeks = [
      { contributionDays: [day(1), day(2), day(0), day(1)] },
      { contributionDays: [day(1), day(1), day(1), day(0)] },
    ];
    expect(longestStreak(weeks)).toBe(4);
  });
});