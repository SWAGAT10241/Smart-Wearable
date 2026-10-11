const ROLE_PERMISSIONS = {
  citizen: [
    "profile:read",
    "profile:update",
    "device:connect",
    "device:read",
    "emergency:create",
    "emergency:read:own",
    "emergency:update:own",
    "emergency:session:create",
    "emergency:session:close",
  ],

  responder: [
    "emergency:read:assigned",
    "emergency:update:assigned",
    "incident:read:authorized",
    "response:update",
    "observation:create",
    "emergency:session:read",
    "emergency:session:close",
  ],

  coordinator: [
    "emergency:read:active",
    "emergency:assign",
    "incident:read:authorized",
    "response:read",
    "response:update",
    "emergency:session:assign",
    "emergency:session:read",
    "emergency:session:close",
  ],

  admin: [
    "user:manage",
    "role:manage",
    "device:manage",
    "emergency:manage",
    "incident:manage",
    "system:manage",
    "emergency:session:assign",
    "emergency:session:read",
    "emergency:session:close",
    "emergency:session:audit",
  ],
};

function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

module.exports = {
  ROLE_PERMISSIONS,
  hasPermission,
};