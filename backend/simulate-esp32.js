// Simulates an ESP32 wearable posting sensor data every few seconds.
// Run with: npm run simulate  (after the server is already running)
require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api`;
const DEVICE_ID = 'trailguard-demo-001';

let lat = 20.2961;
let lng = 85.8245;

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

// Vitals + environment every 2s
setInterval(async () => {
  await post('/vitals', {
    deviceId: DEVICE_ID,
    heartRate: 72 + Math.round(Math.random() * 14),
    spo2: 95 + Math.round(Math.random() * 4),
  });

  await post('/environment', {
    deviceId: DEVICE_ID,
    temperature: 18 + Math.random() * 6,
    humidity: 40 + Math.random() * 20,
  });
}, 2000);

// GPS every 5s — walks the coordinates slightly to simulate movement
setInterval(async () => {
  lat += (Math.random() - 0.5) * 0.0005;
  lng += (Math.random() - 0.5) * 0.0005;
  await post('/location', {
    deviceId: DEVICE_ID,
    latitude: lat,
    longitude: lng,
    altitude: 600 + Math.round(Math.random() * 20),
    satellites: 7 + Math.round(Math.random() * 4),
  });
}, 5000);

// Random fall event every ~60s, just for demo purposes
setInterval(async () => {
  if (Math.random() < 0.3) {
    await post('/falls', {
      deviceId: DEVICE_ID,
      accelX: (Math.random() * 4 - 2).toFixed(2),
      accelY: (Math.random() * 4 - 2).toFixed(2),
      accelZ: (Math.random() * 4 - 2).toFixed(2),
      tiltAngle: 60 + Math.round(Math.random() * 30),
      totalAcceleration: 3.2,
      severity: 'moderate',
      latitude: lat,
      longitude: lng,
    });
    console.log('Simulated fall event sent');
  }
}, 60000);

console.log(`Simulating ESP32 device "${DEVICE_ID}" -> ${BASE_URL}`);
