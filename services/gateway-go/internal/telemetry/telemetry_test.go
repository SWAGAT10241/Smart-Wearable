package telemetry

import (
	"testing"
	"time"
)

func TestTelemetryValidation_Valid(t *testing.T) {
	frame := TelemetryFrame{
		DeviceID:  "ESP32-S3-TEST-001",
		Timestamp: time.Now().UnixMilli(),
		Vitals: Vitals{
			HeartRate: 78,
			SpO2:      98,
		},
		Location: Location{
			Latitude:  37.7749,
			Longitude: -122.4194,
		},
		Emergency: false,
	}

	if err := frame.Validate(); err != nil {
		t.Fatalf("expected valid frame, got error: %v", err)
	}
}

func TestTelemetryValidation_EmptyDeviceID(t *testing.T) {
	frame := TelemetryFrame{
		DeviceID:  "",
		Timestamp: time.Now().UnixMilli(),
	}

	if err := frame.Validate(); err != ErrInvalidDeviceID {
		t.Fatalf("expected ErrInvalidDeviceID, got: %v", err)
	}
}

func TestTelemetryValidation_TimestampSkew(t *testing.T) {
	frame := TelemetryFrame{
		DeviceID:  "ESP32-S3-TEST-001",
		Timestamp: time.Now().Add(-10 * time.Minute).UnixMilli(), // 10 minutes old
	}

	if err := frame.Validate(); err != ErrInvalidTimestamp {
		t.Fatalf("expected ErrInvalidTimestamp, got: %v", err)
	}
}

func TestTelemetryValidation_PhysiologicalBounds(t *testing.T) {
	// SpO2 over 100%
	frame := TelemetryFrame{
		DeviceID:  "ESP32-S3-TEST-001",
		Timestamp: time.Now().UnixMilli(),
		Vitals: Vitals{
			HeartRate: 75,
			SpO2:      105,
		},
	}
	if err := frame.Validate(); err != ErrSpO2OutOfRange {
		t.Fatalf("expected ErrSpO2OutOfRange, got: %v", err)
	}

	// Heart rate out of range
	frame.Vitals.SpO2 = 97
	frame.Vitals.HeartRate = 300
	if err := frame.Validate(); err != ErrHeartRateRange {
		t.Fatalf("expected ErrHeartRateRange, got: %v", err)
	}
}

func TestTelemetryRedactedSummary(t *testing.T) {
	frame := TelemetryFrame{
		DeviceID:  "ESP32-S3-TEST-001",
		Timestamp: 1700000000000,
		Vitals: Vitals{
			HeartRate: 140,
			SpO2:      88,
		},
		Location: Location{
			Latitude:  45.1234,
			Longitude: 7.9876,
		},
		Emergency: true,
	}

	summary := frame.RedactedSummary()
	// Must NOT contain sensitive coordinate decimals
	if summary != "[Telemetry device=ESP32-S3-TEST-001 ts=1700000000000 emergency=true seq=0]" {
		t.Fatalf("unexpected redacted summary format: %s", summary)
	}
}
