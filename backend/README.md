# TrailGuard Backend

Backend API and realtime service for **TrailGuard — Smart Wearable Safety & Health Monitoring System**.

The backend connects the TrailGuard wearable/ESP32 device with the web dashboard and MongoDB. It provides authentication, secure device pairing and management, health telemetry storage, fall-event handling, environmental monitoring, GPS/location history, realtime WebSocket updates, and emergency SMS/WhatsApp notifications.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Backend Structure](#backend-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Backend](#running-the-backend)
- [Health Check](#health-check)
- [Authentication](#authentication)
- [Device Management](#device-management)
- [Telemetry Ingestion](#telemetry-ingestion)
- [Vitals API](#vitals-api)
- [Environment API](#environment-api)
- [Location API](#location-api)
- [Fall Detection API](#fall-detection-api)
- [Realtime WebSocket](#realtime-websocket)
- [Emergency Alerts](#emergency-alerts)
- [Wearable Simulator](#wearable-simulator)
- [Database Models](#database-models)
- [Security](#security)
- [Testing](#testing)
- [Common Development Workflow](#common-development-workflow)
- [Troubleshooting](#troubleshooting)
- [Related Project](#related-project)

---

# Overview

TrailGuard is a smart wearable safety system designed to monitor:

- ❤️ Heart rate
- 🫁 SpO₂ / blood oxygen
- 🌡️ Temperature
- 💧 Humidity
- 🌬️ Atmospheric pressure
- 📍 GPS location
- 🧭 Motion and orientation
- ⚠️ Fall events
- 🚨 Emergency/SOS notifications

The backend receives telemetry from the wearable, associates it with the registered device owner, stores it in MongoDB, and broadcasts important updates to connected dashboard clients.

The backend is implemented using **Node.js + Express + MongoDB/Mongoose** with a native WebSocket server.

---

# Architecture

```text
                         ┌─────────────────────────┐
                         │    TrailGuard Web App    │
                         │       Dashboard          │
                         └────────────┬────────────┘
                                      │
                              REST API + JWT
                                      │
                                      ▼
┌──────────────────┐        ┌─────────────────────────┐
│  TrailGuard      │        │     Node.js Backend     │
│  Wearable /      │───────▶│                         │
│  ESP32           │ REST   │  Express API            │
│                  │        │  Authentication         │
│ Sensors:         │        │  Device Management      │
│ • MAX30100       │        │  Telemetry Processing   │
│ • BME280         │        │  Fall Detection Events  │
│ • NEO-6M         │        │  WebSocket Realtime     │
│ • MPU6050        │        │  Emergency Alerts       │
│ • LoRa           │        └────────────┬────────────┘
└──────────────────┘                     │
                                         │
                    ┌────────────────────┼──────────────────┐
                    │                    │                  │
                    ▼                    ▼                  ▼
             ┌─────────────┐      ┌─────────────┐   ┌─────────────┐
             │   MongoDB   │      │  WebSocket  │   │   Twilio    │
             │             │      │    /live    │   │ SMS/WhatsApp│
             └─────────────┘      └─────────────┘   └─────────────┘
```

---

# Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | Persistent database |
| Mongoose | MongoDB ODM |
| JWT | API authentication |
| bcrypt | Password hashing |
| Passport.js | Google OAuth |
| WebSocket (`ws`) | Realtime dashboard updates |
| Helmet | HTTP security headers |
| CORS | Frontend/backend communication |
| express-rate-limit | Request-rate protection |
| express-session | OAuth/session support |
| connect-mongo | MongoDB-backed sessions |
| Twilio | Emergency SMS and WhatsApp |
| Jest | Automated testing |
| Supertest | HTTP/API testing |
| Nodemon | Development server reload |

The backend currently requires **Node.js 18 or newer** and uses **pnpm 11.20.0** in the repository configuration.

---

# Backend Structure

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
│   ├── DevicePairing.js
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
├── services/
│   ├── deviceProvisioningService.js
│   ├── smsService.js
│   └── whatsappService.js
│
├── scripts/
│   └── provision-device.js
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

---

# Requirements

Install the following before running the backend:

- Node.js `18+`
- pnpm `11+`
- MongoDB
  - Local MongoDB, or
  - MongoDB Atlas, or
  - IBM Cloud Databases for MongoDB
- Git

Optional:

- Google Cloud OAuth credentials
- Twilio account for SMS
- Twilio WhatsApp configuration

---

# Installation

From the repository root:

```bash
cd backend
```

Install dependencies:

```bash
pnpm install
```

Or:

```bash
npm install
```

---

# Environment Configuration

Create a local `.env` file:

```bash
cp .env.example .env
```

The repository provides the following example configuration:

```env
# Server
PORT=3000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/trailguard

# Authentication
JWT_SECRET=replace_this_with_a_long_random_string
SESSION_SECRET=replace_this_with_another_long_random_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Optional Twilio SMS
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Device configuration
DEVICE_AUTH_ENABLED=true
DEVICE_MAX_CLOCK_SKEW_SECONDS=300

# Demo/simulator device
DEVICE_ID=TRAILGUARD-DEMO-001
DEVICE_KEY=test-device-secret-001
```

## Environment Variables

| Variable | Required | Purpose |
|---|---:|---|
| `PORT` | No | Backend HTTP port. Defaults to `3000` |
| `CLIENT_URL` | Yes for CORS/OAuth | Frontend URL |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Signs authentication JWTs |
| `SESSION_SECRET` | Yes | Express session secret |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | Optional | Google OAuth callback URL |
| `SERVER_URL` | Optional | Fallback server URL used by Passport |
| `TWILIO_SID` | Optional | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Optional | Twilio authentication token |
| `TWILIO_PHONE_NUMBER` | Optional | Twilio SMS sender |
| `TWILIO_WHATSAPP_FROM` | Optional | Twilio WhatsApp sender |
| `DEVICE_AUTH_ENABLED` | Present | Device-auth configuration flag |
| `DEVICE_MAX_CLOCK_SKEW_SECONDS` | Present | Device timestamp configuration |
| `DEVICE_ID` | Optional | Simulator device ID |
| `DEVICE_KEY` | Optional | Simulator HMAC key |
| `DEVICE_BASE_URL` | Optional | Simulator API base URL |

### Important

Keep secrets out of Git.

Never commit:

```text
.env
JWT_SECRET
SESSION_SECRET
GOOGLE_CLIENT_SECRET
TWILIO_AUTH_TOKEN
DEVICE_KEY
```

The backend's environment example uses `3000` as the default port. If you configure the backend to another port, update the frontend API/WebSocket URLs accordingly.

---

# Running the Backend

## Development

```bash
pnpm dev
```

This runs:

```bash
nodemon server.js
```

The backend will normally be available at:

```text
http://localhost:3000
```

## Production-style start

```bash
pnpm start
```

This runs:

```bash
node server.js
```

---

# Health Check

The root endpoint provides a simple backend health response.

### Request

```http
GET /
```

### Response

```json
{
  "status": "TrailGuard backend running"
}
```

This is useful for quickly checking whether the backend process is running.

---

# Authentication

Authentication is implemented using:

- Local email/password authentication
- JWT access tokens
- Google OAuth
- bcrypt password hashing

JWT tokens currently expire after **30 days**.

---

## Register

```http
POST /api/auth/register
```

### Request

```json
{
  "username": "Swagat",
  "password": "your-password",
  "email": "user@example.com",
  "phoneNumber": "+919999999999",
  "emergencyContactName": "Emergency Contact",
  "emergencyContactPhone": "+919888888888",
  "height": 175,
  "weight": 70
}
```

### Successful response

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "username": "Swagat",
    "email": "user@example.com",
    "profileComplete": true
  }
}
```

---

## Login

```http
POST /api/auth/login
```

### Request

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

### Response

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "username": "Swagat",
    "email": "user@example.com",
    "profileComplete": true
  }
}
```

---

## Get Current User

```http
GET /api/auth/me
```

Requires:

```http
Authorization: Bearer JWT_TOKEN
```

---

## Complete Google Profile

Google signup initially provides the user's Google identity information. Additional TrailGuard profile information can then be supplied through:

```http
PATCH /api/auth/complete-profile
```

### Required fields

```json
{
  "phoneNumber": "+919999999999",
  "emergencyContactName": "Emergency Contact",
  "emergencyContactPhone": "+919888888888",
  "height": 175,
  "weight": 70
}
```

---

## Google OAuth

Start OAuth:

```http
GET /api/auth/google
```

Callback:

```http
GET /api/auth/google/callback
```

Google OAuth is enabled only when the Google client credentials are configured.

---

# Device Management

TrailGuard uses a permanent UUID `deviceId` to identify each wearable. An ID
alone cannot prove hardware identity or claim ownership. Device identity is
pre-provisioned with an Ed25519 public key and a one-time bootstrap-token hash.
The private key remains on the wearable; the bootstrap token is supplied by a
sealed QR and is never returned by the API.

Device records include:

```text
deviceId
deviceName
state
publicKey
bootstrapTokenHash
bootstrapTokenExpiresAt
userId
status
lastSeen
createdAt
updatedAt
```

Lifecycle states are `UNREGISTERED`, `PROVISIONED`, `PAIRED`, and `REVOKED`.
`publicKey`, `bootstrapTokenHash`, and `bootstrapTokenExpiresAt` are excluded
from normal model selection and API responses. Status remains `active`/`inactive`
for current dashboard compatibility.

### Trusted device provisioning prerequisite

There is intentionally no public device-provisioning API. A trusted operator
uses the backend CLI to create a device record from the device-generated
Ed25519 public key. The device must generate and retain its private key before
this step; the private key must never be copied to the backend.

```powershell
cd backend
corepack pnpm provision-device -- `
  --device-id b3fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a `
  --public-key-file C:\secure-provisioning\device-public.pem `
  --device-name "TrailGuard One" `
  --qr-output C:\secure-provisioning\device-pairing.svg
```

The command requires `DEVICE_PROVISIONING_MONGODB_URI`, loaded from the
operator environment. Use a dedicated MongoDB principal scoped to read and
write only the `devices` collection; do not reuse the backend application's
credential. The command accepts only a UUIDv4 and an Ed25519 SPKI public-key
PEM. It creates a new record with `state: "PROVISIONED"`, `userId: null`,
`status: "inactive"`, and `keyVersion: 1`. The unique device ID is never
overwritten; a duplicate causes an error and requires an explicit operator
investigation.

With `--qr-output`, the CLI creates a new SVG containing the versioned pairing
payload used by the dashboard scanner and prints its path, device ID, and
expiry. The output file must not already exist; protect it as a secret and
transfer it only through the controlled labeling process. The raw token is not
printed in this mode. Without that option, the CLI prints one JSON object with
the device ID, 32-byte random base64url bootstrap token, and its expiry (30
days); handle the token as a secret and do not paste it into tickets, chat,
shell arguments, CI logs, or source control. If output is lost or exposed,
the same command can issue a replacement token only when the record is
`PROVISIONED`, has no owner, the submitted public key matches exactly, and the
prior token is absent or expired. It cannot overwrite an active token or
reprovision a paired/revoked record. A record with a different key or state
fails closed; investigate it rather than modifying it manually. If QR file
creation fails, the device record is not written; if database persistence fails
after file creation, the newly created QR file is removed.

Never store the raw QR token or device private key in the database, repository,
logs, or normal API response. After successful pairing the server atomically
sets `state: "PAIRED"` and the authenticated `userId`, consumes the QR-token
hash and expiry, and activates the record. An unpair returns it to `PROVISIONED` without
restoring a bootstrap token; trusted reprovisioning is required before it can
be paired again.

Existing device records have not been auto-migrated or trusted. Review them
before deployment; do not mark an existing user-claimed ID as `PROVISIONED`
without verifying physical-device key custody.

### Secure pairing API

ID-only registration is disabled at both legacy paths:

```http
POST /api/device/register       -> 410 Gone
POST /api/devices/register      -> 410 Gone
```

The user must be authenticated. Pairing start requires the device UUID and
one-time bootstrap token:

```http
POST /api/devices/pairing-challenges
Authorization: Bearer <user access token>
Content-Type: application/json
```

```json
{
  "deviceId": "b3fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a",
  "bootstrapToken": "<32-byte-random-base64url-token>"
}
```

The backend verifies the token hash against a `PROVISIONED` record and returns
a random 256-bit nonce and a challenge UUID with a five-minute expiry. The
bootstrap QR token itself is valid for 30 days from provisioning. The
wearable must sign UTF-8 bytes of this exact JSON serialization (keys in the
order shown) with its Ed25519 private key:

```json
{
  "challengeId": "<returned challengeId>",
  "deviceId": "<uppercase canonical deviceId>",
  "userId": "<authenticated user's database ID>",
  "nonce": "<returned nonce>",
  "expiresAt": "<returned expiresAt as UTC ISO-8601>"
}
```

The authenticated user submits the device proof:

```http
POST /api/devices/pairing-challenges/{challengeId}/complete
Authorization: Bearer <user access token>
Content-Type: application/json
```

```json
{"nonce":"<returned nonce>","signature":"<Ed25519 signature, base64url>"}
```

The backend verifies the user/device/challenge binding, expiry, nonce hash,
device key and signature, then consumes the challenge and bootstrap token and
atomically claims only a `PROVISIONED`, ownerless device. A challenge permits
at most five invalid signature attempts. Each pairing endpoint is limited to
ten requests per authenticated account in a 15-minute window. Expired
challenges return `410`; invalid proof
returns `401`; ID-only registration returns `410`; stale/already-used
challenges and state races return `404` or `409` without assigning ownership.
The Settings page scans the sealed QR with the camera and uses Web Bluetooth
to read the device identity, send the authenticated user's challenge, collect
the Ed25519 proof, and complete pairing. This browser flow requires a secure
origin and a supported Chromium browser. It has not been validated against a
physical ESP32-S3; the current firmware slice does not yet provide encrypted
BLE bonding.
The pairing update uses a MongoDB transaction; deployments must use a
transaction-capable replica set or sharded cluster.

---

## List User Devices

```http
GET /api/devices
```

Authentication required.

Returns only devices belonging to the authenticated user.

---

## Rename Device

```http
PATCH /api/devices/:deviceId
```

### Request

```json
{
  "deviceName": "My TrailGuard"
}
```

Device names are limited to 50 characters.

---

## Change Device Status

```http
PATCH /api/devices/:deviceId/status
```

### Request

```json
{
  "status": "active"
}
```

Allowed values:

```text
active
inactive
```

---

## Disconnect/Unpair Device

```http
DELETE /api/devices/:deviceId
```

The current implementation unpairs the device while preserving the device record and historical telemetry.

---

## Get Individual Device

```http
GET /api/device/:deviceId
```

Authentication required.

Only the owner can access the device.

---

# Telemetry Ingestion

The wearable sends telemetry to:

```http
POST /api/device/readings
```

Unlike dashboard data endpoints, this endpoint does not require a user JWT. The physical device identifies itself using `deviceId`, and the backend resolves the associated user from the registered device.

The backend accepts multiple telemetry categories in a single packet.

---

## Telemetry Fields

### Device

```json
{
  "deviceId": "TRAILGUARD-DEMO-001"
}
```

### Vitals

```json
{
  "heartRate": 78,
  "spo2": 98,
  "irSamples": [50000, 50120, 50300]
}
```

### Environment

```json
{
  "temperature": 21.5,
  "humidity": 52,
  "pressure": 1013.2
}
```

### GPS

```json
{
  "latitude": 20.2961,
  "longitude": 85.8245,
  "altitude": 600,
  "satellites": 9,
  "locationStale": false
}
```

### Motion

```json
{
  "accelX": 0.02,
  "accelY": -0.03,
  "accelZ": 1.01,
  "gyroX": 1.2,
  "gyroY": -0.8,
  "gyroZ": 0.4,
  "tiltAngle": 7,
  "totalAcceleration": 1.01
}
```

### Fall

```json
{
  "fallDetected": true,
  "accelX": 1.2,
  "accelY": -1.5,
  "accelZ": 2.1,
  "tiltAngle": 72,
  "totalAcceleration": 3.8,
  "peakAccelG": 3.9,
  "peakGyroDps": 320,
  "postureChangeDeg": 60,
  "severity": "severe",
  "latitude": 20.2961,
  "longitude": 85.8245
}
```

A timestamp can also be supplied:

```json
{
  "timestamp": 1725000000000
}
```

If no timestamp is supplied, the backend uses the current server time.

---

## Example Complete Telemetry Packet

```json
{
  "deviceId": "TRAILGUARD-DEMO-001",
  "timestamp": 1725000000000,

  "heartRate": 78,
  "spo2": 98,
  "irSamples": [50000, 50120, 50300],

  "temperature": 21.5,
  "humidity": 52,
  "pressure": 1013.2,

  "latitude": 20.2961,
  "longitude": 85.8245,
  "altitude": 600,
  "satellites": 9,
  "locationStale": false,

  "accelX": 0.02,
  "accelY": -0.03,
  "accelZ": 1.01,

  "gyroX": 1.2,
  "gyroY": -0.8,
  "gyroZ": 0.4,

  "tiltAngle": 7,
  "totalAcceleration": 1.01,

  "fallDetected": false
}
```

### Successful response

```json
{
  "success": true,
  "device": {
    "deviceId": "TRAILGUARD-DEMO-001",
    "deviceName": "My TrailGuard",
    "userId": "USER_ID",
    "lastSeen": "2026-09-14T..."
  },
  "saved": {
    "vitals": {},
    "environment": {},
    "location": {}
  }
}
```

Only the telemetry categories actually supplied by the device are stored.

---

# Vitals API

All vitals endpoints require JWT authentication.

Base path:

```text
/api/vitals
```

---

## Latest Vitals

```http
GET /api/vitals/latest?deviceId=TRAILGUARD-DEMO-001
```

Returns the latest heart-rate and SpO₂ reading for the specified device belonging to the logged-in user.

---

## Vitals History

```http
GET /api/vitals/history?deviceId=TRAILGUARD-DEMO-001&hours=24
```

`hours` defaults to:

```text
1
```

Readings are returned in chronological order.

---

## Vitals Statistics

```http
GET /api/vitals/stats?deviceId=TRAILGUARD-DEMO-001&hours=24
```

Returns:

```json
{
  "minHeartRate": 65,
  "averageHeartRate": 78,
  "maxHeartRate": 94,
  "minSpo2": 95,
  "averageSpo2": 98.2,
  "maxSpo2": 100,
  "readingCount": 120
}
```

---

# Environment API

Base path:

```text
/api/environment
```

Authentication required.

---

## Latest Environment

```http
GET /api/environment/latest?deviceId=TRAILGUARD-DEMO-001
```

---

## Environment History

```http
GET /api/environment/history?deviceId=TRAILGUARD-DEMO-001&hours=24
```

`hours` defaults to `1`.

---

## Environment Statistics

```http
GET /api/environment/stats?deviceId=TRAILGUARD-DEMO-001&hours=24
```

Returns minimum, average, and maximum values for:

- Temperature
- Humidity
- Pressure
- Reading count

Example:

```json
{
  "minTemperature": 20.2,
  "averageTemperature": 21.4,
  "maxTemperature": 23.1,

  "minHumidity": 48.1,
  "averageHumidity": 53.2,
  "maxHumidity": 60.4,

  "minPressure": 1010.2,
  "averagePressure": 1013.4,
  "maxPressure": 1016.7,

  "readingCount": 120
}
```

---

# Location API

Base path:

```text
/api/location
```

Authentication required.

---

## Latest Location

```http
GET /api/location/latest
```

Returns the most recent location belonging to the logged-in user.

---

## Location History

```http
GET /api/location/history?hours=24
```

`hours` defaults to `24`.

Location data contains fields such as:

```text
deviceId
userId
latitude
longitude
altitude
satellites
timestamp
```

This data is used by the TrailGuard dashboard to display the user's current/latest position and movement history.

---

# Fall Detection API

Base path:

```text
/api/falls
```

Authentication required.

---

## Get Fall Events

```http
GET /api/falls
```

Returns fall events belonging to the authenticated user, newest first.

---

## Get Latest Fall

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
  "status": "confirmed_false_alarm"
}
```

Supported model statuses are:

```text
detected
confirmed_false_alarm
sos_triggered
resolved
```

The updated fall event is also broadcast to connected WebSocket clients.

---

# Realtime WebSocket

TrailGuard provides a realtime WebSocket channel:

```text
ws://localhost:3000/live
```

The WebSocket server is attached to the same HTTP server as the Express API.

Dashboard clients connect to:

```text
/live
```

The backend broadcasts realtime events when new telemetry or fall information is received.

---

## Vitals Event

```json
{
  "type": "vitals",
  "deviceId": "TRAILGUARD-DEMO-001",
  "data": {}
}
```

---

## Environment Event

```json
{
  "type": "environment",
  "deviceId": "TRAILGUARD-DEMO-001",
  "data": {}
}
```

---

## Location Event

```json
{
  "type": "location",
  "deviceId": "TRAILGUARD-DEMO-001",
  "data": {}
}
```

---

## Fall Detected Event

```json
{
  "type": "fall_detected",
  "deviceId": "TRAILGUARD-DEMO-001",
  "data": {}
}
```

---

## Fall Status Update

```json
{
  "type": "fall_status_update",
  "data": {}
}
```

The dashboard can use these events to update health cards, charts, maps, and emergency notifications without repeatedly polling the REST API.

---

# Emergency Alerts

When a telemetry packet contains:

```json
{
  "fallDetected": true
}
```

the backend creates a `FallEvent`.

If the user's emergency contact phone number exists, the backend attempts to send:

1. Emergency SMS
2. Emergency WhatsApp message

The location is included when latitude and longitude are available.

---

## SMS

SMS uses Twilio.

Configure:

```env
TWILIO_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
```

---

## WhatsApp

WhatsApp also uses Twilio.

In addition to the variables above, configure:

```env
TWILIO_WHATSAPP_FROM=whatsapp:+...
```

The current `.env.example` does not include `TWILIO_WHATSAPP_FROM`, so it must be added manually if WhatsApp alerts are enabled.

---

## Important Alert Behavior

Failure to send an SMS or WhatsApp message does not stop the fall event from being stored.

The backend logs notification failures and continues processing the telemetry.

---

# Wearable Simulator

The backend includes:

```text
simulate-esp32.js
```

The simulator emulates the TrailGuard wearable and generates:

- MAX30100-style heart-rate/SpO₂/PPG data
- BME280 temperature/humidity/pressure data
- NEO-6M GPS data
- MPU6050 motion data
- Fall events
- LoRa connection status

It sends telemetry approximately every **3 seconds**, checks for simulated falls approximately every **60 seconds**, and prints simulated LoRa status periodically.

---

## Start Backend

Terminal 1:

```bash
cd backend
pnpm dev
```

---

## Start Simulator

Terminal 2:

```bash
cd backend
pnpm simulate
```

The simulator uses:

```env
DEVICE_ID=TRAILGUARD-DEMO-001
DEVICE_KEY=test-device-secret-001
```

and by default sends data to:

```text
http://localhost:3000/api/device/readings
```

---

## Custom Simulator Configuration

You can override the device ID:

```bash
DEVICE_ID=TRAILGUARD-DEMO-002 pnpm simulate
```

You can also specify a custom backend URL:

```bash
DEVICE_BASE_URL=http://localhost:3000/api pnpm simulate
```

---

# Device Authentication Status

The simulator currently generates an HMAC-SHA256 signature:

```text
signature
```

using:

```env
DEVICE_KEY
```

The simulator is therefore prepared for authenticated device communication.

However, the current backend telemetry ingestion implementation identifies the device using `deviceId` and checks that the device exists and is active. The current `/api/device/readings` implementation does **not yet verify the generated HMAC signature or timestamp skew**.

Therefore:

> HMAC/device-signature verification should be considered a future hardening step rather than an active security guarantee of the current backend.

---

# Database Models

TrailGuard currently defines the following MongoDB/Mongoose models.

## User

Stores:

- Username
- Email
- Password hash for local accounts
- Authentication provider
- Google ID
- Phone number
- Emergency contact name
- Emergency contact phone
- Height
- Weight
- Profile completion status

Passwords are hashed using bcrypt before being stored.

---

## Device

Stores:

- Permanent `deviceId`
- User-facing `deviceName`
- Owner `userId`
- Active/inactive status
- Last-seen timestamp
- Creation/update timestamps

The physical `deviceId` is unique and immutable.

---

## VitalsReading

Stores:

- Device ID
- User ID
- Heart rate
- SpO₂
- IR samples
- Timestamp

---

## EnvironmentReading

Stores:

- Device ID
- User ID
- Temperature
- Humidity
- Pressure
- Timestamp

---

## LocationReading

Stores:

- Device ID
- User ID
- Latitude
- Longitude
- Altitude
- Satellite count
- Timestamp

---

## FallEvent

Stores:

- Device ID
- User ID
- Accelerometer data
- Tilt angle
- Total acceleration
- Fall severity
- GPS coordinates
- Fall status
- Timestamp

---

## PhoneOtp

The project also contains a `PhoneOtp` model for phone-verification related functionality.

---

# Security

The backend currently implements several security protections.

## JWT Authentication

Protected dashboard/user endpoints use:

```http
Authorization: Bearer <token>
```

JWTs are signed using:

```env
JWT_SECRET
```

and expire after 30 days.

---

## Password Hashing

Local account passwords are hashed using:

```text
bcrypt
```

before being stored.

---

## Ownership Enforcement

User-specific queries use the authenticated user's ID.

For example:

```text
userId = req.userId
```

This prevents one authenticated user from directly accessing another user's device telemetry through the protected endpoints.

---

## Helmet

HTTP security headers are configured using:

```text
helmet
```

---

## CORS

The backend uses the configured:

```env
CLIENT_URL
```

for CORS.

Credentials are enabled for frontend/backend communication.

---

## Authentication Rate Limiting

Login and registration endpoints are rate limited.

Current configuration:

```text
20 requests
per 15 minutes
```

---

## Device Request Rate Limiting

The individual device lookup endpoint is rate limited to:

```text
60 requests
per minute
```

---

## Request Size

JSON request bodies are limited to:

```text
100 KB
```

This keeps telemetry requests intentionally small.

---

# Testing

The backend uses:

- Jest
- Supertest

Test files are located in:

```text
backend/tests/
```

Current test suite:

```text
server.test.js
```

Run:

```bash
pnpm test
```

or:

```bash
npm test
```

The package configuration runs Jest with:

```bash
jest --runInBand
```

---

# Common Development Workflow

## 1. Start MongoDB

For local MongoDB, make sure MongoDB is running.

Example local URI:

```env
MONGODB_URI=mongodb://localhost:27017/trailguard
```

---

## 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Set at minimum:

```env
MONGODB_URI=...
JWT_SECRET=...
SESSION_SECRET=...
CLIENT_URL=...
```

---

## 3. Install Dependencies

```bash
pnpm install
```

---

## 4. Start Backend

```bash
pnpm dev
```

---

## 5. Check Backend

Open:

```text
http://localhost:3000/
```

Expected:

```json
{
  "status": "TrailGuard backend running"
}
```

---

## 6. Start Wearable Simulator

In another terminal:

```bash
pnpm simulate
```

---

## 7. Start Frontend

Run the frontend separately from the `frontend/` directory.

Make sure its API URL points to the backend port configured in `PORT`.

---

# API Summary

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/` | No | Backend health check |
| POST | `/api/auth/register` | No | Create local account |
| POST | `/api/auth/login` | No | Local login |
| GET | `/api/auth/google` | No | Start Google OAuth |
| GET | `/api/auth/google/callback` | OAuth | Google OAuth callback |
| GET | `/api/auth/me` | JWT | Get current user |
| PATCH | `/api/auth/complete-profile` | JWT | Complete profile |
| POST | `/api/devices/pairing-challenges` | JWT + one-time QR token | Start secure device pairing |
| POST | `/api/devices/pairing-challenges/:challengeId/complete` | JWT + device Ed25519 proof | Complete secure device pairing |
| GET | `/api/devices` | JWT | List user's devices |
| PATCH | `/api/devices/:deviceId` | JWT | Rename device |
| PATCH | `/api/devices/:deviceId/status` | JWT | Activate/deactivate |
| DELETE | `/api/devices/:deviceId` | JWT | Unpair device |
| GET | `/api/device/:deviceId` | JWT | Get individual device |
| POST | `/api/device/readings` | Device identity | Receive telemetry |
| GET | `/api/vitals/latest` | JWT | Latest vitals |
| GET | `/api/vitals/history` | JWT | Vitals history |
| GET | `/api/vitals/stats` | JWT | Vitals statistics |
| GET | `/api/environment/latest` | JWT | Latest environment |
| GET | `/api/environment/history` | JWT | Environment history |
| GET | `/api/environment/stats` | JWT | Environment statistics |
| GET | `/api/location/latest` | JWT | Latest location |
| GET | `/api/location/history` | JWT | Location history |
| GET | `/api/falls` | JWT | Fall history |
| GET | `/api/falls/latest` | JWT | Latest fall |
| PATCH | `/api/falls/:id` | JWT | Update fall status |
| WS | `/live` | Connection | Realtime updates |

---

# API Data Flow

The normal TrailGuard flow is:

```text
1. User creates account
        │
        ▼
2. User receives JWT
        │
        ▼
3. User registers TrailGuard wearable
        │
        ▼
4. Device ID is associated with user
        │
        ▼
5. Wearable sends telemetry
        │
        ▼
6. Backend identifies active device
        │
        ▼
7. Backend resolves device → user
        │
        ├───────────────┐
        ▼               ▼
   MongoDB storage   WebSocket broadcast
        │               │
        ▼               ▼
   Dashboard data   Realtime dashboard
        │
        ▼
8. Fall detected
        │
        ├───────────────┐
        ▼               ▼
   FallEvent        Emergency alerts
                     │
                ┌────┴────┐
                ▼         ▼
               SMS     WhatsApp
```

---

# Troubleshooting

## MongoDB connection failed

Check:

```env
MONGODB_URI=...
```

Make sure MongoDB is running and reachable.

---

## Frontend cannot connect

Check that:

```env
CLIENT_URL=http://localhost:5173
```

matches the actual frontend origin.

Also verify that the frontend API URL points to the backend port.

---

## Backend starts on the wrong port

Check:

```env
PORT=3000
```

The server uses:

```javascript
process.env.PORT || 3000
```

---

## Google login does not work

Verify:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

Also make sure the same callback URL is registered in Google Cloud Console.

---

## Device telemetry returns `401`

The backend requires the device to exist and have:

```text
status = active
```

ID-only registration is disabled. A securely paired device record is required.
The current telemetry route still does not verify Ed25519 device signatures,
so it is not a production device-authentication mechanism.

---

## Telemetry is accepted but no dashboard update appears

Check:

```text
ws://localhost:3000/live
```

and make sure the frontend WebSocket client is connected.

---

## SMS/WhatsApp alerts are not sent

Check the Twilio environment variables.

SMS:

```env
TWILIO_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
```

WhatsApp additionally requires:

```env
TWILIO_WHATSAPP_FROM=whatsapp:+...
```

---

# Related Project

TrailGuard consists of multiple components:

```text
Smart-Wearable/
│
├── backend/     ← Node.js API + MongoDB + WebSocket
├── frontend/    ← TrailGuard web dashboard
└── ...
```

The backend is the central communication layer between the wearable hardware, database, realtime dashboard, and emergency notification services.

---

# Development Status

The backend currently provides:

- [x] Node.js/Express API
- [x] MongoDB/Mongoose integration
- [x] Local authentication
- [x] JWT authentication
- [x] Google OAuth
- [x] Password hashing
- [x] User profile management
- [x] Wearable registration
- [x] Device ownership
- [x] Device status management
- [x] Heart-rate storage
- [x] SpO₂ storage
- [x] PPG/IR sample storage
- [x] Environmental telemetry
- [x] GPS/location telemetry
- [x] Fall-event storage
- [x] Fall status updates
- [x] Realtime WebSocket events
- [x] Emergency SMS integration
- [x] Emergency WhatsApp integration
- [x] ESP32/wearable simulator
- [x] Jest/Supertest API tests
- [x] Helmet security headers
- [x] CORS configuration
- [x] Authentication rate limiting
- [x] Device request rate limiting

### Planned/needs further implementation

- [ ] Server-side HMAC verification for device telemetry
- [ ] Device timestamp/replay protection
- [ ] Full device-auth enforcement using `DEVICE_AUTH_ENABLED`
- [ ] Additional API validation and schema hardening
- [ ] Production deployment configuration
- [ ] Expanded automated test coverage

---

# License

This project is part of the **TrailGuard — Smart Wearable Safety & Health Monitoring System** project.

See the repository root for project-level licensing and documentation.