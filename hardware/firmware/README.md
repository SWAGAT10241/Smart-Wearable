# ESP32-S3 BLE pairing firmware

This ESP-IDF project provides device identity, a time-limited physical pairing
window, Ed25519 challenge signing, backend-signed owner authorization, and a
BLE telemetry notification stream. Sensor drivers remain to be ported from
the existing MicroPython experiments.

## Toolchain

* ESP-IDF **5.3 or newer**, configured for `esp32s3`.
* ESP-IDF Component Manager access to `espressif/libsodium`.
* ESP32-S3 development board with a momentary button wired from the configured
  `CONFIG_TRAILGUARD_PAIRING_BUTTON_GPIO` to ground.
* A release provisioning setup capable of enabling Secure Boot V2 and flash
  encryption in **release mode**.

Check the actual board wiring and configure the GPIO in `idf.py menuconfig`.
The project default is only a placeholder and must not be assumed to match a
board. Do not use a strap/boot-critical pin unless the board design explicitly
supports that wiring.

## Build and flash

From this directory in an ESP-IDF terminal:

```powershell
idf.py set-target esp32s3
idf.py menuconfig
idf.py build
idf.py -p COM5 flash monitor
```

Before any production key generation, configure and burn Secure Boot V2 and
flash-encryption keys using Espressif's release-mode provisioning procedure.
These eFuse operations can be irreversible and can permanently brick a device
if performed incorrectly. Back up signing/encryption material offline and
follow the exact ESP-IDF guide for the pinned ESP-IDF version. The application
refuses to create/load a device identity unless both security features report
enabled. The `nvs` partition is marked encrypted in `partitions.csv`.

On first secure boot, the ESP32-S3 generates a random UUIDv4 and Ed25519 key
pair. The private key and identity are stored in NVS; the public key is never
secret. On later boots, the firmware checks that the public and private keys
match and fails closed if NVS is incomplete or inconsistent. There is no
firmware command to export the private key or reset identity.

## Pairing sequence supported by this firmware

1. Press the configured physical button. The device advertises the TrailGuard
   GATT service for up to 60 seconds; the advertisement carries no ID or
   personal/sensor data.
2. The client reads **Device Information** (`...0006`) during this window. The
   JSON contains `deviceId`, an Ed25519 `publicKeyPem`, and `protocolVersion`.
   Use this public key with the trusted operator
   [`provision-device` CLI](../../backend/README.md#trusted-device-provisioning-prerequisite).
   Save the decoded `publicKeyPem` string (including PEM header/footer and
   normal newline characters) as a protected local `.pem` file for the CLI.
3. A signed-in companion app scans the one-time QR token from the operator,
   requests a backend pairing challenge, and writes the challenge JSON below
   to **Command/Control** (`...0003`) while the physical pairing window is
   open.
4. Read the command characteristic to retrieve `{ "nonce", "signature" }`.
   The app submits that proof to the backend completion endpoint. The
   firmware's signature uses the canonical UTF-8 JSON key order and format
   defined in the
   [backend pairing contract](../../backend/README.md#secure-pairing-api).
5. The backend returns a challenge-bound signed owner receipt. The client
   writes it to **Authorization** (`...0007`); only after signature and
   challenge verification does the device persist the owner ID.
6. On each encrypted BLE connection the device generates a one-time nonce and
   challenge ID. The authenticated app obtains a 15-minute backend telemetry
   receipt and writes it to Authorization. The device accepts only the
   persisted owner, current nonce, and current connection within 10 seconds;
   otherwise the device closes the connection. The 15-minute lease also closes
   the session at expiry so the app must authorize a fresh connection.
   Disconnect revokes that in-memory session lease.

Challenge writes are capped at 512 bytes. The GATT client must negotiate an
ATT MTU large enough for the challenge JSON (the firmware advertises a
preferred MTU of 515) or use a supported long-write operation. The challenge is bound to the
canonical uppercase device UUID, authenticated account ID, random nonce, and
server expiry. The private signing key remains in the device.

GATT UUIDs match the architecture contract:

| Characteristic | UUID suffix | Current implementation |
|---|---|---|
| Telemetry | `0002` | Emits v1 notifications after the backend-signed per-connection receipt; values explicitly report `not_integrated` until drivers exist |
| Command/control | `0003` | Read/write challenge-signing operation, physical-window gated |
| Device status | `0004` | Encrypted read of protocol/device/connection state, uptime, battery, sensor, and risk status |
| Battery | `0005` | Reports `null` until a battery sensor is integrated |
| Device information | `0006` | Readable only during the physical pairing window |
| Authorization | `0007` | Encrypted read/write; verifies backend-signed owner and per-connection telemetry receipts |

Only an encrypted BLE link is required at the GATT layer; LE Secure
Connections Just Works does not authenticate the peer. Device ownership and
telemetry authorization instead require the backend's Ed25519 receipt and
the fresh per-connection device nonce. Telemetry frames are emitted every
five seconds only while an authorized receipt and notification subscription
are active. Until sensor drivers are integrated, measurements and battery
values are `null` with `not_integrated` health/status fields.
The dashboard refreshes status on connection and every 30 seconds. Web
Bluetooth does not expose RSSI, so radio signal strength is reported as
unavailable; live connection state and stale telemetry are shown separately.

## Important limitations

* No ESP-IDF installation or physical ESP32-S3 was available in the coding
  environment. Build, flash-encryption commissioning, BLE radio behavior,
  button wiring, and backend-to-device pairing have **not** been hardware
  validated.
* The React web dashboard scans the provisioned QR, installs the signed owner
  receipt, obtains the fresh telemetry receipt, and consumes BLE notifications
  on supported Chromium browsers and secure origins. It has not been tested
  against physical hardware and is not a mobile-app integration.
* The app-side telemetry adapter validates protocol-v1 frames and handles
  ordering, duplicates, and reconnects. It trusts only notifications after
  the firmware accepts a challenge-bound backend signature.
* Backend ownership is committed before the device confirms receipt
  installation. If the pairing receipt cannot be written, there is not yet an
  automatic recovery/reissue flow; do not treat that interrupted pairing as
  complete.
* This slice is not a production BLE security profile. Challenge signing is
  gated by a physical button and protects hardware identity. Telemetry is
  authenticated per connection by a backend-signed receipt, but pairing/bond
  revocation synchronization and live sensor drivers are not implemented.
  The version 1
  telemetry contract and executable app-side validation/reference sequencing
  rules are documented in the
  [architecture document](../../../docs/architecture/day-3-device-and-api-architecture.md#telemetry-envelope).
  Do not transmit sensor, location, or control data over this initial pairing
  service.
* Sensor drivers in `hardware/Drivers` are MicroPython experiments and have
  not been ported to this ESP-IDF application.
