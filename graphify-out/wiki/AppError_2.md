# AppError

> 36 nodes

## Key Concepts

- **app.js** (31 connections) — `backend/app.js`
- **socketManager.js** (22 connections) — `backend/realtime/socketManager.js`
- **server.js** (9 connections) — `backend/server.js`
- **backend/config/env.js** (8 connections) — `backend/config/env.js`
- **app** (6 connections) — `backend/app.js`
- **broadcast()** (4 connections) — `backend/realtime/socketManager.js`
- **initWebSocket()** (4 connections) — `backend/realtime/socketManager.js`
- **db.js** (4 connections) — `backend/config/db.js`
- **broadcastTelemetry()** (3 connections) — `backend/realtime/socketManager.js`
- **authorizeSessionSubscription()** (2 connections) — `backend/realtime/socketManager.js`
- **broadcastEmergencyEvent()** (2 connections) — `backend/realtime/socketManager.js`
- **rejectUpgrade()** (2 connections) — `backend/realtime/socketManager.js`
- **sanitizeMessage()** (2 connections) — `backend/realtime/socketManager.js`
- **notFoundHandler.js** (2 connections) — `backend/middleware/notFoundHandler.js`
- **clients** (2 connections) — `backend/realtime/socketManager.js`
- **origin()** (1 connections) — `backend/app.js`
- **connectDB()** (1 connections) — `backend/config/db.js`
- **notFoundHandler()** (1 connections) — `backend/middleware/notFoundHandler.js`
- **http** (1 connections) — `http`
- **cors** (1 connections) — `backend/app.js`
- **express** (1 connections) — `backend/app.js`
- **helmet** (1 connections) — `backend/app.js`
- **{ MongoStore }** (1 connections) — `backend/app.js`
- **passport** (1 connections) — `backend/app.js`
- **session** (1 connections) — `backend/app.js`
- *... and 11 more nodes in this community*

## Relationships

- [rateLimiter.js](rateLimiter.js.md) (6 shared connections)
- [backend/package.json](backend-package.json.md) (6 shared connections)
- [auth.test.js](auth.test.js.md) (5 shared connections)
- [supertest](supertest.md) (2 shared connections)
- [frontend/src/lib/apiClient.js](frontend-src-lib-apiClient.js.md) (2 shared connections)
- [StatCard.jsx](StatCard.jsx.md) (2 shared connections)
- [mongoose](mongoose.md) (2 shared connections)
- [emergencyRoutes.js](emergencyRoutes.js.md) (1 shared connections)
- [AppError](AppError.md) (1 shared connections)
- [logger.js](logger.js.md) (1 shared connections)
- [webSocketTicketService.js](webSocketTicketService.js.md) (1 shared connections)
- [emergencySessionService.js](emergencySessionService.js.md) (1 shared connections)

## Source Files

- `backend/app.js`
- `backend/config/db.js`
- `backend/config/env.js`
- `backend/middleware/notFoundHandler.js`
- `backend/realtime/socketManager.js`
- `backend/server.js`
- `http`

## Audit Trail

- EXTRACTED: 71 (92%)
- INFERRED: 6 (8%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*