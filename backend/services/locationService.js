const LocationReading = require("../models/LocationReading");
const AppError = require("../utils/appError");

/**
 * Get latest recorded location for user.
 *
 * @param {string} userId
 * @param {string} [deviceId]
 * @returns {Promise<object>}
 */
async function getLatestLocation(userId, deviceId) {
  const query = { userId };
  if (deviceId) {
    query.deviceId = deviceId.toUpperCase();
  }

  const reading = await LocationReading.findOne(query).sort({ timestamp: -1 });
  return reading || {};
}

/**
 * Get historical location readings for breadcrumb trace.
 *
 * @param {string} userId
 * @param {string} [deviceId]
 * @param {number} hours
 * @returns {Promise<Array>}
 */
async function getLocationHistory(userId, deviceId, hours = 24) {
  const hoursNum = Number(hours);
  if (!Number.isFinite(hoursNum) || hoursNum <= 0) {
    throw new AppError("hours must be a positive number", 400, "VALIDATION_ERROR");
  }

  const since = new Date(Date.now() - hoursNum * 60 * 60 * 1000);
  const query = {
    userId,
    timestamp: { $gte: since },
  };

  if (deviceId) {
    query.deviceId = deviceId.toUpperCase();
  }

  return LocationReading.find(query).sort({ timestamp: 1 });
}

module.exports = {
  getLatestLocation,
  getLocationHistory,
};
