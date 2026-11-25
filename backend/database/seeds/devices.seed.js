/**
 * TrailGuard — Device Seeding Script
 * Creates baseline test wearable devices.
 */
const Device = require("../../models/Device");
const User = require("../../models/User");

async function seedDevices() {
  const citizen = await User.findOne({ email: "citizen@trailguard.local" });
  
  const SEED_DEVICES = [
    {
      deviceId: "TG-DEMO-001",
      deviceName: "Alpine Explorer Wearable",
      userId: citizen ? citizen._id : null,
      status: "active",
      lastSeen: new Date(),
    },
    {
      deviceId: "TG-DEMO-002",
      deviceName: "Lone Worker Beacon",
      userId: null,
      status: "active",
      lastSeen: new Date(),
    },
  ];

  const seeded = [];
  for (const deviceData of SEED_DEVICES) {
    const existing = await Device.findOne({ deviceId: deviceData.deviceId });
    if (!existing) {
      const device = await Device.create(deviceData);
      seeded.push(device.deviceId);
    }
  }
  return seeded;
}

module.exports = { seedDevices };
