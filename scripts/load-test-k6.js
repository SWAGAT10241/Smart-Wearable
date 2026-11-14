import http from "k6/http";
import ws from "k6/ws";
import { check, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

// Custom metrics for TrailGuard architecture
const wsConnectionSuccess = new Rate("ws_connection_success");
const wsMessagesReceived = new Counter("ws_messages_received");
const ticketFetchDuration = new Trend("ticket_fetch_duration");

const BASE_HTTP_URL = __ENV.API_URL || "http://localhost:5000";
const BASE_WS_URL = __ENV.WS_URL || "ws://localhost:5000";

export const options = {
  scenarios: {
    // 1. High-throughput REST API load
    api_throughput: {
      executor: "ramping-vus",
      startVUs: 5,
      stages: [
        { duration: "20s", target: 30 }, // Ramp up to 30 concurrent users
        { duration: "40s", target: 50 }, // Sustained stress at 50 users
        { duration: "10s", target: 0 },  // Cool down
      ],
      gracefulRampDown: "5s",
      exec: "testRestApi",
    },

    // 2. Real-time Emergency WebSocket stress testing
    websocket_sessions: {
      executor: "ramping-vus",
      startVUs: 2,
      stages: [
        { duration: "15s", target: 10 }, // Ramp up to 10 active WebSocket streams
        { duration: "30s", target: 25 }, // Sustained load of 25 live connections
        { duration: "10s", target: 0 },  // Clean disconnect
      ],
      gracefulRampDown: "5s",
      exec: "testWebSocketFlow",
    },
  },

  thresholds: {
    // 95% of HTTP requests must complete under 250ms
    http_req_duration: ["p(95)<250"],
    // HTTP error rate must remain under 1%
    http_req_failed: ["rate<0.01"],
    // Over 95% of WebSocket connections must succeed
    ws_connection_success: ["rate>0.95"],
    // Single-use ticket generation should complete under 150ms
    ticket_fetch_duration: ["p(95)<150"],
  },
};

/**
 * SCENARIO 1: REST API Health & Telemetry Query Load
 */
export function testRestApi() {
  // Test health check endpoint
  const healthRes = http.get(`${BASE_HTTP_URL}/api/health`, {
    tags: { name: "HealthCheck" },
  });

  check(healthRes, {
    "health status is 200": (r) => r.status === 200,
    "health response is ok": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.status === "ok" || body.uptime !== undefined;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}

/**
 * SCENARIO 2: Realtime WebSocket Life-Safety Flow
 * 1. Simulates authenticated user obtaining a single-use 60s WebSocket ticket.
 * 2. Connects to /live using the single-use ticket in the Sec-WebSocket-Protocol header.
 * 3. Subscribes to the live emergency rescue feed.
 * 4. Listens for live telemetry broadcasts and verifies connection stability.
 */
export function testWebSocketFlow() {
  // Demo token for load testing (or login to get a fresh token)
  const loginPayload = JSON.stringify({
    email: __ENV.TEST_USER_EMAIL || "coordinator@trailguard.local",
    password: __ENV.TEST_USER_PASSWORD || "TestPassword123!",
  });

  const authHeaders = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Attempt login to acquire JWT
  const loginRes = http.post(`${BASE_HTTP_URL}/api/auth/login`, loginPayload, authHeaders);

  let token = null;
  if (loginRes.status === 200) {
    try {
      const parsed = JSON.parse(loginRes.body);
      token = parsed.token || (parsed.data && parsed.data.token);
    } catch {
      token = null;
    }
  }

  // If credentials are not configured in environment, test direct /live rejection behavior
  if (!token) {
    // Verify that unauthenticated WebSocket upgrade correctly fails closed (HTTP 401)
    const wsUrl = `${BASE_WS_URL}/live`;
    const response = ws.connect(wsUrl, {}, function (socket) {
      socket.on("open", () => {
        socket.close();
      });
    });

    check(response, {
      "unauthenticated ws upgrade is rejected": (r) => r && r.status === 401,
    });
    return;
  }

  // Step 1: Request single-use ticket
  const ticketStart = Date.now();
  const ticketRes = http.post(
    `${BASE_HTTP_URL}/api/emergency/ws-ticket`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  ticketFetchDuration.add(Date.now() - ticketStart);

  const ticketOk = check(ticketRes, {
    "ticket request succeeded": (r) => r.status === 200,
  });

  if (!ticketOk) {
    wsConnectionSuccess.add(false);
    return;
  }

  const ticketData = JSON.parse(ticketRes.body);
  const ticket = ticketData.ticket;

  // Step 2: Connect to /live via Sec-WebSocket-Protocol subprotocol
  const wsUrl = `${BASE_WS_URL}/live`;
  const params = {
    subprotocols: [`trailguard, ticket.${ticket}`],
  };

  const wsResponse = ws.connect(wsUrl, params, function (socket) {
    socket.on("open", () => {
      wsConnectionSuccess.add(true);

      // Subscribe to global emergency rescue feed
      socket.send(
        JSON.stringify({
          action: "subscribe_feed",
        })
      );

      // Keep socket open for 5 seconds to receive telemetry
      socket.setInterval(() => {
        socket.ping();
      }, 2000);

      socket.setTimeout(() => {
        socket.close();
      }, 5000);
    });

    socket.on("message", (data) => {
      wsMessagesReceived.add(1);
    });

    socket.on("error", (e) => {
      wsConnectionSuccess.add(false);
    });
  });

  check(wsResponse, {
    "ws connected successfully": (r) => r && r.status === 101,
  });

  sleep(1);
}
