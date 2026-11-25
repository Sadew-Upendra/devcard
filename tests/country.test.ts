import { describe, expect, it } from "vitest";
import { countryFromLocation } from "../src/lib/location/country";

describe("countryFromLocation", () => {
  it("reads the country at the end", () =>
    expect(countryFromLocation("Colombo, Sri Lanka")).toBe("lk"));
  it("falls back to a city", () =>
    expect(countryFromLocation("Bengaluru")).toBe("in"));
  it("handles unknown and empty", () => {
    expect(countryFromLocation("Narnia")).toBeNull();
    expect(countryFromLocation(null)).toBeNull();
  });
});