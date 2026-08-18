# TrailGuard

TrailGuard is a smart wearable safety and health monitoring system designed for hikers and outdoor adventurers. It combines wearable sensor hardware, a Node.js backend, and a React dashboard to monitor vital signs, environmental conditions, location, and potential falls in real time.

## Overview

The system collects data from a wearable device and sends it to the backend for processing and storage. The web dashboard displays live health and safety metrics, tracks GPS data, and can raise alerts when a fall or emergency is detected.

## Features

- Real-time heart rate and SpO2 monitoring
- Environmental sensing for temperature and humidity
- GPS location tracking and historical route data
- Fall detection with alarm triggers
- SOS and emergency alert support
- JWT-based authentication with Google OAuth integration
- Live dashboard updates through WebSockets
- Demo mode for simulating sensor input without hardware

## Project Details

TrailGuard is built to improve outdoor safety by continuously monitoring a user’s health and surroundings in environments where quick response matters. The system is designed for hikers, trekkers, and remote travelers who may not have immediate access to medical or emergency support.

The platform combines three connected layers:

- A wearable sensor layer that captures heart rate, oxygen levels, movement, temperature, humidity, and GPS data.
- A backend service that verifies users, stores readings, triggers alerts, and pushes real-time updates to connected clients.
- A web dashboard that visualizes live telemetry, emergency events, and historical trends for monitoring and response.

## System Architecture

The system follows a modular, layered architecture:

1. Sensor Layer (`hardware/`)
   - Reads health and environmental data from connected sensors.
   - Detects abnormal motion and possible falls using onboard logic.
   - Sends collected values to the server for processing and storage.

2. API and Data Layer (`backend/`)
   - Exposes REST endpoints for authentication, sensor data, fall events, and user profile updates.
   - Stores structured data in MongoDB using Mongoose models.
   - Manages JWT authentication and Google OAuth login.
   - Broadcasts live updates through a WebSocket connection for the dashboard.

3. Real-Time Alerting Layer
   - Monitors new sensor data and fall states.
   - Triggers emergency workflows such as SOS notifications and alarm signals.
   - Enables the frontend to respond immediately when a risk condition is detected.

4. User Interface Layer (`frontend/`)
   - Displays live dashboard metrics, location information, and history.
   - Shows fall and SOS alerts in real time.
   - Provides user login, registration, settings, and profile completion flows.

### Data Flow

```text
Wearable sensors --> Hardware firmware --> Backend API/WebSocket --> MongoDB
                                                     |
                                                     v
                                             React dashboard
```

This architecture keeps the hardware lightweight while allowing the backend to centralize validation, persistence, and monitoring logic. The frontend remains separate and can consume live data without directly managing sensor hardware.

## Tech Stack

- Hardware: MicroPython, MAX30100, DHT22, MPU6050, NEO-6M GPS, TFT display
- Backend: Node.js, Express, MongoDB, Mongoose, WebSockets, JWT, Passport.js, Twilio
- Frontend: React, Vite, React Router

## Repository Structure

```text
TrailGuard/
├── backend/          # REST API, database models, auth, and WebSocket server
├── frontend/         # React web dashboard
├── hardware/         # Sensor and wearable device code
├── README.md         # Project documentation
└── .gitignore
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SWAGAT10241/Smart-Wearable.git
cd TrailGuard
```

### 2. Start the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the required values, including:

- `MONGODB_URI`
- `JWT_SECRET`
- `SESSION_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Then run:

```bash
npm run dev
```

The backend runs on `http://localhost:5000` and exposes a live WebSocket at `ws://localhost:5000/live`.

### 3. Start the frontend

```bash
cd ../frontend
pnpm install
```

Create a `.env` file in the `frontend` directory with:

```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/live
```

Then run:

```bash
pnpm run dev
```

The dashboard is available at `http://localhost:5173`.

### 4. Demo mode without hardware

You can simulate wearable data without real devices:

```bash
cd backend
npm run simulate
```

This publishes generated sensor readings so the dashboard can be tested in a live environment.

## Hardware Notes

The `hardware/` directory contains the wearable firmware and test scripts used to read sensor values such as heart rate, blood oxygen, temperature, humidity, GPS coordinates, and acceleration. The firmware also includes fall-detection logic and alert output mechanisms.

## Main Application Flow

1. Wearable sensors collect health and environmental data.
2. Hardware sends data to the backend API or WebSocket stream.
3. The backend stores readings in MongoDB and broadcasts updates.
4. The frontend dashboard displays live telemetry and alert conditions.
5. Users can review history, monitor safety status, and respond to alerts.

## Documentation

For more details on each component, see:

- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for the full license text.

## Project Status

TrailGuard is a full-stack capstone-style project focused on wearable health and safety monitoring for outdoor use. It combines embedded engineering, backend services, and a live web interface into one system.
