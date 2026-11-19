package hub

import (
	"testing"
	"time"

	"github.com/trailguard/gateway-go/internal/packet"
)

func TestHubRegistrationAndScopedDelivery(t *testing.T) {
	h := NewHub()

	client1 := &Client{
		ID:        "client-1",
		DeviceID:  "TRAILGUARD-DEV001",
		SendChan:  make(chan []byte, 10),
	}
	client2 := &Client{
		ID:        "client-2",
		DeviceID:  "TRAILGUARD-OTHER",
		SendChan:  make(chan []byte, 10),
	}

	h.Register(client1)
	h.Register(client2)

	totalClients, _, _ := h.Stats()
	if totalClients != 2 {
		t.Fatalf("Expected 2 clients, got %d", totalClients)
	}

	frame := &packet.TelemetryFrame{
		DeviceID:     "TRAILGUARD-DEV001",
		TimestampMs:  1700000000000,
		HeartRate:    72,
		SpO2:         99,
		TemperatureC: 36.5,
	}

	if err := h.BroadcastTelemetry(frame); err != nil {
		t.Fatalf("Broadcast failed: %v", err)
	}

	// Client 1 should receive message
	select {
	case msg := <-client1.SendChan:
		if len(msg) == 0 {
			t.Errorf("Received empty payload on client1")
		}
	case <-time.After(100 * time.Millisecond):
		t.Errorf("Client 1 timed out waiting for scoped telemetry")
	}

	// Client 2 should NOT receive message (scoped isolation)
	select {
	case msg := <-client2.SendChan:
		t.Errorf("Client 2 unexpectedly received frame: %s", string(msg))
	case <-time.After(50 * time.Millisecond):
		// Expected
	}

	// Unregister
	h.Unregister(client1.ID)
	h.Unregister(client2.ID)

	clientsLeft, _, _ := h.Stats()
	if clientsLeft != 0 {
		t.Errorf("Expected 0 clients left, got %d", clientsLeft)
	}
}
