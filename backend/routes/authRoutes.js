const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

// POST /api/auth/register — local signup
router.post("/register", async (req, res) => {
  try {
    const {
      username,password,email,phoneNumber,
      emergencyContactName,emergencyContactPhone,height,weight,
    } = req.body;
    if (
      !username ||!password ||!email ||!phoneNumber ||
      !emergencyContactName ||!emergencyContactPhone ||!height ||!weight
    ) {
      return res.status(400).json({
        error: "All fields are required, including emergency contact details",
      });
    }
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    const user = await User.create({
      username,password,email,phoneNumber,
      emergencyContactName,emergencyContactPhone,height,
      weight,authProvider: "local",profileComplete: true,
    });

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    console.error("Register error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// POST /api/auth/login — local login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

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
      const token = signToken(req.user._id);
      const destination = req.user.profileComplete
        ? "/dashboard"
        : "/complete-profile";

      res.redirect(
        `${process.env.CLIENT_URL}/oauth-success?token=${encodeURIComponent(
          token,
        )}&redirect=${encodeURIComponent(destination)}`,
      );
    } catch (err) {
      console.error("Google OAuth callback error:", err);
      res.redirect(
        `${process.env.CLIENT_URL}/login?error=oauth_failed`,
      );
    }
  },
);

// PATCH /api/auth/complete-profile
router.patch("/complete-profile", protect, async (req, res) => {
  try {
    const {
      phoneNumber,emergencyContactName,
      emergencyContactPhone,height,weight,
    } = req.body;

    if (
      !phoneNumber ||!emergencyContactName ||
      !emergencyContactPhone ||!height ||!weight
    ) {
      return res.status(400).json({
        error:
          "All fields are required, including emergency contact details",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        phoneNumber,emergencyContactName,
        emergencyContactPhone,height,
        weight,profileComplete: true,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      message: "Profile completed successfully",
      user: {
        id: user._id,username: user.username,email: user.email,
        phoneNumber: user.phoneNumber,
        emergencyContactName: user.emergencyContactName,
        emergencyContactPhone: user.emergencyContactPhone,
        height: user.height,weight: user.weight,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    console.error("Complete profile error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    res.json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});
module.exports = router;