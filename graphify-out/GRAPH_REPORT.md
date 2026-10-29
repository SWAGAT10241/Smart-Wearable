# Graph Report - TrailGuard  (2026-10-29)

## Corpus Check
- 234 files · ~105,502 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: (none) 12, .example 4, .conf 1)

## Summary
- 1912 nodes · 3105 edges · 144 communities (117 shown, 27 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 101 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f59f895d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- LiveDataContext.jsx
- main.c
- mongodb
- frontend/package.json
- server.test.js
- mobile/package.json
- with
- backend/package.json
- frontend/src/hooks/useDashboardData.js
- useAppTheme
- mongoose
- AppError
- steps
- Settings.jsx
- analyze
- phase1Integration.test.js
- AppNavigator.js
- README.md
- Dashboard.jsx
- App.jsx
- MPU6050
- AuthContext.js
- frontend/README.md
- 13. Day 3 exit criteria and concrete architectural answers
- express
- backend/README.md
- Display
- MAX30100
- expo
- 4. Mandatory Architectural Invariants (Zero-Tolerance Rules)
- emergencySessionApi.test.js
- SX1278
- DeviceContext.jsx
- mobile/src/lib/apiClient.js
- Security Policy
- rateLimiter.js
- simulate-esp32.js
- app.js
- deviceController.js
- deviceProvisioning.test.js
- ref_crypto
- provision-device.js
- Day 7 — Integration Testing, Architecture Compliance Review & Phase 1 Sign-Off
- frontend/src/lib/apiClient.js
- authController.js
- User.js
- auth.test.js
- overrides
- ili9341.py
- body
- body
- dependency-review.yml
- socketManager.js
- Day 6 — Privacy, Security, Authorization & Audit Logging
- XglcdFont
- ref_react
- emergencySessionController.js
- deviceService.js
- Security
- MAX30100
- Authentication
- telemetryService.js
- SWAAS / TrailGuard Codebase Architecture & Modular Organization
- Day 5 — WebSocket & Emergency Communication
- 📱 TrailGuard Mobile
- Key Features
- HistoryScreen.js
- socketManager.test.js
- emergencyRoutes.js
- Device Management
- Telemetry Fields
- Contributing to SWAAS
- Day 3 — Device and API Architecture
- Day 4 — Risk & Emergency Models
- Important Components
- react-icons
- check-syntax.js
- Security
- Common Development Workflow
- Troubleshooting
- Database Models
- Features
- FallEvent.js
- scripts
- logger.js
- Backend API Integration
- updates
- LocationReading.js
- Realtime WebSocket
- 10. Architecture diagrams
- allowBuilds
- Known Limitations
- Development Guidelines
- ESP32-S3 BLE pairing firmware
- 3. Device identity, lifecycle, and ownership
- 7. REST API contract
- Variables
- pull_request_template.md
- environmentController.js
- vitalsController.js
- Wearable Simulator
- Emergency Alerts
- Environment API
- Fall Detection API
- Vitals API
- 4. BLE protocol and connection behavior
- 9. Security controls and threat model
- Running Frontend + Backend
- mobile/pnpm-workspace.yaml
- ActivityCard.js
- System Architecture
- Technology Stack
- Repository Documentation
- locationController.js
- Environment Configuration
- Health Check
- Location API
- 5. Local-first storage and privacy
- 8. Backend models and indexes
- Authentication
- _twos_complement
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
- `Supported Versions` --references--> `main()`  [INFERRED]
  SECURITY.md → backend/scripts/provision-device.js
- `3. Mandatory Architectural Invariant Compliance Review` --references--> `getHistoricalData()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/services/emergencySessionService.js
- `Journey 4: Fail-Closed Security Audit Logging & Historical Telemetry Window` --references--> `getHistoricalData()`  [INFERRED]
  docs/architecture/day-7-integration-testing-and-documentation.md → backend/services/emergencySessionService.js
- `2. Naming Conventions & Code Style Standards` --references--> `AppError`  [INFERRED]
  AGENTS.md → backend/utils/appError.js

## Import Cycles
- None detected.

## Communities (144 total, 27 thin omitted)

### Community 0 - "LiveDataContext.jsx"
Cohesion: 0.06
Nodes (59): PairDevicePanel(), API_URL, APP_NAME, config, IS_DEVELOPMENT, IS_PRODUCTION, normalizedApi, WS_URL (+51 more)

### Community 1 - "main.c"
Cohesion: 0.05
Nodes (30): app_main(), append_authorization_challenge(), authority_public_key_available(), build_device_info(), build_telemetry_frame(), format_uuid(), gap_event(), gatt_access() (+22 more)

### Community 2 - "mongodb"
Cohesion: 0.04
Nodes (48): build, container_name, depends_on, environment, networks, ports, restart, context (+40 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.06
Nodes (44): dependencies, lucide-react@^1.55.0, maplibre-gl@^6.14.0, react@^19.3.0, react-dom@^19.3.0, react-icons@^5.7.0, react-phone-number-input@^3.4.18, react-router-dom@^7.18.4 (+36 more)

### Community 4 - "server.test.js"
Cohesion: 0.06
Nodes (36): devicePairingSchema, mongoose, assertDeviceAuthorizationConfigured(), canonicalReceiptPayload(), crypto, getAuthorityPrivateKey(), issueDeviceAuthorizationReceipt(), verifyDeviceAuthorizationReceipt() (+28 more)

### Community 5 - "mobile/package.json"
Cohesion: 0.06
Nodes (41): dependencies, expo@~57.0.31, expo-device@~57.0.2, expo-linking@~57.0.13, expo-location@~57.0.22, expo-notifications@~57.0.24, expo-secure-store@~57.0.4, expo-status-bar@~57.0.1 (+33 more)

### Community 6 - "with"
Cohesion: 0.07
Nodes (38): defaults, name, runs-on, steps, run, defaults, name, runs-on (+30 more)

### Community 7 - "backend/package.json"
Cohesion: 0.07
Nodes (34): passport, dependencies, bcrypt@^6.0.0, connect-mongo@^6.0.0, cors@^2.8.5, dotenv@^18.0.7, express-rate-limit@^8.7.1, express-session@^1.18.0 (+26 more)

### Community 8 - "frontend/src/hooks/useDashboardData.js"
Cohesion: 0.12
Nodes (19): BarTrace(), ChartCard(), GaugeBar(), LineTrace(), Sparkline(), TemperatureGauge(), MiniStats(), QuickStatsGrid() (+11 more)

### Community 9 - "useAppTheme"
Cohesion: 0.17
Nodes (20): AlertCard(), styles, AppHeader(), styles, DeviceCard(), styles, SectionCard(), styles (+12 more)

### Community 10 - "mongoose"
Cohesion: 0.08
Nodes (19): mongoose, validate(), auditLogSchema, crypto, mongoose, crypto, emergencySessionSchema, mongoose (+11 more)

### Community 11 - "AppError"
Cohesion: 0.12
Nodes (20): completePairingChallenge, getTelemetryReceipt, startPairingChallenge, assignOrJoinResponder(), createSession(), crypto, getHistoricalData(), getSessionAudit() (+12 more)

### Community 12 - "steps"
Cohesion: 0.08
Nodes (29): defaults, name, runs-on, steps, run, defaults, name, runs-on (+21 more)

### Community 13 - "Settings.jsx"
Cohesion: 0.22
Nodes (17): AuthCard(), AuthLayout(), Button(), Field(), PhoneField(), InfoRow(), DeviceCard(), FallAlertModal() (+9 more)

### Community 14 - "analyze"
Cohesion: 0.07
Nodes (28): name, runs-on, steps, strategy, jobs, analyze, language, name (+20 more)

### Community 15 - "phase1Integration.test.js"
Cohesion: 0.07
Nodes (24): crypto, jwt, mockAuditCreate, mockAuditFind, mockBroadcastEmergencyEvent, mockDeviceCreate, mockDeviceFind, mockDeviceFindOne (+16 more)

### Community 16 - "AppNavigator.js"
Cohesion: 0.12
Nodes (19): BottomTabBar(), styles, tabs, useAuth(), AppNavigator(), AuthStack(), MainTabs(), Stack (+11 more)

### Community 17 - "README.md"
Cohesion: 0.08
Nodes (25): 1. Clone the Repository, 2. Start MongoDB, 3. Configure the Backend, 4. Start the Backend, 5. Configure the Frontend, 6. Start the Frontend, 7. Run the ESP32 Simulator, API Overview (+17 more)

### Community 18 - "Dashboard.jsx"
Cohesion: 0.15
Nodes (16): ACTIVITY_STYLES, ActivitySummary(), MiniGraph(), SummaryItem(), LiveLocationCard(), RecentEventsCard(), DropletIcon(), HeartIcon() (+8 more)

### Community 19 - "App.jsx"
Cohesion: 0.15
Nodes (11): App(), ErrorBoundary, ProtectedRoute(), DeviceProvider(), ThemeContext, ThemeProvider(), saveToken(), hasText() (+3 more)

### Community 20 - "MPU6050"
Cohesion: 0.11
Nodes (9): 1. High-Level Component Flowchart, 2.1 Hardware Sensing Tier (`hardware/`), 2.2 Local-First Mobile Companion (`mobile/`), 2.3 Express & MongoDB Backend (`backend/`), 2.4 Monitoring & Rescue Dashboard (`frontend/`), 2. Architectural Subsystem Breakdown, 3. Related Specifications & Architecture Documentation, System Architecture & Component Topology (+1 more)

### Community 21 - "AuthContext.js"
Cohesion: 0.17
Nodes (17): App(), AppContent(), AuthContext, AuthProvider(), initialize(), login(), logout(), register() (+9 more)

### Community 22 - "frontend/README.md"
Cohesion: 0.09
Nodes (21): Application Architecture, Application Routes, Authentication Flow, Current Frontend Status, Dashboard, Deployment, Development Checklist, Device Management (+13 more)

### Community 23 - "13. Day 3 exit criteria and concrete architectural answers"
Cohesion: 0.10
Nodes (21): authorizeRole(), 10. How is horizontal privilege escalation prevented?, 11. How are API requests authenticated?, 12. How are API requests authorized?, 13. Day 3 exit criteria and concrete architectural answers, 13. How are pairing and replay attacks prevented?, 14. How are sensitive operations audited?, 15. How is sensitive data prevented from appearing in logs? (+13 more)

### Community 24 - "express"
Cohesion: 0.16
Nodes (13): jwt, authLimiter, queryLimiter, express@^5.3.0, express, passport, router, express (+5 more)

### Community 25 - "backend/README.md"
Cohesion: 0.10
Nodes (19): API Data Flow, API Summary, Architecture, Backend Structure, Development, Development Status, Device Authentication Status, Installation (+11 more)

### Community 29 - "expo"
Cohesion: 0.10
Nodes (19): backgroundColor, adaptiveIcon, package, permissions, expo, android, ios, name (+11 more)

### Community 30 - "4. Mandatory Architectural Invariants (Zero-Tolerance Rules)"
Cohesion: 0.11
Nodes (19): 1. System Mission & 4-Tier Architecture, 2. Naming Conventions & Code Style Standards, 3. The 6 Specialized AI Agent Personas, 4. Mandatory Architectural Invariants (Zero-Tolerance Rules), 5. Role-Based Access Control (RBAC) Matrix, 6. Prohibited Anti-Patterns (Anti-Hallucination Directives), 🛡️ Agent 1: Security & Cryptography Specialist, ☁️ Agent 2: Cloud Backend & Realtime Architect (+11 more)

### Community 31 - "emergencySessionApi.test.js"
Cohesion: 0.11
Nodes (18): crypto, mockAuditLogCreate, mockAuditLogFind, mockBroadcastEmergencyEvent, mockCurrentUser, mockDeviceFindOne, mockEmergencySessionCreate, mockEmergencySessionFind (+10 more)

### Community 34 - "DeviceContext.jsx"
Cohesion: 0.20
Nodes (12): AppLayout(), LoadingSpinner(), ModalButtons(), ModalHeader(), NAV_ITEMS, Sidebar(), DeviceContext, useDevices() (+4 more)

### Community 35 - "mobile/src/lib/apiClient.js"
Cohesion: 0.18
Nodes (11): deferred(), device, request(), API_URL, WS_URL, devicesApi, environmentApi, locationApi (+3 more)

### Community 36 - "Security Policy"
Cohesion: 0.11
Nodes (18): Authentication, Authorization, CI/CD Security, Data Security, Device Security, Emergency and Safety Workflows, Infrastructure and CI/CD, Out of Scope (+10 more)

### Community 37 - "rateLimiter.js"
Cohesion: 0.18
Nodes (12): adminLimiter, apiLimiter, createLimiter(), deviceLimiter, rateLimit, telemetryLimiter, express, express (+4 more)

### Community 38 - "simulate-esp32.js"
Cohesion: 0.29
Nodes (14): buildTelemetryPacket(), clamp(), createSignature(), crypto, generateEnvironment(), generateLocation(), generateMotion(), generatePPG() (+6 more)

### Community 39 - "app.js"
Cohesion: 0.13
Nodes (10): app, cors, express, helmet, { MongoStore }, passport, session, sessionOptions (+2 more)

### Community 40 - "deviceController.js"
Cohesion: 0.15
Nodes (12): getAllDevicesAdmin, getDevice, getUserDevices, registerDevice(), renameDevice, unpairDevice, updateStatus, getLatest (+4 more)

### Community 41 - "deviceProvisioning.test.js"
Cohesion: 0.16
Nodes (12): crypto, fs, generateAuthorityKeys(), parseArguments(), path, writeExclusive(), crypto, fs (+4 more)

### Community 42 - "ref_crypto"
Cohesion: 0.17
Nodes (8): crypto, deviceAuthMiddleware(), reject(), sha256(), deviceAuthNonceSchema, mongoose, crypto, 9. How are revoked devices/users blocked?

### Community 43 - "provision-device.js"
Cohesion: 0.24
Nodes (13): createPairingQrPayload(), fs, main(), mongoose, parseArguments(), path, printHelp(), QRCode (+5 more)

### Community 44 - "Day 7 — Integration Testing, Architecture Compliance Review & Phase 1 Sign-Off"
Cohesion: 0.13
Nodes (14): consumeTicket(), 1. Executive Summary & Objective, 2. Final Phase 1 4-Tier Architecture, 3. Mandatory Architectural Invariant Compliance Review, 4. Legacy TrailGuard → SWAAS Migration Verification, 5. End-to-End Integration Test Suite, 6. Comprehensive Multi-Tier Verification Results, 7. Phase 1 Completion & Readiness Sign-Off (+6 more)

### Community 45 - "frontend/src/lib/apiClient.js"
Cohesion: 0.24
Nodes (10): AuthContext, AuthProvider(), clearToken(), environmentApi, fallsApi, getToken(), locationApi, request() (+2 more)

### Community 46 - "authController.js"
Cohesion: 0.16
Nodes (11): completeProfile, generateWsTicket, getMe, login, register, completeUserProfile(), getUserProfile(), jwt (+3 more)

### Community 47 - "User.js"
Cohesion: 0.16
Nodes (8): bcrypt, mongoose, userSchema, crypto, mongoose, webSocketTicketSchema, crypto, mongoose

### Community 48 - "auth.test.js"
Cohesion: 0.14
Nodes (13): jsonwebtoken@^9.0.2, devDependencies, jest@^30.5.2, supertest@^7.3.1, jwt, mockUserCreate, mockUserFindById, mockUserFindByIdAndUpdate (+5 more)

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
Cohesion: 0.14
Nodes (13): name, runs-on, steps, jobs, dependency-review, name, on, pull_request (+5 more)

### Community 54 - "socketManager.js"
Cohesion: 0.22
Nodes (11): authorizeSessionSubscription(), broadcast(), broadcastEmergencyEvent(), broadcastTelemetry(), clients, EVENT_FIELDS, initWebSocket(), jwt (+3 more)

### Community 55 - "Day 6 — Privacy, Security, Authorization & Audit Logging"
Cohesion: 0.15
Nodes (12): 1. Objective and Invariants, 2. Security & Trust Architecture, 3.1 Historical Replay Authorization Matrix, 3.2 Ephemeral Data Retention Rules, 3. Data Protection Specification, 4. Structured Redacted Logging, 5. Security Verification & Test Results, 6. Day 6 Exit Criteria Checklist (+4 more)

### Community 57 - "ref_react"
Cohesion: 0.27
Nodes (8): FallAlertModal(), styles, LiveDataContext, useLiveData(), useDashboardData(), fallsApi, LiveMapScreen(), styles

### Community 58 - "emergencySessionController.js"
Cohesion: 0.27
Nodes (11): assignOrJoinResponder, createSession, extractMeta(), generateWsTicket, getActiveSessions, getHistoricalData, getSessionAudit, getSessionById (+3 more)

### Community 59 - "deviceService.js"
Cohesion: 0.17
Nodes (8): deviceSchema, mongoose, getDeviceById(), pairedOrLegacyDeviceState, registerDevice(), renameDevice(), unpairDevice(), updateDeviceStatus()

### Community 60 - "Security"
Cohesion: 0.17
Nodes (12): Authentication Rate Limiting, CORS, Device Request Rate Limiting, Emergency Data Access, Helmet, JWT Authentication, Live WebSocket Security, Ownership Enforcement (+4 more)

### Community 63 - "Authentication"
Cohesion: 0.18
Nodes (11): Authentication, Complete Google Profile, Get Current User, Google OAuth, Login, Register, Request, Request (+3 more)

### Community 64 - "telemetryService.js"
Cohesion: 0.31
Nodes (7): dispatchEmergencyAlerts(), sendEmergencySMS(), twilio, processReadings(), sendEmergencyWhatsApp(), twilio, twilio

### Community 65 - "SWAAS / TrailGuard Codebase Architecture & Modular Organization"
Cohesion: 0.18
Nodes (11): 1. Architectural Philosophy & Layered Separation, 2.1 Backend (`backend/`), 2.2 Frontend Web Dashboard (`frontend/`), 2.3 Mobile Companion App (`mobile/`), 2. Directory Structure Across All Tiers, 3.1 Backend: `AppError` & Centralized Middleware, 3.2 Frontend & Mobile: Standardized `ApiError`, 3. Standardized Error Handling Architecture (+3 more)

### Community 66 - "Day 5 — WebSocket & Emergency Communication"
Cohesion: 0.18
Nodes (11): 1. Objective and Invariants, 2. Target Architecture, 3.1 Connection Handshake, 3.2 Client-to-Server Actions, 3.3 Server-to-Client Broadcast Events, 3. Real-Time Protocol Specification, 4. Emergency REST API Specification, 5. Security and Privacy Guarantees (+3 more)

### Community 67 - "📱 TrailGuard Mobile"
Cohesion: 0.18
Nodes (10): 🛡️ API Client, 🔑 Authentication, 📌 Current Status, 🔐 Environment Configuration, 🔒 Git & Security, 🧪 Health Check, 📂 Project Structure, 📱 Running the App (+2 more)

### Community 68 - "Key Features"
Cohesion: 0.18
Nodes (11): 🔐 Authentication & User Accounts, 🌡️ Environmental Monitoring, 🚨 Fall Detection, Google Authentication, 📍 GPS Location Tracking, ❤️ Health Monitoring, Key Features, Local Authentication (+3 more)

### Community 69 - "HistoryScreen.js"
Cohesion: 0.33
Nodes (6): Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry), useDevices(), useHistoryData(), HistoryScreen(), styles, formatReadingValue()

### Community 70 - "socketManager.test.js"
Cohesion: 0.20
Nodes (6): allowedOrigins, config, requiredInProduction, EventEmitter, jwt, { PassThrough }

### Community 71 - "emergencyRoutes.js"
Cohesion: 0.29
Nodes (7): hasPermission(), ROLE_PERMISSIONS, protect(), authorizePermission(), emergencyRoutes(), express, createApiRouter()

### Community 72 - "Device Management"
Cohesion: 0.20
Nodes (10): Change Device Status, Device Management, Disconnect/Unpair Device, Get Individual Device, List User Devices, Rename Device, Request, Request (+2 more)

### Community 73 - "Telemetry Fields"
Cohesion: 0.20
Nodes (10): Device, Environment, Example Complete Telemetry Packet, Fall, GPS, Motion, Successful response, Telemetry Fields (+2 more)

### Community 74 - "Contributing to SWAAS"
Cohesion: 0.20
Nodes (9): 1. Clone the repository, 2. Install dependencies, 3. Run with Docker Compose, 🌿 Branching and Commit Guidelines, Contributing to SWAAS, 🛠️ Development Setup & Prerequisites, 🔒 Security & Privacy Invariants, 🏗️ System Architecture Overview (+1 more)

### Community 75 - "Day 3 — Device and API Architecture"
Cohesion: 0.20
Nodes (10): 11. Verification plan, 12. Current implementation gaps and rollout gates, 1. Goals and non-goals, 2. System components and trust boundaries, 6. Emergency session and rescue authorization, Access, expiry, and deletion, Boundary rules, Day 3 — Device and API Architecture (+2 more)

### Community 76 - "Day 4 — Risk & Emergency Models"
Cohesion: 0.20
Nodes (9): 1. Objective and Invariants, 2. Risk Engine Architecture, 3.1 `EmergencySession` (`backend/models/EmergencySession.js`), 3.2 `RiskAssessment` (`backend/models/RiskAssessment.js`), 3.3 `AuditLog` (`backend/models/AuditLog.js`), 3. Data Models Specification, 4. Verification and Acceptance Checklist, Day 4 — Risk & Emergency Models (+1 more)

### Community 77 - "Important Components"
Cohesion: 0.20
Nodes (10): `ActivitySummary.jsx`, `App.jsx`, `AuthContext.jsx`, `DeviceContext.jsx`, `FallAlertModal.jsx`, Important Components, `LiveDataContext.jsx`, `LiveMap.jsx` (+2 more)

### Community 78 - "react-icons"
Cohesion: 0.31
Nodes (5): NotificationBell(), ProfileMenu(), FEATURES, DashboardHeader(), react-icons

### Community 80 - "check-syntax.js"
Cohesion: 0.22
Nodes (6): checkDir(), { execSync }, fs, path, rootDir, total

### Community 81 - "Security"
Cohesion: 0.22
Nodes (9): Authentication, CORS, Device Ownership, Environment Secrets, HTTP Security, Password Security, Rate Limiting, Request Protection (+1 more)

### Community 82 - "Common Development Workflow"
Cohesion: 0.25
Nodes (8): 1. Start MongoDB, 2. Configure Environment, 3. Install Dependencies, 4. Start Backend, 5. Check Backend, 6. Start Wearable Simulator, 7. Start Frontend, Common Development Workflow

### Community 83 - "Troubleshooting"
Cohesion: 0.25
Nodes (8): Backend starts on the wrong port, Device telemetry returns `401`, Frontend cannot connect, Google login does not work, MongoDB connection failed, SMS/WhatsApp alerts are not sent, Telemetry is accepted but no dashboard update appears, Troubleshooting

### Community 84 - "Database Models"
Cohesion: 0.25
Nodes (8): Database Models, Device, EnvironmentReading, FallEvent, LocationReading, PhoneOtp, User, VitalsReading

### Community 85 - "Features"
Cohesion: 0.25
Nodes (8): Authentication, Device Management, Environmental Monitoring, Fall Detection, Features, Health Monitoring, Location Tracking, Profile and Safety

### Community 88 - "FallEvent.js"
Cohesion: 0.29
Nodes (3): fallEventSchema, mongoose, updateFallStatus()

### Community 89 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, dev, generate-device-authority-keys, provision-device, simulate, start, test

### Community 90 - "logger.js"
Cohesion: 0.43
Nodes (5): formatLog(), isProductionEnv(), logger, sanitizeValue(), SENSITIVE_KEY_PATTERNS

### Community 91 - "Backend API Integration"
Cohesion: 0.29
Nodes (7): Authentication API, Backend API Integration, Device API, Environment API, Fall API, Location API, Vitals API

### Community 92 - "updates"
Cohesion: 0.29
Nodes (6): interval, updates, directory, package-ecosystem, schedule, version

### Community 93 - "LocationReading.js"
Cohesion: 0.33
Nodes (3): locationReadingSchema, mongoose, getHistory()

### Community 94 - "Realtime WebSocket"
Cohesion: 0.33
Nodes (6): Environment Event, Fall Detected Event, Fall Status Update, Location Event, Realtime WebSocket, Vitals Event

### Community 95 - "10. Architecture diagrams"
Cohesion: 0.33
Nodes (6): 10. Architecture diagrams, API authentication and authorization flow, BLE communication and reconnection sequence, Emergency session lifecycle sequence, Local-first storage and normal-mode boundary, User → Device ownership entity diagram

### Community 96 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, esbuild, maplibre-gl, overrides, source-map-js

### Community 97 - "Known Limitations"
Cohesion: 0.33
Nodes (6): API/Frontend Synchronization, Authentication Storage, Backend Dependency, Known Limitations, Map Availability, Realtime Connection

### Community 98 - "Development Guidelines"
Cohesion: 0.33
Nodes (6): Development Guidelines, Keep API Communication Centralized, Realtime Data, Reuse Existing Components, Styling, Use Existing Contexts

### Community 100 - "ESP32-S3 BLE pairing firmware"
Cohesion: 0.33
Nodes (5): Build and flash, ESP32-S3 BLE pairing firmware, Important limitations, Pairing sequence supported by this firmware, Toolchain

### Community 101 - "3. Device identity, lifecycle, and ownership"
Cohesion: 0.40
Nodes (5): 3. Device identity, lifecycle, and ownership, Identity and credential, Lifecycle, Ownership policy, Secure pairing decision and flow

### Community 102 - "7. REST API contract"
Cohesion: 0.40
Nodes (5): 7. REST API contract, Conventions and authentication, Initial endpoints, Request validation and examples, Response and error format

### Community 103 - "Variables"
Cohesion: 0.40
Nodes (5): Development, Environment Configuration, Production, Security, Variables

### Community 104 - "pull_request_template.md"
Cohesion: 0.40
Nodes (4): 📝 Description, 🔐 Security & Privacy Verification, 🧪 Testing Checklist, 🔍 Type of Change

### Community 105 - "environmentController.js"
Cohesion: 0.50
Nodes (3): getHistory, getLatest, getStats

### Community 106 - "vitalsController.js"
Cohesion: 0.50
Nodes (3): getHistory, getLatest, getStats

### Community 107 - "Wearable Simulator"
Cohesion: 0.50
Nodes (4): Custom Simulator Configuration, Start Backend, Start Simulator, Wearable Simulator

### Community 108 - "Emergency Alerts"
Cohesion: 0.50
Nodes (4): Emergency Alerts, Important Alert Behavior, SMS, WhatsApp

### Community 109 - "Environment API"
Cohesion: 0.50
Nodes (4): Environment API, Environment History, Environment Statistics, Latest Environment

### Community 110 - "Fall Detection API"
Cohesion: 0.50
Nodes (4): Fall Detection API, Get Fall Events, Get Latest Fall, Update Fall Status

### Community 111 - "Vitals API"
Cohesion: 0.50
Nodes (4): Latest Vitals, Vitals API, Vitals History, Vitals Statistics

### Community 112 - "4. BLE protocol and connection behavior"
Cohesion: 0.50
Nodes (4): 4. BLE protocol and connection behavior, BLE security model, Connection state and retries, Telemetry envelope

### Community 113 - "9. Security controls and threat model"
Cohesion: 0.50
Nodes (4): 9. Security controls and threat model, Security invariants (must always hold), Threats and mitigations, Transport, storage, secrets

### Community 114 - "Running Frontend + Backend"
Cohesion: 0.50
Nodes (4): Data flow, Running Frontend + Backend, Terminal 1 — Backend, Terminal 2 — Frontend

### Community 115 - "mobile/pnpm-workspace.yaml"
Cohesion: 0.50
Nodes (3): allowBuilds, react-native-screens, minimumReleaseAgeExclude

### Community 116 - "ActivityCard.js"
Cohesion: 0.67
Nodes (3): ActivityCard(), Item(), styles

### Community 117 - "System Architecture"
Cohesion: 0.50
Nodes (4): 1. Hardware Layer, 2. Backend Layer, 3. Frontend Layer, System Architecture

### Community 118 - "Technology Stack"
Cohesion: 0.50
Nodes (4): Backend, Frontend, Hardware, Technology Stack

### Community 119 - "Repository Documentation"
Cohesion: 0.50
Nodes (4): Backend Documentation, Frontend Documentation, Repository Documentation, Root Documentation

### Community 121 - "Environment Configuration"
Cohesion: 0.67
Nodes (3): Environment Configuration, Environment Variables, Important

### Community 122 - "Health Check"
Cohesion: 0.67
Nodes (3): Health Check, Request, Response

### Community 123 - "Location API"
Cohesion: 0.67
Nodes (3): Latest Location, Location API, Location History

### Community 125 - "5. Local-first storage and privacy"
Cohesion: 0.67
Nodes (3): 5. Local-first storage and privacy, Local database and retention, Normal and emergency data boundary

### Community 126 - "8. Backend models and indexes"
Cohesion: 0.67
Nodes (3): 8. Backend models and indexes, Required, optional, and validation rules, Uniqueness constraints

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

## Knowledge Gaps
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SWAAS / TrailGuard — Unified AI Agent Directives & Architecture` connect `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` to `ARCHITECTURE.md`?**
  _High betweenness centrality (0.406) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AppError` (e.g. with `2. Naming Conventions & Code Style Standards` and `3.1 Backend: `AppError` & Centralized Middleware`) actually correct?**
  _`AppError` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `LiveDataContext.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05600722673893405 - nodes in this community are weakly interconnected._
- **Why does `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` connect `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` to `HistoryScreen.js`?**
  _High betweenness centrality (0.301) - this node is a cross-community bridge._
- **Should `main.c` be split into smaller, more focused modules?**
  _Cohesion score 0.05493863237872589 - nodes in this community are weakly interconnected._
- **Why does `Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry)` connect `HistoryScreen.js` to `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)`?**
  _High betweenness centrality (0.294) - this node is a cross-community bridge._
- **Should `mongodb` be split into smaller, more focused modules?**
  _Cohesion score 0.04251700680272109 - nodes in this community are weakly interconnected._