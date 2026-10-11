const mockTicketCreate = jest.fn();
const mockTicketFindOneAndDelete = jest.fn();

jest.mock("../models/WebSocketTicket", () => ({
  create: mockTicketCreate,
  findOneAndDelete: mockTicketFindOneAndDelete,
}));

const jwt = require("jsonwebtoken");
const config = require("../config/env");
const service = require("../services/webSocketTicketService");

describe("webSocketTicketService", () => {
  const userId = "507f1f77bcf86cd799439011";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("issues a short-lived ticket backed by a server-side one-time record", async () => {
    mockTicketCreate.mockResolvedValue({});
    const ticket = await service.issueTicket(userId);
    const decoded = jwt.verify(ticket, config.jwtSecret);

    expect(decoded).toMatchObject({
      sub: userId,
      purpose: "websocket",
    });
    expect(mockTicketCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        jti: decoded.jti,
        userId,
        expiresAt: expect.any(Date),
      }),
    );
    expect(decoded.exp - decoded.iat).toBe(service.TICKET_TTL_SECONDS);
    expect(service.TICKET_TTL_SECONDS).toBe(30);
  });

  test("consumes a ticket only once and rejects invalid tickets", async () => {
    mockTicketFindOneAndDelete
      .mockResolvedValueOnce({ userId })
      .mockResolvedValueOnce(null);
    const ticket = await service.issueTicket(userId);

    await expect(service.consumeTicket(ticket)).resolves.toBe(userId);
    await expect(service.consumeTicket(ticket)).resolves.toBeNull();
    await expect(service.consumeTicket("not-a-ticket")).resolves.toBeNull();
    expect(mockTicketFindOneAndDelete).toHaveBeenCalledTimes(2);
  });

  test("does not accept another JWT purpose as a WebSocket ticket", async () => {
    const unrelated = jwt.sign({ sub: userId }, config.jwtSecret, {
      expiresIn: "1m",
    });
    await expect(service.consumeTicket(unrelated)).resolves.toBeNull();
    expect(mockTicketFindOneAndDelete).not.toHaveBeenCalled();
  });
});
