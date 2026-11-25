import { beforeEach, describe, expect, it } from "vitest";
import {
  getTokens,
  markLimited,
  pickToken,
  resetTokenState,
} from "../src/lib/github/tokens";

beforeEach(() => {
  process.env.GITHUB_TOKENS = "a, b ,c";
  delete process.env.GITHUB_TOKEN;
  resetTokenState();
});

describe("tokens", () => {
  it("parses a comma-separated list", () =>
    expect(getTokens()).toEqual(["a", "b", "c"]));

  it("rotates round-robin", () =>
    expect([pickToken(), pickToken(), pickToken(), pickToken()]).toEqual([
      "a", "b", "c", "a",
    ]));

  it("skips a limited token until its reset time", () => {
    markLimited("a", 1000);
    expect([pickToken(500), pickToken(500), pickToken(500)]).toEqual(["b", "c", "b"]);
    const later = [pickToken(2000), pickToken(2000), pickToken(2000)];
    expect(later).toContain("a");
  });

  it("returns null when every token is limited", () => {
    ["a", "b", "c"].forEach((t) => markLimited(t, 1000));
    expect(pickToken(500)).toBeNull();
  });

  it("falls back to GITHUB_TOKEN", () => {
    delete process.env.GITHUB_TOKENS;
    process.env.GITHUB_TOKEN = "solo";
    expect(getTokens()).toEqual(["solo"]);
  });
});