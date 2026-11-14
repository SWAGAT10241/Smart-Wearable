const FallEvent = require("../models/FallEvent");
const AppError = require("../utils/appError");

/**
 * Get fall events belonging to the authenticated user.
 *
 * @param {string} userId
 * @param {string} [deviceId]
 * @returns {Promise<Array>}
 */
async function getFalls(userId, deviceId) {
  const query = { userId };
  if (deviceId) {
    query.deviceId = deviceId.toUpperCase();
  }

  return FallEvent.find(query).sort({ timestamp: -1 });
}

/**
 * Get latest recorded fall event for user.
 *
 * @param {string} userId
 * @param {string} [deviceId]
 * @returns {Promise<object>}
 */
async function getLatestFall(userId, deviceId) {
  const query = { userId };
  if (deviceId) {
    query.deviceId = deviceId.toUpperCase();
  }

  const event = await FallEvent.findOne(query).sort({ timestamp: -1 });
  return event || {};
}

/**
 * Update fall event resolution status (e.g., confirmed, false alarm, dismissed).
 *
 * @param {string} userId
 * @param {string} fallId
 * @param {string} status
 * @param {Function} [broadcast]
 * @returns {Promise<object>}
 */
async function updateFallStatus(userId, fallId, status, broadcast = () => {}) {
  if (!status) {
    throw new AppError("status is required", 400, "VALIDATION_ERROR");
  }

  const event = await FallEvent.findOneAndUpdate(
    {
      _id: fallId,
      userId,
    },
    {
      $set: { status },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!event) {
    throw new AppError("Fall event not found", 404, "FALL_NOT_FOUND");
  }

  broadcast({
    type: "fall_status_update",
    data: event,
  });

  return event;
}

module.exports = {
  getFalls,
  getLatestFall,
  updateFallStatus,
};
