import { mdToPdf } from 'md-to-pdf';
import { writeFileSync, appendFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, basename, dirname } from 'path';

const LOG_DIR = resolve(process.cwd(), 'logs');
const LOG_FILE = resolve(LOG_DIR, 'conversions.log');

function ensureLogDir() {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }
}

function writeLog(entry) {
  ensureLogDir();
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${entry}\n`;
  appendFileSync(LOG_FILE, line, 'utf8');
  return line.trim();
}

export async function convertMdToPdf(inputPath, outputPath) {
  const absInput = resolve(inputPath);
  const absOutput = outputPath
    ? resolve(outputPath)
    : resolve(dirname(absInput), basename(absInput, '.md') + '.pdf');

  let logEntry;
  try {
    const pdf = await mdToPdf({ path: absInput });
    if (!pdf || !pdf.content) {
      throw new Error('Conversion returned empty content');
    }
    writeFileSync(absOutput, pdf.content);
    logEntry = writeLog(`SUCCESS input="${absInput}" output="${absOutput}"`);
    return { success: true, output: absOutput, log: logEntry };
  } catch (err) {
    logEntry = writeLog(`FAILURE input="${absInput}" error="${err.message}"`);
    return { success: false, error: err.message, log: logEntry };
  }
}
