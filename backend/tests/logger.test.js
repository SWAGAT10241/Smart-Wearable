const logger = require("../utils/logger");

describe("structured logger", () => {
  const originalEnvironment = process.env.NODE_ENV;
  const originalDebug = process.env.DEBUG;

  let logSpy;
  let infoSpy;
  let warnSpy;
  let errorSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnvironment;
    if (originalDebug === undefined) {
      delete process.env.DEBUG;
    } else {
      process.env.DEBUG = originalDebug;
    }
    jest.restoreAllMocks();
  });

  test("emits allowlisted JSON in production and omits sensitive values", () => {
    process.env.NODE_ENV = "production";
    const error = new Error("secret-bearing database URL and patient data");
    error.code = 11000;

    logger.error("database.connection_failed", {
      error,
      password: "password-value",
      token: "jwt-value",
      deviceSecret: "device-secret-value",
      healthHistory: [{ heartRate: 120 }],
      locationHistory: [{ latitude: 1, longitude: 2 }],
      url: "https://example.test/path?token=jwt-value",
    });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const record = JSON.parse(errorSpy.mock.calls[0][0]);
    expect(record).toMatchObject({
      level: "error",
      environment: "production",
      event: "database.connection_failed",
      errorName: "Error",
      errorCode: 11000,
    });
    expect(JSON.stringify(record)).not.toMatch(
      /secret-bearing|password-value|jwt-value|device-secret-value|heartRate|latitude|longitude|example\.test/,
    );
  });

  test("uses readable output in development and defines all log levels", () => {
    process.env.NODE_ENV = "development";
    process.env.DEBUG = "true";

    logger.debug("cache.restore", { count: 3 });
    logger.info("server.started", { port: 3000 });
    logger.warn("request.rejected", { statusCode: 403 });
    logger.error("request.failed", { error: new TypeError("private detail") });

    expect(logSpy.mock.calls[0][0]).toMatch(/DEBUG cache\.restore count=3/);
    expect(infoSpy.mock.calls[0][0]).toMatch(/INFO server\.started port=3000/);
    expect(warnSpy.mock.calls[0][0]).toMatch(/WARN request\.rejected statusCode=403/);
    expect(errorSpy.mock.calls[0][0]).toMatch(/ERROR request\.failed errorName="TypeError"/);
    expect(errorSpy.mock.calls[0][0]).not.toContain("private detail");
  });

  test("suppresses debug output in production and all output in tests", () => {
    process.env.NODE_ENV = "production";
    process.env.DEBUG = "true";
    logger.debug("debug.disabled");
    expect(logSpy).not.toHaveBeenCalled();

    process.env.NODE_ENV = "test";
    logger.info("test.suppressed");
    expect(infoSpy).not.toHaveBeenCalled();
  });
});
