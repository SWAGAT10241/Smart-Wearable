use crate::error::CryptoError;
use serde::{Deserialize, Serialize};

pub const PACKET_MAGIC: [u8; 2] = [0x53, 0x57]; // "SW" for SWAAS
pub const PACKET_VERSION: u8 = 1;
pub const PACKET_SIZE: usize = 56;

/// Unpacked telemetry frame representation ready for JSON export / Redis PubSub.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct TelemetryFrame {
    pub device_id: String,
    pub timestamp_ms: u64,
    pub fall_detected: bool,
    pub sos_active: bool,
    pub gps_locked: bool,
    pub battery_critical: bool,
    pub hop_count: u8,
    pub heart_rate: u8,
    pub spo2: u8,
    pub temperature_c: f32,
    pub humidity_pct: f32,
    pub pressure_hpa: f32,
    pub accel_x_g: f32,
    pub accel_y_g: f32,
    pub accel_z_g: f32,
    pub gyro_x_dps: f32,
    pub gyro_y_dps: f32,
    pub gyro_z_dps: f32,
    pub latitude: f64,
    pub longitude: f64,
    pub altitude_m: i16,
    pub battery_pct: u8,
}

impl TelemetryFrame {
    /// Unpacks a 56-byte compact binary LoRa/BLE packet with zero allocations.
    pub fn unpack(buffer: &[u8]) -> Result<Self, CryptoError> {
        if buffer.len() < PACKET_SIZE {
            return Err(CryptoError::MalformedPacket(format!(
                "Buffer too short: {} bytes (expected {})",
                buffer.len(),
                PACKET_SIZE
            )));
        }

        // 1. Verify Magic & Version
        if buffer[0..2] != PACKET_MAGIC || buffer[2] != PACKET_VERSION {
            return Err(CryptoError::InvalidPacketHeader);
        }

        // 2. Verify CRC-16 Checksum
        let expected_crc = u16::from_be_bytes([buffer[54], buffer[55]]);
        let computed_crc = compute_crc16(&buffer[0..54]);
        if expected_crc != computed_crc {
            return Err(CryptoError::ChecksumMismatch);
        }

        // 3. Flags
        let flags = buffer[3];
        let fall_detected = (flags & 0x01) != 0;
        let sos_active = (flags & 0x02) != 0;
        let gps_locked = (flags & 0x04) != 0;
        let battery_critical = (flags & 0x08) != 0;
        let hop_count = (flags >> 4) & 0x03;

        // 4. Device ID (8 bytes hex)
        let device_id_raw: [u8; 8] = buffer[4..12].try_into().unwrap();
        let device_id = format!("TRAILGUARD-{}", hex::encode_upper(device_id_raw));

        // 5. Timestamp
        let timestamp_ms = u64::from_be_bytes(buffer[12..20].try_into().unwrap());

        // 6. Vitals
        let heart_rate = buffer[20];
        let spo2 = buffer[21];

        // 7. Environment (scaled integers)
        let temp_raw = i16::from_be_bytes(buffer[22..24].try_into().unwrap());
        let temperature_c = (temp_raw as f32) / 100.0;

        let hum_raw = u16::from_be_bytes(buffer[24..26].try_into().unwrap());
        let humidity_pct = (hum_raw as f32) / 100.0;

        let pres_raw = u32::from_be_bytes(buffer[26..30].try_into().unwrap());
        let pressure_hpa = (pres_raw as f32) / 100.0;

        // 8. Kinematics (MPU6050 16-bit signed, standard 16384 LSB/g and 131 LSB/(°/s))
        let ax = i16::from_be_bytes(buffer[30..32].try_into().unwrap()) as f32 / 16384.0;
        let ay = i16::from_be_bytes(buffer[32..34].try_into().unwrap()) as f32 / 16384.0;
        let az = i16::from_be_bytes(buffer[34..36].try_into().unwrap()) as f32 / 16384.0;

        let gx = i16::from_be_bytes(buffer[36..38].try_into().unwrap()) as f32 / 131.0;
        let gy = i16::from_be_bytes(buffer[38..40].try_into().unwrap()) as f32 / 131.0;
        let gz = i16::from_be_bytes(buffer[40..42].try_into().unwrap()) as f32 / 131.0;

        // 9. Location (fixed-point * 1e7)
        let lat_raw = i32::from_be_bytes(buffer[42..46].try_into().unwrap());
        let lon_raw = i32::from_be_bytes(buffer[46..50].try_into().unwrap());
        let latitude = (lat_raw as f64) / 10_000_000.0;
        let longitude = (lon_raw as f64) / 10_000_000.0;
        let altitude_m = i16::from_be_bytes(buffer[50..52].try_into().unwrap());

        // 10. Battery
        let battery_pct = buffer[52];

        Ok(Self {
            device_id,
            timestamp_ms,
            fall_detected,
            sos_active,
            gps_locked,
            battery_critical,
            hop_count,
            heart_rate,
            spo2,
            temperature_c,
            humidity_pct,
            pressure_hpa,
            accel_x_g: ax,
            accel_y_g: ay,
            accel_z_g: az,
            gyro_x_dps: gx,
            gyro_y_dps: gy,
            gyro_z_dps: gz,
            latitude,
            longitude,
            altitude_m,
            battery_pct,
        })
    }

    /// Packs this telemetry frame into standard 56-byte binary packet wire format.
    pub fn pack(&self, device_id_raw: [u8; 8]) -> [u8; PACKET_SIZE] {
        let mut buf = [0u8; PACKET_SIZE];
        buf[0..2].copy_from_slice(&PACKET_MAGIC);
        buf[2] = PACKET_VERSION;

        let mut flags = 0u8;
        if self.fall_detected {
            flags |= 0x01;
        }
        if self.sos_active {
            flags |= 0x02;
        }
        if self.gps_locked {
            flags |= 0x04;
        }
        if self.battery_critical {
            flags |= 0x08;
        }
        flags |= (self.hop_count & 0x03) << 4;
        buf[3] = flags;

        buf[4..12].copy_from_slice(&device_id_raw);
        buf[12..20].copy_from_slice(&self.timestamp_ms.to_be_bytes());

        buf[20] = self.heart_rate;
        buf[21] = self.spo2;

        let temp_raw = (self.temperature_c * 100.0).round() as i16;
        buf[22..24].copy_from_slice(&temp_raw.to_be_bytes());

        let hum_raw = (self.humidity_pct * 100.0).round() as u16;
        buf[24..26].copy_from_slice(&hum_raw.to_be_bytes());

        let pres_raw = (self.pressure_hpa * 100.0).round() as u32;
        buf[26..30].copy_from_slice(&pres_raw.to_be_bytes());

        let ax = (self.accel_x_g * 16384.0).round() as i16;
        let ay = (self.accel_y_g * 16384.0).round() as i16;
        let az = (self.accel_z_g * 16384.0).round() as i16;
        buf[30..32].copy_from_slice(&ax.to_be_bytes());
        buf[32..34].copy_from_slice(&ay.to_be_bytes());
        buf[34..36].copy_from_slice(&az.to_be_bytes());

        let gx = (self.gyro_x_dps * 131.0).round() as i16;
        let gy = (self.gyro_y_dps * 131.0).round() as i16;
        let gz = (self.gyro_z_dps * 131.0).round() as i16;
        buf[36..38].copy_from_slice(&gx.to_be_bytes());
        buf[38..40].copy_from_slice(&gy.to_be_bytes());
        buf[40..42].copy_from_slice(&gz.to_be_bytes());

        let lat_raw = (self.latitude * 10_000_000.0).round() as i32;
        let lon_raw = (self.longitude * 10_000_000.0).round() as i32;
        buf[42..46].copy_from_slice(&lat_raw.to_be_bytes());
        buf[46..50].copy_from_slice(&lon_raw.to_be_bytes());
        buf[50..52].copy_from_slice(&self.altitude_m.to_be_bytes());

        buf[52] = self.battery_pct;
        buf[53] = 0; // padding

        let crc = compute_crc16(&buf[0..54]);
        buf[54..56].copy_from_slice(&crc.to_be_bytes());

        buf
    }

    /// Serializes this frame to a JSON string.
    pub fn to_json(&self) -> Result<String, serde_json::Error> {
        serde_json::to_string(self)
    }
}

/// Computes CRC-16-CCITT (polynomial 0x1021, init 0xFFFF).
pub fn compute_crc16(data: &[u8]) -> u16 {
    let mut crc: u16 = 0xFFFF;
    for &byte in data {
        crc ^= (byte as u16) << 8;
        for _ in 0..8 {
            if (crc & 0x8000) != 0 {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
        }
    }
    crc
}
