const vitalsService = require("../services/vitalsService");
const asyncHandler = require("../utils/asyncHandler");

const getLatest = asyncHandler(async (req, res) => {
  const result = await vitalsService.getLatest(req.userId, req.query.deviceId);
  res.json(result);
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await vitalsService.getHistory(
    req.userId,
    req.query.deviceId,
    req.query.hours ?? 1,
  );
  res.json(result);
});

const getStats = asyncHandler(async (req, res) => {
  const result = await vitalsService.getStats(
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
