const ROLE_PERMISSIONS = {
  citizen: [
    "profile:read",
    "profile:update",
    "device:connect",
    "device:read",
    "emergency:create",
    "emergency:read:own",
    "emergency:update:own",
  ],

  responder: [
    "emergency:read:assigned",
    "emergency:update:assigned",
    "incident:read:authorized",
    "response:update",
    "observation:create",
  ],

  coordinator: [
    "emergency:read:active",
    "emergency:assign",
    "incident:read:authorized",
    "response:read",
    "response:update",
  ],

  admin: [
    "user:manage",
    "role:manage",
    "device:manage",
    "emergency:manage",
    "incident:manage",
    "system:manage",
  ],
};

function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

module.exports = {
  ROLE_PERMISSIONS,
  hasPermission,
};