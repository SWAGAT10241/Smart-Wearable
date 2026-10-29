# Contributing to SWAAS

Thank you for your interest in contributing to **SWAAS** (Smart Wearable Safety & Health Monitoring System)! We welcome contributions from developers, designers, and testers.

---

## 🏗️ System Architecture Overview

TrailGuard is composed of 4 key sub-systems:

1. **Hardware / Wearable**: ESP32-S3 firmware with BLE peripheral, secure boot, flash encryption, and Ed25519 signing keys.
2. **Companion Mobile App**: React Native / Expo application that maintains the local 7-day rolling telemetry database and communicates with the wearable over BLE.
3. **Backend Service**: Node.js, Express, MongoDB with strict privacy-preserving rules. Telemetry is local-first; the backend only receives bounded packages during an authorized emergency.
4. **Web Rescue Dashboard**: React, Vite, TailwindCSS, MapLibre GL for emergency responders to visualize active emergency sessions and historical breadcrumbs.

---

## 🛠️ Development Setup & Prerequisites

- **Node.js**: `v22.x` (LTS recommended)
- **Package Manager**: `pnpm` (`v11.20.0` or higher)
- **Docker**: For running MongoDB and local multi-service orchestration
- **Python**: `3.11+` for hardware sensor drivers and firmware scripts

### 1. Clone the repository

```bash
git clone https://github.com/SWAGAT10241/Smart-Wearable.git
cd Smart-Wearable
```

### 2. Install dependencies

```bash
# Backend
cd backend && pnpm install

# Frontend
cd ../frontend && pnpm install

# Mobile
cd ../mobile && pnpm install
```

### 3. Run with Docker Compose

```bash
docker compose up -d
```

---

## 🌿 Branching and Commit Guidelines

- **Main Branch**: Production-ready code and dependencies.
- **SWAAS Branch**: Staging and active integration branch.
- **Day Branches**: Feature work is organized by phases and days (e.g., `day-4-risk-emergency-models`).
- **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat:` A new feature
  - `fix:` A bug fix
  - `docs:` Documentation only changes
  - `test:` Adding or updating tests
  - `refactor:` Code change that neither fixes a bug nor adds a feature
  - `chore:` Maintenance tasks, dependency bumps

---

## 🧪 Testing and Quality Standards

Before creating a Pull Request, verify that all automated test suites pass locally:

```bash
# Backend unit & integration tests
cd backend && pnpm test

# Frontend test & build
cd ../frontend && pnpm run test:run && pnpm run build

# Mobile syntax and project check
cd ../mobile && node scripts/check-syntax.js

# Hardware python compile check
cd .. && python -m compileall -q hardware
```

---

## 🔒 Security & Privacy Invariants

- **Local-First Privacy**: Never implement continuous telemetry uploads to the backend. Normal telemetry stays on the companion device.
- **Device Authentication**: Never allow claiming a device with `deviceId` alone. Always verify cryptographic proof or physical button authorization.
- **Ephemeral Emergency Data**: All emergency sessions must include TTL indexes (`expiresAt`) to automatically purge temporary emergency data after resolution.
