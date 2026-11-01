const environmentService = require("../services/environmentService");
const asyncHandler = require("../utils/asyncHandler");

const getLatest = asyncHandler(async (req, res) => {
  const result = await environmentService.getLatest(req.userId, req.query.deviceId);
  res.json(result);
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await environmentService.getHistory(
    req.userId,
    req.query.deviceId,
    req.query.hours ?? 1,
  );
  res.json(result);
});

const getStats = asyncHandler(async (req, res) => {
  const result = await environmentService.getStats(
    req.userId,
    req.query.deviceId,
    req.query.hours ?? 1,
  );
  res.json(result);
});

module.exports = {
  getLatest,
  getHistory,
  getStats,
};
