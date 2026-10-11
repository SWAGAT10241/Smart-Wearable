const locationService = require("../services/locationService");
const asyncHandler = require("../utils/asyncHandler");

const getLatest = asyncHandler(async (req, res) => {
  const result = await locationService.getLatestLocation(
    req.userId,
    req.query.deviceId,
  );
  res.json(result);
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await locationService.getLocationHistory(
    req.userId,
    req.query.deviceId,
    req.query.hours,
  );
  res.json(result);
});

module.exports = {
  getLatest,
  getHistory,
};
