const express = require("express");
const protect = require("../middleware/authMiddleware");
const deviceController = require("../controllers/deviceController");

module.exports = function () {
  const router = express.Router();

  /**
   * POST /api/devices/register
   * One-time device activation/registration endpoint.
   */
  router.post("/register", protect, deviceController.registerDevice(true));

  return router;
};
