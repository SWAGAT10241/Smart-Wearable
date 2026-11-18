package config

import (
	"os"
	"strconv"
)

// Config holds all runtime configurations for the Go Ingestion Gateway.
type Config struct {
	Port               int
	UDPPort            int
	RedisAddr          string
	RedisPassword      string
	NodeAPIURL         string
	MaxMessageSize     int64
	PingPeriodSeconds  int
	WriteWaitSeconds   int
	Environment        string
}

// Load reads environment variables with safe production fallbacks.
func Load() *Config {
	return &Config{
		Port:              getEnvInt("GATEWAY_PORT", 8080),
		UDPPort:           getEnvInt("LORA_UDP_PORT", 9090),
		RedisAddr:         getEnv("REDIS_ADDR", "localhost:6379"),
		RedisPassword:     getEnv("REDIS_PASSWORD", ""),
		NodeAPIURL:        getEnv("NODE_API_URL", "http://localhost:5001"),
		MaxMessageSize:    getEnvInt64("MAX_MESSAGE_SIZE", 1024*1024), // 1MB
		PingPeriodSeconds: getEnvInt("PING_PERIOD_SECONDS", 30),
		WriteWaitSeconds:  getEnvInt("WRITE_WAIT_SECONDS", 10),
		Environment:       getEnv("APP_ENV", "development"),
	}
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	if val := os.Getenv(key); val != "" {
		if i, err := strconv.Atoi(val); err == nil {
			return i
		}
	}
	return defaultVal
}

func getEnvInt64(key string, defaultVal int64) int64 {
	if val := os.Getenv(key); val != "" {
		if i, err := strconv.ParseInt(val, 10, 64); err == nil {
			return i
		}
	}
	return defaultVal
}
