process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const webSocketTicketService = require("../services/webSocketTicketService");
const WebSocketTicket = require("../models/WebSocketTicket");
const User = require("../models/User");

jest.mock("../models/WebSocketTicket");
jest.mock("../models/User");

describe("webSocketTicketService", () => {
  const userId = new mongoose.Types.ObjectId();
  const testTicket = "a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTicket", () => {
    test("generates and stores a ticket with specified role", async () => {
      WebSocketTicket.create.mockResolvedValue({
        ticket: testTicket,
        userId,
        role: "responder",
        expiresAt: new Date(Date.now() + 60_000),
      });

      const result = await webSocketTicketService.createTicket(userId, "responder");

      expect(WebSocketTicket.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          role: "responder",
          expiresAt: expect.any(Date),
        }),
      );
      expect(result).toHaveProperty("ticket");
      expect(result.expiresIn).toBe(60);
    });

    test("resolves role from User model if role is not supplied", async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ role: "coordinator" }),
      });

      WebSocketTicket.create.mockResolvedValue({
        ticket: testTicket,
        userId,
        role: "coordinator",
        expiresAt: new Date(Date.now() + 60_000),
      });

      const result = await webSocketTicketService.createTicket(userId);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(WebSocketTicket.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          role: "coordinator",
        }),
      );
      expect(result.ticket).toBe(testTicket);
    });
  });

  describe("consumeTicket", () => {
    test("atomically consumes and removes valid ticket", async () => {
      WebSocketTicket.findOneAndDelete.mockResolvedValue({
        ticket: testTicket,
        userId,
        role: "citizen",
      });

      const identity = await webSocketTicketService.consumeTicket(testTicket);

      expect(WebSocketTicket.findOneAndDelete).toHaveBeenCalledWith(
        expect.objectContaining({
          ticket: testTicket,
          expiresAt: expect.objectContaining({ $gt: expect.any(Date) }),
        }),
      );
      expect(identity).toEqual({
        userId: String(userId),
        role: "citizen",
      });
    });

    test("returns null if ticket does not exist or has already been consumed", async () => {
      WebSocketTicket.findOneAndDelete.mockResolvedValue(null);

      const identity = await webSocketTicketService.consumeTicket("non-existent-ticket");

      expect(identity).toBeNull();
    });

    test("returns null for invalid or empty ticket strings", async () => {
      expect(await webSocketTicketService.consumeTicket("")).toBeNull();
      expect(await webSocketTicketService.consumeTicket(null)).toBeNull();
      expect(await webSocketTicketService.consumeTicket(undefined)).toBeNull();
      expect(WebSocketTicket.findOneAndDelete).not.toHaveBeenCalled();
    });
  });
});
