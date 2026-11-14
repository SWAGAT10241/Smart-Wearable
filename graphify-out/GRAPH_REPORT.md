# Graph Report - TrailGuard  (2026-11-14)

## Corpus Check
- 280 files · ~129,291 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 28 file(s) not represented in the graph (top: (none) 18, .example 4, .conf 1)

## Summary
- 1945 nodes · 3302 edges · 120 communities (90 shown, 30 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a057a27b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AuthContext.js
- SWAAS / TrailGuard — Unified AI Agent Directives & Architecture
- critical-section-guard.js
- devDependencies
- Dashboard.jsx
- mobile/package.json
- jobs
- backend/package.json
- frontend/src/lib/apiClient.js
- StatCard.jsx
- mongoose
- dependencies
- App.jsx
- Settings.jsx
- supertest
- LiveDataContext.jsx
- AppNavigator.js
- main.c
- Dashboard.jsx
- server.test.js
- deviceController.js
- socketManager.js
- Display
- MAX30100
- Contributor Covenant Code of Conduct
- Security Policy
- simulate-esp32.js
- User.js
- 13. Day 3 exit criteria and concrete architectural answers
- SWAAS / TrailGuard — Unified AI Agent Directives & Architecture
- Device.js
- MPU6050
- Day 3 — Device and API Architecture
- socketManager.js
- App.jsx
- SWAAS / TrailGuard Security Audit & Vulnerability Assessment
- rateLimiter.js
- ref_react
- app.js
- XglcdFont
- History.jsx
- History.jsx
- devicePairingService.js
- vitest
- server.js
- mongoose
- deviceProvisioning.test.js
- steps
- telemetryService.js
- phase1Integration.test.js
- devicePairingService.js
- react-icons
- 5. End-to-End Integration Test Suite
- frontend/src/lib/apiClient.js
- deviceProvisioning.test.js
- emergencySessionApi.test.js
- sanitizeObject
- Icons.js
- Contributing to SWAAS
- HistoryScreen.js
- react-router-dom
- critical-section-guard.js
- reviews
- ili9341.py
- BottomTabBar.js
- emergencySessionController.js
- Day 6 — Privacy, Security, Authorization & Audit Logging
- mongodb
- expo
- SWAAS / TrailGuard Codebase Architecture & Modular Organization
- Day 5 — WebSocket & Emergency Communication
- logger.js
- Unified AI Agent Guardrails & Zero-Tolerance Policies
- sanitizeObject
- allowBuilds
- socketManager.test.js
- ref_crypto
- services
- backend
- frontend
- backend
- healthcheck
- TrailGuard deployment runbook
- SettingsScreen
- scripts
- build
- build
- environment
- What Should Be Reported
- swagger.js
- max30100.py
- TrailGuard / SWAAS — Claude Assistant Directives
- Copilot CLI Workflow
- AppNavigator.js
- ci-failure-fixer.agent.md
- pr-preflight.agent.md
- security-triage.agent.md
- GitHub Copilot & Codex Instructions — TrailGuard / SWAAS
- CI Failure Debugging
- tests/sanitizeEmail.test.js
- Security Alert Triage
- dependencies
- Settings.jsx
- Icons.js
- ApiError
- check-all.sh
- setup-env.sh

## God Nodes (most connected - your core abstractions)
1. `Display` - 41 edges
2. `AppError` - 38 edges
3. `useAppTheme()` - 33 edges
4. `mongoose` - 28 edges
5. `useAuth()` - 21 edges
6. `useAuth()` - 21 edges
7. `13. Day 3 exit criteria and concrete architectural answers` - 21 edges
8. `react-native` - 21 edges
9. `MAX30100` - 20 edges
10. `App()` - 18 edges

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

## Communities (120 total, 30 thin omitted)

### Community 0 - "AuthContext.js"
Cohesion: 0.10
Nodes (29): deferred(), device, request(), App(), AppContent(), API_URL, WS_URL, AuthContext (+21 more)

### Community 1 - "SWAAS / TrailGuard — Unified AI Agent Directives & Architecture"
Cohesion: 0.10
Nodes (21): 1. System Mission & 4-Tier Architecture, 2. Naming Conventions & Code Style Standards, 3. The 6 Specialized AI Agent Personas, 4. Mandatory Architectural Invariants (Zero-Tolerance Rules), 5. Role-Based Access Control (RBAC) Matrix, 6. Prohibited Anti-Patterns (Anti-Hallucination Directives), 7. Knowledge Graph & Architecture Navigation (Graphify), 8. User-Mandated Agent Guardrails & Invariants (+13 more)

### Community 2 - "critical-section-guard.js"
Cohesion: 0.20
Nodes (7): checkDir(), checkSymbols, { execSync }, fs, path, rootDir, total

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (42): dependencies, maplibre-gl@^6.14.0, react@^19.3.0, react-dom@^19.3.0, react-icons@^5.7.0, react-phone-number-input@^3.4.18, react-router-dom@^7.18.4, typewriter-effect@^2.22.0 (+34 more)

### Community 4 - "Dashboard.jsx"
Cohesion: 0.15
Nodes (16): ACTIVITY_STYLES, ActivitySummary(), MiniGraph(), SummaryItem(), LiveLocationCard(), RecentEventsCard(), DropletIcon(), HeartIcon() (+8 more)

### Community 5 - "mobile/package.json"
Cohesion: 0.06
Nodes (44): dependencies, expo@~57.0.31, expo-device@~57.0.2, expo-linking@~57.0.13, expo-location@~57.0.22, expo-notifications@~57.0.24, expo-secure-store@~57.0.4, expo-status-bar@~57.0.1 (+36 more)

### Community 6 - "jobs"
Cohesion: 0.06
Nodes (43): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+35 more)

### Community 7 - "backend/package.json"
Cohesion: 0.08
Nodes (33): passport, dependencies, bcrypt@^6.0.0, connect-mongo@^6.0.0, cors@^2.8.5, dotenv@^18.0.8, express-rate-limit@^8.7.1, express-session@^1.18.0 (+25 more)

### Community 8 - "frontend/src/lib/apiClient.js"
Cohesion: 0.05
Nodes (47): getDevice, getUserDevices, registerDevice(), renameDevice, unpairDevice, updateStatus, getHistory, getLatest (+39 more)

### Community 9 - "StatCard.jsx"
Cohesion: 0.11
Nodes (20): BarTrace(), ChartCard(), GaugeBar(), LineTrace(), Sparkline(), TemperatureGauge(), MiniStats(), QuickStatsGrid() (+12 more)

### Community 10 - "mongoose"
Cohesion: 0.07
Nodes (37): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+29 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (16): app, cors, express, helmet, passport, clientUrls, config, authorizeSessionSubscription() (+8 more)

### Community 12 - "App.jsx"
Cohesion: 0.15
Nodes (15): App(), ErrorBoundary, FallAlertModal(), ProtectedRoute(), useAuth(), DeviceProvider(), saveToken(), hasText() (+7 more)

### Community 13 - "Settings.jsx"
Cohesion: 0.06
Nodes (31): name, runs-on, steps, strategy, concurrency, cancel-in-progress, group, jobs (+23 more)

### Community 14 - "supertest"
Cohesion: 0.19
Nodes (9): devDependencies, jest@^30.5.2, supertest@^7.3.1, overrides, ip-address, minimatch, qs, jest (+1 more)

### Community 15 - "LiveDataContext.jsx"
Cohesion: 0.06
Nodes (59): PairDevicePanel(), API_URL, APP_NAME, config, IS_DEVELOPMENT, IS_PRODUCTION, normalizedApi, WS_URL (+51 more)

### Community 16 - "AppNavigator.js"
Cohesion: 0.15
Nodes (12): 1. Clone & Install Dependencies, 2. Configure Environment Files, 3. Start the Subsystems, ⚡ Core Capabilities, 📖 In-Depth Documentation, 📄 License & Safety Notice, Prerequisites, 🚀 Quickstart (Run Full Stack) (+4 more)

### Community 17 - "main.c"
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
Cohesion: 0.18
Nodes (11): CI/CD Security, Out of Scope, Reporting a Vulnerability, Responsible Disclosure, Security Policy, Security Practices, Security Response Process, Security Scope (+3 more)

### Community 27 - "simulate-esp32.js"
Cohesion: 0.21
Nodes (18): buildTelemetryPacket(), clamp(), createSignature(), crypto, fs, generateEnvironment(), generateLocation(), generateMotion() (+10 more)

### Community 28 - "User.js"
Cohesion: 0.16
Nodes (11): bcrypt, mongoose, userSchema, crypto, mongoose, webSocketTicketSchema, consumeTicket(), createTicket() (+3 more)

### Community 29 - "13. Day 3 exit criteria and concrete architectural answers"
Cohesion: 0.05
Nodes (39): hasPermission(), ROLE_PERMISSIONS, authorizePermission(), authorizeRole(), crypto, deviceAuthMiddleware(), reject(), sha256() (+31 more)

### Community 30 - "SWAAS / TrailGuard — Unified AI Agent Directives & Architecture"
Cohesion: 0.13
Nodes (14): patterns, patterns, backend-dependencies, frontend-dependencies, mobile-dependencies, patterns, interval, updates (+6 more)

### Community 31 - "Device.js"
Cohesion: 0.20
Nodes (9): connectDB(), mongoose, seedDevices(), mongoose, runSeeds(), SEED_USERS, seedUsers(), deviceSchema (+1 more)

### Community 32 - "MPU6050"
Cohesion: 0.11
Nodes (9): 1. High-Level Component Flowchart, 2.1 Hardware Sensing Tier (`hardware/`), 2.2 Local-First Mobile Companion (`mobile/`), 2.3 Express & MongoDB Backend (`backend/`), 2.4 Monitoring & Rescue Dashboard (`frontend/`), 2. Architectural Subsystem Breakdown, 3. Related Specifications & Architecture Documentation, System Architecture & Component Topology (+1 more)

### Community 33 - "Day 3 — Device and API Architecture"
Cohesion: 0.05
Nodes (40): 10. Architecture diagrams, 11. Verification plan, 12. Current implementation gaps and rollout gates, 1. Goals and non-goals, 2. System components and trust boundaries, 3. Device identity, lifecycle, and ownership, 4. BLE protocol and connection behavior, 5. Local-first storage and privacy (+32 more)

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
Cohesion: 0.14
Nodes (13): name, runs-on, steps, jobs, dependency-review, name, on, pull_request (+5 more)

### Community 38 - "ref_react"
Cohesion: 0.15
Nodes (27): AlertCard(), styles, AppHeader(), styles, FallAlertModal(), styles, BellIcon(), PinIcon() (+19 more)

### Community 39 - "app.js"
Cohesion: 0.09
Nodes (27): completePairingChallenge, getTelemetryReceipt, startPairingChallenge, getDeviceById(), registerDevice(), renameDevice(), unpairDevice(), updateDeviceStatus() (+19 more)

### Community 41 - "History.jsx"
Cohesion: 0.18
Nodes (11): completeProfile, getMe, login, register, completeProfile(), getCurrentUser(), jwt, loginUser() (+3 more)

### Community 42 - "History.jsx"
Cohesion: 0.16
Nodes (21): AppLayout(), items, MobileNav(), LoadingSpinner(), ModalButtons(), ModalHeader(), NAV_ITEMS, Sidebar() (+13 more)

### Community 45 - "vitest"
Cohesion: 0.22
Nodes (8): 1. Install Dependencies, 2. Start Expo Development Server, ⚡ Core Architecture, 🔐 Environment Configuration, 🚀 Getting Started, 📂 Subsystem Structure, 📱 TrailGuard Mobile Companion, 🧪 Verification & CI Checks

### Community 47 - "mongoose"
Cohesion: 0.12
Nodes (14): validate(), auditLogSchema, crypto, mongoose, crypto, emergencySessionSchema, mongoose, mongoose (+6 more)

### Community 48 - "deviceProvisioning.test.js"
Cohesion: 0.33
Nodes (5): blank_issues_enabled, contact_links, about, name, url

### Community 49 - "steps"
Cohesion: 0.07
Nodes (27): concurrency, cancel-in-progress, group, GITHUB_TOKEN, jobs, sync-wiki, name, on (+19 more)

### Community 50 - "telemetryService.js"
Cohesion: 0.10
Nodes (16): environmentReadingSchema, mongoose, fallEventSchema, mongoose, locationReadingSchema, mongoose, mongoose, vitalsReadingSchema (+8 more)

### Community 51 - "phase1Integration.test.js"
Cohesion: 0.07
Nodes (24): crypto, jwt, mockAuditCreate, mockAuditFind, mockBroadcastEmergencyEvent, mockDeviceCreate, mockDeviceFind, mockDeviceFindOne (+16 more)

### Community 52 - "devicePairingService.js"
Cohesion: 0.16
Nodes (15): devicePairingSchema, mongoose, assertDeviceAuthorizationConfigured(), canonicalReceiptPayload(), crypto, getAuthorityPrivateKey(), issueDeviceAuthorizationReceipt(), verifyDeviceAuthorizationReceipt() (+7 more)

### Community 53 - "react-icons"
Cohesion: 0.36
Nodes (4): NotificationBell(), ProfileMenu(), DashboardHeader(), react-icons

### Community 54 - "5. End-to-End Integration Test Suite"
Cohesion: 0.33
Nodes (6): 5. End-to-End Integration Test Suite, Journey 1: Citizen Registration, Login & Profile Retrieval, Journey 2: Hardware Device Security & Cryptographic Pairing, Journey 3: Emergency Session Lifecycle & Real-Time Streaming, Journey 4: Fail-Closed Security Audit Logging & Historical Telemetry Window, Journey 5: Privacy Boundaries & Invariant Enforcement

### Community 55 - "frontend/src/lib/apiClient.js"
Cohesion: 0.15
Nodes (14): PRECACHE_ASSETS, AuthContext, AuthProvider(), DeviceContext, authApi, clearToken(), devicesApi, environmentApi (+6 more)

### Community 56 - "deviceProvisioning.test.js"
Cohesion: 0.17
Nodes (17): createPairingQrPayload(), fs, main(), mongoose, parseArguments(), path, printHelp(), QRCode (+9 more)

### Community 57 - "emergencySessionApi.test.js"
Cohesion: 0.11
Nodes (18): crypto, mockAuditLogCreate, mockAuditLogFind, mockBroadcastEmergencyEvent, mockCurrentUser, mockDeviceFindOne, mockEmergencySessionCreate, mockEmergencySessionFind (+10 more)

### Community 58 - "sanitizeObject"
Cohesion: 0.18
Nodes (10): status(), 1. Objective and Invariants, 2. Risk Engine Architecture, 3.1 `EmergencySession` (`backend/models/EmergencySession.js`), 3.2 `RiskAssessment` (`backend/models/RiskAssessment.js`), 3.3 `AuditLog` (`backend/models/AuditLog.js`), 3. Data Models Specification, 4. Verification and Acceptance Checklist (+2 more)

### Community 60 - "Icons.js"
Cohesion: 0.21
Nodes (12): ActivityCard(), Item(), styles, DeviceCard(), styles, BatteryIcon(), BootIcon(), ClockIcon() (+4 more)

### Community 61 - "Contributing to SWAAS"
Cohesion: 0.20
Nodes (9): 1. Clone the repository, 2. Install dependencies, 3. Run with Docker Compose, 🌿 Branching and Commit Guidelines, Contributing to SWAAS, 🛠️ Development Setup & Prerequisites, 🔒 Security & Privacy Invariants, 🏗️ System Architecture Overview (+1 more)

### Community 62 - "HistoryScreen.js"
Cohesion: 0.22
Nodes (12): Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry), DropletIcon(), HeartIcon(), OxygenIcon(), PressureIcon(), ThermometerIcon(), useDevices(), useHistoryData() (+4 more)

### Community 64 - "react-router-dom"
Cohesion: 0.42
Nodes (6): ThemeContext, ThemeProvider(), useTheme(), Landing(), SpatialHardwareViewer(), VibrantDynamicBackground()

### Community 65 - "critical-section-guard.js"
Cohesion: 0.17
Nodes (10): auditLogPath, BLOCKED_COMMAND_RULES, deny(), fs, inputRaw, logBlockEvent(), logDir, path (+2 more)

### Community 66 - "reviews"
Cohesion: 0.15
Nodes (12): base_branches, drafts, enabled, chat, auto_reply, language, reviews, auto_review (+4 more)

### Community 68 - "BottomTabBar.js"
Cohesion: 0.24
Nodes (11): BottomTabBar(), styles, tabs, AlertIcon(), HistoryIcon(), HomeIcon(), MapIcon(), SettingsIcon() (+3 more)

### Community 69 - "emergencySessionController.js"
Cohesion: 0.27
Nodes (11): assignOrJoinResponder, createSession, extractMeta(), generateWsTicket, getActiveSessions, getHistoricalData, getSessionAudit, getSessionById (+3 more)

### Community 70 - "Day 6 — Privacy, Security, Authorization & Audit Logging"
Cohesion: 0.17
Nodes (12): 1. Objective and Invariants, 2. Security & Trust Architecture, 3.1 Historical Replay Authorization Matrix, 3.2 Ephemeral Data Retention Rules, 3. Data Protection Specification, 4. Structured Redacted Logging, 5. Security Verification & Test Results, 6. Day 6 Exit Criteria Checklist (+4 more)

### Community 71 - "mongodb"
Cohesion: 0.18
Nodes (11): MONGO_INITDB_DATABASE, MONGO_INITDB_ROOT_PASSWORD, MONGO_INITDB_ROOT_USERNAME, container_name, environment, image, networks, ports (+3 more)

### Community 73 - "expo"
Cohesion: 0.08
Nodes (23): backgroundColor, foregroundImage, adaptiveIcon, package, permissions, expo, android, icon (+15 more)

### Community 74 - "SWAAS / TrailGuard Codebase Architecture & Modular Organization"
Cohesion: 0.18
Nodes (11): 1. Architectural Philosophy & Layered Separation, 2.1 Backend (`backend/`), 2.2 Frontend Web Dashboard (`frontend/`), 2.3 Mobile Companion App (`mobile/`), 2. Directory Structure Across All Tiers, 3.1 Backend: `AppError` & Centralized Middleware, 3.2 Frontend & Mobile: Standardized `ApiError`, 3. Standardized Error Handling Architecture (+3 more)

### Community 75 - "Day 5 — WebSocket & Emergency Communication"
Cohesion: 0.18
Nodes (11): 1. Objective and Invariants, 2. Target Architecture, 3.1 Connection Handshake, 3.2 Client-to-Server Actions, 3.3 Server-to-Client Broadcast Events, 3. Real-Time Protocol Specification, 4. Emergency REST API Specification, 5. Security and Privacy Guarantees (+3 more)

### Community 76 - "logger.js"
Cohesion: 0.43
Nodes (6): formatLog(), logger, sanitizeString(), sanitizeValue(), SENSITIVE_KEYS, SENSITIVE_PATTERNS

### Community 77 - "Unified AI Agent Guardrails & Zero-Tolerance Policies"
Cohesion: 0.20
Nodes (9): 1. Mandatory Approval Gate (No Blind Execution), 2. Zero Git Commands (Human-Operated Only), 3. Outbound Network & External Communication Lock, 4. Package Installation & Hardhat Guard, 5. Docker & Container Command Block, 6. Database Protection (Zero Direct Deletions), 7. Zero File Deletion, 8. Strict Workspace Boundary (+1 more)

### Community 78 - "sanitizeObject"
Cohesion: 0.53
Nodes (3): FORBIDDEN_OPERATORS, injectionGuard(), sanitizeObject()

### Community 79 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, esbuild, maplibre-gl, overrides, source-map-js

### Community 81 - "socketManager.test.js"
Cohesion: 0.13
Nodes (11): jsonwebtoken@^9.0.2, jwt, mockUserCreate, mockUserFindById, mockUserFindByIdAndUpdate, mockUserFindOne, request, EventEmitter (+3 more)

### Community 83 - "ref_crypto"
Cohesion: 0.29
Nodes (6): crypto, fs, generateAuthorityKeys(), parseArguments(), path, writeExclusive()

### Community 84 - "services"
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

### Community 89 - "TrailGuard deployment runbook"
Cohesion: 0.25
Nodes (7): Environment boundaries, Production release, Required configuration, Rollback procedure, Rollback triggers, Staging release, TrailGuard deployment runbook

### Community 91 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, dev, simulate, start, test

### Community 94 - "build"
Cohesion: 0.33
Nodes (7): VITE_API_URL, VITE_WS_URL, build, args, context, dockerfile, build

### Community 95 - "build"
Cohesion: 0.15
Nodes (12): allowBuilds, react-native-screens, minimumReleaseAgeExclude, overrides, decode-uri-component, glob@>=9.0.0 <=14.0.1, minimatch@<11.0.1, node-forge (+4 more)

### Community 96 - "environment"
Cohesion: 0.29
Nodes (7): environment, CLIENT_URLS, JWT_SECRET, MONGODB_URI, NODE_ENV, PORT, SESSION_SECRET

### Community 98 - "What Should Be Reported"
Cohesion: 0.29
Nodes (7): Authentication, Authorization, Data Security, Device Security, Emergency and Safety Workflows, Infrastructure and CI/CD, What Should Be Reported

### Community 101 - "TrailGuard / SWAAS — Claude Assistant Directives"
Cohesion: 0.40
Nodes (4): 📐 Code Style & Conventions, 🔒 Mandatory Architectural Invariants, 🧭 Multi-Tier Verification Gates, TrailGuard / SWAAS — Claude Assistant Directives

### Community 102 - "Copilot CLI Workflow"
Cohesion: 0.50
Nodes (3): Copilot CLI Workflow, Prompt template, Recommended flow

### Community 104 - "AppNavigator.js"
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

### Community 115 - "Settings.jsx"
Cohesion: 0.19
Nodes (13): AuthCard(), AuthLayout(), FEATURES, Button(), Field(), PhoneField(), InfoRow(), DeviceCard() (+5 more)

## Knowledge Gaps
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` connect `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` to `ARCHITECTURE.md`?**
  _High betweenness centrality (0.334) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `AppError` (e.g. with `2. Naming Conventions & Code Style Standards` and `📐 Code Style & Conventions`) actually correct?**
  _`AppError` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `AuthContext.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._
- **Why does `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` connect `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` to `HistoryScreen.js`?**
  _High betweenness centrality (0.263) - this node is a cross-community bridge._
- **Should `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry)` connect `HistoryScreen.js` to `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture`?**
  _High betweenness centrality (0.261) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0549645390070922 - nodes in this community are weakly interconnected._