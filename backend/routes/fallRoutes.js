const express = require("express");
const fallController = require("../controllers/fallController");
const protect = require("../middleware/authMiddleware");
const { queryLimiter } = require("../middleware/rateLimiter");

module.exports = function (broadcast) {
  const router = express.Router();
  router.use(queryLimiter);
  router.use(protect);

  // GET /api/falls
  router.get("/", fallController.getFalls);

  // GET /api/falls/latest
  router.get("/latest", fallController.getLatest);

  // PATCH /api/falls/:id
  router.patch("/:id", fallController.updateStatus(broadcast));

  return router;
};