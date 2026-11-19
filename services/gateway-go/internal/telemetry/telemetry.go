package telemetry

import (
	"errors"
	"fmt"
	"math"
	"time"
)

var (
	ErrInvalidDeviceID   = errors.New("invalid or empty device_id")
	ErrInvalidTimestamp  = errors.New("timestamp skew exceeds allowable +/- 5 minute window")
	ErrSpO2OutOfRange    = errors.New("spo2 reading out of physical human bounds [40-100%]")
	ErrHeartRateRange    = errors.New("heart rate out of allowable bounds [25-260 bpm]")
	ErrInvalidLocation   = errors.New("latitude or longitude values out of range")
)

// Vitals captures cardiovascular and blood oxygenation parameters from MAX30100/MAX30102.
type Vitals struct {
	HeartRate   float64 `json:"heartRate"`
	SpO2        float64 `json:"spo2"`
	SkinTemp    float64 `json:"skinTemp,omitempty"`
	Confidence  float64 `json:"confidence,omitempty"`
}

// Motion captures 6-axis kinematic acceleration and angular velocity from MPU6050.
type Motion struct {
	AccelX float64 `json:"accelX"`
	AccelY float64 `json:"accelY"`
	AccelZ float64 `json:"accelZ"`
	GyroX  float64 `json:"gyroX,omitempty"`
	GyroY  float64 `json:"gyroY,omitempty"`
	GyroZ  float64 `json:"gyroZ,omitempty"`
}

// Location captures GPS coordinates and elevation from NEO-6M / GNSS.
type Location struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Altitude  float64 `json:"altitude,omitempty"`
	Accuracy  float64 `json:"accuracy,omitempty"`
	Speed     float64 `json:"speed,omitempty"`
}

// Battery monitors power supply and charging state.
type Battery struct {
	Level   float64 `json:"level"`
	Voltage float64 `json:"voltage,omitempty"`
}

// TelemetryFrame represents an immutable telemetry observation package.
type TelemetryFrame struct {
	DeviceID   string    `json:"deviceId"`
	SessionID  string    `json:"sessionId,omitempty"`
	UserID     string    `json:"userId,omitempty"`
	Timestamp  int64     `json:"timestamp"` // Unix timestamp in ms
	Vitals     Vitals    `json:"vitals"`
	Motion     Motion    `json:"motion"`
	Location   Location  `json:"location"`
	Battery    Battery   `json:"battery"`
	Emergency  bool      `json:"emergency"`
	AlertType  string    `json:"alertType,omitempty"`
	SequenceID uint64    `json:"sequenceId,omitempty"`
}

// Validate checks physical plausibility and timestamp sanity.
func (f *TelemetryFrame) Validate() error {
	if f.DeviceID == "" {
		return ErrInvalidDeviceID
	}

	// 5-minute skew window protection against replay and clock drift
	nowMs := time.Now().UnixMilli()
	if f.Timestamp == 0 {
		f.Timestamp = nowMs
	} else {
		skew := math.Abs(float64(nowMs - f.Timestamp))
		if skew > 300000 { // 5 minutes in ms
			return ErrInvalidTimestamp
		}
	}

	// Physiological range validation (when sensor readings are provided)
	if f.Vitals.SpO2 > 0 && (f.Vitals.SpO2 < 40 || f.Vitals.SpO2 > 100) {
		return ErrSpO2OutOfRange
	}
	if f.Vitals.HeartRate > 0 && (f.Vitals.HeartRate < 25 || f.Vitals.HeartRate > 260) {
		return ErrHeartRateRange
	}

	// Coordinate checks
	if f.Location.Latitude != 0 || f.Location.Longitude != 0 {
		if f.Location.Latitude < -90 || f.Location.Latitude > 90 ||
			f.Location.Longitude < -180 || f.Location.Longitude > 180 {
			return ErrInvalidLocation
		}
	}

	return nil
}

// RedactedSummary formats log string without sensitive coordinates or biometrics (Invariant 7).
func (f *TelemetryFrame) RedactedSummary() string {
	return fmt.Sprintf(
		"[Telemetry device=%s ts=%d emergency=%t seq=%d]",
		f.DeviceID,
		f.Timestamp,
		f.Emergency,
		f.SequenceID,
	)
}
