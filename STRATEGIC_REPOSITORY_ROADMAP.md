# SWAAS / TrailGuard — Strategic Repository Roadmap & Future Milestone Architecture

**Document Version:** 2.0.0  
**Target Repository:** `SWAGAT10241/Smart-Wearable` (Branch: `SWAAS`)  
**Architecture Single Source of Truth:** [AGENTS.md](AGENTS.md)  
**Technical Architecture Plan:** [docs/POLYGLOT_ARCHITECTURE_PLAN.md](docs/POLYGLOT_ARCHITECTURE_PLAN.md)  
**Companion Security Audit:** [SECURITY_AUDIT.md](SECURITY_AUDIT.md)

---

## 1. Executive Summary & Vision

SWAAS / TrailGuard is an autonomous, mission-critical safety platform designed for lone workers, alpine hikers, and search-and-rescue teams. Having completed the **Phase 1 Foundation** (cryptographic Ed25519 device signatures, fail-closed audit logs, session-scoped WebSockets, offline basecamp PWA, and commercial 3D landing page), the project is transitioning through **Phase 2 (Mobile Local-First Buffer & Hardware Tightening)** and into **Phase 3 (Polyglot Infrastructure & Scaled Ingestion)**.

```mermaid
flowchart TD
    subgraph P1["Phase 1: Foundation (COMPLETED)"]
        P1A["Ed25519 Cryptographic Device Auth"]
        P1B["Fail-Closed Audit Logging (HTTP 500)"]
        P1C["Session-Scoped WebSockets (/live)"]
        P1D["Commercial 3D Landing & Theme Engine"]
        P1E["Basecamp PWA & Service Worker Offline Mode"]
    end

    subgraph P2["Phase 2: Local-First Core & Firmware (ACTIVE)"]
        P2A["Encrypted Local SQLite Store (7-Day Rolling Buffer)"]
        P2B["On-Device Edge Risk Engine (Freefall + Shock + Repose)"]
        P2C["BLE Auto-Recovery & MTU Optimization"]
        P2D["ESP32-S3 Flash Encryption & Secure Boot"]
    end

    subgraph P3["Phase 3: Polyglot Infrastructure & Mesh (NEXT)"]
        P3A["Go Telemetry & WebSocket Ingestion Gateway"]
        P3B["Python AI Biometric & Fall Anomaly Engine"]
        P3C["Rust Native High-Speed Ed25519 Verification Core"]
        P3D["Multi-Node LoRa Mesh Relay (15km Mountain Range)"]
    end

    subgraph P4["Phase 4: Commercial Scaling & Fleet SAR (LONG-TERM)"]
        P4A["Offline Basecamp Command Terminal"]
        P4B["Satellite Gateway Link (Iridium / InReach Fallback)"]
        P4C["Enterprise Lone-Worker OSHA Compliance API"]
    end

    P1 --> P2
    P2 --> P3
    P3 --> P4
```

---

## 2. 4-Tier Strategic Roadmap Matrix

### 📱 Tier 2: Mobile Companion Tier (Top Priority — Local-First Invariant 1)

> [!IMPORTANT]
> **Priority 1 Focus:** Currently, `HistoryScreen` fetches historical readings from cloud APIs. Under Invariant 1, continuous vitals must stay strictly local in an encrypted rolling 7-day SQLite buffer.

| Milestone | Objective | Deliverables | Target Timeline |
| :--- | :--- | :--- | :--- |
| **M2.1: Encrypted Local SQLite Buffer** | Implement rolling 7-day telemetry buffer on device | • SQLite table with automated 7-day rolling vacuum<br/>• Hardware-backed encryption via `expo-secure-store` key derivation<br/>• Zero cloud syncing during nominal health status | Sprint 1 (Active) |
| **M2.2: Mobile Edge Risk Engine** | On-device kinematic heuristic & fall detection | • 3-stage kinematic scoring: micro-freefall (<0.5g), impact shock (>3.0g), repose angle<br/>• 30s audible/haptic cancel countdown overlay<br/>• Offline dispatch packaging | Sprint 1–2 |
| **M2.3: Robust BLE Pipeline** | Industrial Bluetooth connection reliability | • Automatic reconnect with exponential backoff<br/>• Negotiated MTU 512 for batch telemetry packets<br/>• Background BLE state restoration | Sprint 2 |

---

### 🌐 Tier 3: Polyglot Cloud Backend & Scaled Real-Time Infrastructure

Detailed architectural blueprints available in [docs/POLYGLOT_ARCHITECTURE_PLAN.md](docs/POLYGLOT_ARCHITECTURE_PLAN.md).

| Milestone | Objective | Deliverables | Target Timeline |
| :--- | :--- | :--- | :--- |
| **M3.1: Go Ingestion Gateway** | Massive WebSocket & LoRa concurrency | • Standalone Go service handling 100k+ parallel streams<br/>• Sub-millisecond fan-out to Redis Pub/Sub<br/>• UDP listener for field basecamp hubs | Sprint 2–3 |
| **M3.2: Python AI Analytics Engine** | Biometric anomaly & false-alarm suppression | • Real-time kinematic fall trajectory evaluation<br/>• PPG arrhythmia & severe hypoxemia ($SpO_2$) detection<br/>• GPS drift Kalman filtering | Sprint 3 |
| **M3.3: Rust Cryptographic Engine** | Zero-GC asymmetric verification | • Bare-metal Ed25519 verification (`ed25519-dalek`)<br/>• N-API in-process addon for Node.js coordinator<br/>• Binary packet decompression | Sprint 3–4 |
| **M3.4: Node.js Orchestrator Hardening** | Incident coordination & audit lifecycle | • Active emergency session coordinator (48h TTL)<br/>• Fail-closed audit logging (`AUDIT_FAILURE`)<br/>• SAR GeoJSON & PDF mission dossier export | Sprint 4 |

---

### ⚡ Tier 1: Hardware & Firmware Tier (ESP32-S3 & LoRa)

| Milestone | Objective | Deliverables | Target Timeline |
| :--- | :--- | :--- | :--- |
| **M1.1: Flash Encryption & Key Storage** | Secure Boot V2 and eFuse hardware lock | • ESP32-S3 Flash Encryption enabled<br/>• Pre-provisioned Ed25519 private key stored in secure eFuse<br/>• Tamper detection and zero-knowledge memory wipe | Sprint 2 |
| **M1.2: Deep Sleep & Power Profiling** | Extend battery endurance to 72+ hours | • ULP (Ultra-Low Power) coprocessor pulse monitoring<br/>• Dynamic GPS duty cycling (1Hz during movement, 0.1Hz at rest)<br/>• LoRa low-power CAD (Channel Activity Detection) | Sprint 3 |
| **M1.3: Multi-Node LoRa Mesh Protocol** | Alpine relay hopping for dead-zone coverage | • Simple flood mesh protocol with hop-count TTL (max 3 hops)<br/>• Packet deduplication table on hardware nodes<br/>• Relay prioritization for emergency SOS packets | Sprint 3–4 |

---

### 🖥️ Tier 4: Rescue Web & Monitoring Dashboard

| Milestone | Objective | Deliverables | Target Timeline |
| :--- | :--- | :--- | :--- |
| **M4.1: Offline Topographic Map Tile Cache** | Basecamp offline map visualization | • Vector contour tile pre-caching in IndexedDB via Service Worker<br/>• Offline elevation profile render for search-and-rescue navigation<br/>• MapLibre GL offline style switcher | Sprint 2–3 |
| **M4.2: Realtime Dispatch Coordinator UI** | Multi-responder assignment & command console | • Drag-and-drop responder dispatch assignments<br/>• Realtime ETA calculation based on terrain slope and telemetry<br/>• Live WebSocket reconnection banner with automatic ticket re-acquisition | Sprint 3 |
| **M4.3: Mission Telemetry Analytics** | Alpine mission retrospective analytics | • Multi-track elevation vs. cardiac stress playback<br/>• Incident timeline scrubber with 6-hour historical query bounds<br/>• High-contrast SAR daylight field mode | Sprint 4 |

---

## 3. Recommended Sprint Execution Plan

```mermaid
gantt
    title SWAAS Repository Execution Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 2 (Local-First Core)
    Encrypted SQLite Buffer (Mobile)      :active, p2_1, 2026-11-10, 14d
    On-Device Kinematic Risk Engine        :p2_2, 2026-11-17, 14d
    BLE Auto-Recovery & MTU Optimization  :p2_3, 2026-11-24, 10d
    section Phase 2 (Hardware Security)
    ESP32-S3 Flash Encryption & Keys      :p1_1, 2026-11-15, 14d
    Battery Endurance Deep Sleep Tuning   :p1_2, 2026-11-25, 14d
    section Phase 3 (Polyglot Infrastructure)
    Go Ingestion Gateway Scaffolding      :p3_1, 2026-12-01, 14d
    Python AI Biometric Anomaly Engine    :p3_2, 2026-12-08, 14d
    Rust N-API Crypto Verification Core   :p3_3, 2026-12-15, 14d
    Offline Topographic Tile Cache (PWA)  :p4_1, 2026-12-20, 12d
```

---

## 4. Architectural Guardrails (Zero-Tolerance Invariants)

All PRs, microservices, and sprint tasks must strictly comply with the established repository rules:
1. **Never merge `SWAAS` into `main`:** All active development remains isolated on `SWAAS`.
2. **Local-First Privacy:** No continuous background health telemetry to the cloud during nominal conditions.
3. **Emergency-Bounded Cloud Sharing:** Cloud telemetry bound strictly to active incident + max 6 hours.
4. **Fail-Closed Audit Logging:** Health and location queries must write to `AuditLog` first; failure throws `AUDIT_FAILURE` (HTTP 500).
5. **Human-Operated Version Control:** AI agents never run git mutation commands directly.
