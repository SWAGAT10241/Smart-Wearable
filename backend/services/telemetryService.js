const Device = require("../models/Device");
const VitalsReading = require("../models/VitalsReading");
const EnvironmentReading = require("../models/EnvironmentReading");
const LocationReading = require("../models/LocationReading");
const FallEvent = require("../models/FallEvent");
const User = require("../models/User");
const { dispatchEmergencyAlerts } = require("./emergencyService");
const AppError = require("../utils/appError");

/**
 * Ingest and process telemetry data packets sent by hardware devices.
 *
 * @param {object} payload - Telemetry packet payload
 * @param {Function} [broadcast] - Broadcast callback for real-time subscribers
 * @returns {Promise<object>}
 */
async function processReadings(payload, broadcast = () => {}, existingDevice = null) {
  const {
    deviceId,
    heartRate,
    spo2,
    irSamples,
    temperature,
    humidity,
    pressure,
    latitude,
    longitude,
    altitude,
    satellites,
    fallDetected,
    accelX,
    accelY,
    accelZ,
    gyroX,
    gyroY,
    gyroZ,
    tiltAngle,
    totalAcceleration,
    peakAccelG,
    peakGyroDps,
    postureChangeDeg,
    severity,
    locationStale,
    timestamp,
  } = payload;

  if (!deviceId) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  const normalizedDeviceId = deviceId.trim().toUpperCase();

  const device =
    existingDevice ||
    (await Device.findOne({
      deviceId: normalizedDeviceId,
      status: "active",
    }));

  if (!device) {
    throw new AppError("Unknown or inactive device", 401, "INACTIVE_DEVICE");
  }

  const readingTimestamp = timestamp ? new Date(timestamp) : new Date();

  if (Number.isNaN(readingTimestamp.getTime())) {
    throw new AppError("Invalid timestamp", 400, "VALIDATION_ERROR");
  }

  const saved = {};

  // 1. Process Vitals
  if (heartRate != null || spo2 != null) {
    if (heartRate == null || spo2 == null) {
      throw new AppError(
        "heartRate and spo2 must be provided together",
        400,
        "VALIDATION_ERROR",
      );
    }

    const reading = await VitalsReading.create({
      deviceId: normalizedDeviceId,
      userId: device.userId,
      heartRate: Number(heartRate),
      spo2: Number(spo2),
      irSamples: Array.isArray(irSamples) ? irSamples : [],
      timestamp: readingTimestamp,
    });

    saved.vitals = reading;

    broadcast({
      type: "vitals",
      deviceId: normalizedDeviceId,
      userId: device.userId,
      data: reading,
    });
  }

  // 2. Process Environment
  if (temperature != null || humidity != null) {
    if (temperature == null || humidity == null) {
      throw new AppError(
        "temperature and humidity must be provided together",
        400,
        "VALIDATION_ERROR",
      );
    }

    const reading = await EnvironmentReading.create({
      deviceId: normalizedDeviceId,
      userId: device.userId,
      temperature: Number(temperature),
      humidity: Number(humidity),
      pressure: pressure != null ? Number(pressure) : undefined,
      timestamp: readingTimestamp,
    });

    saved.environment = reading;

    broadcast({
      type: "environment",
      deviceId: normalizedDeviceId,
      userId: device.userId,
      data: reading,
    });
  }

  // 3. Process Location
  if (latitude != null || longitude != null) {
    if (latitude == null || longitude == null) {
      throw new AppError(
        "latitude and longitude must be provided together",
        400,
        "VALIDATION_ERROR",
      );
    }

    const reading = await LocationReading.create({
      deviceId: normalizedDeviceId,
      userId: device.userId,
      latitude: Number(latitude),
      longitude: Number(longitude),
      altitude: altitude != null ? Number(altitude) : undefined,
      satellites: satellites != null ? Number(satellites) : undefined,
      locationStale:
        locationStale != null ? Boolean(locationStale) : undefined,
      timestamp: readingTimestamp,
    });

    saved.location = reading;

    broadcast({
      type: "location",
      deviceId: normalizedDeviceId,
      userId: device.userId,
      data: reading,
    });
  }

  // 4. Process Fall Event
  if (fallDetected === true) {
    const fallEvent = await FallEvent.create({
      deviceId: normalizedDeviceId,
      userId: device.userId,
      accelX: accelX != null ? Number(accelX) : undefined,
      accelY: accelY != null ? Number(accelY) : undefined,
      accelZ: accelZ != null ? Number(accelZ) : undefined,
      tiltAngle: tiltAngle != null ? Number(tiltAngle) : undefined,
      totalAcceleration:
        totalAcceleration != null ? Number(totalAcceleration) : undefined,
      peakAccelG: peakAccelG != null ? Number(peakAccelG) : undefined,
      peakGyroDps: peakGyroDps != null ? Number(peakGyroDps) : undefined,
      postureChangeDeg:
        postureChangeDeg != null ? Number(postureChangeDeg) : undefined,
      severity: severity || "moderate",
      latitude: latitude != null ? Number(latitude) : undefined,
      longitude: longitude != null ? Number(longitude) : undefined,
      status: "detected",
      timestamp: readingTimestamp,
    });

    const user = await User.findById(device.userId).select(
      "username emergencyContactName emergencyContactPhone",
    );

    if (user?.emergencyContactPhone) {
      await dispatchEmergencyAlerts({
        to: user.emergencyContactPhone,
        userName: user.username,
        latitude,
        longitude,
      });
    }

    saved.fall = fallEvent;

    broadcast({
      type: "fall_detected",
      deviceId: normalizedDeviceId,
      userId: device.userId,
      data: fallEvent,
    });
  }

  // 5. Update device heartbeat
  device.lastSeen = new Date();
  await device.save();

  return {
    success: true,
    device: {
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      userId: device.userId,
      lastSeen: device.lastSeen,
    },
    saved,
  };
}

module.exports = {
  processReadings,
};
