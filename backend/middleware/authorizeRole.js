const { hasPermission } = require("../config/permissions");

// Middleware to restrict access based on user roles
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Access forbidden: insufficient permissions",
      });
    }

    next();
  };
}

// Middleware to restrict access based on permissions
function authorizePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        error: "Access forbidden: insufficient permissions",
      });
    }

    next();
  };
}

module.exports = authorizeRole;
module.exports.authorizePermission = authorizePermission;