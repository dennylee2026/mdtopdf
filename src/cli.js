#!/usr/bin/env node
import { convertMdToPdfMobile } from './mobile.js';
import { convertMdToPdfDesktop } from './desktop.js';

const args = process.argv.slice(2);
const mobileFlag  = args.includes('--mobile');
const desktopFlag = args.includes('--desktop');
const positional  = args.filter(a => !a.startsWith('--'));
const [inputArg, outputArg] = positional;

if (!inputArg) {
  console.error('Usage: mdtopdf [--mobile] [--desktop] <input.md> [output.pdf]');
  console.error('  --mobile    Mobile long-page layout (390px, no pagination) — also outputs desktop');
  console.error('  --desktop   Desktop A4 layout only');
  console.error('  (default)   Same as --mobile');
  process.exit(1);
}

// --mobile (default) always produces both mobile + desktop
// --desktop alone produces only desktop
const runMobile  = mobileFlag || (!mobileFlag && !desktopFlag);
const runDesktop = mobileFlag || desktopFlag || (!mobileFlag && !desktopFlag);

// When running both, ignore custom outputArg (two outputs can't share one path)
const bothRunning = runMobile && runDesktop;
const jobs = [];
if (runMobile)  jobs.push({ fn: convertMdToPdfMobile,  label: 'mobile',  out: bothRunning ? undefined : outputArg });
if (runDesktop) jobs.push({ fn: convertMdToPdfDesktop, label: 'desktop', out: bothRunning ? undefined : outputArg });

const results = await Promise.all(
  jobs.map(({ fn, label, out }) => fn(inputArg, out).then(r => ({ ...r, label })))
);

let hasError = false;
for (const result of results) {
  if (result.success) {
    console.log(`✓ Converted [${result.label}]: ${result.output}`);
    console.log(`  Log: ${result.log}`);
  } else {
    console.error(`✗ Failed [${result.label}]: ${result.error}`);
    console.error(`  Log: ${result.log}`);
    hasError = true;
  }
}

if (hasError) process.exit(1);
