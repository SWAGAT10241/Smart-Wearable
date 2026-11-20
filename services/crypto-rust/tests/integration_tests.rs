use ed25519_dalek::{Signer, SigningKey};
use rand::rngs::OsRng;
use std::ffi::{CStr, CString};
use trailguard_crypto::ffi::{
    trailguard_free_string, trailguard_unpack_telemetry_packet,
    trailguard_verify_canonical_signature,
};
use trailguard_crypto::{
    build_canonical_message, compute_body_sha256, verify_canonical_request, CryptoError,
    NonceTracker, TelemetryFrame,
};

#[test]
fn test_ed25519_canonical_verification_success_and_tamper() {
    let mut csprng = OsRng;
    let signing_key = SigningKey::generate(&mut csprng);
    let verifying_key = signing_key.verifying_key();
    let public_key_bytes = verifying_key.to_bytes();

    let method = "POST";
    let path = "/api/telemetry";
    let device_id = "TRAILGUARD-DEMO-001";
    let timestamp = "1763582400000";
    let nonce = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v";
    let raw_body = br#"{"heartRate":78,"spo2":99,"temperature":24.5}"#;
    let body_hash = compute_body_sha256(raw_body);

    let canonical_message = build_canonical_message(
        method,
        path,
        device_id,
        timestamp,
        nonce,
        &body_hash,
    );

    // Sign with device private key
    let signature = signing_key.sign(canonical_message.as_bytes());
    let sig_bytes = signature.to_bytes();

    // 1. Valid signature check
    let result = verify_canonical_request(
        &public_key_bytes,
        method,
        path,
        device_id,
        timestamp,
        nonce,
        &body_hash,
        &sig_bytes,
    );
    assert_eq!(result, Ok(true));

    // 2. Tampered body hash check
    let tampered_hash = compute_body_sha256(b"tampered payload");
    let tampered_result = verify_canonical_request(
        &public_key_bytes,
        method,
        path,
        device_id,
        timestamp,
        nonce,
        &tampered_hash,
        &sig_bytes,
    );
    assert_eq!(tampered_result, Err(CryptoError::VerificationFailed));

    // 3. Tampered device ID check
    let tampered_id_result = verify_canonical_request(
        &public_key_bytes,
        method,
        path,
        "TRAILGUARD-FAKE-999",
        timestamp,
        nonce,
        &body_hash,
        &sig_bytes,
    );
    assert_eq!(tampered_id_result, Err(CryptoError::VerificationFailed));
}

#[test]
fn test_nonce_replay_and_timestamp_skew() {
    let tracker = NonceTracker::default();
    let device_id = "TRAILGUARD-TEST-002";
    let nonce = "unique_nonce_token_1234567890";

    // First consumption succeeds
    assert!(tracker.consume_nonce(device_id, nonce).is_ok());

    // Immediate replay is rejected
    assert_eq!(
        tracker.consume_nonce(device_id, nonce),
        Err(CryptoError::NonceReplayed(nonce.to_string()))
    );

    // Timestamp within 5 minutes succeeds
    let now = 1763582400000u64;
    assert!(tracker.validate_timestamp(now - 120_000, now).is_ok());

    // Timestamp older than 5 minutes fails with skew error
    assert_eq!(
        tracker.validate_timestamp(now - 350_000, now),
        Err(CryptoError::TimestampSkew(300))
    );
}

#[test]
fn test_telemetry_packet_pack_unpack_roundtrip() {
    let original = TelemetryFrame {
        device_id: "TRAILGUARD-0102030405060708".to_string(),
        timestamp_ms: 1763582456000,
        fall_detected: true,
        sos_active: false,
        gps_locked: true,
        battery_critical: false,
        hop_count: 2,
        heart_rate: 82,
        spo2: 98,
        temperature_c: 21.75,
        humidity_pct: 54.30,
        pressure_hpa: 1013.25,
        accel_x_g: 0.12,
        accel_y_g: -0.05,
        accel_z_g: 0.98,
        gyro_x_dps: 1.5,
        gyro_y_dps: -0.8,
        gyro_z_dps: 0.3,
        latitude: 45.8326123,
        longitude: 6.8652456,
        altitude_m: 2840,
        battery_pct: 88,
    };

    let device_raw = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08];
    let packed = original.pack(device_raw);

    assert_eq!(packed.len(), 56);
    assert_eq!(&packed[0..2], b"SW");

    // Unpack and assert fields
    let unpacked = TelemetryFrame::unpack(&packed).expect("Should unpack cleanly");
    assert_eq!(unpacked.device_id, original.device_id);
    assert_eq!(unpacked.fall_detected, true);
    assert_eq!(unpacked.heart_rate, 82);
    assert_eq!(unpacked.spo2, 98);
    assert!((unpacked.temperature_c - 21.75).abs() < 0.02);
    assert!((unpacked.pressure_hpa - 1013.25).abs() < 0.05);
    assert!((unpacked.latitude - 45.8326123).abs() < 0.0001);
    assert!((unpacked.longitude - 6.8652456).abs() < 0.0001);
    assert_eq!(unpacked.altitude_m, 2840);
    assert_eq!(unpacked.battery_pct, 88);

    // Corrupted checksum test
    let mut corrupted = packed;
    corrupted[10] ^= 0xFF; // flip bits
    assert_eq!(
        TelemetryFrame::unpack(&corrupted),
        Err(CryptoError::ChecksumMismatch)
    );
}

#[test]
fn test_c_abi_foreign_function_interface() {
    let mut csprng = OsRng;
    let signing_key = SigningKey::generate(&mut csprng);
    let verifying_key = signing_key.verifying_key();
    let pk_hex = hex::encode(verifying_key.to_bytes());

    let method = "GET";
    let path = "/api/emergency/sessions";
    let device_id = "TRAILGUARD-FFI-001";
    let timestamp = "1763582500000";
    let nonce = "ffi_nonce_verification_sample_1234567890123";
    let body_hash = compute_body_sha256(b"");

    let canonical = build_canonical_message(method, path, device_id, timestamp, nonce, &body_hash);
    let signature = signing_key.sign(canonical.as_bytes());
    let sig_hex = hex::encode(signature.to_bytes());

    let c_pk = CString::new(pk_hex).unwrap();
    let c_method = CString::new(method).unwrap();
    let c_path = CString::new(path).unwrap();
    let c_device_id = CString::new(device_id).unwrap();
    let c_timestamp = CString::new(timestamp).unwrap();
    let c_nonce = CString::new(nonce).unwrap();
    let c_body_hash = CString::new(body_hash).unwrap();
    let c_sig = CString::new(sig_hex).unwrap();

    let res = trailguard_verify_canonical_signature(
        c_pk.as_ptr(),
        c_method.as_ptr(),
        c_path.as_ptr(),
        c_device_id.as_ptr(),
        c_timestamp.as_ptr(),
        c_nonce.as_ptr(),
        c_body_hash.as_ptr(),
        c_sig.as_ptr(),
    );
    assert_eq!(res, 1);

    // Binary packet unpack via C-ABI
    let sample_frame = TelemetryFrame {
        device_id: "TRAILGUARD-AABBCCDDEEFF0011".to_string(),
        timestamp_ms: 1763582500000,
        fall_detected: false,
        sos_active: true,
        gps_locked: true,
        battery_critical: false,
        hop_count: 1,
        heart_rate: 95,
        spo2: 99,
        temperature_c: 24.0,
        humidity_pct: 45.0,
        pressure_hpa: 1010.0,
        accel_x_g: 0.0,
        accel_y_g: 0.0,
        accel_z_g: 1.0,
        gyro_x_dps: 0.0,
        gyro_y_dps: 0.0,
        gyro_z_dps: 0.0,
        latitude: 45.0,
        longitude: 6.0,
        altitude_m: 1500,
        battery_pct: 95,
    };
    let packed = sample_frame.pack([0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF, 0x00, 0x11]);

    let json_ptr = trailguard_unpack_telemetry_packet(packed.as_ptr(), packed.len());
    assert!(!json_ptr.is_null());

    let json_str = unsafe { CStr::from_ptr(json_ptr).to_str().unwrap() };
    assert!(json_str.contains("TRAILGUARD-AABBCCDDEEFF0011"));
    assert!(json_str.contains("\"sos_active\":true"));

    trailguard_free_string(json_ptr);
}
