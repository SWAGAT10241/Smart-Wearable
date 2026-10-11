const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");
const webSocketTicketService = require("../services/webSocketTicketService");

/**
 * Handle user registration.
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json(result);
});

/**
 * Handle local login.
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.json(result);
});

/**
 * Handle Google OAuth callback redirect.
 */
const handleGoogleCallback = (req, res) => {
  try {
    const token = authService.signToken(req.user._id);
    const destination = req.user.profileComplete ? "/dashboard" : "/complete-profile";

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${encodeURIComponent(
        token,
      )}&redirect=${encodeURIComponent(destination)}`,
    );
  } catch (err) {
    logger.error("auth.google_callback_failed", { error: err });
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

/**
 * Complete user profile.
 */
const completeProfile = asyncHandler(async (req, res) => {
  const result = await authService.completeUserProfile(req.userId, req.body);
  res.json(result);
});

/**
 * Get current authenticated user profile.
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.userId);
  res.json({ user });
});

const createWebSocketTicket = asyncHandler(async (req, res) => {
  const ticket = await webSocketTicketService.issueTicket(req.userId);
  res.status(201).json({ ticket, expiresInSeconds: webSocketTicketService.TICKET_TTL_SECONDS });
});

module.exports = {
  register,
  login,
  handleGoogleCallback,
  completeProfile,
  getMe,
  createWebSocketTicket,
};
