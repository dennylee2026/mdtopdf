#!/usr/bin/env node
import { convertMdToPdf } from './index.js';
import { convertMdToPdfMobile } from './mobile.js';

const args = process.argv.slice(2);
const mobileFlag = args.includes('--mobile');
const positional = args.filter(a => !a.startsWith('--'));
const [inputArg, outputArg] = positional;

if (!inputArg) {
  console.error('Usage: mdtopdf [--mobile] <input.md> [output.pdf]');
  console.error('  --mobile   Mobile-friendly layout (390px, Google-color headings)');
  process.exit(1);
}

const convert = mobileFlag ? convertMdToPdfMobile : convertMdToPdf;
const result = await convert(inputArg, outputArg);

if (result.success) {
  console.log(`✓ Converted${mobileFlag ? ' [mobile]' : ''}: ${result.output}`);
  console.log(`  Log: ${result.log}`);
} else {
  console.error(`✗ Failed: ${result.error}`);
  console.error(`  Log: ${result.log}`);
  process.exit(1);
}
