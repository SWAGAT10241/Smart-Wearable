# TrailGuard / SWAAS — Claude Assistant Directives

> **Single Source of Truth:** All work in this repository must strictly adhere to the policies, 7 zero-tolerance architectural invariants, persona assignments, and verification gates defined in [`AGENTS.md`](file:///Users/swagatsouravdhar/WEB%20DEVELOPMENT/TrailGuard/AGENTS.md).

---

## 🧭 Multi-Tier Verification Gates

Always run the tier verification command before completing any feature, fix, or refactor:

- **Backend (Cloud & Realtime):**
  ```bash
  cd backend && pnpm test
  ```

- **Frontend (Rescue Dashboard):**
  ```bash
  cd frontend && pnpm run test:run && pnpm run build
  ```

- **Mobile (Companion App):**
  ```bash
  cd mobile && node scripts/check-syntax.js && pnpm exec expo-doctor
  ```

- **Hardware (Firmware & Drivers):**
  ```bash
  python3 -m compileall -q hardware
  ```

---

## 🔒 Mandatory Architectural Invariants

1. **Zero Git Mutations:** Never run `git commit`, `git push`, `git add`, `git reset`, or `git checkout`. Version control is strictly human-operated.
2. **Database Protection:** Never run delete/drop operations (`deleteMany`, `dropDatabase`, etc.) or mutate databases directly without explicit instructions.
3. **Local-First Privacy:** Continuous vitals and GPS stay local to the mobile device in a rolling 7-day SQLite buffer. Never stream continuous telemetry to the cloud backend.
4. **Emergency-Bounded Sharing:** Telemetry leaves the mobile device only during an active emergency session and is capped to the active incident plus at most the preceding 6 hours.
5. **Fail-Closed Audit Logging:** Historical emergency access must write an immutable entry to `AuditLog` before reading data. If audit logging fails, throw `AUDIT_FAILURE` (HTTP 500).
6. **Cryptographic Device Identity:** Devices must authenticate via pre-provisioned Ed25519 signatures (`X-Device-ID`, `X-Device-Timestamp`, `X-Device-Nonce`, `X-Device-Signature`).
7. **Ephemeral Real-Time Access:** Use single-use 60-second tickets obtained via `POST /api/emergency/ws-ticket` and consumed via the WebSocket subprotocol (`trailguard, ticket.<ticket>`). Never accept raw tokens in URL queries.
8. **Structured Redacted Logging:** Never log passwords, tokens, private keys, raw GPS coordinates, or biometric vitals.

---

## 📐 Code Style & Conventions

- **React Components:** `PascalCase` (e.g., `StatCard.jsx`)
- **React Hooks:** `camelCase` with `use` prefix (e.g., `useDashboardData.js`)
- **Controllers & Services:** `camelCase` (e.g., `emergencySessionService.js`)
- **Constants:** `UPPER_SNAKE_CASE`
- **Error Classes:** `AppError` (backend), `ApiError` (frontend/mobile)
