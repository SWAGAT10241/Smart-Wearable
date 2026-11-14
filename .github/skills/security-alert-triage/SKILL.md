---
name: security-alert-triage
description: "Investigate and fix CodeQL, code-scanning, dependency, authentication, authorization, cryptography, privacy, and sensitive-logging findings."
argument-hint: "Provide the alert number, finding, file, or security concern."
user-invocable: true
---
# Security Alert Triage

Use this skill for security alerts and security-sensitive changes.

## Procedure
1. Retrieve the alert details and inspect the complete source-to-sink data flow.
2. Check the relevant invariant in `AGENTS.md`, `SECURITY.md`, and `SECURITY_AUDIT.md`.
3. Classify the finding with evidence; do not label it false positive based only on a guard in client code.
4. For a real issue, implement a minimal fail-closed fix and add focused regression coverage.
5. Run:
   `cd backend && ./node_modules/.bin/jest tests/securityHardening.test.js tests/deviceAuth.test.js`
6. Report severity, confidence, affected lines, fix rationale, validation results, and residual risk.

Never include secrets, tokens, signatures, GPS coordinates, or health data in logs or summaries.
