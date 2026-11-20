package hub

import (
	"encoding/json"
	"sync"
	"time"

	"github.com/trailguard/gateway-go/internal/packet"
)

// Client represents an authenticated listener (rescuer or user app).
type Client struct {
	ID        string
	SessionID string // Optional: scoped to specific emergency session
	DeviceID  string // Optional: scoped to specific device
	SendChan  chan []byte
}

// Hub manages active connections and session-scoped / device-scoped telemetry routing.
type Hub struct {
	mu           sync.RWMutex
	clients      map[string]*Client
	sessionIndex map[string]map[string]*Client
	deviceIndex  map[string]map[string]*Client
	totalIngested uint64
}

// NewHub initializes an empty Hub.
func NewHub() *Hub {
	return &Hub{
		clients:      make(map[string]*Client),
		sessionIndex: make(map[string]map[string]*Client),
		deviceIndex:  make(map[string]map[string]*Client),
	}
}

// Register adds a new client to the hub with scoping.
func (h *Hub) Register(c *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	h.clients[c.ID] = c

	if c.SessionID != "" {
		if _, ok := h.sessionIndex[c.SessionID]; !ok {
			h.sessionIndex[c.SessionID] = make(map[string]*Client)
		}
		h.sessionIndex[c.SessionID][c.ID] = c
	}

	if c.DeviceID != "" {
		if _, ok := h.deviceIndex[c.DeviceID]; !ok {
			h.deviceIndex[c.DeviceID] = make(map[string]*Client)
		}
		h.deviceIndex[c.DeviceID][c.ID] = c
	}
}

// Unregister cleanly removes a client.
func (h *Hub) Unregister(clientID string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	c, ok := h.clients[clientID]
	if !ok {
		return
	}

	delete(h.clients, clientID)

	if c.SessionID != "" && h.sessionIndex[c.SessionID] != nil {
		delete(h.sessionIndex[c.SessionID], clientID)
		if len(h.sessionIndex[c.SessionID]) == 0 {
			delete(h.sessionIndex, c.SessionID)
		}
	}

	if c.DeviceID != "" && h.deviceIndex[c.DeviceID] != nil {
		delete(h.deviceIndex[c.DeviceID], clientID)
		if len(h.deviceIndex[c.DeviceID]) == 0 {
			delete(h.deviceIndex, c.DeviceID)
		}
	}

	close(c.SendChan)
}

// BroadcastTelemetry dispatches an unpacked frame strictly to authorized listeners.
func (h *Hub) BroadcastTelemetry(frame *packet.TelemetryFrame) error {
	payload, err := json.Marshal(map[string]interface{}{
		"type":      "telemetry",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"data":      frame,
	})
	if err != nil {
		return err
	}

	h.mu.Lock()
	h.totalIngested++
	h.mu.Unlock()

	h.mu.RLock()
	defer h.mu.RUnlock()

	// 1. Deliver to device-scoped listeners
	if listeners, ok := h.deviceIndex[frame.DeviceID]; ok {
		for _, client := range listeners {
			select {
			case client.SendChan <- payload:
			default:
				// Channel saturated, drop frame to protect real-time latency
			}
		}
	}

	return nil
}

// Stats returns real-time hub statistics.
func (h *Hub) Stats() (clientCount int, sessionCount int, ingested uint64) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return len(h.clients), len(h.sessionIndex), h.totalIngested
}
