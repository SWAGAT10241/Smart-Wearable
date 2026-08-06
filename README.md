# TrailGuard Backend

Backend server for **TrailGuard** — a smart wearable safety and health monitoring system for hikers. Built with Node.js, Express, MongoDB, and WebSocket for real-time telemetry from an ESP32 wearable.

## Tech stack

- Node.js + Express — REST API
- MongoDB + Mongoose — data storage
- WebSocket (`ws`) — real-time push to dashboard
- Passport.js — Google OAuth login
- JWT + bcrypt — local auth

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your own values:

- `MONGODB_URI` — local MongoDB, MongoDB Atlas, or IBM Cloud Databases for MongoDB
- `JWT_SECRET` / `SESSION_SECRET` — any long random strings
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console

Then run:

```bash
npm run dev
```

Server starts on `http://localhost:5000`. WebSocket live channel is at `ws://localhost:5000/live`.

## Demo without hardware

```bash
npm run simulate
```

Posts fake sensor data every few seconds so the dashboard can be tested without a physical ESP32.

## API overview

| Category                      | Base route         |
| ----------------------------- | ------------------ |
| Auth                          | `/api/auth`        |
| Vitals (heart rate + SpO2)    | `/api/vitals`      |
| Fall detection                | `/api/falls`       |
| Environment (temp + humidity) | `/api/environment` |
| GPS location                  | `/api/location`    |

## Folder structure

```
backend/
  config/       # DB connection, Passport strategy
  models/       # Mongoose schemas
  routes/       # Express route handlers
  middleware/   # JWT auth middleware
  server.js     # entry point
```

## Project context

Capstone project — TrailGuard: Smart Wearable Safety and Health Monitoring System for Hikers and Outdoor Adventurers.
