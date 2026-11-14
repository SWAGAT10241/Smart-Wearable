const environmentService = require("../services/environmentService");
const asyncHandler = require("../utils/asyncHandler");

const getLatest = asyncHandler(async (req, res) => {
  const result = await environmentService.getLatestEnvironment(
    req.userId,
    req.query.deviceId,
  );
  res.json(result);
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await environmentService.getEnvironmentHistory(
    req.userId,
    req.query.deviceId,
    req.query.hours,
  );
  res.json(result);
});

const getStats = asyncHandler(async (req, res) => {
  const result = await environmentService.getEnvironmentStats(
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
