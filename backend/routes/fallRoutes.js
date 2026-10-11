const express = require("express");
const protect = require("../middleware/authMiddleware");
const fallController = require("../controllers/fallController");

module.exports = function (broadcast) {
  const router = express.Router();
  router.use(protect);

  // GET /api/falls
  router.get("/", fallController.getUserFalls);

  // GET /api/falls/latest
  router.get("/latest", fallController.getLatest);

  // PATCH /api/falls/:id
  router.patch("/:id", fallController.updateStatus(broadcast));

  return router;
};