# Graph Report - TrailGuard  (2026-10-29)

## Corpus Check
- 239 files · ~106,533 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: (none) 13, .example 4, .conf 1)

## Summary
- 1967 nodes · 3157 edges · 148 communities (120 shown, 28 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 101 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `580ae7c0`
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
- Dashboard.jsx
- mongoose
- app.js
- frontend/src/lib/apiClient.js
- analyze
- auth.test.js
- useAuth
- README.md
- App.jsx
- frontend/README.md
- server.test.js
- machine
- backend/README.md
- Display
- .is_off_grid
- MAX30100
- SX1278
- Security Policy
- passport
- LiveDataContext.jsx
- updates
- supertest
- VitalsReading.js
- overrides
- body
- body
- dependency-review.yml
- Environment Configuration
- AppError
- deviceController.js
- authService.js
- ili9341.py
- .clear
- MAX30100
- 📱 TrailGuard Mobile
- authController.js
- steps
- Authentication
- Device Management
- telemetryService.js
- Key Features
- body
- dependency-review.yml
- socketManager.js
- Day 6 — Privacy, Security, Authorization & Audit Logging
- XglcdFont
- reviews
- emergencySessionController.js
- devicePairingService.js
- Telemetry Fields
- Important Components
- .draw_hline
- steps
- SWAAS / TrailGuard Codebase Architecture & Modular Organization
- Security
- Security
- Common Development Workflow
- Troubleshooting
- webSocketTicketService.js
- Features
- .draw_line
- expo
- Contributing to SWAAS
- fallService.js
- LocationReading.js
- Backend API Integration
- ref_react
- Known Limitations
- Development Guidelines
- .draw_pixel
- scripts
- Variables
- pull_request_template.md
- telemetryService.js
- Environment API
- Fall Detection API
- Vitals API
- response.js
- reviews
- useDashboardData.js
- mobile/pnpm-workspace.yaml
- System Architecture
- Technology Stack
- Repository Documentation
- Health Check
- Location API
- Authentication
- max30100.py
- mobile/src/lib/profileCompletion.js
- deviceController.js
- Project Status
- logger.js
- Testing
- Location and Live Map
- Realtime Data
- TrailGuard Frontend
- PageHeader.jsx
- SectionCard.jsx
- InfoRow.jsx
- vercel.json
- Getting Started
- TrailGuard — Smart Wearable Safety & Health Monitoring System
- Unispace12x24.c
- Environment Configuration
- Health Check
- environmentController.js
- 5. Local-first storage and privacy
- What Should Be Reported
- Authentication
- max30100.py
- dependencies
- mobile/src/lib/profileCompletion.js
- TrailGuard — Smart Wearable Safety & Health Monitoring System
- Production Build
- Testing
- Project Status
- Testing
- Location and Live Map
- Realtime Data
- TrailGuard Frontend
- vercel.json
- 6. Emergency session and rescue authorization
- GEMINI.md
- react-icons
- ErrorBoundary
- LocationReading.js
- authRoutes.js

## God Nodes (most connected - your core abstractions)
1. `Display` - 41 edges
2. `AppError` - 37 edges
3. `useAppTheme()` - 29 edges
4. `mongoose` - 23 edges
5. `13. Day 3 exit criteria and concrete architectural answers` - 21 edges
6. `MAX30100` - 20 edges
7. `useAuth()` - 19 edges
8. `react-native` - 19 edges
9. `Dashboard()` - 17 edges
10. `App()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `4. Legacy TrailGuard → SWAAS Migration Verification` --references--> `deviceAuthMiddleware()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/middleware/deviceAuthMiddleware.js
- `🛠️ Development & CI/CD Workflow` --references--> `main()`  [INFERRED]
  mobile/README.md → backend/scripts/provision-device.js
- `Supported Versions` --references--> `main()`  [INFERRED]
  SECURITY.md → backend/scripts/provision-device.js
- `3. Mandatory Architectural Invariant Compliance Review` --references--> `getHistoricalData()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/services/emergencySessionService.js
- `Journey 4: Fail-Closed Security Audit Logging & Historical Telemetry Window` --references--> `getHistoricalData()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/services/emergencySessionService.js

## Import Cycles
- None detected.

## Communities (148 total, 28 thin omitted)

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
Nodes (37): passport, dependencies, bcrypt@^6.0.0, connect-mongo@^6.0.0, cors@^2.8.5, dotenv@^18.0.7, express-rate-limit@^8.7.1, express-session@^1.18.0 (+29 more)

### Community 8 - "rateLimiter.js"
Cohesion: 0.15
Nodes (12): BarTrace(), ChartCard(), GaugeBar(), LineTrace(), Sparkline(), TemperatureGauge(), MiniStats(), QuickStatsGrid() (+4 more)

### Community 9 - "Dashboard.jsx"
Cohesion: 0.17
Nodes (20): AlertCard(), styles, AppHeader(), styles, DeviceCard(), styles, SectionCard(), styles (+12 more)

### Community 10 - "mongoose"
Cohesion: 0.08
Nodes (23): validate(), auditLogSchema, crypto, mongoose, crypto, emergencySessionSchema, mongoose, environmentReadingSchema (+15 more)

### Community 11 - "app.js"
Cohesion: 0.09
Nodes (26): completePairingChallenge, getTelemetryReceipt, startPairingChallenge, getDeviceById(), pairedOrLegacyDeviceState, registerDevice(), renameDevice(), unpairDevice() (+18 more)

### Community 12 - "frontend/src/lib/apiClient.js"
Cohesion: 0.07
Nodes (32): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+24 more)

### Community 13 - "analyze"
Cohesion: 0.28
Nodes (10): Button(), Field(), PhoneField(), InfoRow(), DeviceCard(), ThemeContext, useTheme(), CompleteProfile() (+2 more)

### Community 14 - "auth.test.js"
Cohesion: 0.06
Nodes (31): name, runs-on, steps, strategy, concurrency, cancel-in-progress, group, jobs (+23 more)

### Community 15 - "useAuth"
Cohesion: 0.07
Nodes (24): crypto, jwt, mockAuditCreate, mockAuditFind, mockBroadcastEmergencyEvent, mockDeviceCreate, mockDeviceFind, mockDeviceFindOne (+16 more)

### Community 16 - "README.md"
Cohesion: 0.12
Nodes (19): BottomTabBar(), styles, tabs, useAuth(), AppNavigator(), AuthStack(), MainTabs(), Stack (+11 more)

### Community 17 - "App.jsx"
Cohesion: 0.08
Nodes (25): 1. Clone the Repository, 2. Start MongoDB, 3. Configure the Backend, 4. Start the Backend, 5. Configure the Frontend, 6. Start the Frontend, 7. Run the ESP32 Simulator, API Overview (+17 more)

### Community 18 - "frontend/README.md"
Cohesion: 0.15
Nodes (16): ACTIVITY_STYLES, ActivitySummary(), MiniGraph(), SummaryItem(), LiveLocationCard(), RecentEventsCard(), DropletIcon(), HeartIcon() (+8 more)

### Community 19 - "server.test.js"
Cohesion: 0.23
Nodes (14): App(), AuthCard(), AuthLayout(), FallAlertModal(), ProtectedRoute(), useAuth(), DeviceProvider(), ThemeProvider() (+6 more)

### Community 20 - "machine"
Cohesion: 0.11
Nodes (9): 1. High-Level Component Flowchart, 2.1 Hardware Sensing Tier (`hardware/`), 2.2 Local-First Mobile Companion (`mobile/`), 2.3 Express & MongoDB Backend (`backend/`), 2.4 Monitoring & Rescue Dashboard (`frontend/`), 2. Architectural Subsystem Breakdown, 3. Related Specifications & Architecture Documentation, System Architecture & Component Topology (+1 more)

### Community 21 - "backend/README.md"
Cohesion: 0.17
Nodes (17): App(), AppContent(), AuthContext, AuthProvider(), initialize(), login(), logout(), register() (+9 more)

### Community 22 - "Display"
Cohesion: 0.09
Nodes (21): Application Architecture, Application Routes, Authentication Flow, Current Frontend Status, Dashboard, Deployment, Development Checklist, Device Management (+13 more)

### Community 23 - ".is_off_grid"
Cohesion: 0.10
Nodes (21): authorizeRole(), 10. How is horizontal privilege escalation prevented?, 11. How are API requests authenticated?, 12. How are API requests authorized?, 13. Day 3 exit criteria and concrete architectural answers, 13. How are pairing and replay attacks prevented?, 14. How are sensitive operations audited?, 15. How is sensitive data prevented from appearing in logs? (+13 more)

### Community 24 - "MAX30100"
Cohesion: 0.23
Nodes (9): jwt, queryLimiter, express@^5.3.0, express, express, express, express, express (+1 more)

### Community 25 - "SX1278"
Cohesion: 0.10
Nodes (19): API Data Flow, API Summary, Architecture, Backend Structure, Development, Development Status, Device Authentication Status, Installation (+11 more)

### Community 29 - "LiveDataContext.jsx"
Cohesion: 0.10
Nodes (19): backgroundColor, adaptiveIcon, package, permissions, expo, android, ios, name (+11 more)

### Community 30 - "updates"
Cohesion: 0.10
Nodes (20): 1. System Mission & 4-Tier Architecture, 2. Naming Conventions & Code Style Standards, 3. The 6 Specialized AI Agent Personas, 4. Mandatory Architectural Invariants (Zero-Tolerance Rules), 5. Role-Based Access Control (RBAC) Matrix, 6. Prohibited Anti-Patterns (Anti-Hallucination Directives), 7. Knowledge Graph & Architecture Navigation (Graphify), 🛡️ Agent 1: Security & Cryptography Specialist (+12 more)

### Community 31 - "supertest"
Cohesion: 0.11
Nodes (18): crypto, mockAuditLogCreate, mockAuditLogFind, mockBroadcastEmergencyEvent, mockCurrentUser, mockDeviceFindOne, mockEmergencySessionCreate, mockEmergencySessionFind (+10 more)

### Community 34 - "overrides"
Cohesion: 0.20
Nodes (12): AppLayout(), LoadingSpinner(), ModalButtons(), ModalHeader(), NAV_ITEMS, Sidebar(), DeviceContext, useDevices() (+4 more)

### Community 35 - "body"
Cohesion: 0.18
Nodes (11): deferred(), device, request(), API_URL, WS_URL, devicesApi, environmentApi, locationApi (+3 more)

### Community 36 - "body"
Cohesion: 0.18
Nodes (11): CI/CD Security, Out of Scope, Reporting a Vulnerability, Responsible Disclosure, Security Policy, Security Practices, Security Response Process, Security Scope (+3 more)

### Community 37 - "dependency-review.yml"
Cohesion: 0.18
Nodes (12): adminLimiter, apiLimiter, createLimiter(), deviceLimiter, rateLimit, telemetryLimiter, express, express (+4 more)

### Community 38 - "Environment Configuration"
Cohesion: 0.29
Nodes (14): buildTelemetryPacket(), clamp(), createSignature(), crypto, generateEnvironment(), generateLocation(), generateMotion(), generatePPG() (+6 more)

### Community 39 - "AppError"
Cohesion: 0.11
Nodes (11): app, cors, express, helmet, { MongoStore }, passport, session, sessionOptions (+3 more)

### Community 40 - "deviceController.js"
Cohesion: 0.11
Nodes (14): registerDevice(), getHistory, getLatest, getStats, getLatest, getUserFalls, updateStatus(), getHistory (+6 more)

### Community 41 - "authService.js"
Cohesion: 0.17
Nodes (11): crypto, fs, generateAuthorityKeys(), parseArguments(), path, writeExclusive(), crypto, fs (+3 more)

### Community 42 - "ili9341.py"
Cohesion: 0.15
Nodes (10): crypto, deviceAuthMiddleware(), reject(), sha256(), deviceSchema, mongoose, deviceAuthNonceSchema, mongoose (+2 more)

### Community 43 - ".clear"
Cohesion: 0.26
Nodes (12): createPairingQrPayload(), fs, main(), mongoose, parseArguments(), path, printHelp(), QRCode (+4 more)

### Community 44 - "MAX30100"
Cohesion: 0.15
Nodes (12): 1. Executive Summary & Objective, 2. Final Phase 1 4-Tier Architecture, 3. Mandatory Architectural Invariant Compliance Review, 4. Legacy TrailGuard → SWAAS Migration Verification, 5. End-to-End Integration Test Suite, 6. Comprehensive Multi-Tier Verification Results, 7. Phase 1 Completion & Readiness Sign-Off, Day 7 — Integration Testing, Architecture Compliance Review & Phase 1 Sign-Off (+4 more)

### Community 45 - "📱 TrailGuard Mobile"
Cohesion: 0.20
Nodes (13): AuthContext, AuthProvider(), authApi, clearToken(), devicePairingApi, environmentApi, fallsApi, getToken() (+5 more)

### Community 46 - "authController.js"
Cohesion: 0.16
Nodes (11): completeProfile, generateWsTicket, getMe, login, register, completeUserProfile(), getUserProfile(), jwt (+3 more)

### Community 47 - "steps"
Cohesion: 0.07
Nodes (26): concurrency, cancel-in-progress, group, GITHUB_TOKEN, jobs, sync-wiki, name, on (+18 more)

### Community 48 - "Authentication"
Cohesion: 0.18
Nodes (10): jsonwebtoken@^9.0.2, supertest@^7.3.1, jwt, mockUserCreate, mockUserFindById, mockUserFindByIdAndUpdate, mockUserFindOne, request (+2 more)

### Community 49 - "Device Management"
Cohesion: 0.14
Nodes (13): allowBuilds, bcrypt, mongodb-memory-server, @parcel/watcher, unrs-resolver, overrides, body-parser, brace-expansion (+5 more)

### Community 51 - "Key Features"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 52 - "body"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 53 - "dependency-review.yml"
Cohesion: 0.12
Nodes (16): concurrency, cancel-in-progress, group, name, runs-on, steps, jobs, dependency-review (+8 more)

### Community 54 - "socketManager.js"
Cohesion: 0.22
Nodes (11): authorizeSessionSubscription(), broadcast(), broadcastEmergencyEvent(), broadcastTelemetry(), clients, EVENT_FIELDS, initWebSocket(), jwt (+3 more)

### Community 55 - "Day 6 — Privacy, Security, Authorization & Audit Logging"
Cohesion: 0.17
Nodes (12): 1. Objective and Invariants, 2. Security & Trust Architecture, 3.1 Historical Replay Authorization Matrix, 3.2 Ephemeral Data Retention Rules, 3. Data Protection Specification, 4. Structured Redacted Logging, 5. Security Verification & Test Results, 6. Day 6 Exit Criteria Checklist (+4 more)

### Community 57 - "reviews"
Cohesion: 0.27
Nodes (8): FallAlertModal(), styles, LiveDataContext, useLiveData(), useDashboardData(), fallsApi, LiveMapScreen(), styles

### Community 58 - "emergencySessionController.js"
Cohesion: 0.27
Nodes (11): assignOrJoinResponder, createSession, extractMeta(), generateWsTicket, getActiveSessions, getHistoricalData, getSessionAudit, getSessionById (+3 more)

### Community 59 - "devicePairingService.js"
Cohesion: 0.16
Nodes (15): devicePairingSchema, mongoose, assertDeviceAuthorizationConfigured(), canonicalReceiptPayload(), crypto, getAuthorityPrivateKey(), issueDeviceAuthorizationReceipt(), verifyDeviceAuthorizationReceipt() (+7 more)

### Community 60 - "Telemetry Fields"
Cohesion: 0.17
Nodes (12): Authentication Rate Limiting, CORS, Device Request Rate Limiting, Emergency Data Access, Helmet, JWT Authentication, Live WebSocket Security, Ownership Enforcement (+4 more)

### Community 63 - ".draw_hline"
Cohesion: 0.18
Nodes (11): Authentication, Complete Google Profile, Get Current User, Google OAuth, Login, Register, Request, Request (+3 more)

### Community 64 - "steps"
Cohesion: 0.20
Nodes (10): mongoose, vitalsReadingSchema, twilio@^6.1.2, dispatchEmergencyAlerts(), sendEmergencySMS(), twilio, processReadings(), sendEmergencyWhatsApp() (+2 more)

### Community 65 - "SWAAS / TrailGuard Codebase Architecture & Modular Organization"
Cohesion: 0.18
Nodes (11): 1. Architectural Philosophy & Layered Separation, 2.1 Backend (`backend/`), 2.2 Frontend Web Dashboard (`frontend/`), 2.3 Mobile Companion App (`mobile/`), 2. Directory Structure Across All Tiers, 3.1 Backend: `AppError` & Centralized Middleware, 3.2 Frontend & Mobile: Standardized `ApiError`, 3. Standardized Error Handling Architecture (+3 more)

### Community 66 - "Security"
Cohesion: 0.18
Nodes (11): 1. Objective and Invariants, 2. Target Architecture, 3.1 Connection Handshake, 3.2 Client-to-Server Actions, 3.3 Server-to-Client Broadcast Events, 3. Real-Time Protocol Specification, 4. Emergency REST API Specification, 5. Security and Privacy Guarantees (+3 more)

### Community 67 - "Security"
Cohesion: 0.17
Nodes (11): 🛡️ API Client, 🔑 Authentication, 📌 Current Status, 🛠️ Development & CI/CD Workflow, 🔐 Environment Configuration, 🔒 Git & Security, 🧪 Health Check, 📂 Project Structure (+3 more)

### Community 68 - "Common Development Workflow"
Cohesion: 0.18
Nodes (11): 🔐 Authentication & User Accounts, 🌡️ Environmental Monitoring, 🚨 Fall Detection, Google Authentication, 📍 GPS Location Tracking, ❤️ Health Monitoring, Key Features, Local Authentication (+3 more)

### Community 69 - "Troubleshooting"
Cohesion: 0.33
Nodes (6): Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry), useDevices(), useHistoryData(), HistoryScreen(), styles, formatReadingValue()

### Community 70 - "webSocketTicketService.js"
Cohesion: 0.12
Nodes (9): allowedOrigins, config, requiredInProduction, consumeTicket(), crypto, EventEmitter, jwt, { PassThrough } (+1 more)

### Community 71 - "Features"
Cohesion: 0.29
Nodes (7): hasPermission(), ROLE_PERMISSIONS, protect(), authorizePermission(), emergencyRoutes(), express, createApiRouter()

### Community 72 - ".draw_line"
Cohesion: 0.20
Nodes (10): Change Device Status, Device Management, Disconnect/Unpair Device, Get Individual Device, List User Devices, Rename Device, Request, Request (+2 more)

### Community 73 - "expo"
Cohesion: 0.20
Nodes (10): Device, Environment, Example Complete Telemetry Packet, Fall, GPS, Motion, Successful response, Telemetry Fields (+2 more)

### Community 74 - "Contributing to SWAAS"
Cohesion: 0.20
Nodes (9): 1. Clone the repository, 2. Install dependencies, 3. Run with Docker Compose, 🌿 Branching and Commit Guidelines, Contributing to SWAAS, 🛠️ Development Setup & Prerequisites, 🔒 Security & Privacy Invariants, 🏗️ System Architecture Overview (+1 more)

### Community 75 - "fallService.js"
Cohesion: 0.20
Nodes (9): 11. Verification plan, 12. Current implementation gaps and rollout gates, 1. Goals and non-goals, 2. System components and trust boundaries, 8. Backend models and indexes, Boundary rules, Day 3 — Device and API Architecture, Required, optional, and validation rules (+1 more)

### Community 76 - "LocationReading.js"
Cohesion: 0.20
Nodes (9): 1. Objective and Invariants, 2. Risk Engine Architecture, 3.1 `EmergencySession` (`backend/models/EmergencySession.js`), 3.2 `RiskAssessment` (`backend/models/RiskAssessment.js`), 3.3 `AuditLog` (`backend/models/AuditLog.js`), 3. Data Models Specification, 4. Verification and Acceptance Checklist, Day 4 — Risk & Emergency Models (+1 more)

### Community 77 - "Backend API Integration"
Cohesion: 0.20
Nodes (10): `ActivitySummary.jsx`, `App.jsx`, `AuthContext.jsx`, `DeviceContext.jsx`, `FallAlertModal.jsx`, Important Components, `LiveDataContext.jsx`, `LiveMap.jsx` (+2 more)

### Community 78 - "ref_react"
Cohesion: 0.38
Nodes (8): useLiveData(), useDashboardData(), formatDuration(), formatUpdatedText(), getReadingTimestamp(), calculateCalories(), calculateNumericStats(), distanceBetweenPoints()

### Community 80 - "Known Limitations"
Cohesion: 0.25
Nodes (6): checkDir(), { execSync }, fs, path, rootDir, total

### Community 81 - "Development Guidelines"
Cohesion: 0.22
Nodes (9): Authentication, CORS, Device Ownership, Environment Secrets, HTTP Security, Password Security, Rate Limiting, Request Protection (+1 more)

### Community 82 - ".draw_pixel"
Cohesion: 0.25
Nodes (8): 1. Start MongoDB, 2. Configure Environment, 3. Install Dependencies, 4. Start Backend, 5. Check Backend, 6. Start Wearable Simulator, 7. Start Frontend, Common Development Workflow

### Community 83 - "scripts"
Cohesion: 0.25
Nodes (8): Backend starts on the wrong port, Device telemetry returns `401`, Frontend cannot connect, Google login does not work, MongoDB connection failed, SMS/WhatsApp alerts are not sent, Telemetry is accepted but no dashboard update appears, Troubleshooting

### Community 84 - "Variables"
Cohesion: 0.25
Nodes (8): Database Models, Device, EnvironmentReading, FallEvent, LocationReading, PhoneOtp, User, VitalsReading

### Community 85 - "pull_request_template.md"
Cohesion: 0.25
Nodes (8): Authentication, Device Management, Environmental Monitoring, Fall Detection, Features, Health Monitoring, Location Tracking, Profile and Safety

### Community 88 - "telemetryService.js"
Cohesion: 0.29
Nodes (3): fallEventSchema, mongoose, updateFallStatus()

### Community 89 - "Environment API"
Cohesion: 0.29
Nodes (7): scripts, dev, generate-device-authority-keys, provision-device, simulate, start, test

### Community 90 - "Fall Detection API"
Cohesion: 0.43
Nodes (5): formatLog(), isProductionEnv(), logger, sanitizeValue(), SENSITIVE_KEY_PATTERNS

### Community 91 - "Vitals API"
Cohesion: 0.29
Nodes (7): Authentication API, Backend API Integration, Device API, Environment API, Fall API, Location API, Vitals API

### Community 92 - "response.js"
Cohesion: 0.29
Nodes (6): interval, updates, directory, package-ecosystem, schedule, version

### Community 93 - "reviews"
Cohesion: 0.15
Nodes (12): base_branches, drafts, enabled, chat, auto_reply, language, reviews, auto_review (+4 more)

### Community 94 - "useDashboardData.js"
Cohesion: 0.33
Nodes (6): Environment Event, Fall Detected Event, Fall Status Update, Location Event, Realtime WebSocket, Vitals Event

### Community 95 - "mobile/pnpm-workspace.yaml"
Cohesion: 0.33
Nodes (6): 10. Architecture diagrams, API authentication and authorization flow, BLE communication and reconnection sequence, Emergency session lifecycle sequence, Local-first storage and normal-mode boundary, User → Device ownership entity diagram

### Community 96 - "System Architecture"
Cohesion: 0.33
Nodes (5): allowBuilds, esbuild, maplibre-gl, overrides, source-map-js

### Community 97 - "Technology Stack"
Cohesion: 0.33
Nodes (6): API/Frontend Synchronization, Authentication Storage, Backend Dependency, Known Limitations, Map Availability, Realtime Connection

### Community 98 - "Repository Documentation"
Cohesion: 0.33
Nodes (6): Development Guidelines, Keep API Communication Centralized, Realtime Data, Reuse Existing Components, Styling, Use Existing Contexts

### Community 100 - "Health Check"
Cohesion: 0.33
Nodes (5): Build and flash, ESP32-S3 BLE pairing firmware, Important limitations, Pairing sequence supported by this firmware, Toolchain

### Community 101 - "Location API"
Cohesion: 0.40
Nodes (5): 3. Device identity, lifecycle, and ownership, Identity and credential, Lifecycle, Ownership policy, Secure pairing decision and flow

### Community 102 - "Authentication"
Cohesion: 0.40
Nodes (5): 7. REST API contract, Conventions and authentication, Initial endpoints, Request validation and examples, Response and error format

### Community 103 - "max30100.py"
Cohesion: 0.40
Nodes (5): Development, Environment Configuration, Production, Security, Variables

### Community 104 - "mobile/src/lib/profileCompletion.js"
Cohesion: 0.40
Nodes (4): 📝 Description, 🔐 Security & Privacy Verification, 🧪 Testing Checklist, 🔍 Type of Change

### Community 105 - "deviceController.js"
Cohesion: 0.29
Nodes (6): getAllDevicesAdmin, getDevice, getUserDevices, renameDevice, unpairDevice, updateStatus

### Community 107 - "Project Status"
Cohesion: 0.50
Nodes (4): Custom Simulator Configuration, Start Backend, Start Simulator, Wearable Simulator

### Community 108 - "logger.js"
Cohesion: 0.50
Nodes (4): Emergency Alerts, Important Alert Behavior, SMS, WhatsApp

### Community 109 - "Testing"
Cohesion: 0.50
Nodes (4): Environment API, Environment History, Environment Statistics, Latest Environment

### Community 110 - "Location and Live Map"
Cohesion: 0.50
Nodes (4): Fall Detection API, Get Fall Events, Get Latest Fall, Update Fall Status

### Community 111 - "Realtime Data"
Cohesion: 0.50
Nodes (4): Latest Vitals, Vitals API, Vitals History, Vitals Statistics

### Community 112 - "TrailGuard Frontend"
Cohesion: 0.50
Nodes (4): 4. BLE protocol and connection behavior, BLE security model, Connection state and retries, Telemetry envelope

### Community 113 - "PageHeader.jsx"
Cohesion: 0.50
Nodes (4): 9. Security controls and threat model, Security invariants (must always hold), Threats and mitigations, Transport, storage, secrets

### Community 114 - "SectionCard.jsx"
Cohesion: 0.50
Nodes (4): Data flow, Running Frontend + Backend, Terminal 1 — Backend, Terminal 2 — Frontend

### Community 115 - "InfoRow.jsx"
Cohesion: 0.50
Nodes (3): allowBuilds, react-native-screens, minimumReleaseAgeExclude

### Community 116 - "vercel.json"
Cohesion: 0.67
Nodes (3): ActivityCard(), Item(), styles

### Community 117 - "Getting Started"
Cohesion: 0.50
Nodes (4): 1. Hardware Layer, 2. Backend Layer, 3. Frontend Layer, System Architecture

### Community 118 - "TrailGuard — Smart Wearable Safety & Health Monitoring System"
Cohesion: 0.50
Nodes (4): Backend, Frontend, Hardware, Technology Stack

### Community 119 - "Unispace12x24.c"
Cohesion: 0.50
Nodes (4): Backend Documentation, Frontend Documentation, Repository Documentation, Root Documentation

### Community 121 - "Environment Configuration"
Cohesion: 0.67
Nodes (3): Environment Configuration, Environment Variables, Important

### Community 122 - "Health Check"
Cohesion: 0.67
Nodes (3): Health Check, Request, Response

### Community 123 - "environmentController.js"
Cohesion: 0.67
Nodes (3): Latest Location, Location API, Location History

### Community 125 - "5. Local-first storage and privacy"
Cohesion: 0.67
Nodes (3): 5. Local-first storage and privacy, Local database and retention, Normal and emergency data boundary

### Community 126 - "What Should Be Reported"
Cohesion: 0.29
Nodes (7): Authentication, Authorization, Data Security, Device Security, Emergency and Safety Workflows, Infrastructure and CI/CD, What Should Be Reported

### Community 127 - "Authentication"
Cohesion: 0.67
Nodes (3): Authentication, JWT, Protected Routes

### Community 131 - "TrailGuard — Smart Wearable Safety & Health Monitoring System"
Cohesion: 0.67
Nodes (3): Architecture and security design, Overview, TrailGuard — Smart Wearable Safety & Health Monitoring System

### Community 132 - "Production Build"
Cohesion: 0.67
Nodes (3): Backend, Frontend, Production Build

### Community 133 - "Testing"
Cohesion: 0.67
Nodes (3): Backend Testing, Frontend Testing, Testing

### Community 134 - "Project Status"
Cohesion: 0.67
Nodes (3): Implemented, In Progress / Optional, Project Status

### Community 144 - "6. Emergency session and rescue authorization"
Cohesion: 0.50
Nodes (4): 6. Emergency session and rescue authorization, Access, expiry, and deletion, Minimum emergency package, Trigger, states, and transitions

### Community 149 - "react-icons"
Cohesion: 0.31
Nodes (5): NotificationBell(), ProfileMenu(), FEATURES, DashboardHeader(), react-icons

### Community 151 - "LocationReading.js"
Cohesion: 0.33
Nodes (3): locationReadingSchema, mongoose, getHistory()

### Community 153 - "authRoutes.js"
Cohesion: 0.40
Nodes (4): authLimiter, express, passport, router

## Knowledge Gaps
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` connect `updates` to `Wearable Simulator`?**
  _High betweenness centrality (0.340) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AppError` (e.g. with `2. Naming Conventions & Code Style Standards` and `3.1 Backend: `AppError` & Centralized Middleware`) actually correct?**
  _`AppError` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.056790123456790124 - nodes in this community are weakly interconnected._
- **Why does `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` connect `updates` to `Troubleshooting`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._
- **Should `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` be split into smaller, more focused modules?**
  _Cohesion score 0.05493863237872589 - nodes in this community are weakly interconnected._
- **Why does `Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry)` connect `Troubleshooting` to `updates`?**
  _High betweenness centrality (0.239) - this node is a cross-community bridge._
- **Should `check-syntax.js` be split into smaller, more focused modules?**
  _Cohesion score 0.04251700680272109 - nodes in this community are weakly interconnected._