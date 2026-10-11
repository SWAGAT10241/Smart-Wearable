const express = require("express");
const protect = require("../middleware/authMiddleware");
const environmentController = require("../controllers/environmentController");

module.exports = function () {
  const router = express.Router();
  router.use(protect);

  // GET /api/environment/latest
  router.get("/latest", environmentController.getLatest);

  // GET /api/environment/history
  router.get("/history", environmentController.getHistory);

  // GET /api/environment/stats
  router.get("/stats", environmentController.getStats);

  return router;
};
