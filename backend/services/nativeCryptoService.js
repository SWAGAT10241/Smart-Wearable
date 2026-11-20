const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const crypto = require("crypto");

const RUST_BIN_PATH = path.resolve(
  __dirname,
  "../../services/crypto-rust/target/release/trailguard-crypto"
);

let isNativeAvailable = null;

function checkNativeAvailability() {
  if (isNativeAvailable !== null) {
    return isNativeAvailable;
  }
  try {
    if (fs.existsSync(RUST_BIN_PATH)) {
      // Test basic execution
      execFileSync(RUST_BIN_PATH, [], { stdio: "ignore" });
      isNativeAvailable = true;
    } else {
      isNativeAvailable = false;
    }
  } catch (err) {
    // Binary exiting with code 0 or usage is fine
    isNativeAvailable = fs.existsSync(RUST_BIN_PATH);
  }
  return isNativeAvailable;
}

/**
 * Verifies a canonical SWAAS Ed25519 request signature.
 * Tries the high-performance Rust core first (<50µs), falling back to Node.js crypto.
 */
function verifyCanonicalSignature({
  publicKey,
  method,
  path: requestPath,
  deviceId,
  timestamp,
  nonce,
  bodyHash,
  signature,
}) {
  const canonicalMessage = [
    "v1",
    method.toUpperCase(),
    requestPath,
    deviceId,
    timestamp,
    nonce,
    bodyHash,
  ].join("\n");

  // Attempt Rust native verification if available
  if (checkNativeAvailability()) {
    try {
      const output = execFileSync(
        RUST_BIN_PATH,
        [
          "verify",
          publicKey,
          method.toUpperCase(),
          requestPath,
          deviceId,
          String(timestamp),
          nonce,
          bodyHash,
          signature,
        ],
        {
          encoding: "utf8",
          timeout: 1000,
          stdio: ["ignore", "pipe", "ignore"],
        }
      );
      return output.trim() === "VALID";
    } catch {
      // Fall through to Node.js crypto verification
    }
  }

  // Node.js fallback verification
  try {
    let keyObject;
    try {
      keyObject = crypto.createPublicKey(publicKey);
    } catch {
      return false;
    }

    if (keyObject.asymmetricKeyType !== "ed25519") {
      return false;
    }

    let decodedSig;
    try {
      if (/^[A-Za-z0-9_-]{86}$/.test(signature)) {
        decodedSig = Buffer.from(signature, "base64url");
      } else if (/^[0-9a-fA-F]{128}$/.test(signature)) {
        decodedSig = Buffer.from(signature, "hex");
      } else {
        decodedSig = Buffer.from(signature, "base64");
      }
    } catch {
      return false;
    }

    if (decodedSig.length !== 64) {
      return false;
    }

    return crypto.verify(
      null,
      Buffer.from(canonicalMessage, "utf8"),
      keyObject,
      decodedSig
    );
  } catch {
    return false;
  }
}

/**
 * Unpacks a 56-byte compact binary telemetry packet.
 */
function unpackTelemetryPacket(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 56) {
    throw new Error("Invalid telemetry packet: must be a Buffer of at least 56 bytes");
  }

  if (checkNativeAvailability()) {
    try {
      const hexData = buffer.toString("hex");
      const output = execFileSync(RUST_BIN_PATH, ["unpack", hexData], {
        encoding: "utf8",
        timeout: 1000,
        stdio: ["ignore", "pipe", "ignore"],
      });
      return JSON.parse(output.trim());
    } catch (err) {
      // If native fails, throw error
      throw new Error(`Rust unpack failed: ${err.message}`);
    }
  }

  throw new Error("Native Rust telemetry unpacker is not available");
}

function getEngineStatus() {
  const available = checkNativeAvailability();
  return {
    engine: available ? "rust-native" : "node-fallback",
    binaryPath: RUST_BIN_PATH,
    nativeAvailable: available,
  };
}

module.exports = {
  verifyCanonicalSignature,
  unpackTelemetryPacket,
  getEngineStatus,
};
