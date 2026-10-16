# Contributing to TrailGuard

Thank you for contributing to the TrailGuard ecosystem! This document provides guidelines for setting up your development environment, creating feature branches, and submitting pull requests.

---

## 🏛️ Architecture Overview

The system consists of 4 core modules:
1. **`hardware/`**: ESP32-S3 firmware (C / NimBLE BLE) and sensor drivers (Python / MicroPython).
2. **`mobile/`**: React Native / Expo user companion app (BLE pairing, local vitals storage, fall prompt).
3. **`backend/`**: Node.js & Express REST API, MongoDB storage, and WebSocket live channel.
4. **`frontend/`**: Vite + React single-page application for the rescue and administrative dashboard.

---

## 🛠️ Prerequisites

- **Node.js**: `v22.13.0` (LTS)
- **pnpm**: `v11.20.0` (backend/frontend) & `v12.4.2` (mobile)
- **Python**: `3.11+`
- **Docker & Docker Compose** (optional, recommended for full-stack local testing)
- **MongoDB**: `v7.0+` (if running locally without Docker)

---

## 🚀 Getting Started

### Option A: Using Docker Compose (Fastest)

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Build and launch all services
docker compose up --build
```
- Frontend: http://localhost:80
- Backend: http://localhost:3000
- MongoDB: `mongodb://localhost:27017`

### Option B: Running Services Manually

```bash
# 1. Backend
cd backend
pnpm install
pnpm run dev

# 2. Frontend Web
cd frontend
pnpm install
pnpm run dev

# 3. Mobile App
cd mobile
pnpm install
pnpm start
```

---

## 🧪 Running Tests & Validation

Before submitting a pull request, ensure all local checks pass:

```bash
# Backend unit & integration tests
cd backend && pnpm test

# Frontend tests & build verification
cd frontend && pnpm run test:run && pnpm run build

# Mobile syntax, Expo health, & bundle export
cd mobile && pnpm run check && pnpm run export:check

# Hardware Python syntax validation
python -m compileall -q hardware
```

---

## 🌿 Git & Branching Strategy

- **`main`**: Production-ready branch. All merges must pass automated CI checks.
- **Feature Branches**: Branch from `main` using descriptive names:
  - `feat/feature-name` (new functionality)
  - `fix/bug-name` (bug fixes)
  - `docs/doc-updates` (documentation)
  - `day-X-...` (Phase 1 milestone branches)

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(mobile): add offline tile caching`
- `fix(backend): patch emergency session expiration TTL`
- `docs: update Phase 1 Day 4 specifications`
- `ci: add automated security scanning`

---

## 🛡️ Security & Privacy Invariants

When writing code for SWAAS, adhere to these invariants:
1. **Local-First Privacy**: High-frequency biometric and location data must remain strictly on the mobile device during normal operation. Only confirmed emergency events trigger telemetry synchronization to the backend.
2. **Ephemeral Cloud Data**: Emergency sessions must include a TTL (Time-To-Live) index so data automatically expires after resolution.
3. **No Hardcoded Secrets**: Never commit tokens, nonces, or passwords. Use `.env.example` to document required configuration.
