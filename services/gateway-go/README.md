# 🦫 SWAAS / TrailGuard — Go Real-Time Ingestion Gateway

**Service Name:** `gateway-go`  
**Port:** `8080` (WebSocket / HTTP), `9090` (UDP LoRa Burst)  
**Architecture Spec:** [docs/POLYGLOT_ARCHITECTURE_PLAN.md](../../docs/POLYGLOT_ARCHITECTURE_PLAN.md)  
**Tracking Issue:** [#159](https://github.com/SWAGAT10241/Smart-Wearable/issues/159)

---

## 🧭 Overview

The **Go Ingestion Gateway** is the high-concurrency ingestion engine for the SWAAS / TrailGuard ecosystem. It offloads real-time networking from the Node.js application service to handle **100,000+ simultaneous wearable connections** with minimal memory overhead (~2KB per goroutine) and sub-millisecond telemetry fan-out.

```mermaid
flowchart LR
    ESP["ESP32-S3 Wearables"] -->|WebSocket Stream| GW["Go Gateway (:8080)"]
    LORA["Basecamp LoRa Relays"] -->|UDP Burst (:9090)| GW
    GW -->|Pub/Sub < 1ms| REDIS[("Redis Bus")]
    GW <-->|Ticket Handshake| NODE["Node.js Coordinator (:5001)"]
    GW -->|Session-Scoped Stream| DASH["Rescue Web Dashboard"]
```

---

## ⚡ Key Capabilities

1. **High-Concurrency WebSockets:**
   - Handles persistent streams on `/live`.
   - Goroutine-per-client model with automatic ping/pong keepalives (60s ticker) and backpressure handling.
2. **Strict Single-Use Ticket Handshake (Invariant 5):**
   - Validates ephemeral 60s tickets from `Sec-WebSocket-Protocol: trailguard, ticket.<token>`.
   - Supports atomic consumption via Redis `GETDEL` or Node.js internal fallback.
3. **Session-Scoped Broadcast Routing (Invariant 6):**
   - General subscribers only receive incident alerts; live telemetry frames are strictly isolated to verified subscribers of `sessionId`.
4. **LoRa Basecamp UDP Burst Listener:**
   - Binds to `0.0.0.0:9090` to receive off-grid packet bursts from forward mountain basecamps.
5. **Redacted Logging (Invariant 7):**
   - Sensitive biometrics and GPS coordinate decimals are automatically stripped from standard log outputs.

---

## 🔧 Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `GATEWAY_PORT` | HTTP & WebSocket server port | `8080` |
| `LORA_UDP_PORT` | Basecamp UDP burst listener port | `9090` |
| `REDIS_ADDR` | Redis instance address | `localhost:6379` |
| `REDIS_PASSWORD` | Redis authentication password | *(empty)* |
| `NODE_API_URL` | Upstream Node.js coordinator address | `http://localhost:5001` |
| `APP_ENV` | Application environment (`development` / `production`) | `development` |

---

## 🚀 Endpoints

- `GET /live`: WebSocket upgrade endpoint (requires single-use ticket).
- `GET /healthz`: Container and liveness health probe.
- `GET /metrics`: Uptime and active connection telemetry.

---

## 🧪 Testing

```bash
# Run unit tests
go test -v ./internal/...

# Run with race detector
go test -race ./internal/...
```

---

## 🐳 Container Deployment

```bash
# Build multi-stage image
docker build -t trailguard-gateway-go .

# Run container
docker run -p 8080:8080 -p 9090:9090/udp trailguard-gateway-go
```
