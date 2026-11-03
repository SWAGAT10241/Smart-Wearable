# Graph Report - work  (2026-11-04)

## Corpus Check
- 177 files · ~55,542 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 7, .example 3, .css 1)

## Summary
- 1168 nodes · 1997 edges · 70 communities (51 shown, 19 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `886625c8`
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
- backend/package.json
- rateLimiter.js
- Dashboard.jsx
- with
- app.js
- frontend/src/lib/apiClient.js
- analyze
- auth.test.js
- Settings.jsx
- 🛡️ TrailGuard / SWAAS
- AuthContext.jsx
- 🖥️ TrailGuard Rescue Web Dashboard
- server.test.js
- Contributor Covenant Code of Conduct
- ⚙️ SWAAS Backend API & Realtime Service
- Display
- MAX30100
- SX1278
- Security Policy
- simulate-esp32.js
- User.js
- App.jsx
- updates
- supertest
- MPU6050
- vitalsService.js
- overrides
- body
- body
- dependency-review.yml
- StatCard.jsx
- AppError
- XglcdFont
- authService.js
- Sidebar.jsx
- MAX30100
- 📱 TrailGuard Mobile Companion
- GEMINI.md
- mongoose
- contact_links
- authController.js
- telemetryService.js
- Contributing to SWAAS
- expo
- fallService.js
- appError.js
- allowBuilds
- scripts
- pull_request_template.md
- overrides
- mobile/src/lib/profileCompletion.js
- logger.js
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `Display` - 41 edges
2. `useAppTheme()` - 29 edges
3. `Dashboard()` - 23 edges
4. `AppError` - 21 edges
5. `MAX30100` - 20 edges
6. `useAuth()` - 19 edges
7. `react-native` - 19 edges
8. `App()` - 16 edges
9. `useDevices()` - 15 edges
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

## Communities (70 total, 19 thin omitted)

### Community 0 - "ref_react"
Cohesion: 0.05
Nodes (76): App(), AppContent(), ActivityCard(), Item(), styles, AlertCard(), styles, AppHeader() (+68 more)

### Community 1 - "4. Mandatory Architectural Invariants (Zero-Tolerance Rules)"
Cohesion: 0.10
Nodes (20): 1. System Mission & 4-Tier Architecture, 3. The 6 Specialized AI Agent Personas, 4. Mandatory Architectural Invariants (Zero-Tolerance Rules), 5. Role-Based Access Control (RBAC) Matrix, 6. Prohibited Anti-Patterns (Anti-Hallucination Directives), 7. Knowledge Graph & Architecture Navigation (Graphify), 🛡️ Agent 1: Security & Cryptography Specialist, ☁️ Agent 2: Cloud Backend & Realtime Architect (+12 more)

### Community 2 - "check-syntax.js"
Cohesion: 0.20
Nodes (6): checkDir(), { execSync }, fs, path, rootDir, total

### Community 3 - "frontend/package.json"
Cohesion: 0.06
Nodes (42): dependencies, lucide-react@^1.59.0, maplibre-gl@^6.15.0, react@^19.3.1, react-dom@^19.3.1, react-icons@^5.7.0, react-phone-number-input@^3.4.18, react-router-dom@^7.18.4 (+34 more)

### Community 4 - "lucide-react"
Cohesion: 0.11
Nodes (15): ChartCard(), Sparkline(), LiveLocationCard(), QuickStatsGrid(), RecentEventsCard(), DeviceCard(), createMarkerElement(), LiveMap() (+7 more)

### Community 5 - "mobile/package.json"
Cohesion: 0.06
Nodes (41): dependencies, expo@~57.0.31, expo-device@~57.0.2, expo-linking@~57.0.13, expo-location@~57.0.22, expo-notifications@~57.0.24, expo-secure-store@~57.0.4, expo-status-bar@~57.0.1 (+33 more)

### Community 6 - "with"
Cohesion: 0.06
Nodes (43): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+35 more)

### Community 7 - "backend/package.json"
Cohesion: 0.11
Nodes (24): dependencies, connect-mongo@^6.0.0, cors@^2.8.5, dotenv@^18.0.8, express-rate-limit@^8.7.1, express-session@^1.18.0, helmet@^8.3.0, mongodb@^7.7.0 (+16 more)

### Community 8 - "rateLimiter.js"
Cohesion: 0.06
Nodes (42): getDevice, getUserDevices, registerDevice(), renameDevice, unpairDevice, updateStatus, getHistory, getLatest (+34 more)

### Community 9 - "Dashboard.jsx"
Cohesion: 0.15
Nodes (18): ACTIVITY_STYLES, ActivitySummary(), MiniGraph(), SummaryItem(), NotificationBell(), DropletIcon(), HeartIcon(), HumidityIcon() (+10 more)

### Community 10 - "with"
Cohesion: 0.07
Nodes (37): defaults, name, runs-on, steps, concurrency, cancel-in-progress, group, run (+29 more)

### Community 11 - "app.js"
Cohesion: 0.11
Nodes (13): app, cors, express, helmet, passport, clientUrls, config, broadcast() (+5 more)

### Community 12 - "frontend/src/lib/apiClient.js"
Cohesion: 0.14
Nodes (20): 2. Naming Conventions & Code Style Standards, DeviceContext, useDevices(), useDashboardData(), useTelemetryHistory(), devicesApi, environmentApi, fallsApi (+12 more)

### Community 13 - "analyze"
Cohesion: 0.07
Nodes (28): name, runs-on, steps, strategy, jobs, analyze, language, name (+20 more)

### Community 14 - "auth.test.js"
Cohesion: 0.22
Nodes (8): jsonwebtoken@^9.0.2, jwt, mockUserCreate, mockUserFindById, mockUserFindByIdAndUpdate, mockUserFindOne, request, jsonwebtoken

### Community 15 - "Settings.jsx"
Cohesion: 0.22
Nodes (15): AuthCard(), AuthLayout(), FEATURES, Button(), Field(), PhoneField(), ThemeContext, useTheme() (+7 more)

### Community 16 - "🛡️ TrailGuard / SWAAS"
Cohesion: 0.15
Nodes (12): 1. Clone & Install Dependencies, 2. Configure Environment Files, 3. Start the Subsystems, ⚡ Core Capabilities, 📖 In-Depth Documentation, 📄 License & Safety Notice, Prerequisites, 🚀 Quickstart (Run Full Stack) (+4 more)

### Community 17 - "AuthContext.jsx"
Cohesion: 0.24
Nodes (13): ProfileMenu(), ProtectedRoute(), AuthContext, AuthProvider(), useAuth(), authApi, clearToken(), getToken() (+5 more)

### Community 18 - "🖥️ TrailGuard Rescue Web Dashboard"
Cohesion: 0.20
Nodes (9): 1. Install Dependencies, 2. Start Development Server, 3. Build for Production, 🔐 Environment Configuration, 🚀 Getting Started, ⚡ Key Capabilities, 📂 Subsystem Structure, 🧪 Testing (+1 more)

### Community 19 - "server.test.js"
Cohesion: 0.18
Nodes (10): mockDeviceCreate, mockDeviceFindOne, mockEnvironmentCreate, mockFallCreate, mockLocationCreate, mockSendEmergencySMS, mockSendEmergencyWhatsApp, mockUserFindById (+2 more)

### Community 20 - "Contributor Covenant Code of Conduct"
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
Cohesion: 0.25
Nodes (14): buildTelemetryPacket(), clamp(), createSignature(), crypto, generateEnvironment(), generateLocation(), generateMotion(), generatePPG() (+6 more)

### Community 28 - "User.js"
Cohesion: 0.17
Nodes (10): passport, bcrypt, mongoose, userSchema, bcrypt@^6.0.0, passport@^0.7.0, passport-google-oauth20@^2.0.0, bcrypt (+2 more)

### Community 29 - "App.jsx"
Cohesion: 0.14
Nodes (10): App(), ErrorBoundary, FallAlertModal(), API_URL, WS_URL, DeviceProvider(), LiveDataContext, LiveDataProvider() (+2 more)

### Community 30 - "updates"
Cohesion: 0.13
Nodes (14): patterns, patterns, backend-dependencies, frontend-dependencies, mobile-dependencies, patterns, interval, updates (+6 more)

### Community 31 - "supertest"
Cohesion: 0.40
Nodes (5): devDependencies, jest@^30.5.2, supertest@^7.3.1, jest, supertest

### Community 33 - "vitalsService.js"
Cohesion: 0.29
Nodes (5): mongoose, vitalsReadingSchema, getLatestVitals(), getVitalsHistory(), getVitalsStats()

### Community 34 - "overrides"
Cohesion: 0.14
Nodes (13): allowBuilds, bcrypt, mongodb-memory-server, @parcel/watcher, unrs-resolver, overrides, body-parser, brace-expansion (+5 more)

### Community 35 - "body"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 36 - "body"
Cohesion: 0.14
Nodes (13): description, label, placeholder, value, body, attributes, id, type (+5 more)

### Community 37 - "dependency-review.yml"
Cohesion: 0.14
Nodes (13): name, runs-on, steps, jobs, dependency-review, name, on, pull_request (+5 more)

### Community 38 - "StatCard.jsx"
Cohesion: 0.27
Nodes (10): BarTrace(), formatUpdatedTime(), GaugeBar(), LineTrace(), MiniStats(), StatCard(), STATUS_COLORS, STYLES (+2 more)

### Community 39 - "AppError"
Cohesion: 0.23
Nodes (9): getDeviceById(), registerDevice(), renameDevice(), unpairDevice(), updateDeviceStatus(), getEnvironmentHistory(), getEnvironmentStats(), getLatestEnvironment() (+1 more)

### Community 41 - "authService.js"
Cohesion: 0.32
Nodes (7): completeProfile(), getCurrentUser(), jwt, loginUser(), mongoose, registerUser(), signToken()

### Community 42 - "Sidebar.jsx"
Cohesion: 0.29
Nodes (7): AppLayout(), items, MobileNav(), ModalButtons(), ModalHeader(), NAV_ITEMS, Sidebar()

### Community 45 - "📱 TrailGuard Mobile Companion"
Cohesion: 0.22
Nodes (8): 1. Install Dependencies, 2. Start Expo Development Server, ⚡ Core Architecture, 🔐 Environment Configuration, 🚀 Getting Started, 📂 Subsystem Structure, 📱 TrailGuard Mobile Companion, 🧪 Verification & CI Checks

### Community 47 - "mongoose"
Cohesion: 0.14
Nodes (9): mongoose, deviceSchema, mongoose, environmentReadingSchema, mongoose, mongoose, phoneOtpSchema, mongoose@^9.11.4 (+1 more)

### Community 48 - "contact_links"
Cohesion: 0.33
Nodes (5): blank_issues_enabled, contact_links, about, name, url

### Community 49 - "authController.js"
Cohesion: 0.40
Nodes (4): completeProfile, getMe, login, register

### Community 50 - "telemetryService.js"
Cohesion: 0.27
Nodes (8): twilio@^6.2.0, dispatchEmergencyAlerts(), sendEmergencySMS(), twilio, processReadings(), sendEmergencyWhatsApp(), twilio, twilio

### Community 61 - "Contributing to SWAAS"
Cohesion: 0.20
Nodes (9): 1. Clone the repository, 2. Install dependencies, 3. Run with Docker Compose, 🌿 Branching and Commit Guidelines, Contributing to SWAAS, 🛠️ Development Setup & Prerequisites, 🔒 Security & Privacy Invariants, 🏗️ System Architecture Overview (+1 more)

### Community 73 - "expo"
Cohesion: 0.25
Nodes (7): expo, name, orientation, plugins, slug, userInterfaceStyle, version

### Community 75 - "fallService.js"
Cohesion: 0.29
Nodes (3): fallEventSchema, mongoose, updateFallStatus()

### Community 76 - "appError.js"
Cohesion: 0.20
Nodes (5): getHistory, getLatest, locationReadingSchema, mongoose, getLocationHistory()

### Community 79 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, esbuild, maplibre-gl, overrides, source-map-js

### Community 83 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, dev, simulate, start, test

### Community 85 - "pull_request_template.md"
Cohesion: 0.40
Nodes (4): 📝 Description, 🔐 Security & Privacy Verification, 🧪 Testing Checklist, 🔍 Type of Change

### Community 95 - "overrides"
Cohesion: 0.15
Nodes (12): allowBuilds, react-native-screens, minimumReleaseAgeExclude, overrides, decode-uri-component, glob@>=9.0.0 <=14.0.1, minimatch@<11.0.1, node-forge (+4 more)

## Knowledge Gaps
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `2. Naming Conventions & Code Style Standards` connect `frontend/src/lib/apiClient.js` to `Dashboard.jsx`, `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)`, `AppError`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.05176085176085176 - nodes in this community are weakly interconnected._
- **Why does `AppError` connect `AppError` to `vitalsService.js`, `authService.js`, `fallService.js`, `frontend/src/lib/apiClient.js`, `appError.js`, `telemetryService.js`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Should `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `formatUpdatedText()` connect `Dashboard.jsx` to `frontend/src/lib/apiClient.js`, `lucide-react`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.057971014492753624 - nodes in this community are weakly interconnected._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.1103448275862069 - nodes in this community are weakly interconnected._