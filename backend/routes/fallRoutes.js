const express = require("express");
const FallEvent = require("../models/FallEvent");
const protect = require("../middleware/authMiddleware");

module.exports = function (broadcast) {
  const router = express.Router();
  router.use(protect);
  // GET /api/falls
  // Returns fall events belonging to the logged-in user.
  router.get("/", async (req, res) => {
    try {
      const events = await FallEvent.find({
        userId: req.userId,
      }).sort({
        timestamp: -1,
      });
      res.json(events);
    } catch (err) {
      console.error("GET /falls error:", err);
      res.status(500).json({
        error: "Failed to fetch fall events",
      });
    }
  });
  // GET /api/falls/latest
  router.get("/latest", async (req, res) => {
    try {
      const event = await FallEvent.findOne({
        userId: req.userId,
      }).sort({
        timestamp: -1,
      });
      res.json(event || {});
    } catch (err) {
      console.error("GET /falls/latest error:", err);
      res.status(500).json({
        error: "Failed to fetch latest fall event",
      });
    }
  });
  // PATCH /api/falls/:id
  // User can only update their own fall event.
  router.patch("/:id", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          error: "status is required",
        });
      }
      const event = await FallEvent.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.userId,
        },
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!event) {
        return res.status(404).json({
          error: "Fall event not found",
        });
      }
      broadcast({
        type: "fall_status_update",
        data: event,
      });
      res.json(event);
    } catch (err) {
      console.error("PATCH /falls/:id error:", err);
      res.status(500).json({
        error: "Failed to update fall event",
      });
    }
  });
  return router;
};