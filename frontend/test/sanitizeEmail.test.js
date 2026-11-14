import { describe, it, expect } from "vitest";
import { cleanEmail } from "../src/utils/sanitizeEmail";

describe("cleanEmail module", () => {
  it("trims whitespace and converts to lowercase", () => {
    expect(cleanEmail("  User@Example.COM  ")).toBe("user@example.com");
  });

  it("removes leading mailto: prefix", () => {
    expect(cleanEmail("mailto:hiker@trailguard.org")).toBe("hiker@trailguard.org");
    expect(cleanEmail("MAILTO:hiker@trailguard.org")).toBe("hiker@trailguard.org");
    expect(cleanEmail("mailto:  hiker@trailguard.org")).toBe("hiker@trailguard.org");
  });

  it("removes surrounding quotes and angle brackets", () => {
    expect(cleanEmail('"hiker@trailguard.org"')).toBe("hiker@trailguard.org");
    expect(cleanEmail("'hiker@trailguard.org'")).toBe("hiker@trailguard.org");
    expect(cleanEmail("<hiker@trailguard.org>")).toBe("hiker@trailguard.org");
    expect(cleanEmail("[hiker@trailguard.org]")).toBe("hiker@trailguard.org");
  });

  it("removes trailing copy-paste punctuation (commas, periods, colons)", () => {
    expect(cleanEmail("hiker@trailguard.org,")).toBe("hiker@trailguard.org");
    expect(cleanEmail("hiker@trailguard.org.")).toBe("hiker@trailguard.org");
    expect(cleanEmail("hiker@trailguard.org;")).toBe("hiker@trailguard.org");
    expect(cleanEmail('"mailto:Hiker@TrailGuard.org,"')).toBe("hiker@trailguard.org");
  });

  it("handles non-string and empty values safely", () => {
    expect(cleanEmail("")).toBe("");
    expect(cleanEmail(null)).toBe("");
    expect(cleanEmail(undefined)).toBe("");
    expect(cleanEmail(123)).toBe("");
  });
});
