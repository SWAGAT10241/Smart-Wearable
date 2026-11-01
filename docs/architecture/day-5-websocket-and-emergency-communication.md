# Day 5 — WebSocket & Emergency Communication

**Status:** Implementation Complete  
**Scope:** SWAAS Backend, Real-Time Emergency Messaging, WebSocket Authentication, Session-Scoped Subscriptions, Rescue Web Integration  
**Parent Issue:** [#62 (Day 5 — WebSocket & Emergency Communication)](https://github.com/SWAGAT10241/Smart-Wearable/issues/62)

---

## 1. Objective and Invariants

Day 5 implements the real-time communication architecture required by SWAAS for active emergency sessions, bridging the backend emergency manager with the SWAAS Rescue Web.

### Key Invariants:
1. **Replacement of Legacy Global Broadcast**:
   - The legacy unauthenticated global broadcast mechanism (`clients = new Set()`) is deprecated and eliminated from emergency communication paths.
   - Emergency data communication strictly enforces the five-stage pipeline:
     ```text
     Authentication ──> Authorization ──> Session Subscription ──> Scoped Broadcast ──> Authorized Clients Only
     ```
2. **Local-First Privacy Compliance**:
   - Routine wearable sensor data remains strictly local to the user app during normal conditions.
   - Emergency telemetry is shared only during an active emergency session and bounded to the emergency event plus the preceding 6 hours.
3. **Session-Scoped Real-Time Delivery**:
   - Emergency updates (live location, risk assessments, responder joining, status transitions) are delivered only to clients who are subscribed to that specific `sessionId` and authorized rescue coordinators.
4. **Single-Use WebSocket Tickets**:
   - Browsers connecting via WebSocket obtain an ephemeral single-use ticket via `POST /api/emergency/ws-ticket` (or `POST /api/auth/ws-ticket`), consumed atomically during the HTTP upgrade handshake via `Sec-WebSocket-Protocol: trailguard, ticket.<ticket>`.
   - Expired or consumed tickets are automatically purged via MongoDB TTL indexes.

---

## 2. Target Architecture

```text
┌─────────────────────┐
│   SWAAS Wearable    │
│  (Sensors + BLE)    │
└──────────┬──────────┘
           │ BLE Stream
           ▼
┌─────────────────────┐
│    SWAAS User App   │
│  • Local 7-Day DB   │
│  • Edge Risk Engine │
│  • Emergency Trigger│
└──────────┬──────────┘
           │ Emergency Payload
           │ (Current + Last 6h)
           ▼
┌─────────────────────────────────────────────────────────────┐
│                        SWAAS Backend                        │
├──────────────────────────────┬──────────────────────────────┤
│          REST APIs           │       WebSocket Server       │
│  • /api/emergency/sessions   │  • Authenticated /live route │
│  • /api/emergency/ws-ticket  │  • Ticket consumption        │
│  • Status / Location / Risk  │  • Session-scoped routing    │
│  • Responders / Audit        │  • Feed subscriptions        │
└──────────┬───────────────────┴──────────────┬───────────────┘
           │                                  │ Session-Scoped
           │ REST                             │ WebSocket
           ▼                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      SWAAS Rescue Web                       │
│  • Active Emergency Map & Live Responder Dashboard          │
│  • Real-Time Location & Risk Assessment Feeds               │
│  • Coordinated Dispatch & Emergency Closure                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Real-Time Protocol Specification

### 3.1 Connection Handshake
1. Client requests an ephemeral ticket:
   - `POST /api/emergency/ws-ticket` with `Authorization: Bearer <jwt>`
   - Response: `{ "ticket": "<32-byte-hex>", "expiresIn": 60 }`
2. Client initiates WebSocket connection:
   - Protocol negotiation: `new WebSocket(WS_URL, ["trailguard", `ticket.${ticket}`])`
   - Alternatively: `new WebSocket(`${WS_URL}?ticket=${ticket}`)` or query parameter token.
3. Server validates and consumes ticket atomically:
   - Unauthenticated or unauthorized connection requests are rejected with `HTTP 401 Unauthorized`.
   - Unauthorized origins are rejected with `HTTP 403 Forbidden`.

### 3.2 Client-to-Server Actions

| Action | Payload Example | Description |
| :--- | :--- | :--- |
| `subscribe` | `{"action": "subscribe", "sessionId": "<uuid>"}` | Subscribe to an active emergency session. Verified against user role and session assignment. |
| `unsubscribe` | `{"action": "unsubscribe", "sessionId": "<uuid>"}` | Unsubscribe from session updates. |
| `subscribe_feed` | `{"action": "subscribe_feed"}` | Subscribe to system-wide emergency alerts. Restricted to `responder`, `coordinator`, and `admin` roles. |
| `ping` | `{"action": "ping"}` | Heartbeat request; server replies with `{"type": "pong", "timestamp": "..."}`. |

### 3.3 Server-to-Client Broadcast Events

| Event Type | Destination Scope | Description |
| :--- | :--- | :--- |
| `emergency_session_created` | Feed subscribers (`coordinator`, `responder`, `admin`) | Alert responders of a newly created emergency session. |
| `emergency_status_update` | Session subscribers (`sessionId`) | Status transition (`active`, `escalated`, `resolved`, `cancelled`). |
| `emergency_location_update` | Session subscribers (`sessionId`) | Real-time GPS location updates from mobile device / wearable. |
| `emergency_risk_update` | Session subscribers (`sessionId`) | Real-time confidence score and risk classification update. |
| `emergency_responder_update` | Session subscribers (`sessionId`) | Notification when a responder joins or is assigned to the session. |
| `vitals` / `environment` / `location` / `fall` | Device owner (`userId`) only | Routine telemetry is never broadcast globally; delivered strictly to authenticated owner. |

---

## 4. Emergency REST API Specification

| Endpoint | Method | Role / Permission | Description |
| :--- | :--- | :--- | :--- |
| `/api/emergency/ws-ticket` | `POST` | `ws:ticket` | Generate single-use authenticated WebSocket ticket (60s TTL). |
| `/api/emergency/sessions` | `POST` | `emergency:create` | Initiate a new emergency session with initial location and trigger type. |
| `/api/emergency/sessions/active` | `GET` | Authenticated | List active/escalated sessions (citizens see own; rescue staff see all). |
| `/api/emergency/sessions/:sessionId` | `GET` | Authenticated | Retrieve emergency session details (authorized participants only). |
| `/api/emergency/sessions/:sessionId/status` | `PATCH` | Authenticated | Update status (`escalated`, `resolved`, `cancelled`). |
| `/api/emergency/sessions/:sessionId/location` | `POST` | Authenticated | Push live GPS updates during an active emergency session. |
| `/api/emergency/sessions/:sessionId/risk` | `POST` | Authenticated | Push updated risk assessment during an emergency session. |
| `/api/emergency/sessions/:sessionId/responders` | `POST` | Authenticated | Assign responder (coordinators/admins) or self-join (responders). |
| `/api/emergency/sessions/:sessionId/audit` | `GET` | `emergency:audit:read` | Inspect immutable security audit trail for this emergency session. |
| `/api/emergency/sessions/:sessionId/historical` | `GET` | Assigned responder / Coord | Access bounded 6-hour historical telemetry replay. |

---

## 5. Security and Privacy Guarantees

- **Guaranteed Ephemeral Retention**: `EmergencySession` documents expire via MongoDB TTL index (`expiresAt`, default 48h after resolution/creation).
- **Zero Raw Data Leakage**: Routine telemetry and raw health data are never sent to unauthenticated or unauthorized clients.
- **Strict Role-Based Access Control**: Responders only access assigned emergency incidents; coordinators monitor active jurisdiction; citizens manage only their own sessions.
- **Fail-Closed Audit Logging**: Every session creation, status change, responder assignment, and historical data access is recorded in `AuditLog` before processing.

---

## 6. Verification and Acceptance Checklist

- [x] Ephemeral single-use WebSocket tickets implemented (`backend/models/WebSocketTicket.js`, `backend/services/webSocketTicketService.js`)
- [x] Authenticated, session-scoped WebSocket server implemented (`backend/realtime/socketManager.js`)
- [x] Legacy global broadcast replaced with user-scoped telemetry and session-scoped emergency dispatch
- [x] Emergency Session REST endpoints and business service implemented (`backend/routes/emergencyRoutes.js`, `backend/services/emergencySessionService.js`)
- [x] RBAC permission mapping updated (`backend/config/permissions.js`)
- [x] Security audit logging integrated for all emergency actions (`backend/models/AuditLog.js`)
- [x] Frontend API client and live context updated for authenticated WebSocket connections (`frontend/src/lib/apiClient.js`, `frontend/src/context/LiveDataContext.jsx`)
- [x] Full unit and integration test suites passing (104 backend tests passing across 9 test suites; 23 frontend tests passing)
- [x] Frontend production build verified cleanly with Vite
- [x] Mobile app syntax and configuration verified (`npm run check:syntax`)
