const { injectionGuard, sanitizeObject } = require("../middleware/injectionGuard");

describe("injectionGuard Middleware & Sanitizer", () => {
  test("allows clean standard payloads", () => {
    const cleanPayload = {
      email: "hiker@trailguard.org",
      vitals: {
        heartRate: 75,
        spo2: 98,
      },
    };

    const sanitized = sanitizeObject(cleanPayload);
    expect(sanitized).toEqual(cleanPayload);
  });

  test("blocks NoSQL query operators like $gt, $where, $ne", () => {
    const maliciousPayload = {
      username: "admin",
      password: { $gt: "" },
    };

    expect(() => sanitizeObject(maliciousPayload)).toThrow(
      "Unauthorized NoSQL query operator detected: $gt"
    );

    const scriptPayload = {
      $where: "sleep(5000)",
    };

    expect(() => sanitizeObject(scriptPayload)).toThrow(
      "Unauthorized NoSQL query operator detected: $where"
    );
  });

  test("blocks prototype pollution attempts", () => {
    const pollutionPayload = JSON.parse(
      '{"__proto__": {"isAdmin": true}, "name": "hacker"}'
    );

    expect(() => sanitizeObject(pollutionPayload)).toThrow(
      "Prototype pollution attempt detected"
    );
  });

  test("intercepts malicious request in express middleware and returns 400", () => {
    const req = {
      body: {
        email: { $ne: null },
      },
      query: {},
      params: {},
    };

    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      },
    };

    const next = jest.fn();

    injectionGuard(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.body.code).toBe("INJECTION_BLOCKED");
  });
});
