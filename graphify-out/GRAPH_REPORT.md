# Graph Report - TrailGuard  (2026-11-08)

## Corpus Check
- 255 files · ~121,640 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: (none) 13, .example 4, .conf 1)

## Summary
- 1875 nodes · 3211 edges · 121 communities (97 shown, 24 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 103 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b7fc0064`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- 4. Mandatory Architectural Invariants (Zero-Tolerance Rules)
- check-syntax.js
- frontend/package.json
- StatCard.jsx
- mobile/package.json
- with
- dependencies
- express
- Dashboard.jsx
- steps
- deviceAuthMiddleware.js
- frontend/src/lib/apiClient.js
- Settings.jsx
- deviceController.js
- supertest
- 🛡️ TrailGuard / SWAAS
- LiveDataContext.jsx
- Dashboard.jsx
- App.jsx
- deviceController.js
- ⚙️ SWAAS Backend API & Realtime Service
- Display
- 13. Day 3 exit criteria and concrete architectural answers
- MAX30100
- Contributor Covenant Code of Conduct
- Security Policy
- passport
- rateLimiter.js
- updates
- db.js
- deviceController.js
- socketManager.js
- frontend/src/lib/apiClient.js
- SWAAS / TrailGuard Security Audit & Vulnerability Assessment
- rateLimiter.js
- authRoutes.js
- app.js
- XglcdFont
- deviceRegistrationRoutes.js
- supertest
- .clear
- 5. End-to-End Integration Test Suite
- deviceRegistrationRoutes.js
- environmentController.js
- mongoose
- Sidebar.jsx
- vitalsController.js
- telemetryService.js
- environmentService.js
- appError.js
- locationController.js
- VitalsReading.js
- Day 6 — Privacy, Security, Authorization & Audit Logging
- XglcdFont
- react-native-safe-area-context
- emergencySessionController.js
- devicePairingService.js
- passport
- MAX30100
- environmentController.js
- telemetryService.js
- SWAAS / TrailGuard Codebase Architecture & Modular Organization
- Day 5 — WebSocket & Emergency Communication
- 📱 TrailGuard Mobile Companion
- DashboardScreen.js
- socketManager.js
- emergencyRoutes.js
- DeviceContext.jsx
- frontend/src/lib/apiClient.js
- Contributing to SWAAS
- Day 3 — Device and API Architecture
- fallService.js
- socketManager.test.js
- LoginScreen.js
- deviceService.js
- steps
- fallService.js
- services
- frontend
- backend
- healthcheck
- scripts
- logger.js
- ci-failure-fixer.agent.md
- response.js
- reviews
- env
- build
- allowBuilds
- environment
- frontend
- ⚙️ SWAAS Backend API & Realtime Service
- contact_links
- on
- mobile/src/lib/profileCompletion.js
- with
- authService.js
- backend
- mobile
- SWAAS / TrailGuard Security Audit & Vulnerability Assessment
- appError.js
- InfoRow.jsx
- Icons.js
- max30100.py
- dependencies
- vitalsController.js
- vercel.json
- GEMINI.md

## God Nodes (most connected - your core abstractions)
1. `react` - 61 edges
2. `Display` - 41 edges
3. `AppError` - 39 edges
4. `useAppTheme()` - 33 edges
5. `mongoose` - 28 edges
6. `useAuth()` - 21 edges
7. `13. Day 3 exit criteria and concrete architectural answers` - 21 edges
8. `react-native` - 21 edges
9. `MAX30100` - 20 edges
10. `useAuth()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `2. Naming Conventions & Code Style Standards` --references--> `AppError`  [INFERRED]
  AGENTS.md → backend/utils/appError.js
- `3.1 Backend: `AppError` & Centralized Middleware` --references--> `AppError`  [INFERRED]
  docs/architecture/CODEBASE_ORGANIZATION.md → backend/utils/appError.js
- `3. Mandatory Architectural Invariant Compliance Review` --references--> `getHistoricalData()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/services/emergencySessionService.js
- `Journey 4: Fail-Closed Security Audit Logging & Historical Telemetry Window` --references--> `getHistoricalData()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/services/emergencySessionService.js
- `Supported Versions` --references--> `main()`  [INFERRED]
  SECURITY.md → backend/scripts/provision-device.js

## Import Cycles
- None detected.

## Communities (121 total, 24 thin omitted)

### Community 0 - "react"
Cohesion: 0.07
Nodes (50): PairDevicePanel(), LiveDataContext, LiveDataProvider(), devicePairingApi, BLE_AUTHENTICATION_TIMEOUT_MS, BLE_CONNECT_TIMEOUT_MS, BLE_STALE_TIMEOUT_MS, BleAuthorizationError (+42 more)

### Community 1 - "4. Mandatory Architectural Invariants (Zero-Tolerance Rules)"
Cohesion: 0.06
Nodes (24): app_main(), append_authorization_challenge(), authority_public_key_available(), build_device_info(), build_telemetry_frame(), format_uuid(), gap_event(), gatt_access() (+16 more)

### Community 2 - "check-syntax.js"
Cohesion: 0.18
Nodes (11): MONGO_INITDB_DATABASE, MONGO_INITDB_ROOT_PASSWORD, MONGO_INITDB_ROOT_USERNAME, container_name, environment, image, networks, ports (+3 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): dependencies, maplibre-gl@^6.14.0, react@^19.3.0, react-dom@^19.3.0, react-icons@^5.7.0, react-phone-number-input@^3.4.18, react-router-dom@^7.18.4, typewriter-effect@^2.22.0 (+32 more)

### Community 4 - "StatCard.jsx"
Cohesion: 0.09
Nodes (21): authenticatedTelemetryRequest(), createDeviceAuthHeaders(), crypto, mockDeviceAuthNonceCreate, mockDeviceCreate, mockDeviceFindOne, mockDeviceFindOneAndUpdate, mockDevicePairingCreate (+13 more)

### Community 5 - "mobile/package.json"
Cohesion: 0.06
Nodes (41): dependencies, expo@~57.0.31, expo-device@~57.0.2, expo-linking@~57.0.13, expo-location@~57.0.22, expo-notifications@~57.0.24, expo-secure-store@~57.0.4, expo-status-bar@~57.0.1 (+33 more)

### Community 6 - "with"
Cohesion: 0.18
Nodes (10): concurrency, cancel-in-progress, group, name, runs-on, jobs, hardware, name (+2 more)

### Community 7 - "dependencies"
Cohesion: 0.09
Nodes (28): dependencies, bcrypt@^6.0.0, connect-mongo@^6.0.0, cors@^2.8.5, dotenv@^18.0.7, express-rate-limit@^8.7.1, express-session@^1.18.0, helmet@^8.3.0 (+20 more)

### Community 9 - "Dashboard.jsx"
Cohesion: 0.20
Nodes (19): AlertCard(), styles, AppHeader(), styles, FallAlertModal(), styles, BellIcon(), GearIcon() (+11 more)

### Community 10 - "steps"
Cohesion: 0.09
Nodes (18): validate(), auditLogSchema, crypto, mongoose, crypto, emergencySessionSchema, mongoose, environmentReadingSchema (+10 more)

### Community 11 - "deviceAuthMiddleware.js"
Cohesion: 0.20
Nodes (15): assignOrJoinResponder(), createSession(), crypto, getHistoricalData(), getSessionAudit(), getSessionById(), mongoose, recordAudit() (+7 more)

### Community 12 - "frontend/src/lib/apiClient.js"
Cohesion: 0.07
Nodes (37): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+29 more)

### Community 13 - "Settings.jsx"
Cohesion: 0.24
Nodes (11): Button(), Field(), PhoneField(), InfoRow(), DeviceCard(), FallAlertModal(), useLiveData(), ThemeContext (+3 more)

### Community 14 - "deviceController.js"
Cohesion: 0.06
Nodes (31): name, runs-on, steps, strategy, concurrency, cancel-in-progress, group, jobs (+23 more)

### Community 15 - "supertest"
Cohesion: 0.07
Nodes (24): crypto, jwt, mockAuditCreate, mockAuditFind, mockBroadcastEmergencyEvent, mockDeviceCreate, mockDeviceFind, mockDeviceFindOne (+16 more)

### Community 16 - "🛡️ TrailGuard / SWAAS"
Cohesion: 0.14
Nodes (14): CheckIcon(), useAuth(), hasText(), isProfileComplete(), AppNavigator(), AuthenticatedStack(), AuthStack(), ProfileStack() (+6 more)

### Community 17 - "LiveDataContext.jsx"
Cohesion: 0.15
Nodes (12): 1. Clone & Install Dependencies, 2. Configure Environment Files, 3. Start the Subsystems, ⚡ Core Capabilities, 📖 In-Depth Documentation, 📄 License & Safety Notice, Prerequisites, 🚀 Quickstart (Run Full Stack) (+4 more)

### Community 18 - "Dashboard.jsx"
Cohesion: 0.08
Nodes (29): ACTIVITY_STYLES, ActivitySummary(), MiniGraph(), SummaryItem(), MiniStats(), LiveLocationCard(), QuickStatsGrid(), RecentEventsCard() (+21 more)

### Community 19 - "App.jsx"
Cohesion: 0.20
Nodes (17): App(), ProtectedRoute(), AuthContext, AuthProvider(), useAuth(), DeviceProvider(), ThemeProvider(), clearToken() (+9 more)

### Community 20 - "deviceController.js"
Cohesion: 0.11
Nodes (9): 1. High-Level Component Flowchart, 2.1 Hardware Sensing Tier (`hardware/`), 2.2 Local-First Mobile Companion (`mobile/`), 2.3 Express & MongoDB Backend (`backend/`), 2.4 Monitoring & Rescue Dashboard (`frontend/`), 2. Architectural Subsystem Breakdown, 3. Related Specifications & Architecture Documentation, System Architecture & Component Topology (+1 more)

### Community 21 - "⚙️ SWAAS Backend API & Realtime Service"
Cohesion: 0.10
Nodes (30): deferred(), device, request(), App(), AppContent(), API_URL, WS_URL, AuthContext (+22 more)

### Community 22 - "Display"
Cohesion: 0.20
Nodes (9): 1. Install Dependencies, 2. Start Development Server, 3. Build for Production, 🔐 Environment Configuration, 🚀 Getting Started, ⚡ Key Capabilities, 📂 Subsystem Structure, 🧪 Testing (+1 more)

### Community 23 - "13. Day 3 exit criteria and concrete architectural answers"
Cohesion: 0.06
Nodes (29): authorizeRole(), crypto, deviceAuthMiddleware(), reject(), sha256(), deviceAuthNonceSchema, mongoose, crypto (+21 more)

### Community 24 - "MAX30100"
Cohesion: 0.18
Nodes (7): crypto, mongoose, webSocketTicketSchema, consumeTicket(), crypto, mongoose, Journey 3: Emergency Session Lifecycle & Real-Time Streaming

### Community 25 - "Contributor Covenant Code of Conduct"
Cohesion: 0.33
Nodes (6): adminLimiter, apiLimiter, deviceLimiter, telemetryLimiter, express, express

### Community 29 - "rateLimiter.js"
Cohesion: 0.08
Nodes (23): backgroundColor, foregroundImage, adaptiveIcon, package, permissions, expo, android, icon (+15 more)

### Community 30 - "updates"
Cohesion: 0.15
Nodes (13): 1. System Mission & 4-Tier Architecture, 2. Naming Conventions & Code Style Standards, 3. The 6 Specialized AI Agent Personas, 5. Role-Based Access Control (RBAC) Matrix, 6. Prohibited Anti-Patterns (Anti-Hallucination Directives), 7. Knowledge Graph & Architecture Navigation (Graphify), 🛡️ Agent 1: Security & Cryptography Specialist, ☁️ Agent 2: Cloud Backend & Realtime Architect (+5 more)

### Community 31 - "db.js"
Cohesion: 0.11
Nodes (18): crypto, mockAuditLogCreate, mockAuditLogFind, mockBroadcastEmergencyEvent, mockCurrentUser, mockDeviceFindOne, mockEmergencySessionCreate, mockEmergencySessionFind (+10 more)

### Community 34 - "socketManager.js"
Cohesion: 0.14
Nodes (21): AppLayout(), LoadingSpinner(), ModalButtons(), ModalHeader(), NAV_ITEMS, Sidebar(), DeviceContext, useDevices() (+13 more)

### Community 35 - "frontend/src/lib/apiClient.js"
Cohesion: 0.21
Nodes (9): NotificationBell(), ProfileMenu(), AuthCard(), AuthLayout(), FEATURES, DashboardHeader(), EMPTY, Register() (+1 more)

### Community 36 - "SWAAS / TrailGuard Security Audit & Vulnerability Assessment"
Cohesion: 0.11
Nodes (18): Authentication, Authorization, CI/CD Security, Data Security, Device Security, Emergency and Safety Workflows, Infrastructure and CI/CD, Out of Scope (+10 more)

### Community 37 - "rateLimiter.js"
Cohesion: 0.23
Nodes (9): jwt, queryLimiter, express@^5.3.0, express, express, express, express, express (+1 more)

### Community 38 - "authRoutes.js"
Cohesion: 0.05
Nodes (56): crypto, fs, generateAuthorityKeys(), parseArguments(), path, writeExclusive(), createPairingQrPayload(), fs (+48 more)

### Community 39 - "app.js"
Cohesion: 0.14
Nodes (5): cors, express, helmet, mongoose, passport

### Community 40 - "XglcdFont"
Cohesion: 0.12
Nodes (14): getAllDevicesAdmin, getDevice, getUserDevices, registerDevice(), renameDevice, unpairDevice, updateStatus, getLatest (+6 more)

### Community 41 - "deviceRegistrationRoutes.js"
Cohesion: 0.17
Nodes (9): completeProfile, generateWsTicket, getMe, login, register, authLimiter, express, passport (+1 more)

### Community 42 - "supertest"
Cohesion: 0.19
Nodes (9): devDependencies, jest@^30.5.2, supertest@^7.3.1, overrides, ip-address, minimatch, qs, jest (+1 more)

### Community 43 - ".clear"
Cohesion: 0.29
Nodes (7): 4. Mandatory Architectural Invariants (Zero-Tolerance Rules), Invariant 2: Emergency-Bounded Cloud Sharing, Invariant 3: Fail-Closed Security Audit Logging, Invariant 4: Cryptographic Device Authentication, Invariant 5: Ephemeral Retention & Automated TTL Cleanup, Invariant 6: Authenticated, Session-Scoped Real-Time Delivery, Invariant 7: Structured Redacted Logging

### Community 44 - "5. End-to-End Integration Test Suite"
Cohesion: 0.15
Nodes (12): 1. Executive Summary & Objective, 2. Final Phase 1 4-Tier Architecture, 3. Mandatory Architectural Invariant Compliance Review, 4. Legacy TrailGuard → SWAAS Migration Verification, 5. End-to-End Integration Test Suite, 6. Comprehensive Multi-Tier Verification Results, 7. Phase 1 Completion & Readiness Sign-Off, Day 7 — Integration Testing, Architecture Compliance Review & Phase 1 Sign-Off (+4 more)

### Community 45 - "deviceRegistrationRoutes.js"
Cohesion: 0.29
Nodes (6): createLimiter(), rateLimit, express, userPairingLimiter(), express, request

### Community 46 - "environmentController.js"
Cohesion: 0.18
Nodes (4): mongoose, http, mongoose, server

### Community 47 - "mongoose"
Cohesion: 0.07
Nodes (27): concurrency, cancel-in-progress, group, GITHUB_TOKEN, jobs, sync-wiki, name, on (+19 more)

### Community 48 - "Sidebar.jsx"
Cohesion: 0.20
Nodes (9): app, jsonwebtoken@^9.0.2, jwt, mockUserCreate, mockUserFindById, mockUserFindByIdAndUpdate, mockUserFindOne, request (+1 more)

### Community 49 - "vitalsController.js"
Cohesion: 0.14
Nodes (13): allowBuilds, bcrypt, mongodb-memory-server, @parcel/watcher, unrs-resolver, overrides, body-parser, brace-expansion (+5 more)

### Community 51 - "environmentService.js"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 52 - "appError.js"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 53 - "locationController.js"
Cohesion: 0.12
Nodes (16): concurrency, cancel-in-progress, group, name, runs-on, steps, jobs, dependency-review (+8 more)

### Community 54 - "VitalsReading.js"
Cohesion: 0.29
Nodes (5): mongoose, vitalsReadingSchema, getHistory(), getLatest(), getStats()

### Community 55 - "Day 6 — Privacy, Security, Authorization & Audit Logging"
Cohesion: 0.17
Nodes (12): 1. Objective and Invariants, 2. Security & Trust Architecture, 3.1 Historical Replay Authorization Matrix, 3.2 Ephemeral Data Retention Rules, 3. Data Protection Specification, 4. Structured Redacted Logging, 5. Security Verification & Test Results, 6. Day 6 Exit Criteria Checklist (+4 more)

### Community 57 - "react-native-safe-area-context"
Cohesion: 0.22
Nodes (12): BottomTabBar(), styles, tabs, AlertIcon(), HistoryIcon(), HomeIcon(), MapIcon(), SettingsIcon() (+4 more)

### Community 58 - "emergencySessionController.js"
Cohesion: 0.27
Nodes (11): assignOrJoinResponder, createSession, extractMeta(), generateWsTicket, getActiveSessions, getHistoricalData, getSessionAudit, getSessionById (+3 more)

### Community 59 - "devicePairingService.js"
Cohesion: 0.16
Nodes (15): devicePairingSchema, mongoose, assertDeviceAuthorizationConfigured(), canonicalReceiptPayload(), crypto, getAuthorityPrivateKey(), issueDeviceAuthorizationReceipt(), verifyDeviceAuthorizationReceipt() (+7 more)

### Community 60 - "passport"
Cohesion: 0.33
Nodes (5): passport, passport@^0.7.0, passport-google-oauth20@^2.0.0, passport, passport-google-oauth20

### Community 63 - "environmentController.js"
Cohesion: 0.50
Nodes (3): getHistory, getLatest, getStats

### Community 64 - "telemetryService.js"
Cohesion: 0.27
Nodes (8): twilio@^6.1.2, dispatchEmergencyAlerts(), sendEmergencySMS(), twilio, processReadings(), sendEmergencyWhatsApp(), twilio, twilio

### Community 65 - "SWAAS / TrailGuard Codebase Architecture & Modular Organization"
Cohesion: 0.18
Nodes (11): 1. Architectural Philosophy & Layered Separation, 2.1 Backend (`backend/`), 2.2 Frontend Web Dashboard (`frontend/`), 2.3 Mobile Companion App (`mobile/`), 2. Directory Structure Across All Tiers, 3.1 Backend: `AppError` & Centralized Middleware, 3.2 Frontend & Mobile: Standardized `ApiError`, 3. Standardized Error Handling Architecture (+3 more)

### Community 66 - "Day 5 — WebSocket & Emergency Communication"
Cohesion: 0.18
Nodes (11): 1. Objective and Invariants, 2. Target Architecture, 3.1 Connection Handshake, 3.2 Client-to-Server Actions, 3.3 Server-to-Client Broadcast Events, 3. Real-Time Protocol Specification, 4. Emergency REST API Specification, 5. Security and Privacy Guarantees (+3 more)

### Community 67 - "📱 TrailGuard Mobile Companion"
Cohesion: 0.22
Nodes (8): 1. Install Dependencies, 2. Start Expo Development Server, ⚡ Core Architecture, 🔐 Environment Configuration, 🚀 Getting Started, 📂 Subsystem Structure, 📱 TrailGuard Mobile Companion, 🧪 Verification & CI Checks

### Community 69 - "DashboardScreen.js"
Cohesion: 0.15
Nodes (22): Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry), DropletIcon(), HeartIcon(), OxygenIcon(), PinIcon(), PressureIcon(), PulseWave(), ThermometerIcon() (+14 more)

### Community 70 - "socketManager.js"
Cohesion: 0.22
Nodes (11): authorizeSessionSubscription(), broadcast(), broadcastEmergencyEvent(), broadcastTelemetry(), clients, EVENT_FIELDS, initWebSocket(), jwt (+3 more)

### Community 71 - "emergencyRoutes.js"
Cohesion: 0.29
Nodes (7): hasPermission(), ROLE_PERMISSIONS, protect(), authorizePermission(), emergencyRoutes(), express, createApiRouter()

### Community 72 - "DeviceContext.jsx"
Cohesion: 0.15
Nodes (12): 1. Correction, 2. Warning, 3. Temporary Ban, 4. Permanent Ban, Attribution, Contributor Covenant Code of Conduct, Enforcement, Enforcement Guidelines (+4 more)

### Community 73 - "frontend/src/lib/apiClient.js"
Cohesion: 0.12
Nodes (17): API_URL, APP_NAME, config, IS_DEVELOPMENT, IS_PRODUCTION, normalizedApi, WS_URL, authApi (+9 more)

### Community 74 - "Contributing to SWAAS"
Cohesion: 0.20
Nodes (9): 1. Clone the repository, 2. Install dependencies, 3. Run with Docker Compose, 🌿 Branching and Commit Guidelines, Contributing to SWAAS, 🛠️ Development Setup & Prerequisites, 🔒 Security & Privacy Invariants, 🏗️ System Architecture Overview (+1 more)

### Community 75 - "Day 3 — Device and API Architecture"
Cohesion: 0.05
Nodes (40): 10. Architecture diagrams, 11. Verification plan, 12. Current implementation gaps and rollout gates, 1. Goals and non-goals, 2. System components and trust boundaries, 3. Device identity, lifecycle, and ownership, 4. BLE protocol and connection behavior, 5. Local-first storage and privacy (+32 more)

### Community 76 - "fallService.js"
Cohesion: 0.20
Nodes (9): 1. Objective and Invariants, 2. Risk Engine Architecture, 3.1 `EmergencySession` (`backend/models/EmergencySession.js`), 3.2 `RiskAssessment` (`backend/models/RiskAssessment.js`), 3.3 `AuditLog` (`backend/models/AuditLog.js`), 3. Data Models Specification, 4. Verification and Acceptance Checklist, Day 4 — Risk & Emergency Models (+1 more)

### Community 77 - "socketManager.test.js"
Cohesion: 0.18
Nodes (7): config, configuredOrigins, defaultDevOrigins, requiredInProduction, EventEmitter, jwt, { PassThrough }

### Community 78 - "LoginScreen.js"
Cohesion: 0.29
Nodes (7): EyeIcon(), EyeOffIcon(), ShieldIcon(), LoginScreen(), styles, RegisterScreen(), styles

### Community 80 - "deviceService.js"
Cohesion: 0.17
Nodes (8): deviceSchema, mongoose, getDeviceById(), pairedOrLegacyDeviceState, registerDevice(), renameDevice(), unpairDevice(), updateDeviceStatus()

### Community 81 - "steps"
Cohesion: 0.29
Nodes (11): steps, name, runs-on, steps, steps, steps, deployment-config, name (+3 more)

### Community 82 - "fallService.js"
Cohesion: 0.25
Nodes (6): fallEventSchema, mongoose, getLatestFall(), getUserFalls(), mongoose, updateFallStatus()

### Community 83 - "services"
Cohesion: 0.25
Nodes (7): driver, networks, trailguard-net, services, driver, volumes, mongo_data

### Community 84 - "frontend"
Cohesion: 0.25
Nodes (8): condition, backend, container_name, depends_on, networks, ports, restart, frontend

### Community 85 - "backend"
Cohesion: 0.25
Nodes (8): container_name, depends_on, networks, ports, restart, mongodb, condition, backend

### Community 88 - "healthcheck"
Cohesion: 0.50
Nodes (8): healthcheck, healthcheck, interval, retries, start_period, test, timeout, healthcheck

### Community 89 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, dev, generate-device-authority-keys, provision-device, simulate, start, test

### Community 90 - "logger.js"
Cohesion: 0.43
Nodes (5): formatLog(), isProductionEnv(), logger, sanitizeValue(), SENSITIVE_KEY_PATTERNS

### Community 92 - "response.js"
Cohesion: 0.13
Nodes (14): patterns, patterns, backend-dependencies, frontend-dependencies, mobile-dependencies, patterns, interval, updates (+6 more)

### Community 93 - "reviews"
Cohesion: 0.15
Nodes (12): base_branches, drafts, enabled, chat, auto_reply, language, reviews, auto_review (+4 more)

### Community 94 - "env"
Cohesion: 0.25
Nodes (8): CLIENT_URLS, JWT_SECRET, MONGO_DB_NAME, MONGO_ROOT_PASSWORD, MONGO_ROOT_USER, SESSION_SECRET, VITE_WS_URL, env

### Community 95 - "build"
Cohesion: 0.33
Nodes (7): VITE_API_URL, VITE_WS_URL, build, args, context, dockerfile, build

### Community 96 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, esbuild, maplibre-gl, overrides, source-map-js

### Community 97 - "environment"
Cohesion: 0.29
Nodes (7): environment, CLIENT_URLS, JWT_SECRET, MONGODB_URI, NODE_ENV, PORT, SESSION_SECRET

### Community 98 - "frontend"
Cohesion: 0.29
Nodes (7): run, defaults, name, runs-on, frontend, defaults, working-directory

### Community 100 - "⚙️ SWAAS Backend API & Realtime Service"
Cohesion: 0.11
Nodes (16): 1. Install Dependencies, 2. Verify Server Syntax, 3. Run Development Server, 📡 API Endpoint Overview, 🏗️ Architecture & Core Responsibilities, 🛠️ CLI Utilities & Device Provisioning, 🔐 Environment Configuration, 🚀 Getting Started (+8 more)

### Community 102 - "contact_links"
Cohesion: 0.33
Nodes (5): blank_issues_enabled, contact_links, about, name, url

### Community 103 - "on"
Cohesion: 0.40
Nodes (5): on, pull_request, push, branches, branches

### Community 104 - "mobile/src/lib/profileCompletion.js"
Cohesion: 0.40
Nodes (4): 📝 Description, 🔐 Security & Privacy Verification, 🧪 Testing Checklist, 🔍 Type of Change

### Community 105 - "with"
Cohesion: 0.40
Nodes (5): with, node-version, python-version, run_install, version

### Community 106 - "authService.js"
Cohesion: 0.20
Nodes (10): bcrypt, mongoose, userSchema, completeUserProfile(), getUserProfile(), jwt, loginUser(), mongoose (+2 more)

### Community 107 - "backend"
Cohesion: 0.50
Nodes (4): defaults, name, runs-on, backend

### Community 108 - "mobile"
Cohesion: 0.50
Nodes (4): mobile, name, runs-on, steps

### Community 109 - "SWAAS / TrailGuard Security Audit & Vulnerability Assessment"
Cohesion: 0.33
Nodes (6): 1. Executive Summary, 2. Findings Summary by Severity, 4. Key Verified Security Controls (Positive Findings), 5. Verification Commands, SWAAS / TrailGuard Security Audit & Vulnerability Assessment, Tier-by-Tier Security Posture Overview

### Community 110 - "appError.js"
Cohesion: 0.18
Nodes (4): completePairingChallenge, getTelemetryReceipt, startPairingChallenge, getHistory()

### Community 115 - "InfoRow.jsx"
Cohesion: 0.15
Nodes (12): allowBuilds, react-native-screens, minimumReleaseAgeExclude, overrides, decode-uri-component, glob@>=9.0.0 <=14.0.1, minimatch@<11.0.1, node-forge (+4 more)

### Community 116 - "Icons.js"
Cohesion: 0.26
Nodes (12): ActivityCard(), Item(), styles, DeviceCard(), styles, BatteryIcon(), BootIcon(), ClockIcon() (+4 more)

### Community 130 - "vitalsController.js"
Cohesion: 0.50
Nodes (3): getHistory, getLatest, getStats

## Knowledge Gaps
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` connect `updates` to `.clear`, `ARCHITECTURE.md`?**
  _High betweenness centrality (0.326) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AppError` (e.g. with `2. Naming Conventions & Code Style Standards` and `3.1 Backend: `AppError` & Centralized Middleware`) actually correct?**
  _`AppError` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06832298136645963 - nodes in this community are weakly interconnected._
- **Why does `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` connect `.clear` to `DashboardScreen.js`, `updates`?**
  _High betweenness centrality (0.276) - this node is a cross-community bridge._
- **Should `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` be split into smaller, more focused modules?**
  _Cohesion score 0.06386066763425254 - nodes in this community are weakly interconnected._
- **Why does `Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry)` connect `DashboardScreen.js` to `.clear`?**
  _High betweenness centrality (0.269) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06090808416389812 - nodes in this community are weakly interconnected._