const locationService = require("../services/locationService");
const asyncHandler = require("../utils/asyncHandler");

const getLatest = asyncHandler(async (req, res) => {
  const result = await locationService.getLatest(req.userId);
  res.json(result);
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await locationService.getHistory(
    req.userId,
    req.query.hours ?? 24,
  );
  res.json(result);
});

module.exports = {
  getLatest,
  getHistory,
};
