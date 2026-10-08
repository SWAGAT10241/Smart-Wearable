# ESP32-S3 BLE pairing firmware

This ESP-IDF project adds the first BLE firmware slice for the TrailGuard
wearable. It replaces neither the existing MicroPython sensor experiments nor
the future native companion app. The current firmware provides device identity,
a time-limited physical pairing window, and Ed25519 challenge signing; telemetry,
battery sampling, normal paired-mode bonding, and app integration remain later
work.

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

Challenge writes are capped at 512 bytes. The GATT client must negotiate an
ATT MTU large enough for the challenge JSON (the firmware advertises a
preferred MTU of 515) or use a supported long-write operation. The challenge is bound to the
canonical uppercase device UUID, authenticated account ID, random nonce, and
server expiry. The private signing key remains in the device.

GATT UUIDs match the architecture contract:

| Characteristic | UUID suffix | Current implementation |
|---|---|---|
| Telemetry | `0002` | Notify property reserved; sensor data not connected |
| Command/control | `0003` | Read/write challenge-signing operation, physical-window gated |
| Device status | `0004` | Reports firmware and integration status |
| Battery | `0005` | Reports `null` until a battery sensor is integrated |
| Device information | `0006` | Readable only during the physical pairing window |

## Important limitations

* No ESP-IDF installation or physical ESP32-S3 was available in the coding
  environment. Build, flash-encryption commissioning, BLE radio behavior,
  button wiring, and backend-to-device pairing have **not** been hardware
  validated.
* The React web dashboard now scans the provisioned QR and performs the
  challenge exchange over Web Bluetooth on supported Chromium browsers and
  secure origins. This browser flow has not been tested against physical
  hardware and is not a mobile-app integration.
* An app-side telemetry notification adapter now validates protocol-v1
  frames and refuses to subscribe unless the caller confirms an authenticated
  paired link. The current firmware does not implement that persistent
  authenticated owner link, so real health telemetry remains disabled.
* This slice is not a production BLE security profile. Challenge signing is
  gated by a physical button and protects hardware identity, but authenticated
  BLE bonding/owner-session lifecycle, backend-signed pairing receipts,
  telemetry authentication, actual telemetry notifications, and
  revoke/unpair synchronization are not yet implemented. The version 1
  telemetry contract and executable app-side validation/reference sequencing
  rules are documented in the
  [architecture document](../../../docs/architecture/day-3-device-and-api-architecture.md#telemetry-envelope).
  Do not transmit sensor, location, or control data over this initial pairing
  service.
* Sensor drivers in `hardware/Drivers` are MicroPython experiments and have
  not been ported to this ESP-IDF application.
