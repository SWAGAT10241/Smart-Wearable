# Graph Report - TrailGuard  (2026-11-08)

## Corpus Check
- 202 files · ~72,661 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .example 3, .conf 1)

## Summary
- 1182 nodes · 2021 edges · 65 communities (46 shown, 19 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ecc03a4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_react
- 4. Mandatory Architectural Invariants (Zero-Tolerance Rules)
- check-syntax.js
- frontend/package.json
- frontend/src/lib/apiClient.js
- mobile/package.json
- with
- dependencies
- rateLimiter.js
- ChartCard.jsx
- steps
- deviceAuthMiddleware.js
- App.jsx
- Settings.jsx
- deviceController.js
- supertest
- 🛡️ TrailGuard / SWAAS
- 🖥️ TrailGuard Rescue Web Dashboard
- App.jsx
- deviceController.js
- ⚙️ SWAAS Backend API & Realtime Service
- Display
- MAX30100
- Contributor Covenant Code of Conduct
- Security Policy
- simulate-esp32.js
- dependencies
- updates
- server.js
- MPU6050
- socketManager.js
- socketManager.test.js
- SWAAS / TrailGuard Security Audit & Vulnerability Assessment
- rateLimiter.js
- app.js
- XglcdFont
- authController.js
- 5. End-to-End Integration Test Suite
- 📱 TrailGuard Mobile Companion
- server.js
- mongoose
- Sidebar.jsx
- telemetryService.js
- environmentService.js
- appError.js
- Contributing to SWAAS
- frontend/src/lib/apiClient.js
- fallService.js
- allowBuilds
- services
- backend
- build
- mobile/src/lib/profileCompletion.js
- mobile
- Icons.js

## God Nodes (most connected - your core abstractions)
1. `react` - 45 edges
2. `Display` - 41 edges
3. `useAppTheme()` - 29 edges
4. `Dashboard()` - 23 edges
5. `AppError` - 21 edges
6. `MAX30100` - 20 edges
7. `useAuth()` - 19 edges
8. `react-native` - 19 edges
9. `App()` - 16 edges
10. `useAuth()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Invariant 1: Local-First Privacy (No Continuous Cloud Telemetry)` --references--> `HistoryScreen()`  [INFERRED]
  AGENTS.md → mobile/src/screens/HistoryScreen.js
- `2. Naming Conventions & Code Style Standards` --references--> `AppError`  [INFERRED]
  AGENTS.md → backend/utils/appError.js
- `2. Naming Conventions & Code Style Standards` --references--> `formatUpdatedText()`  [INFERRED]
  AGENTS.md → frontend/src/utils/formatters.js
- `2. Naming Conventions & Code Style Standards` --references--> `ApiError`  [INFERRED]
  AGENTS.md → frontend/src/utils/errors.js
- `completeProfile()` --calls--> `AppError`  [EXTRACTED]
  backend/services/authService.js → backend/utils/appError.js

## Import Cycles
- None detected.

## Communities (65 total, 19 thin omitted)

### Community 0 - "ref_react"
Cohesion: 0.05
Nodes (77): App(), AppContent(), ActivityCard(), Item(), styles, AlertCard(), styles, AppHeader() (+69 more)

### Community 1 - "4. Mandatory Architectural Invariants (Zero-Tolerance Rules)"
Cohesion: 0.10
Nodes (20): 1. System Mission & 4-Tier Architecture, 3. The 6 Specialized AI Agent Personas, 4. Mandatory Architectural Invariants (Zero-Tolerance Rules), 5. Role-Based Access Control (RBAC) Matrix, 6. Prohibited Anti-Patterns (Anti-Hallucination Directives), 7. Knowledge Graph & Architecture Navigation (Graphify), 🛡️ Agent 1: Security & Cryptography Specialist, ☁️ Agent 2: Cloud Backend & Realtime Architect (+12 more)

### Community 2 - "check-syntax.js"
Cohesion: 0.20
Nodes (6): checkDir(), { execSync }, fs, path, rootDir, total

### Community 3 - "frontend/package.json"
Cohesion: 0.06
Nodes (42): dependencies, lucide-react@^1.59.0, maplibre-gl@^6.15.0, react@^19.3.1, react-dom@^19.3.1, react-icons@^5.7.0, react-phone-number-input@^3.4.18, react-router-dom@^7.18.4 (+34 more)

### Community 4 - "frontend/src/lib/apiClient.js"
Cohesion: 0.06
Nodes (46): ACTIVITY_STYLES, ActivitySummary(), MiniGraph(), SummaryItem(), NotificationBell(), ProfileMenu(), LiveLocationCard(), RecentEventsCard() (+38 more)

### Community 5 - "mobile/package.json"
Cohesion: 0.06
Nodes (43): dependencies, expo@~57.0.31, expo-device@~57.0.2, expo-linking@~57.0.13, expo-location@~57.0.22, expo-notifications@~57.0.24, expo-secure-store@~57.0.4, expo-status-bar@~57.0.1 (+35 more)

### Community 6 - "with"
Cohesion: 0.06
Nodes (43): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+35 more)

### Community 7 - "dependencies"
Cohesion: 0.10
Nodes (26): dependencies, connect-mongo@^6.0.0, cors@^2.8.5, dotenv@^18.0.8, express@^5.3.0, express-rate-limit@^8.7.1, express-session@^1.18.0, helmet@^8.3.0 (+18 more)

### Community 8 - "rateLimiter.js"
Cohesion: 0.05
Nodes (45): getDevice, getUserDevices, registerDevice(), renameDevice, unpairDevice, updateStatus, getHistory, getLatest (+37 more)

### Community 9 - "ChartCard.jsx"
Cohesion: 0.60
Nodes (3): ChartCard(), Sparkline(), QuickStatsGrid()

### Community 10 - "steps"
Cohesion: 0.07
Nodes (37): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+29 more)

### Community 11 - "deviceAuthMiddleware.js"
Cohesion: 0.13
Nodes (9): cors, express, helmet, passport, apiLimiter, broadcast(), clients, initWebSocket() (+1 more)

### Community 12 - "App.jsx"
Cohesion: 0.06
Nodes (59): 2. Naming Conventions & Code Style Standards, App(), AppLayout(), items, MobileNav(), AuthCard(), AuthLayout(), FEATURES (+51 more)

### Community 13 - "Settings.jsx"
Cohesion: 0.07
Nodes (28): name, runs-on, steps, strategy, jobs, analyze, language, name (+20 more)

### Community 14 - "deviceController.js"
Cohesion: 0.22
Nodes (8): jsonwebtoken@^9.0.2, jwt, mockUserCreate, mockUserFindById, mockUserFindByIdAndUpdate, mockUserFindOne, request, jsonwebtoken

### Community 15 - "supertest"
Cohesion: 0.40
Nodes (5): devDependencies, jest@^30.5.2, supertest@^7.3.1, jest, supertest

### Community 16 - "🛡️ TrailGuard / SWAAS"
Cohesion: 0.15
Nodes (12): 1. Clone & Install Dependencies, 2. Configure Environment Files, 3. Start the Subsystems, ⚡ Core Capabilities, 📖 In-Depth Documentation, 📄 License & Safety Notice, Prerequisites, 🚀 Quickstart (Run Full Stack) (+4 more)

### Community 18 - "🖥️ TrailGuard Rescue Web Dashboard"
Cohesion: 0.20
Nodes (9): 1. Install Dependencies, 2. Start Development Server, 3. Build for Production, 🔐 Environment Configuration, 🚀 Getting Started, ⚡ Key Capabilities, 📂 Subsystem Structure, 🧪 Testing (+1 more)

### Community 19 - "App.jsx"
Cohesion: 0.18
Nodes (10): mockDeviceCreate, mockDeviceFindOne, mockEnvironmentCreate, mockFallCreate, mockLocationCreate, mockSendEmergencySMS, mockSendEmergencyWhatsApp, mockUserFindById (+2 more)

### Community 20 - "deviceController.js"
Cohesion: 0.15
Nodes (12): 1. Correction, 2. Warning, 3. Temporary Ban, 4. Permanent Ban, Attribution, Contributor Covenant Code of Conduct, Enforcement, Enforcement Guidelines (+4 more)

### Community 21 - "⚙️ SWAAS Backend API & Realtime Service"
Cohesion: 0.17
Nodes (11): 1. Install Dependencies, 2. Verify Server Syntax, 3. Run Development Server, 📡 API Endpoint Overview, 🏗️ Architecture & Core Responsibilities, 🛠️ CLI Utilities & Device Provisioning, 🔐 Environment Configuration, 🚀 Getting Started (+3 more)

### Community 24 - "MAX30100"
Cohesion: 0.05
Nodes (4): color565(), _get_valid(), MAX30100, _twos_complement()

### Community 26 - "Security Policy"
Cohesion: 0.11
Nodes (18): Authentication, Authorization, CI/CD Security, Data Security, Device Security, Emergency and Safety Workflows, Infrastructure and CI/CD, Out of Scope (+10 more)

### Community 27 - "simulate-esp32.js"
Cohesion: 0.14
Nodes (18): crypto, mongoose, webSocketTicketSchema, crypto, buildTelemetryPacket(), clamp(), createSignature(), crypto (+10 more)

### Community 28 - "dependencies"
Cohesion: 0.17
Nodes (10): passport, bcrypt, mongoose, userSchema, bcrypt@^6.0.0, passport@^0.7.0, passport-google-oauth20@^2.0.0, bcrypt (+2 more)

### Community 30 - "updates"
Cohesion: 0.13
Nodes (14): patterns, patterns, backend-dependencies, frontend-dependencies, mobile-dependencies, patterns, interval, updates (+6 more)

### Community 31 - "server.js"
Cohesion: 0.18
Nodes (6): app, mongoose, clientUrls, config, http, server

### Community 34 - "socketManager.js"
Cohesion: 0.14
Nodes (13): allowBuilds, bcrypt, mongodb-memory-server, @parcel/watcher, unrs-resolver, overrides, body-parser, brace-expansion (+5 more)

### Community 35 - "socketManager.test.js"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 36 - "SWAAS / TrailGuard Security Audit & Vulnerability Assessment"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 37 - "rateLimiter.js"
Cohesion: 0.14
Nodes (13): name, runs-on, steps, jobs, dependency-review, name, on, pull_request (+5 more)

### Community 39 - "app.js"
Cohesion: 0.23
Nodes (9): getDeviceById(), registerDevice(), renameDevice(), unpairDevice(), updateDeviceStatus(), getLatestVitals(), getVitalsHistory(), getVitalsStats() (+1 more)

### Community 41 - "authController.js"
Cohesion: 0.18
Nodes (11): completeProfile, getMe, login, register, completeProfile(), getCurrentUser(), jwt, loginUser() (+3 more)

### Community 45 - "📱 TrailGuard Mobile Companion"
Cohesion: 0.22
Nodes (8): 1. Install Dependencies, 2. Start Expo Development Server, ⚡ Core Architecture, 🔐 Environment Configuration, 🚀 Getting Started, 📂 Subsystem Structure, 📱 TrailGuard Mobile Companion, 🧪 Verification & CI Checks

### Community 47 - "mongoose"
Cohesion: 0.18
Nodes (8): deviceSchema, mongoose, mongoose, phoneOtpSchema, mongoose, vitalsReadingSchema, mongoose@^9.11.4, mongoose

### Community 48 - "Sidebar.jsx"
Cohesion: 0.33
Nodes (5): blank_issues_enabled, contact_links, about, name, url

### Community 50 - "telemetryService.js"
Cohesion: 0.31
Nodes (7): dispatchEmergencyAlerts(), sendEmergencySMS(), twilio, processReadings(), sendEmergencyWhatsApp(), twilio, twilio

### Community 51 - "environmentService.js"
Cohesion: 0.29
Nodes (5): environmentReadingSchema, mongoose, getEnvironmentHistory(), getEnvironmentStats(), getLatestEnvironment()

### Community 52 - "appError.js"
Cohesion: 0.29
Nodes (3): locationReadingSchema, mongoose, getLocationHistory()

### Community 61 - "Contributing to SWAAS"
Cohesion: 0.20
Nodes (9): 1. Clone the repository, 2. Install dependencies, 3. Run with Docker Compose, 🌿 Branching and Commit Guidelines, Contributing to SWAAS, 🛠️ Development Setup & Prerequisites, 🔒 Security & Privacy Invariants, 🏗️ System Architecture Overview (+1 more)

### Community 73 - "frontend/src/lib/apiClient.js"
Cohesion: 0.25
Nodes (7): expo, name, orientation, plugins, slug, userInterfaceStyle, version

### Community 76 - "fallService.js"
Cohesion: 0.29
Nodes (3): fallEventSchema, mongoose, updateFallStatus()

### Community 79 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, esbuild, maplibre-gl, overrides, source-map-js

### Community 83 - "services"
Cohesion: 0.40
Nodes (5): scripts, dev, simulate, start, test

### Community 85 - "backend"
Cohesion: 0.40
Nodes (4): 📝 Description, 🔐 Security & Privacy Verification, 🧪 Testing Checklist, 🔍 Type of Change

### Community 95 - "build"
Cohesion: 0.15
Nodes (12): allowBuilds, react-native-screens, minimumReleaseAgeExclude, overrides, decode-uri-component, glob@>=9.0.0 <=14.0.1, minimatch@<11.0.1, node-forge (+4 more)

## Knowledge Gaps
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `2. Naming Conventions & Code Style Standards` connect `App.jsx` to `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)`, `frontend/src/lib/apiClient.js`, `app.js`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.05176085176085176 - nodes in this community are weakly interconnected._
- **Why does `AppError` connect `app.js` to `authController.js`, `App.jsx`, `fallService.js`, `telemetryService.js`, `environmentService.js`, `appError.js`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Should `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `formatUpdatedText()` connect `frontend/src/lib/apiClient.js` to `App.jsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.057971014492753624 - nodes in this community are weakly interconnected._
- **Should `frontend/src/lib/apiClient.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05755693581780538 - nodes in this community are weakly interconnected._