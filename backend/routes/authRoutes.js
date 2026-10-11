const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const authService = require("../services/authService");
const protect = require("../middleware/authMiddleware");
const config = require("../config/env");

const router = express.Router();

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
  (req, res) => {
    try {
      const token = authService.signToken(req.user._id);
      const destination = req.user.profileComplete
        ? "/dashboard"
        : "/complete-profile";

      const clientUrl = config.clientUrls[0] || "http://localhost:5173";
      res.redirect(
        `${clientUrl}/oauth-success?token=${encodeURIComponent(
          token,
        )}&redirect=${encodeURIComponent(destination)}`,
      );
    } catch (err) {
      console.error("Google OAuth callback error:", err);
      const clientUrl = config.clientUrls[0] || "http://localhost:5173";
      res.redirect(`${clientUrl}/login?error=oauth_failed`);
    }
  },
);

// PATCH /api/auth/complete-profile
router.patch("/complete-profile", protect, authController.completeProfile);

// GET /api/auth/me
router.get("/me", protect, authController.getMe);

module.exports = router;