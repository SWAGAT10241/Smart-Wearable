# ⚙️ SWAAS Backend API & Realtime Service

> Express 5 / Node.js backend acting as an incident coordinator, cryptographic device authority, and session-scoped real-time event broker for the TrailGuard ecosystem.

---

## 🏗️ Architecture & Core Responsibilities

The backend enforces strict **Controller-Service separation** and adheres to safety-critical invariants:

- **Incident Coordinator:** Not a continuous health data lake. Normal health telemetry stays on-device; cloud ingestion is strictly emergency-bounded ($\le 6$ hours).
- **Cryptographic Device Ingestion:** Hardware requests are authenticated using pre-provisioned Ed25519 digital signatures (`X-Device-Signature`) and anti-replay nonces.
- **Fail-Closed Security Auditing:** Access to protected historical health records must record an immutable entry to `AuditLog` *before* reading from the database; fails closed with `AUDIT_FAILURE` (HTTP 500) if the log write fails.
- **Ephemeral Retention:** Automatic MongoDB TTL indexes purge WebSocket tickets in 60 seconds and emergency sessions in 48 hours.
- **Session-Scoped WebSockets:** Real-time telemetry is delivered via single-use tickets over `/live` using subprotocol authentication (`trailguard, ticket.<ticket>`).

---

## 📂 Subsystem Structure

```text
backend/
├── config/              # Frozen, schema-validated configuration (env.js, db.js)
├── controllers/         # Request validation & HTTP dispatching (asyncHandler, AppError)
├── services/            # Pure business logic & cryptography (devicePairingService, emergencySessionService)
├── routes/              # Thin Express route definitions with rate limiters
├── models/              # Mongoose schemas with automated TTL purge indexes
├── realtime/            # Session-scoped WebSocket manager (socketManager.js)
├── middleware/          # Security (deviceAuthMiddleware, authMiddleware, rateLimiter)
├── scripts/             # Authority key generation & device provisioning CLIs
├── tests/               # In-memory Jest & security regression test suites
└── server.js            # HTTP/WebSocket server entry point
```

---

## 🔐 Environment Configuration

Create a local `backend/.env` file from `.env.example`:

| Variable | Required | Default / Description |
| :--- | :---: | :--- |
| `PORT` | No | `3000` — HTTP server port |
| `NODE_ENV` | Yes | `development` / `production` / `test` |
| `MONGODB_URI` | Yes | MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/trailguard`) |
| `JWT_SECRET` | Yes | Strong secret for signing user tokens ($\ge 32$ chars) |
| `JWT_EXPIRES_IN`| No | Token validity duration (e.g. `7d`) |
| `CORS_ORIGIN` | Yes | Allowed frontend origins (e.g. `http://localhost:5173`) |
| `DEVICE_AUTHORITY_PUBLIC_KEY` | Yes | Base64URL-encoded Ed25519 public authority key |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
corepack enable
pnpm install
```

### 2. Verify Server Syntax
```bash
node --check server.js
```

### 3. Run Development Server
```bash
pnpm dev
```
The server will start at `http://localhost:3000` with hot-reloading.

---

## 🛠️ CLI Utilities & Device Provisioning

Hardware devices must be provisioned before pairing:

```bash
# 1. Generate Ed25519 Device Authority Keys
pnpm generate-device-authority-keys -- \
  --private-key-file device-authority-private.pem \
  --public-key-file device-authority-public.txt

# 2. Provision Hardware Device Public Key
pnpm provision-device -- \
  --device-id "d3b07384-d113-4696-b516-e522961d7647" \
  --public-key-file device-public.key \
  --device-name "TrailGuard S3-Alpha" \
  --qr-output pairing-qr.svg
```

---

## 📡 API Endpoint Overview

All API endpoints follow standardized REST design and error responses (`{ "success": false, "message": "...", "code": "..." }`).

| Route Group | Path | Key Capabilities |
| :--- | :--- | :--- |
| **Auth** | `/api/auth` | User registration, login, Google OAuth profile completion, `GET /me` |
| **Device Pairing** | `/api/devices/register` | 3-Way Ed25519 challenge-response handshake (`initiate`, `complete`) |
| **Device Inventory**| `/api/devices` | User device listing, renaming, status updates |
| **Emergency** | `/api/emergency` | Active sessions, 60s WS tickets (`/ws-ticket`), 6h historical replay |
| **Telemetry** | `/api/vitals`, `/api/location` | Ephemeral sensor ingestion during active emergency sessions |
| **Realtime** | `/live` | Session-scoped WebSockets authenticated via single-use tickets |

> 📖 **Complete Endpoint Specifications & Schemas:** See the [Official API Architecture Wiki](https://github.com/SWAGAT10241/Smart-Wearable/wiki/05---API-Architecture) and [Real-Time Communication Wiki](https://github.com/SWAGAT10241/Smart-Wearable/wiki/17---Real-Time-Communication).

---

## 🧪 Testing

```bash
# Run isolated in-memory unit & security test suites
pnpm test

# Run individual test suite
./node_modules/.bin/jest tests/securityHardening.test.js
```
