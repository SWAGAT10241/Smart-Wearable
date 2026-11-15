const telemetryService = require("../services/telemetryService");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Ingest telemetry readings from physical device / LoRa gateway.
 *
 * @param {Function} broadcast - Real-time WebSocket broadcast handler
 */
const ingestReadings = (broadcast) =>
  asyncHandler(async (req, res) => {
    const result = await telemetryService.processReadings(
      { ...req.body, deviceId: req.deviceId },
      broadcast,
      req.device,
    );
    res.status(201).json(result);
  });

module.exports = {
  ingestReadings,
};
