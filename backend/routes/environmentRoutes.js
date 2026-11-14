const express = require("express");
const environmentController = require("../controllers/environmentController");
const protect = require("../middleware/authMiddleware");
const { queryLimiter } = require("../middleware/rateLimiter");

module.exports = function () {
  const router = express.Router();
  router.use(queryLimiter);
  router.use(protect);

  // GET /api/environment/latest
  router.get("/latest", environmentController.getLatest);

  // GET /api/environment/history
  router.get("/history", environmentController.getHistory);

  // GET /api/environment/stats
  router.get("/stats", environmentController.getStats);

  return router;
};
