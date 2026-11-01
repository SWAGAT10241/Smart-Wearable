# emergencyRoutes.js

> 10 nodes

## Key Concepts

- **emergencyRoutes.js** (8 connections) — `backend/routes/emergencyRoutes.js`
- **authorizeRole.js** (7 connections) — `backend/middleware/authorizeRole.js`
- **authorizePermission()** (4 connections) — `backend/middleware/authorizeRole.js`
- **emergencyRoutes()** (4 connections) — `backend/routes/emergencyRoutes.js`
- **hasPermission()** (3 connections) — `backend/config/permissions.js`
- **createApiRouter()** (3 connections) — `backend/routes/index.js`
- **permissions.js** (3 connections) — `backend/config/permissions.js`
- **protect()** (2 connections) — `backend/middleware/authMiddleware.js`
- **ROLE_PERMISSIONS** (1 connections) — `backend/config/permissions.js`
- **express** (1 connections) — `backend/routes/emergencyRoutes.js`

## Relationships

- [rateLimiter.js](rateLimiter.js.md) (6 shared connections)
- [AppError](AppError.md) (1 shared connections)
- [User.js](User.js.md) (1 shared connections)
- [.is_off_grid](is_off_grid.md) (1 shared connections)
- [emergencySessionController.js](emergencySessionController.js.md) (1 shared connections)

## Source Files

- `backend/config/permissions.js`
- `backend/middleware/authMiddleware.js`
- `backend/middleware/authorizeRole.js`
- `backend/routes/emergencyRoutes.js`
- `backend/routes/index.js`

## Audit Trail

- EXTRACTED: 20 (87%)
- INFERRED: 3 (13%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*