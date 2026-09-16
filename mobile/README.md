# TrailGuard Mobile (Expo)

Cross-platform (iOS/Android) client reusing the existing `backend/` REST API.

## Setup
```bash
cd mobile
npm install
```

Edit `app.json` → `expo.extra`:
- `apiUrl`: your backend's LAN IP, e.g. `http://192.168.1.20:3000/api` (not `localhost` — a phone/simulator can't reach your laptop's localhost)
- `wsUrl`: same host, e.g. `ws://192.168.1.20:3000/live`

## Run
```bash
npm start
```
Scan the QR with Expo Go (iOS/Android) or press `i`/`a` for a simulator.

## What's included
- JWT auth (login/register) using `expo-secure-store` instead of `localStorage`
- Dashboard: latest vitals, environment, location, fall status (pulls the user's first active device)
- Same API contract as `frontend/` (`lib/apiClient.js` mirrors the web client)

## Not yet ported
- Live WebSocket updates (`ws` connects fine in RN but isn't wired into the dashboard yet)
- Complete-profile flow, Settings, History, device pairing UI, map
- Push notifications for fall/SOS alerts
