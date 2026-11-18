package ws

import (
	"encoding/json"
	"log"
	"time"

	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/auth"
	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/telemetry"
	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512 * 1024 // 512 KB
)

// Client represents a single persistent WebSocket connection.
type Client struct {
	Hub       *Hub
	Conn      *websocket.Conn
	Send      chan []byte
	Session   *auth.AuthenticatedSession
	SessionID string // Subscribed emergency session ID (Invariant 6)
}

// readPump pumps messages from the websocket connection to the hub.
func (c *Client) readPump() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadLimit(maxMessageSize)
	_ = c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error {
		_ = c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("[WS Client] Disconnect: %v", err)
			}
			break
		}

		// Parse incoming telemetry frame
		var frame telemetry.TelemetryFrame
		if err := json.Unmarshal(message, &frame); err == nil {
			// Attach verified user identity
			frame.UserID = c.Session.UserID
			if c.SessionID != "" && frame.SessionID == "" {
				frame.SessionID = c.SessionID
			}

			// Validate sensor packet sanity
			if err := frame.Validate(); err == nil {
				c.Hub.Incoming <- &frame
			} else {
				log.Printf("[WS Client] Discarding invalid frame from user %s: %v", c.Session.UserID, err)
			}
		}
	}
}

// writePump pumps messages from the hub to the websocket connection.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			_ = c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// Hub closed the channel
				_ = c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			_, _ = w.Write(message)

			// Add queued chat messages to the current websocket message
			n := len(c.Send)
			for i := 0; i < n; i++ {
				_, _ = w.Write([]byte{'\n'})
				_, _ = w.Write(<-c.Send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			_ = c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
