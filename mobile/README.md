# 📱 TrailGuard Mobile Companion

> Cross-platform React Native / Expo 57 companion application for hikers and field workers. Provides local-first telemetry buffering, on-device edge risk detection, authenticated BLE device pairing, and emergency incident reporting.

---

## ⚡ Core Architecture

- **Local-First Privacy:** Continuous vitals and location samples are stored in an encrypted local rolling 7-day SQLite buffer. Normal health telemetry is never uploaded to the cloud.
- **On-Device Edge Risk Engine:** Analyzes acceleration spikes, heart rate variance, and immobility to detect falls locally without network latency.
- **Authenticated Hardware Link:** Pairs with the ESP32-S3 wearable over BLE using LE Secure Connections (ECDH P-256).
- **Emergency Incident Dispatch:** Transmits emergency packages to the cloud backend only upon confirmed SOS or uncancelled fall countdowns.

---

## 📂 Subsystem Structure

```text
mobile/
├── App.js                     # Root entry component
├── app.json                   # Expo 57 project configuration
├── src/
│   ├── components/            # Reusable mobile UI cards, modals, and tab bars
│   ├── context/               # AuthContext, DeviceContext, LiveDataContext
│   ├── hooks/                 # Screen domain hooks (useDashboardData, useHistoryData)
│   ├── lib/                   # Hardened apiClient, secure storage, and profile helpers
│   ├── navigation/            # AppNavigator & bottom tab navigation
│   ├── screens/               # Declarative UI screens (Dashboard, LiveMap, Alerts, etc.)
│   ├── theme/                 # Design tokens, palette, and typography
│   └── utils/                 # Standardized ApiError and data formatters
├── scripts/                   # check-syntax.js and CI validation helpers
└── package.json
```

---

## 🔐 Environment Configuration

Create a local `mobile/.env` file from `.env.example`:

```env
EXPO_PUBLIC_API_URL=http://YOUR-HOST-IP:3000/api
EXPO_PUBLIC_WS_URL=ws://YOUR-HOST-IP:3000/live
```

> **Note:** For physical devices, replace `YOUR-HOST-IP` with your development computer's LAN IP or hostname (e.g. `192.168.1.15`).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd mobile
corepack enable
pnpm install --frozen-lockfile
```

### 2. Start Expo Development Server
```bash
pnpm exec expo start -c
```
Scan the QR code using **Expo Go** on Android or the Camera app on iOS.

---

## 🧪 Verification & CI Checks

```bash
# 1. Validate JS syntax and imports across all mobile files
node scripts/check-syntax.js

# 2. Validate Expo dependencies and project configuration
npx expo-doctor

# 3. Validate production bundle export
npx expo export -p android --no-bytecode
```

> 📖 **Specifications:** Consult the [Official System Architecture Wiki](https://github.com/SWAGAT10241/Smart-Wearable/wiki/02---System-Architecture) and [Privacy & Governance Wiki](https://github.com/SWAGAT10241/Smart-Wearable/wiki/16---Privacy-&-Data-Governance).
