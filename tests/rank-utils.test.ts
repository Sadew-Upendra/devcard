import { describe, expect, it } from "vitest";
import { topPercent } from "../src/lib/rank-utils";

describe("topPercent", () => {
  it("hides the percent for small tables", () =>
    expect(topPercent(1, 50)).toBeNull());
  it("rounds up and never shows 0%", () => {
    expect(topPercent(1, 1000)).toBe(1);
    expect(topPercent(50, 1000)).toBe(5);
  });
  it("last place is 100%", () => expect(topPercent(1000, 1000)).toBe(100));
});