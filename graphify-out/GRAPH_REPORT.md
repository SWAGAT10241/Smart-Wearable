# Graph Report - TrailGuard  (2026-11-22)

## Corpus Check
- 328 files · ~151,426 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 32 file(s) not represented in the graph (top: (none) 24, .toml 1, .example 1)

## Summary
- 2295 nodes · 3927 edges · 167 communities (125 shown, 42 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 140 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `681b31d5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_react
- SWAAS / TrailGuard — Unified AI Agent Directives & Architecture
- critical-section-guard.js
- devDependencies
- Dashboard.jsx
- mobile/package.json
- steps
- backend/package.json
- rateLimiter.js
- LiveDataContext.jsx
- mongoose
- dependencies
- App.jsx
- Settings.jsx
- auth.test.js
- server/main.go
- AppNavigator.js
- steps
- Dashboard.jsx
- server.test.js
- deviceController.js
- socketManager.js
- Display
- machine
- Contributor Covenant Code of Conduct
- Security Policy
- simulate-esp32.js
- User.js
- 13. Day 3 exit criteria and concrete architectural answers
- SWAAS / TrailGuard — Unified AI Agent Directives & Architecture
- asyncHandler.js
- MPU6050
- Day 3 — Device and API Architecture
- socketManager.js
- App.jsx
- SWAAS / TrailGuard Security Audit & Vulnerability Assessment
- rateLimiter.js
- Unified AI Agent Guardrails & Zero-Tolerance Policies
- AppError
- XglcdFont
- packet.go
- ApiError
- devicePairingService.js
- vitest
- server.js
- mongoose
- deviceProvisioning.test.js
- authRoutes.js
- 🦫 SWAAS / TrailGuard — Go Real-Time Ingestion Gateway
- appError.js
- vercel.json
- sanitizeObject
- History.jsx
- ci-failure-fixer.agent.md
- pr-preflight.agent.md
- security-triage.agent.md
- CI Failure Debugging
- Contributing to SWAAS
- DashboardScreen.js
- _twos_complement
- ErrorMessage.jsx
- github.com/SWAGAT10241/Smart-Wearable/services/gateway-go
- telemetry.go
- telemetry_test.go
- StatCard.jsx
- ci.yml
- Client
- expo
- run
- with
- logger.js
- config.go
- Device.js
- allowBuilds
- integration_tests.rs
- scripts
- overrides
- backend
- frontend
- backend
- healthcheck
- Hub
- SettingsScreen
- scripts
- ci.yml
- build
- build
- environment
- asyncHandler.js
- 2. 4-Tier Strategic Roadmap Matrix
- swagger.js
- max30100.py
- TrailGuard / SWAAS — Claude Assistant Directives
- Copilot CLI Workflow
- mobile/src/lib/profileCompletion.js
- ci-failure-fixer.agent.md
- pr-preflight.agent.md
- security-triage.agent.md
- GitHub Copilot & Codex Instructions — TrailGuard / SWAAS
- CI Failure Debugging
- tests/sanitizeEmail.test.js
- Security Alert Triage
- dependencies
- App.jsx
- Icons.js
- ApiError
- check-all.sh
- setup-env.sh
- emergencySessionController.js
- load-test-k6.js
- ref_crypto
- run
- telemetryService.js
- TrailGuard deployment runbook
- ErrorBoundary
- lib.rs
- telemetry_test.go
- with
- react-icons
- jobs
- NonceTracker
- gateway/main.go
- telemetry.go
- 🦫 SWAAS / TrailGuard — Go Real-Time Ingestion Gateway
- vercel.json
- frontend
- config.go
- CryptoError
- auth.test.js
- hub/hub.go
- verifier.rs
- Client
- designmd
- authorizeRole.js
- verify_canonical_request
- 10. Architecture diagrams
- 3. Device identity, lifecycle, and ownership
- 7. REST API contract
- 6. Emergency session and rescue authorization
- github.com/SWAGAT10241/Smart-Wearable/services/gateway-go
- trailguard-crypto
- 9. Security controls and threat model
- frontend/src/lib/apiClient.js
- FallEvent.js
- sw.js
- sanitizeObject
- backend
- 4. BLE protocol and connection behavior

## God Nodes (most connected - your core abstractions)
1. `Display` - 41 edges
2. `AppError` - 38 edges
3. `useAppTheme()` - 33 edges
4. `mongoose` - 29 edges
5. `useAuth()` - 23 edges
6. `CryptoError` - 21 edges
7. `13. Day 3 exit criteria and concrete architectural answers` - 21 edges
8. `react-native` - 21 edges
9. `MAX30100` - 20 edges
10. `App()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `2. Naming Conventions & Code Style Standards` --references--> `AppError`  [INFERRED]
  AGENTS.md → backend/utils/appError.js
- `📐 Code Style & Conventions` --references--> `AppError`  [INFERRED]
  CLAUDE.md → backend/utils/appError.js
- `3.1 Backend: `AppError` & Centralized Middleware` --references--> `AppError`  [INFERRED]
  docs/architecture/CODEBASE_ORGANIZATION.md → backend/utils/appError.js
- `3. Mandatory Architectural Invariant Compliance Review` --references--> `getHistoricalData()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/services/emergencySessionService.js
- `Journey 4: Fail-Closed Security Audit Logging & Historical Telemetry Window` --references--> `getHistoricalData()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/services/emergencySessionService.js

## Import Cycles
- None detected.

## Communities (167 total, 42 thin omitted)

### Community 0 - "ref_react"
Cohesion: 0.10
Nodes (29): deferred(), device, request(), App(), AppContent(), API_URL, WS_URL, AuthContext (+21 more)

### Community 1 - "SWAAS / TrailGuard — Unified AI Agent Directives & Architecture"
Cohesion: 0.10
Nodes (21): 1. System Mission & 4-Tier Architecture, 2. Naming Conventions & Code Style Standards, 3. The 6 Specialized AI Agent Personas, 4. Mandatory Architectural Invariants (Zero-Tolerance Rules), 5. Role-Based Access Control (RBAC) Matrix, 6. Prohibited Anti-Patterns (Anti-Hallucination Directives), 7. Knowledge Graph & Architecture Navigation (Graphify), 8. User-Mandated Agent Guardrails & Invariants (+13 more)

### Community 2 - "critical-section-guard.js"
Cohesion: 0.22
Nodes (7): checkDir(), checkSymbols, { execSync }, fs, path, rootDir, total

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (41): dependencies, maplibre-gl@^6.18.0, react@^19.3.0, react-dom@^19.3.0, react-icons@^5.7.0, react-phone-number-input@^3.4.18, react-router-dom@^7.18.5, typewriter-effect@^3.3.0 (+33 more)

### Community 4 - "Dashboard.jsx"
Cohesion: 0.22
Nodes (11): ACTIVITY_STYLES, ActivitySummary(), MiniGraph(), SummaryItem(), RecentEventsCard(), DropletIcon(), HeartIcon(), HumidityIcon() (+3 more)

### Community 5 - "mobile/package.json"
Cohesion: 0.06
Nodes (44): dependencies, expo@~58.0.25, expo-device@~58.0.5, expo-linking@~58.0.17, expo-location@~58.0.22, expo-notifications@~58.1.9, expo-secure-store@~58.0.3, expo-status-bar@~58.0.5 (+36 more)

### Community 6 - "steps"
Cohesion: 0.30
Nodes (14): steps, steps, steps, steps, steps, steps, steps, continue-on-error (+6 more)

### Community 7 - "backend/package.json"
Cohesion: 0.06
Nodes (41): passport, dependencies, bcrypt@^6.0.0, connect-mongo@^6.0.0, cors@^2.8.5, dotenv@^18.0.10, express@^5.3.0, express-rate-limit@^8.7.4 (+33 more)

### Community 8 - "rateLimiter.js"
Cohesion: 0.12
Nodes (22): jwt, protect(), adminLimiter, authLimiter, deviceLimiter, queryLimiter, telemetryLimiter, express (+14 more)

### Community 9 - "LiveDataContext.jsx"
Cohesion: 0.12
Nodes (5): BiometricAnalyzer, AnomalyEngine, GPSKalmanFilter, KinematicFallDetector, TestAnalytics

### Community 10 - "mongoose"
Cohesion: 0.07
Nodes (37): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+29 more)

### Community 11 - "dependencies"
Cohesion: 0.08
Nodes (18): app, cors, express, helmet, mongoose, passport, clientUrls, config (+10 more)

### Community 12 - "App.jsx"
Cohesion: 0.24
Nodes (12): VideoAmbient(), AnimatedBeamMeshDiagram(), BorderBeamCard(), CinematicHelicopterFlybyOverlay(), GlobalLivingAtmosphereCanvas(), InteractiveBentoGrid(), Landing(), SarAirborneExtractionSection() (+4 more)

### Community 13 - "Settings.jsx"
Cohesion: 0.06
Nodes (31): name, runs-on, steps, strategy, concurrency, cancel-in-progress, group, jobs (+23 more)

### Community 14 - "auth.test.js"
Cohesion: 0.25
Nodes (5): jsonwebtoken@^9.0.2, EventEmitter, jwt, { PassThrough }, jsonwebtoken

### Community 15 - "server/main.go"
Cohesion: 0.05
Nodes (61): PairDevicePanel(), API_URL, APP_NAME, config, IS_DEVELOPMENT, IS_PRODUCTION, normalizedApi, WS_URL (+53 more)

### Community 16 - "AppNavigator.js"
Cohesion: 0.15
Nodes (13): 1. Clone & Install Dependencies, 2. Configure Environment Files, 3. Start the Subsystems, 🚀 Active Roadmap & Architectural Proposals, ⚡ Core Capabilities, 📖 In-Depth Documentation, 📄 License & Safety Notice, Prerequisites (+5 more)

### Community 17 - "steps"
Cohesion: 0.05
Nodes (30): app_main(), append_authorization_challenge(), authority_public_key_available(), build_device_info(), build_telemetry_frame(), format_uuid(), gap_event(), gatt_access() (+22 more)

### Community 18 - "Dashboard.jsx"
Cohesion: 0.20
Nodes (9): 1. Install Dependencies, 2. Start Development Server, 3. Build for Production, 🔐 Environment Configuration, 🚀 Getting Started, ⚡ Key Capabilities, 📂 Subsystem Structure, 🧪 Testing (+1 more)

### Community 19 - "server.test.js"
Cohesion: 0.09
Nodes (21): authenticatedTelemetryRequest(), createDeviceAuthHeaders(), crypto, mockDeviceAuthNonceCreate, mockDeviceCreate, mockDeviceFindOne, mockDeviceFindOneAndUpdate, mockDevicePairingCreate (+13 more)

### Community 20 - "deviceController.js"
Cohesion: 0.15
Nodes (12): 1. Correction, 2. Warning, 3. Temporary Ban, 4. Permanent Ban, Attribution, Contributor Covenant Code of Conduct, Enforcement, Enforcement Guidelines (+4 more)

### Community 21 - "socketManager.js"
Cohesion: 0.11
Nodes (16): 1. Install Dependencies, 2. Verify Server Syntax, 3. Run Development Server, 📡 API Endpoint Overview, 🏗️ Architecture & Core Responsibilities, 🛠️ CLI Utilities & Device Provisioning, 🔐 Environment Configuration, 🚀 Getting Started (+8 more)

### Community 26 - "Security Policy"
Cohesion: 0.11
Nodes (18): Authentication, Authorization, CI/CD Security, Data Security, Device Security, Emergency and Safety Workflows, Infrastructure and CI/CD, Out of Scope (+10 more)

### Community 27 - "simulate-esp32.js"
Cohesion: 0.21
Nodes (18): buildTelemetryPacket(), clamp(), createSignature(), crypto, fs, generateEnvironment(), generateLocation(), generateMotion() (+10 more)

### Community 28 - "User.js"
Cohesion: 0.15
Nodes (12): bcrypt, mongoose, userSchema, crypto, mongoose, webSocketTicketSchema, consumeTicket(), createTicket() (+4 more)

### Community 29 - "13. Day 3 exit criteria and concrete architectural answers"
Cohesion: 0.11
Nodes (19): 10. How is horizontal privilege escalation prevented?, 11. How are API requests authenticated?, 13. Day 3 exit criteria and concrete architectural answers, 13. How are pairing and replay attacks prevented?, 14. How are sensitive operations audited?, 15. How is sensitive data prevented from appearing in logs?, 16. What happens when the network is unavailable?, 17. What happens when BLE disconnects? (+11 more)

### Community 30 - "SWAAS / TrailGuard — Unified AI Agent Directives & Architecture"
Cohesion: 0.10
Nodes (20): patterns, patterns, patterns, patterns, actions-dependencies, backend-dependencies, frontend-dependencies, gateway-dependencies (+12 more)

### Community 31 - "asyncHandler.js"
Cohesion: 0.27
Nodes (7): connectDB(), mongoose, seedDevices(), mongoose, runSeeds(), SEED_USERS, seedUsers()

### Community 32 - "MPU6050"
Cohesion: 0.11
Nodes (9): 1. High-Level Component Flowchart, 2.1 Hardware Sensing Tier (`hardware/`), 2.2 Local-First Mobile Companion (`mobile/`), 2.3 Express & MongoDB Backend (`backend/`), 2.4 Monitoring & Rescue Dashboard (`frontend/`), 2. Architectural Subsystem Breakdown, 3. Related Specifications & Architecture Documentation, System Architecture & Component Topology (+1 more)

### Community 33 - "Day 3 — Device and API Architecture"
Cohesion: 0.17
Nodes (12): 11. Verification plan, 12. Current implementation gaps and rollout gates, 1. Goals and non-goals, 2. System components and trust boundaries, 5. Local-first storage and privacy, 8. Backend models and indexes, Boundary rules, Day 3 — Device and API Architecture (+4 more)

### Community 34 - "socketManager.js"
Cohesion: 0.14
Nodes (13): allowBuilds, bcrypt, mongodb-memory-server, @parcel/watcher, unrs-resolver, overrides, body-parser, brace-expansion (+5 more)

### Community 35 - "App.jsx"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 36 - "SWAAS / TrailGuard Security Audit & Vulnerability Assessment"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 37 - "rateLimiter.js"
Cohesion: 0.11
Nodes (17): concurrency, cancel-in-progress, group, name, runs-on, steps, jobs, dependency-review (+9 more)

### Community 38 - "Unified AI Agent Guardrails & Zero-Tolerance Policies"
Cohesion: 0.17
Nodes (22): AlertCard(), styles, AppHeader(), styles, FallAlertModal(), styles, BellIcon(), UserIcon() (+14 more)

### Community 39 - "AppError"
Cohesion: 0.09
Nodes (27): completePairingChallenge, getTelemetryReceipt, startPairingChallenge, getDeviceById(), registerDevice(), renameDevice(), unpairDevice(), updateDeviceStatus() (+19 more)

### Community 41 - "packet.go"
Cohesion: 0.18
Nodes (11): completeProfile, getMe, login, register, completeProfile(), getCurrentUser(), jwt, loginUser() (+3 more)

### Community 42 - "ApiError"
Cohesion: 0.17
Nodes (18): AppLayout(), items, MobileNav(), SearchModal(), PRIMARY_NAV_ITEMS, Sidebar(), DeviceContext, useDevices() (+10 more)

### Community 45 - "vitest"
Cohesion: 0.22
Nodes (8): 1. Install Dependencies, 2. Start Expo Development Server, ⚡ Core Architecture, 🔐 Environment Configuration, 🚀 Getting Started, 📂 Subsystem Structure, 📱 TrailGuard Mobile Companion, 🧪 Verification & CI Checks

### Community 47 - "mongoose"
Cohesion: 0.09
Nodes (20): validate(), auditLogSchema, crypto, mongoose, crypto, emergencySessionSchema, mongoose, environmentReadingSchema (+12 more)

### Community 48 - "deviceProvisioning.test.js"
Cohesion: 0.33
Nodes (5): blank_issues_enabled, contact_links, about, name, url

### Community 49 - "authRoutes.js"
Cohesion: 0.07
Nodes (27): concurrency, cancel-in-progress, group, GITHUB_TOKEN, jobs, sync-wiki, name, on (+19 more)

### Community 51 - "🦫 SWAAS / TrailGuard — Go Real-Time Ingestion Gateway"
Cohesion: 0.07
Nodes (24): crypto, jwt, mockAuditCreate, mockAuditFind, mockBroadcastEmergencyEvent, mockDeviceCreate, mockDeviceFind, mockDeviceFindOne (+16 more)

### Community 52 - "appError.js"
Cohesion: 0.16
Nodes (15): devicePairingSchema, mongoose, assertDeviceAuthorizationConfigured(), canonicalReceiptPayload(), crypto, getAuthorityPrivateKey(), issueDeviceAuthorizationReceipt(), verifyDeviceAuthorizationReceipt() (+7 more)

### Community 53 - "vercel.json"
Cohesion: 0.15
Nodes (18): AuthCard(), AuthLayout(), FEATURES, Button(), Field(), PhoneField(), InfoRow(), DeviceCard() (+10 more)

### Community 54 - "sanitizeObject"
Cohesion: 0.15
Nodes (12): 1. Executive Summary & Objective, 2. Final Phase 1 4-Tier Architecture, 3. Mandatory Architectural Invariant Compliance Review, 4. Legacy TrailGuard → SWAAS Migration Verification, 5. End-to-End Integration Test Suite, 6. Comprehensive Multi-Tier Verification Results, 7. Phase 1 Completion & Readiness Sign-Off, Day 7 — Integration Testing, Architecture Compliance Review & Phase 1 Sign-Off (+4 more)

### Community 55 - "History.jsx"
Cohesion: 0.24
Nodes (11): LoadingSpinner(), LiveLocationCard(), createMarkerElement(), LiveMap(), MAP_STYLES, useDarkMode(), HISTORY_RANGES, useTelemetryHistory() (+3 more)

### Community 56 - "ci-failure-fixer.agent.md"
Cohesion: 0.17
Nodes (17): createPairingQrPayload(), fs, main(), mongoose, parseArguments(), path, printHelp(), QRCode (+9 more)

### Community 57 - "pr-preflight.agent.md"
Cohesion: 0.11
Nodes (18): crypto, mockAuditLogCreate, mockAuditLogFind, mockBroadcastEmergencyEvent, mockCurrentUser, mockDeviceFindOne, mockEmergencySessionCreate, mockEmergencySessionFind (+10 more)

### Community 58 - "security-triage.agent.md"
Cohesion: 0.18
Nodes (10): status(), 1. Objective and Invariants, 2. Risk Engine Architecture, 3.1 `EmergencySession` (`backend/models/EmergencySession.js`), 3.2 `RiskAssessment` (`backend/models/RiskAssessment.js`), 3.3 `AuditLog` (`backend/models/AuditLog.js`), 3. Data Models Specification, 4. Verification and Acceptance Checklist (+2 more)

### Community 60 - "CI Failure Debugging"
Cohesion: 0.23
Nodes (12): ActivityCard(), Item(), styles, DeviceCard(), styles, BatteryIcon(), BootIcon(), ClockIcon() (+4 more)

### Community 61 - "Contributing to SWAAS"
Cohesion: 0.20
Nodes (9): 1. Clone the repository, 2. Install dependencies, 3. Run with Docker Compose, 🌿 Branching and Commit Guidelines, Contributing to SWAAS, 🛠️ Development Setup & Prerequisites, 🔒 Security & Privacy Invariants, 🏗️ System Architecture Overview (+1 more)

### Community 62 - "DashboardScreen.js"
Cohesion: 0.18
Nodes (18): Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry), DropletIcon(), HeartIcon(), OxygenIcon(), PinIcon(), PressureIcon(), PulseWave(), ThermometerIcon() (+10 more)

### Community 64 - "_twos_complement"
Cohesion: 0.20
Nodes (10): 1. Executive Summary & Vision, 🦀 1. Rust: Cryptographic Verification & Binary Unpacking, 🦫 2. Go (Golang): Real-Time Network & Ingestion Gateway, 2. The 4-Language Division of Responsibilities, 3. Inter-Service Communication Contracts, 🟩 3. Node.js (Express 5 / TypeScript): Application Orchestration Hub, 4. Preservation of Core Safety Invariants, 🐍 4. Python (FastAPI / PyTorch): AI & Biometric Anomaly Detection (+2 more)

### Community 65 - "ErrorMessage.jsx"
Cohesion: 0.18
Nodes (10): auditLogPath, BLOCKED_COMMAND_RULES, deny(), fs, inputRaw, logBlockEvent(), logDir, path (+2 more)

### Community 66 - "github.com/SWAGAT10241/Smart-Wearable/services/gateway-go"
Cohesion: 0.15
Nodes (12): base_branches, drafts, enabled, chat, auto_reply, language, reviews, auto_review (+4 more)

### Community 68 - "telemetry_test.go"
Cohesion: 0.24
Nodes (11): BottomTabBar(), styles, tabs, AlertIcon(), HistoryIcon(), HomeIcon(), MapIcon(), SettingsIcon() (+3 more)

### Community 69 - "StatCard.jsx"
Cohesion: 0.10
Nodes (7): ChartCard(), Sparkline(), MiniStats(), QuickStatsGrid(), StatCard(), STATUS_COLORS, STYLES

### Community 70 - "ci.yml"
Cohesion: 0.17
Nodes (12): 1. Objective and Invariants, 2. Security & Trust Architecture, 3.1 Historical Replay Authorization Matrix, 3.2 Ephemeral Data Retention Rules, 3. Data Protection Specification, 4. Structured Redacted Logging, 5. Security Verification & Test Results, 6. Day 6 Exit Criteria Checklist (+4 more)

### Community 71 - "Client"
Cohesion: 0.18
Nodes (11): MONGO_INITDB_DATABASE, MONGO_INITDB_ROOT_PASSWORD, MONGO_INITDB_ROOT_USERNAME, container_name, environment, image, networks, ports (+3 more)

### Community 73 - "expo"
Cohesion: 0.08
Nodes (23): backgroundColor, foregroundImage, adaptiveIcon, package, permissions, expo, android, icon (+15 more)

### Community 74 - "run"
Cohesion: 0.18
Nodes (11): 1. Architectural Philosophy & Layered Separation, 2.1 Backend (`backend/`), 2.2 Frontend Web Dashboard (`frontend/`), 2.3 Mobile Companion App (`mobile/`), 2. Directory Structure Across All Tiers, 3.1 Backend: `AppError` & Centralized Middleware, 3.2 Frontend & Mobile: Standardized `ApiError`, 3. Standardized Error Handling Architecture (+3 more)

### Community 75 - "with"
Cohesion: 0.18
Nodes (11): 1. Objective and Invariants, 2. Target Architecture, 3.1 Connection Handshake, 3.2 Client-to-Server Actions, 3.3 Server-to-Client Broadcast Events, 3. Real-Time Protocol Specification, 4. Emergency REST API Specification, 5. Security and Privacy Guarantees (+3 more)

### Community 76 - "logger.js"
Cohesion: 0.43
Nodes (6): formatLog(), logger, sanitizeString(), sanitizeValue(), SENSITIVE_KEYS, SENSITIVE_PATTERNS

### Community 77 - "config.go"
Cohesion: 0.20
Nodes (9): 1. Mandatory Approval Gate (No Blind Execution), 2. Zero Git Commands (Human-Operated Only), 3. Outbound Network & External Communication Lock, 4. Package Installation & Hardhat Guard, 5. Docker & Container Command Block, 6. Database Protection (Zero Direct Deletions), 7. Zero File Deletion, 8. Strict Workspace Boundary (+1 more)

### Community 78 - "Device.js"
Cohesion: 0.15
Nodes (10): crypto, deviceAuthMiddleware(), reject(), sha256(), deviceSchema, mongoose, deviceAuthNonceSchema, mongoose (+2 more)

### Community 79 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, esbuild, maplibre-gl, overrides, source-map-js

### Community 81 - "integration_tests.rs"
Cohesion: 0.15
Nodes (7): trailguard_free_string(), trailguard_unpack_telemetry_packet(), trailguard_verify_canonical_signature(), build_canonical_message(), compute_body_sha256(), test_c_abi_foreign_function_interface(), test_ed25519_canonical_verification_success_and_tamper()

### Community 83 - "scripts"
Cohesion: 0.29
Nodes (6): crypto, fs, generateAuthorityKeys(), parseArguments(), path, writeExclusive()

### Community 84 - "overrides"
Cohesion: 0.25
Nodes (7): driver, networks, trailguard-net, services, driver, volumes, mongo_data

### Community 85 - "backend"
Cohesion: 0.40
Nodes (4): 📝 Description, 🔐 Security & Privacy Verification, 🧪 Testing Checklist, 🔍 Type of Change

### Community 86 - "frontend"
Cohesion: 0.25
Nodes (8): condition, backend, container_name, depends_on, networks, ports, restart, frontend

### Community 87 - "backend"
Cohesion: 0.25
Nodes (8): container_name, depends_on, networks, ports, restart, mongodb, condition, backend

### Community 88 - "healthcheck"
Cohesion: 0.50
Nodes (8): healthcheck, healthcheck, interval, retries, start_period, test, timeout, healthcheck

### Community 89 - "Hub"
Cohesion: 0.13
Nodes (9): main(), Validator, NewValidator(), EventBus, NewEventBus(), NewLoRaListener(), Hub, NewHub() (+1 more)

### Community 91 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, dev, generate-device-authority-keys, pm2:logs, pm2:restart, pm2:start, pm2:stop, provision-device (+5 more)

### Community 93 - "ci.yml"
Cohesion: 0.17
Nodes (11): concurrency, cancel-in-progress, group, name, on, pull_request, push, permissions (+3 more)

### Community 94 - "build"
Cohesion: 0.33
Nodes (7): VITE_API_URL, VITE_WS_URL, build, args, context, dockerfile, build

### Community 95 - "build"
Cohesion: 0.14
Nodes (13): allowBuilds, react-native-screens, minimumReleaseAgeExclude, overrides, decode-uri-component, expo-constants, glob@>=9.0.0 <=14.0.1, minimatch@<11.0.1 (+5 more)

### Community 96 - "environment"
Cohesion: 0.29
Nodes (7): environment, CLIENT_URLS, JWT_SECRET, MONGODB_URI, NODE_ENV, PORT, SESSION_SECRET

### Community 97 - "asyncHandler.js"
Cohesion: 0.09
Nodes (19): getDevice, getUserDevices, registerDevice(), renameDevice, unpairDevice, updateStatus, getHistory, getLatest (+11 more)

### Community 98 - "2. 4-Tier Strategic Roadmap Matrix"
Cohesion: 0.22
Nodes (9): 1. Executive Summary & Vision, 2. 4-Tier Strategic Roadmap Matrix, 3. Recommended Sprint Execution Plan, 4. Architectural Guardrails (Zero-Tolerance Invariants), SWAAS / TrailGuard — Strategic Repository Roadmap & Future Milestone Architecture, ⚡ Tier 1: Hardware & Firmware Tier (ESP32-S3 & LoRa), 📱 Tier 2: Mobile Companion Tier (Top Priority — Local-First Invariant 1), 🌐 Tier 3: Polyglot Cloud Backend & Scaled Real-Time Infrastructure (+1 more)

### Community 101 - "TrailGuard / SWAAS — Claude Assistant Directives"
Cohesion: 0.40
Nodes (4): 📐 Code Style & Conventions, 🔒 Mandatory Architectural Invariants, 🧭 Multi-Tier Verification Gates, TrailGuard / SWAAS — Claude Assistant Directives

### Community 102 - "Copilot CLI Workflow"
Cohesion: 0.50
Nodes (3): Copilot CLI Workflow, Prompt template, Recommended flow

### Community 104 - "mobile/src/lib/profileCompletion.js"
Cohesion: 0.15
Nodes (19): EyeIcon(), EyeOffIcon(), ShieldIcon(), useAuth(), hasText(), isProfileComplete(), AppNavigator(), AuthenticatedStack() (+11 more)

### Community 105 - "ci-failure-fixer.agent.md"
Cohesion: 0.50
Nodes (3): Constraints, Output, Procedure

### Community 106 - "pr-preflight.agent.md"
Cohesion: 0.50
Nodes (3): Constraints, Output, Procedure

### Community 107 - "security-triage.agent.md"
Cohesion: 0.50
Nodes (3): Constraints, Output, Procedure

### Community 108 - "GitHub Copilot & Codex Instructions — TrailGuard / SWAAS"
Cohesion: 0.50
Nodes (3): Core Principles, GitHub Copilot & Codex Instructions — TrailGuard / SWAAS, Verification Checklist

### Community 109 - "CI Failure Debugging"
Cohesion: 0.50
Nodes (3): CI Failure Debugging, Procedure, Repository gates

### Community 115 - "App.jsx"
Cohesion: 0.12
Nodes (26): @testing-library/react@^16.3.3, About, App(), CompleteProfile, Dashboard, History, Landing, Login (+18 more)

### Community 122 - "emergencySessionController.js"
Cohesion: 0.27
Nodes (11): assignOrJoinResponder, createSession, extractMeta(), generateWsTicket, getActiveSessions, getHistoricalData, getSessionAudit, getSessionById (+3 more)

### Community 123 - "load-test-k6.js"
Cohesion: 0.20
Nodes (5): options, ticketFetchDuration, wsConnectionSuccess, wsMessagesReceived, options

### Community 124 - "ref_crypto"
Cohesion: 0.22
Nodes (10): checkNativeAvailability(), crypto, { execFileSync }, fs, getEngineStatus(), path, RUST_BIN_PATH, unpackTelemetryPacket() (+2 more)

### Community 125 - "run"
Cohesion: 0.20
Nodes (10): run, defaults, name, runs-on, gateway-go, mobile, defaults, name (+2 more)

### Community 126 - "telemetryService.js"
Cohesion: 0.31
Nodes (7): dispatchEmergencyAlerts(), sendEmergencySMS(), twilio, processReadings(), sendEmergencyWhatsApp(), twilio, twilio

### Community 127 - "TrailGuard deployment runbook"
Cohesion: 0.25
Nodes (7): Environment boundaries, Production release, Required configuration, Rollback procedure, Rollback triggers, Staging release, TrailGuard deployment runbook

### Community 129 - "lib.rs"
Cohesion: 0.24
Nodes (5): compute_crc16(), PACKET_MAGIC, PACKET_SIZE, PACKET_VERSION, TelemetryFrame

### Community 131 - "telemetry_test.go"
Cohesion: 0.29
Nodes (8): ExtractTicketFromProtocol(), TestExtractTicketFromProtocol_MalformedOrMissing(), TestExtractTicketFromProtocol_Valid(), TestTelemetryRedactedSummary(), TestTelemetryValidation_EmptyDeviceID(), TestTelemetryValidation_PhysiologicalBounds(), TestTelemetryValidation_TimestampSkew(), TestTelemetryValidation_Valid()

### Community 132 - "with"
Cohesion: 0.22
Nodes (9): with, cache-dependency-path, components, go-version, node-version, python-version, run_install, toolchain (+1 more)

### Community 133 - "react-icons"
Cohesion: 0.31
Nodes (5): NotificationBell(), ProfileMenu(), DashboardHeader(), useUpdatedTime(), react-icons

### Community 134 - "jobs"
Cohesion: 0.20
Nodes (10): name, runs-on, name, runs-on, name, runs-on, jobs, architecture (+2 more)

### Community 136 - "gateway/main.go"
Cohesion: 0.20
Nodes (5): ComputeCRC16(), TelemetryFrame, TestPacketChecksumMismatch(), TestPacketUnpackValid(), Unpack()

### Community 137 - "telemetry.go"
Cohesion: 0.33
Nodes (6): BLE security model, TelemetryFrame, Battery, Location, Motion, Vitals

### Community 138 - "🦫 SWAAS / TrailGuard — Go Real-Time Ingestion Gateway"
Cohesion: 0.25
Nodes (7): 🐳 Container Deployment, 🚀 Endpoints, 🔧 Environment Variables, ⚡ Key Capabilities, 🧭 Overview, 🦫 SWAAS / TrailGuard — Go Real-Time Ingestion Gateway, 🧪 Testing

### Community 139 - "vercel.json"
Cohesion: 0.25
Nodes (7): buildCommand, cleanUrls, framework, outputDirectory, rewrites, rootDirectory, $schema

### Community 140 - "frontend"
Cohesion: 0.50
Nodes (4): defaults, name, runs-on, frontend

### Community 141 - "config.go"
Cohesion: 0.48
Nodes (5): Config, getEnv(), getEnvInt(), getEnvInt64(), Load()

### Community 142 - "CryptoError"
Cohesion: 0.18
Nodes (10): CryptoError, ChecksumMismatch, InvalidNonce, InvalidPacketHeader, InvalidPublicKey, InvalidSignature, MalformedPacket, NonceReplayed (+2 more)

### Community 143 - "auth.test.js"
Cohesion: 0.14
Nodes (12): createLimiter(), rateLimit, supertest@^7.3.2, jwt, mockUserCreate, mockUserFindById, mockUserFindByIdAndUpdate, mockUserFindOne (+4 more)

### Community 144 - "hub/hub.go"
Cohesion: 0.24
Nodes (5): Client, Hub, main(), NewHub(), TestHubRegistrationAndScopedDelivery()

### Community 145 - "verifier.rs"
Cohesion: 0.31
Nodes (5): b64_val(), decode_base64_or_hex(), ED25519_SPKI_PREFIX, parse_public_key(), parse_signature()

### Community 147 - "designmd"
Cohesion: 0.40
Nodes (4): designmd, DESIGNMD_API_KEY, npx, designmd-mcp

### Community 148 - "authorizeRole.js"
Cohesion: 0.38
Nodes (5): hasPermission(), ROLE_PERMISSIONS, authorizePermission(), authorizeRole(), 12. How are API requests authorized?

### Community 149 - "verify_canonical_request"
Cohesion: 0.48
Nodes (4): main(), print_usage(), run_benchmark(), verify_canonical_request()

### Community 151 - "10. Architecture diagrams"
Cohesion: 0.33
Nodes (6): 10. Architecture diagrams, API authentication and authorization flow, BLE communication and reconnection sequence, Emergency session lifecycle sequence, Local-first storage and normal-mode boundary, User → Device ownership entity diagram

### Community 152 - "3. Device identity, lifecycle, and ownership"
Cohesion: 0.40
Nodes (5): 3. Device identity, lifecycle, and ownership, Identity and credential, Lifecycle, Ownership policy, Secure pairing decision and flow

### Community 153 - "7. REST API contract"
Cohesion: 0.40
Nodes (5): 7. REST API contract, Conventions and authentication, Initial endpoints, Request validation and examples, Response and error format

### Community 154 - "6. Emergency session and rescue authorization"
Cohesion: 0.50
Nodes (4): 6. Emergency session and rescue authorization, Access, expiry, and deletion, Minimum emergency package, Trigger, states, and transitions

### Community 159 - "9. Security controls and threat model"
Cohesion: 0.50
Nodes (4): 9. Security controls and threat model, Security invariants (must always hold), Threats and mitigations, Transport, storage, secrets

### Community 160 - "frontend/src/lib/apiClient.js"
Cohesion: 0.18
Nodes (15): useDashboardData(), clearToken(), devicePairingApi, environmentApi, fallsApi, locationApi, request(), vitalsApi (+7 more)

### Community 161 - "FallEvent.js"
Cohesion: 0.29
Nodes (3): fallEventSchema, mongoose, updateFallStatus()

### Community 163 - "sanitizeObject"
Cohesion: 0.53
Nodes (3): FORBIDDEN_OPERATORS, injectionGuard(), sanitizeObject()

### Community 164 - "backend"
Cohesion: 0.50
Nodes (4): defaults, name, runs-on, backend

### Community 165 - "4. BLE protocol and connection behavior"
Cohesion: 0.67
Nodes (3): 4. BLE protocol and connection behavior, Connection state and retries, Telemetry envelope

## Knowledge Gaps
- **14 isolated node(s):** `ChecksumMismatch`, `InvalidNonce`, `InvalidPacketHeader`, `InvalidPublicKey`, `InvalidSignature` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1074 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` connect `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` to `gateway-go`?**
  _High betweenness centrality (0.327) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `AppError` (e.g. with `2. Naming Conventions & Code Style Standards` and `📐 Code Style & Conventions`) actually correct?**
  _`AppError` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ChecksumMismatch`, `InvalidNonce`, `InvalidPacketHeader` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._
- **Why does `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` connect `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` to `DashboardScreen.js`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **Should `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry)` connect `DashboardScreen.js` to `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._