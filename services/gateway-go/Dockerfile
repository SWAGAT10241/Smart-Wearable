# =========================================================================
# Multi-Stage Production Dockerfile for Go Real-Time Ingestion Gateway
# =========================================================================

# Stage 1: Builder
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install git and ca-certificates
RUN apk add --no-cache git ca-certificates

# Cache dependencies
COPY go.mod go.sum* ./
RUN go mod download || true

# Copy source code
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o /app/gateway \
    ./cmd/server

# Stage 2: Minimal Runtime Container
FROM alpine:3.20

WORKDIR /app

# Install ca-certificates for outbound TLS/HTTPS calls to Node.js
RUN apk add --no-cache ca-certificates tzdata

# Create non-root system user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy binary from builder
COPY --from=builder /app/gateway /app/gateway

# Expose WebSocket HTTP port (8080) and LoRa UDP port (9090)
EXPOSE 8080 9090/udp

# Health check probe
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/healthz || exit 1

ENTRYPOINT ["/app/gateway"]
