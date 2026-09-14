# TrailGuard — Smart Wearable Safety & Health Monitoring System

<p align="center">
  <strong>A smart wearable platform for real-time health monitoring, fall detection, environmental sensing, GPS tracking, and emergency safety.</strong>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#key-features">Features</a> •
  <a href="#system-architecture">Architecture</a> •
  <a href="#technology-stack">Technology</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#testing">Testing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ESP32-Hardware-000000?style=for-the-badge&logo=espressif" alt="ESP32">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
</p>

---

## Overview

**TrailGuard** is an integrated smart wearable safety and health monitoring system designed to collect, process, store, and visualize real-time information from a wearable device.

The system combines an **ESP32-based wearable**, a **Node.js/Express backend**, **MongoDB**, **WebSocket real-time communication**, and a **React + Vite web dashboard**.

TrailGuard is designed around four major goals:

- ❤️ **Health monitoring**
- 🚨 **Safety and fall detection**
- 📍 **Location awareness**
- 🌡️ **Environmental monitoring**

The wearable collects sensor data and sends telemetry to the backend. The backend validates and processes the data, stores historical readings in MongoDB, and broadcasts real-time events to connected dashboard clients.

---

# Project Status

TrailGuard is currently under active development.

### Implemented

- ESP32 wearable telemetry pipeline
- Heart-rate monitoring
- Blood oxygen (`SpO₂`) monitoring
- Environmental monitoring
- GPS location tracking
- Fall-event detection and management
- Real-time WebSocket communication
- User registration and login
- JWT authentication
- Google OAuth authentication
- User profile management
- Wearable/device registration
- Device management
- Historical health data
- Historical environmental data
- Location history
- Fall history
- Real-time dashboard
- Interactive map visualization using MapLibre GL
- ESP32 telemetry simulator
- Backend automated testing
- Frontend automated testing
- Security middleware and rate limiting

### In Progress / Optional

- Physical hardware refinement and validation
- Emergency SMS workflow using Twilio
- Additional sensor validation
- Production infrastructure hardening
- Extended deployment configuration

> The project is intended as an evolving research/development platform. Hardware capabilities may depend on the sensors and ESP32 configuration used in a particular build.

---

# Key Features

## ❤️ Health Monitoring

TrailGuard supports continuous monitoring of wearable health information.

Current health data includes:

- Heart rate
- Blood oxygen saturation (`SpO₂`)
- Latest vital readings
- Historical vital readings
- Vital statistics
- Real-time vital updates

The dashboard can receive new vital information through the WebSocket connection without requiring a full page refresh.

---

## 🌡️ Environmental Monitoring

The wearable/backend pipeline supports environmental measurements including:

- Temperature
- Humidity
- Atmospheric pressure
- Latest environmental readings
- Historical environmental readings
- Environmental statistics

This allows environmental conditions around the wearer to be monitored alongside health information.

---

## 📍 GPS Location Tracking

TrailGuard supports location-aware monitoring using GPS data.

The system can work with:

- Latitude
- Longitude
- Altitude
- Satellite count
- Location freshness/staleness information
- Location history
- Latest location

The web dashboard uses **MapLibre GL** for interactive map visualization.

---

## 🚨 Fall Detection

Fall detection is one of TrailGuard's core safety functions.

The system can process fall-related information including:

- Fall detection state
- Acceleration
- Total acceleration
- Peak acceleration
- Gyroscope data
- Peak gyroscope value
- Tilt angle
- Posture change
- Fall severity
- GPS position associated with an event

When a fall is detected, the backend creates a fall event and can broadcast a real-time `fall_detected` event to connected dashboard clients.

---

## 🆘 SOS & Emergency Workflow

TrailGuard provides an emergency-oriented workflow around fall events and user safety.

The system supports:

- Fall alerts
- Fall status updates
- Emergency contact information
- SOS/fall alert interface
- Emergency-related user settings
- Optional SMS integration through Twilio

Twilio is optional for local development and simulator-based testing.

---

## 🔐 Authentication & User Accounts

TrailGuard supports multiple authentication mechanisms.

### Local Authentication

- User registration
- Email/password login
- JWT-based authentication
- Protected API routes

### Google Authentication

- Google OAuth 2.0
- Passport.js integration
- OAuth callback handling
- Profile completion flow

### User Profile

The system supports user information required for the safety workflow, including:

- Personal information
- Health-related profile information
- Emergency contact information
- Safety information

---

## 📡 Real-Time Monitoring

TrailGuard uses WebSocket communication to provide real-time dashboard updates.

WebSocket endpoint:

```text
ws://localhost:3000/live
```

Supported event categories include:

```text
vitals
environment
location
fall_detected
fall_status_update
```

The basic flow is:

```text
Wearable
   │
   │ Telemetry
   ▼
Express Backend
   │
   ├── MongoDB
   │
   └── WebSocket
          │
          ▼
    React Dashboard
```

This allows the dashboard to react to new sensor information and safety events in real time.

---

# System Architecture

TrailGuard is organized into three major layers.

```text
                    TRAILGUARD SYSTEM
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     HARDWARE          BACKEND          FRONTEND
          │                │                │
       ESP32           Express          React/Vite
       Sensors         MongoDB          Dashboard
       GPS             WebSocket        MapLibre
          │                │                │
          └───────────────►│◄───────────────┘
                           │
                           ▼
                     Live Monitoring
                     & Data Storage
```

---

## 1. Hardware Layer

The hardware layer is responsible for collecting sensor information.

Conceptually:

```text
ESP32
 │
 ├── Heart Rate
 ├── SpO₂
 ├── Accelerometer
 ├── Gyroscope
 ├── Temperature
 ├── Humidity
 ├── Pressure
 └── GPS
       │
       ▼
   Telemetry Data
```

The exact hardware configuration may vary depending on the sensor modules used in the wearable.

---

## 2. Backend Layer

The backend acts as the central application and data layer.

```text
             Wearable / ESP32
                    │
                    │ HTTP Telemetry
                    ▼
          ┌─────────────────────┐
          │ Node.js / Express   │
          │      Backend        │
          └──────────┬──────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
     MongoDB      WebSocket      Twilio
        │            │            │
        │            │            ▼
        │            │       SMS Alerts
        │            │
        │            ▼
        │      Live Dashboard
        │
        ▼
 Historical Data
```

The backend is responsible for:

- Authentication
- Authorization
- Device management
- Telemetry ingestion
- Data validation
- Database storage
- Fall event management
- Real-time event broadcasting
- Optional emergency notifications

---

## 3. Frontend Layer

The frontend is the user-facing monitoring interface.

```text
                 TrailGuard Backend
                         │
              ┌──────────┴──────────┐
              │                     │
           REST API             WebSocket
              │                     │
              ▼                     ▼
        API Client            Live Data Context
              │                     │
              └──────────┬──────────┘
                         ▼
                  React Dashboard
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
        Health        Location        Safety
        Data            Map           Alerts
```

---

# Data Flow

The complete telemetry workflow is:

```text
┌────────────────────┐
│ ESP32 Wearable     │
│                    │
│ Sensors + GPS      │
└─────────┬──────────┘
          │
          │ HTTP telemetry
          ▼
┌────────────────────┐
│ Express Backend    │
│                    │
│ Validate device    │
│ Validate payload   │
└─────────┬──────────┘
          │
     ┌────┴─────┐
     │          │
     ▼          ▼
 MongoDB    WebSocket
     │          │
     │          ▼
     │      React UI
     │
     ▼
Historical Data
```

For a fall event:

```text
ESP32
  │
  │ fallDetected = true
  ▼
POST /api/device/readings
  │
  ▼
Backend
  │
  ├── Validate device
  ├── Create FallEvent
  ├── Store event
  │
  └── Broadcast fall_detected
               │
               ▼
        Dashboard Alert
```

---

# Technology Stack

## Hardware

The hardware layer is based around an ESP32-class microcontroller and wearable sensor modules.

Potential sensor categories include:

- Heart-rate / SpO₂ sensor
- Accelerometer
- Gyroscope
- Temperature sensor
- Humidity sensor
- Pressure sensor
- GPS module

---

## Backend

| Technology             | Purpose                       |
| ---------------------- | ----------------------------- |
| **Node.js**            | Backend runtime               |
| **Express.js**         | REST API framework            |
| **MongoDB**            | Persistent database           |
| **Mongoose**           | MongoDB ODM                   |
| **WebSocket (`ws`)**   | Real-time communication       |
| **JWT**                | Authentication                |
| **Passport.js**        | Authentication middleware     |
| **Google OAuth 2.0**   | Google sign-in                |
| **Express Session**    | OAuth/session support         |
| **Connect Mongo**      | MongoDB-backed sessions       |
| **bcrypt**             | Password hashing              |
| **Helmet**             | HTTP security headers         |
| **CORS**               | Cross-origin communication    |
| **Express Rate Limit** | Authentication/API protection |
| **Twilio**             | Optional emergency SMS        |
| **Jest**               | Backend testing               |
| **Supertest**          | HTTP/API testing              |
| **Nodemon**            | Development server            |

The backend currently requires **Node.js 18 or newer**.

---

## Frontend

| Technology            | Purpose                    |
| --------------------- | -------------------------- |
| **React 18**          | UI framework               |
| **Vite**              | Build and development tool |
| **React Router**      | Client-side routing        |
| **Tailwind CSS**      | Styling                    |
| **MapLibre GL**       | Interactive maps           |
| **Lucide React**      | UI icons                   |
| **React Icons**       | Additional icons           |
| **Typewriter Effect** | Animated text              |
| **Vitest**            | Frontend testing           |
| **Testing Library**   | Component testing          |
| **pnpm**              | Package management         |

The current project uses **pnpm 11.20.0**.

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
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── test/
│   │
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── vercel.json
│   ├── vite.config.js
│   └── README.md
│
├── hardware/
│   ├── Drivers/
│   └── Test/
│
├── LICENSE
└── README.md
```

---

# Getting Started

## Prerequisites

Install the following before running TrailGuard:

- **Node.js 18+**
- **pnpm 11+**
- **MongoDB**
- **Git**

For hardware development:

- ESP32 development environment
- Required sensor libraries
- USB connection/programmer for the ESP32
- Appropriate sensor modules

---

# 1. Clone the Repository

```bash
git clone https://github.com/SWAGAT10241/Smart-Wearable.git
cd Smart-Wearable
```

---

# 2. Start MongoDB

TrailGuard requires MongoDB for persistent application data.

You can use:

- Local MongoDB
- MongoDB Atlas
- Another compatible MongoDB deployment

Example local database:

```text
mongodb://localhost:27017/trailguard
```

---

# 3. Configure the Backend

Open a terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

or:

```bash
pnpm install
```

Create the environment file:

```bash
cp .env.example .env
```

Configure the required environment variables.

Example:

```env
# Server
PORT=3000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/trailguard

# Authentication
JWT_SECRET=replace_with_a_long_random_string
SESSION_SECRET=replace_with_another_long_random_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Optional Twilio SMS
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Device Authentication
DEVICE_AUTH_ENABLED=true
DEVICE_MAX_CLOCK_SKEW_SECONDS=300

# Development Simulator
DEVICE_ID=TRAILGUARD-DEMO-001
DEVICE_KEY=test-device-secret-001
```

> Make sure the backend port matches the port configured in the frontend environment variables.

---

# 4. Start the Backend

For development:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

WebSocket:

```text
ws://localhost:3000/live
```

For production:

```bash
npm start
```

---

# 5. Configure the Frontend

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

---

# 6. Start the Frontend

Run:

```bash
pnpm run dev
```

Vite will provide the local development URL, normally:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

---

# 7. Run the ESP32 Simulator

TrailGuard includes a simulator for testing the software stack without physical hardware.

From the backend directory:

```bash
cd backend
npm run simulate
```

The simulator generates wearable telemetry and sends it to the backend.

The complete simulation flow is:

```text
ESP32 Simulator
      │
      ▼
POST /api/device/readings
      │
      ▼
Express Backend
      │
      ├── MongoDB
      │
      └── WebSocket /live
               │
               ▼
        React Dashboard
```

The simulator is useful for testing:

- Heart rate
- SpO₂
- Temperature
- Humidity
- Pressure
- GPS
- Fall detection
- Real-time dashboard updates

---

# API Overview

All backend APIs are mounted under:

```text
/api
```

| Category            | Base Route              | Purpose                                |
| ------------------- | ----------------------- | -------------------------------------- |
| Authentication      | `/api/auth`             | Registration, login, OAuth and profile |
| Device Registration | `/api/devices/register` | Pair a wearable                        |
| Device Management   | `/api/devices`          | Manage paired devices                  |
| Device Telemetry    | `/api/device`           | Receive wearable telemetry             |
| Vitals              | `/api/vitals`           | Heart rate and SpO₂                    |
| Environment         | `/api/environment`      | Temperature, humidity and pressure     |
| Location            | `/api/location`         | GPS data and history                   |
| Falls               | `/api/falls`            | Fall events and status                 |

Detailed API documentation is available in:

```text
backend/README.md
```

---

# WebSocket

TrailGuard provides a real-time WebSocket endpoint:

```text
ws://localhost:3000/live
```

The dashboard uses the WebSocket connection to receive live events.

Supported event types include:

```text
vitals
environment
location
fall_detected
fall_status_update
```

Example event structure:

```json
{
  "type": "vitals",
  "deviceId": "TRAILGUARD-001",
  "data": {}
}
```

Fall event:

```json
{
  "type": "fall_detected",
  "deviceId": "TRAILGUARD-001",
  "data": {}
}
```

---

# Frontend Application

The current frontend includes the following primary application routes:

| Page             | Route               | Purpose                     |
| ---------------- | ------------------- | --------------------------- |
| Login            | `/login`            | User authentication         |
| Register         | `/register`         | Account creation            |
| OAuth Success    | `/oauth-success`    | Google OAuth handling       |
| Complete Profile | `/complete-profile` | Profile completion          |
| Dashboard        | `/dashboard`        | Live monitoring             |
| History          | `/history`          | Historical data             |
| Settings         | `/settings`         | Profile and safety settings |

The fall/SOS interface is presented through the dashboard alert workflow rather than as a separate primary route.

Detailed frontend documentation is available in:

```text
frontend/README.md
```

---

# Device Management

TrailGuard identifies physical wearables using a `deviceId`.

The device-management system supports:

- Device registration
- Device pairing
- Device ownership
- Device listing
- Device renaming
- Device activation/deactivation
- Device disconnection
- Device-specific telemetry

Conceptually:

```text
User
 │
 ├── Device 1
 │      ├── Vitals
 │      ├── Environment
 │      ├── Location
 │      └── Falls
 │
 └── Device 2
        ├── Vitals
        ├── Environment
        ├── Location
        └── Falls
```

Historical telemetry is not automatically removed when a device is disconnected.

---

# Database

MongoDB is used for persistent application data.

The current backend contains the following primary models:

```text
User
Device
VitalsReading
EnvironmentReading
LocationReading
FallEvent
PhoneOtp
```

The conceptual relationship is:

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
 └── Profile / Emergency Information
```

---

# Security

TrailGuard implements multiple security mechanisms.

## Authentication

Protected APIs use JWT-based authentication.

```http
Authorization: Bearer <JWT>
```

---

## Password Security

Local account passwords are protected using:

```text
bcrypt
```

---

## HTTP Security

The backend uses Helmet to provide security-related HTTP headers.

---

## CORS

Frontend/backend communication is controlled through the configured:

```env
CLIENT_URL
```

---

## Rate Limiting

Authentication-related endpoints use rate limiting to reduce the risk of brute-force attacks.

---

## Device Ownership

Device and telemetry operations are associated with registered device ownership.

The backend validates the device before processing telemetry.

---

## Request Protection

JSON request payloads are restricted to an appropriate request size to reduce unnecessary resource consumption.

---

## Environment Secrets

Sensitive configuration must be provided through environment variables.

Never commit:

```text
.env
```

files containing real credentials.

Never expose:

- JWT secrets
- Session secrets
- Google OAuth credentials
- MongoDB credentials
- Twilio credentials
- Production device credentials

---

# Device Authentication

The backend supports device authentication configuration through:

```env
DEVICE_AUTH_ENABLED=true
DEVICE_MAX_CLOCK_SKEW_SECONDS=300
```

A physical wearable is identified using its `deviceId`.

The backend validates the registered device before accepting telemetry.

Production device credentials should never be committed to source control.

---

# Emergency SMS with Twilio

TrailGuard includes optional Twilio integration for emergency SMS functionality.

Configure:

```env
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

Twilio is optional during local development.

The application can be developed and tested using the dashboard and ESP32 simulator without configuring Twilio.

---

# Testing

TrailGuard includes automated tests for both backend and frontend components.

## Backend Testing

The backend uses:

- Jest
- Supertest

Run:

```bash
cd backend
npm test
```

---

## Frontend Testing

The frontend uses:

- Vitest
- Testing Library
- JSDOM

Run the interactive test command:

```bash
cd frontend
pnpm test
```

Run the test suite once:

```bash
pnpm test:run
```

---

# Production Build

## Backend

Configure production environment variables and run:

```bash
cd backend
npm start
```

---

## Frontend

Build the production application:

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

The frontend includes Vercel configuration:

```text
frontend/vercel.json
```

For deployment, configure the production environment variables for the frontend:

```env
VITE_API_URL=<production-api-url>
VITE_WS_URL=<production-websocket-url>
```

The backend must also be configured with its production environment variables, including:

```env
PORT=
CLIENT_URL=
MONGODB_URI=
JWT_SECRET=
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```

Optional services such as Twilio should only be configured when required.

---

# Development Workflow

A typical development workflow is:

```text
1. Start MongoDB
        │
        ▼
2. Start Backend
   npm run dev
        │
        ▼
3. Start Frontend
   pnpm run dev
        │
        ▼
4. Start ESP32 / Simulator
   npm run simulate
        │
        ▼
5. Open Dashboard
        │
        ▼
6. Monitor live telemetry
```

For hardware development:

```text
ESP32
 │
 ├── Connect sensors
 ├── Collect readings
 ├── Connect to Wi-Fi
 ├── Send telemetry
 └── Receive backend response
          │
          ▼
      TrailGuard API
```

---

# Hardware Development

The hardware portion of the repository is located at:

```text
hardware/
```

Current hardware organization includes:

```text
hardware/
├── Drivers/
└── Test/
```

The hardware layer can be expanded independently from the backend and frontend.

This separation allows sensor drivers and hardware tests to evolve without changing the dashboard architecture.

---

# Repository Documentation

Detailed documentation is maintained inside each major component.

### Root Documentation

```text
README.md
```

High-level project architecture, setup, and system overview.

### Backend Documentation

```text
backend/README.md
```

Backend API, authentication, telemetry, database models, WebSocket behavior, device management, and backend development.

### Frontend Documentation

```text
frontend/README.md
```

Frontend architecture, components, pages, API integration, real-time data handling, UI design, testing, and deployment.

---

# Future Development

Potential future improvements include:

- Improved wearable enclosure design
- Battery monitoring and optimization
- Low-power ESP32 operation
- Improved fall-detection algorithms
- Sensor calibration
- More accurate GPS handling
- Offline telemetry buffering
- Automatic emergency escalation
- SMS and notification improvements
- Mobile application support
- Advanced health analytics
- More detailed activity monitoring
- Cloud deployment
- Production monitoring and logging
- Additional hardware validation

---

# Contributing

Contributions and improvements are welcome.

A typical contribution workflow:

```bash
git checkout -b feature/your-feature
```

Make your changes and test them:

```bash
cd backend
npm test
```

and:

```bash
cd frontend
pnpm test:run
pnpm run build
```

Then commit:

```bash
git add .
git commit -m "feat: describe your change"
```

Push your branch:

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# License

This project is distributed under the license included in:

```text
LICENSE
```

---

# TrailGuard at a Glance

```text
                         TRAILGUARD
                             │
             ┌───────────────┼───────────────┐
             │               │               │
             ▼               ▼               ▼
          HARDWARE         BACKEND        FRONTEND
             │               │               │
           ESP32          Express          React
          Sensors         MongoDB           Vite
            GPS          WebSocket        MapLibre
             │               │               │
             └───────┬───────┴───────┬───────┘
                     │               │
                     ▼               ▼
              Sensor Data       Live Monitoring
                     │               │
                     ▼               ▼
               Historical        Dashboard
                  Data             Alerts
                     │               │
                     └───────┬───────┘
                             ▼
                     SAFER SMART WEARABLE
```

<p align="center">
  <strong>TrailGuard — Monitor. Detect. Locate. Protect.</strong>
</p>
