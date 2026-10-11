const express = require("express");
const passport = require("passport");
const protect = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const authorizeRole = require("../middleware/authorizeRole");
const webSocketTicketLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/register — local signup
router.post("/register", authController.register);

// POST /api/auth/login — local login
router.post("/login", authController.login);

// GET /api/auth/google — start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// GET /api/auth/google/callback — Google redirects here
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  authController.handleGoogleCallback,
);

// PATCH /api/auth/complete-profile
router.patch("/complete-profile", protect, authController.completeProfile);

// GET /api/auth/me
router.get("/me", protect, authController.getMe);
router.post(
  "/ws-ticket",
  webSocketTicketLimiter,
  protect,
  authorizeRole("citizen", "responder", "coordinator", "admin"),
  authController.createWebSocketTicket,
);

module.exports = router;