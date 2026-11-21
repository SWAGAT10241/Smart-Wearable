import { test, expect } from "@playwright/test";

test.describe("Safari/WebKit Performance & Navigation Benchmarks", () => {
  test("measures DOM readiness and resource timing in WebKit", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const domLoadDuration = Date.now() - startTime;

    // Fast initial page load assertion
    expect(domLoadDuration).toBeLessThan(3500);

    // Verify navigation timing metrics
    const navigationTiming = await page.evaluate(() => {
      const entry = performance.getEntriesByType("navigation")[0];
      return entry
        ? {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.startTime,
            duration: entry.duration,
          }
        : null;
    });

    if (navigationTiming) {
      expect(navigationTiming.domContentLoaded).toBeGreaterThan(0);
    }
  });
});
