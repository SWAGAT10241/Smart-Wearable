const express = require("express");
const passport = require("passport");
const protect = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");
const authController = require("../controllers/authController");

const router = express.Router();

// POST /api/auth/register — local signup
router.post("/register", authLimiter, authController.register);

// POST /api/auth/login — local login
router.post("/login", authLimiter, authController.login);

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

module.exports = router;