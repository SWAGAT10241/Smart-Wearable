// Simulates an ESP32 wearable posting sensor data every few seconds.
// Run with: npm run simulate  (after the server is already running)
require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api`;
const DEVICE_ID = 'trailguard-demo-001';

let lat = 20.2961;
let lng = 85.8245;
let altitude = 600;

// Simulated sensor state
let heartRate = 78;
let spo2 = 98;
let temperature = 21.5;
let humidity = 52;
let pressure = 1013.2;

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

const random = (min, max) =>
  Math.random() * (max - min) + min;

const randomInt = (min, max) =>
  Math.round(random(min, max));

async function post(path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error(`POST ${path} failed: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`POST ${path} failed:`, error.message);
    return null;
  }
}

/* ─────────────────────────────────────────────
   MAX30100
   Heart rate + SpO₂ + simulated PPG
───────────────────────────────────────────── */

function generatePPG() {
  const samples = [];
  const sampleCount = 80;

  for (let i = 0; i < sampleCount; i++) {
    const phase = (i / sampleCount) * Math.PI * 2;

    const pulse =
      Math.sin(phase) * 900 +
      Math.sin(phase * 2) * 180 +
      random(-80, 80);

    samples.push(Math.round(50000 + pulse));
  }

  return samples;
}

setInterval(async () => {
  heartRate = clamp(
    heartRate + random(-2, 2),
    55,
    120
  );

  spo2 = clamp(
    spo2 + randomInt(-1, 1),
    94,
    100
  );

  const irSamples = generatePPG();

  await post('/vitals', {
    deviceId: DEVICE_ID,
    heartRate: Math.round(heartRate),
    spo2: Math.round(spo2),

    // Frontend-ready PPG signal
    irSamples,

    fingerPresent: true,

    timestamp: Date.now(),
  });

  console.log(
    `[MAX30100] HR: ${Math.round(heartRate)} BPM | SpO₂: ${Math.round(spo2)}%`
  );
}, 2000);


/* ─────────────────────────────────────────────
   BME280
   Temperature + Humidity + Pressure
───────────────────────────────────────────── */

setInterval(async () => {
  temperature = clamp(
    temperature + random(-0.3, 0.3),
    15,
    30
  );

  humidity = clamp(
    humidity + random(-1.5, 1.5),
    30,
    80
  );

  pressure = clamp(
    pressure + random(-0.5, 0.5),
    990,
    1030
  );

  await post('/environment', {
    deviceId: DEVICE_ID,

    temperature: Number(temperature.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    pressure: Number(pressure.toFixed(1)),

    timestamp: Date.now(),
  });

  console.log(
    `[BME280] ${temperature.toFixed(1)}°C | ${humidity.toFixed(
      1
    )}% | ${pressure.toFixed(1)} hPa`
  );
}, 3000);


/* ─────────────────────────────────────────────
   NEO-6M
   GPS position
───────────────────────────────────────────── */

setInterval(async () => {
  lat += random(-0.0005, 0.0005);
  lng += random(-0.0005, 0.0005);

  altitude = clamp(
    altitude + random(-2, 2),
    550,
    700
  );

  const satellites = randomInt(7, 12);

  await post('/location', {
    deviceId: DEVICE_ID,

    latitude: Number(lat.toFixed(6)),
    longitude: Number(lng.toFixed(6)),
    altitude: Math.round(altitude),
    satellites,

    locationStale: false,

    timestamp: Date.now(),
  });

  console.log(
    `[NEO-6M] ${lat.toFixed(6)}, ${lng.toFixed(
      6
    )} | ${satellites} satellites`
  );
}, 5000);


/* ─────────────────────────────────────────────
   MPU6050
   Accelerometer + Gyroscope
───────────────────────────────────────────── */

setInterval(async () => {
  const accelX = random(-0.15, 0.15);
  const accelY = random(-0.15, 0.15);
  const accelZ = 1 + random(-0.1, 0.1);

  const gyroX = random(-5, 5);
  const gyroY = random(-5, 5);
  const gyroZ = random(-5, 5);

  const totalAcceleration = Math.sqrt(
    accelX ** 2 +
    accelY ** 2 +
    accelZ ** 2
  );

  const tiltAngle = random(0, 15);

  // Normal MPU6050 telemetry
  console.log(
    `[MPU6050] Accel: ${totalAcceleration.toFixed(
      2
    )}g | Tilt: ${tiltAngle.toFixed(1)}°`
  );

}, 1000);


/* ─────────────────────────────────────────────
   FALL DETECTION
   Simulates an occasional confirmed fall
───────────────────────────────────────────── */

setInterval(async () => {
  // 20% chance every minute
  if (Math.random() >= 0.2) return;

  const accelX = random(-2, 2);
  const accelY = random(-2, 2);
  const accelZ = random(-2, 2);

  const totalAcceleration = random(2.5, 4.5);
  const tiltAngle = randomInt(45, 90);

  const peakAccelG = random(2.4, 4.5);
  const peakGyroDps = random(240, 450);
  const postureChange = randomInt(45, 75);

  await post('/falls', {
    deviceId: DEVICE_ID,

    accelX: Number(accelX.toFixed(2)),
    accelY: Number(accelY.toFixed(2)),
    accelZ: Number(accelZ.toFixed(2)),

    tiltAngle,
    totalAcceleration: Number(
      totalAcceleration.toFixed(2)
    ),

    peakAccelG: Number(peakAccelG.toFixed(2)),
    peakGyroDps: Number(peakGyroDps.toFixed(2)),
    postureChangeDeg: postureChange,

    severity: totalAcceleration > 3.5
      ? 'severe'
      : 'moderate',

    latitude: Number(lat.toFixed(6)),
    longitude: Number(lng.toFixed(6)),

    locationStale: false,

    timestamp: Date.now(),
  });

  console.log(
    `[MPU6050] ⚠️ FALL DETECTED | ${tiltAngle}° | ${totalAcceleration.toFixed(
      2
    )}g`
  );
}, 60000);


/* ─────────────────────────────────────────────
   LoRa
   Simulated communication status
───────────────────────────────────────────── */

setInterval(() => {
  const connected = Math.random() > 0.05;
  const rssi = randomInt(-110, -55);
  const snr = Number(random(-10, 12).toFixed(1));

  console.log(
    `[LoRa] ${
      connected ? 'CONNECTED' : 'DISCONNECTED'
    } | RSSI: ${rssi} dBm | SNR: ${snr} dB`
  );
}, 10000);


/* ─────────────────────────────────────────────
   Startup
───────────────────────────────────────────── */

console.log('');
console.log('==========================================');
console.log(' TrailGuard Wearable Simulator');
console.log('==========================================');
console.log(`Device : ${DEVICE_ID}`);
console.log(`Server : ${BASE_URL}`);
console.log('');
console.log('Sensors:');
console.log(' ✓ MAX30100  → HR / SpO₂ / PPG');
console.log(' ✓ BME280    → Temperature / Humidity / Pressure');
console.log(' ✓ NEO-6M    → GPS');
console.log(' ✓ MPU6050   → Motion / Fall detection');
console.log(' ✓ LoRa      → Link simulation');
console.log('==========================================');
console.log('');