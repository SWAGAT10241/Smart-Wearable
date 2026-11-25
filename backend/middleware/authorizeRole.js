const User = require("../models/User");
const { hasPermission } = require("../config/permissions");

// Middleware to restrict access based on user roles
function authorizeRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      const user = await User.findById(req.userId).select("role");

      if (!user) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      req.user = user;

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          error: "Access forbidden: insufficient permissions",
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);

      return res.status(500).json({
        error: "Authorization failed",
      });
    }
  };
}

// Middleware to restrict access based on permissions
function authorizePermission(permission) {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      const user = await User.findById(req.userId).select("role");

      if (!user) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      req.user = user;

      if (!hasPermission(user.role, permission)) {
        return res.status(403).json({
          error: "Access forbidden: insufficient permissions",
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);

      return res.status(500).json({
        error: "Authorization failed",
      });
    }
  };
}

module.exports = authorizeRole;
module.exports.authorizePermission = authorizePermission;