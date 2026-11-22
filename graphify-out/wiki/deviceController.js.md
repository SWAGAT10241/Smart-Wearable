# deviceController.js

> 11 nodes

## Key Concepts

- **asyncHandler.js** (10 connections) — `backend/utils/asyncHandler.js`
- **fallController.js** (6 connections) — `backend/controllers/fallController.js`
- **locationController.js** (5 connections) — `backend/controllers/locationController.js`
- **asyncHandler()** (4 connections) — `backend/utils/asyncHandler.js`
- **telemetryController.js** (4 connections) — `backend/controllers/telemetryController.js`
- **updateStatus()** (2 connections) — `backend/controllers/fallController.js`
- **ingestReadings()** (2 connections) — `backend/controllers/telemetryController.js`
- **getLatest** (1 connections) — `backend/controllers/fallController.js`
- **getUserFalls** (1 connections) — `backend/controllers/fallController.js`
- **getHistory** (1 connections) — `backend/controllers/locationController.js`
- **getLatest** (1 connections) — `backend/controllers/locationController.js`

## Relationships

- [AppError](AppError.md) (3 shared connections)
- [rateLimiter.js](rateLimiter.js.md) (3 shared connections)
- [deviceController.js](deviceController.js.md) (2 shared connections)
- [telemetryService.js](telemetryService.js.md) (1 shared connections)
- [authService.js](authService.js.md) (1 shared connections)
- [emergencySessionController.js](emergencySessionController.js.md) (1 shared connections)
- [environmentController.js](environmentController.js.md) (1 shared connections)
- [vitalsController.js](vitalsController.js.md) (1 shared connections)

## Source Files

- `backend/controllers/fallController.js`
- `backend/controllers/locationController.js`
- `backend/controllers/telemetryController.js`
- `backend/utils/asyncHandler.js`

## Audit Trail

- EXTRACTED: 23 (92%)
- INFERRED: 2 (8%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*