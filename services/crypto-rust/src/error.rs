use thiserror::Error;

#[derive(Error, Debug, PartialEq, Eq)]
pub enum CryptoError {
    #[error("Invalid public key format: {0}")]
    InvalidPublicKey(String),

    #[error("Invalid signature format: {0}")]
    InvalidSignature(String),

    #[error("Cryptographic signature verification failed")]
    VerificationFailed,

    #[error("Timestamp skew exceeds maximum window (accepted: +/-{0} seconds)")]
    TimestampSkew(u64),

    #[error("Replay attack detected: nonce '{0}' was already consumed")]
    NonceReplayed(String),

    #[error("Invalid nonce format: {0}")]
    InvalidNonce(String),

    #[error("Malformed binary telemetry packet: {0}")]
    MalformedPacket(String),

    #[error("Invalid packet magic or version mismatch (expected SW v1)")]
    InvalidPacketHeader,

    #[error("Packet checksum CRC16 mismatch")]
    ChecksumMismatch,
}
