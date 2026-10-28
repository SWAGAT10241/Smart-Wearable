# Day 6 — Privacy, Security, Authorization & Audit Logging

**Status:** Implementation Complete  
**Scope:** SWAAS Backend, Rescue Web Dashboard, Security Audit Trails, Ephemeral Retention, and Error Hardening  
**Parent Issue:** [#63 (Day 6 — Privacy, Security & Authorization)](https://github.com/SWAGAT10241/Smart-Wearable/issues/63)  

---

## 1. Objective and Invariants

Day 6 establishes the final layer of defense-in-depth security, strict local-first privacy controls, fail-closed access auditing, and redaction protocols for SWAAS / TrailGuard.

### Key Invariants:
1. **Fail-Closed Security Audit Logging**:
   - Access to sensitive citizen health data (`GET /api/emergency/sessions/:sessionId/historical`) requires writing an immutable security record to `AuditLog` **prior** to querying database collections.
   - If writing the audit record fails for any reason, the request immediately terminates with HTTP 500 (`AUDIT_FAILURE`), returning zero health or location data.
2. **Strict 6-Hour Emergency Data Bounding**:
   - Responders and rescue coordinators can only access telemetry recorded within a 6-hour window (the emergency event plus at most the preceding 6 hours).
   - Responses are strictly capped at 100 readings per sensor type (`vitals`, `environment`, `locations`, `falls`) to prevent denial-of-service and mass data extraction.
3. **Responder Role Validation**:
   - Emergency responder assignments (`POST /api/emergency/sessions/:sessionId/responders`) must verify that the assigned target user account holds an authorized `responder`, `coordinator`, or `admin` role. Ordinary citizens cannot be granted responder data privileges.
4. **Structured Redacted Logging**:
   - Application runtime logs emit structured messages with automated recursive sanitization.
   - Critical secrets, JWTs, pairing challenge nonces, digital signatures, GPS coordinates (`latitude`, `longitude`), vitals readings (`heartRate`, `spo2`), and personal phone numbers are unconditionally replaced with `[REDACTED]`.
5. **Information Leakage Prevention**:
   - API error responses in production never leak internal database schema paths, query criteria, or stack traces. CastErrors and MongoDB driver anomalies are mapped to generic client error messages.

---

## 2. Security & Trust Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       SWAAS Rescue Web                      │
│                  (Authenticated Responder)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS (Bearer JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Router                     │
│               (Rate Limiting + JWT Protect)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            emergencySessionService.getHistoricalData        │
├─────────────────────────────────────────────────────────────┤
│ 1. Verify Active Session Status (active / escalated)        │
│ 2. Verify Caller Role & Assignment (responder/coord)        │
│ 3. Fail-Closed Security Audit Write:                        │
│    • Target: EmergencySession:UUID                          │
│    • Actor: userId, role, IP, User-Agent                    │
│    • [If write fails] ──> Abort (500 AUDIT_FAILURE)         │
│ 4. Bound Historical Query Window:                           │
│    • [windowStart = session.windowStart (now - 6h)]         │
│    • [windowEnd = now]                                      │
│ 5. Read Sanitized Projections (max 100 per type):           │
│    • VitalsReading: { heartRate, spo2, timestamp }          │
│    • EnvironmentReading: { temp, humidity, pressure, time } │
│    • LocationReading: { latitude, longitude, timestamp }    │
│    • FallEvent: { severity, status, lat, long, timestamp }  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
                     Authorized Response
```

---

## 3. Data Protection Specification

### 3.1 Historical Replay Authorization Matrix

| Caller Identity | Session Relationship | Access Result | Audit Action |
| :--- | :--- | :---: | :--- |
| Unauthenticated | N/A | `401 Unauthorized` | Rejected before service |
| Citizen (Victim Owner) | Owner | `403 Forbidden` | Citizens view live summary; replay is rescue-only |
| Citizen (Stranger) | None | `403 Forbidden` | Access denied |
| Unassigned Responder | None | `403 Forbidden` | Responders only access assigned sessions |
| Assigned Responder | In `activeResponders` | `200 OK` | `HISTORICAL_VITALS_REQUESTED` (Audited) |
| Rescue Coordinator | Incident Commander | `200 OK` | `HISTORICAL_VITALS_REQUESTED` (Audited) |
| System Admin | Root | `200 OK` | `HISTORICAL_VITALS_REQUESTED` (Audited) |

### 3.2 Ephemeral Data Retention Rules
- **`EmergencySession`**: Preserved for 48 hours following creation/resolution via MongoDB TTL index on `expiresAt` (`expireAfterSeconds: 0`).
- **`WebSocketTicket`**: Preserved for 60 seconds from generation; atomically consumed via `findOneAndUpdate` on upgrade.
- **`DeviceAuthNonce`**: Preserved for ±5 minutes from timestamp via TTL index to block replay attacks.
- **`AuditLog`**: Permanent, append-only security journal for compliance and incident analysis.

---

## 4. Structured Redacted Logging

The backend utilizes `backend/utils/logger.js` to protect user privacy:

- **Production Mode (`NODE_ENV === "production"`)**:
  Emits single-line JSON with `timestamp`, `level`, `message`, and sanitized `details`:
  ```json
  {"timestamp":"2026-10-28T21:20:00.000Z","level":"INFO","message":"Emergency location updated","details":[{"sessionId":"...","location":{"latitude":"[REDACTED]","longitude":"[REDACTED]"}}]}
  ```
- **Development Mode**:
  Emits human-readable logs with timestamps and scrubbed objects.
- **Test Mode (`NODE_ENV === "test"`)**:
  Suppresses output unless `DEBUG=true` to keep CI test suites fast and readable.

### Sanitized Key Patterns:
- Passwords (`password`, `pass`)
- Authentication tokens (`token`, `secret`, `jwt`, `ticket`, `bearer`)
- Cryptographic keys (`privateKey`, `bootstrapToken`, `nonce`, `signature`)
- Vital statistics (`heartRate`, `spo2`)
- Geolocation (`latitude`, `longitude`, `coordinate`)
- Personal identifiers (`phoneNumber`, `contactPhone`)

---

## 5. Security Verification & Test Results

Day 6 verification confirms 100% compliance across all system security layers:

```text
Test Suites: 10 passed, 10 total
Tests:       108 passed, 108 total
Snapshots:   0 total
Time:        1.904 s
```

### Verified Test Suites:
1. `tests/securityHardening.test.js` — Fail-closed auditing, responder role validation, structured logger redaction.
2. `tests/server.test.js` — Core API routing, root status, environment configuration.
3. `tests/auth.test.js` — JWT issuance, password hashing, user registration and login.
4. `tests/deviceAuth.test.js` — Ed25519 signature verification, timestamp skew enforcement, rawBody hashing, anti-replay nonces.
5. `tests/deviceProvisioning.test.js` — Expiring pairing challenges, single-use bootstrap tokens, atomic state transitions.
6. `tests/emergencyModels.test.js` — Mongoose schemas, UUIDv4 identifiers, compound unique indexes, TTL expirations.
7. `tests/emergencySessionApi.test.js` — Full REST API test suite for emergency session creation, location updates, status transitions, and audit records.
8. `tests/rateLimiter.test.js` — Centralized brute-force protection across authentication, device pairing, and telemetry endpoints.
9. `tests/socketManager.test.js` — Authenticated WebSocket upgrade, single-use ticket consumption, session-scoped event routing.
10. `tests/webSocketTicketService.test.js` — Ephemeral ticket generation, atomic consumption, TTL expiration.

---

## 6. Day 6 Exit Criteria Checklist

- [x] Fail-closed security audit logging implemented for all sensitive emergency data reads (`emergencySessionService.js`).
- [x] Responder assignment restricts privileges strictly to authorized `responder`, `coordinator`, and `admin` roles.
- [x] Centralized structured logger with automatic recursion and sensitive data redaction (`utils/logger.js`).
- [x] Production error handling hardened against CastError path leakage and internal database disclosures (`middleware/errorHandler.js`).
- [x] Dedicated security hardening test suite passing (`backend/tests/securityHardening.test.js`).
- [x] Comprehensive AI Agent guidelines published (`AGENTS.md`).
- [x] Complete architecture diagram documented and cross-linked (`arc.md`).
- [x] All 108 backend tests, 23 frontend tests, and mobile syntax validation passing cleanly.

