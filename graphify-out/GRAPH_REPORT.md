# Graph Report - TrailGuard  (2026-11-11)

## Corpus Check
- 265 files · ~128,433 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 23 file(s) not represented in the graph (top: (none) 13, .example 4, .conf 1)

## Summary
- 1907 nodes · 3265 edges · 131 communities (106 shown, 25 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 104 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7b1ec6d5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- LiveDataContext.jsx
- 4. Mandatory Architectural Invariants (Zero-Tolerance Rules)
- check-syntax.js
- devDependencies
- StatCard.jsx
- mobile/package.json
- with
- dependencies
- useAuth
- useAppTheme
- steps
- dependencies
- frontend/src/lib/apiClient.js
- Settings.jsx
- deviceController.js
- supertest
- 🛡️ TrailGuard / SWAAS
- LiveDataContext.jsx
- Dashboard.jsx
- frontend/package.json
- deviceController.js
- ⚙️ SWAAS Backend API & Realtime Service
- Display
- 13. Day 3 exit criteria and concrete architectural answers
- webSocketTicketService.js
- Contributor Covenant Code of Conduct
- Security Policy
- passport
- rateLimiter.js
- updates
- db.js
- deviceController.js
- socketManager.js
- App.jsx
- SWAAS / TrailGuard Security Audit & Vulnerability Assessment
- rateLimiter.js
- simulate-esp32.js
- app.js
- XglcdFont
- frontend/src/lib/apiClient.js
- supertest
- .clear
- deviceService.js
- vitest
- environmentController.js
- mongoose
- fallService.js
- vitalsController.js
- telemetryService.js
- environmentService.js
- appError.js
- locationController.js
- authController.js
- Day 6 — Privacy, Security, Authorization & Audit Logging
- XglcdFont
- react-native-safe-area-context
- emergencySessionController.js
- utils.js
- scripts
- MAX30100
- environmentController.js
- telemetryService.js
- SWAAS / TrailGuard Codebase Architecture & Modular Organization
- Day 5 — WebSocket & Emergency Communication
- 📱 TrailGuard Mobile Companion
- deviceAuthMiddleware.js
- DashboardScreen.js
- socketManager.js
- emergencyRoutes.js
- DeviceContext.jsx
- AppError
- Contributing to SWAAS
- Day 3 — Device and API Architecture
- fallService.js
- socketManager.test.js
- LoginScreen.js
- steps
- What Should Be Reported
- services
- frontend
- backend
- healthcheck
- scripts
- logger.js
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
- Day 7 — Integration Testing, Architecture Compliance Review & Phase 1 Sign-Off
- react-icons
- charts/index.js
- InfoRow.jsx
- Icons.js
- 10. Architecture diagrams
- main.jsx
- 3. Device identity, lifecycle, and ownership
- 7. REST API contract
- sw.js
- 4. BLE protocol and connection behavior
- 9. Security controls and threat model
- max30100.py
- dependencies
- vitalsController.js
- locationController.js
- 5. Local-first storage and privacy
- 8. Backend models and indexes
- vercel.json
- GEMINI.md

## God Nodes (most connected - your core abstractions)
1. `react` - 66 edges
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

## Communities (131 total, 25 thin omitted)

### Community 0 - "LiveDataContext.jsx"
Cohesion: 0.07
Nodes (50): PairDevicePanel(), LiveDataContext, LiveDataProvider(), devicePairingApi, BLE_AUTHENTICATION_TIMEOUT_MS, BLE_CONNECT_TIMEOUT_MS, BLE_STALE_TIMEOUT_MS, BleAuthorizationError (+42 more)

### Community 1 - "4. Mandatory Architectural Invariants (Zero-Tolerance Rules)"
Cohesion: 0.05
Nodes (30): app_main(), append_authorization_challenge(), authority_public_key_available(), build_device_info(), build_telemetry_frame(), format_uuid(), gap_event(), gatt_access() (+22 more)

### Community 2 - "check-syntax.js"
Cohesion: 0.18
Nodes (11): MONGO_INITDB_DATABASE, MONGO_INITDB_ROOT_PASSWORD, MONGO_INITDB_ROOT_USERNAME, container_name, environment, image, networks, ports (+3 more)

### Community 3 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, jsdom@^30.1.3, tailwindcss@^4.3.3, @tailwindcss/vite@^4.3.3, @testing-library/jest-dom@^7.0.1, @testing-library/react@^16.3.3, vite@^6.4.4, @vitejs/plugin-react@^4.3.1 (+7 more)

### Community 4 - "StatCard.jsx"
Cohesion: 0.06
Nodes (36): devicePairingSchema, mongoose, assertDeviceAuthorizationConfigured(), canonicalReceiptPayload(), crypto, getAuthorityPrivateKey(), issueDeviceAuthorizationReceipt(), verifyDeviceAuthorizationReceipt() (+28 more)

### Community 5 - "mobile/package.json"
Cohesion: 0.06
Nodes (41): dependencies, expo@~57.0.31, expo-device@~57.0.2, expo-linking@~57.0.13, expo-location@~57.0.22, expo-notifications@~57.0.24, expo-secure-store@~57.0.4, expo-status-bar@~57.0.1 (+33 more)

### Community 6 - "with"
Cohesion: 0.18
Nodes (10): concurrency, cancel-in-progress, group, name, runs-on, jobs, hardware, name (+2 more)

### Community 7 - "dependencies"
Cohesion: 0.08
Nodes (34): passport, dependencies, bcrypt@^6.0.0, connect-mongo@^6.0.0, cors@^2.8.5, dotenv@^18.0.7, express-rate-limit@^8.7.1, express-session@^1.18.0 (+26 more)

### Community 8 - "useAuth"
Cohesion: 0.18
Nodes (10): AuthCard(), AuthLayout(), FEATURES, ProtectedRoute(), authApi, hasText(), isProfileComplete(), Login() (+2 more)

### Community 9 - "useAppTheme"
Cohesion: 0.20
Nodes (19): AlertCard(), styles, AppHeader(), styles, FallAlertModal(), styles, BellIcon(), GearIcon() (+11 more)

### Community 10 - "steps"
Cohesion: 0.09
Nodes (20): validate(), auditLogSchema, crypto, mongoose, crypto, emergencySessionSchema, mongoose, environmentReadingSchema (+12 more)

### Community 11 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, daisyui@^5.7.50, @headlessui/react@^2.2.10, react@^19.3.0, react-icons@^5.7.0, react-router-dom@^7.18.4, tw-elements@^2.0.0, typewriter-effect@^2.22.0 (+6 more)

### Community 12 - "frontend/src/lib/apiClient.js"
Cohesion: 0.07
Nodes (37): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+29 more)

### Community 13 - "Settings.jsx"
Cohesion: 0.26
Nodes (10): Button(), Field(), PhoneField(), DeviceCard(), FallAlertModal(), useAuth(), useLiveData(), CompleteProfile() (+2 more)

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
Cohesion: 0.14
Nodes (13): 1. Clone & Install Dependencies, 2. Configure Environment Files, 3. Start the Subsystems, 🚀 Active Development & Discussions, ⚡ Core Capabilities, 📖 In-Depth Documentation, 📄 License & Safety Notice, Prerequisites (+5 more)

### Community 18 - "Dashboard.jsx"
Cohesion: 0.07
Nodes (31): ACTIVITY_STYLES, ActivitySummary(), MiniGraph(), SummaryItem(), NotificationBell(), MiniStats(), DashboardHeader(), LiveLocationCard() (+23 more)

### Community 19 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): class-variance-authority@^0.7.1, maplibre-gl@^6.14.0, react-phone-number-input@^3.4.18, description, name, packageManager, type, version (+3 more)

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

### Community 24 - "webSocketTicketService.js"
Cohesion: 0.16
Nodes (8): bcrypt, mongoose, userSchema, crypto, mongoose, webSocketTicketSchema, crypto, mongoose

### Community 25 - "Contributor Covenant Code of Conduct"
Cohesion: 0.18
Nodes (12): adminLimiter, apiLimiter, createLimiter(), deviceLimiter, rateLimit, telemetryLimiter, express, express (+4 more)

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
Nodes (21): AppLayout(), LoadingSpinner(), OfflineBanner(), ModalButtons(), ModalHeader(), NAV_ITEMS, Sidebar(), DeviceContext (+13 more)

### Community 35 - "App.jsx"
Cohesion: 0.19
Nodes (9): App(), ErrorBoundary, DeviceProvider(), ThemeContext, ThemeProvider(), useTheme(), Landing(), SpatialHardwareViewer() (+1 more)

### Community 36 - "SWAAS / TrailGuard Security Audit & Vulnerability Assessment"
Cohesion: 0.18
Nodes (11): CI/CD Security, Out of Scope, Reporting a Vulnerability, Responsible Disclosure, Security Policy, Security Practices, Security Response Process, Security Scope (+3 more)

### Community 37 - "rateLimiter.js"
Cohesion: 0.16
Nodes (13): jwt, authLimiter, queryLimiter, express@^5.3.0, express, passport, router, express (+5 more)

### Community 38 - "simulate-esp32.js"
Cohesion: 0.05
Nodes (55): crypto, fs, generateAuthorityKeys(), parseArguments(), path, writeExclusive(), createPairingQrPayload(), fs (+47 more)

### Community 39 - "app.js"
Cohesion: 0.10
Nodes (12): app, cors, express, helmet, mongoose, passport, jwt, mockUserCreate (+4 more)

### Community 40 - "XglcdFont"
Cohesion: 0.15
Nodes (12): getAllDevicesAdmin, getDevice, getUserDevices, registerDevice(), renameDevice, unpairDevice, updateStatus, getLatest (+4 more)

### Community 41 - "frontend/src/lib/apiClient.js"
Cohesion: 0.20
Nodes (13): AuthContext, AuthProvider(), clearToken(), devicesApi, environmentApi, fallsApi, getToken(), locationApi (+5 more)

### Community 42 - "supertest"
Cohesion: 0.19
Nodes (9): devDependencies, jest@^30.5.2, supertest@^7.3.1, overrides, ip-address, minimatch, qs, jest (+1 more)

### Community 43 - ".clear"
Cohesion: 0.29
Nodes (7): 4. Mandatory Architectural Invariants (Zero-Tolerance Rules), Invariant 2: Emergency-Bounded Cloud Sharing, Invariant 3: Fail-Closed Security Audit Logging, Invariant 4: Cryptographic Device Authentication, Invariant 5: Ephemeral Retention & Automated TTL Cleanup, Invariant 6: Authenticated, Session-Scoped Real-Time Delivery, Invariant 7: Structured Redacted Logging

### Community 44 - "deviceService.js"
Cohesion: 0.22
Nodes (6): getDeviceById(), pairedOrLegacyDeviceState, registerDevice(), renameDevice(), unpairDevice(), updateDeviceStatus()

### Community 45 - "vitest"
Cohesion: 0.17
Nodes (10): API_URL, APP_NAME, config, IS_DEVELOPMENT, IS_PRODUCTION, normalizedApi, WS_URL, emergencyApi (+2 more)

### Community 46 - "environmentController.js"
Cohesion: 0.18
Nodes (4): mongoose, http, mongoose, server

### Community 47 - "mongoose"
Cohesion: 0.07
Nodes (27): concurrency, cancel-in-progress, group, GITHUB_TOKEN, jobs, sync-wiki, name, on (+19 more)

### Community 48 - "fallService.js"
Cohesion: 0.25
Nodes (6): fallEventSchema, mongoose, getLatestFall(), getUserFalls(), mongoose, updateFallStatus()

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

### Community 54 - "authController.js"
Cohesion: 0.29
Nodes (5): completeProfile, generateWsTicket, getMe, login, register

### Community 55 - "Day 6 — Privacy, Security, Authorization & Audit Logging"
Cohesion: 0.17
Nodes (12): 1. Objective and Invariants, 2. Security & Trust Architecture, 3.1 Historical Replay Authorization Matrix, 3.2 Ephemeral Data Retention Rules, 3. Data Protection Specification, 4. Structured Redacted Logging, 5. Security Verification & Test Results, 6. Day 6 Exit Criteria Checklist (+4 more)

### Community 57 - "react-native-safe-area-context"
Cohesion: 0.22
Nodes (12): BottomTabBar(), styles, tabs, AlertIcon(), HistoryIcon(), HomeIcon(), MapIcon(), SettingsIcon() (+4 more)

### Community 58 - "emergencySessionController.js"
Cohesion: 0.27
Nodes (11): assignOrJoinResponder, createSession, extractMeta(), generateWsTicket, getActiveSessions, getHistoricalData, getSessionAudit, getSessionById (+3 more)

### Community 59 - "utils.js"
Cohesion: 0.33
Nodes (4): clsx@^2.1.1, tailwind-merge@^3.7.0, clsx, tailwind-merge

### Community 60 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, preview, test, test:run

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

### Community 68 - "deviceAuthMiddleware.js"
Cohesion: 0.14
Nodes (11): crypto, deviceAuthMiddleware(), reject(), sha256(), deviceSchema, mongoose, deviceAuthNonceSchema, mongoose (+3 more)

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

### Community 73 - "AppError"
Cohesion: 0.11
Nodes (22): completePairingChallenge, getTelemetryReceipt, startPairingChallenge, assignOrJoinResponder(), createSession(), crypto, getHistoricalData(), getSessionAudit() (+14 more)

### Community 74 - "Contributing to SWAAS"
Cohesion: 0.20
Nodes (9): 1. Clone the repository, 2. Install dependencies, 3. Run with Docker Compose, 🌿 Branching and Commit Guidelines, Contributing to SWAAS, 🛠️ Development Setup & Prerequisites, 🔒 Security & Privacy Invariants, 🏗️ System Architecture Overview (+1 more)

### Community 75 - "Day 3 — Device and API Architecture"
Cohesion: 0.20
Nodes (10): 11. Verification plan, 12. Current implementation gaps and rollout gates, 1. Goals and non-goals, 2. System components and trust boundaries, 6. Emergency session and rescue authorization, Access, expiry, and deletion, Boundary rules, Day 3 — Device and API Architecture (+2 more)

### Community 76 - "fallService.js"
Cohesion: 0.20
Nodes (9): 1. Objective and Invariants, 2. Risk Engine Architecture, 3.1 `EmergencySession` (`backend/models/EmergencySession.js`), 3.2 `RiskAssessment` (`backend/models/RiskAssessment.js`), 3.3 `AuditLog` (`backend/models/AuditLog.js`), 3. Data Models Specification, 4. Verification and Acceptance Checklist, Day 4 — Risk & Emergency Models (+1 more)

### Community 77 - "socketManager.test.js"
Cohesion: 0.15
Nodes (9): config, configuredOrigins, defaultDevOrigins, requiredInProduction, jsonwebtoken@^9.0.2, EventEmitter, jwt, { PassThrough } (+1 more)

### Community 78 - "LoginScreen.js"
Cohesion: 0.29
Nodes (7): EyeIcon(), EyeOffIcon(), ShieldIcon(), LoginScreen(), styles, RegisterScreen(), styles

### Community 81 - "steps"
Cohesion: 0.29
Nodes (11): steps, name, runs-on, steps, steps, steps, deployment-config, name (+3 more)

### Community 82 - "What Should Be Reported"
Cohesion: 0.29
Nodes (7): Authentication, Authorization, Data Security, Device Security, Emergency and Safety Workflows, Infrastructure and CI/CD, What Should Be Reported

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
Cohesion: 0.31
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
Cohesion: 0.29
Nodes (8): completeUserProfile(), getUserProfile(), jwt, loginUser(), mongoose, registerUser(), signToken(), cleanEmail()

### Community 107 - "backend"
Cohesion: 0.50
Nodes (4): defaults, name, runs-on, backend

### Community 108 - "mobile"
Cohesion: 0.50
Nodes (4): mobile, name, runs-on, steps

### Community 109 - "Day 7 — Integration Testing, Architecture Compliance Review & Phase 1 Sign-Off"
Cohesion: 0.14
Nodes (13): consumeTicket(), 1. Executive Summary & Objective, 2. Final Phase 1 4-Tier Architecture, 3. Mandatory Architectural Invariant Compliance Review, 5. End-to-End Integration Test Suite, 6. Comprehensive Multi-Tier Verification Results, 7. Phase 1 Completion & Readiness Sign-Off, Day 7 — Integration Testing, Architecture Compliance Review & Phase 1 Sign-Off (+5 more)

### Community 112 - "react-icons"
Cohesion: 0.36
Nodes (5): ProfileMenu(), NotFound(), TYPEWRITER_PHRASES, react-icons, react-router-dom

### Community 115 - "InfoRow.jsx"
Cohesion: 0.15
Nodes (12): allowBuilds, react-native-screens, minimumReleaseAgeExclude, overrides, decode-uri-component, glob@>=9.0.0 <=14.0.1, minimatch@<11.0.1, node-forge (+4 more)

### Community 116 - "Icons.js"
Cohesion: 0.26
Nodes (12): ActivityCard(), Item(), styles, DeviceCard(), styles, BatteryIcon(), BootIcon(), ClockIcon() (+4 more)

### Community 117 - "10. Architecture diagrams"
Cohesion: 0.33
Nodes (6): 10. Architecture diagrams, API authentication and authorization flow, BLE communication and reconnection sequence, Emergency session lifecycle sequence, Local-first storage and normal-mode boundary, User → Device ownership entity diagram

### Community 118 - "main.jsx"
Cohesion: 0.40
Nodes (3): react-dom@^19.3.0, registerServiceWorker(), react-dom

### Community 119 - "3. Device identity, lifecycle, and ownership"
Cohesion: 0.40
Nodes (5): 3. Device identity, lifecycle, and ownership, Identity and credential, Lifecycle, Ownership policy, Secure pairing decision and flow

### Community 120 - "7. REST API contract"
Cohesion: 0.40
Nodes (5): 7. REST API contract, Conventions and authentication, Initial endpoints, Request validation and examples, Response and error format

### Community 125 - "4. BLE protocol and connection behavior"
Cohesion: 0.50
Nodes (4): 4. BLE protocol and connection behavior, BLE security model, Connection state and retries, Telemetry envelope

### Community 126 - "9. Security controls and threat model"
Cohesion: 0.50
Nodes (4): 9. Security controls and threat model, Security invariants (must always hold), Threats and mitigations, Transport, storage, secrets

### Community 130 - "vitalsController.js"
Cohesion: 0.50
Nodes (3): getHistory, getLatest, getStats

### Community 132 - "5. Local-first storage and privacy"
Cohesion: 0.67
Nodes (3): 5. Local-first storage and privacy, Local database and retention, Normal and emergency data boundary

### Community 133 - "8. Backend models and indexes"
Cohesion: 0.67
Nodes (3): 8. Backend models and indexes, Required, optional, and validation rules, Uniqueness constraints

## Knowledge Gaps
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` connect `updates` to `.clear`, `ARCHITECTURE.md`?**
  _High betweenness centrality (0.361) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AppError` (e.g. with `2. Naming Conventions & Code Style Standards` and `3.1 Backend: `AppError` & Centralized Middleware`) actually correct?**
  _`AppError` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `LiveDataContext.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06832298136645963 - nodes in this community are weakly interconnected._
- **Why does `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` connect `.clear` to `DashboardScreen.js`, `updates`?**
  _High betweenness centrality (0.296) - this node is a cross-community bridge._
- **Should `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` be split into smaller, more focused modules?**
  _Cohesion score 0.05493863237872589 - nodes in this community are weakly interconnected._
- **Why does `Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry)` connect `DashboardScreen.js` to `.clear`?**
  _High betweenness centrality (0.295) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._