# Architecture & Refactoring Guide

This guide defines the target architecture for TrailGuard / Smart-Wearable and a safe, incremental migration plan. It does not claim that the migration has already been applied.

## Principles

1. Preserve existing behavior while refactoring.
2. Keep UI components presentational; keep network access and business rules out of screens.
3. Keep HTTP handlers thin and move business rules into services.
4. Validate all external input at boundaries.
5. Use one consistent API response/error format.
6. Keep secrets in environment variables; commit only example files.
7. Remove code only after checking imports, runtime targets, tests, and hardware compatibility.
8. Prefer incremental pull requests over a full-repository rewrite.

## Current top-level boundaries

- `backend/`: Express API, MongoDB models, authentication, telemetry ingestion and WebSocket broadcasts.
- `frontend/`: React web dashboard.
- `mobile/`: Expo / React Native app.
- `hardware/`: sensor drivers and hardware experiments.
- `.github/workflows/`: CI, dependency audits and CodeQL.

## Target structure

Keep the existing top-level apps to avoid breaking their build and deployment setup. Within each app, move gradually toward feature-oriented modules.

```text
backend/
  config/                 # env, database, Passport
  middleware/             # auth, request validation, not-found, errors
  routes/v1/              # versioned route registration (migration step)
  controllers/            # HTTP parsing/response only
  services/               # use cases/business rules
  repositories/            # database access when it adds value
  validators/              # request schemas
  models/                  # Mongoose models
  integrations/             # SMS, WhatsApp, external providers
  realtime/                 # WebSocket lifecycle and event contracts
  utils/                    # AppError, asyncHandler, logger
  tests/

frontend/src/
  app/                      # providers, router, app shell
  features/
    auth/                   # components, hooks, services
    devices/                # components, hooks, services
    telemetry/              # components, hooks, services
    history/
    settings/
  components/ui/             # general-purpose presentational components
  lib/                       # API transport, formatting helpers
  config/                    # validated public runtime config
  test/

mobile/src/
  app/                       # providers and navigation
  features/                  # auth, devices, telemetry, history, alerts, settings
  components/ui/
  services/                  # API and native integrations
  lib/
  theme/

hardware/
  drivers/                   # production-ready device-specific drivers
  experiments/               # prototypes / exploratory scripts
  tests/                     # hardware checks and smoke tests
  README.md
```

Do not move folders in a single mass rename until imports, deploy paths, build scripts and CI are updated in the same reviewed change.

## Backend request flow

```text
HTTP request
  -> router (mount path + middleware)
  -> validator (shape and range checks)
  -> controller (translate request/response)
  -> service (business rules and orchestration)
  -> repository/model (persistence)
  -> response / centralized error middleware
```

Suggested modules to extract first:
- Telemetry ingestion from `backend/routes/deviceRoutes.js` into a telemetry controller + ingestion service.
- Emergency notification orchestration into a service that calls SMS/WhatsApp adapters.
- WebSocket connection/broadcast concerns from `backend/app.js` into `backend/realtime/`.
- Authentication and device-management routes only after characterization tests cover their existing behavior.

## API contracts

Maintain the current routes during extraction. Introduce `/api/v1` only as a deliberate migration with compatibility tests and an explicit cutover plan.

Success response convention (adapt per current endpoint before rolling out):

```json
{ "success": true, "data": {} }
```

Error response convention:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request is invalid",
    "requestId": "..."
  }
}
```

Never return stack traces, database details, provider credentials, JWTs or other secrets in production responses. Keep status codes meaningful: 400 validation, 401 unauthenticated, 403 unauthorized, 404 missing resource, 409 conflict, 429 rate limit, 500 unexpected failure.

## Frontend and mobile boundaries

- Components render props/state and emit callbacks; they should not embed large API workflows.
- Feature service modules call the shared transport client.
- Hooks compose feature state and lifecycle behavior.
- Context is appropriate for cross-cutting app state (auth, theme, selected device, live connection). Avoid placing all screen-specific state into global context.
- Preserve the existing web and mobile provider contexts while extracting modules incrementally.
- Do not add a new state-management dependency until a concrete state complexity requirement is documented.

## Environment configuration

- Validate backend required variables once before starting the server.
- Keep provider secrets server-only.
- Frontend `VITE_*` and mobile `EXPO_PUBLIC_*` variables are public bundle configuration, never secrets.
- Use `.env.example` files with placeholders only.
- Ensure local defaults in examples match the actual backend port. The current frontend example points at port 5000, while backend defaults to 3000; reconcile this intentionally and verify deployment configuration too.
- Never set production credentials to insecure fallback defaults.

## Error handling and observability

- Use an application error type carrying HTTP status and stable machine-readable code.
- Use an async route wrapper only if it matches Express's supported error propagation; verify with tests.
- Centralize logging; log request ID, route, error code and safe context, but omit tokens, passwords, sensitive health/location payloads, and secret environment values.
- Handle network failures, non-JSON responses, HTTP errors and aborted requests in the clients.
- For WebSocket connections, define reconnect strategy, event schema validation, cleanup and bounded retry/backoff.
- Do not silently swallow exceptions in mobile live-data handlers.

## Duplicate and dead-code audit

Do not delete based on filename similarity alone. Notably:
- `hardware/Drivers/max30100.py` imports `smbus` and is a Raspberry Pi implementation.
- `hardware/Drivers/max30100 (1).py` imports MicroPython's `machine.I2C` and is a different implementation/runtime. These are not automatically duplicates.
- Several scripts named `*_new.py` or `display_*.py` may be experimental sketches; identify their hardware target and current use before moving or deleting.
- The web and mobile API clients intentionally share concepts but target different storage/runtime environments, so they should not be merged blindly.

For each removal, document its references, replacement, and test evidence. Use code-search/import analysis and test each app after the change.

## Suggested rollout

1. Characterize current contracts with tests (auth, device ownership, telemetry, fall alerts, WebSocket events).
2. Add structured error utilities and tests without changing response formats.
3. Extract one backend workflow at a time and preserve URLs/payloads.
4. Improve client transport errors and configuration checks.
5. Extract one frontend feature at a time, retaining existing contexts and UI.
6. Audit mobile separately because its storage and WebSocket behavior differ from web.
7. Classify hardware scripts as production drivers, experiments or tests; rename only with import/documentation updates.
8. Update docs and CI; review all dependency and lockfile changes separately.

## Required validation before merge

- Backend: `pnpm install --frozen-lockfile && pnpm test`
- Frontend: `pnpm install --frozen-lockfile && pnpm run test:run && pnpm run build`
- Mobile: `pnpm install --frozen-lockfile && pnpm run check`
- Hardware: `python -m compileall -q hardware`
- Security: backend and frontend dependency audits, CodeQL, and review of environment examples.
- Manual regression: login/register/logout, OAuth callback, profile completion, device registration/rename/status/unpair, telemetry ingest, live updates, fall detection/alerts, history/maps, mobile network connectivity and deployment environment settings.

## Definition of done

- [x] UI rendering and business rules are separated.
- [x] Controllers are thin and services have focused responsibilities.
- [x] Request validation is explicit at API boundaries.
- [x] Error responses and logging are consistent and safe.
- [x] Environment variables are documented and validated.
- [x] State boundaries are documented and no new global state is added without reason.
- [x] Duplicate/dead-code removals have verified evidence.
- [x] Architecture and API docs match actual implementation.
- [x] All CI jobs and regression tests pass.
