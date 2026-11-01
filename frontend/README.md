# 🖥️ TrailGuard Rescue Web Dashboard

> React 19 / Vite 6 monitoring and rescue dashboard providing real-time MapLibre GL mapping, SVG telemetry traces, and single-use WebSocket emergency coordination for TrailGuard.

---

## ⚡ Key Capabilities

- **Interactive Geospatial Tracking:** Real-time MapLibre GL coordinate plotting with live location markers and trace trails.
- **Modular Telemetry Traces:** Decoupled SVG chart primitives with automatic dynamic scaling and hover tooltips:
  - `LineTrace.jsx`: Continuous heart rate ($SpO_2$) and barometric pressure curves.
  - `BarTrace.jsx`: Humidity distribution and environmental ranges.
  - `GaugeBar.jsx`: Blood oxygen ($SpO_2$) linear gauge with safety thresholds.
  - `TemperatureGauge.jsx`: Thermal spectrum gradient gauge.
  - `MiniStats.jsx`: Compact min/avg/max telemetry metrics.
- **Web Bluetooth (BLE) Diagnostics:** Direct browser-to-wearable diagnostic pairing via Web Bluetooth API.
- **Secure Real-Time Feed:** Consumes single-use tickets from `POST /api/emergency/ws-ticket` to establish session-scoped WebSocket feeds over `/live`.

---

## 📂 Subsystem Structure

```text
frontend/
├── src/
│   ├── assets/              # Images and global styles
│   ├── components/
│   │   ├── app/             # Application shell, navigation, & layout
│   │   ├── auth/            # AuthCard, PhoneField, login/register forms
│   │   ├── charts/          # Modular SVG trace charts (LineTrace, GaugeBar, etc.)
│   │   ├── common/          # MiniStats, LoadingSpinner, ErrorBoundary
│   │   ├── dashboard/       # Metric cards & recent event timelines
│   │   └── devices/         # Device inventory & pairing panels
│   ├── context/             # React Contexts (AuthContext, DeviceContext, LiveDataContext)
│   ├── hooks/               # Custom hooks (useDashboardData, useUpdatedTime)
│   ├── lib/                 # REST apiClient, Web BLE clients, protocol decoders
│   ├── pages/               # Route views (Dashboard, History, LiveMap, Settings)
│   └── utils/               # Formatting, normalization, and metrics calculation
├── test/                    # Vitest & React Testing Library test suites
├── vite.config.js           # Vite 6 configuration with Rollup optimizations
└── package.json
```

---

## 🔐 Environment Configuration

Create a local `frontend/.env` file from `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/live
```

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend REST API base URL | `http://localhost:3000/api` |
| `VITE_WS_URL` | Backend session-scoped WebSocket endpoint | `ws://localhost:3000/live` |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
corepack enable
pnpm install
```

### 2. Start Development Server
```bash
pnpm dev
```
The application will be accessible at `http://localhost:5173`.

### 3. Build for Production
```bash
pnpm build
```
Generates production-optimized static assets in `dist/`.

---

## 🧪 Testing

```bash
# Run Vitest test suites
pnpm run test:run

# Run Vitest with live file watcher
pnpm run test:watch
```

> 📖 **Architecture & UI Specifications:** Refer to the [Official System Architecture Wiki](https://github.com/SWAGAT10241/Smart-Wearable/wiki/02---System-Architecture) and [Frontend Component Organization Guide](../docs/architecture/CODEBASE_ORGANIZATION.md).
