# Graph Report - TrailGuard  (2026-11-08)

## Corpus Check
- 255 files · ~121,257 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: (none) 13, .example 4, .conf 1)

## Summary
- 1870 nodes · 3215 edges · 125 communities (101 shown, 24 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 103 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `db47b266`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_react
- 4. Mandatory Architectural Invariants (Zero-Tolerance Rules)
- check-syntax.js
- frontend/package.json
- lucide-react
- mobile/package.json
- with
- dependencies
- rateLimiter.js
- Dashboard.jsx
- steps
- deviceAuthMiddleware.js
- App.jsx
- Settings.jsx
- auth.test.js
- StatCard.jsx
- 🛡️ TrailGuard / SWAAS
- LiveMap.jsx
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
- App.jsx
- updates
- backend/package.json
- useDevices
- socketManager.js
- socketManager.test.js
- SWAAS / TrailGuard Security Audit & Vulnerability Assessment
- rateLimiter.js
- simulate-esp32.js
- app.js
- XglcdFont
- authController.js
- devDependencies
- .clear
- 5. End-to-End Integration Test Suite
- StatCard.jsx
- server.js
- mongoose
- Sidebar.jsx
- contact_links
- telemetryService.js
- authController.js
- rateLimiter.test.js
- vitalsController.js
- telemetryService.js
- express-rate-limit
- helmet
- ws
- bug_report.md
- feature_request.md
- deviceRegistrationRoutes.js
- MAX30100
- scripts
- telemetryService.js
- SWAAS / TrailGuard Codebase Architecture & Modular Organization
- Day 5 — WebSocket & Emergency Communication
- 📱 TrailGuard Mobile Companion
- SWAAS / TrailGuard Security Audit & Vulnerability Assessment
- DashboardScreen.js
- Dashboard.jsx
- emergencyRoutes.js
- DeviceContext.jsx
- frontend/src/lib/apiClient.js
- Contributing to SWAAS
- Day 3 — Device and API Architecture
- appError.js
- frontend/src/hooks/useDashboardData.js
- LoginScreen.js
- deviceRegistrationRoutes.js
- react-icons
- fallService.js
- services
- frontend
- backend
- healthcheck
- scripts
- logger.js
- ErrorBoundary
- response.js
- reviews
- env
- build
- allowBuilds
- environment
- frontend
- ⚙️ SWAAS Backend API & Realtime Service
- charts/index.js
- contact_links
- on
- mobile/src/lib/profileCompletion.js
- with
- authService.js
- backend
- mobile
- SWAAS / TrailGuard Security Audit & Vulnerability Assessment
- LocationReading.js
- security-triage.agent.md
- CI Failure Debugging
- InfoRow.jsx
- vercel.json
- max30100.py
- dependencies
- vitalsController.js
- vercel.json
- GEMINI.md

## God Nodes (most connected - your core abstractions)
1. `Display` - 41 edges
2. `AppError` - 39 edges
3. `useAppTheme()` - 33 edges
4. `mongoose` - 27 edges
5. `useAuth()` - 21 edges
6. `13. Day 3 exit criteria and concrete architectural answers` - 21 edges
7. `react-native` - 21 edges
8. `MAX30100` - 20 edges
9. `useAuth()` - 19 edges
10. `App()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `4. Legacy TrailGuard → SWAAS Migration Verification` --references--> `deviceAuthMiddleware()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/middleware/deviceAuthMiddleware.js
- `2. Naming Conventions & Code Style Standards` --references--> `AppError`  [INFERRED]
  AGENTS.md → backend/utils/appError.js
- `3.1 Backend: `AppError` & Centralized Middleware` --references--> `AppError`  [INFERRED]
  docs/architecture/CODEBASE_ORGANIZATION.md → backend/utils/appError.js
- `3. Comprehensive Vulnerability Matrix` --references--> `gatt_access()`  [INFERRED]
  SECURITY_AUDIT.md → hardware/firmware/main/main.c
- `3. Mandatory Architectural Invariant Compliance Review` --references--> `getHistoricalData()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/services/emergencySessionService.js

## Import Cycles
- None detected.

## Communities (125 total, 24 thin omitted)

### Community 0 - "ref_react"
Cohesion: 0.06
Nodes (58): PairDevicePanel(), API_URL, APP_NAME, config, IS_DEVELOPMENT, IS_PRODUCTION, normalizedApi, WS_URL (+50 more)

### Community 1 - "4. Mandatory Architectural Invariants (Zero-Tolerance Rules)"
Cohesion: 0.07
Nodes (23): app_main(), append_authorization_challenge(), authority_public_key_available(), build_device_info(), build_telemetry_frame(), format_uuid(), gap_event(), gatt_access() (+15 more)

### Community 2 - "check-syntax.js"
Cohesion: 0.18
Nodes (11): MONGO_INITDB_DATABASE, MONGO_INITDB_ROOT_PASSWORD, MONGO_INITDB_ROOT_USERNAME, container_name, environment, image, networks, ports (+3 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.06
Nodes (42): dependencies, lucide-react@^1.55.0, maplibre-gl@^6.14.0, react@^19.3.0, react-dom@^19.3.0, react-icons@^5.7.0, react-phone-number-input@^3.4.18, react-router-dom@^7.18.4 (+34 more)

### Community 4 - "lucide-react"
Cohesion: 0.09
Nodes (21): authenticatedTelemetryRequest(), createDeviceAuthHeaders(), crypto, mockDeviceAuthNonceCreate, mockDeviceCreate, mockDeviceFindOne, mockDeviceFindOneAndUpdate, mockDevicePairingCreate (+13 more)

### Community 5 - "mobile/package.json"
Cohesion: 0.06
Nodes (41): dependencies, expo@~57.0.31, expo-device@~57.0.2, expo-linking@~57.0.13, expo-location@~57.0.22, expo-notifications@~57.0.24, expo-secure-store@~57.0.4, expo-status-bar@~57.0.1 (+33 more)

### Community 6 - "with"
Cohesion: 0.18
Nodes (10): concurrency, cancel-in-progress, group, name, runs-on, jobs, hardware, name (+2 more)

### Community 7 - "dependencies"
Cohesion: 0.08
Nodes (33): passport, dependencies, bcrypt@^6.0.0, connect-mongo@^6.0.0, cors@^2.8.5, dotenv@^18.0.7, express-rate-limit@^8.7.1, express-session@^1.18.0 (+25 more)

### Community 9 - "Dashboard.jsx"
Cohesion: 0.20
Nodes (19): AlertCard(), styles, AppHeader(), styles, FallAlertModal(), styles, BellIcon(), GearIcon() (+11 more)

### Community 10 - "steps"
Cohesion: 0.09
Nodes (18): validate(), auditLogSchema, crypto, mongoose, crypto, emergencySessionSchema, mongoose, environmentReadingSchema (+10 more)

### Community 11 - "deviceAuthMiddleware.js"
Cohesion: 0.12
Nodes (21): completePairingChallenge, getTelemetryReceipt, startPairingChallenge, assignOrJoinResponder(), createSession(), crypto, getHistoricalData(), getSessionAudit() (+13 more)

### Community 12 - "App.jsx"
Cohesion: 0.07
Nodes (37): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+29 more)

### Community 13 - "Settings.jsx"
Cohesion: 0.22
Nodes (14): AuthCard(), Button(), Field(), PhoneField(), InfoRow(), DeviceCard(), FallAlertModal(), useAuth() (+6 more)

### Community 14 - "auth.test.js"
Cohesion: 0.06
Nodes (31): name, runs-on, steps, strategy, concurrency, cancel-in-progress, group, jobs (+23 more)

### Community 15 - "StatCard.jsx"
Cohesion: 0.07
Nodes (24): crypto, jwt, mockAuditCreate, mockAuditFind, mockBroadcastEmergencyEvent, mockDeviceCreate, mockDeviceFind, mockDeviceFindOne (+16 more)

### Community 16 - "🛡️ TrailGuard / SWAAS"
Cohesion: 0.14
Nodes (14): CheckIcon(), useAuth(), hasText(), isProfileComplete(), AppNavigator(), AuthenticatedStack(), AuthStack(), ProfileStack() (+6 more)

### Community 17 - "LiveMap.jsx"
Cohesion: 0.15
Nodes (12): 1. Clone & Install Dependencies, 2. Configure Environment Files, 3. Start the Subsystems, ⚡ Core Capabilities, 📖 In-Depth Documentation, 📄 License & Safety Notice, Prerequisites, 🚀 Quickstart (Run Full Stack) (+4 more)

### Community 18 - "Dashboard.jsx"
Cohesion: 0.15
Nodes (16): ACTIVITY_STYLES, ActivitySummary(), MiniGraph(), SummaryItem(), LiveLocationCard(), RecentEventsCard(), DropletIcon(), HeartIcon() (+8 more)

### Community 19 - "App.jsx"
Cohesion: 0.14
Nodes (21): App(), ProtectedRoute(), AuthContext, AuthProvider(), DeviceProvider(), ThemeContext, ThemeProvider(), authApi (+13 more)

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
Cohesion: 0.10
Nodes (21): authorizeRole(), 10. How is horizontal privilege escalation prevented?, 11. How are API requests authenticated?, 12. How are API requests authorized?, 13. Day 3 exit criteria and concrete architectural answers, 13. How are pairing and replay attacks prevented?, 14. How are sensitive operations audited?, 15. How is sensitive data prevented from appearing in logs? (+13 more)

### Community 24 - "MAX30100"
Cohesion: 0.18
Nodes (7): crypto, mongoose, webSocketTicketSchema, consumeTicket(), crypto, mongoose, Journey 3: Emergency Session Lifecycle & Real-Time Streaming

### Community 25 - "Contributor Covenant Code of Conduct"
Cohesion: 0.18
Nodes (12): adminLimiter, apiLimiter, createLimiter(), deviceLimiter, rateLimit, telemetryLimiter, express, express (+4 more)

### Community 29 - "App.jsx"
Cohesion: 0.08
Nodes (23): backgroundColor, foregroundImage, adaptiveIcon, package, permissions, expo, android, icon (+15 more)

### Community 30 - "updates"
Cohesion: 0.15
Nodes (13): 1. System Mission & 4-Tier Architecture, 2. Naming Conventions & Code Style Standards, 3. The 6 Specialized AI Agent Personas, 5. Role-Based Access Control (RBAC) Matrix, 6. Prohibited Anti-Patterns (Anti-Hallucination Directives), 7. Knowledge Graph & Architecture Navigation (Graphify), 🛡️ Agent 1: Security & Cryptography Specialist, ☁️ Agent 2: Cloud Backend & Realtime Architect (+5 more)

### Community 31 - "backend/package.json"
Cohesion: 0.11
Nodes (18): crypto, mockAuditLogCreate, mockAuditLogFind, mockBroadcastEmergencyEvent, mockCurrentUser, mockDeviceFindOne, mockEmergencySessionCreate, mockEmergencySessionFind (+10 more)

### Community 34 - "socketManager.js"
Cohesion: 0.16
Nodes (20): AppLayout(), LoadingSpinner(), ModalButtons(), ModalHeader(), NAV_ITEMS, Sidebar(), DeviceContext, useDevices() (+12 more)

### Community 35 - "socketManager.test.js"
Cohesion: 0.27
Nodes (6): NotificationBell(), ProfileMenu(), AuthLayout(), FEATURES, DashboardHeader(), react-icons

### Community 36 - "SWAAS / TrailGuard Security Audit & Vulnerability Assessment"
Cohesion: 0.11
Nodes (18): Authentication, Authorization, CI/CD Security, Data Security, Device Security, Emergency and Safety Workflows, Infrastructure and CI/CD, Out of Scope (+10 more)

### Community 37 - "rateLimiter.js"
Cohesion: 0.23
Nodes (9): jwt, queryLimiter, express@^5.3.0, express, express, express, express, express (+1 more)

### Community 38 - "simulate-esp32.js"
Cohesion: 0.05
Nodes (56): crypto, fs, generateAuthorityKeys(), parseArguments(), path, writeExclusive(), createPairingQrPayload(), fs (+48 more)

### Community 39 - "app.js"
Cohesion: 0.14
Nodes (5): cors, express, helmet, mongoose, passport

### Community 40 - "XglcdFont"
Cohesion: 0.10
Nodes (17): getAllDevicesAdmin, getDevice, getUserDevices, registerDevice(), renameDevice, unpairDevice, updateStatus, getHistory (+9 more)

### Community 41 - "authController.js"
Cohesion: 0.17
Nodes (9): completeProfile, generateWsTicket, getMe, login, register, authLimiter, express, passport (+1 more)

### Community 42 - "devDependencies"
Cohesion: 0.15
Nodes (10): crypto, deviceAuthMiddleware(), reject(), sha256(), deviceSchema, mongoose, deviceAuthNonceSchema, mongoose (+2 more)

### Community 43 - ".clear"
Cohesion: 0.29
Nodes (7): 4. Mandatory Architectural Invariants (Zero-Tolerance Rules), Invariant 2: Emergency-Bounded Cloud Sharing, Invariant 3: Fail-Closed Security Audit Logging, Invariant 4: Cryptographic Device Authentication, Invariant 5: Ephemeral Retention & Automated TTL Cleanup, Invariant 6: Authenticated, Session-Scoped Real-Time Delivery, Invariant 7: Structured Redacted Logging

### Community 44 - "5. End-to-End Integration Test Suite"
Cohesion: 0.15
Nodes (12): 1. Executive Summary & Objective, 2. Final Phase 1 4-Tier Architecture, 3. Mandatory Architectural Invariant Compliance Review, 4. Legacy TrailGuard → SWAAS Migration Verification, 5. End-to-End Integration Test Suite, 6. Comprehensive Multi-Tier Verification Results, 7. Phase 1 Completion & Readiness Sign-Off, Day 7 — Integration Testing, Architecture Compliance Review & Phase 1 Sign-Off (+4 more)

### Community 45 - "StatCard.jsx"
Cohesion: 0.23
Nodes (5): MiniStats(), QuickStatsGrid(), StatCard(), STATUS_COLORS, STYLES

### Community 46 - "server.js"
Cohesion: 0.25
Nodes (4): app, mongoose, http, server

### Community 47 - "mongoose"
Cohesion: 0.07
Nodes (27): concurrency, cancel-in-progress, group, GITHUB_TOKEN, jobs, sync-wiki, name, on (+19 more)

### Community 48 - "Sidebar.jsx"
Cohesion: 0.17
Nodes (11): devDependencies, jest@^30.5.2, supertest@^7.3.1, jwt, mockUserCreate, mockUserFindById, mockUserFindByIdAndUpdate, mockUserFindOne (+3 more)

### Community 49 - "contact_links"
Cohesion: 0.14
Nodes (13): allowBuilds, bcrypt, mongodb-memory-server, @parcel/watcher, unrs-resolver, overrides, body-parser, brace-expansion (+5 more)

### Community 51 - "authController.js"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 52 - "rateLimiter.test.js"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 53 - "vitalsController.js"
Cohesion: 0.12
Nodes (16): concurrency, cancel-in-progress, group, name, runs-on, steps, jobs, dependency-review (+8 more)

### Community 54 - "telemetryService.js"
Cohesion: 0.33
Nodes (6): 10. Architecture diagrams, API authentication and authorization flow, BLE communication and reconnection sequence, Emergency session lifecycle sequence, Local-first storage and normal-mode boundary, User → Device ownership entity diagram

### Community 55 - "express-rate-limit"
Cohesion: 0.17
Nodes (12): 1. Objective and Invariants, 2. Security & Trust Architecture, 3.1 Historical Replay Authorization Matrix, 3.2 Ephemeral Data Retention Rules, 3. Data Protection Specification, 4. Structured Redacted Logging, 5. Security Verification & Test Results, 6. Day 6 Exit Criteria Checklist (+4 more)

### Community 57 - "ws"
Cohesion: 0.22
Nodes (12): BottomTabBar(), styles, tabs, AlertIcon(), HistoryIcon(), HomeIcon(), MapIcon(), SettingsIcon() (+4 more)

### Community 58 - "bug_report.md"
Cohesion: 0.27
Nodes (11): assignOrJoinResponder, createSession, extractMeta(), generateWsTicket, getActiveSessions, getHistoricalData, getSessionAudit, getSessionById (+3 more)

### Community 59 - "feature_request.md"
Cohesion: 0.16
Nodes (15): devicePairingSchema, mongoose, assertDeviceAuthorizationConfigured(), canonicalReceiptPayload(), crypto, getAuthorityPrivateKey(), issueDeviceAuthorizationReceipt(), verifyDeviceAuthorizationReceipt() (+7 more)

### Community 60 - "deviceRegistrationRoutes.js"
Cohesion: 0.40
Nodes (5): 7. REST API contract, Conventions and authentication, Initial endpoints, Request validation and examples, Response and error format

### Community 63 - "scripts"
Cohesion: 0.67
Nodes (3): 5. Local-first storage and privacy, Local database and retention, Normal and emergency data boundary

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

### Community 68 - "SWAAS / TrailGuard Security Audit & Vulnerability Assessment"
Cohesion: 0.67
Nodes (3): 8. Backend models and indexes, Required, optional, and validation rules, Uniqueness constraints

### Community 69 - "DashboardScreen.js"
Cohesion: 0.15
Nodes (21): Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry), DropletIcon(), HeartIcon(), OxygenIcon(), PinIcon(), PressureIcon(), PulseWave(), ThermometerIcon() (+13 more)

### Community 70 - "Dashboard.jsx"
Cohesion: 0.22
Nodes (11): authorizeSessionSubscription(), broadcast(), broadcastEmergencyEvent(), broadcastTelemetry(), clients, EVENT_FIELDS, initWebSocket(), jwt (+3 more)

### Community 71 - "emergencyRoutes.js"
Cohesion: 0.29
Nodes (7): hasPermission(), ROLE_PERMISSIONS, protect(), authorizePermission(), emergencyRoutes(), express, createApiRouter()

### Community 72 - "DeviceContext.jsx"
Cohesion: 0.15
Nodes (12): 1. Correction, 2. Warning, 3. Temporary Ban, 4. Permanent Ban, Attribution, Contributor Covenant Code of Conduct, Enforcement, Enforcement Guidelines (+4 more)

### Community 73 - "frontend/src/lib/apiClient.js"
Cohesion: 0.17
Nodes (15): useDashboardData(), HISTORY_RANGES, useUpdatedTime(), environmentApi, fallsApi, locationApi, request(), vitalsApi (+7 more)

### Community 74 - "Contributing to SWAAS"
Cohesion: 0.20
Nodes (9): 1. Clone the repository, 2. Install dependencies, 3. Run with Docker Compose, 🌿 Branching and Commit Guidelines, Contributing to SWAAS, 🛠️ Development Setup & Prerequisites, 🔒 Security & Privacy Invariants, 🏗️ System Architecture Overview (+1 more)

### Community 75 - "Day 3 — Device and API Architecture"
Cohesion: 0.20
Nodes (10): 11. Verification plan, 12. Current implementation gaps and rollout gates, 1. Goals and non-goals, 2. System components and trust boundaries, 6. Emergency session and rescue authorization, Access, expiry, and deletion, Boundary rules, Day 3 — Device and API Architecture (+2 more)

### Community 76 - "appError.js"
Cohesion: 0.20
Nodes (9): 1. Objective and Invariants, 2. Risk Engine Architecture, 3.1 `EmergencySession` (`backend/models/EmergencySession.js`), 3.2 `RiskAssessment` (`backend/models/RiskAssessment.js`), 3.3 `AuditLog` (`backend/models/AuditLog.js`), 3. Data Models Specification, 4. Verification and Acceptance Checklist, Day 4 — Risk & Emergency Models (+1 more)

### Community 77 - "frontend/src/hooks/useDashboardData.js"
Cohesion: 0.15
Nodes (9): config, configuredOrigins, defaultDevOrigins, requiredInProduction, jsonwebtoken@^9.0.2, EventEmitter, jwt, { PassThrough } (+1 more)

### Community 78 - "LoginScreen.js"
Cohesion: 0.29
Nodes (7): EyeIcon(), EyeOffIcon(), ShieldIcon(), LoginScreen(), styles, RegisterScreen(), styles

### Community 80 - "deviceRegistrationRoutes.js"
Cohesion: 0.22
Nodes (6): getDeviceById(), pairedOrLegacyDeviceState, registerDevice(), renameDevice(), unpairDevice(), updateDeviceStatus()

### Community 81 - "react-icons"
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

### Community 101 - "charts/index.js"
Cohesion: 0.40
Nodes (5): 3. Device identity, lifecycle, and ownership, Identity and credential, Lifecycle, Ownership policy, Secure pairing decision and flow

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
Cohesion: 0.29
Nodes (7): 1. Executive Summary, 2. Findings Summary by Severity, 3. Comprehensive Vulnerability Matrix, 4. Key Verified Security Controls (Positive Findings), 5. Verification Commands, SWAAS / TrailGuard Security Audit & Vulnerability Assessment, Tier-by-Tier Security Posture Overview

### Community 110 - "LocationReading.js"
Cohesion: 0.33
Nodes (3): locationReadingSchema, mongoose, getHistory()

### Community 112 - "security-triage.agent.md"
Cohesion: 0.50
Nodes (4): 4. BLE protocol and connection behavior, BLE security model, Connection state and retries, Telemetry envelope

### Community 113 - "CI Failure Debugging"
Cohesion: 0.50
Nodes (4): 9. Security controls and threat model, Security invariants (must always hold), Threats and mitigations, Transport, storage, secrets

### Community 115 - "InfoRow.jsx"
Cohesion: 0.15
Nodes (12): allowBuilds, react-native-screens, minimumReleaseAgeExclude, overrides, decode-uri-component, glob@>=9.0.0 <=14.0.1, minimatch@<11.0.1, node-forge (+4 more)

### Community 116 - "vercel.json"
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
  _High betweenness centrality (0.331) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AppError` (e.g. with `2. Naming Conventions & Code Style Standards` and `3.1 Backend: `AppError` & Centralized Middleware`) actually correct?**
  _`AppError` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.056962025316455694 - nodes in this community are weakly interconnected._
- **Why does `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` connect `.clear` to `DashboardScreen.js`, `updates`?**
  _High betweenness centrality (0.281) - this node is a cross-community bridge._
- **Should `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` be split into smaller, more focused modules?**
  _Cohesion score 0.06561085972850679 - nodes in this community are weakly interconnected._
- **Why does `Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry)` connect `DashboardScreen.js` to `.clear`?**
  _High betweenness centrality (0.279) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05858585858585859 - nodes in this community are weakly interconnected._