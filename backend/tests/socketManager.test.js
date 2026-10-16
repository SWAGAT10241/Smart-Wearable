process.env.NODE_ENV = "test";

const EventEmitter = require("events");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const socketManager = require("../realtime/socketManager");
const webSocketTicketService = require("../services/webSocketTicketService");
const EmergencySession = require("../models/EmergencySession");

jest.mock("../services/webSocketTicketService");
jest.mock("../models/EmergencySession");

const { PassThrough } = require("stream");

describe("socketManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    socketManager.clients.clear();
  });

  describe("authorizeSessionSubscription", () => {
    test("authorizes admin and coordinator regardless of session assignment", async () => {
      const adminAuth = await socketManager.authorizeSessionSubscription("user-1", "admin", "session-123");
      const coordAuth = await socketManager.authorizeSessionSubscription("user-2", "coordinator", "session-123");

      expect(adminAuth).toBe(true);
      expect(coordAuth).toBe(true);
      expect(EmergencySession.findOne).not.toHaveBeenCalled();
    });

    test("authorizes citizen if session owner matches userId", async () => {
      EmergencySession.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          userId: "citizen-1",
          activeResponders: [],
        }),
      });

      const isAuth = await socketManager.authorizeSessionSubscription("citizen-1", "citizen", "session-123");
      expect(isAuth).toBe(true);
    });

    test("rejects citizen if session owner does not match", async () => {
      EmergencySession.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          userId: "citizen-2",
          activeResponders: [],
        }),
      });

      const isAuth = await socketManager.authorizeSessionSubscription("citizen-1", "citizen", "session-123");
      expect(isAuth).toBe(false);
    });

    test("authorizes responder when assigned in activeResponders", async () => {
      EmergencySession.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          userId: "citizen-2",
          activeResponders: [{ responderId: "responder-1" }],
        }),
      });

      const isAuth = await socketManager.authorizeSessionSubscription("responder-1", "responder", "session-123");
      expect(isAuth).toBe(true);
    });

    test("rejects responder when not assigned in activeResponders", async () => {
      EmergencySession.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          userId: "citizen-2",
          activeResponders: [{ responderId: "responder-9" }],
        }),
      });

      const isAuth = await socketManager.authorizeSessionSubscription("responder-1", "responder", "session-123");
      expect(isAuth).toBe(false);
    });

    test("returns false when session is not found or error occurs", async () => {
      EmergencySession.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      expect(await socketManager.authorizeSessionSubscription("u1", "citizen", "unknown-session")).toBe(false);
      expect(await socketManager.authorizeSessionSubscription("u1", "citizen", "")).toBe(false);
    });
  });

  describe("broadcastEmergencyEvent", () => {
    test("delivers emergency events strictly to subscribed clients and emergency feed listeners", () => {
      const client1 = {
        OPEN: 1,
        readyState: 1,
        subscriptions: new Set(["session-A"]),
        subscribedToEmergencyFeed: false,
        send: jest.fn(),
      };

      const client2 = {
        OPEN: 1,
        readyState: 1,
        subscriptions: new Set(["session-B"]),
        subscribedToEmergencyFeed: false,
        send: jest.fn(),
      };

      const rescueFeedClient = {
        OPEN: 1,
        readyState: 1,
        subscriptions: new Set(),
        subscribedToEmergencyFeed: true,
        send: jest.fn(),
      };

      socketManager.clients.add(client1);
      socketManager.clients.add(client2);
      socketManager.clients.add(rescueFeedClient);

      socketManager.broadcastEmergencyEvent("session-A", "emergency_location_update", {
        latitude: 20.2961,
        longitude: 85.8245,
      });

      expect(client1.send).toHaveBeenCalledTimes(1);
      const parsed1 = JSON.parse(client1.send.mock.calls[0][0]);
      expect(parsed1.type).toBe("emergency_location_update");
      expect(parsed1.sessionId).toBe("session-A");
      expect(parsed1.data.latitude).toBe(20.2961);

      // Client 2 was only subscribed to session-B; should receive nothing
      expect(client2.send).not.toHaveBeenCalled();

      // Rescue feed listener receives all emergency updates
      expect(rescueFeedClient.send).toHaveBeenCalledTimes(1);
    });
  });

  describe("broadcastTelemetry", () => {
    test("delivers telemetry strictly to the authenticated device owner", () => {
      const ownerClient = {
        OPEN: 1,
        readyState: 1,
        userId: "user-owner",
        send: jest.fn(),
      };

      const otherClient = {
        OPEN: 1,
        readyState: 1,
        userId: "user-stranger",
        send: jest.fn(),
      };

      socketManager.clients.add(ownerClient);
      socketManager.clients.add(otherClient);

      socketManager.broadcastTelemetry({
        type: "vitals",
        userId: "user-owner",
        deviceId: "TG-123",
        data: {
          heartRate: 75,
          spo2: 98,
          timestamp: new Date().toISOString(),
          secretInternalField: "should_be_omitted",
        },
      });

      expect(ownerClient.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(ownerClient.send.mock.calls[0][0]);
      expect(payload.type).toBe("vitals");
      expect(payload.data.heartRate).toBe(75);
      expect(payload.data.spo2).toBe(98);
      expect(payload.data.secretInternalField).toBeUndefined();

      expect(otherClient.send).not.toHaveBeenCalled();
    });
  });

  describe("initWebSocket upgrade authentication", () => {
    let mockServer;
    let mockSocket;

    beforeEach(() => {
      mockServer = new EventEmitter();
      mockSocket = new PassThrough();
      mockSocket.destroy = jest.fn();
      mockSocket.write = jest.fn();
      socketManager.initWebSocket(mockServer);
    });

    test("rejects upgrade when request path is not /live", () => {
      const req = { url: "/other-path", headers: {} };
      mockServer.emit("upgrade", req, mockSocket, Buffer.alloc(0));

      expect(mockSocket.write).not.toHaveBeenCalled();
      expect(mockSocket.destroy).not.toHaveBeenCalled();
    });

    test("rejects upgrade with 401 when no ticket or token is provided", async () => {
      const req = {
        url: "/live",
        headers: {},
      };

      mockServer.emit("upgrade", req, mockSocket, Buffer.alloc(0));
      await new Promise((resolve) => setImmediate(resolve));

      expect(mockSocket.write).toHaveBeenCalledWith(
        expect.stringContaining("HTTP/1.1 401 Unauthorized"),
      );
      expect(mockSocket.destroy).toHaveBeenCalled();
    });

    test("authenticates upgrade using Sec-WebSocket-Protocol ticket", async () => {
      webSocketTicketService.consumeTicket.mockResolvedValue({
        userId: "user-123",
        role: "responder",
      });

      const req = {
        url: "/live",
        headers: {
          "sec-websocket-protocol": "trailguard, ticket.valid-ticket-string",
        },
      };

      mockServer.emit("upgrade", req, mockSocket, Buffer.alloc(0));
      await new Promise((resolve) => setImmediate(resolve));

      expect(webSocketTicketService.consumeTicket).toHaveBeenCalledWith("valid-ticket-string");
      expect(mockSocket.write).not.toHaveBeenCalledWith(expect.stringContaining("401"));
    });

    test("authenticates upgrade using query param ticket", async () => {
      webSocketTicketService.consumeTicket.mockResolvedValue({
        userId: "user-456",
        role: "citizen",
      });

      const req = {
        url: "/live?ticket=query-ticket-123",
        headers: {},
      };

      mockServer.emit("upgrade", req, mockSocket, Buffer.alloc(0));
      await new Promise((resolve) => setImmediate(resolve));

      expect(webSocketTicketService.consumeTicket).toHaveBeenCalledWith("query-ticket-123");
      expect(mockSocket.write).not.toHaveBeenCalledWith(expect.stringContaining("401"));
    });

    test("authenticates upgrade using valid JWT query parameter", async () => {
      const testToken = jwt.sign(
        { id: "jwt-user-789", role: "coordinator" },
        config.jwtSecret,
      );

      const req = {
        url: `/live?token=${testToken}`,
        headers: {},
      };

      mockServer.emit("upgrade", req, mockSocket, Buffer.alloc(0));
      await new Promise((resolve) => setImmediate(resolve));

      expect(mockSocket.write).not.toHaveBeenCalledWith(expect.stringContaining("401"));
    });
  });
});
