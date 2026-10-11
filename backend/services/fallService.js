const FallEvent = require("../models/FallEvent");
const AppError = require("../utils/appError");

/**
 * Fetch all fall events for the authenticated user.
 */
async function getUserFalls(userId) {
  return FallEvent.find({
    userId,
  }).sort({
    timestamp: -1,
  });
}

/**
 * Fetch latest fall event for the authenticated user.
 */
async function getLatestFall(userId) {
  const event = await FallEvent.findOne({
    userId,
  }).sort({
    timestamp: -1,
  });

  return event || {};
}

/**
 * Update the status of a fall event (e.g., detected, dismissed, resolved).
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
      status,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!event) {
    throw new AppError("Fall event not found", 404, "EVENT_NOT_FOUND");
  }

  broadcast({
    type: "fall_status_update",
    userId: String(userId),
    deviceId: event.deviceId,
    data: event,
  });

  return event;
}

module.exports = {
  getUserFalls,
  getLatestFall,
  updateFallStatus,
};
