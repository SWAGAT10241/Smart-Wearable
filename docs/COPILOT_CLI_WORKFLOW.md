# Copilot CLI Workflow

This repository includes project customizations for recurring CI, security, and pull request work.

## Recommended flow

1. Start with the objective, scope, acceptance criteria, and the relevant run or alert ID.
2. Use `/ci-failure-debugging` for workflow failures and `/security-alert-triage` for code-scanning or security findings.
3. Invoke `ci-failure-fixer`, `security-triage`, or `pr-preflight` when you need the corresponding isolated workflow.
4. Before creating a PR, run:

   ```text
   /review Focus on security regressions, missing tests, and CI correctness. Review only the current diff.
   ```

5. Ask for exact validation commands and outcomes in the final response.

## Prompt template

```text
Task: <one-sentence objective>
Scope: <files, workflow, alert, or run ID>
Acceptance criteria:
- <observable behavior>
- <targeted validation command passes>
- no unrelated files changed
Constraints: preserve repository security invariants and existing conventions.
```

While the agent is working, send a steering message to correct its direction. Use Ctrl+Enter or Ctrl+Q when a message should run as the next task instead of changing the current one.
