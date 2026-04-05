# mdtopdf — Claude Code Instructions

Full project conventions are in [`.claudecode.md`](.claudecode.md). Key rules to follow at all times:

## Commit Messages — Conventional Commits (enforced)

Every commit MUST use the format `<type>(<scope>): <subject>`.  
Allowed types: `feat fix docs style refactor perf test build ci chore revert`.  
- subject: lowercase, no trailing period, ≤ 100 chars total in header  
- husky + commitlint will reject non-conforming commits

## Conversion Logging (auto, non-negotiable)

After EVERY call to `convertMdToPdf()`, a log line MUST be appended to `logs/conversions.log`.  
- Format: `[ISO timestamp] SUCCESS|FAILURE input="..." output="..." [error="..."]`  
- This is handled in `src/index.js`. When editing conversion logic, never remove or bypass the `writeLog()` calls.  
- `logs/` is gitignored — do not commit log files.

## Project Structure

```
src/
  index.js   — core convertMdToPdf() + writeLog()
  cli.js     — CLI entry point
logs/        — auto-created at runtime, gitignored
.github/
  workflows/
    ci.yml   — commitlint on PRs, build check on push
commitlint.config.js
.claudecode.md  — full spec
CLAUDE.md       — this file
```

## Branch & PR Rules

- `main` is protected — never push directly  
- Feature branches: `feat/<description>`, fix branches: `fix/<description>`  
- PR titles must follow Conventional Commits format
