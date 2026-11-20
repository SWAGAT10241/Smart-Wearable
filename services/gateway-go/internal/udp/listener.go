package udp

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"

	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/telemetry"
	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/ws"
)

// LoRaListener listens on UDP for forward basecamp LoRa packet relays.
type LoRaListener struct {
	port int
	hub  *ws.Hub
}

// NewLoRaListener initializes the UDP listener.
func NewLoRaListener(port int, hub *ws.Hub) *LoRaListener {
	return &LoRaListener{
		port: port,
		hub:  hub,
	}
}

// Start binds to the UDP port and processes incoming LoRa datagram bursts.
func (l *LoRaListener) Start(ctx context.Context) error {
	addr := fmt.Sprintf("0.0.0.0:%d", l.port)
	conn, err := net.ListenPacket("udp", addr)
	if err != nil {
		return fmt.Errorf("failed to bind LoRa UDP listener on %s: %w", addr, err)
	}
	defer conn.Close()

	log.Printf("[LoRa UDP] Basecamp burst listener active on %s", addr)

	go func() {
		<-ctx.Done()
		_ = conn.Close()
	}()

	buf := make([]byte, 2048)
	for {
		n, remoteAddr, err := conn.ReadFrom(buf)
		if err != nil {
			select {
			case <-ctx.Done():
				return nil
			default:
				log.Printf("[LoRa UDP] Read error from %v: %v", remoteAddr, err)
				continue
			}
		}

		// Parse incoming LoRa telemetry packet
		var frame telemetry.TelemetryFrame
		if err := json.Unmarshal(buf[:n], &frame); err != nil {
			log.Printf("[LoRa UDP] Malformed packet from %v (size: %d bytes)", remoteAddr, n)
			continue
		}

		if err := frame.Validate(); err != nil {
			log.Printf("[LoRa UDP] Rejected invalid frame from %s: %v", frame.DeviceID, err)
			continue
		}

		log.Printf("[LoRa UDP] Accepted valid burst: %s from basecamp %v",
			frame.RedactedSummary(), remoteAddr)

		// Inject directly into WebSocket Hub & Redis bus
		l.hub.Incoming <- &frame
	}
}
