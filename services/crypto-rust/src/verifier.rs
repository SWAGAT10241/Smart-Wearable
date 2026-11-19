use crate::error::CryptoError;
use ed25519_dalek::{Signature, Verifier, VerifyingKey};
use sha2::{Digest, Sha256};

/// SPKI prefix for Ed25519 public keys (ASN.1 SubjectPublicKeyInfo prefix)
/// 30 2a 30 05 06 03 2b 65 70 03 21 00 (12 bytes)
const ED25519_SPKI_PREFIX: [u8; 12] = [
    0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00,
];

/// Extracts a 32-byte Ed25519 verifying key from raw bytes, SPKI DER, or PEM.
pub fn parse_public_key(input: &[u8]) -> Result<VerifyingKey, CryptoError> {
    if input.len() == 32 {
        let key_bytes: [u8; 32] = input.try_into().map_err(|_| {
            CryptoError::InvalidPublicKey("Failed to read 32-byte raw key".to_string())
        })?;
        return VerifyingKey::from_bytes(&key_bytes)
            .map_err(|e| CryptoError::InvalidPublicKey(e.to_string()));
    }

    // SPKI DER format check (44 bytes total: 12 bytes prefix + 32 bytes key)
    if input.len() == 44 && input.starts_with(&ED25519_SPKI_PREFIX) {
        let key_bytes: [u8; 32] = input[12..44].try_into().map_err(|_| {
            CryptoError::InvalidPublicKey("Invalid SPKI key slice".to_string())
        })?;
        return VerifyingKey::from_bytes(&key_bytes)
            .map_err(|e| CryptoError::InvalidPublicKey(e.to_string()));
    }

    // Attempt base64 decoding if input is ASCII / PEM string
    if let Ok(key_str) = std::str::from_utf8(input) {
        let cleaned = key_str
            .lines()
            .filter(|line| !line.starts_with("-----"))
            .collect::<String>()
            .replace([' ', '\n', '\r', '\t'], "");

        // Try base64url or standard base64
        let decoded = decode_base64_or_hex(&cleaned)
            .map_err(|_| CryptoError::InvalidPublicKey("Malformed key encoding".to_string()))?;

        if decoded.len() == 32 {
            let key_bytes: [u8; 32] = decoded.as_slice().try_into().unwrap();
            return VerifyingKey::from_bytes(&key_bytes)
                .map_err(|e| CryptoError::InvalidPublicKey(e.to_string()));
        } else if decoded.len() == 44 && decoded.starts_with(&ED25519_SPKI_PREFIX) {
            let key_bytes: [u8; 32] = decoded[12..44].try_into().unwrap();
            return VerifyingKey::from_bytes(&key_bytes)
                .map_err(|e| CryptoError::InvalidPublicKey(e.to_string()));
        }
    }

    Err(CryptoError::InvalidPublicKey(format!(
        "Unsupported public key length: {} bytes (expected 32 or 44 SPKI)",
        input.len()
    )))
}

/// Parses a 64-byte Ed25519 digital signature from binary or base64url.
pub fn parse_signature(input: &[u8]) -> Result<Signature, CryptoError> {
    if input.len() == 64 {
        let sig_bytes: [u8; 64] = input.try_into().map_err(|_| {
            CryptoError::InvalidSignature("Failed to read 64-byte signature".to_string())
        })?;
        return Ok(Signature::from_bytes(&sig_bytes));
    }

    if let Ok(sig_str) = std::str::from_utf8(input) {
        let cleaned = sig_str.trim();
        let decoded = decode_base64_or_hex(cleaned)
            .map_err(|_| CryptoError::InvalidSignature("Malformed signature encoding".to_string()))?;

        if decoded.len() == 64 {
            let sig_bytes: [u8; 64] = decoded.as_slice().try_into().unwrap();
            return Ok(Signature::from_bytes(&sig_bytes));
        }
    }

    Err(CryptoError::InvalidSignature(format!(
        "Invalid signature length: {} bytes (expected 64 bytes)",
        input.len()
    )))
}

/// Builds the canonical SWAAS v1 authentication message string.
/// Format: "v1\n{METHOD}\n{PATH}\n{DEVICE_ID}\n{TIMESTAMP}\n{NONCE}\n{BODY_HASH}"
pub fn build_canonical_message(
    method: &str,
    path: &str,
    device_id: &str,
    timestamp: &str,
    nonce: &str,
    body_hash: &str,
) -> String {
    format!(
        "v1\n{}\n{}\n{}\n{}\n{}\n{}",
        method.to_uppercase(),
        path,
        device_id.trim().to_uppercase(),
        timestamp.trim(),
        nonce.trim(),
        body_hash.trim().to_lowercase()
    )
}

/// Computes a hex-encoded SHA-256 digest of raw request bytes.
pub fn compute_body_sha256(body: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(body);
    hex::encode(hasher.finalize())
}

/// High-speed bare-metal verification of a canonical SWAAS request.
pub fn verify_canonical_request(
    public_key_raw: &[u8],
    method: &str,
    path: &str,
    device_id: &str,
    timestamp: &str,
    nonce: &str,
    body_hash: &str,
    signature_raw: &[u8],
) -> Result<bool, CryptoError> {
    let verifying_key = parse_public_key(public_key_raw)?;
    let signature = parse_signature(signature_raw)?;

    let canonical_message = build_canonical_message(
        method,
        path,
        device_id,
        timestamp,
        nonce,
        body_hash,
    );

    verifying_key
        .verify(canonical_message.as_bytes(), &signature)
        .map(|_| true)
        .map_err(|_| CryptoError::VerificationFailed)
}

/// Helper to decode hex or base64 / base64url strings.
fn decode_base64_or_hex(input: &str) -> Result<Vec<u8>, ()> {
    if input.len() % 2 == 0 && input.chars().all(|c| c.is_ascii_hexdigit()) {
        if let Ok(bytes) = hex::decode(input) {
            return Ok(bytes);
        }
    }

    // Try base64url or standard base64 decoding with padding tolerance
    let mut padded = input.replace('-', "+").replace('_', "/");
    while padded.len() % 4 != 0 {
        padded.push('=');
    }

    // Basic standard base64 decoder
    let mut decoded = Vec::new();
    let chars: Vec<char> = padded.chars().collect();
    let mut i = 0;
    while i < chars.len() {
        if i + 4 > chars.len() {
            break;
        }
        let b0 = b64_val(chars[i]);
        let b1 = b64_val(chars[i + 1]);
        let b2 = b64_val(chars[i + 2]);
        let b3 = b64_val(chars[i + 3]);

        if b0.is_none() || b1.is_none() {
            return Err(());
        }

        let u0 = b0.unwrap();
        let u1 = b1.unwrap();
        decoded.push((u0 << 2) | (u1 >> 4));

        if let Some(u2) = b2 {
            decoded.push(((u1 & 0xF) << 4) | (u2 >> 2));
            if let Some(u3) = b3 {
                decoded.push(((u2 & 0x3) << 6) | u3);
            }
        }
        i += 4;
    }

    Ok(decoded)
}

fn b64_val(c: char) -> Option<u8> {
    match c {
        'A'..='Z' => Some(c as u8 - b'A'),
        'a'..='z' => Some(c as u8 - b'a' + 26),
        '0'..='9' => Some(c as u8 - b'0' + 52),
        '+' => Some(62),
        '/' => Some(63),
        '=' => None,
        _ => None,
    }
}
