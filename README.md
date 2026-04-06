# mdtopdf

Convert Markdown files to PDF — with a **mobile-optimized long-page mode** featuring Google-color headings.

## Features

- **Standard conversion** — clean PDF output from any `.md` file
- **Mobile mode** (`--mobile`) — single long page, 390 px wide, no pagination
  - Body: 18 px, line-height 1.25
  - `h1–h3`: Google Blue / Red / Green with left-border accent
  - `h4`: Google Yellow background badge
  - `**bold**`: translucent yellow highlight
  - Tables with blue header row, code blocks with grey background
- **Auto-logging** — every conversion (success or failure) appended to `logs/conversions.log`
- **Conventional Commits** enforced via husky + commitlint

## Requirements

- Node.js ≥ 18
- Chromium (bundled with puppeteer, downloaded on first `npm install`)

## Installation

```bash
git clone https://github.com/dennylee2026/mdtopdf.git
cd mdtopdf
npm install

# Register as a global CLI command
npm link
```

## Usage

```bash
# Standard conversion
mdtopdf input.md
mdtopdf input.md output.pdf

# Mobile-friendly long-page PDF
mdtopdf --mobile input.md
mdtopdf --mobile input.md output.pdf
```

Output defaults to `<input>.pdf` or `<input>.mobile.pdf` alongside the source file.

## Programmatic API

```js
import { convertMdToPdf } from './src/index.js';
import { convertMdToPdfMobile } from './src/mobile.js';

// Standard
const result = await convertMdToPdf('input.md', 'output.pdf');

// Mobile long-page
const result = await convertMdToPdfMobile('input.md', 'output.mobile.pdf');

// result: { success: boolean, output?: string, error?: string, log: string }
```

## Project Structure

```
src/
  index.js    — standard conversion
  mobile.js   — mobile long-page conversion (puppeteer + marked)
  cli.js      — CLI entry point
.github/
  workflows/
    ci.yml    — commitlint on PRs, build check on push
commitlint.config.js
CLAUDE.md     — Claude Code conventions
CHANGELOG.md  — version history
```

## Logging

All conversions are logged to `logs/conversions.log` (gitignored):

```
[2026-04-06T00:00:00.000Z] [mobile] SUCCESS input="/path/to/file.md" output="/path/to/file.mobile.pdf"
[2026-04-06T00:00:01.000Z] [mobile] FAILURE input="/path/to/file.md" error="file not found"
```

## Development

```bash
# Lint commit messages
npm run lint:commit

# Branches
# main   — protected, no direct push
# dev    — daily development base
# feat/* — feature branches
# fix/*  — bug fix branches
```

## License

MIT
