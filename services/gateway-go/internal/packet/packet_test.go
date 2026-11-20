package packet

import (
	"encoding/binary"
	"math"
	"testing"
)

func TestPacketUnpackValid(t *testing.T) {
	buf := make([]byte, PacketSize)
	buf[0] = PacketMagic0
	buf[1] = PacketMagic1
	buf[2] = PacketVersion
	buf[3] = 0x05 // fall_detected (0x01) + gps_locked (0x04)

	// Device ID (8 bytes)
	copy(buf[4:12], []byte{0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08})

	// Timestamp ms
	binary.BigEndian.PutUint64(buf[12:20], 1700000000000)

	// Vitals
	buf[20] = 78 // Heart rate
	buf[21] = 98 // SpO2

	// Temperature: 22.50 C (2250)
	binary.BigEndian.PutUint16(buf[22:24], uint16(2250))

	// Humidity: 45.00 % (4500)
	binary.BigEndian.PutUint16(buf[24:26], uint16(4500))

	// Pressure: 1013.25 hPa (101325)
	binary.BigEndian.PutUint32(buf[26:30], 101325)

	// Accel Z = 1.0g (16384)
	binary.BigEndian.PutUint16(buf[34:36], uint16(16384))

	// Latitude: 45.1234567 (451234567)
	binary.BigEndian.PutUint32(buf[42:46], uint32(451234567))

	// Longitude: -121.6543210 (-1216543210)
	lonInt := int32(-1216543210)
	binary.BigEndian.PutUint32(buf[46:50], uint32(lonInt))

	// Altitude: 1540m
	binary.BigEndian.PutUint16(buf[50:52], uint16(1540))

	// Battery: 89%
	buf[52] = 89

	// CRC-16
	crc := ComputeCRC16(buf[0:54])
	binary.BigEndian.PutUint16(buf[54:56], crc)

	frame, err := Unpack(buf)
	if err != nil {
		t.Fatalf("Unpack failed: %v", err)
	}

	if frame.DeviceID != "TRAILGUARD-0102030405060708" {
		t.Errorf("Unexpected DeviceID: %s", frame.DeviceID)
	}
	if !frame.FallDetected {
		t.Errorf("Expected FallDetected true")
	}
	if !frame.GPSLocked {
		t.Errorf("Expected GPSLocked true")
	}
	if frame.HeartRate != 78 || frame.SpO2 != 98 {
		t.Errorf("Unexpected vitals: HR=%d, SpO2=%d", frame.HeartRate, frame.SpO2)
	}
	if math.Abs(float64(frame.TemperatureC)-22.5) > 0.01 {
		t.Errorf("Unexpected temp: %f", frame.TemperatureC)
	}
	if math.Abs(frame.Latitude-45.1234567) > 0.0001 {
		t.Errorf("Unexpected latitude: %f", frame.Latitude)
	}
	if frame.AltitudeM != 1540 {
		t.Errorf("Unexpected altitude: %d", frame.AltitudeM)
	}
}

func TestPacketChecksumMismatch(t *testing.T) {
	buf := make([]byte, PacketSize)
	buf[0] = PacketMagic0
	buf[1] = PacketMagic1
	buf[2] = PacketVersion
	binary.BigEndian.PutUint16(buf[54:56], 0x1234) // Bad CRC

	_, err := Unpack(buf)
	if err != ErrChecksumMismatch {
		t.Errorf("Expected ErrChecksumMismatch, got %v", err)
	}
}
