package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/auth"
	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/bus"
	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/config"
	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/udp"
	"github.com/SWAGAT10241/Smart-Wearable/services/gateway-go/internal/ws"
	"github.com/redis/go-redis/v9"
)

var startTime = time.Now()

func main() {
	log.Println("=============================================================")
	log.Println("🚀 SWAAS / TrailGuard — Go Real-Time Ingestion Gateway v1.0.0")
	log.Println("=============================================================")

	cfg := config.Load()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// 1. Initialize Redis Event Bus
	eventBus, err := bus.NewEventBus(cfg.RedisAddr, cfg.RedisPassword)
	if err != nil {
		log.Fatalf("Fatal: failed to initialize event bus: %v", err)
	}
	defer eventBus.Close()

	// 2. Initialize Single-Use Ticket Validator
	var rdb *redis.Client
	if cfg.RedisAddr != "" {
		rdb = redis.NewClient(&redis.Options{
			Addr:     cfg.RedisAddr,
			Password: cfg.RedisPassword,
		})
	}
	validator := auth.NewValidator(rdb, cfg.NodeAPIURL)

	// 3. Initialize WebSocket Hub
	hub := ws.NewHub(eventBus, validator)
	go hub.Run(ctx)

	// 4. Start LoRa UDP Listener
	loraListener := udp.NewLoRaListener(cfg.UDPPort, hub)
	go func() {
		if err := loraListener.Start(ctx); err != nil {
			log.Printf("[LoRa UDP] Listener exited: %v", err)
		}
	}()

	// 5. Setup HTTP Router
	mux := http.NewServeMux()

	// WebSocket real-time endpoint
	mux.HandleFunc("/live", hub.ServeWS)

	// Health check liveness probe
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  "healthy",
			"service": "gateway-go",
			"time":    time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Metrics endpoint
	mux.HandleFunc("/metrics", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"service":        "gateway-go",
			"uptime_seconds": time.Since(startTime).Seconds(),
			"clients_active": hub.ClientCount(),
		})
	})

	serverAddr := fmt.Sprintf(":%d", cfg.Port)
	srv := &http.Server{
		Addr:         serverAddr,
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	// Start server in background goroutine
	go func() {
		log.Printf("[HTTP] WebSocket & Ingestion server listening on %s", serverAddr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Fatal: HTTP server failed: %v", err)
		}
	}()

	// Graceful shutdown listener
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	log.Println("\n[Shutdown] Shutting down Go Ingestion Gateway gracefully...")
	cancel()

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("[Shutdown] Server forced to shutdown: %v", err)
	}

	log.Println("[Shutdown] Gateway terminated cleanly.")
}
