const AppError = require("../utils/appError");
const errorHandler = require("../middleware/errorHandler");

function invokeErrorHandler(error) {
  const response = {
    headersSent: false,
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  errorHandler(error, { method: "GET", route: { path: "/history" } }, response, next);
  return { response, next };
}

describe("errorHandler secure responses", () => {
  test("does not expose internal error messages or database codes", () => {
    const error = new Error("mongodb://private-user:password@db.internal");
    error.code = "ECONNREFUSED";

    const { response } = invokeErrorHandler(error);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  test("does not echo invalid database field values", () => {
    const error = new Error("Cast failed for private value");
    error.name = "CastError";
    error.path = "userId";
    error.value = "sensitive-user-input";

    const { response } = invokeErrorHandler(error);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: "Invalid resource identifier",
      code: "INVALID_ID",
    });
  });

  test("preserves safe operational messages and codes", () => {
    const { response } = invokeErrorHandler(
      new AppError("Active emergency session not found", 404, "SESSION_NOT_FOUND"),
    );

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      error: "Active emergency session not found",
      code: "SESSION_NOT_FOUND",
    });
  });
});
