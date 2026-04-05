#!/usr/bin/env node
import { convertMdToPdf } from './index.js';

const [,, inputArg, outputArg] = process.argv;

if (!inputArg) {
  console.error('Usage: mdtopdf <input.md> [output.pdf]');
  process.exit(1);
}

const result = await convertMdToPdf(inputArg, outputArg);

if (result.success) {
  console.log(`✓ Converted: ${result.output}`);
  console.log(`  Log: ${result.log}`);
} else {
  console.error(`✗ Failed: ${result.error}`);
  console.error(`  Log: ${result.log}`);
  process.exit(1);
}
