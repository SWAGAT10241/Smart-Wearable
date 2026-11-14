# Day 3 — Device and API Architecture

**Status:** Target architecture and implementation contract
**Scope:** SWAAS / TrailGuard wearable, companion app, backend, and rescue web
**Decision:** Privacy-first by default. This document defines intended behavior; it
does not claim that the current prototype already enforces every control.

## 1. Goals and non-goals

This design establishes component responsibilities, trust boundaries, device
identity and ownership, BLE and backend protocols, emergency sharing, API
contracts, data models, retention, and security tests. Implementation must
follow these invariants; a client-side check is never an authorization control.

The companion app is the normal owner of health and location data. The backend
is not a continuous telemetry sink in normal mode. An emergency is the only
default path for sharing a bounded data package with authorized rescue users.

This is a target architecture, not a description of all current behavior. The
repository has a React web dashboard and MongoDB-backed telemetry routes. The
backend now has a pairing-challenge API that verifies pre-provisioned Ed25519
device keys, consumes one-time bootstrap tokens, and atomically claims eligible
devices. A trusted provisioning CLI and browser QR/Web Bluetooth pairing flow
are implemented, but the browser flow has not been validated against physical
hardware. There is not yet an emergency-session API. Current telemetry routes
can still upload readings in normal operation using device ID/status lookup
rather than cryptographic device authentication. These are migration gaps, not
acceptable properties of the target design. Do not enable production telemetry
or emergency access until the corresponding controls and tests below are
implemented.

## 2. System components and trust boundaries

| Component | Responsibilities | May access | Must not do |
|---|---|---|---|
| Wearable | Sample sensors; run local risk detection; buffer a bounded amount of data; communicate with the paired app; raise signed emergency events | Its own sensors, device key, recent local telemetry and risk events | Treat `deviceId` as a credential; upload continuous health/location data in normal mode; accept unauthenticated control commands |
| Companion app | Authenticated user interface; BLE pairing; encrypted local store; user controls; validate and stage emergency package; upload only after an emergency is authorized | Data for locally paired devices and the signed-in user | Treat a device ID, BLE address, client-side ownership check, or cached login as authorization |
| Backend API | Authenticate users/devices; enforce ownership and session permissions; persist account/device metadata and time-limited emergency data; audit security-sensitive actions | Minimum account metadata, device public keys/status, active emergency package | Accept arbitrary device claims; expose cross-user data; retain routine telemetry as cloud history |
| Rescue web | Show a narrowly scoped, active emergency to a specifically authorized rescue user; record access and actions | Only the active session and fields permitted by its grant | Search for sessions, enumerate identifiers, access a user's normal history, or keep a permanent public link |
| MongoDB / key service | Store validated records; enforce unique constraints and indexes; protect signing/encryption keys | Only encrypted or access-controlled records required by the backend | Be directly accessible from clients or expose secrets in logs/backups |

```mermaid
flowchart LR
  W[Wearable] <-->|Authenticated BLE| A[Companion app]
  A -->|User HTTPS API: account and pairing| B[Backend API]
  A -->|Explicit emergency package only| B
  B --> D[(MongoDB)]
  B --> K[Key and secret service]
  R[Rescue web] -->|HTTPS, session-scoped grant| B
  W -. no routine cloud telemetry .-> B
  subgraph Device and app trust boundary
    W
    A
  end
  subgraph Server trust boundary
    B
    D
    K
  end
  R
```

### Boundary rules

* **Wearable → app:** BLE is untrusted until authenticated pairing and an
  encrypted, authenticated connection complete. Treat every message as
  malformed until its size, schema, timestamp, sequence, and integrity are
  checked.
* **App → backend:** HTTPS with modern TLS. User operations require a valid
  user token; device operations require device proof; resource ownership is
  checked on the server for every request.
* **Backend → rescue web:** The browser receives only an active, session-scoped
  authorization grant. It cannot query all emergencies or use a user token as
  a rescue grant.
* **Backend → database/key service:** Private network/service identity,
  least-privilege credentials, encryption at rest, and audited administrative
  access.

## 3. Device identity, lifecycle, and ownership

### Identity and credential

* `deviceId` is an immutable, globally unique UUID assigned at manufacture
  (UUIDv4; uppercase/lowercase normalization is not identity proof). Enforce a
  unique database index. It is public metadata and must never authorize a
  claim or telemetry write.
* Each device generates or receives a unique Ed25519 signing key pair during
  trusted manufacturing provisioning. The private key is non-exportable where
  supported; otherwise protect it with secure boot, flash encryption, and
  hardware-backed key derivation. The backend stores only the public key and
  key version. A shared fleet-wide secret is prohibited.
* The sealed bootstrap QR token expires **30 days after provisioning**.
  Expiration or loss requires a trusted reprovisioning process; the old token
  must not be extended or reactivated.
* Device authentication signs a canonical request containing method, path,
  body digest, timestamp, nonce, and key version. The backend checks signature,
  clock window (±5 minutes), one-use nonce, device state, and key status before
  processing. Rotate credentials with an authenticated, auditable overlap
  window; revoke the prior key after successful rotation.
* Provisioning inventory binds `deviceId` to its public key before sale. The
  public ID alone, a copied QR identifier, or a BLE MAC address cannot establish
  identity.

### Lifecycle

| State | Meaning | Allowed next states | Who may cause transition |
|---|---|---|---|
| `UNREGISTERED` | No valid backend provisioning record | `PROVISIONED` | Trusted manufacturing/provisioning process |
| `PROVISIONED` | Hardware identity is enrolled but has no owner | `PAIRED`, `REVOKED` | Valid owner pairing flow; administrator may revoke |
| `PAIRED` | Exactly one active owner relationship exists | `PROVISIONED`, `REVOKED` | Owner unpairs/transfers; administrator may revoke |
| `REVOKED` | Device is permanently denied normal authentication | None; replacement is a new device record | Authorized administrator only |

Invalid transitions are rejected with `409 DEVICE_STATE_CONFLICT`, recorded in
the audit trail, and do not partially update ownership. A revoked device is
never returned to `PROVISIONED`; recovery requires a replacement device and an
audited support workflow.

```mermaid
stateDiagram-v2
  [*] --> UNREGISTERED
  UNREGISTERED --> PROVISIONED: trusted enrollment
  PROVISIONED --> PAIRED: successful pairing
  PAIRED --> PROVISIONED: owner unpairs / transfer completes
  UNREGISTERED --> REVOKED: provisioning fraud
  PROVISIONED --> REVOKED: admin revoke
  PAIRED --> REVOKED: admin revoke
  REVOKED --> [*]
```

### Ownership policy

One active owner per device. The owner is a server-side `User` reference, never
a request-body `userId`. A pairing grant is restricted to a signed-in account,
a provisioned device, a fresh challenge, and that device's enrolled public key.
The server atomically consumes the grant and changes the device and ownership
records in one transaction. Unique constraints prevent two owners winning a
race.

Ownership transfer requires the current owner to reauthenticate and explicitly
confirm, or an audited support recovery procedure if the owner is unavailable.
Transfer revokes all old app/device sessions and rescue grants, closes active
pairing challenges, and records old/new owner references in a restricted audit
event. Unpair removes active ownership, revokes session grants, and requests
local app data deletion after the user is warned/export is completed. It does
not erase manufacturing identity or re-enable a revoked device.

### Secure pairing decision and flow

Use **a time-limited, single-use provisioning QR token plus a device-generated
challenge and physical activation action**. Do not use device ID, serial number,
QR identity alone, or a static numeric code as proof.

1. A user with a verified account reauthenticates within the previous 5 minutes
   and scans a sealed per-device QR containing a random
   256-bit bootstrap token valid for 30 days from provisioning. It is not
   printed as a device ID and is never logged or stored in plaintext by the
   server; persist only a cryptographic hash.
2. The user app requests a pairing challenge. The backend verifies the user
   token, device is `PROVISIONED`, token hash is valid, and no live attempt
   exists. It returns a random 256-bit nonce, bound to device, user, and
   challenge; challenge expires in **5 minutes**.
3. The user presses the wearable's physical activation button. The device
   advertises its pairing service for at most **60 seconds**, proves possession
   of its enrolled private key by signing the fresh nonce, and negotiates BLE
   LE Secure Connections with authenticated out-of-band/numeric-comparison
   confirmation. No legacy Just Works pairing for first-time enrollment.
4. The app relays the signed challenge over its authenticated HTTPS session.
   The backend validates key, nonce, expiry, user/device binding, and proof;
   then atomically consumes the token/challenge and creates the ownership.
5. Any token/challenge can succeed once only. Allow at most **5 failed attempts
   per device per 15 minutes** and **10 per account per hour**. Then lock new
   attempts for 15 minutes, emit a redacted security event, and require a fresh
   physical activation. Never reveal whether a token, account, or device exists
   to an unauthenticated caller.
6. If already paired, return a generic conflict to non-owners; the existing
   owner sees “already paired to your account.” Do not silently transfer or
   reset ownership. If the device is revoked, reject without issuing a challenge.

```mermaid
sequenceDiagram
  actor U as User
  participant A as Companion app
  participant B as Backend
  participant W as Wearable
  U->>A: Sign in and scan sealed bootstrap QR
  A->>B: Start pairing (user token, deviceId, QR token)
  B-->>A: 256-bit challenge (5 minute expiry)
  U->>W: Press physical activation button
  W-->>A: Advertise briefly; prove key over authenticated BLE
  A->>B: Submit device signature and challenge
  B->>B: Validate owner, key, nonce; atomically consume token
  B-->>A: Paired device and ownership receipt
  B->>B: Append audit event
```

## 4. BLE protocol and connection behavior

Use Bluetooth LE GATT with a vendor-specific 128-bit service UUID namespace.
The UUIDs below are stable protocol identifiers, not secrets. Before hardware
release, reserve/replace this namespace with UUIDs generated for the product.

| GATT item | UUID | Access | Contract |
|---|---|---|---|
| TrailGuard primary service | `6f2a0001-7b1c-4d90-a5e2-8c1d3f6a0001` | — | Contains the characteristics below |
| Telemetry | `6f2a0002-7b1c-4d90-a5e2-8c1d3f6a0001` | Notify; authenticated app subscribes | Versioned telemetry envelope; max 512 bytes per encoded message |
| Command/control | `6f2a0003-7b1c-4d90-a5e2-8c1d3f6a0001` | Authenticated write | Allow-listed commands only; never accept arbitrary firmware or owner changes |
| Device status | `6f2a0004-7b1c-4d90-a5e2-8c1d3f6a0001` | Encrypted read; app polls every 30 seconds | Protocol/device/connection state, uptime, firmware, battery and charging status, sensor health, risk-engine state, optional RSSI |
| Battery | `6f2a0005-7b1c-4d90-a5e2-8c1d3f6a0001` | Authenticated read + notify | Charge percent 0–100, charging flag, battery-health enum |
| Device information | `6f2a0006-7b1c-4d90-a5e2-8c1d3f6a0001` | Authenticated read | `deviceId`, model, firmware, protocol version; no credentials |
| Authorization | `6f2a0007-7b1c-4d90-a5e2-8c1d3f6a0001` | Encrypted read/write | Per-connection device nonce/challenge and backend-signed owner/session receipts |

### BLE security model

All characteristics require an encrypted, authenticated link after pairing. Control
writes require application-level authorization and an explicit command allow-list.
Pairing advertisements disclose no user identity, location, or health data.

* **Pairing security mode and peer authentication:** Bluetooth LE Security Mode 1,
  Security Level 4 (LE Secure Connections pairing with Elliptic Curve Diffie-Hellman
  P-256 key agreement and authenticated Out-Of-Band [OOB] or Numeric Comparison confirmation).
  Where Just Works encryption is negotiated, the link is encrypted but the peer is not
  yet authenticated; the wearable additionally requires verification of the backend-signed
  owner receipt and single-use telemetry receipt bound to the current connection challenge
  via characteristic `6f2a0007` before enabling telemetry notifications. Downgrade to
  legacy pairing is strictly rejected.
* **Link encryption:** 128-bit AES-CCM link-layer encryption is mandatory for all
  subsequent GATT communication after pairing. Unencrypted read, write, or notify
  requests are rejected with `GATT_INSUFFICIENT_ENCRYPTION`.
* **Authenticated characteristic permissions:**
  - `Telemetry` (`6f2a0002`): Authenticated notify only. Notifications are disabled
    until the client affirms an active, authenticated paired link and presents valid receipts.
  - `Command/control` (`6f2a0003`): Authenticated write only with payload signature
    and command allow-list (e.g. calibration, ping, pairing challenge proof).
  - `Device status` (`6f2a0004`): Encrypted read; polled every 30 seconds for state, uptime,
    firmware, battery and charging status, sensor health, and risk-engine state.
  - `Battery` (`6f2a0005`): Authenticated read and notify.
  - `Device information` (`6f2a0006`): Authenticated read during normal operation;
    unbonded read permitted exclusively during the active 60-second pairing window
    initiated by physical activation button press.
  - `Authorization` (`6f2a0007`): Encrypted read/write for connection challenge and
    backend-signed owner and session receipts.
* **Bond lifecycle and revocation:** The Long Term Key (LTK) generated during LESC
  pairing is stored in hardware-backed secure storage (e.g. ESP32 encrypted NVS).
  On device unpairing or revocation, the companion app and wearable explicitly
  erase bonded keys. Stale, mismatched, or revoked bonding credentials trigger
  immediate disconnection and require full reprovisioning and re-pairing.
* **Replay and spoofing protection:** Telemetry frames over BLE are authenticated by
  the established LESC link layer and sequenced at the application layer with a
  random `bootId` and strictly monotonic 32-bit sequence counter. Spoofed, replayed,
  or out-of-order packets outside the 32-frame buffer window are rejected.


### Telemetry envelope

Telemetry is a wearable-to-paired-app BLE notification, not a normal-mode
backend upload. JSON is UTF-8 encoded and the complete envelope MUST be no
larger than 512 bytes. Version 1 has exactly the following envelope and
payload fields; unknown or missing fields are rejected.

```json
{
  "schemaVersion": 1,
  "messageType": "telemetry",
  "deviceId": "b3fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a",
  "bootId": "6e8f6f5d-747a-4f01-8ec5-2be9b8a3d5ae",
  "sequence": 4182,
  "timestamp": "2026-10-08T06:20:00.000Z",
  "payload": {
    "heartRateBpm": 78,
    "spo2Percent": 98,
    "temperatureC": 36.7,
    "batteryPercent": 72,
    "charging": false,
    "sensorHealth": {
      "heartRate": "ok",
      "spo2": "ok",
      "temperature": "ok"
    },
    "riskEngineStatus": "normal"
  }
}
```

`deviceId` and `bootId` are lowercase UUIDv4 strings. Generate a new random
`bootId` on every boot; `sequence` starts at zero and increments once per
notification as an unsigned 32-bit integer. Do not wrap the counter: start a
new stream with a new `bootId` before exhaustion. On subscription, the first
valid sequence is the baseline; following frames must be consecutive.
`timestamp` is UTC RFC 3339 with exactly millisecond precision (`.sssZ`) and
must be within five minutes of the paired app's synchronized clock.

Version 1 payload fields are all required. Heart rate is an integer in
20–240 bpm or `null`; SpO2 is an integer in 50–100 percent or `null`;
temperature is a finite number in 20–50 °C or `null`; battery is an integer in
0–100 percent or `null`; `charging` is boolean or `null`. The three matching
`sensorHealth` values are one of `ok`, `unavailable`, `fault`, or
`not_integrated`; a non-null reading requires `ok`, and a null reading must not
claim `ok`. `riskEngineStatus` is `normal`, `elevated`, `critical`, or
`not_integrated`. No location field is included in this version; location
sharing remains governed by the local-first and emergency-data contracts.

Reject malformed JSON, invalid UTF-8, extra/missing fields, unsupported
versions/types, invalid identifiers, out-of-range readings, inconsistent
sensor health, stale timestamps, and frames over 512 encoded bytes. Rejection
must not mutate stream state, crash the BLE client, or log frame contents.
Deduplicate by `(deviceId, bootId, sequence)`. A duplicate buffered or already
delivered sequence is discarded. Buffer a future sequence only when the gap is
at most 32 and the buffer has fewer than 32 frames. Wait up to 10 seconds for
the missing sequence; deliver buffered frames only after the gap closes. If
the gap does not close within 10 seconds, discard the buffered frames, emit a
non-sensitive `sequence_gap_timeout` diagnostic, and establish a new baseline
on the next valid, higher sequence. The app calls the tracker expiry method
using a monotonic clock so a stalled notification stream still expires its
buffer at the deadline. Never infer a fresh reading from a duplicate or stale
frame. Counter exhaustion likewise requires a new boot/session ID.

The executable schema validator and sequence tracker live in
[`frontend/src/lib/telemetryProtocol.js`](../../frontend/src/lib/telemetryProtocol.js);
they define the browser/app-side reference behavior but do not imply that the
ESP32 firmware currently emits sensor telemetry or that the web dashboard
stores it. The Web Bluetooth notification adapter in
[`frontend/src/lib/telemetryBleClient.js`](../../frontend/src/lib/telemetryBleClient.js)
validates and orders incoming frames. The dashboard first installs a
challenge-bound owner receipt and then obtains a short-lived, single-use
backend receipt for the device-generated challenge on every BLE connection.
The firmware verifies those receipts before enabling notifications. Sensor
drivers and radio-level verification remain outstanding.

### Connection state and retries

States: `DISCONNECTED → SCANNING → CONNECTING → AUTHENTICATING → CONNECTED`.
Unexpected loss enters `RECONNECTING`; no valid telemetry for the stale
deadline enters `STALE`; a backend authorization rejection enters
`UNAUTHORIZED` and stops retries. Pairing is a separate short-lived flow and
does not imply an ongoing data connection.

* Each GATT connection attempt has a 15-second timeout. Reconnect receipt
  authorization has a 10-second timeout. Timed-out attempts are abandoned; any
  late connection is immediately closed. A paired device also terminates an
  encrypted connection if its fresh telemetry receipt is not accepted within
  10 seconds.
* On unexpected disconnect or retryable connection failure, retry after 1, 2,
  4, 8, 16, then 30 seconds. Continue at 30 seconds while the app session is
  active. Stop on session disposal, selected-device change, or backend
  authorization rejection (HTTP 401/403/404).
* The current firmware's five-second telemetry notification is the live-data
  heartbeat. Mark the stream stale after 60 seconds without a valid
  notification and surface an explicit stale state. Retain current readings in
  dashboard memory while stale, but never label them fresh or fabricate updates.
  Changing the selected device clears its displayed readings.
* Every connection requires a fresh device challenge and signed telemetry
  receipt before notifications are enabled. The client reads device status
  and negotiates protocol version 1 on pairing and every reconnect. The current
  protocol has no history replay or acknowledged-sequence resume: each
  authorized connection establishes a new sequence baseline, validates
  protocol-v1 frames, and deduplicates within that stream. Unsupported frames
  are rejected by the validator. Normal-mode telemetry remains app-side and is
  not uploaded to the cloud.
* Authorization expiry closes the BLE session; the app reconnects and obtains
  a new receipt rather than continuing to treat an expired session as live.
* Device status is refreshed on connect and every 30 seconds. Battery,
  charging, and sensor values remain explicitly `null`/`not_integrated` until
  drivers are connected. Web Bluetooth does not expose RSSI; signal strength
  therefore reports `unavailable`, while the app surfaces link state and
  telemetry staleness separately.

## 5. Local-first storage and privacy

### Local database and retention

The companion app uses encrypted SQLite (SQLCipher or equivalent) with the
database key held in the OS keystore/keychain. The wearable keeps only a bounded
encrypted circular buffer for outage/emergency continuity. The local schema is:

| Table | Required fields | Retention |
|---|---|---|
| `telemetry` | `id`, `deviceId`, `bootId`, `sequence`, `capturedAt`, `type`, validated payload | Rolling 7 days |
| `risk_events` | `id`, `deviceId`, `occurredAt`, `riskType`, `severity`, minimal evidence | Rolling 7 days unless attached to an active emergency |
| `locations` | `id`, `deviceId`, `capturedAt`, latitude, longitude, accuracy, source | Rolling 7 days; precise location only with OS/user permission |
| `emergency_events` | `id`, `sessionId`, `trigger`, `state`, created/updated timestamps | Until user deletes it; upload only for an active authorized session |
| `device_status` | `deviceId`, `capturedAt`, battery, sensor health, firmware, uptime | Keep latest status plus 7-day diagnostic history |

Expire records older than 7 days at app startup and at least once every 24 hours;
also enforce storage quota before insert. On low storage, evict oldest routine
telemetry first, then diagnostics; never evict an active emergency package
without an explicit error and user-visible warning. Cap the local database at
the lower of 500 MB or 10% of available app storage. If an emergency package
cannot be staged, keep retrying locally and clearly report that rescue sharing
has not completed.

On unpair, offer export first, then delete that device's local records and BLE
bond. On user-initiated deletion, delete the selected local data and propagate
deletion to active cloud emergency records the user owns. App uninstall deletes
the local encryption key, making residual database blocks unreadable. Deletion
requests and completion are auditable without storing deleted health/location
payloads.

### Normal and emergency data boundary

| Mode | Data leaving the device/app |
|---|---|
| Normal | No continuous health, risk, or precise location telemetry. Pairing/account/device metadata and security audit metadata only. A minimal device service heartbeat is allowed only if enabled by the user and must exclude sensor values and location. |
| Emergency | Only the session package listed below, after the app/user or authenticated risk engine creates an emergency and backend authorization succeeds. Transfer is TLS protected, bounded, encrypted at rest, and visible to the user where possible. |

Normal-mode history remains on the wearable/app. The backend does not receive
routine cloud telemetry for dashboard convenience. Any future cloud sync needs
an explicit opt-in, separate retention, and privacy review; it is not implied by
this contract.

## 6. Emergency session and rescue authorization

### Trigger, states, and transitions

Triggers are (a) wearable risk engine, (b) app-confirmed fall/risk event, or
(c) user-initiated manual SOS. An automatic wearable trigger creates an
emergency with its signed evidence; where possible, the app provides a short
15-second cancel/countdown. User cancellation is always available. Repeated
triggers for the same active device/session are idempotent and update the
existing session rather than creating uncontrolled duplicates. A manual SOS
requires explicit confirmation, except a configured hardware SOS button may
send immediately.

```mermaid
stateDiagram-v2
  [*] --> CREATED
  CREATED --> ACTIVE: authorization and package accepted
  CREATED --> CANCELLED: user cancels / upload cannot be authorized
  ACTIVE --> RESOLVED: owner or authorized responder resolves
  ACTIVE --> CANCELLED: owner cancels; reason audited
  ACTIVE --> EXPIRED: 24-hour maximum reached
  RESOLVED --> [*]
  CANCELLED --> [*]
  EXPIRED --> [*]
```

Allowed transitions are `CREATED → ACTIVE | CANCELLED` and
`ACTIVE → RESOLVED | CANCELLED | EXPIRED`; terminal states are immutable.
Only the owner can create/cancel. The owner or an explicitly granted responder
can resolve; a device can request creation/updates only with valid device
authentication. Backend time is authoritative. An active session expires no
later than **24 hours** after creation; there is no implicit renewal. Expired,
resolved, or cancelled sessions immediately deny data reads and revoke rescue
grants. Emergency package data is deleted within 24 hours after terminal state;
minimal non-content audit metadata is retained for 30 days, then purged.

`sessionId` is a cryptographically random 192-bit opaque identifier. It is not
a bearer credential and is never sufficient to read a session.

### Minimum emergency package

Upload only the following, when available and relevant:

* Session ID, trigger source/type, event timestamps, current state, and minimal
  risk-event type/severity/evidence.
* Latest validated vitals and relevant risk telemetry from the preceding
  **6 hours**; no unrelated long-term health history.
* Latest location plus location samples needed for rescue from at most the
  preceding **6 hours**, with capture time and accuracy.
* Device reference, online/offline status, battery/charging state,
  sensor-health summary, and firmware version.
* Minimal user display name and an emergency contact callback value only when
  needed by the configured rescue workflow and authorized by the user.

Do not include passwords, access/refresh tokens, device private keys, complete
account/profile records, unrelated locations, raw audio, or continuous
background telemetry. The app labels unavailable/stale fields rather than
inventing values.

### Access, expiry, and deletion

The owner can read and cancel their own session. A rescue user receives access
only through a session-specific invitation bound to that recipient and
session. Invitations are random, single-use, expire after **15 minutes**, and
are delivered over a verified channel; exchange yields a short-lived,
session-scoped token (15 minutes, rotated on use). Enforce one-hour inactivity
timeout and the session's earlier 24-hour maximum. Rescue grants cannot list,
search, or enumerate sessions. Revoke all grants on cancellation, resolution,
expiration, transfer, or owner revocation.

Backend authorization is checked on every read/write against current session
state, owner, grant, and role. Return the same not-found response for an
unknown or unauthorized session to resist enumeration. No permanent public
URL. On terminal state, deny reads immediately, enqueue deletion, verify
deletion completion, and retain only 30-day minimal audit facts (actor,
action, time, result, and opaque IDs; no health/location fields). TTL indexes
are cleanup assistance, not the authorization mechanism; every route checks
expiry synchronously.

## 7. REST API contract

### Conventions and authentication

* Base path: `/api/v1`; JSON over HTTPS only. Resource nouns are plural,
  lowercase, and kebab-case where multiword. Use standard `GET`, `POST`,
  `PATCH`, `DELETE` semantics. Timestamps are UTC RFC 3339.
* User access token: short-lived (15 minutes), signed with a managed asymmetric
  key, with `iss`, `aud`, `sub`, `iat`, `exp`, and `jti`; never put health data
  or secrets in claims. Refresh tokens are opaque, hashed at rest, rotated on
  each use, and revoked on logout, password/security reset, unpair, or account
  revocation. Current prototype JWT behavior must be migrated to this policy.
* Device API authentication uses the per-device signature/challenge protocol in
  §3, with timestamp/nonce replay protection. A user JWT alone cannot submit
  device telemetry; device proof alone cannot access a user's session.
* Every user resource lookup includes the authenticated owner in its database
  predicate. Roles are `user`, `responder`, and `admin`; admin access is
  separately authorized and audited. Client-side route hiding is not security.
* Paginate lists with opaque cursor and bounded `limit` (default 25, max 100).
  Filters/sorts are allow-listed. Validate request and response schemas; reject
  unknown sensitive fields rather than mass-assigning documents.

### Initial endpoints

| Method and path | Authentication | Purpose |
|---|---|---|
| `POST /devices/pairing-challenges` | User token + one-use bootstrap token | Start device pairing |
| `POST /devices/pairing-challenges/{challengeId}/complete` | User token + device proof | Complete pairing |
| `GET /devices` | User token | List caller's devices |
| `GET /devices/{deviceId}` | User token + owner check | Read caller's device |
| `DELETE /devices/{deviceId}/ownership` | User token + recent reauthentication | Unpair |
| `POST /devices/{deviceId}/transfers` | Current owner + recent reauthentication | Start confirmed transfer |
| `POST /devices/{deviceId}/revocations` | Admin/support authorization | Revoke; audit and deny future device authentication |
| `POST /device-telemetry` | Device signature + paired/active state | Accept bounded telemetry only when an authorized emergency upload is active |
| `POST /emergency-sessions` | Owner token or signed paired-device request | Create/idempotently activate emergency |
| `GET /emergency-sessions/{sessionId}` | Owner or valid rescue grant | Read active authorized session |
| `POST /emergency-sessions/{sessionId}/package` | Owner token + active session | Upload validated emergency package |
| `POST /emergency-sessions/{sessionId}/invitations` | Owner token + active session | Invite named/verified responder |
| `POST /emergency-invitations/{token}/exchange` | One-use invitation token | Exchange for scoped rescue grant |
| `POST /emergency-sessions/{sessionId}/cancel` | Owner token | Cancel |
| `POST /emergency-sessions/{sessionId}/resolve` | Owner or granted responder | Resolve |
| `GET /emergency-sessions/{sessionId}/location` | Owner or valid rescue grant | Read bounded emergency locations |
| `GET /emergency-sessions/{sessionId}/telemetry` | Owner or valid rescue grant | Read bounded emergency telemetry |

No endpoint permits caller-supplied `userId` to choose an owner. Admin routes
are separate and never expose credentials or bootstrap tokens. Device status,
ownership, and revocation updates are audited.

### Request validation and examples

All endpoints require a JSON object of documented fields, bounded strings,
enumerations, numeric ranges, and maximum body sizes (100 KiB generally; 512
KiB for a chunked emergency package). Apply endpoint-specific stricter limits.
Reject invalid content type, duplicate/unknown security fields, future
timestamps outside the allowed skew, and payloads with invalid schema versions.

Pairing challenge request (bootstrap token sent in a protected request body and
redacted from logs):

```json
{"deviceId":"b3fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a","bootstrapToken":"<one-time-secret>"}
```

Emergency package request:

```json
{
  "trigger": {"source":"wearable","type":"fall","occurredAt":"2026-10-08T06:20:00.000Z"},
  "location": [{"latitude":12.9716,"longitude":77.5946,"accuracyMeters":18,"capturedAt":"2026-10-08T06:19:55.000Z"}],
  "telemetry": [{"type":"vitals","capturedAt":"2026-10-08T06:19:50.000Z","values":{"heartRateBpm":118,"spo2Percent":94}}],
  "deviceStatus": {"batteryPercent":72,"charging":false,"sensorHealth":{"heartRate":"ok"}}
}
```

### Response and error format

Successful object/list responses use a top-level `data` field, with cursor
metadata for lists. Errors use the same safe envelope; `requestId` is generated
per request and can be shared with support. Never include stack traces, tokens,
database errors, private keys, or whether another user's resource exists.

```json
{"data":{"deviceId":"b3fdc7e3-995b-4f32-9d37-c8aaf9bb9f2a","state":"PAIRED"}}
```

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "One or more fields are invalid.",
    "requestId": "req_01J9EXAMPLE",
    "details": [{"field":"batteryPercent","reason":"must be between 0 and 100"}]
  }
}
```

| HTTP status | Meaning / stable error code |
|---|---|
| `400` | `VALIDATION_FAILED`, `MALFORMED_REQUEST` |
| `401` | `AUTHENTICATION_REQUIRED`, `INVALID_CREDENTIAL` |
| `403` | `FORBIDDEN` when disclosure is safe |
| `404` | `NOT_FOUND` for missing and unauthorized session/device resources |
| `409` | `DEVICE_STATE_CONFLICT`, `PAIRING_REPLAYED`, `SESSION_TERMINAL` |
| `410` | `CHALLENGE_EXPIRED`, `SESSION_EXPIRED` when disclosure is authorized |
| `413` | `REQUEST_TOO_LARGE` |
| `429` | `RATE_LIMITED` with `Retry-After` |
| `500` | `INTERNAL_ERROR`; generic message and request ID only |
| `503` | `SERVICE_UNAVAILABLE`; no success-shaped fallback |

## 8. Backend models and indexes

All records have a server-generated `_id` primary key. Mutable records have UTC
`createdAt` and `updatedAt`; append-only audit records have `createdAt` only.
Fields called required below are non-null and validated at write time; optional
fields are nullable/absent and never used to bypass authorization. Validate
references and state changes in server services, not only in Mongoose hooks.
Use transactions for pairing, transfer, and emergency state changes where
supported.

| Model | Core fields and relationships | Indexes, uniqueness, deletion |
|---|---|---|
| `User` | Existing account identity, auth provider, roles/status; never include password in API response | Unique normalized email; role/status index; disable/revoke sessions before deletion |
| `Device` | `deviceId` (immutable UUID), `publicKey`, `keyVersion`, `state`, `bootstrapTokenHash`, `bootstrapTokenExpiresAt`, `firmwareVersion`, `lastSeenAt`, `revokedAt` | Unique `deviceId`; state/lastSeen index; no private key or plaintext bootstrap token; retain revoked identity for deny-list/audit |
| `DevicePairing` | `challengeId`, device ref, user ref, bootstrap-token hash, nonce hash, state, expiresAt, purgeAt, attempts | Unique challenge ID; device/state/expiry index; TTL cleanup 24h after expiry; single-use atomic transition; delete token hashes after terminal state |
| `DeviceOwnership` | Device ref, user ref, `startedAt`, `endedAt`, `endedReason`, actor ref | Device/active and user/active indexes; at most one active owner per device; preserve minimal transfer history per retention policy |
| `EmergencySession` | Random `sessionId`, owner ref, optional device ref, state, trigger, startedAt, expiresAt, terminalAt | Unique session ID; owner/state/time index; TTL for terminal cleanup; no public access; enforce unique active session per device as policy |
| `EmergencyTelemetry` | Session ref, capturedAt, type, validated minimal payload | Session/time index; TTL at terminal cleanup; delete payload within 24h of terminal state |
| `LocationReading` | Device ref or session ref, capturedAt, coordinates, accuracy, source | Device/time and session/time indexes; no normal cloud writes in target design; emergency locations deleted with package |
| `RiskEvent` | Device ref, optional session ref, occurredAt, riskType, severity, bounded evidence | Device/time and session indexes; routine events local-only; cloud copy only as emergency package |
| `AuditLog` | Immutable event ID, actor type/ref, action, target opaque ID, timestamp, result, request ID, redacted metadata | Append-oriented time/action/actor indexes; no credentials, raw payload, or precise location; 30-day minimum security retention then purge under policy |

### Required, optional, and validation rules

* **`User`** — Required: normalized unique `email`, `username`,
  `authProvider`, account status, role (default `user`). Optional:
  `passwordHash` for local accounts or provider subject for OAuth (exactly the
  applicable credential is present), profile and emergency-contact fields.
  Validate email and role enums; never expose password/provider credential
  fields.
* **`Device`** — Required: immutable UUID `deviceId`, enrolled `publicKey`,
  `keyVersion`, lifecycle `state`. Optional: `firmwareVersion`, `lastSeenAt`,
  `revokedAt`. Validate UUID, key encoding, state transitions, and key-version
  monotonicity. No direct client-controlled owner field; active ownership is
  represented in `DeviceOwnership`.
* **`DevicePairing`** — Required: unique `challengeId`, device and user refs,
  bootstrap-token hash, nonce hash, state, expiry, attempt count. Optional:
  completion/failure time and redacted failure code. Validate hashes, expiry,
  nonnegative bounded attempts, and atomic `PENDING → CONSUMED | FAILED |
  EXPIRED` transition. References must resolve to a provisioned device and
  active user.
* **`DeviceOwnership`** — Required: device ref, user ref, `startedAt`. Optional:
  `endedAt`, `endedReason`, actor ref. An active row has no `endedAt`; a
  completed row has `endedAt >= startedAt` and a reason. A unique partial
  index permits at most one active owner per device. Device/user references
  must exist; transfer ends the prior row and creates the next atomically.
* **`EmergencySession`** — Required: unique random `sessionId`, owner ref,
  state, trigger source/type, `createdAt`, `expiresAt`. Optional: device ref,
  risk-event refs, `terminalAt`, terminal reason. Validate allowed state
  transitions, expiry no later than 24 hours from creation, and that the owner
  was authorized for the device at creation.
* **`EmergencyTelemetry`** — Required: session ref, capture timestamp, allowed
  type, schema version, validated payload. Optional: device ref and sequence
  metadata. Validate payload against the package allow-list and 6-hour window;
  reject records for terminal/expired sessions. No independent user-supplied
  ownership field.
* **`LocationReading`** — Required for cloud emergency records: session ref,
  captured time, latitude, longitude, accuracy, source. Optional: device ref,
  altitude. Validate latitude/longitude ranges, accuracy, and 6-hour window.
  Routine location records remain local and are not written to this cloud
  collection.
* **`RiskEvent`** — Required: device ref, occurrence time, risk type, severity.
  Optional: emergency-session ref and bounded evidence. Validate severity,
  timestamp, and evidence schema. Store routine events locally; persist a
  cloud record only as part of an authorized active emergency package.
* **`AuditLog`** — Required: event ID, actor type, action, timestamp, result,
  request ID. Optional: actor ref for system actions, target opaque ID, and
  redacted metadata. Validate action/actor enums and size-limit metadata.
  Records are append-only; mutation/deletion is unavailable to application
  code except the scheduled expiry job.

Foreign keys/references are server-assigned and checked at every use.
Deleting a user revokes credentials and active grants first, terminally closes
their sessions, removes personal data and ownership links, and retains only
the minimum audit record until its expiry. Deleting a device's cloud
emergency package never deletes the device revocation identity or security
audit metadata before their defined retention expires.

### Uniqueness constraints

To guarantee data integrity, prevent race conditions, and block unauthorized device claiming or session collision, the database enforces the following strict uniqueness constraints:

| Collection / Model | Target Field(s) | Index Definition & Options | Security and Invariant Purpose |
|---|---|---|---|
| `Device` | `deviceId` | `{ deviceId: 1 }`, `unique: true` | Guarantees hardware identity uniqueness across the fleet. Rejects duplicate provisioning of the same physical unit. Normalized to uppercase UUIDv4. |
| `DevicePairing` | `challengeId` | `{ challengeId: 1 }`, `unique: true` | Ensures pairing challenges are globally unique and prevents collision or re-use of active challenges. |
| `DeviceOwnership` | `deviceId`, `endedAt` | `{ deviceId: 1, endedAt: 1 }`, `unique: true, partialFilterExpression: { endedAt: null }` | **Single-owner invariant:** Strictly guarantees at most one active owner (`endedAt: null`) per device at any time. Race conditions attempting simultaneous pairing fail atomically with a unique key violation (`E11000`). |
| `EmergencySession` | `sessionId` | `{ sessionId: 1 }`, `unique: true` | Prevents session ID collisions and blocks unauthorized access through predictable or duplicate identifiers (192-bit entropy). |
| `EmergencySession` | `deviceId`, `state` | `{ deviceId: 1, state: 1 }`, `unique: true, partialFilterExpression: { state: "ACTIVE" }` | **Single active emergency invariant:** Prevents multiple concurrent active emergency sessions for the same device; repeated triggers update the existing session idempotently. |
| `User` | `email` | `{ email: 1 }`, `unique: true` | Normalized lowercase email. Guarantees singular account identity and blocks account impersonation / collision. |
| `DeviceAuthNonce` | `deviceId`, `nonce` | `{ deviceId: 1, nonce: 1 }`, `unique: true`, TTL index on `expiresAt` | **Replay prevention:** Enforces single-use verification for cryptographic device nonces within the ±5-minute window; replayed nonces reject with duplicate key error. |

Uniqueness constraints are backed by database-level unique indexes in MongoDB, ensuring that application-level concurrency races cannot violate system invariants.

`DevicePairing.bootstrapTokenHash` and challenge nonce are single-use; enforce
atomic compare-and-set consumption and TTL, not just application-side checks.
`EmergencySession.sessionId` must have at least 192 bits of randomness.
Ownership must be validated server-side on every access. Sensitive fields are
not indexed or returned unless required.

## 9. Security controls and threat model

### Transport, storage, secrets

* Production APIs require HTTPS/TLS 1.2 or newer; prefer TLS 1.3 and modern
  cipher suites. Redirect HTTP only at trusted edge; APIs reject insecure
  production requests. Validate certificates and hostname on devices; do not
  disable validation or pin to an expiring leaf certificate.
* Encrypt MongoDB volumes, backups, and emergency payload fields at rest.
  Restrict production database access to the backend identity and audited
  operators. Use managed KMS/HSM for JWT signing, data-encryption keys, and
  backup keys; rotate with documented key versions.
* Store secrets in a managed secret store, never source code, client bundles,
  `.env` tracked files, logs, or telemetry. Keep local development secrets in
  ignored environment files. Hash refresh, invitation, bootstrap, and pairing
  tokens at rest; use slow password hashing for passwords.
* Redact `Authorization`, cookies, QR/bootstrap/pairing tokens, signatures,
  coordinates, health payloads, phone numbers, and emergency package bodies
  from logs and traces. Audit security events with opaque IDs and outcomes.
* Apply input/output validation, per-route authentication and authorization,
  request-size limits, bounded timeouts, rate limits, Helmet/security headers,
  CORS allow-list, and safe generic errors. Ensure proxy/trust configuration
  matches the deployed edge.

### Threats and mitigations

| Threat | Mitigation |
|---|---|
| Device ID guessing/claiming | ID is non-secret; pre-enrolled public key, one-time bootstrap token, fresh challenge, physical activation, authenticated user, atomic single-owner claim |
| BLE eavesdropping/impersonation | LE Secure Connections, authenticated OOB/numeric comparison, device key proof, bonded-key revocation, no sensitive pairing advertisements |
| Pairing brute force/replay | 5-minute nonce, one-use hashed token, atomic consumption, signed timestamp/body, nonce cache, attempt limits and lockout |
| Stolen user or device token | Short-lived audience-bound access tokens, rotated hashed refresh tokens, device key storage, revocation checks, reauthentication for transfer |
| Horizontal/vertical privilege escalation | Server-side ownership predicate on every resource, role checks, separate rescue grant, deny-by-default; no trust in frontend hiding |
| Emergency session enumeration/public exposure | 192-bit random session ID plus independent auth, generic not-found, no listing/search API, short-lived session-bound invite, access checks on every request |
| Malicious/compromised device | Per-device key and revocation, strict schemas/ranges/rate limits, bounded upload, firmware signature/secure boot, isolate device from account/user APIs |
| Duplicate/out-of-order sensor messages | Boot ID + monotonic sequence, timestamp window, idempotent key, bounded reorder buffer, reject stale or duplicate writes |
| Data breach or overcollection | Local-first default, minimal emergency package, field-level encryption, short retention, deletion verification, no sensitive logs |
| Denial of service | Per-IP/account/device limits, body and time limits, bounded retry policy, backpressure, generic responses, no unbounded session/device scans |
| Stolen rescue invitation | Verified recipient channel, single-use 15-minute invitation, scoped short-lived token, inactivity timeout, audit and immediate revocation |

### Security invariants (must always hold)

1. `deviceId` alone never claims or authenticates a device.
2. A pairing credential succeeds once only and is rejected after expiry.
3. Revoked devices cannot authenticate or upload.
4. Users can access only their authorized devices and emergency sessions.
5. Rescue users can access only sessions explicitly granted to them while active.
6. Routine telemetry is not continuously uploaded to the cloud.
7. Emergency data is bounded, time-limited, and inaccessible immediately at
   terminal state/expiry.
8. Session IDs are not credentials; sensitive information is absent from logs.
9. Authorization and state transitions are enforced server-side and auditable.
10. Expired credentials/sessions cannot be renewed implicitly or read through a
    stale cache.

## 10. Architecture diagrams

### BLE communication and reconnection sequence

```mermaid
sequenceDiagram
  actor U as User
  participant W as Wearable
  participant A as Companion App
  participant N as OS Bluetooth Stack
  U->>W: Press physical activation button
  W->>W: Open pairing window (60s timeout)
  W-->>N: BLE advertisement (service 6f2a0001)
  A->>N: Scan and discover Wearable
  A->>W: Initiate BLE connection
  W-->>A: Connected
  A->>W: Start LESC pairing (ECDH P-256)
  W->>A: Numeric Comparison / OOB confirmation
  U->>A: Confirm pairing match
  W-->>A: Link encrypted (128-bit AES-CCM) and bonded
  A->>W: Subscribe to Telemetry characteristic (6f2a0002)
  loop Continuous Telemetry (Normal Mode)
    W->>A: Notify frame (bootId, sequence, timestamp, payload <= 512B)
    A->>A: Validate schema & sequence continuity
    A->>A: Persist to encrypted local SQLite (7-day rolling)
  end
  Note over W,A: Disconnect and Reconnection Routine
  W-x A: Connection lost (out of range / low battery)
  A->>A: Transition to DISCONNECTED; start exponential backoff (1s, 2s, 4s...)
  A->>W: Reconnect & verify bonded key
  W-->>A: Reconnected; resume telemetry stream from last acknowledged sequence
```

### User → Device ownership entity diagram

```mermaid
flowchart TD
  U["User (Account)"] -->|1 : N| O["DeviceOwnership Record"]
  D["Device (Hardware UUID)"] -->|1 : N| O
  D -->|1 : 1 current| S{"Active Owner Invariant"}
  S -->|"Unique partial index: { deviceId: 1, endedAt: null }"| O
  P["DevicePairing Challenge"] -->|"Atomically consumes token & establishes"| O
  P -. "Validates Ed25519 signature proof" .-> D
  U -. "Authenticated account session" .-> P
```

### API authentication and authorization flow

```mermaid
flowchart TD
  REQ["Incoming HTTPS Request"] --> TLS["TLS 1.2+ Edge Termination"]
  TLS --> SEC["Helmet Security Headers & CORS Policy"]
  SEC --> ROUTE{"Route Type"}

  ROUTE -->|"Device Telemetry (/api/device/readings)"| D_AUTH["deviceAuth Middleware"]
  D_AUTH --> SIG_CHK{"Verify Ed25519 Canonical Signature & Body Digest"}
  SIG_CHK -->|"Invalid"| D_401["401 INVALID_CREDENTIAL"]
  SIG_CHK -->|"Valid"| SKEW_CHK{"Clock Skew Window Check (±5 minutes)"}
  SKEW_CHK -->|"Outside window"| D_SKEW["401 TIMESTAMP_OUT_OF_RANGE"]
  SKEW_CHK -->|"Within window"| NONCE_CHK{"Atomic Nonce Deduplication in DeviceAuthNonce"}
  NONCE_CHK -->|"Duplicate"| D_REPLAY["409 REPLAY_DETECTED"]
  NONCE_CHK -->|"Fresh"| D_DEV{"Verify Device State == PAIRED"}
  D_DEV -->|"REVOKED / UNREGISTERED"| D_FORBID["403 FORBIDDEN"]
  D_DEV -->|"Valid active device"| D_EXEC["Execute Ingestion Controller"]

  ROUTE -->|"User & Device APIs (/api/devices)"| U_AUTH["authMiddleware JWT Verification"]
  U_AUTH --> JWT_CHK{"Verify JWT Signature, Exp, Issuer, Subject"}
  JWT_CHK -->|"Invalid / Expired"| U_401["401 AUTHENTICATION_REQUIRED"]
  JWT_CHK -->|"Valid"| RBAC{"authorizeRole Middleware"}
  RBAC -->|"Unauthorized role"| U_403["403 FORBIDDEN"]
  RBAC -->|"Permitted role"| OWN_CHK{"Server-side Ownership: Device.userId == req.userId"}
  OWN_CHK -->|"Mismatch"| U_404["404 NOT_FOUND (Non-enumerating)"]
  OWN_CHK -->|"Matches owner / Admin"| U_EXEC["Execute Management Controller"]

  ROUTE -->|"Rescue Emergency Web (/emergency-sessions)"| R_AUTH["Verify Session-Scoped Rescue Grant"]
  R_AUTH --> R_CHK{"Validate Grant Token & Session State == ACTIVE"}
  R_CHK -->|"Invalid / Expired / Cancelled"| R_404["404 NOT_FOUND"]
  R_CHK -->|"Valid grant"| R_EXEC["Return Bounded Emergency Package"]

  D_EXEC --> AUDIT["Append to AuditLog (Opaque IDs, redacted payload)"]
  U_EXEC --> AUDIT
  R_EXEC --> AUDIT
  AUDIT --> RES["Send Standard Response Envelope { data, requestId }"]
```

### Local-first storage and normal-mode boundary

```mermaid
flowchart LR
  subgraph Local["Wearable + Companion App (Normal Operation)"]
    S["Sensors (MAX30100, MPU6050, GPS)"] --> WB["Wearable Ring Buffer"]
    WB -->|Authenticated BLE Notify| AM["App BLE Manager"]
    AM --> DB[("Encrypted Local SQLite Store\n(SQLCipher, 7-Day Rolling)")]
    DB --> UI["User Local Dashboard UI"]
  end

  DB -. "NO CONTINUOUS CLOUD UPLOAD\n(Normal Mode Air-Gap)" .x CLOUD["Cloud Backend"]

  subgraph EmergencyMode["Emergency Authorization Path"]
    S -->|Fall Event / Risk Engine / SOS| STAGE["Stage Last 6 Hours + Status"]
    UI -->|User Manual SOS / Confirmation| STAGE
    STAGE -->|TLS Upload with User Token / Device Proof| CLOUD
    CLOUD --> ACT["Active Emergency Session\n(Max 24h Hard Expiry)"]
    ACT -->|Single-Use 15m Invite| RW["Rescue Web\n(Scoped Responder Grant)"]
    ACT -->|Terminal state / Expiry| DEL["Automatic Purge Job\n(Payload deleted <= 24h)"]
  end
```

### Emergency session lifecycle sequence

```mermaid
sequenceDiagram
  actor U as Device Owner
  participant A as Companion App
  participant B as Backend API
  participant R as Rescue Web Responder
  U->>A: Confirm SOS / receive wearable fall event
  A->>A: Stage bounded package (last 6 hours telemetry & location)
  A->>B: POST /api/v1/emergency-sessions (User JWT)
  B->>B: Validate payload, verify ownership, transition to ACTIVE
  B-->>A: Emergency session created (192-bit sessionId)
  U->>B: POST /emergency-sessions/{sessionId}/invitations
  B-->>R: Single-use 15-minute invitation token
  R->>B: POST /emergency-invitations/{token}/exchange
  B->>B: Invalidate invitation; issue 15-minute scoped rescue grant
  B-->>R: Scoped rescue grant
  R->>B: GET /emergency-sessions/{sessionId} (Rescue grant)
  B-->>R: Bounded emergency data package (no routine history)
  alt Owner or Responder Resolves
    U->>B: POST /emergency-sessions/{sessionId}/resolve
    B->>B: Transition to RESOLVED; revoke all rescue grants
  else Owner Cancels
    U->>B: POST /emergency-sessions/{sessionId}/cancel
    B->>B: Transition to CANCELLED; revoke all rescue grants
  else 24-Hour Timeout Reached
    B->>B: Authoritative timer transitions session to EXPIRED; revoke grants
  end
  B->>B: Reads denied immediately; purge job hard-deletes payload <= 24 hours
```

## 11. Verification plan

These are required automated tests before the target behavior is considered
implemented. Use isolated database fixtures and deterministic clocks/nonces;
never use production credentials or real emergency contacts.

| Area | Required assertions |
|---|---|
| Device lifecycle | Valid transitions succeed; invalid transitions fail without partial writes; revoked cannot be reactivated |
| Pairing/device security | ID-only claim fails; wrong key/token fails; expired/replayed challenge fails; token is atomically single-use under concurrent requests; rate lockout applies; another owner's device cannot be claimed |
| BLE | Authenticated pairing required; legacy downgrade rejected; malformed/oversized/version-unknown payloads rejected; duplicate/out-of-order sequence behavior; disconnect/retry/stale detection; revoked bond/session rejected |
| Authentication | Missing, expired, wrong audience/issuer, revoked access/refresh token rejected; refresh rotation invalidates prior token; logout/revocation takes effect |
| Authorization | Cross-user device and emergency reads return non-enumerating not-found; user cannot call admin actions; rescue grant cannot list or access a different session |
| Emergency lifecycle | Trigger idempotency; every valid/invalid transition; owner cancel; responder resolve; 24-hour authoritative expiry; terminal state immediately denies reads and revokes grants |
| Data validation | Required fields, ranges, timestamps, schema version, payload/body limits, unknown fields, and response shape are enforced |
| Rate limits | Pairing per-device/account limits and API limits return `429` and `Retry-After`; no bypass by changing an untrusted user ID |
| Privacy/logging | Normal telemetry is not sent; emergency payload is allow-listed; logs/traces contain no tokens, health payload, coordinates, phone, or secret |
| Retention/deletion | Local 7-day cleanup and quota behavior; terminal emergency payload purge within 24h; 30-day audit purge; TTL cleanup is not relied on for access denial |

## 12. Current implementation gaps and rollout gates

The current repository has useful building blocks (user JWT middleware,
owner-scoped device management routes, rate limiting, MongoDB models, and API
tests), but these are not equivalent to this target:

* Backend pairing challenge endpoints now require a pre-provisioned device,
  one-time bootstrap token, and Ed25519 signature. Public ID-only registration
  is rejected. A trusted operator CLI provisions devices and can reissue an
  expired/absent token only for an unowned `PROVISIONED` record with the same
  public key. No real device/app currently completes this protocol.
  Challenge consumption and device ownership are transactionally coupled.
  The API enforces five signature failures per challenge and ten requests per
  account per endpoint per 15 minutes; device-wide lockout, recent
  reauthentication, physical activation, and security audit records remain
  unimplemented.
* Existing device records use `active`/`inactive`, not the lifecycle states in
  this contract. Migrate and verify records explicitly; do not map `inactive`
  to `REVOKED` or trust old ID-only claims as hardware-proven.
* Existing device telemetry routes upload to MongoDB in normal operation and
  use device ID/status lookup rather than cryptographic device authentication.
  Pairing does not secure telemetry ingestion by itself. Do not expose those
  routes in production until device signatures, replay prevention, and
  local-first upload behavior are implemented.
* A trusted operator CLI now provisions new devices from their device-generated
  Ed25519 public key, stores only a hash of the one-time bootstrap token, and
  can generate a one-time QR SVG at an explicit output path. It does not audit
  the operator.
  Existing records have not been auto-migrated or verified.
* An ESP-IDF/NimBLE firmware slice now generates an Ed25519 device key, uses
  encrypted NVS, opens a time-limited pairing window on a physical button, and
  signs the backend challenge on the documented GATT command characteristic.
  It verifies backend-signed pairing and per-connection telemetry receipts,
  and emits schema-v1 notifications containing explicit `not_integrated`
  readings until sensor drivers are added. Device information is readable only
  inside the physical activation window. The Settings dashboard scans a
  pairing QR, completes the proof, installs owner/session receipts, and keeps
  the authorized BLE session active. The firmware has not been compiled or
  radio-tested; authenticated user identity is provided by backend receipts
  over an encrypted Just Works link, not BLE MITM pairing. Sensor/battery
  integration and unpair/revocation synchronization remain implementation
  work. Dashboard ID-only pairing is disabled.
* Pairing challenge records now exist, but ownership history, emergency
  sessions, and an append-oriented audit log are not implemented.
* Current access tokens and API paths are not yet the versioned contract above.
  Pairing currently uses the existing user JWT without a recent-reauthentication
  check. Add `/api/v1` without silently changing existing clients, then migrate
  and retire prototype routes deliberately.

Production rollout is blocked until device credentials are provisioned
securely, normal-mode telemetry is local-only, emergency endpoints enforce
session-scoped access and expiry, retention/deletion jobs are monitored, and
the security tests in §11 pass.

## 13. Day 3 exit criteria and concrete architectural answers

Day 3 must not move to implementation until the following questions have concrete, definitive answers documented and verified against the architecture contract:

### 1. How does a device prove that it is the legitimate device?
The device holds a unique Ed25519 private key generated in secure hardware during trusted manufacturing provisioning. The backend stores only the matching SPKI public key (`Device.publicKey`) and key version. When authenticating telemetry or pairing challenges, the device signs a canonical request containing the HTTP method, path, request body digest (SHA-256), timestamp, and a fresh nonce. The backend verifies this digital signature using the pre-enrolled public key. The private key never leaves the physical wearable hardware.

### 2. How does a user prove ownership of a device?
Ownership is established through an authenticated multi-factor ceremony: (1) an authenticated user account session (verified JWT), (2) possession of the sealed 256-bit bootstrap QR token (valid for 30 days from factory provisioning), (3) physical button activation on the device within a 60-second window, and (4) cryptographic signature of a backend-issued challenge nonce by the device's hardware key. The backend transactionally binds `userId` to `deviceId` in `Device` and `DeviceOwnership`. Subsequent user actions require the user's JWT, and the backend verifies `Device.userId === req.userId` server-side on every request.

### 3. Why can’t knowing deviceId claim a device?
`deviceId` is public, non-secret metadata (a UUIDv4 identifier). Claiming a device requires: (1) an active, verified user account session, (2) the sealed single-use 256-bit bootstrap token matching the provisioned `bootstrapTokenHash`, (3) physical proximity and manual depression of the hardware pairing button to open the BLE advertising window, and (4) an Ed25519 signature generated by the hardware device signing the fresh 256-bit challenge nonce issued by the backend. A malicious actor possessing only the `deviceId` cannot generate the challenge signature or produce the unhashed bootstrap token, and is rejected with `404` or `401`.

### 4. How does BLE pairing prevent unauthorized connections?
The wearable does not continuously advertise in connectable mode. Pairing mode is opened exclusively via a manual physical button press and automatically terminates after 60 seconds. Pairing enforces Bluetooth LE Security Mode 1, Level 4 (LE Secure Connections using Elliptic Curve Diffie-Hellman P-256 key exchange) with authenticated Numeric Comparison / Out-Of-Band (OOB) confirmation, prohibiting legacy unauthenticated "Just Works" pairing. All subsequent GATT characteristics (telemetry, control, status, battery) require bonded 128-bit AES-CCM link-layer encryption.

### 5. What data remains local during normal operation?
All continuous vital signs (heart rate, SpO2, skin temperature, GSR), motion and posture data (MPU6050 accelerometer and gyroscope samples), environmental readings (temperature, humidity, atmospheric pressure), GPS location breadcrumbs, and routine risk engine assessments remain strictly stored in the companion app's encrypted local SQLite database (SQLCipher) under a rolling 7-day retention window. None of this data is continuously uploaded to the cloud backend during normal operation.

### 6. What exact data leaves the app during an emergency?
Only the strictly bounded emergency data package: (1) `sessionId` (192-bit opaque random token), (2) emergency trigger metadata (source: wearable risk engine / app / manual SOS, type, timestamp), (3) latest location and recent location trail from at most the preceding **6 hours**, (4) latest vitals and relevant telemetry from at most the preceding **6 hours**, (5) current device status (battery percentage, sensor health flags, firmware version), and (6) user display name and emergency contact callback (only if authorized). Older routine history (>6 hours), passwords, private keys, authentication tokens, and unrelated personal data never leave the app.

### 7. Who can access an emergency session?
Only two parties: (1) The device owner (authenticated via their user JWT), and (2) Authorized emergency responders who have received an explicit session-specific invitation and exchanged it for a short-lived (15-minute), session-scoped rescue grant. General users, unauthenticated clients, and rescue users without a valid grant for that specific `sessionId` cannot view or query the session.

### 8. How does an emergency session expire?
An active emergency session has a strict, authoritative server-enforced expiration deadline of at most **24 hours** from creation (`expiresAt = createdAt + 24h`). It cannot be extended or renewed implicitly. Once `expiresAt` is reached or the session is explicitly marked `RESOLVED` or `CANCELLED`, the server immediately rejects all subsequent read and write requests with `404` or `410`.

### 9. How are revoked devices/users blocked?
* **Revoked devices:** A device in state `REVOKED` is permanently denied authentication. `deviceAuthMiddleware` verifies device state on every telemetry request and rejects revoked devices with `403 FORBIDDEN`. Pairing challenges cannot be created for revoked devices.
* **Revoked users:** User revocation invalidates all issued JWTs and refresh tokens; `authMiddleware` checks user account status against the database on each authenticated request and terminates active sessions immediately.

### 10. How is horizontal privilege escalation prevented?
Every backend route enforcing resource access applies a strict server-side ownership predicate. User device routes filter by `{ deviceId: normalizedDeviceId, userId: req.userId }`. The backend never trusts client-supplied `userId` parameters in request bodies or query strings to determine resource access. If a user attempts to access or modify a device or session belonging to another user, the server returns a non-enumerating `404 Not Found`.

### 11. How are API requests authenticated?
* **User/App requests:** Authenticated via short-lived JSON Web Tokens (15-minute validity) passed in the `Authorization: Bearer <token>` header, verified for cryptographic signature, issuer, audience, and expiration. Refresh tokens are opaque, stored as SHA-256 hashes, and rotated on every exchange.
* **Device telemetry requests:** Authenticated using canonical Ed25519 HTTP signatures generated by the hardware device private key, verified via `X-Device-Id`, `X-Device-Timestamp`, `X-Device-Nonce`, and `X-Device-Signature` headers with raw request body SHA-256 digest validation.

### 12. How are API requests authorized?
Following successful authentication, authorization is enforced in three sequential tiers: (1) Role-Based Access Control via `authorizeRole` middleware checking user roles (`citizen`, `responder`, `coordinator`, `admin`) against required permissions, (2) Resource Ownership verification matching the authenticated identity (`req.userId`) against database resource records, and (3) Session-Scoped Grant verification for emergency rescue operations. Requests failing any check are denied by default (`403` or `404`).

### 13. How are pairing and replay attacks prevented?
* **Pairing attacks:** Pairing tokens are single-use 256-bit secrets stored as SHA-256 hashes; challenges include a fresh 256-bit nonce with a 5-minute TTL; pairing completion atomically consumes the challenge and bootstrap token within a database transaction; rate limits enforce a maximum of 5 failed signature attempts per challenge and 10 requests per account per 15 minutes before temporary lockout.
* **Device telemetry replay attacks:** Telemetry requests require an RFC 3339 timestamp strictly within a ±5-minute window of server time. Every request nonce is recorded in the `DeviceAuthNonce` collection with a unique compound index `{ deviceId: 1, nonce: 1 }` and a MongoDB TTL index. Any duplicated nonce within the valid window is rejected with `409 REPLAY_DETECTED`.

### 14. How are sensitive operations audited?
All security-sensitive operations (device provisioning, pairing challenge creation, pairing completion, unpairing, device status changes, administrative actions, emergency session creation, responder invitations, invitation exchanges, and cancellations/resolutions) write an append-only entry to `AuditLog`. Each entry includes `eventId`, `actorType`, `actorId`, `action`, `targetId`, `timestamp`, `result`, `requestId`, and client IP. Audit records cannot be modified or deleted through application APIs.

### 15. How is sensitive data prevented from appearing in logs?
The application logging middleware strictly sanitizes and redacts all sensitive fields: `Authorization` headers, cookies, raw bootstrap QR tokens, pairing challenge nonces, digital signatures, GPS coordinates, vital sign readings, phone numbers, and emergency package request bodies. Logs contain only high-level structural metadata: HTTP method, path, response status code, elapsed duration, request ID, and opaque resource identifiers.

### 16. What happens when the network is unavailable?
The system operates autonomously in local-first mode. All sensor sampling, telemetry buffering, and on-device risk engine evaluations continue without disruption. Data is saved to the companion app's local encrypted SQLite database. If an emergency is triggered while offline, the app queues the emergency package locally and initiates automatic retries with exponential backoff while alerting the user that cloud transmission is pending network availability.

### 17. What happens when BLE disconnects?
When the BLE link disconnects, the wearable continues sampling and buffers telemetry frames in its internal circular ring buffer. The companion app transitions its connection state machine to `DISCONNECTED` and immediately surfaces a disconnected status indicator in the UI without fabricating data. The app initiates automatic background reconnection using exponential backoff with jitter (1s, 2s, 4s, 8s, 16s, 30s) up to 10 attempts. Upon reconnecting and verifying the bonded link, telemetry stream sequencing resumes from the last acknowledged sequence number.

### 18. What happens when a device is already paired?
If a user attempts to initiate a pairing challenge for a device currently in the `PAIRED` state: (1) If requested by an unauthorized user, the backend returns a generic conflict error (`404` or `409 DEVICE_STATE_CONFLICT`) without revealing owner information; (2) If requested by the existing owner, the dashboard notifies them that the device is already paired to their account. A device cannot be claimed by a new owner without the current owner first unpairing it or an authorized administrative recovery.

### 19. What happens when a device is revoked?
When a device is revoked by an administrator, its state transitions permanently to `REVOKED`. The backend immediately invalidates all active pairing challenges, terminates active emergency sessions associated with the device, and writes an audit event. Any subsequent telemetry or pairing requests signed by the device are rejected with `403 FORBIDDEN`. A revoked device cannot transition back to `PROVISIONED` or `PAIRED`; replacement requires enrolling a new physical device record.

### 20. What happens when an emergency session expires?
When an active emergency session reaches its 24-hour lifetime limit, it transitions authoritatively to the terminal `EXPIRED` state. All active rescue responder grants are immediately revoked. Any subsequent attempt to read or modify the emergency session returns `404` or `410`. An automated asynchronous cleanup job permanently purges the stored emergency telemetry and location package within 24 hours of expiration, retaining only minimal non-sensitive audit metadata for 30 days.

