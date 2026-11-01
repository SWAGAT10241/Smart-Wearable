const fallService = require("../services/fallService");
const asyncHandler = require("../utils/asyncHandler");

const getUserFalls = asyncHandler(async (req, res) => {
  const result = await fallService.getUserFalls(req.userId);
  res.json(result);
});

const getLatest = asyncHandler(async (req, res) => {
  const result = await fallService.getLatestFall(req.userId);
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
  getUserFalls,
  getLatest,
  updateStatus,
};
