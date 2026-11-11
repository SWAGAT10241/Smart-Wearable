process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const {
  createTicket,
  consumeTicket,
} = require("../services/webSocketTicketService");
const WebSocketTicket = require("../models/WebSocketTicket");
const User = require("../models/User");

jest.mock("../models/WebSocketTicket");
jest.mock("../models/User");

describe("Concurrency, Bottleneck & Race Condition Guards", () => {
  const dummyUserId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("atomic consumption: 50 concurrent requests for same ticket resolve with exactly 1 success", async () => {
    let ticketConsumed = false;
    const testTicket = "deadlock_prevention_test_ticket_001";

    WebSocketTicket.create.mockResolvedValue({
      ticket: testTicket,
      userId: dummyUserId,
      role: "responder",
      expiresAt: new Date(Date.now() + 60000),
    });

    // Mock atomic findOneAndDelete: only the first call gets the document, subsequent calls get null
    WebSocketTicket.findOneAndDelete.mockImplementation(async (query) => {
      if (query.ticket === testTicket && !ticketConsumed) {
        ticketConsumed = true;
        return {
          ticket: testTicket,
          userId: dummyUserId,
          role: "responder",
          expiresAt: new Date(Date.now() + 60000),
        };
      }
      return null;
    });

    const { ticket } = await createTicket(dummyUserId, "responder");

    // Launch 50 simultaneous consumption attempts
    const concurrentAttempts = Array.from({ length: 50 }, () =>
      consumeTicket(ticket)
    );

    const results = await Promise.all(concurrentAttempts);

    // Exactly one attempt must return user data, all 49 others must return null
    const successes = results.filter((res) => res !== null);
    const failures = results.filter((res) => res === null);

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(49);
    expect(successes[0].userId.toString()).toBe(dummyUserId.toString());
    expect(successes[0].role).toBe("responder");
  });

  test("throughput & deadlock resistance: 100 parallel ticket issuances complete without starvation", async () => {
    const userIds = Array.from({ length: 100 }, () => new mongoose.Types.ObjectId());

    WebSocketTicket.create.mockImplementation(async (doc) => ({
      ...doc,
      _id: new mongoose.Types.ObjectId(),
    }));

    const start = Date.now();
    const ticketPromises = userIds.map((uid) => createTicket(uid, "citizen"));
    const createdTickets = await Promise.all(ticketPromises);
    const duration = Date.now() - start;

    expect(createdTickets).toHaveLength(100);
    // Ensure all tickets are unique (no collisions)
    const uniqueTickets = new Set(createdTickets.map((t) => t.ticket));
    expect(uniqueTickets.size).toBe(100);

    // Must finish quickly without deadlocking
    expect(duration).toBeLessThan(1000);
  });

  test("outlier handling: malformed, null, or SQL-like payloads fail safely without unhandled crashes", async () => {
    const malformedInputs = [
      null,
      undefined,
      "",
      "   ",
      12345,
      {},
      [],
      "' OR 1=1 --",
      "{\"ticket\": {\"$ne\": null}}",
    ];

    for (const input of malformedInputs) {
      const result = await consumeTicket(input);
      expect(result).toBeNull();
    }
  });
});
