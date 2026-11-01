const VitalsReading = require("../models/VitalsReading");
const AppError = require("../utils/appError");

/**
 * Fetch latest vitals reading for a device belonging to the user.
 */
async function getLatest(userId, deviceId) {
  if (!deviceId) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  const reading = await VitalsReading.findOne({
    userId,
    deviceId: deviceId.toUpperCase(),
  }).sort({
    timestamp: -1,
  });

  return reading || {};
}

/**
 * Fetch vitals history for a given duration.
 */
async function getHistory(userId, deviceId, hours = 1) {
  const numericHours = Number(hours);

  if (!deviceId) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  if (!Number.isFinite(numericHours) || numericHours <= 0) {
    throw new AppError("hours must be a positive number", 400, "VALIDATION_ERROR");
  }

  const since = new Date(Date.now() - numericHours * 60 * 60 * 1000);

  return VitalsReading.find({
    userId,
    deviceId: deviceId.toUpperCase(),
    timestamp: {
      $gte: since,
    },
  }).sort({
    timestamp: 1,
  });
}

/**
 * Calculate vitals statistics (min, avg, max for HR and SpO2).
 */
async function getStats(userId, deviceId, hours = 1) {
  const numericHours = Number(hours);

  if (!deviceId) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  if (!Number.isFinite(numericHours) || numericHours <= 0) {
    throw new AppError("hours must be a positive number", 400, "VALIDATION_ERROR");
  }

  const since = new Date(Date.now() - numericHours * 60 * 60 * 1000);

  const result = await VitalsReading.aggregate([
    {
      $match: {
        userId,
        deviceId: deviceId.toUpperCase(),
        timestamp: { $gte: since },
      },
    },
    {
      $group: {
        _id: null,
        minHeartRate: { $min: "$heartRate" },
        averageHeartRate: { $avg: "$heartRate" },
        maxHeartRate: { $max: "$heartRate" },
        minSpo2: { $min: "$spo2" },
        averageSpo2: { $avg: "$spo2" },
        maxSpo2: { $max: "$spo2" },
        readingCount: { $sum: 1 },
      },
    },
  ]);

  const stats = result[0];

  if (!stats) {
    return {
      minHeartRate: null,
      averageHeartRate: null,
      maxHeartRate: null,
      minSpo2: null,
      averageSpo2: null,
      maxSpo2: null,
      readingCount: 0,
    };
  }

  return {
    minHeartRate: stats.minHeartRate != null ? Math.round(stats.minHeartRate) : null,
    averageHeartRate: stats.averageHeartRate != null ? Math.round(stats.averageHeartRate) : null,
    maxHeartRate: stats.maxHeartRate != null ? Math.round(stats.maxHeartRate) : null,
    minSpo2: stats.minSpo2 != null ? Math.round(stats.minSpo2) : null,
    averageSpo2: stats.averageSpo2 != null ? Number(stats.averageSpo2.toFixed(1)) : null,
    maxSpo2: stats.maxSpo2 != null ? Math.round(stats.maxSpo2) : null,
    readingCount: stats.readingCount,
  };
}

module.exports = {
  getLatest,
  getHistory,
  getStats,
};
