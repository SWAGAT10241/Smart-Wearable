package auth

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	ErrNoTicketProvided     = errors.New("no authentication ticket provided in subprotocol header")
	ErrInvalidTicket        = errors.New("invalid or expired ticket")
	ErrTicketVerification   = errors.New("ticket verification service unavailable")
)

// AuthenticatedSession holds the verified identity and permissions of a connected client.
type AuthenticatedSession struct {
	UserID    string `json:"userId"`
	Role      string `json:"role"`
	ExpiresAt int64  `json:"expiresAt"`
}

// Validator handles consuming single-use WebSocket tickets.
type Validator struct {
	redisClient *redis.Client
	nodeAPIURL  string
	httpClient  *http.Client
}

// NewValidator initializes the ticket validator.
func NewValidator(redisClient *redis.Client, nodeAPIURL string) *Validator {
	return &Validator{
		redisClient: redisClient,
		nodeAPIURL:  nodeAPIURL,
		httpClient: &http.Client{
			Timeout: 3 * time.Second,
		},
	}
}

// ExtractTicketFromProtocol parses the subprotocol header (e.g. "trailguard, ticket.<token>").
func ExtractTicketFromProtocol(header string) (string, error) {
	if header == "" {
		return "", ErrNoTicketProvided
	}

	parts := strings.Split(header, ",")
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if strings.HasPrefix(trimmed, "ticket.") {
			ticket := strings.TrimPrefix(trimmed, "ticket.")
			if len(ticket) > 0 {
				return ticket, nil
			}
		}
	}

	return "", ErrNoTicketProvided
}

// VerifyAndConsume consumes the single-use ticket atomically (Invariant 5).
func (v *Validator) VerifyAndConsume(ctx context.Context, ticket string) (*AuthenticatedSession, error) {
	if ticket == "" {
		return nil, ErrNoTicketProvided
	}

	// 1. Try atomic Redis consumption first (Fastest: <1ms)
	if v.redisClient != nil {
		key := fmt.Sprintf("ws_ticket:%s", ticket)
		val, err := v.redisClient.GetDel(ctx, key).Result()
		if err == nil && val != "" {
			var session AuthenticatedSession
			if err := json.Unmarshal([]byte(val), &session); err == nil {
				return &session, nil
			}
		}
	}

	// 2. Fallback to Node.js verification endpoint (MongoDB findOneAndDelete)
	verifyURL := fmt.Sprintf("%s/api/emergency/ws-ticket/verify", v.nodeAPIURL)
	payloadBytes, _ := json.Marshal(map[string]string{"ticket": ticket})
	req, err := http.NewRequestWithContext(ctx, "POST", verifyURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, ErrTicketVerification
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := v.httpClient.Do(req)
	if err != nil {
		return nil, ErrTicketVerification
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		var session AuthenticatedSession
		if err := json.NewDecoder(resp.Body).Decode(&session); err == nil {
			return &session, nil
		}
	}

	if resp.StatusCode == http.StatusUnauthorized || resp.StatusCode == http.StatusNotFound {
		return nil, ErrInvalidTicket
	}

	return nil, ErrInvalidTicket
}
