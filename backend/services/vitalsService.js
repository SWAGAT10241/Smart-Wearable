const VitalsReading = require("../models/VitalsReading");
const AppError = require("../utils/appError");

/**
 * Get the latest recorded vitals reading for a user's device.
 *
 * @param {string} userId
 * @param {string} deviceId
 * @returns {Promise<object>}
 */
async function getLatestVitals(userId, deviceId) {
  if (!deviceId) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  const reading = await VitalsReading.findOne({
    userId,
    deviceId: deviceId.toUpperCase(),
  }).sort({ timestamp: -1 });

  return reading || {};
}

/**
 * Get historical vitals readings within a given number of hours.
 *
 * @param {string} userId
 * @param {string} deviceId
 * @param {number} hours
 * @returns {Promise<Array>}
 */
async function getVitalsHistory(userId, deviceId, hours = 1) {
  if (!deviceId) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  const hoursNum = Number(hours);
  if (!Number.isFinite(hoursNum) || hoursNum <= 0) {
    throw new AppError("hours must be a positive number", 400, "VALIDATION_ERROR");
  }

  const since = new Date(Date.now() - hoursNum * 60 * 60 * 1000);

  return VitalsReading.find({
    userId,
    deviceId: deviceId.toUpperCase(),
    timestamp: { $gte: since },
  }).sort({ timestamp: 1 });
}

/**
 * Compute statistical aggregates (min, avg, max) for vitals over a time window.
 *
 * @param {string} userId
 * @param {string} deviceId
 * @param {number} hours
 * @returns {Promise<object>}
 */
async function getVitalsStats(userId, deviceId, hours = 1) {
  if (!deviceId) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  const hoursNum = Number(hours);
  if (!Number.isFinite(hoursNum) || hoursNum <= 0) {
    throw new AppError("hours must be a positive number", 400, "VALIDATION_ERROR");
  }

  const since = new Date(Date.now() - hoursNum * 60 * 60 * 1000);

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
  getLatestVitals,
  getVitalsHistory,
  getVitalsStats,
};
