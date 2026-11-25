use std::env;
use std::time::Instant;
use trailguard_crypto::packet::TelemetryFrame;
use trailguard_crypto::verifier::verify_canonical_request;

fn print_usage() {
    println!("SWAAS / TrailGuard Cryptographic Core (Rust)");
    println!("Usage:");
    println!("  trailguard-crypto benchmark");
    println!("  trailguard-crypto unpack <hex_packet_56_bytes>");
    println!("  trailguard-crypto verify <public_key> <method> <path> <device_id> <timestamp> <nonce> <body_hash> <signature>");
}

fn run_benchmark() {
    println!("=== SWAAS Rust Crypto Core Benchmark ===");

    // Deterministic Ed25519 keypair for zero-dependency benchmarking
    use ed25519_dalek::{Signer, SigningKey};
    let seed = [7u8; 32];
    let signing_key = SigningKey::from_bytes(&seed);
    let verifying_key = signing_key.verifying_key();
    let pk_hex = hex::encode(verifying_key.as_bytes());

    let method = "POST";
    let path = "/api/telemetry";
    let device_id = "TRAILGUARD-DEMO-001";
    let timestamp = "1700000000000";
    let nonce = "43_chars_test_nonce_mock_random_string_xyz";
    let body_hash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

    let canonical = format!(
        "v1\n{}\n{}\n{}\n{}\n{}\n{}",
        method, path, device_id, timestamp, nonce, body_hash
    );
    let signature = signing_key.sign(canonical.as_bytes());
    let sig_hex = hex::encode(signature.to_bytes());

    println!("[1/2] Benchmarking Ed25519 canonical verification (10,000 iterations)...");
    let start_verify = Instant::now();
    let iterations = 10_000;
    for _ in 0..iterations {
        let valid = verify_canonical_request(
            pk_hex.as_bytes(),
            method,
            path,
            device_id,
            timestamp,
            nonce,
            body_hash,
            sig_hex.as_bytes(),
        )
        .unwrap();
        assert!(valid);
    }
    let verify_elapsed = start_verify.elapsed();
    let verify_micros = verify_elapsed.as_micros() as f64 / iterations as f64;
    let verify_throughput = iterations as f64 / verify_elapsed.as_secs_f64();

    println!("      Completed in {:?}", verify_elapsed);
    println!("      Mean latency: {:.2} µs / verification", verify_micros);
    println!("      Throughput:   {:.0} verifications / sec", verify_throughput);

    println!("\n[2/2] Benchmarking 56-byte Telemetry Packet unpacking (100,000 iterations)...");
    let frame = TelemetryFrame {
        device_id: "TRAILGUARD-DEMO-001".to_string(),
        timestamp_ms: 1700000000000,
        fall_detected: true,
        sos_active: false,
        gps_locked: true,
        battery_critical: false,
        hop_count: 1,
        heart_rate: 76,
        spo2: 98,
        temperature_c: 36.8,
        humidity_pct: 45.0,
        pressure_hpa: 1013.25,
        accel_x_g: 0.12,
        accel_y_g: -0.05,
        accel_z_g: 0.98,
        gyro_x_dps: 1.0,
        gyro_y_dps: -0.5,
        gyro_z_dps: 0.2,
        latitude: 45.123456,
        longitude: -121.654321,
        altitude_m: 1420,
        battery_pct: 88,
    };
    let device_raw = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08];
    let packed = frame.pack(device_raw);

    let start_unpack = Instant::now();
    let unpack_iterations = 100_000;
    for _ in 0..unpack_iterations {
        let unpacked = TelemetryFrame::unpack(&packed).unwrap();
        assert_eq!(unpacked.heart_rate, 76);
    }
    let unpack_elapsed = start_unpack.elapsed();
    let unpack_nanos = (unpack_elapsed.as_nanos() as f64) / unpack_iterations as f64;
    let unpack_throughput = unpack_iterations as f64 / unpack_elapsed.as_secs_f64();

    println!("      Completed in {:?}", unpack_elapsed);
    println!("      Mean latency: {:.2} ns / unpack", unpack_nanos);
    println!("      Throughput:   {:.0} packets / sec", unpack_throughput);
    println!("========================================");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        print_usage();
        return;
    }

    match args[1].as_str() {
        "benchmark" | "--benchmark" => {
            run_benchmark();
        }
        "unpack" => {
            if args.len() < 3 {
                eprintln!("Error: Missing hex packet data");
                std::process::exit(1);
            }
            let hex_str = args[2].trim();
            let bytes = match hex::decode(hex_str) {
                Ok(b) => b,
                Err(e) => {
                    eprintln!("Invalid hex: {}", e);
                    std::process::exit(1);
                }
            };
            match TelemetryFrame::unpack(&bytes) {
                Ok(frame) => match frame.to_json() {
                    Ok(json) => println!("{}", json),
                    Err(e) => {
                        eprintln!("JSON serialization error: {}", e);
                        std::process::exit(1);
                    }
                },
                Err(e) => {
                    eprintln!("Unpack error: {}", e);
                    std::process::exit(1);
                }
            }
        }
        "verify" => {
            if args.len() < 10 {
                eprintln!("Error: Required 8 arguments: <public_key> <method> <path> <device_id> <timestamp> <nonce> <body_hash> <signature>");
                std::process::exit(1);
            }
            let pk = &args[2];
            let method = &args[3];
            let path = &args[4];
            let device_id = &args[5];
            let timestamp = &args[6];
            let nonce = &args[7];
            let body_hash = &args[8];
            let sig = &args[9];

            match verify_canonical_request(
                pk.as_bytes(),
                method,
                path,
                device_id,
                timestamp,
                nonce,
                body_hash,
                sig.as_bytes(),
            ) {
                Ok(true) => {
                    println!("VALID");
                    std::process::exit(0);
                }
                Ok(false) => {
                    println!("INVALID");
                    std::process::exit(1);
                }
                Err(e) => {
                    eprintln!("Verification error: {}", e);
                    std::process::exit(2);
                }
            }
        }
        _ => {
            print_usage();
        }
    }
}
