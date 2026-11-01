const mongoose = require("mongoose");
const FallEvent = require("../models/FallEvent");
const AppError = require("../utils/appError");

/**
 * Fetch all fall events for the authenticated user.
 */
async function getUserFalls(userId) {
  if (!userId || (typeof userId !== "string" && !mongoose.isValidObjectId(userId))) {
    throw new AppError("Invalid user ID provided", 400, "INVALID_ID");
  }
  return FallEvent.find({
    userId: String(userId),
  }).sort({
    timestamp: -1,
  });
}

/**
 * Fetch latest fall event for the authenticated user.
 */
async function getLatestFall(userId) {
  if (!userId || (typeof userId !== "string" && !mongoose.isValidObjectId(userId))) {
    throw new AppError("Invalid user ID provided", 400, "INVALID_ID");
  }
  const event = await FallEvent.findOne({
    userId: String(userId),
  }).sort({
    timestamp: -1,
  });

  return event || {};
}

/**
 * Update the status of a fall event (e.g., detected, dismissed, resolved).
 */
async function updateFallStatus(userId, fallId, status, broadcast = () => { }) {
  if (!status || typeof status !== "string") {
    throw new AppError("status is required", 400, "VALIDATION_ERROR");
  }
  if (!fallId || typeof fallId !== "string" || !mongoose.isValidObjectId(fallId)) {
    throw new AppError("Invalid fall event ID provided", 400, "INVALID_ID");
  }
  if (!userId || (typeof userId !== "string" && !mongoose.isValidObjectId(userId))) {
    throw new AppError("Invalid user ID provided", 400, "INVALID_ID");
  }

  const event = await FallEvent.findOneAndUpdate(
    {
      _id: String(fallId),
      userId: String(userId),
    },
    {
      $set: {
        status: String(status).trim(),
      },
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
    userId,
    data: event,
  });

  return event;
}

module.exports = {
  getUserFalls,
  getLatestFall,
  updateFallStatus,
};
