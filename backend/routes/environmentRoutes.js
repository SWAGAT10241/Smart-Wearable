const express = require("express");
const protect = require("../middleware/authMiddleware");
const { queryLimiter } = require("../middleware/rateLimiter");
const environmentController = require("../controllers/environmentController");

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
