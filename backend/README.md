# TrailGuard Backend

Backend service for **TrailGuard — Smart Wearable Safety and Health Monitoring System**.

The backend provides the API and real-time communication layer between the TrailGuard wearable device, the web dashboard, and the MongoDB database.

It handles:

- User registration and authentication
- Google OAuth authentication
- JWT-based authorization
- TrailGuard wearable registration and management
- Real-time wearable telemetry ingestion
- Heart-rate and SpO₂ monitoring
- Environmental monitoring
- GPS location tracking
- Fall-event detection and management
- Real-time WebSocket updates
- Emergency alert integration through Twilio
- Device simulation for development without physical hardware
- Automated backend tests

---

## Architecture

```text
                    ┌─────────────────────┐
                    │   TrailGuard Web    │
                    │      Dashboard      │
                    └──────────┬──────────┘
                               │
                         REST API / JWT
                               │
                               ▼
┌─────────────────┐     ┌─────────────────────┐
│ TrailGuard      │────▶│     Node.js /       │
│ ESP32 Wearable  │     │       Express       │
└─────────────────┘     │       Backend       │
        │               └──────────┬──────────┘
        │                          │
        │ Telemetry                │
        │                          ├──────────────▶ MongoDB
        │                          │
        │                          ├──────────────▶ WebSocket
        │                          │                    │
        │                          │                    ▼
        │                          │              Live Dashboard
        │                          │
        │                          └──────────────▶ Twilio
        │                                               │
        │                                               ▼
        │                                         SMS Alerts
```

The wearable sends telemetry to the backend using the device API. The backend associates the physical device with its registered user, stores the readings in MongoDB, and broadcasts relevant events to connected dashboard clients through WebSocket.

---

## Technology Stack

| Technology             | Purpose                           |
| ---------------------- | --------------------------------- |
| **Node.js**            | Backend runtime                   |
| **Express.js**         | REST API framework                |
| **MongoDB**            | Database                          |
| **Mongoose**           | MongoDB ODM                       |
| **WebSocket (`ws`)**   | Real-time dashboard communication |
| **JWT**                | API authentication                |
| **bcrypt**             | Password hashing                  |
| **Passport.js**        | Authentication middleware         |
| **Google OAuth 2.0**   | Google sign-in                    |
| **Express Session**    | OAuth/session support             |
| **Connect Mongo**      | MongoDB-backed sessions           |
| **Helmet**             | HTTP security headers             |
| **CORS**               | Frontend/backend communication    |
| **express-rate-limit** | Authentication rate limiting      |
| **Twilio**             | Optional emergency SMS alerts     |
| **Jest**               | Automated testing                 |
| **Supertest**          | HTTP API testing                  |
| **Nodemon**            | Development server                |

The backend requires **Node.js 18 or newer**.

---

# Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/SWAGAT10241/Smart-Wearable.git
cd Smart-Wearable/backend
```

## 2. Install dependencies

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

The project currently includes a `pnpm-lock.yaml` and workspace configuration.

---

## 3. Configure environment variables

Create your local environment file:

```bash
cp .env.example .env
```

Then configure the required values.

### Environment configuration

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

# Optional Twilio SMS alerts
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Device authentication
DEVICE_AUTH_ENABLED=true
DEVICE_MAX_CLOCK_SKEW_SECONDS=300

# Development / simulator device
DEVICE_ID=TRAILGUARD-DEMO-001
DEVICE_KEY=test-device-secret-001
```

These variables correspond to the current backend `.env.example`.

> **Security:** Never commit your real `.env` file, JWT secrets, Google credentials, MongoDB credentials, or Twilio credentials.

---

# Running the Backend

## Development

```bash
npm run dev
```

This starts the backend using Nodemon.

## Production

```bash
npm start
```

The server uses:

```text
http://localhost:3000
```

by default.

The port can be changed through the `PORT` environment variable.

---

# WebSocket

TrailGuard exposes a WebSocket channel at:

```text
ws://localhost:3000/live
```

Connected dashboard clients receive real-time events from the backend.

The backend broadcasts events including:

```text
vitals
environment
location
fall_detected
fall_status_update
```

This allows the dashboard to update without repeatedly polling the REST API.

---

# API Overview

All API routes are mounted under `/api`.

| Category            | Base Route              | Purpose                                                         |
| ------------------- | ----------------------- | --------------------------------------------------------------- |
| Authentication      | `/api/auth`             | Registration, login, Google OAuth and user profile              |
| Device Registration | `/api/devices/register` | Pair a wearable with an account                                 |
| Device Management   | `/api/devices`          | List, rename, activate/deactivate and disconnect devices        |
| Device Telemetry    | `/api/device`           | Device registration, telemetry ingestion and device information |
| Vitals              | `/api/vitals`           | Heart-rate and SpO₂ data                                        |
| Falls               | `/api/falls`            | Fall events and fall status                                     |
| Environment         | `/api/environment`      | Temperature, humidity and pressure                              |
| Location            | `/api/location`         | GPS location and history                                        |

---

# Authentication API

## Register

```http
POST /api/auth/register
```

Creates a local user account.

Required information includes:

- Username
- Password
- Email
- Phone number
- Emergency contact name
- Emergency contact phone
- Height
- Weight

A JWT is returned after successful registration.

---

## Login

```http
POST /api/auth/login
```

Authenticates a local user using email and password.

Response contains a JWT that should be supplied to protected API endpoints.

Example:

```http
Authorization: Bearer <JWT>
```

---

## Google OAuth

Start authentication:

```http
GET /api/auth/google
```

Google redirects back to:

```http
GET /api/auth/google/callback
```

After successful authentication, the backend redirects the user to the configured frontend.

---

## Get Current User

```http
GET /api/auth/me
```

Requires JWT authentication.

---

## Complete Profile

```http
PATCH /api/auth/complete-profile
```

Used to complete profile information for accounts that require additional details after authentication.

The current authentication implementation signs JWTs with a 30-day expiration.

---

# Device Management

TrailGuard uses a physical `deviceId` to identify each wearable.

Device ownership is associated with the authenticated user in the database.

## Register a Device

```http
POST /api/devices/register
```

Example request:

```json
{
  "deviceId": "TRAILGUARD-001",
  "deviceName": "My TrailGuard"
}
```

A device cannot be registered to multiple users.

---

## List User Devices

```http
GET /api/devices
```

Returns devices belonging to the authenticated user.

---

## Rename Device

```http
PATCH /api/devices/:deviceId
```

Example:

```json
{
  "deviceName": "TrailGuard Backpack"
}
```

Device names are limited to 50 characters.

---

## Update Device Status

```http
PATCH /api/devices/:deviceId/status
```

Supported states:

```text
active
inactive
```

Example:

```json
{
  "status": "inactive"
}
```

---

## Disconnect Device

```http
DELETE /api/devices/:deviceId
```

Disconnecting a device does not require deleting its historical telemetry.

---

# Wearable Telemetry API

The physical wearable sends sensor data through:

```http
POST /api/device/readings
```

The backend identifies the physical device using `deviceId`.

The device does **not** provide the user's `userId`. The backend obtains ownership information from the registered device record.

---

## Telemetry Payload

The backend can process the following types of data:

### Vitals

```json
{
  "heartRate": 78,
  "spo2": 98
}
```

Optional IR samples can also be included:

```json
{
  "irSamples": [1234, 1250, 1271]
}
```

Heart rate and SpO₂ are stored as a vitals reading.

---

### Environment

```json
{
  "temperature": 27.4,
  "humidity": 65.2,
  "pressure": 1008.4
}
```

The backend stores temperature, humidity and optional pressure measurements.

---

### GPS

```json
{
  "latitude": 20.2961,
  "longitude": 85.8245,
  "altitude": 42,
  "satellites": 8
}
```

Location data can also include a `locationStale` indicator.

---

### Fall Detection

Example:

```json
{
  "fallDetected": true,
  "accelX": 0.31,
  "accelY": -0.82,
  "accelZ": 2.14,
  "tiltAngle": 71,
  "totalAcceleration": 2.31,
  "peakAccelG": 2.31,
  "peakGyroDps": 184.5,
  "postureChangeDeg": 68,
  "severity": "moderate"
}
```

When `fallDetected` is `true`, the backend creates a fall event and broadcasts it to connected WebSocket clients.

---

## Timestamp Handling

Telemetry may contain a timestamp:

```json
{
  "timestamp": "2026-09-08T12:00:00.000Z"
}
```

If no timestamp is provided, the backend uses the current server time.

Invalid timestamps are rejected.

---

# Vitals API

All vitals endpoints require authentication.

## Latest Reading

```http
GET /api/vitals/latest?deviceId=TRAILGUARD-001
```

Returns the latest heart-rate and SpO₂ reading for the selected device.

---

## Historical Readings

```http
GET /api/vitals/history?deviceId=TRAILGUARD-001&hours=24
```

Returns readings from the requested time window.

---

## Statistics

```http
GET /api/vitals/stats?deviceId=TRAILGUARD-001&hours=24
```

Returns:

- Minimum heart rate
- Average heart rate
- Maximum heart rate
- Minimum SpO₂
- Average SpO₂
- Maximum SpO₂
- Number of readings

The default time window is one hour.

---

# Environment API

All environment endpoints require authentication.

## Latest Reading

```http
GET /api/environment/latest?deviceId=TRAILGUARD-001
```

---

## Historical Readings

```http
GET /api/environment/history?deviceId=TRAILGUARD-001&hours=24
```

---

## Statistics

```http
GET /api/environment/stats?deviceId=TRAILGUARD-001&hours=24
```

Statistics include:

- Temperature minimum / average / maximum
- Humidity minimum / average / maximum
- Pressure minimum / average / maximum
- Reading count

---

# Location API

## Latest Location

```http
GET /api/location/latest
```

Returns the latest GPS location belonging to the authenticated user.

---

## Location History

```http
GET /api/location/history?hours=24
```

Returns GPS readings from the requested time window.

The default location history window is 24 hours.

---

# Fall Detection API

## List Fall Events

```http
GET /api/falls
```

Returns fall events belonging to the authenticated user.

---

## Latest Fall

```http
GET /api/falls/latest
```

Returns the most recent fall event.

---

## Update Fall Status

```http
PATCH /api/falls/:id
```

Example:

```json
{
  "status": "resolved"
}
```

The updated fall status is also broadcast through WebSocket.

---

# Real-Time Event Flow

When a wearable submits telemetry:

```text
ESP32
  │
  │ POST /api/device/readings
  ▼
Express Backend
  │
  ├── Validate device
  │
  ├── Find device owner
  │
  ├── Store telemetry
  │
  └── Broadcast event
          │
          ▼
      WebSocket
          │
          ▼
     Web Dashboard
```

For example, a new heart-rate reading generates:

```json
{
  "type": "vitals",
  "deviceId": "TRAILGUARD-001",
  "data": {}
}
```

A detected fall generates:

```json
{
  "type": "fall_detected",
  "deviceId": "TRAILGUARD-001",
  "data": {}
}
```

---

# Database Models

The backend currently contains Mongoose models for:

```text
User
Device
VitalsReading
EnvironmentReading
LocationReading
FallEvent
PhoneOtp
```

These models separate user information, wearable ownership and sensor/event history.

---

# Security

The backend includes several security mechanisms:

### JWT Authentication

Protected user APIs use JWT authentication.

### Password Hashing

Local account passwords are handled using `bcrypt`.

### Helmet

HTTP security headers are enabled through Helmet.

### CORS

Frontend access is controlled using the configured:

```env
CLIENT_URL
```

### Authentication Rate Limiting

Login and registration endpoints are rate-limited to help protect against brute-force attempts.

### Ownership Enforcement

Protected device and telemetry-related operations associate data with the authenticated user's device ownership.

### Request Size Limit

JSON request bodies are limited to:

```text
100 KB
```

### Environment Secrets

Secrets and third-party credentials are configured through environment variables rather than source code.

---

# Device Authentication

The backend environment includes device authentication configuration:

```env
DEVICE_AUTH_ENABLED=true
DEVICE_MAX_CLOCK_SKEW_SECONDS=300
```

The device telemetry endpoint identifies the physical wearable through its `deviceId` and verifies that the device exists and is active before processing telemetry.

> Keep device credentials and production secrets outside source control.

---

# Twilio Emergency Alerts

Twilio support is included for optional emergency SMS functionality.

Configure:

```env
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

Twilio configuration is optional for local development and simulation.

---

# ESP32 Simulation

The backend includes a simulator so the dashboard can be tested without the physical TrailGuard hardware.

Run:

```bash
npm run simulate
```

The simulator sends generated wearable telemetry to the backend.

This is useful for testing:

- Heart rate
- SpO₂
- Temperature
- Humidity
- Pressure
- GPS
- Fall detection
- Real-time WebSocket updates

The simulator is implemented in:

```text
backend/simulate-esp32.js
```

---

# Testing

The backend uses Jest and Supertest.

Run the complete test suite:

```bash
npm test
```

The test command runs:

```bash
jest --runInBand
```

Tests are located in:

```text
backend/tests/
```

The current repository includes:

```text
tests/server.test.js
```

---

# Project Structure

```text
backend/
│
├── config/
│   ├── db.js
│   ├── env.js
│   └── passport.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── Device.js
│   ├── EnvironmentReading.js
│   ├── FallEvent.js
│   ├── LocationReading.js
│   ├── PhoneOtp.js
│   ├── User.js
│   └── VitalsReading.js
│
├── routes/
│   ├── authRoutes.js
│   ├── deviceManagementRoutes.js
│   ├── deviceRegistrationRoutes.js
│   ├── deviceRoutes.js
│   ├── environmentRoutes.js
│   ├── fallRoutes.js
│   ├── locationRoutes.js
│   └── vitalsRoutes.js
│
├── tests/
│   └── server.test.js
│
├── .env.example
├── .gitignore
├── app.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── server.js
├── simulate-esp32.js
└── README.md
```

The structure above reflects the current backend repository.

---

# Health Check

The root endpoint can be used to verify that the Express application is running:

```http
GET /
```

Successful response:

```json
{
  "status": "TrailGuard backend running"
}
```

---

# Development Workflow

A typical local development workflow is:

```bash
# 1. Enter backend
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start MongoDB

# 5. Start backend
npm run dev

# 6. Optionally run the wearable simulator
npm run simulate

# 7. Run tests
npm test
```

The frontend can then connect to the backend using the configured `CLIENT_URL` and API port.

---

# Production Considerations

Before deploying TrailGuard to production:

- Use a managed MongoDB deployment or production MongoDB instance.
- Generate strong random values for `JWT_SECRET` and `SESSION_SECRET`.
- Configure production Google OAuth credentials.
- Configure the correct production `CLIENT_URL`.
- Use HTTPS.
- Use `wss://` for WebSocket connections.
- Store secrets in the hosting provider's environment-variable system.
- Configure production Twilio credentials if SMS alerts are enabled.
- Do not use the example device credentials in production.
- Review device authentication before connecting real hardware to a public endpoint.
- Monitor backend logs and database health.
- Run the complete automated test suite before deployment.

---

# Related Components

TrailGuard is organized into three major parts:

```text
Smart-Wearable/
│
├── backend/     # API, database, authentication, telemetry
├── frontend/    # Web dashboard
└── hardware/    # ESP32 / wearable hardware
```

The backend acts as the central service connecting the wearable hardware with the dashboard.

---

# Project

**TrailGuard — Smart Wearable Safety and Health Monitoring System**

Designed for hikers, trekkers, outdoor adventurers, and safety-focused wearable monitoring.

The complete project is available in the repository:

[Smart-Wearable GitHub Repository](https://github.com/SWAGAT10241/Smart-Wearable?utm_source=chatgpt.com)

---

# License

This project is licensed under the **MIT License**.
