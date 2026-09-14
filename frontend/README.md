# TrailGuard Frontend

React + Vite web dashboard for **TrailGuard — Smart Wearable Safety and Health Monitoring System**.

The frontend provides the user-facing interface for authentication, wearable/device management, real-time health monitoring, environmental monitoring, GPS tracking, fall detection, SOS alerts, historical data, and profile/safety settings.

It communicates with the TrailGuard backend through REST APIs and a WebSocket connection for realtime wearable data.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Application Routes](#application-routes)
- [Backend API Integration](#backend-api-integration)
- [Realtime Data](#realtime-data)
- [Authentication](#authentication)
- [Dashboard](#dashboard)
- [History](#history)
- [Location and Live Map](#location-and-live-map)
- [Fall Detection and SOS](#fall-detection-and-sos)
- [Device Management](#device-management)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Production Build](#production-build)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Development Guidelines](#development-guidelines)
- [Related Components](#related-components)
- [License](#license)

---

# Overview

TrailGuard is a smart wearable safety and health monitoring system designed to collect information from a wearable device and present it through a web dashboard.

The frontend acts as the primary interface between the user, the TrailGuard wearable, and the backend services.

```text
┌──────────────────────────┐
│   TrailGuard Wearable    │
│          ESP32            │
│                          │
│ MAX30100 / BME280        │
│ NEO-6M / MPU6050 / LoRa │
└────────────┬─────────────┘
             │
             │ HTTP Telemetry
             ▼
┌──────────────────────────┐
│    TrailGuard Backend    │
│                          │
│ Node.js + Express        │
│ MongoDB + WebSocket      │
└────────────┬─────────────┘
             │
       ┌─────┴─────┐
       │           │
       │ REST      │ WebSocket
       │           │
       ▼           ▼
┌──────────────────────────┐
│     TrailGuard Web       │
│        Dashboard         │
│                          │
│      React + Vite        │
└──────────────────────────┘
```

---

# Features

## Authentication

- User registration
- Email/password login
- Google OAuth
- JWT-based authentication
- Protected application routes
- Persistent authentication state
- Profile completion flow

## Health Monitoring

- Live heart-rate monitoring
- SpO₂ monitoring
- Latest vital readings
- Historical vital data
- Vital statistics
- Realtime WebSocket updates

## Environmental Monitoring

- Temperature
- Humidity
- Atmospheric pressure
- Latest readings
- Historical readings
- Environmental statistics

## Location Tracking

- Latest GPS position
- Latitude/longitude
- Altitude
- Satellite count
- Location history
- Interactive map visualization
- MapLibre GL integration

## Fall Detection

- Realtime fall notifications
- Fall-event information
- Fall history
- Fall status updates
- Global fall/SOS alert interface

## Device Management

- View registered wearable devices
- Select a device
- Rename devices
- Activate/deactivate devices
- Device-aware monitoring

## Profile and Safety

- Personal information
- Health information
- Emergency contact
- Safety settings
- Profile completion

---

# Technology Stack

| Technology               | Purpose                           |
| ------------------------ | --------------------------------- |
| React 18                 | UI framework                      |
| Vite                     | Development server and build tool |
| React Router 7           | Client-side routing               |
| Tailwind CSS 4           | Styling                           |
| MapLibre GL              | Interactive map rendering         |
| Lucide React             | UI icons                          |
| React Icons              | Additional icons                  |
| React Phone Number Input | Phone-number input                |
| Typewriter Effect        | Animated text                     |
| Vitest                   | Testing                           |
| Testing Library          | Component testing                 |
| JavaScript / JSX         | Application development           |
| pnpm                     | Package management                |

The current frontend package is:

```text
trailguard-frontend
version 1.2.4
```

The repository uses:

```text
pnpm 11.20.0
```

---

# Application Architecture

The frontend is organized around:

- Pages
- Reusable components
- React Context providers
- API utilities
- Global styling
- Client-side routing

The major application layers are:

```text
┌──────────────────────────────────────┐
│               App.jsx               │
│          Routing / Application       │
└──────────────────┬───────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
     Pages      Components   Context
        │          │          │
        │          │          ├── AuthContext
        │          │          ├── DeviceContext
        │          │          └── LiveDataContext
        │          │
        └──────────┼───────────
                   ▼
             lib/apiClient.js
                   │
             REST API / WebSocket
                   │
                   ▼
          TrailGuard Backend
```

---

# Prerequisites

Install:

- Node.js 18 or later
- pnpm 11
- Git
- A running TrailGuard backend

The backend is normally configured to run at:

```text
http://localhost:3000
```

The frontend Vite development server runs at:

```text
http://localhost:5173
```

---

# Installation

From the repository root:

```bash
cd frontend
```

Install dependencies:

```bash
pnpm install
```

Create the environment file:

```bash
cp .env.example .env
```

Configure the required frontend environment variables.

---

# Environment Configuration

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/live
```

## Variables

| Variable       | Purpose                    | Example                     |
| -------------- | -------------------------- | --------------------------- |
| `VITE_API_URL` | Backend REST API base URL  | `http://localhost:3000/api` |
| `VITE_WS_URL`  | Backend WebSocket endpoint | `ws://localhost:3000/live`  |

### Development

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/live
```

### Production

For an HTTPS deployment:

```env
VITE_API_URL=https://your-backend-domain.example/api
VITE_WS_URL=wss://your-backend-domain.example/live
```

### Security

Do **not** place private secrets in frontend environment variables.

Anything beginning with:

```text
VITE_
```

is intended to be exposed to the browser.

Never put:

```text
JWT_SECRET
SESSION_SECRET
GOOGLE_CLIENT_SECRET
TWILIO_AUTH_TOKEN
DEVICE_KEY
```

inside the frontend `.env`.

Those belong on the backend.

---

# Running the Application

Start the Vite development server:

```bash
pnpm dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# Running Frontend + Backend

Use two terminals.

### Terminal 1 — Backend

```bash
cd backend
pnpm dev
```

Backend:

```text
http://localhost:3000
```

### Terminal 2 — Frontend

```bash
cd frontend
pnpm dev
```

Frontend:

```text
http://localhost:5173
```

### Data flow

```text
Browser
  │
  ├── REST ──────────────▶ http://localhost:3000/api
  │
  └── WebSocket ─────────▶ ws://localhost:3000/live
```

---

# Application Routes

The current application contains the following primary routes:

| Route               | Page             | Purpose                               |
| ------------------- | ---------------- | ------------------------------------- |
| `/login`            | Login            | User authentication                   |
| `/register`         | Register         | Create account                        |
| `/oauth-success`    | OAuth Success    | Google OAuth redirect handling        |
| `/complete-profile` | Complete Profile | Complete required profile information |
| `/dashboard`        | Dashboard        | Main monitoring dashboard             |
| `/history`          | History          | Historical monitoring data            |
| `/settings`         | Settings         | Profile and safety settings           |

Protected application pages are guarded by:

```text
components/ProtectedRoute.jsx
```

The fall/SOS notification is implemented as an application-level interface rather than a separate fall route.

---

# Backend API Integration

Backend communication is centralized through:

```text
lib/apiClient.js
```

The frontend consumes the TrailGuard backend REST API.

---

## Authentication API

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/google
GET  /api/auth/google/callback
GET  /api/auth/me
PATCH /api/auth/complete-profile
```

---

## Device API

```http
POST   /api/devices/register
GET    /api/devices
PATCH  /api/devices/:deviceId
PATCH  /api/devices/:deviceId/status
DELETE /api/devices/:deviceId

GET    /api/device/:deviceId
```

The exact device-management functionality is shared between the device-management and individual-device backend routes.

---

## Vitals API

```http
GET /api/vitals/latest
GET /api/vitals/history
GET /api/vitals/stats
```

---

## Environment API

```http
GET /api/environment/latest
GET /api/environment/history
GET /api/environment/stats
```

---

## Location API

```http
GET /api/location/latest
GET /api/location/history
```

---

## Fall API

```http
GET   /api/falls
GET   /api/falls/latest
PATCH /api/falls/:id
```

---

# Realtime Data

TrailGuard uses WebSocket communication for live wearable data.

The frontend connects to:

```text
VITE_WS_URL
```

Default:

```text
ws://localhost:3000/live
```

Realtime state is managed through:

```text
context/LiveDataContext.jsx
```

This provides a shared WebSocket data layer for the application.

---

## Supported Events

The backend can broadcast:

```text
vitals
environment
location
fall_detected
fall_status_update
```

The general data flow is:

```text
Wearable
    │
    │ Telemetry
    ▼
Backend
    │
    │ WebSocket
    ▼
LiveDataContext
    │
    ├── Dashboard
    ├── Health information
    ├── Environment information
    ├── Location
    └── Fall/SOS notification
```

The frontend can therefore update monitoring information without continuously polling every endpoint.

---

# Authentication

Authentication state is managed through:

```text
context/AuthContext.jsx
```

The authentication system supports:

1. Local registration
2. Local login
3. Google OAuth
4. JWT authentication
5. Protected routes
6. Profile completion
7. Persistent authentication state

---

## Protected Routes

Protected application pages use:

```text
components/ProtectedRoute.jsx
```

Unauthenticated users are redirected to the appropriate authentication page.

---

## JWT

Authenticated API requests include the JWT using the HTTP authorization header.

Conceptually:

```http
Authorization: Bearer <JWT>
```

The current frontend stores authentication state/token information in browser storage.

> For a production security model, authentication should be reviewed carefully and preferably use secure `httpOnly` cookies where appropriate.

---

# Dashboard

The Dashboard is the main TrailGuard monitoring interface.

It brings together:

- User information
- Selected wearable
- Heart rate
- SpO₂
- Temperature
- Humidity
- Pressure
- GPS position
- Fall status
- Recent activity
- Realtime updates
- Safety notifications

The Dashboard combines:

```text
REST API
+
WebSocket data
+
React Context state
```

This allows historical information to be loaded from the backend while new wearable readings arrive in realtime.

---

# History

The History page provides historical monitoring information.

It can work with:

- Heart-rate data
- SpO₂ data
- Environmental readings
- GPS/location information
- Fall events

The frontend obtains historical data from backend endpoints such as:

```http
GET /api/vitals/history
GET /api/environment/history
GET /api/location/history
GET /api/falls
```

The backend controls the requested history window using query parameters such as:

```text
hours
```

---

# Location and Live Map

The frontend currently uses **MapLibre GL** for interactive map rendering.

The main map component is:

```text
components/LiveMap.jsx
```

Map data comes from the TrailGuard GPS pipeline.

The primary coordinates are:

```text
latitude
longitude
```

Additional GPS information may include:

```text
altitude
satellites
locationStale
```

The frontend can use the latest location to display the wearable's current/latest known position.

---

## Map Technology

Current dependency:

```text
maplibre-gl
```

The frontend does **not** use Leaflet/React Leaflet in its current dependency configuration.

This distinction is important when extending or debugging the map implementation.

---

# Fall Detection and SOS

Fall events are delivered from the backend through the realtime WebSocket channel.

When:

```text
fall_detected
```

is received, the frontend can display the global fall/SOS interface.

The main component is:

```text
components/FallAlertModal.jsx
```

The event can subsequently be updated through:

```http
PATCH /api/falls/:id
```

Supported backend fall statuses include:

```text
detected
confirmed_false_alarm
sos_triggered
resolved
```

The global alert approach ensures that a fall notification can be presented independently of the currently visible dashboard section.

---

# Device Management

Device state is managed through:

```text
context/DeviceContext.jsx
```

The frontend can:

- Load registered devices
- Select the active device
- Rename a device
- Activate/deactivate a device
- Display device information
- Associate monitoring data with the selected wearable

A physical TrailGuard device is identified by its:

```text
deviceId
```

The backend uses this ID to associate wearable telemetry with its registered owner.

---

# Project Structure

The current frontend follows this general structure:

```text
frontend/
│
├── assets/
│   └── images/
│
├── components/
│   ├── app/
│   ├── auth/
│   ├── ActivitySummary.jsx
│   ├── FallAlertModal.jsx
│   ├── LiveMap.jsx
│   ├── ProtectedRoute.jsx
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   └── icons.jsx
│
├── context/
│   ├── AuthContext.jsx
│   ├── DeviceContext.jsx
│   └── LiveDataContext.jsx
│
├── lib/
│   ├── apiClient.js
│   └── profileCompletion.js
│
├── pages/
│   ├── CompleteProfile.jsx
│   ├── Dashboard.jsx
│   ├── History.jsx
│   ├── Login.jsx
│   ├── OAuthSuccess.jsx
│   ├── Register.jsx
│   └── Settings.jsx
│
├── App.jsx
├── index.css
├── main.jsx
│
├── .env.example
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── vercel.json
├── vite.config.js
└── README.md
```

---

# Important Components

## `App.jsx`

Main application entry for client-side routing and application composition.

---

## `AuthContext.jsx`

Maintains authentication state and user information.

---

## `DeviceContext.jsx`

Maintains registered/selected wearable information.

---

## `LiveDataContext.jsx`

Maintains realtime WebSocket communication and live wearable data.

---

## `ProtectedRoute.jsx`

Prevents unauthenticated users from accessing protected application pages.

---

## `LiveMap.jsx`

Displays TrailGuard GPS information using MapLibre GL.

---

## `FallAlertModal.jsx`

Displays safety/fall notifications received from the backend.

---

## `StatCard.jsx`

Reusable monitoring/statistic card used throughout dashboard interfaces.

---

## `ActivitySummary.jsx`

Displays summarized user/device activity information.

---

# Authentication Flow

The normal local authentication flow is:

```text
User
 │
 ▼
Register
 │
 ▼
POST /api/auth/register
 │
 ▼
Backend
 │
 ▼
JWT
 │
 ▼
AuthContext
 │
 ▼
Protected Application
```

Login:

```text
User
 │
 ▼
Login
 │
 ▼
POST /api/auth/login
 │
 ▼
JWT
 │
 ▼
AuthContext
 │
 ▼
Dashboard
```

Google OAuth:

```text
User
 │
 ▼
Google Login
 │
 ▼
/api/auth/google
 │
 ▼
Google
 │
 ▼
/api/auth/google/callback
 │
 ▼
OAuthSuccess
 │
 ▼
Application
```

---

# Device-to-Dashboard Flow

The complete monitoring flow is:

```text
TrailGuard Wearable
        │
        │ telemetry
        ▼
POST /api/device/readings
        │
        ▼
TrailGuard Backend
        │
        ├── MongoDB
        │
        └── WebSocket
                │
                ▼
        LiveDataContext
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
    Dashboard  Map    Fall Alert
```

---

# Testing

The frontend uses:

- Vitest
- Testing Library
- jsdom
- `@testing-library/jest-dom`

The package provides:

```bash
pnpm test
```

for watch/development mode.

For a single test run:

```bash
pnpm test:run
```

---

## Build Verification

A production build can also be used as a basic integration check:

```bash
pnpm build
```

If the build succeeds, Vite has successfully compiled the frontend application.

---

# Production Build

Create an optimized production build:

```bash
pnpm build
```

Vite generates the production files in:

```text
dist/
```

---

# Preview Production Build

After building:

```bash
pnpm preview
```

This serves the generated production build locally for verification.

---

# Deployment

The repository contains:

```text
vercel.json
```

and the frontend is structured for Vite-based deployment.

Before deployment, configure the production environment variables:

```env
VITE_API_URL=https://your-backend-domain.example/api
VITE_WS_URL=wss://your-backend-domain.example/live
```

The backend must also allow the deployed frontend origin through its CORS configuration.

---

# Development Guidelines

## Reuse Existing Components

Before creating a new component, check whether an existing component can be reused.

Examples:

```text
StatCard
SectionCard
Button
Field
PageHeader
```

---

## Keep API Communication Centralized

Prefer:

```text
lib/apiClient.js
```

for backend communication.

Avoid scattering unrelated raw `fetch()` calls throughout the application.

---

## Use Existing Contexts

Use the existing contexts for global state:

```text
AuthContext
DeviceContext
LiveDataContext
```

Do not create duplicate authentication, device, or WebSocket state unless there is a strong architectural reason.

---

## Realtime Data

Components requiring live wearable data should consume the existing:

```text
LiveDataContext
```

rather than opening independent WebSocket connections.

This keeps the application architecture simpler and avoids unnecessary connections.

---

## Styling

The frontend uses Tailwind CSS 4 together with the existing application CSS.

When adding UI:

- Reuse existing design patterns.
- Maintain consistent spacing.
- Reuse existing typography.
- Reuse existing components.
- Maintain responsive layouts.
- Keep safety-critical notifications prominent.
- Maintain accessible contrast.
- Avoid unnecessary one-off styling.

---

# Known Limitations

The current frontend has several areas that should be considered during further development.

### Authentication Storage

The current frontend uses browser-side persistent authentication state.

A production deployment should review whether secure cookie-based authentication would be preferable.

### Realtime Connection

The frontend depends on the backend WebSocket service being available at:

```text
/live
```

### Backend Dependency

The dashboard requires the TrailGuard backend for:

- Authentication
- Device information
- Telemetry
- Historical data
- Fall events
- Location data
- Realtime updates

### Map Availability

Map functionality depends on MapLibre configuration and the map style/source used by the application.

### API/Frontend Synchronization

When backend API routes or response structures change, corresponding frontend API utilities and components may need to be updated.

---

# Development Checklist

Before committing frontend changes:

```text
[ ] pnpm install
[ ] Configure .env
[ ] Start backend
[ ] Start frontend
[ ] Test authentication
[ ] Test device selection
[ ] Test dashboard
[ ] Test realtime WebSocket
[ ] Test map
[ ] Test fall alert
[ ] Test history
[ ] Test settings
[ ] pnpm test:run
[ ] pnpm build
```

---

# Related Components

TrailGuard is composed of multiple project components:

```text
Smart-Wearable/
│
├── backend/      ← Node.js + Express + MongoDB + WebSocket
│
├── frontend/     ← React + Vite dashboard
│
└── ...
```

The frontend is responsible for the user interface and communicates with the backend for data and realtime events.

---

# Current Frontend Status

The current frontend provides:

- [x] React/Vite application
- [x] Authentication pages
- [x] Local login/register
- [x] Google OAuth flow
- [x] Protected routes
- [x] Profile completion
- [x] Device management
- [x] Health monitoring
- [x] Environmental monitoring
- [x] GPS/location monitoring
- [x] MapLibre-based live map
- [x] Historical data
- [x] Fall detection UI
- [x] SOS/fall alert modal
- [x] WebSocket realtime data
- [x] Responsive application layout
- [x] Settings/profile interface
- [x] Vitest test setup
- [x] Production Vite build
- [x] Vercel deployment configuration

---

# License

This project is part of the **TrailGuard — Smart Wearable Safety & Health Monitoring System**.

See the repository root for project-level licensing and documentation.
