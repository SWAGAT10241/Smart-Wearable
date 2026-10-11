// TrailGuard ESP32 / MicroPython Device Simulator
//
// Run:
//   npm run simulate
//
// Backend must already be running.
//
// Example:
//   DEVICE_ID=TRAILGUARD-DEMO-001 \
//   DEVICE_KEY=test-device-secret-001 \
//   npm run simulate
//
// IMPORTANT:
// - Device NEVER sends userId.
// - deviceId identifies the physical hardware.
// - Backend resolves deviceId -> userId.
// - HMAC authenticates the device.
// - Timestamp protects against replay attacks.

require("dotenv").config();

const crypto = require("crypto");
const logger = require("./utils/logger");

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

const BASE_URL = process.env.DEVICE_BASE_URL || `http://localhost:${PORT}/api`;

const DEVICE_ID = process.env.DEVICE_ID || "TRAILGUARD-DEMO-001";

const DEVICE_KEY = process.env.DEVICE_KEY || "test-device-secret-001";

const TELEMETRY_INTERVAL_MS = 3000;
const FALL_INTERVAL_MS = 60000;

// ─────────────────────────────────────────────
// Device state
// ─────────────────────────────────────────────

let latitude = 20.2961;
let longitude = 85.8245;
let altitude = 600;

let heartRate = 78;
let spo2 = 98;

let temperature = 21.5;
let humidity = 52;
let pressure = 1013.2;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.round(random(min, max));
}

function round(value, decimals = 2) {
  return Number(value.toFixed(decimals));
}

// ─────────────────────────────────────────────
// HMAC
// ─────────────────────────────────────────────

function createSignature(packet) {
  const payload = JSON.stringify(packet);

  return crypto.createHmac("sha256", DEVICE_KEY).update(payload).digest("hex");
}

// ─────────────────────────────────────────────
// MAX30100
// ─────────────────────────────────────────────

function generatePPG() {
  const samples = [];
  const sampleCount = 80;

  for (let i = 0; i < sampleCount; i++) {
    const phase = (i / sampleCount) * Math.PI * 2;

    const pulse =
      Math.sin(phase) * 900 + Math.sin(phase * 2) * 180 + random(-80, 80);

    samples.push(Math.round(50000 + pulse));
  }

  return samples;
}

function generateVitals() {
  heartRate = clamp(heartRate + random(-2, 2), 55, 120);

  spo2 = clamp(spo2 + randomInt(-1, 1), 94, 100);

  return {
    heartRate: Math.round(heartRate),
    spo2: Math.round(spo2),
    irSamples: generatePPG(),
    fingerPresent: true,
  };
}

// ─────────────────────────────────────────────
// BME280
// ─────────────────────────────────────────────

function generateEnvironment() {
  temperature = clamp(temperature + random(-0.3, 0.3), 15, 30);

  humidity = clamp(humidity + random(-1.5, 1.5), 30, 80);

  pressure = clamp(pressure + random(-0.5, 0.5), 990, 1030);

  return {
    temperature: round(temperature, 1),
    humidity: round(humidity, 1),
    pressure: round(pressure, 1),
  };
}

// ─────────────────────────────────────────────
// NEO-6M
// ─────────────────────────────────────────────

function generateLocation() {
  latitude += random(-0.0005, 0.0005);
  longitude += random(-0.0005, 0.0005);

  altitude = clamp(altitude + random(-2, 2), 550, 700);

  return {
    latitude: round(latitude, 6),
    longitude: round(longitude, 6),
    altitude: Math.round(altitude),
    satellites: randomInt(7, 12),
    locationStale: false,
  };
}

// ─────────────────────────────────────────────
// MPU6050
// ─────────────────────────────────────────────

function generateMotion() {
  const accelX = random(-0.15, 0.15);
  const accelY = random(-0.15, 0.15);
  const accelZ = 1 + random(-0.1, 0.1);

  const gyroX = random(-5, 5);
  const gyroY = random(-5, 5);
  const gyroZ = random(-5, 5);

  const totalAcceleration = Math.sqrt(accelX ** 2 + accelY ** 2 + accelZ ** 2);

  return {
    accelX: round(accelX),
    accelY: round(accelY),
    accelZ: round(accelZ),

    gyroX: round(gyroX),
    gyroY: round(gyroY),
    gyroZ: round(gyroZ),

    totalAcceleration: round(totalAcceleration),

    tiltAngle: round(random(0, 15), 1),

    fallDetected: false,
  };
}

// ─────────────────────────────────────────────
// Complete telemetry packet
// ─────────────────────────────────────────────

function buildTelemetryPacket() {
  const timestamp = Date.now();

  const vitals = generateVitals();
  const environment = generateEnvironment();
  const location = generateLocation();
  const motion = generateMotion();

  const packet = {
    deviceId: DEVICE_ID,
    timestamp,

    // MAX30100
    heartRate: vitals.heartRate,
    spo2: vitals.spo2,
    irSamples: vitals.irSamples,
    fingerPresent: vitals.fingerPresent,

    // BME280
    temperature: environment.temperature,
    humidity: environment.humidity,
    pressure: environment.pressure,

    // NEO-6M
    latitude: location.latitude,
    longitude: location.longitude,
    altitude: location.altitude,
    satellites: location.satellites,
    locationStale: location.locationStale,

    // MPU6050
    accelX: motion.accelX,
    accelY: motion.accelY,
    accelZ: motion.accelZ,

    gyroX: motion.gyroX,
    gyroY: motion.gyroY,
    gyroZ: motion.gyroZ,

    totalAcceleration: motion.totalAcceleration,

    tiltAngle: motion.tiltAngle,

    fallDetected: false,
  };

  packet.signature = createSignature(packet);

  return packet;
}

// ─────────────────────────────────────────────
// Send telemetry
// ─────────────────────────────────────────────

async function sendTelemetry() {
  const packet = buildTelemetryPacket();

  try {
    const response = await fetch(`${BASE_URL}/device/readings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(packet),
    });

    try {
      await response.json();
    } catch {
      // Ignore non-JSON responses; only the status is logged below.
    }

    if (!response.ok) {
      logger.warn("simulator.telemetry.rejected", { statusCode: response.status });
      return;
    }

    logger.info("simulator.telemetry.accepted");
  } catch (error) {
    logger.error("simulator.telemetry.request_failed", { error });
  }
}

// ─────────────────────────────────────────────
// Fall simulation
// ─────────────────────────────────────────────

async function simulateFall() {
  // 20% chance every minute.
  if (Math.random() >= 0.2) {
    return;
  }

  const timestamp = Date.now();

  const totalAcceleration = random(2.5, 4.5);

  const tiltAngle = randomInt(45, 90);

  const packet = {
    deviceId: DEVICE_ID,
    timestamp,

    fallDetected: true,

    accelX: round(random(-2, 2)),
    accelY: round(random(-2, 2)),
    accelZ: round(random(-2, 2)),

    tiltAngle,

    totalAcceleration: round(totalAcceleration),

    peakAccelG: round(random(2.4, 4.5)),

    peakGyroDps: round(random(240, 450)),

    postureChangeDeg: randomInt(45, 75),

    severity: totalAcceleration > 3.5 ? "severe" : "moderate",

    latitude: round(latitude, 6),

    longitude: round(longitude, 6),

    locationStale: false,
  };

  packet.signature = createSignature(packet);

  try {
    const response = await fetch(`${BASE_URL}/device/readings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(packet),
    });

    try {
      await response.json();
    } catch {
      // Ignore non-JSON responses; only the status is logged below.
    }

    if (!response.ok) {
      logger.warn("simulator.fall.rejected", { statusCode: response.status });
      return;
    }

    logger.info("simulator.fall.accepted");
  } catch (error) {
    logger.error("simulator.fall.request_failed", { error });
  }
}

// ─────────────────────────────────────────────
// LoRa simulation
// ─────────────────────────────────────────────

function simulateLoRa() {
  const connected = Math.random() > 0.05;
  logger.info(connected ? "simulator.lora.connected" : "simulator.lora.disconnected");
}

// ─────────────────────────────────────────────
// Startup
// ─────────────────────────────────────────────

logger.info("simulator.started");

// Start loops
setInterval(sendTelemetry, TELEMETRY_INTERVAL_MS);

setInterval(simulateFall, FALL_INTERVAL_MS);

setInterval(simulateLoRa, 10000);

// Send immediately instead of waiting 3 seconds.
sendTelemetry();
