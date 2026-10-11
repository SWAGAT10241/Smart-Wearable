const EnvironmentReading = require("../models/EnvironmentReading");
const AppError = require("../utils/appError");

/**
 * Get latest recorded environment reading for a user's device.
 *
 * @param {string} userId
 * @param {string} deviceId
 * @returns {Promise<object>}
 */
async function getLatestEnvironment(userId, deviceId) {
  if (!deviceId) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  const reading = await EnvironmentReading.findOne({
    userId,
    deviceId: deviceId.toUpperCase(),
  }).sort({ timestamp: -1 });

  return reading || {};
}

/**
 * Get historical environment readings within a time window.
 *
 * @param {string} userId
 * @param {string} deviceId
 * @param {number} hours
 * @returns {Promise<Array>}
 */
async function getEnvironmentHistory(userId, deviceId, hours = 1) {
  if (!deviceId) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  const hoursNum = Number(hours);
  if (!Number.isFinite(hoursNum) || hoursNum <= 0) {
    throw new AppError("hours must be a positive number", 400, "VALIDATION_ERROR");
  }

  const since = new Date(Date.now() - hoursNum * 60 * 60 * 1000);

  return EnvironmentReading.find({
    userId,
    deviceId: deviceId.toUpperCase(),
    timestamp: { $gte: since },
  }).sort({ timestamp: 1 });
}

/**
 * Compute statistical aggregates (min, avg, max) for temperature, humidity, pressure.
 *
 * @param {string} userId
 * @param {string} deviceId
 * @param {number} hours
 * @returns {Promise<object>}
 */
async function getEnvironmentStats(userId, deviceId, hours = 1) {
  if (!deviceId) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  const hoursNum = Number(hours);
  if (!Number.isFinite(hoursNum) || hoursNum <= 0) {
    throw new AppError("hours must be a positive number", 400, "VALIDATION_ERROR");
  }

  const since = new Date(Date.now() - hoursNum * 60 * 60 * 1000);

  const result = await EnvironmentReading.aggregate([
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
        minTemperature: { $min: "$temperature" },
        averageTemperature: { $avg: "$temperature" },
        maxTemperature: { $max: "$temperature" },
        minHumidity: { $min: "$humidity" },
        averageHumidity: { $avg: "$humidity" },
        maxHumidity: { $max: "$humidity" },
        minPressure: { $min: "$pressure" },
        averagePressure: { $avg: "$pressure" },
        maxPressure: { $max: "$pressure" },
        readingCount: { $sum: 1 },
      },
    },
  ]);

  const stats = result[0];
  if (!stats) {
    return {
      minTemperature: null,
      averageTemperature: null,
      maxTemperature: null,
      minHumidity: null,
      averageHumidity: null,
      maxHumidity: null,
      minPressure: null,
      averagePressure: null,
      maxPressure: null,
      readingCount: 0,
    };
  }

  return {
    minTemperature: stats.minTemperature != null ? Number(stats.minTemperature.toFixed(1)) : null,
    averageTemperature: stats.averageTemperature != null ? Number(stats.averageTemperature.toFixed(1)) : null,
    maxTemperature: stats.maxTemperature != null ? Number(stats.maxTemperature.toFixed(1)) : null,
    minHumidity: stats.minHumidity != null ? Number(stats.minHumidity.toFixed(1)) : null,
    averageHumidity: stats.averageHumidity != null ? Number(stats.averageHumidity.toFixed(1)) : null,
    maxHumidity: stats.maxHumidity != null ? Number(stats.maxHumidity.toFixed(1)) : null,
    minPressure: stats.minPressure != null ? Number(stats.minPressure.toFixed(1)) : null,
    averagePressure: stats.averagePressure != null ? Number(stats.averagePressure.toFixed(1)) : null,
    maxPressure: stats.maxPressure != null ? Number(stats.maxPressure.toFixed(1)) : null,
    readingCount: stats.readingCount,
  };
}

module.exports = {
  getLatestEnvironment,
  getEnvironmentHistory,
  getEnvironmentStats,
};
