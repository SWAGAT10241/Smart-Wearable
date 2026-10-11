const express = require("express");
const authRoutes = require("./authRoutes");
const deviceRoutes = require("./deviceRoutes");
const deviceRegistrationRoutes = require("./deviceRegistrationRoutes");
const deviceManagementRoutes = require("./deviceManagementRoutes");
const vitalsRoutes = require("./vitalsRoutes");
const fallRoutes = require("./fallRoutes");
const environmentRoutes = require("./environmentRoutes");
const locationRoutes = require("./locationRoutes");
const emergencySessionRoutes = require("./emergencySessionRoutes");

/**
 * Configure and return the unified API routes.
 *
 * @param {Function} broadcast - WebSocket broadcaster function
 * @returns {express.Router}
 */
function createApiRouter(broadcast) {
  const router = express.Router();

  // Authentication
  router.use("/auth", authRoutes);

  // Device registration (POST /api/devices/register)
  router.use("/devices", deviceRegistrationRoutes());

  // Physical Device ingestion and single device endpoints (/api/device/*)
  router.use("/device", deviceRoutes(broadcast));

  // User Device management (/api/devices, /api/devices/:deviceId, /api/devices/admin/all)
  router.use("/devices", deviceManagementRoutes());

  // Dashboard Telemetry endpoints
  router.use("/vitals", vitalsRoutes());
  router.use("/falls", fallRoutes(broadcast));
  router.use("/environment", environmentRoutes());
  router.use("/location", locationRoutes());
  router.use("/emergency", emergencySessionRoutes);

  return router;
}

module.exports = {
  createApiRouter,
};
