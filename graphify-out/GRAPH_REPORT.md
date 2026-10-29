# Graph Report - TrailGuard  (2026-10-29)

## Corpus Check
- 174 files · ~63,005 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 7, .example 3, .css 1)

## Summary
- 1363 nodes · 2193 edges · 108 communities (77 shown, 31 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `139491e7`
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
- steps
- app.js
- frontend/src/lib/apiClient.js
- analyze
- auth.test.js
- useAuth
- README.md
- App.jsx
- frontend/README.md
- server.test.js
- backend/README.md
- Display
- MAX30100
- SX1278
- Security Policy
- simulate-esp32.js
- passport
- LiveDataContext.jsx
- updates
- supertest
- MPU6050
- VitalsReading.js
- overrides
- body
- body
- dependency-review.yml
- Environment Configuration
- AppError
- XglcdFont
- authService.js
- ili9341.py
- MAX30100
- 📱 TrailGuard Mobile
- GEMINI.md
- mongoose
- Authentication
- Device Management
- telemetryService.js
- Key Features
- Telemetry Fields
- Contributing to SWAAS
- Important Components
- Security
- Security
- Common Development Workflow
- Troubleshooting
- Database Models
- Features
- expo
- fallService.js
- LocationReading.js
- Backend API Integration
- Realtime WebSocket
- allowBuilds
- Known Limitations
- Development Guidelines
- scripts
- Variables
- pull_request_template.md
- Wearable Simulator
- Emergency Alerts
- Environment API
- Fall Detection API
- Vitals API
- Running Frontend + Backend
- useDashboardData.js
- mobile/pnpm-workspace.yaml
- System Architecture
- Technology Stack
- Repository Documentation
- Running the Backend
- Health Check
- Location API
- Authentication
- max30100.py
- mobile/src/lib/profileCompletion.js
- Production Build
- Testing
- Project Status
- logger.js
- Testing
- Location and Live Map
- Realtime Data
- TrailGuard Frontend
- vercel.json
- Getting Started
- TrailGuard — Smart Wearable Safety & Health Monitoring System

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

## Communities (108 total, 31 thin omitted)

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

### Community 4 - "StatCard.jsx"
Cohesion: 0.07
Nodes (23): ChartCard(), Sparkline(), ErrorBoundary, LiveLocationCard(), QuickStatsGrid(), DeviceCard(), createMarkerElement(), LiveMap() (+15 more)

### Community 5 - "mobile/package.json"
Cohesion: 0.06
Nodes (41): dependencies, expo@~57.0.31, expo-device@~57.0.2, expo-linking@~57.0.13, expo-location@~57.0.22, expo-notifications@~57.0.24, expo-secure-store@~57.0.4, expo-status-bar@~57.0.1 (+33 more)

### Community 6 - "with"
Cohesion: 0.07
Nodes (38): defaults, name, runs-on, steps, run, defaults, name, runs-on (+30 more)

### Community 7 - "backend/package.json"
Cohesion: 0.10
Nodes (27): dependencies, bcrypt@^6.0.0, connect-mongo@^6.0.0, cors@^2.8.5, dotenv@^18.0.8, express-rate-limit@^8.7.1, express-session@^1.18.0, helmet@^8.3.0 (+19 more)

### Community 8 - "rateLimiter.js"
Cohesion: 0.05
Nodes (44): getDevice, getUserDevices, registerDevice(), renameDevice, unpairDevice, updateStatus, getHistory, getLatest (+36 more)

### Community 9 - "Dashboard.jsx"
Cohesion: 0.15
Nodes (17): ACTIVITY_STYLES, ActivitySummary(), MiniGraph(), SummaryItem(), NotificationBell(), DropletIcon(), HeartIcon(), HumidityIcon() (+9 more)

### Community 10 - "steps"
Cohesion: 0.08
Nodes (29): defaults, name, runs-on, steps, run, defaults, name, runs-on (+21 more)

### Community 11 - "app.js"
Cohesion: 0.09
Nodes (16): app, cors, express, helmet, { MongoStore }, passport, session, sessionOptions (+8 more)

### Community 12 - "frontend/src/lib/apiClient.js"
Cohesion: 0.13
Nodes (20): 2. Naming Conventions & Code Style Standards, AppLayout(), ModalButtons(), ModalHeader(), NAV_ITEMS, Sidebar(), DeviceContext, useDevices() (+12 more)

### Community 13 - "analyze"
Cohesion: 0.07
Nodes (28): name, runs-on, steps, strategy, jobs, analyze, language, name (+20 more)

### Community 14 - "auth.test.js"
Cohesion: 0.22
Nodes (8): jsonwebtoken@^9.0.2, jwt, mockUserCreate, mockUserFindById, mockUserFindByIdAndUpdate, mockUserFindOne, request, jsonwebtoken

### Community 15 - "useAuth"
Cohesion: 0.18
Nodes (19): ProfileMenu(), AuthCard(), AuthLayout(), FEATURES, Button(), Field(), PhoneField(), FallAlertModal() (+11 more)

### Community 16 - "README.md"
Cohesion: 0.08
Nodes (23): 1. Clone the Repository, 2. Start MongoDB, 3. Configure the Backend, 4. Start the Backend, 5. Configure the Frontend, 6. Start the Frontend, 7. Run the ESP32 Simulator, API Overview (+15 more)

### Community 17 - "App.jsx"
Cohesion: 0.18
Nodes (16): App(), ProtectedRoute(), AuthContext, AuthProvider(), DeviceProvider(), LiveDataProvider(), ThemeContext, ThemeProvider() (+8 more)

### Community 18 - "frontend/README.md"
Cohesion: 0.09
Nodes (21): Application Architecture, Application Routes, Authentication Flow, Current Frontend Status, Dashboard, Deployment, Development Checklist, Device Management (+13 more)

### Community 19 - "server.test.js"
Cohesion: 0.18
Nodes (10): mockDeviceCreate, mockDeviceFindOne, mockEnvironmentCreate, mockFallCreate, mockLocationCreate, mockSendEmergencySMS, mockSendEmergencyWhatsApp, mockUserFindById (+2 more)

### Community 21 - "backend/README.md"
Cohesion: 0.12
Nodes (16): API Data Flow, API Summary, Architecture, Backend Structure, Development Status, Device Authentication Status, Installation, License (+8 more)

### Community 26 - "Security Policy"
Cohesion: 0.11
Nodes (18): Authentication, Authorization, CI/CD Security, Data Security, Device Security, Emergency and Safety Workflows, Infrastructure and CI/CD, Out of Scope (+10 more)

### Community 27 - "simulate-esp32.js"
Cohesion: 0.26
Nodes (14): buildTelemetryPacket(), clamp(), createSignature(), crypto, generateEnvironment(), generateLocation(), generateMotion(), generatePPG() (+6 more)

### Community 28 - "passport"
Cohesion: 0.33
Nodes (5): passport, passport@^0.7.0, passport-google-oauth20@^2.0.0, passport, passport-google-oauth20

### Community 29 - "LiveDataContext.jsx"
Cohesion: 0.50
Nodes (3): API_URL, WS_URL, LiveDataContext

### Community 30 - "updates"
Cohesion: 0.12
Nodes (15): patterns, patterns, patterns, actions, backend-dependencies, frontend-dependencies, hardware-dependencies, patterns (+7 more)

### Community 31 - "supertest"
Cohesion: 0.40
Nodes (5): devDependencies, jest@^30.5.2, supertest@^7.3.1, jest, supertest

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

### Community 38 - "Environment Configuration"
Cohesion: 0.67
Nodes (3): Environment Configuration, Environment Variables, Important

### Community 39 - "AppError"
Cohesion: 0.15
Nodes (13): getDeviceById(), registerDevice(), renameDevice(), unpairDevice(), updateDeviceStatus(), getEnvironmentHistory(), getEnvironmentStats(), getLatestEnvironment() (+5 more)

### Community 41 - "authService.js"
Cohesion: 0.14
Nodes (13): completeProfile, getMe, login, register, bcrypt, mongoose, userSchema, completeProfile() (+5 more)

### Community 45 - "📱 TrailGuard Mobile"
Cohesion: 0.17
Nodes (11): 🛡️ API Client, 🔑 Authentication, 📌 Current Status, 🛠️ Development & CI/CD Workflow, 🔐 Environment Configuration, 🔒 Git & Security, 🧪 Health Check, 📂 Project Structure (+3 more)

### Community 47 - "mongoose"
Cohesion: 0.14
Nodes (9): mongoose, deviceSchema, mongoose, environmentReadingSchema, mongoose, mongoose, phoneOtpSchema, mongoose@^9.11.4 (+1 more)

### Community 48 - "Authentication"
Cohesion: 0.18
Nodes (11): Authentication, Complete Google Profile, Get Current User, Google OAuth, Login, Register, Request, Request (+3 more)

### Community 49 - "Device Management"
Cohesion: 0.18
Nodes (11): Change Device Status, Device Management, Disconnect/Unpair Device, Get Individual Device, List User Devices, Register Device, Rename Device, Request (+3 more)

### Community 50 - "telemetryService.js"
Cohesion: 0.31
Nodes (7): dispatchEmergencyAlerts(), sendEmergencySMS(), twilio, processReadings(), sendEmergencyWhatsApp(), twilio, twilio

### Community 51 - "Key Features"
Cohesion: 0.18
Nodes (11): 🔐 Authentication & User Accounts, 🌡️ Environmental Monitoring, 🚨 Fall Detection, Google Authentication, 📍 GPS Location Tracking, ❤️ Health Monitoring, Key Features, Local Authentication (+3 more)

### Community 60 - "Telemetry Fields"
Cohesion: 0.20
Nodes (10): Device, Environment, Example Complete Telemetry Packet, Fall, GPS, Motion, Successful response, Telemetry Fields (+2 more)

### Community 61 - "Contributing to SWAAS"
Cohesion: 0.20
Nodes (9): 1. Clone the repository, 2. Install dependencies, 3. Run with Docker Compose, 🌿 Branching and Commit Guidelines, Contributing to SWAAS, 🛠️ Development Setup & Prerequisites, 🔒 Security & Privacy Invariants, 🏗️ System Architecture Overview (+1 more)

### Community 62 - "Important Components"
Cohesion: 0.20
Nodes (10): `ActivitySummary.jsx`, `App.jsx`, `AuthContext.jsx`, `DeviceContext.jsx`, `FallAlertModal.jsx`, Important Components, `LiveDataContext.jsx`, `LiveMap.jsx` (+2 more)

### Community 66 - "Security"
Cohesion: 0.22
Nodes (9): Authentication Rate Limiting, CORS, Device Request Rate Limiting, Helmet, JWT Authentication, Ownership Enforcement, Password Hashing, Request Size (+1 more)

### Community 67 - "Security"
Cohesion: 0.22
Nodes (9): Authentication, CORS, Device Ownership, Environment Secrets, HTTP Security, Password Security, Rate Limiting, Request Protection (+1 more)

### Community 68 - "Common Development Workflow"
Cohesion: 0.25
Nodes (8): 1. Start MongoDB, 2. Configure Environment, 3. Install Dependencies, 4. Start Backend, 5. Check Backend, 6. Start Wearable Simulator, 7. Start Frontend, Common Development Workflow

### Community 69 - "Troubleshooting"
Cohesion: 0.25
Nodes (8): Backend starts on the wrong port, Device telemetry returns `401`, Frontend cannot connect, Google login does not work, MongoDB connection failed, SMS/WhatsApp alerts are not sent, Telemetry is accepted but no dashboard update appears, Troubleshooting

### Community 70 - "Database Models"
Cohesion: 0.25
Nodes (8): Database Models, Device, EnvironmentReading, FallEvent, LocationReading, PhoneOtp, User, VitalsReading

### Community 71 - "Features"
Cohesion: 0.25
Nodes (8): Authentication, Device Management, Environmental Monitoring, Fall Detection, Features, Health Monitoring, Location Tracking, Profile and Safety

### Community 73 - "expo"
Cohesion: 0.25
Nodes (7): expo, name, orientation, plugins, slug, userInterfaceStyle, version

### Community 75 - "fallService.js"
Cohesion: 0.29
Nodes (3): fallEventSchema, mongoose, updateFallStatus()

### Community 77 - "Backend API Integration"
Cohesion: 0.29
Nodes (7): Authentication API, Backend API Integration, Device API, Environment API, Fall API, Location API, Vitals API

### Community 78 - "Realtime WebSocket"
Cohesion: 0.33
Nodes (6): Environment Event, Fall Detected Event, Fall Status Update, Location Event, Realtime WebSocket, Vitals Event

### Community 79 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, esbuild, maplibre-gl, overrides, source-map-js

### Community 80 - "Known Limitations"
Cohesion: 0.33
Nodes (6): API/Frontend Synchronization, Authentication Storage, Backend Dependency, Known Limitations, Map Availability, Realtime Connection

### Community 81 - "Development Guidelines"
Cohesion: 0.33
Nodes (6): Development Guidelines, Keep API Communication Centralized, Realtime Data, Reuse Existing Components, Styling, Use Existing Contexts

### Community 83 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, dev, simulate, start, test

### Community 84 - "Variables"
Cohesion: 0.40
Nodes (5): Development, Environment Configuration, Production, Security, Variables

### Community 85 - "pull_request_template.md"
Cohesion: 0.40
Nodes (4): 📝 Description, 🔐 Security & Privacy Verification, 🧪 Testing Checklist, 🔍 Type of Change

### Community 87 - "Wearable Simulator"
Cohesion: 0.50
Nodes (4): Custom Simulator Configuration, Start Backend, Start Simulator, Wearable Simulator

### Community 88 - "Emergency Alerts"
Cohesion: 0.50
Nodes (4): Emergency Alerts, Important Alert Behavior, SMS, WhatsApp

### Community 89 - "Environment API"
Cohesion: 0.50
Nodes (4): Environment API, Environment History, Environment Statistics, Latest Environment

### Community 90 - "Fall Detection API"
Cohesion: 0.50
Nodes (4): Fall Detection API, Get Fall Events, Get Latest Fall, Update Fall Status

### Community 91 - "Vitals API"
Cohesion: 0.50
Nodes (4): Latest Vitals, Vitals API, Vitals History, Vitals Statistics

### Community 93 - "Running Frontend + Backend"
Cohesion: 0.50
Nodes (4): Data flow, Running Frontend + Backend, Terminal 1 — Backend, Terminal 2 — Frontend

### Community 94 - "useDashboardData.js"
Cohesion: 0.35
Nodes (8): RecentEventsCard(), useDashboardData(), formatDateTime(), getHeartRateStatus(), getSeverityColor(), getSpo2Status(), getTemperatureStatus(), THRESHOLDS

### Community 95 - "mobile/pnpm-workspace.yaml"
Cohesion: 0.50
Nodes (3): allowBuilds, react-native-screens, minimumReleaseAgeExclude

### Community 96 - "System Architecture"
Cohesion: 0.50
Nodes (4): 1. Hardware Layer, 2. Backend Layer, 3. Frontend Layer, System Architecture

### Community 97 - "Technology Stack"
Cohesion: 0.50
Nodes (4): Backend, Frontend, Hardware, Technology Stack

### Community 98 - "Repository Documentation"
Cohesion: 0.50
Nodes (4): Backend Documentation, Frontend Documentation, Repository Documentation, Root Documentation

### Community 99 - "Running the Backend"
Cohesion: 0.67
Nodes (3): Development, Production-style start, Running the Backend

### Community 100 - "Health Check"
Cohesion: 0.67
Nodes (3): Health Check, Request, Response

### Community 101 - "Location API"
Cohesion: 0.67
Nodes (3): Latest Location, Location API, Location History

### Community 102 - "Authentication"
Cohesion: 0.67
Nodes (3): Authentication, JWT, Protected Routes

### Community 105 - "Production Build"
Cohesion: 0.67
Nodes (3): Backend, Frontend, Production Build

### Community 106 - "Testing"
Cohesion: 0.67
Nodes (3): Backend Testing, Frontend Testing, Testing

### Community 107 - "Project Status"
Cohesion: 0.67
Nodes (3): Implemented, In Progress / Optional, Project Status

## Knowledge Gaps
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `2. Naming Conventions & Code Style Standards` connect `frontend/src/lib/apiClient.js` to `Dashboard.jsx`, `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)`, `AppError`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.052743652743652746 - nodes in this community are weakly interconnected._
- **Why does `AppError` connect `AppError` to `authService.js`, `telemetryService.js`, `fallService.js`, `frontend/src/lib/apiClient.js`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Should `4. Mandatory Architectural Invariants (Zero-Tolerance Rules)` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `formatUpdatedText()` connect `Dashboard.jsx` to `frontend/src/lib/apiClient.js`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.057971014492753624 - nodes in this community are weakly interconnected._
- **Should `StatCard.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06755260243632337 - nodes in this community are weakly interconnected._