const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Register user controller.
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json(result);
});

/**
 * Login user controller.
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.json(result);
});

/**
 * Complete profile controller.
 */
const completeProfile = asyncHandler(async (req, res) => {
  const result = await authService.completeProfile(req.userId, req.body);
  res.json(result);
});

/**
 * Get current profile controller.
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.userId);
  res.json({ user });
});

module.exports = {
  register,
  login,
  completeProfile,
  getMe,
};
