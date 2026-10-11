const express = require("express");
const vitalsController = require("../controllers/vitalsController");
const protect = require("../middleware/authMiddleware");

module.exports = function () {
  const router = express.Router();
  router.use(protect);

  // GET /api/vitals/latest
  router.get("/latest", vitalsController.getLatest);

  // GET /api/vitals/history
  router.get("/history", vitalsController.getHistory);

  // GET /api/vitals/stats
  router.get("/stats", vitalsController.getStats);

  return router;
};
