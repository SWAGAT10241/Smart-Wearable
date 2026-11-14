const { cleanEmail } = require("../utils/sanitizeEmail");

describe("Backend cleanEmail utility", () => {
  it("trims whitespace and converts to lowercase", () => {
    expect(cleanEmail("  RescueLead@AlpineOps.ORG  ")).toBe("rescuelead@alpineops.org");
  });

  it("removes mailto: prefix", () => {
    expect(cleanEmail("mailto:sar@alpine.org")).toBe("sar@alpine.org");
    expect(cleanEmail("MAILTO:  sar@alpine.org")).toBe("sar@alpine.org");
  });

  it("strips quotes and brackets", () => {
    expect(cleanEmail('"sar@alpine.org"')).toBe("sar@alpine.org");
    expect(cleanEmail("<sar@alpine.org>")).toBe("sar@alpine.org");
  });

  it("strips trailing copy-paste punctuation", () => {
    expect(cleanEmail("sar@alpine.org,")).toBe("sar@alpine.org");
    expect(cleanEmail("sar@alpine.org.")).toBe("sar@alpine.org");
  });

  it("handles null and non-string inputs safely", () => {
    expect(cleanEmail(null)).toBe("");
    expect(cleanEmail(undefined)).toBe("");
    expect(cleanEmail({})).toBe("");
  });
});
