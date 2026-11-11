# GitHub Copilot & Codex Instructions — TrailGuard / SWAAS

All generated code, refactors, and test cases must strictly comply with `AGENTS.md` and `SECURITY_AUDIT.md`.

## Core Principles
- **Architecture Source of Truth:** Refer to `AGENTS.md` for tier boundaries, persona ownership, and coding standards.
- **Privacy by Design:** Normal health telemetry and GPS coordinates must never be continuously streamed to the cloud backend.
- **Fail-Closed Security:** Audit logs (`AuditLog`) are mandatory on protected medical and location reads. Fail-open behavior is strictly forbidden.
- **Cryptographic Authentication:** Hardware APIs require Ed25519 digital signatures and nonces; never trust client-supplied IDs in request bodies without ownership verification.
- **Ephemeral WebSockets:** Upgrade using single-use 60-second tickets via WebSocket subprotocols (`trailguard, ticket.<ticket>`). Do not use query string tokens.

## Verification Checklist
- Backend changes: pass `cd backend && pnpm test`
- Frontend changes: pass `cd frontend && pnpm run test:run && pnpm run build`
- Mobile changes: pass `cd mobile && node scripts/check-syntax.js`
