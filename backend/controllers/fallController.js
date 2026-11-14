const fallService = require("../services/fallService");
const asyncHandler = require("../utils/asyncHandler");

const getFalls = asyncHandler(async (req, res) => {
  const result = await fallService.getFalls(req.userId, req.query.deviceId);
  res.json(result);
});

const getLatest = asyncHandler(async (req, res) => {
  const result = await fallService.getLatestFall(req.userId, req.query.deviceId);
  res.json(result);
});

const updateStatus = (broadcast) =>
  asyncHandler(async (req, res) => {
    const result = await fallService.updateFallStatus(
      req.userId,
      req.params.id,
      req.body.status,
      broadcast,
    );
    res.json(result);
  });

module.exports = {
  getFalls,
  getLatest,
  updateStatus,
};
