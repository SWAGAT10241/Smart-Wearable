const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/appError");
const config = require("../config/env");

/**
 * Generate a signed JWT for the given user ID.
 *
 * @param {string} userId - Mongo ID of the user
 * @returns {string} Signed JWT
 */
function signToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: "30d",
  });
}

/**
 * Register a new user with local credentials.
 *
 * @param {object} payload
 * @returns {Promise<{token: string, user: object}>}
 */
async function registerUser(payload) {
  const {
    username,
    password,
    email,
    phoneNumber,
    emergencyContactName,
    emergencyContactPhone,
    height,
    weight,
  } = payload;

  if (
    !username ||
    !password ||
    !email ||
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

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Email already registered", 409, "EMAIL_EXISTS");
  }

  const user = await User.create({
    username,
    password,
    email,
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
 * Authenticate user with email and password.
 *
 * @param {object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{token: string, user: object}>}
 */
async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");

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
 * Complete additional profile details for OAuth registered users.
 *
 * @param {string} userId - Authenticated user ID
 * @param {object} payload
 * @returns {Promise<{message: string, user: object}>}
 */
async function completeProfile(userId, payload) {
  const {
    phoneNumber,
    emergencyContactName,
    emergencyContactPhone,
    height,
    weight,
  } = payload;

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

  const user = await User.findByIdAndUpdate(
    userId,
    {
      phoneNumber,
      emergencyContactName,
      emergencyContactPhone,
      height,
      weight,
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
 * Retrieve the current authenticated user's profile.
 *
 * @param {string} userId
 * @returns {Promise<object>}
 */
async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  return user;
}

module.exports = {
  signToken,
  registerUser,
  loginUser,
  completeProfile,
  getCurrentUser,
};
