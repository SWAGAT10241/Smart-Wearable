# TrailGuard — Smart Wearable Safety & Health Monitoring System

<p align="center">
  <strong>A smart wearable system for real-time health, safety, fall detection, environmental monitoring, and location tracking.</strong>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#key-features">Features</a> •
  <a href="#system-architecture">Architecture</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#documentation">Documentation</a>
</p>

---

## Overview

**TrailGuard** is an integrated smart wearable safety and health monitoring system designed to continuously collect and monitor important health, environmental, movement, and location information.

The system combines an **ESP32-based wearable device**, a **Node.js/Express backend**, **MongoDB**, real-time **WebSocket communication**, and a **React + Vite web dashboard**.

The goal is to provide a unified platform where wearable sensor data can be collected, processed, stored, and presented to users in real time.

```text
                         TRAILGUARD SYSTEM
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
   │   HARDWARE  │      │   BACKEND   │      │  FRONTEND   │
   │             │      │             │      │             │
   │ ESP32       │─────▶│ Express API │─────▶│ React + Vite│
   │ Sensors     │ HTTP │ MongoDB     │ REST │ Dashboard   │
   │ GPS         │      │ WebSocket   │◀────▶│ Live UI     │
   └─────────────┘      └─────────────┘      └─────────────┘
          │                    │                    │
          │                    │                    │
          ▼                    ▼                    ▼
      Sensor Data          Data Storage        Visualization
      & Telemetry          & Processing        & Alerts
```

---

## Key Features

### ❤️ Health Monitoring

TrailGuard can monitor wearable health information including:

- Heart rate
- Blood oxygen saturation (`SpO₂`)
- Historical vital readings
- Vital statistics
- Real-time vital updates

---

### 🌡️ Environmental Monitoring

The system supports environmental measurements such as:

- Temperature
- Humidity
- Atmospheric pressure
- Historical environmental readings
- Environmental statistics

---

### 📍 GPS Location Tracking

TrailGuard provides location information from the wearable, including:

- Latitude
- Longitude
- Altitude
- Satellite count
- Location freshness/staleness information
- Location history
- Live map visualization

The frontend uses **Leaflet / React Leaflet** to visualize the latest location.

---

### 🚨 Fall Detection

The wearable/backend pipeline supports fall-event information including:

- Fall detection
- Acceleration measurements
- Tilt angle
- Total acceleration
- Peak acceleration
- Peak gyroscope data
- Posture change
- Fall severity
- GPS position associated with a fall

When a fall is detected, the backend can broadcast a real-time event to the frontend.

The frontend displays this through a global fall/SOS alert interface.

---

### 🆘 SOS & Emergency Workflow

TrailGuard includes an emergency-oriented workflow designed around fall events and emergency contacts.

The system supports:

- Fall alerts
- Emergency information
- Emergency contact information
- Fall status updates
- SOS interaction from the dashboard

SMS delivery through Twilio is part of the planned backend integration and depends on the required backend configuration.

---

### 🔐 Authentication

The platform supports:

- User registration
- Email/password login
- Google OAuth
- JWT authentication
- Protected frontend routes
- Profile completion
- User profile management

---

### 📡 Real-Time Monitoring

The backend provides a WebSocket channel that allows the frontend to receive live events.

Supported event types include:

```text
vitals
environment
location
fall_detected
fall_status_update
```

This allows the dashboard to update without repeatedly refreshing the page.

---

### 📱 Device Management

TrailGuard supports wearable/device management including:

- Device registration
- Device pairing
- Device ownership
- Device renaming
- Device activation/deactivation
- Device-specific telemetry

---

## System Architecture

TrailGuard consists of three primary layers.

### 1. Hardware Layer

The wearable device is responsible for collecting sensor information.

```text
ESP32
 │
 ├── Heart-rate / SpO₂ data
 ├── Motion / acceleration data
 ├── Gyroscope data
 ├── Environmental data
 └── GPS data
       │
       ▼
   Telemetry
```

The hardware communicates with the backend to send wearable readings.

---

### 2. Backend Layer

The backend acts as the central processing and storage layer.

```text
Wearable
   │
   │ HTTP telemetry
   ▼
Express Server
   │
   ├── Authentication
   ├── Device Management
   ├── Vitals
   ├── Environment
   ├── Location
   ├── Fall Events
   │
   ▼
MongoDB
   │
   └── Persistent Data
```

The backend also provides:

```text
WebSocket /live
```

for real-time communication with the frontend.

---

### 3. Frontend Layer

The React frontend consumes backend REST APIs and WebSocket events.

```text
                 Backend
                    │
          ┌─────────┴─────────┐
          │                   │
        REST              WebSocket
          │                   │
          ▼                   ▼
     API Client         LiveDataContext
          │                   │
          └─────────┬─────────┘
                    ▼
              React Dashboard
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
     Health      Location       Alerts
     Data         Map          & Falls
```

---

# Project Structure

```text
Smart-Wearable/
│
├── .github/
│   └── ...
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   └── passport.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Device.js
│   │   ├── EnvironmentReading.js
│   │   ├── FallEvent.js
│   │   ├── LocationReading.js
│   │   ├── PhoneOtp.js
│   │   ├── User.js
│   │   └── VitalsReading.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── deviceManagementRoutes.js
│   │   ├── deviceRegistrationRoutes.js
│   │   ├── deviceRoutes.js
│   │   ├── environmentRoutes.js
│   │   ├── fallRoutes.js
│   │   ├── locationRoutes.js
│   │   └── vitalsRoutes.js
│   │
│   ├── tests/
│   │   └── server.test.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── simulate-esp32.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── hardware/
│   └── ...
│
├── LICENSE
└── README.md
```

---

# Technology Stack

## Hardware

The hardware portion is based around an ESP32-class microcontroller and wearable sensors.

Depending on the hardware implementation, sensors can provide:

- Heart rate
- SpO₂
- Accelerometer data
- Gyroscope data
- Temperature
- Humidity
- Pressure
- GPS

---

## Backend

| Technology         | Purpose                          |
| ------------------ | -------------------------------- |
| Node.js            | Runtime                          |
| Express            | REST API                         |
| MongoDB            | Database                         |
| Mongoose           | MongoDB ODM                      |
| WebSocket (`ws`)   | Real-time communication          |
| JWT                | Authentication                   |
| Passport           | Google OAuth                     |
| bcrypt             | Password hashing                 |
| Helmet             | HTTP security headers            |
| CORS               | Cross-origin requests            |
| Express Rate Limit | API rate limiting                |
| Twilio             | Planned/optional SMS integration |

---

## Frontend

| Technology    | Purpose                |
| ------------- | ---------------------- |
| React         | UI framework           |
| Vite          | Development/build tool |
| React Router  | Application routing    |
| Tailwind CSS  | Styling                |
| Leaflet       | Map rendering          |
| React Leaflet | React map integration  |
| Lucide React  | Icons                  |
| React Icons   | Additional icons       |

---

# Communication Flow

The complete TrailGuard data flow is:

```text
┌───────────────────┐
│ Wearable / ESP32  │
└─────────┬─────────┘
          │
          │ Sensor telemetry
          ▼
┌───────────────────┐
│ TrailGuard        │
│ Express Backend   │
└─────────┬─────────┘
          │
          ├───────────────┐
          │               │
          ▼               ▼
     ┌─────────┐     ┌────────────┐
     │ MongoDB │     │ WebSocket  │
     └─────────┘     │   /live    │
                     └─────┬──────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ React/Vite    │
                   │ Dashboard     │
                   └───────────────┘
```

---

# Getting Started

## Prerequisites

Install the following:

- Node.js 18+
- pnpm 11+
- MongoDB
- Git

For hardware development, the appropriate ESP32 development environment and sensor libraries are also required.

---

## 1. Clone the Repository

```bash
git clone https://github.com/SWAGAT10241/Smart-Wearable.git
cd Smart-Wearable
```

---

# 2. Start the Backend

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Configure MongoDB, authentication, and other required environment variables.

Start the development server:

```bash
npm run dev
```

The backend runs by default on:

```text
http://localhost:3000
```

The WebSocket endpoint is:

```text
ws://localhost:3000/live
```

For complete backend documentation, see:

```text
backend/README.md
```

---

# 3. Start the Frontend

Open another terminal:

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

Configure:

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/live
```

Start the development server:

```bash
pnpm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

For complete frontend documentation, see:

```text
frontend/README.md
```

---

# 4. Run the ESP32 Simulator

The backend includes a development simulator for testing wearable telemetry without physical hardware.

From the backend directory:

```bash
npm run simulate
```

This can be used to test the complete software pipeline:

```text
ESP32 Simulator
      │
      ▼
Backend API
      │
      ├── MongoDB
      │
      └── WebSocket
             │
             ▼
        React Dashboard
```

---

# API Overview

The backend exposes several API groups.

## Authentication

```text
POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/google
PATCH /api/auth/complete-profile
GET   /api/auth/me
```

## Devices

```text
POST   /api/device/register
POST   /api/device/readings
GET    /api/device/:deviceId
PATCH  /api/device/:deviceId/name

GET    /api/devices
PATCH  /api/devices/:deviceId
PATCH  /api/devices/:deviceId/status
DELETE /api/devices/:deviceId
```

## Vitals

```text
GET /api/vitals/latest
GET /api/vitals/history
GET /api/vitals/stats
```

## Environment

```text
GET /api/environment/latest
GET /api/environment/history
GET /api/environment/stats
```

## Location

```text
GET /api/location/latest
GET /api/location/history
```

## Falls

```text
GET   /api/falls
GET   /api/falls/latest
PATCH /api/falls/:id
```

---

# WebSocket

The backend exposes:

```text
ws://localhost:3000/live
```

The frontend maintains a shared WebSocket connection through:

```text
frontend/src/context/LiveDataContext.jsx
```

Real-time event categories include:

```text
vitals
environment
location
fall_detected
fall_status_update
```

This allows health data, location data, and fall events to appear on the dashboard without requiring a full page refresh.

---

# Frontend Application

The main frontend pages include:

| Page             | Route               | Purpose               |
| ---------------- | ------------------- | --------------------- |
| Login            | `/login`            | User login            |
| Register         | `/register`         | Account creation      |
| OAuth Success    | `/oauth-success`    | Google OAuth handling |
| Complete Profile | `/complete-profile` | Profile completion    |
| Dashboard        | `/dashboard`        | Live monitoring       |
| History          | `/history`          | Historical data       |
| Settings         | `/settings`         | User/safety settings  |

The fall alert is implemented as a global overlay rather than a dedicated route.

---

# Security

TrailGuard implements several security mechanisms across the backend and frontend.

### Backend

- JWT authentication
- Password hashing with bcrypt
- Helmet security headers
- CORS configuration
- Authentication rate limiting
- Session support
- Protected API routes

### Frontend

- Protected application routes
- JWT-based authenticated requests
- Centralized API client
- Authentication context
- No private backend secrets exposed through frontend variables

> **Important:** Frontend authentication must never be considered a replacement for backend authorization. The backend must independently validate authentication and ownership for protected resources.

---

# Database

MongoDB is used for persistent application data.

Primary data models include:

```text
User
Device
VitalsReading
EnvironmentReading
LocationReading
FallEvent
PhoneOtp
```

Conceptually:

```text
User
 │
 ├── Device
 │     │
 │     ├── VitalsReading
 │     ├── EnvironmentReading
 │     ├── LocationReading
 │     └── FallEvent
 │
 └── Emergency / Profile Information
```

---

# Testing

The backend includes automated tests using:

- Jest
- Supertest

Run backend tests with:

```bash
cd backend
npm test
```

The frontend currently focuses on application/runtime verification and does not have a dedicated frontend test script configured in its package configuration.

---

# Production Build

## Backend

Configure production environment variables and start the backend using:

```bash
npm start
```

---

## Frontend

Build the production frontend:

```bash
cd frontend
pnpm run build
```

Preview the production build:

```bash
pnpm run preview
```

The production output is generated in:

```text
frontend/dist/
```

---

# Deployment

The frontend includes Vercel configuration and can be deployed to a modern frontend hosting platform.

For production deployment, configure:

```env
VITE_API_URL=https://your-backend-domain.example/api
VITE_WS_URL=wss://your-backend-domain.example/live
```

The backend must also be configured to:

- Accept requests from the production frontend origin
- Serve the REST API over HTTPS
- Support secure WebSockets (`wss://`)
- Use production database credentials
- Use strong authentication/session secrets
- Configure Google OAuth redirect URLs correctly

---

# Development Workflow

A typical development workflow looks like this:

```text
┌─────────────────────┐
│ Start MongoDB       │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Start Backend       │
│ npm run dev         │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Start Frontend      │
│ pnpm run dev        │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Start ESP32 /       │
│ ESP32 Simulator     │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Backend receives    │
│ wearable telemetry  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ MongoDB stores data │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ WebSocket broadcasts│
│ live events         │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ React Dashboard     │
│ updates in real time│
└─────────────────────┘
```

---

# Future Improvements

Potential future development areas include:

- Improved mobile responsiveness
- Dedicated mobile application
- Stronger device authentication
- Secure cookie-based authentication
- Improved backend authorization for all sensor endpoints
- Real Twilio SMS emergency notifications
- More advanced fall-detection algorithms
- Historical data visualization and analytics
- Additional wearable sensors
- Battery monitoring
- Device connectivity status
- Offline data buffering
- Push notifications
- Advanced emergency workflows
- Automated health/safety reports

---

# Documentation

Detailed documentation is maintained separately for each major part of the system.

### Backend

```text
backend/README.md
```

Contains:

- Backend setup
- Environment configuration
- REST APIs
- WebSocket communication
- Database models
- Authentication
- Device telemetry
- Testing
- Deployment considerations

### Frontend

```text
frontend/README.md
```

Contains:

- Frontend setup
- React architecture
- Application routes
- Components
- Context/state management
- API integration
- WebSocket integration
- Maps
- Fall/SOS interface
- Deployment

### Hardware

```text
hardware/
```

Contains the wearable/ESP32 implementation and associated hardware resources.

---

# Repository

**GitHub Repository**

https://github.com/SWAGAT10241/Smart-Wearable

---

# Project Status

TrailGuard is an active development project integrating hardware, backend, and frontend components into a unified smart wearable safety platform.

Current major software components include:

- ✅ React + Vite frontend
- ✅ Express backend
- ✅ MongoDB persistence
- ✅ JWT authentication
- ✅ Google OAuth integration
- ✅ Device registration/management
- ✅ Health telemetry
- ✅ Environmental telemetry
- ✅ GPS/location telemetry
- ✅ Fall event processing
- ✅ WebSocket real-time communication
- ✅ Live dashboard
- ✅ Live location map
- ✅ Fall/SOS alert interface
- 🚧 Further production hardening and mobile optimization
- 🚧 Full Twilio SMS emergency workflow

---

# License

This project is licensed under the **MIT License**.

See [`LICENSE`](./LICENSE) for details.

---

## TrailGuard

**Smart Wearable Safety & Health Monitoring System**

```text
Hardware  →  Backend  →  Database
                │
                ▼
            WebSocket
                │
                ▼
            Frontend
                │
                ▼
        Real-Time Safety
        & Health Dashboard
```
