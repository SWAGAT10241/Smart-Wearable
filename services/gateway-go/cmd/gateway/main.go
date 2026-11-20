package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/trailguard/gateway-go/internal/hub"
	"github.com/trailguard/gateway-go/internal/packet"
)

func main() {
	httpPort := os.Getenv("PORT")
	if httpPort == "" {
		httpPort = "8080"
	}

	udpPort := os.Getenv("UDP_PORT")
	if udpPort == "" {
		udpPort = "8125"
	}

	h := hub.NewHub()

	// 1. Setup UDP Telemetry Ingestion Server
	udpAddr, err := net.ResolveUDPAddr("udp", ":"+udpPort)
	if err != nil {
		log.Fatalf("Failed to resolve UDP address :%s: %v", udpPort, err)
	}

	udpConn, err := net.ListenUDP("udp", udpAddr)
	if err != nil {
		log.Fatalf("Failed to start UDP telemetry listener on :%s: %v", udpPort, err)
	}
	defer udpConn.Close()

	log.Printf("[Gateway-Go] LoRa/UDP Ingestion listener running on UDP :%s", udpPort)

	// Goroutine for UDP packets
	go func() {
		buf := make([]byte, 1024)
		for {
			n, _, err := udpConn.ReadFromUDP(buf)
			if err != nil {
				return
			}
			if n < packet.PacketSize {
				continue
			}

			frame, err := packet.Unpack(buf[:n])
			if err != nil {
				// Malformed or bad CRC packet; ignore to protect system stability
				continue
			}

			if err := h.BroadcastTelemetry(frame); err != nil {
				log.Printf("[Gateway-Go] Broadcast error: %v", err)
			}
		}
	}()

	// 2. Setup HTTP Management & Health API
	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "healthy",
			"tier":      "go-gateway-ingestion",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	mux.HandleFunc("/stats", func(w http.ResponseWriter, r *http.Request) {
		clients, sessions, ingested := h.Stats()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"activeClients":  clients,
			"activeSessions": sessions,
			"totalIngested":  ingested,
			"timestamp":      time.Now().UTC().Format(time.RFC3339),
		})
	})

	server := &http.Server{
		Addr:         ":" + httpPort,
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	go func() {
		log.Printf("[Gateway-Go] HTTP & Control server listening on :%s", httpPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("HTTP server failed: %v", err)
		}
	}()

	// Graceful shutdown handling
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan

	log.Println("[Gateway-Go] Shutting down gateway gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	server.Shutdown(ctx)
	fmt.Println("[Gateway-Go] Gateway stopped.")
}
