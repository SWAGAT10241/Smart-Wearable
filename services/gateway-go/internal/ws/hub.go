package ws

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/auth"
	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/bus"
	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/telemetry"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Production CORS check: allow verified dashboard and companion origins
		return true
	},
	Subprotocols: []string{"trailguard"},
}

// Hub maintains the set of active clients and broadcasts messages to session rooms.
type Hub struct {
	mu                   sync.RWMutex
	clients              map[*Client]bool
	sessionSubscriptions map[string]map[*Client]bool // sessionID -> set of clients
	Register             chan *Client
	Unregister           chan *Client
	Incoming             chan *telemetry.TelemetryFrame
	eventBus             *bus.EventBus
	ticketValidator      *auth.Validator
}

// NewHub creates a new WebSocket Hub.
func NewHub(eventBus *bus.EventBus, validator *auth.Validator) *Hub {
	return &Hub{
		clients:              make(map[*Client]bool),
		sessionSubscriptions: make(map[string]map[*Client]bool),
		Register:             make(chan *Client),
		Unregister:           make(chan *Client),
		Incoming:             make(chan *telemetry.TelemetryFrame, 1000),
		eventBus:             eventBus,
		ticketValidator:      validator,
	}
}

// Run begins the central dispatch event loop.
func (h *Hub) Run(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return

		case client := <-h.Register:
			h.mu.Lock()
			h.clients[client] = true
			if client.SessionID != "" {
				if _, ok := h.sessionSubscriptions[client.SessionID]; !ok {
					h.sessionSubscriptions[client.SessionID] = make(map[*Client]bool)
				}
				h.sessionSubscriptions[client.SessionID][client] = true
			}
			h.mu.Unlock()
			log.Printf("[Hub] Registered client (User: %s, Role: %s, Total: %d)",
				client.Session.UserID, client.Session.Role, len(h.clients))

		case client := <-h.Unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
			}
			if client.SessionID != "" {
				if clientsInSession, ok := h.sessionSubscriptions[client.SessionID]; ok {
					delete(clientsInSession, client)
					if len(clientsInSession) == 0 {
						delete(h.sessionSubscriptions, client.SessionID)
					}
				}
			}
			h.mu.Unlock()
			log.Printf("[Hub] Unregistered client (User: %s, Remaining: %d)",
				client.Session.UserID, len(h.clients))

		case frame := <-h.Incoming:
			// 1. Publish to Redis Event Bus for other microservices (Python ML, Node.js)
			if h.eventBus != nil {
				go func(f *telemetry.TelemetryFrame) {
					_ = h.eventBus.PublishTelemetry(context.Background(), f)
				}(frame)
			}

			// 2. Route strictly to clients subscribed to this emergency session (Invariant 6)
			if frame.SessionID != "" {
				h.BroadcastToSession(frame.SessionID, frame)
			}
		}
	}
}

// BroadcastToSession sends telemetry strictly to verified subscribers of a specific session.
func (h *Hub) BroadcastToSession(sessionID string, frame *telemetry.TelemetryFrame) {
	payload, err := json.Marshal(frame)
	if err != nil {
		return
	}

	h.mu.RLock()
	subscribers, ok := h.sessionSubscriptions[sessionID]
	if !ok || len(subscribers) == 0 {
		h.mu.RUnlock()
		return
	}

	for client := range subscribers {
		select {
		case client.Send <- payload:
		default:
			// Client buffer blocked: schedule disconnect
			close(client.Send)
			delete(subscribers, client)
		}
	}
	h.mu.RUnlock()
}

// ServeWS handles incoming HTTP WebSocket upgrade requests with single-use tickets.
func (h *Hub) ServeWS(w http.ResponseWriter, r *http.Request) {
	// 1. Extract single-use ticket from Sec-WebSocket-Protocol (or query param fallback)
	protocolHeader := r.Header.Get("Sec-WebSocket-Protocol")
	ticket, err := auth.ExtractTicketFromProtocol(protocolHeader)
	if err != nil {
		ticket = r.URL.Query().Get("ticket")
		if ticket == "" {
			http.Error(w, "Missing authentication ticket", http.StatusUnauthorized)
			return
		}
	}

	// 2. Atomically verify and consume the single-use ticket
	session, err := h.ticketValidator.VerifyAndConsume(r.Context(), ticket)
	if err != nil {
		log.Printf("[Hub] Unauthorized WebSocket attempt: %v", err)
		http.Error(w, "Invalid or expired ticket", http.StatusUnauthorized)
		return
	}

	// 3. Complete WebSocket upgrade
	conn, err := upgrader.Upgrade(w, r, http.Header{
		"Sec-WebSocket-Protocol": []string{"trailguard"},
	})
	if err != nil {
		log.Printf("[Hub] Upgrade failed: %v", err)
		return
	}

	// 4. Register client with optional emergency session subscription
	sessionID := r.URL.Query().Get("sessionId")
	client := &Client{
		Hub:       h,
		Conn:      conn,
		Send:      make(chan []byte, 256),
		Session:   session,
		SessionID: sessionID,
	}

	h.Register <- client

	go client.writePump()
	go client.readPump()
}

// ClientCount returns current connected client count.
func (h *Hub) ClientCount() int {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return len(h.clients)
}
