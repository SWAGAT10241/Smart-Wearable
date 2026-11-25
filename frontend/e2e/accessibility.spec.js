import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Safari/WebKit WCAG Accessibility Audits", () => {
  const routes = [
    { name: "Landing", path: "/" },
    { name: "About", path: "/about" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  for (const { name, path } of routes) {
    test(`evaluates accessibility on ${name} (${path})`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("domcontentloaded");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      // Ensure zero critical accessibility violations
      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      expect(criticalViolations).toEqual([]);
    });
  }
});
