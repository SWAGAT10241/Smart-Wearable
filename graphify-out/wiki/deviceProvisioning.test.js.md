# deviceProvisioning.test.js

> 55 nodes

## Key Concepts

- **deviceProvisioning.test.js** (20 connections) — `backend/tests/deviceProvisioning.test.js`
- **provision-device.js** (17 connections) — `backend/scripts/provision-device.js`
- **ref_crypto** (17 connections)
- **deviceAuthMiddleware.js** (10 connections) — `backend/middleware/deviceAuthMiddleware.js`
- **generate-device-authority-keys.js** (10 connections) — `backend/scripts/generate-device-authority-keys.js`
- **check-syntax.js** (10 connections) — `mobile/scripts/check-syntax.js`
- **main()** (8 connections) — `backend/scripts/provision-device.js`
- **deviceProvisioningService.js** (8 connections) — `backend/services/deviceProvisioningService.js`
- **deviceAuth.test.js** (7 connections) — `backend/tests/deviceAuth.test.js`
- **provisionDevice()** (6 connections) — `backend/services/deviceProvisioningService.js`
- **deviceAuthMiddleware()** (5 connections) — `backend/middleware/deviceAuthMiddleware.js`
- **validateDeviceId()** (5 connections) — `backend/services/deviceProvisioningService.js`
- **validatePublicKey()** (5 connections) — `backend/services/deviceProvisioningService.js`
- **DeviceAuthNonce.js** (5 connections) — `backend/models/DeviceAuthNonce.js`
- **qrcode** (4 connections) — `backend/package.json`
- **ref_fs** (4 connections)
- **ref_path** (4 connections)
- **generateAuthorityKeys()** (3 connections) — `backend/scripts/generate-device-authority-keys.js`
- **createPairingQrPayload()** (3 connections) — `backend/scripts/provision-device.js`
- **parseArguments()** (3 connections) — `backend/scripts/provision-device.js`
- **checkDir()** (3 connections) — `mobile/scripts/check-syntax.js`
- **reject()** (2 connections) — `backend/middleware/deviceAuthMiddleware.js`
- **sha256()** (2 connections) — `backend/middleware/deviceAuthMiddleware.js`
- **parseArguments()** (2 connections) — `backend/scripts/generate-device-authority-keys.js`
- **writeExclusive()** (2 connections) — `backend/scripts/generate-device-authority-keys.js`
- *... and 30 more nodes in this community*

## Relationships

- [mongoose](mongoose.md) (5 shared connections)
- [telemetryService.js](telemetryService.js.md) (3 shared connections)
- [backend/package.json](backend-package.json.md) (2 shared connections)
- [webSocketTicketService.js](webSocketTicketService.js.md) (2 shared connections)
- [devicePairingService.js](devicePairingService.js.md) (2 shared connections)
- [MAX30100](MAX30100.md) (1 shared connections)
- [4. Mandatory Architectural Invariants (Zero-Tolerance Rules)](4._Mandatory_Architectural_Invariants_Zero-Tolerance_Rules.md) (1 shared connections)
- [rateLimiter.js](rateLimiter.js.md) (1 shared connections)
- [.is_off_grid](is_off_grid.md) (1 shared connections)
- [emergencySessionService.js](emergencySessionService.js.md) (1 shared connections)
- [simulate-esp32.js](simulate-esp32.js.md) (1 shared connections)
- [supertest](supertest.md) (1 shared connections)

## Source Files

- `backend/middleware/deviceAuthMiddleware.js`
- `backend/models/DeviceAuthNonce.js`
- `backend/package.json`
- `backend/scripts/generate-device-authority-keys.js`
- `backend/scripts/provision-device.js`
- `backend/services/deviceProvisioningService.js`
- `backend/tests/deviceAuth.test.js`
- `backend/tests/deviceProvisioning.test.js`
- `docs/architecture/day-3-device-and-api-architecture.md`
- `mobile/scripts/check-syntax.js`

## Audit Trail

- EXTRACTED: 99 (90%)
- INFERRED: 11 (10%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*