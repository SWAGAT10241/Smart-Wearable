const express = require("express");
const locationController = require("../controllers/locationController");
const protect = require("../middleware/authMiddleware");
const { queryLimiter } = require("../middleware/rateLimiter");

module.exports = function () {
  const router = express.Router();
  router.use(queryLimiter);
  router.use(protect);

  // GET /api/location/latest
  router.get("/latest", locationController.getLatest);

  // GET /api/location/history
  router.get("/history", locationController.getHistory);

  return router;
};