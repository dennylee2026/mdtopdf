# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-04-06

### Changed
- Body font size increased from 16 px to 18 px
- Line-height tightened from 1.75 to 1.25

## [1.1.0] - 2026-04-05

### Added
- Mobile long-page mode: single page with auto-measured content height (no pagination)
- Puppeteer used directly for PDF rendering; `marked` for Markdown parsing
- `--mobile` flag added to CLI

### Changed
- `src/mobile.js` rewritten to drive puppeteer directly instead of relying on `md-to-pdf` page options
- `puppeteer` and `marked` added as explicit dependencies in `package.json`

## [1.0.0] - 2026-04-05

### Added
- Initial project setup: Node.js ESM CLI tool (`mdtopdf`)
- Standard Markdown-to-PDF conversion via `md-to-pdf` (`src/index.js`)
- Mobile-friendly PDF conversion with Google-color headings (`src/mobile.js`)
  - Page width: 390 px (iPhone viewport)
  - `h1` Google Blue `#4285F4`, `h2` Google Red `#EA4335`, `h3` Google Green `#34A853`, `h4` Google Yellow `#FBBC05`
  - Bold text: yellow translucent highlight
- Auto-logging of every conversion to `logs/conversions.log`
- CLI entry point `src/cli.js` with `--mobile` flag
- Conventional Commits enforced via husky commit-msg hook + commitlint
- GitHub Actions CI: commitlint on PRs, build check on push
- `main` branch protection requiring CI pass
- `CLAUDE.md` and `.claudecode.md` project conventions
- Global CLI registration via `npm link`

[Unreleased]: https://github.com/dennylee2026/mdtopdf/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/dennylee2026/mdtopdf/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/dennylee2026/mdtopdf/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/dennylee2026/mdtopdf/releases/tag/v1.0.0
