const express = require("express");
const request = require("supertest");
const { createLimiter } = require("../middleware/rateLimiter");

describe("Rate Limiter Middleware", () => {
  it("allows requests under the threshold", async () => {
    const app = express();
    const testLimiter = createLimiter({
      windowMs: 60 * 1000,
      limit: 5,
      skip: () => false, // explicitly enable for testing
    });

    app.get("/test", testLimiter, (req, res) => {
      res.status(200).json({ ok: true });
    });

    for (let i = 0; i < 5; i++) {
      const res = await request(app).get("/test");
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
    }
  });

  it("blocks requests that exceed the limit with 429 Too Many Requests", async () => {
    const app = express();
    const testLimiter = createLimiter({
      windowMs: 60 * 1000,
      limit: 2,
      skip: () => false,
      message: { success: false, error: "Limit reached" },
    });

    app.get("/limited", testLimiter, (req, res) => {
      res.status(200).json({ ok: true });
    });

    await request(app).get("/limited");
    await request(app).get("/limited");

    const third = await request(app).get("/limited");
    expect(third.status).toBe(429);
    expect(third.body.error).toBe("Limit reached");
  });
});
