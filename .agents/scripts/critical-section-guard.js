#!/usr/bin/env node
/**
 * TrailGuard / SWAAS — Comprehensive AI Agent Guardrail & Audit System
 * Lifecycle hook executing before tool actions (PreToolUse).
 * Enforces zero-tolerance safety policies, logs all blocked events,
 * and programmatically blocks Git mutation commands, database deletions,
 * unauthorized network calls, package installations, and filesystem escapes.
 */
const fs = require("fs");
const path = require("path");

function readStdin() {
  try {
    return fs.readFileSync(0, "utf-8");
  } catch {
    return "";
  }
}

const inputRaw = readStdin();
let payload = {};
try {
  payload = JSON.parse(inputRaw);
} catch {
  console.log(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

const toolName = payload.toolCall?.name || "";
const args = payload.toolCall?.args || {};
const workspaceRoot = (payload.workspacePaths && payload.workspacePaths[0]) || path.resolve(__dirname, "../..");

// Dedicated Audit Log for blocked actions
const logDir = path.resolve(__dirname, "../logs");
const auditLogPath = path.join(logDir, "guardrail-audit.log");

function logBlockEvent(type, target, reason) {
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [BLOCKED] Type: ${type} | Target: "${target}" | Reason: ${reason}\n`;
    fs.appendFileSync(auditLogPath, logLine, "utf-8");
  } catch (err) {
    // Fail silently on log write to prevent hook deadlock
  }
}

function deny(reason, target = "") {
  logBlockEvent(toolName, target, reason);
  console.log(
    JSON.stringify({
      decision: "deny",
      reason: `[Guardrail Blocked] ${reason}`
    })
  );
  process.exit(0);
}

// 1. Protected files (secrets, crypto keys, immutable audit schemas)
const PROTECTED_FILE_PATTERNS = [
  /\.env(\.production|\.local|\.staging|\.test)?$/i,
  /\.(pem|key|pfx|pkcs12|keystore|crt)$/i,
  /id_rsa/i,
  /credentials\.json$/i,
  /service-account.*\.json$/i,
  /backend\/models\/AuditLog\.js$/i,
  /backend\/middleware\/deviceAuthMiddleware\.js$/i,
];

// 2. Blocked shell command rules
const BLOCKED_COMMAND_RULES = [
  {
    regex: /\bgit\s+(commit|push|add|reset|clean|checkout|switch|merge|rebase|branch|tag|remote|rm|mv)\b|\bgh\s+(repo|issue|pr|release)\b/,
    reason: "Git mutation commands (commit, push, add, reset, branch, etc.) are strictly human-operated. AI agents are not permitted to commit or push code."
  },
  {
    regex: /\b(rm|rmdir|unlink)\b/,
    reason: "File and directory deletion is strictly prohibited. AI agents cannot delete files."
  },
  {
    regex: /\b(dropDatabase|dropCollection|db\.drop|deleteMany|deleteOne|remove\s*\(|drop\s*\(|TRUNCATE|DROP\s+TABLE|DELETE\s+FROM)\b/i,
    reason: "Database deletion or dropping operations are strictly blocked. Direct database mutations are not allowed."
  },
  {
    regex: /\b(chmod|chown)\s+-[rRf]/,
    reason: "Recursive permission and ownership changes are blocked."
  },
  {
    regex: /\b(npm\s+i(nstall)?|pnpm\s+(add|i(nstall)?)|yarn\s+add|pip3?\s+install|cargo\s+add|gem\s+install|brew\s+install)\b/,
    reason: "Package installations require explicit user approval. List packages and ask the user first."
  },
  {
    regex: /\bhardhat\b/,
    reason: "Hardhat commands require explicit user consent and plan approval."
  },
  {
    regex: /\b(curl|wget|nc|netcat|nmap|telnet|ssh|scp|sftp|ftp)\b/,
    reason: "Outbound network requests from shell are blocked to prevent external communication without approval."
  },
  {
    regex: /\b(docker|docker-compose|podman)\b/,
    reason: "Docker and container commands are blocked. Direct container management is human-only."
  },
  {
    regex: /\|\s*(sh|bash|zsh)/,
    reason: "Piping remote data into a shell is strictly prohibited."
  }
];

if (toolName === "write_file" || toolName === "edit_file") {
  const targetPath = args.Path || args.path || "";
  
  // Confine to workspace boundary
  if (targetPath) {
    const resolvedPath = path.resolve(targetPath);
    const resolvedRoot = path.resolve(workspaceRoot);
    if (!resolvedPath.startsWith(resolvedRoot) && !resolvedPath.includes(".gemini/antigravity")) {
      deny(`Write access outside workspace boundary is blocked: ${targetPath}. Actions are confined strictly to the project folder.`, targetPath);
    }
  }

  // Check protected file paths
  for (const pattern of PROTECTED_FILE_PATTERNS) {
    if (pattern.test(targetPath)) {
      deny(`Access blocked for protected file: ${targetPath}. Environment secrets, crypto keys, and audit schemas require explicit human maintenance.`, targetPath);
    }
  }
} else if (toolName === "run_command") {
  const cmd = args.CommandLine || args.commandLine || "";
  for (const rule of BLOCKED_COMMAND_RULES) {
    if (rule.regex.test(cmd)) {
      deny(rule.reason, cmd);
    }
  }
}

// Allow verified safe commands
console.log(JSON.stringify({ decision: "allow" }));
process.exit(0);
