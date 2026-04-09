import { mdToPdf } from 'md-to-pdf';
import { writeFileSync } from 'fs';
import { resolve, basename, dirname } from 'path';
import { createLogger } from './logger.js';

const writeLog = createLogger();

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
