# TrailGuard deployment runbook

This runbook applies to the `SWAAS` staging branch and the subsequent production release to `main`.

## Environment boundaries

- `SWAAS` is the integration and staging branch. Do not expose it to real safety users.
- `main` is the production release branch. Merge only through a reviewed pull request with all required checks green.
- Use different MongoDB databases, credentials, OAuth redirect URIs, Twilio senders, and API origins for staging and production.

## Required configuration

Copy `.env.example` to `.env` for local Compose use. Set every value marked as required; production values must be injected through the hosting provider's encrypted secret store, never committed.

Required backend values:

- `MONGODB_URI`
- `JWT_SECRET` and `SESSION_SECRET` (at least 32 characters)
- `CLIENT_URLS` (comma-separated, exact public origins)
- `DEVICE_AUTHORITY_PRIVATE_KEY` for secure device receipts

For the Docker frontend, use `VITE_API_URL=/api` and a public `VITE_WS_URL` such as `wss://app.example.com/live`. The Nginx container proxies `/api` and `/live` to the backend.

## Staging release

1. Merge the approved change into `SWAAS`; CI must be green.
2. Build the containers with a staging-only `.env` file and run `docker compose config` to validate interpolation.
3. Start the stack, then verify:
   - `GET /livez` returns `200`.
   - `GET /readyz` returns `200` only after MongoDB is connected.
   - Web login, device pairing, scoped WebSocket updates, and emergency-alert delivery work with staging credentials.
4. Verify that no normal telemetry is uploaded outside an authorized emergency session.

## Production release

1. Merge `SWAAS` into `main` through a reviewed pull request after staging sign-off.
2. Confirm database backup/restore capability and a current backup before release.
3. Deploy one backend instance or a small canary group first; do not release all traffic at once.
4. Monitor API 5xx rate, readiness failures, WebSocket disconnects, and emergency-alert delivery for 15 minutes before widening traffic.
5. Perform an external HTTPS/WSS smoke test using a real user flow, not only a health endpoint.

## Rollback triggers

Roll back immediately when any of these occurs:

- API 5xx error rate exceeds 1% for five consecutive minutes.
- `/readyz` fails for two consecutive probe intervals.
- A user can receive another user's telemetry or location.
- Emergency alert delivery fails or device authentication rejects valid traffic unexpectedly.
- Login, device pairing, or emergency-session creation fails during the release smoke test.

## Rollback procedure

1. Stop the rollout and direct traffic back to the previously healthy image/version.
2. Confirm `/livez`, `/readyz`, login, and a scoped WebSocket connection on the restored version.
3. Preserve redacted logs and deployment metadata for incident review.
4. Do not run destructive database rollbacks; use backward-compatible schema changes and restore only from a verified backup when necessary.
