use crate::error::CryptoError;
use std::collections::HashSet;
use std::sync::RwLock;

/// Accepted skew in milliseconds: +/- 5 minutes
pub const DEFAULT_TIMESTAMP_SKEW_MS: u64 = 5 * 60 * 1000;

/// Fast thread-safe in-memory nonce tracker for zero-GC replay prevention.
pub struct NonceTracker {
    max_skew_ms: u64,
    consumed_nonces: RwLock<HashSet<String>>,
}

impl NonceTracker {
    pub fn new(max_skew_ms: u64) -> Self {
        Self {
            max_skew_ms,
            consumed_nonces: RwLock::new(HashSet::new()),
        }
    }

    /// Validates timestamp freshness within the allowed skew window.
    pub fn validate_timestamp(&self, timestamp_ms: u64, now_ms: u64) -> Result<(), CryptoError> {
        let diff = if now_ms >= timestamp_ms {
            now_ms - timestamp_ms
        } else {
            timestamp_ms - now_ms
        };

        if diff > self.max_skew_ms {
            return Err(CryptoError::TimestampSkew(self.max_skew_ms / 1000));
        }

        Ok(())
    }

    /// Checks and consumes a nonce for a given device.
    /// Returns `Ok(())` if fresh, or `Err(CryptoError::NonceReplayed)` if already seen.
    pub fn consume_nonce(&self, device_id: &str, nonce: &str) -> Result<(), CryptoError> {
        let key = format!("{}:{}", device_id.trim().to_uppercase(), nonce.trim());

        // Fast read check
        {
            let read_guard = self.consumed_nonces.read().unwrap();
            if read_guard.contains(&key) {
                return Err(CryptoError::NonceReplayed(nonce.to_string()));
            }
        }

        // Write insertion
        let mut write_guard = self.consumed_nonces.write().unwrap();
        if !write_guard.insert(key) {
            return Err(CryptoError::NonceReplayed(nonce.to_string()));
        }

        Ok(())
    }

    /// Prunes stale entries when cache grows large
    pub fn clear(&self) {
        let mut write_guard = self.consumed_nonces.write().unwrap();
        write_guard.clear();
    }

    /// Returns the number of currently tracked nonces.
    pub fn count(&self) -> usize {
        self.consumed_nonces.read().unwrap().len()
    }
}

impl Default for NonceTracker {
    fn default() -> Self {
        Self::new(DEFAULT_TIMESTAMP_SKEW_MS)
    }
}
