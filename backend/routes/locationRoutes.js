const express = require("express");
const protect = require("../middleware/authMiddleware");
const { queryLimiter } = require("../middleware/rateLimiter");
const locationController = require("../controllers/locationController");

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