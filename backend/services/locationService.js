const LocationReading = require("../models/LocationReading");
const AppError = require("../utils/appError");

/**
 * Fetch latest GPS location reading for the authenticated user.
 */
async function getLatest(userId) {
  const reading = await LocationReading.findOne({
    userId,
  }).sort({
    timestamp: -1,
  });

  return reading || {};
}

/**
 * Fetch GPS location history for the authenticated user within the given hours window.
 */
async function getHistory(userId, hours = 24) {
  const numericHours = Number(hours);

  if (!Number.isFinite(numericHours) || numericHours <= 0) {
    throw new AppError("hours must be a positive number", 400, "VALIDATION_ERROR");
  }

  const since = new Date(Date.now() - numericHours * 60 * 60 * 1000);

  return LocationReading.find({
    userId,
    timestamp: {
      $gte: since,
    },
  }).sort({
    timestamp: 1,
  });
}

module.exports = {
  getLatest,
  getHistory,
};
