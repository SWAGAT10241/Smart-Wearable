const deviceService = require("../services/deviceService");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Register or pair a physical device.
 */
const registerDevice = (isRegistrationRoute = false) =>
  asyncHandler(async (req, res) => {
    const result = await deviceService.registerDevice(
      req.userId,
      req.body,
      isRegistrationRoute,
    );
    res.status(result.statusCode || 201).json(result);
  });

/**
 * Rename a device.
 */
const renameDevice = asyncHandler(async (req, res) => {
  const result = await deviceService.renameDevice(
    req.userId,
    req.params.deviceId,
    req.body.deviceName,
  );
  res.json(result);
});

/**
 * Get device by ID.
 */
const getDevice = asyncHandler(async (req, res) => {
  const device = await deviceService.getDeviceById(req.userId, req.params.deviceId);
  res.json({ device });
});

/**
 * Get all devices owned by user.
 */
const getUserDevices = asyncHandler(async (req, res) => {
  const devices = await deviceService.getUserDevices(req.userId);
  res.json({ devices });
});

/**
 * Unpair device from account.
 */
const unpairDevice = asyncHandler(async (req, res) => {
  const result = await deviceService.unpairDevice(req.userId, req.params.deviceId);
  res.json(result);
});

/**
 * Update device active/inactive status.
 */
const updateStatus = asyncHandler(async (req, res) => {
  const result = await deviceService.updateDeviceStatus(
    req.userId,
    req.params.deviceId,
    req.body.status,
  );
  res.json(result);
});

module.exports = {
  registerDevice,
  renameDevice,
  getDevice,
  getUserDevices,
  unpairDevice,
  updateStatus,
};
