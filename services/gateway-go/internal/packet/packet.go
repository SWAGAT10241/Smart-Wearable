package packet

import (
	"encoding/binary"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
)

const (
	PacketMagic0   = 0x53 // 'S'
	PacketMagic1   = 0x57 // 'W'
	PacketVersion  = 1
	PacketSize     = 56
)

var (
	ErrPacketTooShort   = errors.New("packet buffer too short (expected 56 bytes)")
	ErrInvalidHeader    = errors.New("invalid packet magic header or version")
	ErrChecksumMismatch = errors.New("crc-16 checksum mismatch")
)

// TelemetryFrame represents an unpacked 56-byte SWAAS telemetry frame.
type TelemetryFrame struct {
	DeviceID        string  `json:"device_id"`
	TimestampMs     uint64  `json:"timestamp_ms"`
	FallDetected    bool    `json:"fall_detected"`
	SOSActive       bool    `json:"sos_active"`
	GPSLocked       bool    `json:"gps_locked"`
	BatteryCritical bool    `json:"battery_critical"`
	HopCount        uint8   `json:"hop_count"`
	HeartRate       uint8   `json:"heart_rate"`
	SpO2            uint8   `json:"spo2"`
	TemperatureC    float32 `json:"temperature_c"`
	HumidityPct     float32 `json:"humidity_pct"`
	PressureHPa     float32 `json:"pressure_hpa"`
	AccelXG         float32 `json:"accel_x_g"`
	AccelYG         float32 `json:"accel_y_g"`
	AccelZG         float32 `json:"accel_z_g"`
	GyroXDps        float32 `json:"gyro_x_dps"`
	GyroYDps        float32 `json:"gyro_y_dps"`
	GyroZDps        float32 `json:"gyro_z_dps"`
	Latitude        float64 `json:"latitude"`
	Longitude       float64 `json:"longitude"`
	AltitudeM       int16   `json:"altitude_m"`
	BatteryPct      uint8   `json:"battery_pct"`
}

// ComputeCRC16 calculates CRC-16-CCITT (poly 0x1021, init 0xFFFF).
func ComputeCRC16(data []byte) uint16 {
	crc := uint16(0xFFFF)
	for _, b := range data {
		crc ^= uint16(b) << 8
		for i := 0; i < 8; i++ {
			if (crc & 0x8000) != 0 {
				crc = (crc << 1) ^ 0x1021
			} else {
				crc <<= 1
			}
		}
	}
	return crc
}

// Unpack deserializes a 56-byte binary LoRa/BLE buffer into a TelemetryFrame.
func Unpack(buffer []byte) (*TelemetryFrame, error) {
	if len(buffer) < PacketSize {
		return nil, ErrPacketTooShort
	}

	// 1. Verify Magic & Version
	if buffer[0] != PacketMagic0 || buffer[1] != PacketMagic1 || buffer[2] != PacketVersion {
		return nil, ErrInvalidHeader
	}

	// 2. Verify CRC-16 Checksum
	expectedCRC := binary.BigEndian.Uint16(buffer[54:56])
	computedCRC := ComputeCRC16(buffer[0:54])
	if expectedCRC != computedCRC {
		return nil, ErrChecksumMismatch
	}

	// 3. Flags
	flags := buffer[3]
	fallDetected := (flags & 0x01) != 0
	sosActive := (flags & 0x02) != 0
	gpsLocked := (flags & 0x04) != 0
	batteryCritical := (flags & 0x08) != 0
	hopCount := (flags >> 4) & 0x03

	// 4. Device ID
	deviceIDHex := strings.ToUpper(hex.EncodeToString(buffer[4:12]))
	deviceID := fmt.Sprintf("TRAILGUARD-%s", deviceIDHex)

	// 5. Timestamp
	timestampMs := binary.BigEndian.Uint64(buffer[12:20])

	// 6. Vitals
	heartRate := buffer[20]
	spo2 := buffer[21]

	// 7. Environment
	tempRaw := int16(binary.BigEndian.Uint16(buffer[22:24]))
	temperatureC := float32(tempRaw) / 100.0

	humRaw := binary.BigEndian.Uint16(buffer[24:26])
	humidityPct := float32(humRaw) / 100.0

	presRaw := binary.BigEndian.Uint32(buffer[26:30])
	pressureHPa := float32(presRaw) / 100.0

	// 8. Kinematics (MPU6050 16-bit signed, standard 16384 LSB/g and 131 LSB/(°/s))
	ax := float32(int16(binary.BigEndian.Uint16(buffer[30:32]))) / 16384.0
	ay := float32(int16(binary.BigEndian.Uint16(buffer[32:34]))) / 16384.0
	az := float32(int16(binary.BigEndian.Uint16(buffer[34:36]))) / 16384.0

	gx := float32(int16(binary.BigEndian.Uint16(buffer[36:38]))) / 131.0
	gy := float32(int16(binary.BigEndian.Uint16(buffer[38:40]))) / 131.0
	gz := float32(int16(binary.BigEndian.Uint16(buffer[40:42]))) / 131.0

	// 9. Location (fixed point * 1e7)
	latRaw := int32(binary.BigEndian.Uint32(buffer[42:46]))
	lonRaw := int32(binary.BigEndian.Uint32(buffer[46:50]))
	latitude := float64(latRaw) / 10000000.0
	longitude := float64(lonRaw) / 10000000.0
	altitudeM := int16(binary.BigEndian.Uint16(buffer[50:52]))

	// 10. Battery
	batteryPct := buffer[52]

	return &TelemetryFrame{
		DeviceID:        deviceID,
		TimestampMs:     timestampMs,
		FallDetected:    fallDetected,
		SOSActive:       sosActive,
		GPSLocked:       gpsLocked,
		BatteryCritical: batteryCritical,
		HopCount:        hopCount,
		HeartRate:       heartRate,
		SpO2:            spo2,
		TemperatureC:    temperatureC,
		HumidityPct:     humidityPct,
		PressureHPa:     pressureHPa,
		AccelXG:         ax,
		AccelYG:         ay,
		AccelZG:         az,
		GyroXDps:        gx,
		GyroYDps:        gy,
		GyroZDps:        gz,
		Latitude:        latitude,
		Longitude:       longitude,
		AltitudeM:       altitudeM,
		BatteryPct:      batteryPct,
	}, nil
}
