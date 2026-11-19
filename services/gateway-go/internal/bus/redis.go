package bus

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/telemetry"
	"github.com/redis/go-redis/v9"
)

const (
	ChannelTelemetryRaw      = "telemetry:raw"
	ChannelTelemetryVerified = "telemetry:verified"
	ChannelEmergencyAlerts   = "emergency:alerts"
)

// EventBus manages high-speed Redis message publication and subscription.
type EventBus struct {
	client *redis.Client
}

// NewEventBus connects to Redis with health validation.
func NewEventBus(addr, password string) (*EventBus, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       0,
	})

	ctx := context.Background()
	if err := client.Ping(ctx).Err(); err != nil {
		log.Printf("[EventBus] Warning: Redis connection failed at %s (%v). Running in local mode.", addr, err)
		return &EventBus{client: nil}, nil
	}

	log.Printf("[EventBus] Connected successfully to Redis at %s", addr)
	return &EventBus{client: client}, nil
}

// PublishTelemetry distributes an ingested telemetry frame to subscriber microservices.
func (b *EventBus) PublishTelemetry(ctx context.Context, frame *telemetry.TelemetryFrame) error {
	if b.client == nil {
		return nil // No-op if Redis is unavailable
	}

	data, err := json.Marshal(frame)
	if err != nil {
		return fmt.Errorf("failed to marshal telemetry frame: %w", err)
	}

	// Always publish to raw channel
	if err := b.client.Publish(ctx, ChannelTelemetryRaw, data).Err(); err != nil {
		return fmt.Errorf("failed to publish to %s: %w", ChannelTelemetryRaw, err)
	}

	// If emergency flag is set, publish to emergency alert channel
	if frame.Emergency {
		if err := b.client.Publish(ctx, ChannelEmergencyAlerts, data).Err(); err != nil {
			return fmt.Errorf("failed to publish emergency alert: %w", err)
		}
	}

	// If session-scoped, publish to session channel (Invariant 6)
	if frame.SessionID != "" {
		sessionChannel := fmt.Sprintf("session:%s:telemetry", frame.SessionID)
		_ = b.client.Publish(ctx, sessionChannel, data).Err()
	}

	return nil
}

// Close gracefully disconnects Redis client.
func (b *EventBus) Close() error {
	if b.client != nil {
		return b.client.Close()
	}
	return nil
}
