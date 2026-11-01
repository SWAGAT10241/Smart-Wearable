const telemetryService = require("../services/telemetryService");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Ingest telemetry readings from physical device / LoRa gateway.
 *
 * @param {Function} broadcast - Real-time WebSocket broadcast handler
 */
const ingestReadings = (broadcast) =>
  asyncHandler(async (req, res) => {
    const authenticatedDeviceId = req.deviceId;
    if (
      typeof req.body?.deviceId !== "string" ||
      req.body.deviceId.trim().toUpperCase() !== authenticatedDeviceId
    ) {
      return res.status(401).json({
        error: "Telemetry device identity does not match authenticated device",
      });
    }

    const result = await telemetryService.processReadings(
      req.body,
      broadcast,
      req.device,
    );
    res.status(201).json(result);
  });

module.exports = {
  ingestReadings,
};
