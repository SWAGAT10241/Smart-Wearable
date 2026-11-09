const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { cleanEmail } = require("../utils/sanitizeEmail");

/**
 * Sign a JWT token for a given user ID.
 *
 * @param {string|object} userId
 * @returns {string} Signed JWT
 */
function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

/**
 * Register a new local user.
 *
 * @param {object} userData
 * @returns {Promise<{token: string, user: object}>}
 */
async function registerUser(userData) {
  const {
    username,
    password,
    email,
    phoneNumber,
    emergencyContactName,
    emergencyContactPhone,
    height,
    weight,
  } = userData;

  if (
    !username ||
    !password ||
    !email ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof email !== "string" ||
    !phoneNumber ||
    !emergencyContactName ||
    !emergencyContactPhone ||
    !height ||
    !weight
  ) {
    throw new AppError(
      "All fields are required, including emergency contact details",
      400,
      "VALIDATION_ERROR",
    );
  }

  const sanitizedEmail = cleanEmail(email);
  const existing = await User.findOne({ email: sanitizedEmail });
  if (existing) {
    throw new AppError("Email already registered", 409, "DUPLICATE_EMAIL");
  }

  const user = await User.create({
    username: String(username).trim(),
    password,
    email: sanitizedEmail,
    phoneNumber,
    emergencyContactName,
    emergencyContactPhone,
    height,
    weight,
    authProvider: "local",
    profileComplete: true,
  });

  const token = signToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      profileComplete: user.profileComplete,
    },
  };
}

/**
 * Authenticate an existing user with email and password.
 *
 * @param {object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{token: string, user: object}>}
 */
async function loginUser({ email, password }) {
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim()
  ) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const sanitizedEmail = cleanEmail(email);
  const user = await User.findOne({ email: sanitizedEmail }).select("+password");
  if (!user || !user.password) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const match = await user.comparePassword(password);
  if (!match) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const token = signToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      profileComplete: user.profileComplete,
    },
  };
}

/**
 * Complete missing profile fields for an authenticated user.
 *
 * @param {string} userId
 * @param {object} updateData
 * @returns {Promise<object>}
 */
async function completeUserProfile(userId, updateData) {
  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new AppError("Invalid user ID provided", 400, "INVALID_ID");
  }

  const {
    phoneNumber,
    emergencyContactName,
    emergencyContactPhone,
    height,
    weight,
  } = updateData || {};

  if (
    !phoneNumber ||
    !emergencyContactName ||
    !emergencyContactPhone ||
    !height ||
    !weight
  ) {
    throw new AppError(
      "All fields are required, including emergency contact details",
      400,
      "VALIDATION_ERROR",
    );
  }

  const safeUserId = String(userId);
  const user = await User.findByIdAndUpdate(
    safeUserId,
    {
      phoneNumber: String(phoneNumber).trim(),
      emergencyContactName: String(emergencyContactName).trim(),
      emergencyContactPhone: String(emergencyContactPhone).trim(),
      height: Number(height),
      weight: Number(weight),
      profileComplete: true,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return {
    message: "Profile completed successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      height: user.height,
      weight: user.weight,
      profileComplete: user.profileComplete,
    },
  };
}

/**
 * Retrieve user profile by user ID.
 *
 * @param {string} userId
 * @returns {Promise<object>}
 */
async function getUserProfile(userId) {
  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new AppError("Invalid user ID provided", 400, "INVALID_ID");
  }
  const user = await User.findById(String(userId));
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  return user;
}

module.exports = {
  signToken,
  registerUser,
  loginUser,
  completeUserProfile,
  getUserProfile,
};
