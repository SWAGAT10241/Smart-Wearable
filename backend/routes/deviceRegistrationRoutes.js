const express = require("express");
const protect = require("../middleware/authMiddleware");
const { deviceLimiter } = require("../middleware/rateLimiter");
const deviceController = require("../controllers/deviceController");

module.exports = function () {
  const router = express.Router();

  /**
   * POST /api/devices/register
   * One-time device activation/registration endpoint.
   */
  router.post("/register", deviceLimiter, protect, deviceController.registerDevice(true));

  return router;
};
