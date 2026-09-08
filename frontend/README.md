# TrailGuard Frontend

React + Vite web dashboard for **TrailGuard — Smart Wearable Safety and Health Monitoring System**.

The frontend provides the user-facing dashboard for authentication, wearable/device management, real-time health monitoring, environmental monitoring, GPS location tracking, fall detection, SOS alerts, historical data, and profile/safety settings.

It communicates with the TrailGuard Express backend through REST APIs and a WebSocket connection for real-time wearable data.

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
- [Real-Time Data](#real-time-data)
- [Authentication](#authentication)
- [Dashboard](#dashboard)
- [History](#history)
- [Location and Live Map](#location-and-live-map)
- [Fall Detection and SOS](#fall-detection-and-sos)
- [Device Management](#device-management)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Development Guidelines](#development-guidelines)
- [Production Build](#production-build)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Related Components](#related-components)
- [License](#license)

---

## Overview

TrailGuard is a smart wearable safety and health monitoring system designed to collect information from a wearable device and present it through a web dashboard.

The frontend acts as the main interface between the user and the TrailGuard backend.

```text
┌──────────────────────┐
│   TrailGuard Wearable│
│       / ESP32        │
└──────────┬───────────┘
           │
           │ HTTP telemetry
           ▼
┌──────────────────────┐
│   TrailGuard Backend │
│  Express + MongoDB   │
└──────────┬───────────┘
           │
           ├──────── REST API
           │
           └──────── WebSocket
                    │
                    ▼
           ┌──────────────────┐
           │ TrailGuard Web   │
           │    Dashboard     │
           │ React + Vite     │
           └──────────────────┘
```

The frontend is designed to work with the backend located in:

```text
/backend
```

---

## Features

### Authentication

- User registration
- Email/password login
- Google OAuth login
- JWT-based authentication
- Protected application routes
- Profile completion flow
- Persistent authentication state

### Health Monitoring

- Live heart-rate monitoring
- Blood oxygen (`SpO₂`) monitoring
- Latest vital readings
- Historical vital data
- Vital statistics
- Real-time updates through WebSocket

### Environmental Monitoring

- Temperature monitoring
- Humidity monitoring
- Atmospheric pressure monitoring
- Latest environmental readings
- Historical environmental data
- Environmental statistics

### Location Tracking

- Current GPS location
- Latitude and longitude display
- Altitude information
- Satellite information
- Location history
- Live map visualization using Leaflet/OpenStreetMap

### Fall Detection

- Real-time fall notifications
- Fall event information
- Fall history
- Fall status management
- Global fall/SOS alert modal

### Device Management

- View paired wearable devices
- Rename devices
- Activate/deactivate devices
- Device-aware dashboard data

### User Settings

- Profile information
- Personal information
- Safety information
- Emergency contact information
- Health-related profile information

---

## Technology Stack

| Technology        | Purpose                                    |
| ----------------- | ------------------------------------------ |
| React 18          | UI framework                               |
| Vite              | Frontend build tool and development server |
| React Router      | Client-side routing                        |
| Tailwind CSS      | Utility-first styling                      |
| Leaflet           | Interactive maps                           |
| React Leaflet     | React integration for Leaflet              |
| Lucide React      | UI icons                                   |
| React Icons       | Additional icon library                    |
| Typewriter Effect | Animated text                              |
| JavaScript / JSX  | Application development                    |
| pnpm              | Package management                         |

The current project uses **pnpm 11** as its package manager.

---

## Application Architecture

The application is organized around pages, reusable components, React contexts, API utilities, and styling.

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

## Prerequisites

Before running the frontend, install:

- Node.js 18 or later
- pnpm 11
- Git
- A running TrailGuard backend
- MongoDB configured through the backend

The backend should normally be available at:

```text
http://localhost:3000
```

The frontend development server is configured to run on:

```text
http://localhost:5173
```

The Vite configuration explicitly sets the development server port to `5173`.

---

## Installation

From the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
pnpm install
```

Create the local environment file:

```bash
cp .env.example .env
```

Then configure the environment variables.

---

## Environment Configuration

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/live
```

### Variables

| Variable       | Description                       | Example                     |
| -------------- | --------------------------------- | --------------------------- |
| `VITE_API_URL` | Base URL for the backend REST API | `http://localhost:3000/api` |
| `VITE_WS_URL`  | WebSocket endpoint for live data  | `ws://localhost:3000/live`  |

Vite exposes frontend environment variables only when they use the `VITE_` prefix.

### Production

For HTTPS deployments, use secure WebSocket connections:

```env
VITE_API_URL=https://your-backend-domain.example/api
VITE_WS_URL=wss://your-backend-domain.example/live
```

Do not place private secrets inside frontend environment variables.

Anything prefixed with `VITE_` can be exposed to the browser.

---

## Running the Application

Start the development server:

```bash
pnpm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

### Run Backend and Frontend Together

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
pnpm run dev
```

The resulting architecture is:

```text
Frontend
http://localhost:5173
       │
       ├── REST
       ▼
Backend
http://localhost:3000/api
       │
       └── WebSocket
           ws://localhost:3000/live
```

---

## Application Routes

| Page             | Route               | Purpose                                          |
| ---------------- | ------------------- | ------------------------------------------------ |
| Login            | `/login`            | User authentication                              |
| Register         | `/register`         | Create a new account                             |
| OAuth Success    | `/oauth-success`    | Handles Google OAuth redirect                    |
| Complete Profile | `/complete-profile` | Complete required profile information            |
| Dashboard        | `/dashboard`        | Main health and safety dashboard                 |
| History          | `/history`          | Historical health/environment/location/fall data |
| Settings         | `/settings`         | Profile and safety settings                      |

The fall/SOS alert is implemented as a **global application overlay**, rather than as a dedicated route.

---

## Backend API Integration

The main API integration is handled by:

```text
src/lib/apiClient.js
```

The frontend communicates with the backend using REST endpoints for authentication, device information, health data, environment data, location data, and fall events.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/google
PATCH /api/auth/complete-profile
GET  /api/auth/me
```

### Device

```text
POST  /api/device/register
GET   /api/device/:deviceId
PATCH /api/device/:deviceId/name

GET   /api/devices
PATCH /api/devices/:deviceId
PATCH /api/devices/:deviceId/status
DELETE /api/devices/:deviceId
```

### Vitals

```text
GET /api/vitals/latest
GET /api/vitals/history
GET /api/vitals/stats
```

### Environment

```text
GET /api/environment/latest
GET /api/environment/history
GET /api/environment/stats
```

### Location

```text
GET /api/location/latest
GET /api/location/history
```

### Falls

```text
GET   /api/falls
GET   /api/falls/latest
PATCH /api/falls/:id
```

The frontend sends the JWT with authenticated API requests.

---

## Real-Time Data

TrailGuard uses a WebSocket connection for live wearable data.

The connection is established through:

```text
VITE_WS_URL
```

Default:

```text
ws://localhost:3000/live
```

The application maintains the WebSocket connection through:

```text
context/LiveDataContext.jsx
```

This allows multiple pages and components to consume the same live data connection.

### Supported Events

The frontend handles events including:

```text
vitals
environment
location
fall_detected
fall_status_update
```

Conceptually:

```text
Wearable
   │
   │ telemetry
   ▼
Backend
   │
   │ WebSocket broadcast
   ▼
LiveDataContext
   │
   ├── Dashboard
   ├── Live Map
   ├── Health cards
   ├── Environment cards
   └── Fall/SOS Alert
```

The WebSocket connection also supports automatic reconnection when the connection is lost.

---

## Authentication

Authentication is handled through:

```text
context/AuthContext.jsx
```

The application supports:

1. Local registration
2. Local login
3. Google OAuth
4. JWT persistence
5. Protected routes
6. Profile completion

Protected pages use:

```text
components/ProtectedRoute.jsx
```

### Current Token Storage

The current implementation stores the JWT in browser `localStorage`.

This is convenient for the current development/capstone stage but has security trade-offs.

For a production deployment, consider moving authentication to secure, appropriately configured `httpOnly` cookies.

---

## Dashboard

The dashboard is the primary monitoring interface.

It combines:

- User information
- Wearable/device information
- Heart rate
- SpO₂
- Temperature
- Humidity
- Pressure
- GPS location
- Fall events
- Recent activity
- Real-time updates
- SOS/fall notifications

The dashboard consumes both REST API data and WebSocket updates.

---

## History

The History page provides access to previously recorded data.

It can display historical:

- Vital readings
- Environmental readings
- Location data
- Fall events

Historical requests use backend endpoints such as:

```text
GET /api/vitals/history
GET /api/environment/history
GET /api/location/history
GET /api/falls
```

The available time range is controlled through API query parameters.

---

## Location and Live Map

The frontend uses:

- Leaflet
- React Leaflet
- OpenStreetMap

The main map component is:

```text
components/LiveMap.jsx
```

The map uses the latest GPS coordinates supplied by the backend:

```text
latitude
longitude
```

Additional location information can include:

```text
altitude
satellites
locationStale
```

The map is intended to provide a lightweight real-time visualization of the wearable's latest known position.

---

## Fall Detection and SOS

Fall detection is integrated into the application globally.

When the backend broadcasts:

```text
fall_detected
```

the frontend can display the fall/SOS alert regardless of which protected page the user is currently viewing.

The primary component is:

```text
components/FallAlertModal.jsx
```

After a fall event is received, the application can also interact with:

```text
PATCH /api/falls/:id
```

to update the event status.

This global design ensures that a safety-critical notification is not restricted to the Dashboard page.

---

## Device Management

Device-related application state is handled through:

```text
context/DeviceContext.jsx
```

The frontend can work with paired wearable devices and communicate with backend device-management endpoints.

Typical operations include:

- Loading registered devices
- Selecting a device
- Renaming a device
- Activating/deactivating a device
- Associating dashboard data with the selected device

The device ID is used by the backend to associate wearable telemetry with the appropriate user.

---

## Project Structure

### `pages/`

Contains complete application screens.

Examples:

```text
Dashboard.jsx
History.jsx
Login.jsx
Register.jsx
Settings.jsx
CompleteProfile.jsx
OAuthSuccess.jsx
```

### `components/`

Contains reusable UI components.

Examples:

```text
StatCard.jsx
LiveMap.jsx
FallAlertModal.jsx
Sidebar.jsx
ProtectedRoute.jsx
```

### `components/auth/`

Reusable authentication-related UI:

```text
AuthCard.jsx
AuthLayout.jsx
Button.jsx
Field.jsx
```

### `components/app/`

Shared application layout and navigation components:

```text
AppLayout.jsx
NotificationBell.jsx
PageHeader.jsx
ProfileMenu.jsx
SectionCard.jsx
```

### `context/`

Global React state:

```text
AuthContext.jsx
DeviceContext.jsx
LiveDataContext.jsx
```

### `lib/`

Application utilities and backend communication:

```text
apiClient.js
profileCompletion.js
```

### `assets/`

Static frontend assets such as images.

---

## Design System

The frontend uses a centralized styling approach rather than defining arbitrary styles independently inside every component.

Global styling is primarily located in:

```text
src/index.css
```

and related CSS files.

The project also uses Tailwind CSS for utility-based styling.

### Design Principles

When adding new UI:

- Reuse existing components whenever possible.
- Reuse existing spacing and typography patterns.
- Use the established design tokens.
- Avoid unnecessary hardcoded colors.
- Keep cards and dashboard sections visually consistent.
- Maintain accessible contrast.
- Keep safety-critical alerts visually prominent.
- Avoid breaking the existing responsive layouts.

---

## Development Guidelines

### Component Reuse

Before creating a new component, check whether an existing component can be reused.

For example:

```text
StatCard.jsx
SectionCard.jsx
Button.jsx
Field.jsx
```

### API Calls

Keep backend communication inside:

```text
lib/apiClient.js
```

rather than scattering raw `fetch()` calls throughout unrelated components.

### Global State

Use the appropriate context for shared state:

```text
AuthContext
DeviceContext
LiveDataContext
```

Avoid duplicating global state independently across pages.

### Real-Time Data

Components that need live wearable information should consume the existing WebSocket state rather than opening separate WebSocket connections.

This keeps the application architecture simple and reduces unnecessary connections to the backend.

---

## Production Build

Create an optimized production build:

```bash
pnpm run build
```

Vite will generate the production output in:

```text
dist/
```

To preview the production build locally:

```bash
pnpm run preview
```

The frontend package currently provides the following scripts:

```text
pnpm run dev
pnpm run build
pnpm run preview
```

There is currently no dedicated frontend test script in `package.json`.

---

## Deployment

The frontend includes:

```text
vercel.json
```

and can be deployed to Vercel or another static/frontend hosting platform.

Before deployment, configure the production environment variables:

```env
VITE_API_URL=https://your-backend-domain.example/api
VITE_WS_URL=wss://your-backend-domain.example/live
```

The backend must also allow requests from the deployed frontend origin through its CORS configuration.

### Deployment Checklist

Before deploying:

- [ ] Build succeeds with `pnpm run build`
- [ ] Production API URL is configured
- [ ] Production WebSocket URL is configured
- [ ] Backend is publicly reachable
- [ ] Backend CORS allows the frontend domain
- [ ] Google OAuth redirect configuration matches production
- [ ] HTTPS is enabled
- [ ] WebSocket uses `wss://`
- [ ] No private secrets are exposed through `VITE_` variables

---

## Known Limitations

### Mobile Responsiveness

Basic responsive behavior exists, but additional mobile-specific UI polishing may still be required.

### Authentication Storage

JWTs are currently stored in `localStorage`.

A production-grade implementation should evaluate secure cookie-based authentication.

### Sensor GET Route Authorization

The frontend sends JWT credentials with API requests, but some sensor-related backend GET routes may still require additional server-side authorization work.

Frontend authentication should not be treated as a substitute for backend authorization.

### Twilio SOS Messaging

The frontend can initiate the relevant SOS/fall workflow, but actual SMS delivery depends on the backend's Twilio integration being configured and implemented.

### Browser Geolocation

The dashboard's primary location data comes from the wearable/backend GPS data rather than relying solely on the browser's own location.

---

## Troubleshooting

### Frontend cannot connect to backend

Check:

```env
VITE_API_URL=http://localhost:3000/api
```

Make sure the backend is running:

```bash
cd backend
npm run dev
```

### Live data is not updating

Check:

```env
VITE_WS_URL=ws://localhost:3000/live
```

Also verify that the backend WebSocket server is running.

### CORS error

Verify that the backend's:

```env
CLIENT_URL
```

matches the frontend origin.

For local development:

```text
http://localhost:5173
```

### Login succeeds but dashboard is inaccessible

Check:

- JWT is being stored correctly.
- The browser has not cleared local storage.
- The API URL is correct.
- The backend is running.
- The user has completed the required profile information.
- Protected route logic is not redirecting unexpectedly.

### Map does not display correctly

Check that:

- Latitude and longitude are valid.
- Leaflet CSS is loaded.
- The backend is providing location data.
- The browser can reach the map tile provider.

---

## Development Workflow

A typical development workflow is:

```text
1. Start MongoDB
        │
        ▼
2. Start TrailGuard Backend
        │
        ▼
3. Start TrailGuard Frontend
        │
        ▼
4. Register / Login
        │
        ▼
5. Pair wearable device
        │
        ▼
6. Start wearable / ESP32 simulator
        │
        ▼
7. Backend receives telemetry
        │
        ▼
8. Backend broadcasts live events
        │
        ▼
9. Frontend updates dashboard
        │
        ▼
10. Fall/location/health information appears in real time
```

---

## Related Components

TrailGuard is organized into three major application areas:

```text
Smart-Wearable/
│
├── backend/     # Express API, MongoDB, WebSocket server
├── frontend/    # React + Vite dashboard
└── hardware/    # Wearable / ESP32 hardware implementation
```

The frontend depends on the backend for:

- Authentication
- Device association
- Health telemetry
- Environmental telemetry
- GPS information
- Fall events
- Real-time WebSocket events

---

## Project Repository

TrailGuard source code:

https://github.com/SWAGAT10241/Smart-Wearable

---

## License

This project is licensed under the **MIT License**.

See the repository's `LICENSE` file for details.

---

## Capstone Context

TrailGuard is developed as a smart wearable safety and health monitoring system combining:

- Embedded hardware
- Sensors
- ESP32-based wearable functionality
- Backend APIs
- MongoDB
- Real-time WebSocket communication
- React-based monitoring dashboard

The frontend serves as the central user interface for visualizing the data collected by the wearable and processed by the TrailGuard backend.
