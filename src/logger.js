import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const LOG_DIR  = resolve(process.cwd(), 'logs');
const LOG_FILE = resolve(LOG_DIR, 'conversions.log');

function ensureLogDir() {
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Returns a writeLog(entry) function that prefixes each line with
 * an ISO timestamp and an optional tag, e.g. "[mobile]" or "[desktop]".
 *
 * @param {string} [tag] - optional label inserted after the timestamp
 */
export function createLogger(tag) {
  const prefix = tag ? `[${tag}] ` : '';
  return function writeLog(entry) {
    ensureLogDir();
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${prefix}${entry}\n`;
    appendFileSync(LOG_FILE, line, 'utf8');
    return line.trim();
  };
}
