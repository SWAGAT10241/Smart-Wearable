# Day 4 — Risk & Emergency Models

**Status:** Implementation Complete  
**Scope:** SWAAS / TrailGuard Wearable, Mobile Companion, Backend API, and Rescue Dashboard  
**Parent Issue:** [#61 (Day 4 — Risk & Emergency Models)](https://github.com/SWAGAT10241/Smart-Wearable/issues/61)

---

## 1. Objective and Invariants

Day 4 establishes the data models and backend logic required for risk detection, ephemeral emergency session handling, and access auditing.

### Key Invariants:
1. **Separation of Risk vs Emergency**: The system must NOT treat every sensor anomaly or potential fall as an emergency.
   - Stage 1: Continuous local sensor evaluation on device.
   - Stage 2: Anomaly / Possible Fall logged in `RiskAssessment` with confidence score.
   - Stage 3: Confirmed Emergency (via manual SOS button or uncancelled fall timer) triggers an `EmergencySession`.
2. **Ephemeral Data Retention**: All emergency sessions are temporary. A MongoDB TTL index on `expiresAt` automatically purges resolved or expired emergency records after 48 hours.
3. **Opaque Identifiers**: `EmergencySession` exposes an opaque UUID `sessionId`. Internal database `_id` values are never exposed in public routes to prevent enumeration attacks.
4. **Local-First Privacy**: Normal health and location telemetry resides exclusively on the user's mobile device (7-day rolling window). Telemetry is only shared with the backend when an authorized emergency session is active, bounded to the emergency plus the preceding 6 hours.

---

## 2. Risk Engine Architecture

```text
┌─────────────────────┐
│   SWAAS Wearable    │
│  (Sensors + BLE)    │
└──────────┬──────────┘
           │ BLE Stream
           ▼
┌─────────────────────┐
│   SWAAS User App    │
│  (Local DB + ML)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Risk Engine     │
├─────────────────────┤
│  • Normal           │
│  • Low Risk         │
│  • Medium Risk      │
│  • High Risk        │
│  • Possible Fall    │
└──────────┬──────────┘
           │
           ├── [No Emergency] ──> Remains in local app storage
           │
           └── [Emergency Confirmed] (Manual SOS / Fall countdown timeout)
                   │
                   ▼
         ┌───────────────────┐
         │ Emergency Session │
         │  • Current State  │
         │  • Last 6 Hours   │
         └─────────┬─────────┘
                   │
                   ▼
         ┌───────────────────┐
         │   SWAAS Backend   │
         │ (TTL 48h Cleanup) │
         └─────────┬─────────┘
                   │
                   ▼
         ┌───────────────────┐
         │ Rescue Dashboard  │
         │(Authorized Responders)
         └───────────────────┘
```

---

## 3. Data Models Specification

### 3.1 `EmergencySession` (`backend/models/EmergencySession.js`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `sessionId` | String (UUIDv4) | Public opaque session identifier (indexed, unique) |
| `userId` | ObjectId | Reference to `User` |
| `deviceId` | String | Unique hardware device identity |
| `triggerType` | Enum | `manual_sos`, `fall_confirmed`, `vitals_critical`, `panic_button` |
| `status` | Enum | `active`, `escalated`, `resolved`, `cancelled`, `expired` |
| `location` | Object | `{ latitude, longitude, accuracy, altitude, recordedAt }` |
| `vitalsSummary` | Object | `{ heartRate, spo2, temperature, batteryLevel }` |
| `historicalWindowStart` | Date | Anchor timestamp 6 hours prior to trigger |
| `activeResponders` | Array | `[{ responderId, joinedAt, accessExpiresAt }]` |
| `expiresAt` | Date | Ephemeral expiration date with MongoDB TTL index (`expireAfterSeconds: 0`) |

### 3.2 `RiskAssessment` (`backend/models/RiskAssessment.js`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `assessmentId` | String (UUIDv4) | Public opaque assessment identifier |
| `deviceId` | String | Hardware device identity |
| `riskLevel` | Enum | `normal`, `low`, `medium`, `high`, `critical` |
| `category` | Enum | `vitals_anomaly`, `possible_fall`, `environmental_hazard`, `inactivity`, `manual_concern` |
| `confidenceScore` | Number | Confidence value between `0.0` and `1.0` |
| `isEmergencyConfirmed` | Boolean | `false` for raw anomalies; `true` only if verified |
| `emergencySessionId` | String | Reference to `EmergencySession.sessionId` when confirmed |
| `sensorSnapshot` | Object | Sensor readings at evaluation time |

### 3.3 `AuditLog` (`backend/models/AuditLog.js`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `auditId` | String (UUIDv4) | Unique audit identifier |
| `actorId` | ObjectId | Actor performing the sensitive action |
| `actorRole` | Enum | `citizen`, `responder`, `coordinator`, `admin`, `system` |
| `action` | Enum | `EMERGENCY_SESSION_ACCESSED`, `DEVICE_CLAIMED`, `EMERGENCY_SESSION_RESOLVED`, etc. |
| `targetResource` | String | Resource identifier (e.g. `EmergencySession:<sessionId>`) |
| `timestamp` | Date | Immutable record timestamp |

---

## 4. Verification and Acceptance Checklist

- [x] Implementation exists in repository (`EmergencySession.js`, `RiskAssessment.js`, `AuditLog.js`)
- [x] Request payload validation middleware implemented (`backend/middleware/validate.js`)
- [x] Unit test suite implemented and passing (`backend/tests/emergencyModels.test.js`)
- [x] Docker orchestration configured (`docker-compose.yml`, Dockerfiles, Nginx)
- [x] Mobile configuration updated with permissions (`mobile/app.json`, `mobile/eas.json`)
- [x] Team contributing and issue guidelines updated (`CONTRIBUTING.md`, templates)
