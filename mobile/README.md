# 📱 TrailGuard Mobile

The **TrailGuard Mobile App** is a cross-platform Expo/React Native application for hikers and guides. It provides secure authentication, profile management, device connectivity, live telemetry, alerts, history, and location monitoring.

## 🚀 Tech Stack

- **React Native + Expo SDK 57**
- **JavaScript**
- **Expo Router / React Navigation**
- **pnpm**
- **REST API**
- **WebSocket**
- **Secure token storage**

## 📂 Project Structure

```text
mobile/
├── App.js
├── app.json
├── package.json
├── pnpm-lock.yaml
├── .env.example
├── src/
│   ├── components/
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── DeviceContext.js
│   │   └── LiveDataContext.js
│   ├── lib/
│   │   ├── apiClient.js
│   │   ├── profileCompletion.js
│   │   └── storage.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── CompleteProfileScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── AlertsScreen.js
│   │   ├── HistoryScreen.js
│   │   ├── LiveMapScreen.js
│   │   └── SettingsScreen.js
│   └── theme/
│       └── theme.js
└── README.md
```

## 🔐 Environment Configuration

The mobile app uses Expo public environment variables for backend communication.

Create a local `.env` file:

```env
EXPO_PUBLIC_API_URL=http://YOUR-MAC-HOSTNAME.local:3000/api
EXPO_PUBLIC_WS_URL=ws://YOUR-MAC-HOSTNAME.local:3000/live
```

Example:

```env
EXPO_PUBLIC_API_URL=http://your-mac.local:3000/api
EXPO_PUBLIC_WS_URL=ws://your-mac.local:3000/live
```

> **Important:** `.env` is ignored by Git and must never be committed.  
> Use `.env.example` as the configuration template.

After changing environment variables, restart Expo:

```bash
pnpm exec expo start -c
```

## 🔑 Authentication

Authentication is handled through `AuthContext`.

Supported flows:

- User registration
- User login
- Token persistence
- Authenticated API requests
- Current-user retrieval
- Profile completion
- Logout
- Protected navigation

Authentication tokens are attached to API requests using:

```http
Authorization: Bearer <token>
```

The authentication flow is:

```text
Login / Register
       ↓
Receive authentication token
       ↓
Store token locally
       ↓
Load authenticated user
       ↓
Check profile completion
       ↓
Dashboard / Complete Profile
```

## 🛡️ API Client

`src/lib/apiClient.js` provides centralized communication with the TrailGuard backend.

It currently supports:

- Authentication
- User profile
- Device management
- Vitals
- Environment data
- Location
- Fall events
- WebSocket configuration

The API base URL is loaded from:

```text
EXPO_PUBLIC_API_URL
```

The WebSocket endpoint is loaded from:

```text
EXPO_PUBLIC_WS_URL
```

No backend IP address is hardcoded in the application.

## 📱 Running the App

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Run Expo:

```bash
pnpm exec expo start
```

Clear the Metro cache when required:

```bash
pnpm exec expo start -c
```

For development, the iPad/iPhone can connect to the Expo development server through the same network as the development machine.

## 🧪 Health Check

Run Expo's project validation:

```bash
npx expo-doctor
```

The project should pass the Expo dependency and configuration checks before committing changes.

## 🔒 Git & Security

Never commit:

```text
.env
.env.local
node_modules/
.expo/
```

Before committing, verify:

```bash
git status
```

Make sure no real credentials, tokens, private keys, or local environment files are staged.

## 🛠️ Development & CI/CD Workflow

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Validate JS syntax across all mobile files
pnpm run check:syntax

# Validate Expo project health and dependency compatibility
pnpm run doctor

# Validate production bundle export
pnpm run export:check

# Run full project check
pnpm run check

# Start development server
pnpm exec expo start -c
```

Automated validation for the mobile app runs on every push and pull request to `main` via the GitHub Actions [Smart-Wearable CI](.github/workflows/ci.yml) workflow.


## 📌 Current Status

The mobile application currently includes:

- ✅ Cross-platform Expo/React Native structure
- ✅ Authentication and login flow
- ✅ Registration flow
- ✅ Profile completion flow
- ✅ Persistent authentication state
- ✅ Centralized API client
- ✅ Environment-based API configuration
- ✅ WebSocket configuration
- ✅ Device management
- ✅ Dashboard
- ✅ Vitals and environment telemetry
- ✅ Alerts and fall events
- ✅ History
- ✅ Live map
- ✅ Settings

The mobile application is being developed as part of the **TrailGuard / SWAAS smart wearable safety ecosystem**.