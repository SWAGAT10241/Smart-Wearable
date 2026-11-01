const ROLE_PERMISSIONS = {
  citizen: [
    "profile:read",
    "profile:update",
    "device:connect",
    "device:read",
    "emergency:create",
    "emergency:read:own",
    "emergency:update:own",
    "ws:ticket",
  ],

  responder: [
    "emergency:read:assigned",
    "emergency:read:active",
    "emergency:update:assigned",
    "emergency:join",
    "incident:read:authorized",
    "response:update",
    "observation:create",
    "ws:ticket",
    "ws:feed",
  ],

  coordinator: [
    "emergency:read:active",
    "emergency:assign",
    "emergency:update:any",
    "emergency:audit:read",
    "incident:read:authorized",
    "response:read",
    "response:update",
    "ws:ticket",
    "ws:feed",
  ],

  admin: [
    "user:manage",
    "role:manage",
    "device:manage",
    "emergency:create",
    "emergency:manage",
    "emergency:read:active",
    "emergency:assign",
    "emergency:update:any",
    "emergency:audit:read",
    "incident:manage",
    "system:manage",
    "ws:ticket",
    "ws:feed",
  ],
};

function hasPermission(role, permission) {
  if (role === "admin") return true;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

module.exports = {
  ROLE_PERMISSIONS,
  hasPermission,
};