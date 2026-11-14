const vitalsService = require("../services/vitalsService");
const asyncHandler = require("../utils/asyncHandler");

const getLatest = asyncHandler(async (req, res) => {
  const result = await vitalsService.getLatestVitals(req.userId, req.query.deviceId);
  res.json(result);
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await vitalsService.getVitalsHistory(
    req.userId,
    req.query.deviceId,
    req.query.hours,
  );
  res.json(result);
});

const getStats = asyncHandler(async (req, res) => {
  const result = await vitalsService.getVitalsStats(
    req.userId,
    req.query.deviceId,
    req.query.hours,
  );
  res.json(result);
});

module.exports = {
  getLatest,
  getHistory,
  getStats,
};
