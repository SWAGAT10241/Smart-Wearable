---
name: ci-failure-debugging
description: "Debug and repair GitHub Actions failures, deployment jobs, dependency audits, and CI regressions. Use when a workflow run or job is failing."
argument-hint: "Provide the workflow run, job URL, or failing command."
user-invocable: true
---
# CI Failure Debugging

Use this skill for a failing GitHub Actions workflow or local CI reproduction.

## Procedure
1. Capture the workflow run, job, failing step, and first actionable error.
2. Inspect the workflow, package manifest, lockfile, and relevant scripts.
3. Separate infrastructure, dependency, configuration, and code failures.
4. Patch only the root cause; do not make checks less strict.
5. Run the narrowest relevant test or lint command, followed by the applicable verification gate from `AGENTS.md`.
6. Summarize the cause, changed files, exact commands and outcomes, and remaining risk.

## Repository gates
- Backend: `cd backend && ./node_modules/.bin/jest`
- Frontend: `cd frontend && ./node_modules/.bin/vitest run && ./node_modules/.bin/vite build`
- Mobile: `cd mobile && node scripts/check-syntax.js`
- Hardware Python: `python3 -m compileall -q hardware`
