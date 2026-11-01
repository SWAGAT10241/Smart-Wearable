# Graph Report - TrailGuard  (2026-11-01)

## Corpus Check
- 241 files · ~103,946 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: (none) 13, .example 4, .conf 1)

## Summary
- 1787 nodes · 3090 edges · 104 communities (82 shown, 22 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c3c15d9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_react
- 4. Mandatory Architectural Invariants (Zero-Tolerance Rules)
- check-syntax.js
- frontend/package.json
- StatCard.jsx
- mobile/package.json
- with
- backend/package.json
- rateLimiter.js
- ref_react
- mongoose
- AppError
- Settings.jsx
- analyze
- auth.test.js
- frontend/src/lib/apiClient.js
- 🛡️ TrailGuard / SWAAS
- 🛡️ TrailGuard / SWAAS
- 🖥️ TrailGuard Rescue Web Dashboard
- server.test.js
- App.jsx
- ⚙️ SWAAS Backend API & Realtime Service
- 🖥️ TrailGuard Rescue Web Dashboard
- .is_off_grid
- webSocketTicketService.js
- emergencySessionService.js
- Security Policy
- User.js
- LiveDataContext.jsx
- updates
- supertest
- environmentService.js
- overrides
- react-icons
- 4. Mandatory Architectural Invariants (Zero-Tolerance Rules)
- rateLimiter.js
- simulate-esp32.js
- AppError
- deviceController.js
- deviceProvisioning.test.js
- deviceController.js
- 4. Mandatory Architectural Invariants (Zero-Tolerance Rules)
- MAX30100
- 📱 TrailGuard Mobile Companion
- authService.js
- steps
- auth.test.js
- overrides
- telemetryService.js
- body
- body
- dependency-review.yml
- 10. Architecture diagrams
- Day 6 — Privacy, Security, Authorization & Audit Logging
- XglcdFont
- react-native-safe-area-context
- emergencySessionController.js
- devicePairingService.js
- 7. REST API contract
- MAX30100
- 5. Local-first storage and privacy
- telemetryService.js
- SWAAS / TrailGuard Codebase Architecture & Modular Organization
- Day 5 — WebSocket & Emergency Communication
- 📱 TrailGuard Mobile Companion
- 8. Backend models and indexes
- DashboardScreen.js
- emergencyRoutes.js
- Contributing to SWAAS
- Day 3 — Device and API Architecture
- appError.js
- LoginScreen.js
- scripts
- logger.js
- updates
- reviews
- allowBuilds
- ⚙️ SWAAS Backend API & Realtime Service
- 3. Device identity, lifecycle, and ownership
- mobile/src/lib/profileCompletion.js
- User.js
- 4. BLE protocol and connection behavior
- PageHeader.jsx
- overrides
- Icons.js
- environmentController.js
- What Should Be Reported
- _twos_complement
- dependencies
- vitalsController.js
- vercel.json
- GEMINI.md

## God Nodes (most connected - your core abstractions)
1. `Display` - 41 edges
2. `AppError` - 37 edges
3. `useAppTheme()` - 33 edges
4. `mongoose` - 24 edges
5. `react-native` - 21 edges
6. `13. Day 3 exit criteria and concrete architectural answers` - 21 edges
7. `MAX30100` - 20 edges
8. `useAuth()` - 19 edges
9. `useAuth()` - 19 edges
10. `Dashboard()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `4. Legacy TrailGuard → SWAAS Migration Verification` --references--> `deviceAuthMiddleware()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/middleware/deviceAuthMiddleware.js
- `Supported Versions` --references--> `main()`  [INFERRED]
  SECURITY.md → backend/scripts/provision-device.js
- `2. Naming Conventions & Code Style Standards` --references--> `AppError`  [INFERRED]
  AGENTS.md → backend/utils/appError.js
- `3.1 Backend: `AppError` & Centralized Middleware` --references--> `AppError`  [INFERRED]
  docs/architecture/CODEBASE_ORGANIZATION.md → backend/utils/appError.js
- `9. How are revoked devices/users blocked?` --references--> `deviceAuthMiddleware()`  [INFERRED]
  docs/architecture/day-3-device-and-api-architecture.md → backend/middleware/deviceAuthMiddleware.js

## Import Cycles
- None detected.

## Communities (104 total, 22 thin omitted)

### Community 0 - "ref_react"
Cohesion: 0.06
Nodes (58): PairDevicePanel(), API_URL, APP_NAME, config, IS_DEVELOPMENT, IS_PRODUCTION, normalizedApi, WS_URL (+50 more)

### Community 1 - "4. Mandatory Architectural Invariants (Zero-Tolerance Rules)"
Cohesion: 0.05
Nodes (30): app_main(), append_authorization_challenge(), authority_public_key_available(), build_device_info(), build_telemetry_frame(), format_uuid(), gap_event(), gatt_access() (+22 more)

### Community 2 - "check-syntax.js"
Cohesion: 0.04
Nodes (48): build, container_name, depends_on, environment, networks, ports, restart, context (+40 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.06
Nodes (44): dependencies, lucide-react@^1.55.0, maplibre-gl@^6.14.0, react@^19.3.0, react-dom@^19.3.0, react-icons@^5.7.0, react-phone-number-input@^3.4.18, react-router-dom@^7.18.4 (+36 more)

### Community 4 - "StatCard.jsx"
Cohesion: 0.09
Nodes (21): authenticatedTelemetryRequest(), createDeviceAuthHeaders(), crypto, mockDeviceAuthNonceCreate, mockDeviceCreate, mockDeviceFindOne, mockDeviceFindOneAndUpdate, mockDevicePairingCreate (+13 more)

### Community 5 - "mobile/package.json"
Cohesion: 0.06
Nodes (41): dependencies, expo@~57.0.31, expo-device@~57.0.2, expo-linking@~57.0.13, expo-location@~57.0.22, expo-notifications@~57.0.24, expo-secure-store@~57.0.4, expo-status-bar@~57.0.1 (+33 more)

### Community 6 - "with"
Cohesion: 0.06
Nodes (41): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+33 more)

### Community 7 - "backend/package.json"
Cohesion: 0.07
Nodes (36): passport, dependencies, bcrypt@^6.0.0, connect-mongo@^6.0.0, cors@^2.8.5, dotenv@^18.0.7, express-rate-limit@^8.7.1, express-session@^1.18.0 (+28 more)

### Community 8 - "rateLimiter.js"
Cohesion: 0.12
Nodes (19): BarTrace(), ChartCard(), GaugeBar(), LineTrace(), Sparkline(), TemperatureGauge(), MiniStats(), QuickStatsGrid() (+11 more)

### Community 9 - "ref_react"
Cohesion: 0.19
Nodes (20): AlertCard(), styles, AppHeader(), styles, FallAlertModal(), styles, BellIcon(), GearIcon() (+12 more)

### Community 10 - "mongoose"
Cohesion: 0.08
Nodes (22): validate(), auditLogSchema, crypto, mongoose, crypto, emergencySessionSchema, mongoose, environmentReadingSchema (+14 more)

### Community 11 - "AppError"
Cohesion: 0.09
Nodes (18): completePairingChallenge, getTelemetryReceipt, startPairingChallenge, getDeviceById(), pairedOrLegacyDeviceState, registerDevice(), renameDevice(), unpairDevice() (+10 more)

### Community 12 - "Settings.jsx"
Cohesion: 0.07
Nodes (37): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+29 more)

### Community 13 - "analyze"
Cohesion: 0.22
Nodes (17): AuthCard(), AuthLayout(), Button(), Field(), PhoneField(), InfoRow(), DeviceCard(), FallAlertModal() (+9 more)

### Community 14 - "auth.test.js"
Cohesion: 0.06
Nodes (31): name, runs-on, steps, strategy, concurrency, cancel-in-progress, group, jobs (+23 more)

### Community 15 - "frontend/src/lib/apiClient.js"
Cohesion: 0.07
Nodes (24): crypto, jwt, mockAuditCreate, mockAuditFind, mockBroadcastEmergencyEvent, mockDeviceCreate, mockDeviceFind, mockDeviceFindOne (+16 more)

### Community 16 - "🛡️ TrailGuard / SWAAS"
Cohesion: 0.14
Nodes (14): CheckIcon(), useAuth(), hasText(), isProfileComplete(), AppNavigator(), AuthenticatedStack(), AuthStack(), ProfileStack() (+6 more)

### Community 17 - "🛡️ TrailGuard / SWAAS"
Cohesion: 0.15
Nodes (12): 1. Clone & Install Dependencies, 2. Configure Environment Files, 3. Start the Subsystems, ⚡ Core Capabilities, 📖 In-Depth Documentation, 📄 License & Safety Notice, Prerequisites, 🚀 Quickstart (Run Full Stack) (+4 more)

### Community 18 - "🖥️ TrailGuard Rescue Web Dashboard"
Cohesion: 0.15
Nodes (16): ACTIVITY_STYLES, ActivitySummary(), MiniGraph(), SummaryItem(), LiveLocationCard(), RecentEventsCard(), DropletIcon(), HeartIcon() (+8 more)

### Community 19 - "server.test.js"
Cohesion: 0.15
Nodes (11): App(), ErrorBoundary, ProtectedRoute(), DeviceProvider(), ThemeContext, ThemeProvider(), saveToken(), hasText() (+3 more)

### Community 20 - "App.jsx"
Cohesion: 0.11
Nodes (9): 1. High-Level Component Flowchart, 2.1 Hardware Sensing Tier (`hardware/`), 2.2 Local-First Mobile Companion (`mobile/`), 2.3 Express & MongoDB Backend (`backend/`), 2.4 Monitoring & Rescue Dashboard (`frontend/`), 2. Architectural Subsystem Breakdown, 3. Related Specifications & Architecture Documentation, System Architecture & Component Topology (+1 more)

### Community 21 - "⚙️ SWAAS Backend API & Realtime Service"
Cohesion: 0.10
Nodes (30): deferred(), device, request(), App(), AppContent(), API_URL, WS_URL, AuthContext (+22 more)

### Community 22 - "🖥️ TrailGuard Rescue Web Dashboard"
Cohesion: 0.20
Nodes (9): 1. Install Dependencies, 2. Start Development Server, 3. Build for Production, 🔐 Environment Configuration, 🚀 Getting Started, ⚡ Key Capabilities, 📂 Subsystem Structure, 🧪 Testing (+1 more)

### Community 23 - ".is_off_grid"
Cohesion: 0.10
Nodes (21): authorizeRole(), 10. How is horizontal privilege escalation prevented?, 11. How are API requests authenticated?, 12. How are API requests authorized?, 13. Day 3 exit criteria and concrete architectural answers, 13. How are pairing and replay attacks prevented?, 14. How are sensitive operations audited?, 15. How is sensitive data prevented from appearing in logs? (+13 more)

### Community 24 - "webSocketTicketService.js"
Cohesion: 0.18
Nodes (7): crypto, mongoose, webSocketTicketSchema, consumeTicket(), crypto, mongoose, Journey 3: Emergency Session Lifecycle & Real-Time Streaming

### Community 25 - "emergencySessionService.js"
Cohesion: 0.29
Nodes (9): assignOrJoinResponder(), createSession(), crypto, getSessionAudit(), getSessionById(), recordAudit(), updateSessionLocation(), updateSessionRisk() (+1 more)

### Community 29 - "LiveDataContext.jsx"
Cohesion: 0.08
Nodes (23): backgroundColor, foregroundImage, adaptiveIcon, package, permissions, expo, android, icon (+15 more)

### Community 30 - "updates"
Cohesion: 0.15
Nodes (13): 1. System Mission & 4-Tier Architecture, 2. Naming Conventions & Code Style Standards, 3. The 6 Specialized AI Agent Personas, 5. Role-Based Access Control (RBAC) Matrix, 6. Prohibited Anti-Patterns (Anti-Hallucination Directives), 7. Knowledge Graph & Architecture Navigation (Graphify), 🛡️ Agent 1: Security & Cryptography Specialist, ☁️ Agent 2: Cloud Backend & Realtime Architect (+5 more)

### Community 31 - "supertest"
Cohesion: 0.11
Nodes (18): crypto, mockAuditLogCreate, mockAuditLogFind, mockBroadcastEmergencyEvent, mockCurrentUser, mockDeviceFindOne, mockEmergencySessionCreate, mockEmergencySessionFind (+10 more)

### Community 34 - "overrides"
Cohesion: 0.20
Nodes (12): AppLayout(), LoadingSpinner(), ModalButtons(), ModalHeader(), NAV_ITEMS, Sidebar(), DeviceContext, useDevices() (+4 more)

### Community 35 - "react-icons"
Cohesion: 0.31
Nodes (5): NotificationBell(), ProfileMenu(), FEATURES, DashboardHeader(), react-icons

### Community 36 - "4. Mandatory Architectural Invariants (Zero-Tolerance Rules)"
Cohesion: 0.18
Nodes (11): CI/CD Security, Out of Scope, Reporting a Vulnerability, Responsible Disclosure, Security Policy, Security Practices, Security Response Process, Security Scope (+3 more)

### Community 37 - "rateLimiter.js"
Cohesion: 0.11
Nodes (25): jwt, adminLimiter, apiLimiter, authLimiter, createLimiter(), deviceLimiter, queryLimiter, rateLimit (+17 more)

### Community 38 - "simulate-esp32.js"
Cohesion: 0.28
Nodes (14): buildTelemetryPacket(), clamp(), createSignature(), crypto, generateEnvironment(), generateLocation(), generateMotion(), generatePPG() (+6 more)

### Community 39 - "AppError"
Cohesion: 0.07
Nodes (25): app, cors, express, helmet, { MongoStore }, passport, session, sessionOptions (+17 more)

### Community 40 - "deviceController.js"
Cohesion: 0.22
Nodes (7): getLatest, getUserFalls, updateStatus(), getHistory, getLatest, ingestReadings(), asyncHandler()

### Community 41 - "deviceProvisioning.test.js"
Cohesion: 0.06
Nodes (39): crypto, deviceAuthMiddleware(), reject(), sha256(), deviceAuthNonceSchema, mongoose, crypto, fs (+31 more)

### Community 42 - "deviceController.js"
Cohesion: 0.25
Nodes (7): getAllDevicesAdmin, getDevice, getUserDevices, registerDevice(), renameDevice, unpairDevice, updateStatus

### Community 43 - "4. Mandatory Architectural Invariants (Zero-Tolerance Rules)"
Cohesion: 0.29
Nodes (7): 4. Mandatory Architectural Invariants (Zero-Tolerance Rules), Invariant 2: Emergency-Bounded Cloud Sharing, Invariant 3: Fail-Closed Security Audit Logging, Invariant 4: Cryptographic Device Authentication, Invariant 5: Ephemeral Retention & Automated TTL Cleanup, Invariant 6: Authenticated, Session-Scoped Real-Time Delivery, Invariant 7: Structured Redacted Logging

### Community 44 - "MAX30100"
Cohesion: 0.15
Nodes (13): getHistoricalData(), 1. Executive Summary & Objective, 2. Final Phase 1 4-Tier Architecture, 3. Mandatory Architectural Invariant Compliance Review, 4. Legacy TrailGuard → SWAAS Migration Verification, 5. End-to-End Integration Test Suite, 6. Comprehensive Multi-Tier Verification Results, 7. Phase 1 Completion & Readiness Sign-Off (+5 more)

### Community 45 - "📱 TrailGuard Mobile Companion"
Cohesion: 0.22
Nodes (11): AuthContext, AuthProvider(), clearToken(), devicePairingApi, environmentApi, fallsApi, getToken(), locationApi (+3 more)

### Community 46 - "authService.js"
Cohesion: 0.29
Nodes (5): completeProfile, generateWsTicket, getMe, login, register

### Community 47 - "steps"
Cohesion: 0.07
Nodes (26): concurrency, cancel-in-progress, group, GITHUB_TOKEN, jobs, sync-wiki, name, on (+18 more)

### Community 48 - "auth.test.js"
Cohesion: 0.12
Nodes (13): jsonwebtoken@^9.0.2, supertest@^7.3.1, jwt, mockUserCreate, mockUserFindById, mockUserFindByIdAndUpdate, mockUserFindOne, request (+5 more)

### Community 49 - "overrides"
Cohesion: 0.14
Nodes (13): allowBuilds, bcrypt, mongodb-memory-server, @parcel/watcher, unrs-resolver, overrides, body-parser, brace-expansion (+5 more)

### Community 51 - "body"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 52 - "body"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 53 - "dependency-review.yml"
Cohesion: 0.12
Nodes (16): concurrency, cancel-in-progress, group, name, runs-on, steps, jobs, dependency-review (+8 more)

### Community 54 - "10. Architecture diagrams"
Cohesion: 0.33
Nodes (6): 10. Architecture diagrams, API authentication and authorization flow, BLE communication and reconnection sequence, Emergency session lifecycle sequence, Local-first storage and normal-mode boundary, User → Device ownership entity diagram

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

### Community 60 - "7. REST API contract"
Cohesion: 0.40
Nodes (5): 7. REST API contract, Conventions and authentication, Initial endpoints, Request validation and examples, Response and error format

### Community 63 - "5. Local-first storage and privacy"
Cohesion: 0.67
Nodes (3): 5. Local-first storage and privacy, Local database and retention, Normal and emergency data boundary

### Community 64 - "telemetryService.js"
Cohesion: 0.20
Nodes (10): deviceSchema, mongoose, twilio@^6.1.2, dispatchEmergencyAlerts(), sendEmergencySMS(), twilio, processReadings(), sendEmergencyWhatsApp() (+2 more)

### Community 65 - "SWAAS / TrailGuard Codebase Architecture & Modular Organization"
Cohesion: 0.18
Nodes (11): 1. Architectural Philosophy & Layered Separation, 2.1 Backend (`backend/`), 2.2 Frontend Web Dashboard (`frontend/`), 2.3 Mobile Companion App (`mobile/`), 2. Directory Structure Across All Tiers, 3.1 Backend: `AppError` & Centralized Middleware, 3.2 Frontend & Mobile: Standardized `ApiError`, 3. Standardized Error Handling Architecture (+3 more)

### Community 66 - "Day 5 — WebSocket & Emergency Communication"
Cohesion: 0.18
Nodes (11): 1. Objective and Invariants, 2. Target Architecture, 3.1 Connection Handshake, 3.2 Client-to-Server Actions, 3.3 Server-to-Client Broadcast Events, 3. Real-Time Protocol Specification, 4. Emergency REST API Specification, 5. Security and Privacy Guarantees (+3 more)

### Community 67 - "📱 TrailGuard Mobile Companion"
Cohesion: 0.22
Nodes (8): 1. Install Dependencies, 2. Start Expo Development Server, ⚡ Core Architecture, 🔐 Environment Configuration, 🚀 Getting Started, 📂 Subsystem Structure, 📱 TrailGuard Mobile Companion, 🧪 Verification & CI Checks

### Community 68 - "8. Backend models and indexes"
Cohesion: 0.67
Nodes (3): 8. Backend models and indexes, Required, optional, and validation rules, Uniqueness constraints

### Community 69 - "DashboardScreen.js"
Cohesion: 0.17
Nodes (20): Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry), DropletIcon(), HeartIcon(), OxygenIcon(), PinIcon(), PressureIcon(), PulseWave(), ThermometerIcon() (+12 more)

### Community 71 - "emergencyRoutes.js"
Cohesion: 0.29
Nodes (7): hasPermission(), ROLE_PERMISSIONS, protect(), authorizePermission(), emergencyRoutes(), express, createApiRouter()

### Community 74 - "Contributing to SWAAS"
Cohesion: 0.20
Nodes (9): 1. Clone the repository, 2. Install dependencies, 3. Run with Docker Compose, 🌿 Branching and Commit Guidelines, Contributing to SWAAS, 🛠️ Development Setup & Prerequisites, 🔒 Security & Privacy Invariants, 🏗️ System Architecture Overview (+1 more)

### Community 75 - "Day 3 — Device and API Architecture"
Cohesion: 0.20
Nodes (10): 11. Verification plan, 12. Current implementation gaps and rollout gates, 1. Goals and non-goals, 2. System components and trust boundaries, 6. Emergency session and rescue authorization, Access, expiry, and deletion, Boundary rules, Day 3 — Device and API Architecture (+2 more)

### Community 76 - "appError.js"
Cohesion: 0.20
Nodes (9): 1. Objective and Invariants, 2. Risk Engine Architecture, 3.1 `EmergencySession` (`backend/models/EmergencySession.js`), 3.2 `RiskAssessment` (`backend/models/RiskAssessment.js`), 3.3 `AuditLog` (`backend/models/AuditLog.js`), 3. Data Models Specification, 4. Verification and Acceptance Checklist, Day 4 — Risk & Emergency Models (+1 more)

### Community 78 - "LoginScreen.js"
Cohesion: 0.29
Nodes (7): EyeIcon(), EyeOffIcon(), ShieldIcon(), LoginScreen(), styles, RegisterScreen(), styles

### Community 89 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, dev, generate-device-authority-keys, provision-device, simulate, start, test

### Community 90 - "logger.js"
Cohesion: 0.43
Nodes (5): formatLog(), isProductionEnv(), logger, sanitizeValue(), SENSITIVE_KEY_PATTERNS

### Community 92 - "updates"
Cohesion: 0.13
Nodes (14): patterns, patterns, backend-dependencies, frontend-dependencies, mobile-dependencies, patterns, interval, updates (+6 more)

### Community 93 - "reviews"
Cohesion: 0.15
Nodes (12): base_branches, drafts, enabled, chat, auto_reply, language, reviews, auto_review (+4 more)

### Community 96 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, esbuild, maplibre-gl, overrides, source-map-js

### Community 100 - "⚙️ SWAAS Backend API & Realtime Service"
Cohesion: 0.11
Nodes (16): 1. Install Dependencies, 2. Verify Server Syntax, 3. Run Development Server, 📡 API Endpoint Overview, 🏗️ Architecture & Core Responsibilities, 🛠️ CLI Utilities & Device Provisioning, 🔐 Environment Configuration, 🚀 Getting Started (+8 more)

### Community 101 - "3. Device identity, lifecycle, and ownership"
Cohesion: 0.40
Nodes (5): 3. Device identity, lifecycle, and ownership, Identity and credential, Lifecycle, Ownership policy, Secure pairing decision and flow

### Community 104 - "mobile/src/lib/profileCompletion.js"
Cohesion: 0.40
Nodes (4): 📝 Description, 🔐 Security & Privacy Verification, 🧪 Testing Checklist, 🔍 Type of Change

### Community 106 - "User.js"
Cohesion: 0.20
Nodes (10): bcrypt, mongoose, userSchema, completeUserProfile(), getUserProfile(), jwt, loginUser(), mongoose (+2 more)

### Community 112 - "4. BLE protocol and connection behavior"
Cohesion: 0.50
Nodes (4): 4. BLE protocol and connection behavior, BLE security model, Connection state and retries, Telemetry envelope

### Community 113 - "PageHeader.jsx"
Cohesion: 0.50
Nodes (4): 9. Security controls and threat model, Security invariants (must always hold), Threats and mitigations, Transport, storage, secrets

### Community 115 - "overrides"
Cohesion: 0.22
Nodes (8): allowBuilds, react-native-screens, minimumReleaseAgeExclude, overrides, decode-uri-component, node-forge, shell-quote, source-map-js

### Community 116 - "Icons.js"
Cohesion: 0.26
Nodes (12): ActivityCard(), Item(), styles, DeviceCard(), styles, BatteryIcon(), BootIcon(), ClockIcon() (+4 more)

### Community 120 - "environmentController.js"
Cohesion: 0.50
Nodes (3): getHistory, getLatest, getStats

### Community 126 - "What Should Be Reported"
Cohesion: 0.29
Nodes (7): Authentication, Authorization, Data Security, Device Security, Emergency and Safety Workflows, Infrastructure and CI/CD, What Should Be Reported

### Community 130 - "vitalsController.js"
Cohesion: 0.50
Nodes (3): getHistory, getLatest, getStats

## Knowledge Gaps
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` connect `updates` to `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)`, `ARCHITECTURE.md`?**
  _High betweenness centrality (0.319) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AppError` (e.g. with `2. Naming Conventions & Code Style Standards` and `3.1 Backend: `AppError` & Centralized Middleware`) actually correct?**
  _`AppError` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.056790123456790124 - nodes in this community are weakly interconnected._
- **Why does `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` connect `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` to `DashboardScreen.js`, `updates`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **Should `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` be split into smaller, more focused modules?**
  _Cohesion score 0.05493863237872589 - nodes in this community are weakly interconnected._
- **Why does `Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry)` connect `DashboardScreen.js` to `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)`?**
  _High betweenness centrality (0.249) - this node is a cross-community bridge._
- **Should `check-syntax.js` be split into smaller, more focused modules?**
  _Cohesion score 0.04251700680272109 - nodes in this community are weakly interconnected._