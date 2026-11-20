package main

import (
	"context"
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
)

func main() {
	cfg := config.Load()
	log.Printf("[Gateway-Go] Starting on port %d, UDP port %d", cfg.Port, cfg.UDPPort)

	eventBus, err := bus.NewEventBus(cfg.RedisAddr, cfg.RedisPassword)
	if err != nil {
		log.Printf("[Gateway-Go] Redis warning: %v (continuing in standalone mode)", err)
	}

	validator := auth.NewValidator(nil, cfg.NodeAPIURL)
	hub := ws.NewHub(eventBus, validator)
	go hub.Run(context.Background())

	udpListener := udp.NewLoRaListener(cfg.UDPPort, hub)
	go udpListener.Start(context.Background())

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"healthy","tier":"gateway-go"}`))
	})
	mux.HandleFunc("/ws/live", hub.ServeWS)

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: mux,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("HTTP server error: %v", err)
		}
	}()

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
	<-sig

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	server.Shutdown(ctx)
	log.Println("[Gateway-Go] Stopped cleanly")
}
