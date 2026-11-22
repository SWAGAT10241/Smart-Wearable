pub mod error;
pub mod ffi;
pub mod nonce;
pub mod packet;
pub mod verifier;

pub use error::CryptoError;
pub use nonce::NonceTracker;
pub use packet::{compute_crc16, TelemetryFrame, PACKET_MAGIC, PACKET_SIZE, PACKET_VERSION};
pub use verifier::{
    build_canonical_message, compute_body_sha256, parse_public_key, parse_signature,
    verify_canonical_request,
};
