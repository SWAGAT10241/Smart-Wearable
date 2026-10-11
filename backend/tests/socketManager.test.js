const http = require("http");
const WebSocket = require("ws");
const mockConsumeTicket = jest.fn();

jest.mock("../services/webSocketTicketService", () => ({
  consumeTicket: mockConsumeTicket,
}));

const { clients, broadcast, sanitizeMessage } = require("../realtime/socketManager");
const { initWebSocket } = require("../realtime/socketManager");

describe("socketManager privacy boundaries", () => {
  afterEach(() => {
    clients.clear();
  });

  test("sends allowlisted live data only to the matching authenticated user", () => {
    const ownerSocket = {
      userId: "user-a",
      readyState: 1,
      OPEN: 1,
      send: jest.fn(),
    };
    const otherSocket = {
      userId: "user-b",
      readyState: 1,
      OPEN: 1,
      send: jest.fn(),
    };
    clients.add(ownerSocket);
    clients.add(otherSocket);

    broadcast({
      type: "vitals",
      userId: "user-a",
      deviceId: "DEVICE-A",
      data: {
        heartRate: 80,
        spo2: 98,
        timestamp: "2026-10-11T10:00:00.000Z",
        userId: "user-a",
        irSamples: [1, 2, 3],
      },
    });

    expect(ownerSocket.send).toHaveBeenCalledTimes(1);
    expect(otherSocket.send).not.toHaveBeenCalled();
    expect(JSON.parse(ownerSocket.send.mock.calls[0][0])).toEqual({
      type: "vitals",
      deviceId: "DEVICE-A",
      data: {
        heartRate: 80,
        spo2: 98,
        timestamp: "2026-10-11T10:00:00.000Z",
      },
    });
  });

  test("drops unknown events and messages without an owner identity", () => {
    expect(sanitizeMessage({ type: "vitals", data: { heartRate: 80 } })).toBeNull();
    expect(
      sanitizeMessage({ type: "unexpected", userId: "user-a", data: { secret: "value" } }),
    ).toBeNull();
  });

  test("rejects missing tickets and binds accepted connections to ticket identity", async () => {
    const server = http.createServer();
    const webSocketServer = initWebSocket(server);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    const url = `ws://127.0.0.1:${address.port}/live`;

    try {
      mockConsumeTicket.mockResolvedValueOnce("user-a");
      const rejectedClient = new WebSocket(url);
      const rejection = await new Promise((resolve) => {
        rejectedClient.once("unexpected-response", (request, response) => {
          response.resume();
          resolve(response.statusCode);
        });
      });
      expect(rejection).toBe(401);

      const acceptedClient = new WebSocket(url, [
        "trailguard",
        "ticket.single-use-ticket",
      ]);
      await new Promise((resolve, reject) => {
        acceptedClient.once("open", resolve);
        acceptedClient.once("error", reject);
      });
      expect([...clients].some((client) => client.userId === "user-a")).toBe(true);
      expect(mockConsumeTicket).toHaveBeenCalledWith("single-use-ticket");
      acceptedClient.close();
      await new Promise((resolve) => acceptedClient.once("close", resolve));
    } finally {
      await new Promise((resolve) => webSocketServer.close(resolve));
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
