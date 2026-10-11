const Device = require("../models/Device");
const AppError = require("../utils/appError");

/**
 * Register or pair a physical device to an authenticated user account.
 *
 * @param {string} userId - Authenticated user ID
 * @param {object} params
 * @param {string} params.deviceId - Hardware identifier
 * @param {string} [params.deviceName] - Friendly name for wearable
 * @param {boolean} [params.isRegistrationRoute=false] - If called from /devices/register route
 * @returns {Promise<object>}
 */
async function registerDevice(userId, { deviceId, deviceName }, isRegistrationRoute = false) {
  if (typeof deviceId !== "string" || !deviceId.trim()) {
    throw new AppError("deviceId is required", 400, "VALIDATION_ERROR");
  }

  const normalizedDeviceId = deviceId.trim().toUpperCase();
  const normalizedDeviceName =
    typeof deviceName === "string" && deviceName.trim()
      ? deviceName.trim()
      : "TrailGuard Wearable";

  const existingDevice = await Device.findOne({
    deviceId: normalizedDeviceId,
  });

  if (existingDevice) {
    // If device is already registered to this user
    if (
      existingDevice.userId &&
      userId &&
      existingDevice.userId.toString() === userId.toString()
    ) {
      if (isRegistrationRoute) {
        return {
          statusCode: 200,
          success: true,
          message: "Device is already registered to your account",
          device: {
            deviceId: existingDevice.deviceId,
            deviceName: existingDevice.deviceName,
            status: existingDevice.status,
          },
        };
      }
      throw new AppError("Device already connected", 409, "DEVICE_ALREADY_CONNECTED");
    }

    // If device is assigned to another user
    if (existingDevice.userId) {
      throw new AppError(
        isRegistrationRoute
          ? "Device is already registered to another user"
          : "Device is already registered",
        409,
        "DEVICE_ALREADY_REGISTERED",
      );
    }

    // Existing device has no owner:
    if (isRegistrationRoute) {
      // In deviceRegistrationRoutes.js: existing with no owner returns 409 "Device is not assigned to a user"
      throw new AppError("Device is not assigned to a user", 409, "DEVICE_UNASSIGNED");
    }

    // Reclaim unpaired physical device
    const device = await Device.findOneAndUpdate(
      {
        deviceId: normalizedDeviceId,
        userId: null,
      },
      {
        $set: {
          userId,
          status: "active",
          deviceName: normalizedDeviceName,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!device) {
      throw new AppError("Device could not be paired", 409, "PAIRING_FAILED");
    }

    return {
      statusCode: 200,
      success: true,
      device: {
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        status: device.status,
      },
    };
  }

  // Create new device record
  const device = await Device.create({
    deviceId: normalizedDeviceId,
    deviceName: normalizedDeviceName,
    userId,
    status: "active",
  });

  return {
    statusCode: 201,
    success: true,
    ...(isRegistrationRoute ? { message: "Device registered successfully" } : {}),
    device: {
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      status: device.status,
    },
  };
}

const pairedOrLegacyDeviceState = {
  $or: [{ state: "PAIRED" }, { state: { $exists: false } }],
};

/**
 * Update the friendly name of a user's device.
 *
 * @param {string} userId
 * @param {string} deviceId
 * @param {string} deviceName
 * @returns {Promise<object>}
 */
async function renameDevice(userId, deviceId, deviceName) {
  if (typeof deviceName !== "string") {
    throw new AppError("deviceName must be a string", 400, "VALIDATION_ERROR");
  }

  const trimmedName = deviceName.trim();
  if (!trimmedName) {
    throw new AppError("deviceName cannot be empty", 400, "VALIDATION_ERROR");
  }

  if (trimmedName.length > 50) {
    throw new AppError(
      "deviceName cannot exceed 50 characters",
      400,
      "VALIDATION_ERROR",
    );
  }

  const normalizedDeviceId = (deviceId || "").trim().toUpperCase();

  const device = await Device.findOneAndUpdate(
    {
      deviceId: normalizedDeviceId,
      userId,
      ...pairedOrLegacyDeviceState,
    },
    {
      $set: {
        deviceName: trimmedName,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).select("deviceId deviceName status lastSeen createdAt updatedAt");

  if (!device) {
    throw new AppError("Device not found", 404, "DEVICE_NOT_FOUND");
  }

  return {
    success: true,
    device,
  };
}

/**
 * Get a single device by ID for the owning user.
 *
 * @param {string} userId
 * @param {string} deviceId
 * @returns {Promise<object>}
 */
async function getDeviceById(userId, deviceId) {
  const normalizedDeviceId = (deviceId || "").trim().toUpperCase();

  const device = await Device.findOne({
    deviceId: normalizedDeviceId,
    userId,
  }).select("deviceId deviceName status lastSeen createdAt updatedAt");

  if (!device) {
    throw new AppError("Device not found", 404, "DEVICE_NOT_FOUND");
  }

  return device;
}

/**
 * Get all devices owned by an authenticated user.
 *
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function getUserDevices(userId) {
  return Device.find({ userId })
    .select("deviceId deviceName status lastSeen createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();
}

/**
 * Unpair a device from the authenticated user.
 *
 * @param {string} userId
 * @param {string} deviceId
 * @returns {Promise<object>}
 */
async function unpairDevice(userId, deviceId) {
  const normalizedDeviceId = (deviceId || "").trim().toUpperCase();

  const device = await Device.findOneAndUpdate(
    {
      deviceId: normalizedDeviceId,
      userId,
      ...pairedOrLegacyDeviceState,
    },
    {
      $set: {
        status: "inactive",
        state: "PROVISIONED",
        userId: null,
      },
    },
    {
      new: true,
      runValidators: false,
    },
  ).select("deviceId deviceName status lastSeen");

  if (!device) {
    throw new AppError("Device not found", 404, "DEVICE_NOT_FOUND");
  }

  return {
    success: true,
    message: "Device unpaired",
    device,
  };
}

/**
 * Update the status of a user's device (active / inactive).
 *
 * @param {string} userId
 * @param {string} deviceId
 * @param {string} status
 * @returns {Promise<object>}
 */
async function updateDeviceStatus(userId, deviceId, status) {
  if (!["active", "inactive"].includes(status)) {
    throw new AppError(
      "status must be active or inactive",
      400,
      "VALIDATION_ERROR",
    );
  }

  const normalizedDeviceId = (deviceId || "").trim().toUpperCase();

  const device = await Device.findOneAndUpdate(
    {
      deviceId: normalizedDeviceId,
      userId,
      ...pairedOrLegacyDeviceState,
    },
    {
      $set: {
        status,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).select("deviceId deviceName status lastSeen createdAt updatedAt");

  if (!device) {
    throw new AppError("Device not found", 404, "DEVICE_NOT_FOUND");
  }

  return {
    success: true,
    device,
  };
}

/**
 * Get all devices across the platform (Admin only).
 *
 * @returns {Promise<Array>}
 */
async function getAllDevicesAdmin() {
  return Device.find({})
    .select("deviceId deviceName status userId lastSeen createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();
}

module.exports = {
  registerDevice,
  renameDevice,
  getDeviceById,
  getUserDevices,
  unpairDevice,
  updateDeviceStatus,
  getAllDevicesAdmin,
};
