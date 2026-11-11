---
trigger: always_on
description: Comprehensive zero-tolerance guardrails, command blocks, and audit policies for all AI agents.
---

# Unified AI Agent Guardrails & Zero-Tolerance Policies

Regardless of execution mode (interactive or auto-mode), all agents (Antigravity, Cursor, Claude, Codex, Grok, and sub-agents) must strictly comply with these rules. Violations are automatically rejected by `.agents/scripts/critical-section-guard.js` and recorded in `.agents/logs/guardrail-audit.log`.

---

### 1. Mandatory Approval Gate (No Blind Execution)
- Never create, edit, or execute tasks without presenting a plan first and receiving explicit user confirmation ("Go" or "OK").
- Mode does not override consent: Auto mode still requires step-by-step user confirmation for critical milestones.

### 2. Zero Git Commands (Human-Operated Only)
- All `git` and `gh` operations (`add`, `commit`, `push`, `pull`, `reset`, `checkout`, `branch`) are strictly blocked.
- Version control is exclusively operated by the developer.

### 3. Outbound Network & External Communication Lock
- Shell commands cannot make outbound network requests (`curl`, `wget`, `nc`, `ssh`, etc.) without explicit permission.
- The project is air-gapped from external data streaming; no remote pipe-to-shell (`curl | bash`).

### 4. Package Installation & Hardhat Guard
- Never run package managers (`npm install`, `pnpm add`, `yarn add`, `pip install`, `brew install`) or `hardhat` commands without explicitly asking the user first.

### 5. Docker & Container Command Block
- Docker execution (`docker`, `docker-compose`, `podman`) is blocked from AI agents.

### 6. Database Protection (Zero Direct Deletions)
- Direct database deletion or dropping operations (`deleteMany`, `deleteOne`, `dropDatabase`, `dropCollection`, `TRUNCATE`, `DROP TABLE`) are blocked.

### 7. Zero File Deletion
- File deletion commands (`rm`, `rmdir`, `unlink`) are completely prohibited.

### 8. Strict Workspace Boundary
- Operations are strictly locked inside `/Users/swagatsouravdhar/WEB DEVELOPMENT/TrailGuard`.
- Agents must never read, write, or execute outside this directory.
