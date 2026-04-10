import puppeteer from 'puppeteer';
import { marked } from 'marked';
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, basename, dirname } from 'path';

const LOG_DIR = resolve(process.cwd(), 'logs');
const LOG_FILE = resolve(LOG_DIR, 'conversions.log');

// Google product colors: Blue · Red · Yellow · Green
const GOOGLE_BLUE   = '#4285F4';
const GOOGLE_RED    = '#EA4335';
const GOOGLE_YELLOW = '#FBBC05';
const GOOGLE_GREEN  = '#34A853';

const MOBILE_CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans CJK SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 18px;
  line-height: 1.25;
  color: #1a1a1a;
  width: 390px;
  padding: 20px 18px 32px;
  word-break: break-word;
}

/* ── Headings — Google brand colors ── */
h1 {
  font-size: 28px;
  color: ${GOOGLE_BLUE};
  border-left: 4px solid ${GOOGLE_BLUE};
  padding-left: 10px;
  margin-top: 1.4em;
  margin-bottom: 0.4em;
}
h2 {
  font-size: 24px;
  color: ${GOOGLE_RED};
  border-left: 4px solid ${GOOGLE_RED};
  padding-left: 10px;
  margin-top: 1.3em;
  margin-bottom: 0.4em;
}
h3 {
  font-size: 22px;
  color: ${GOOGLE_GREEN};
  border-left: 4px solid ${GOOGLE_GREEN};
  padding-left: 10px;
  margin-top: 1.2em;
  margin-bottom: 0.3em;
}
h4 {
  font-size: 20px;
  background: ${GOOGLE_YELLOW};
  color: #1a1a1a;
  display: inline-block;
  padding: 0 6px 1px;
  border-radius: 3px;
  margin-top: 1.1em;
  margin-bottom: 0.3em;
}
h5 {
  font-size: 18px;
  color: ${GOOGLE_BLUE};
  margin-top: 1em;
  margin-bottom: 0.3em;
}
h6 {
  font-size: 17px;
  color: ${GOOGLE_RED};
  margin-top: 1em;
  margin-bottom: 0.3em;
}

/* ── Bold — yellow highlight ── */
strong, b {
  background: rgba(251, 188, 5, 0.28);
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 700;
}

p { margin: 0.75em 0; }

a {
  color: ${GOOGLE_BLUE};
  text-decoration: none;
  border-bottom: 1px solid rgba(66, 133, 244, 0.3);
}

blockquote {
  border-left: 4px solid ${GOOGLE_YELLOW};
  margin: 1em 0;
  padding: 6px 12px;
  background: rgba(251, 188, 5, 0.08);
  color: #444;
}

code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  background: #f1f3f4;
  padding: 1px 5px;
  border-radius: 3px;
}

pre {
  background: #f1f3f4;
  padding: 12px 14px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.55;
  margin: 1em 0;
}
pre code { background: none; padding: 0; }

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin: 1em 0;
}
th {
  background: ${GOOGLE_BLUE};
  color: #fff;
  padding: 6px 8px;
  text-align: left;
}
td {
  border-bottom: 1px solid #e0e0e0;
  padding: 5px 8px;
}
tr:nth-child(even) td { background: #f8f9fa; }

ul, ol { padding-left: 1.4em; margin: 0.6em 0; }
li { margin: 0.3em 0; }

img { max-width: 100%; height: auto; border-radius: 6px; }

hr { border: none; border-top: 2px solid #e0e0e0; margin: 1.5em 0; }
`;

function ensureLogDir() {
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
}

function writeLog(entry) {
  ensureLogDir();
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [mobile] ${entry}\n`;
  appendFileSync(LOG_FILE, line, 'utf8');
  return line.trim();
}

export async function convertMdToPdfMobile(inputPath, outputPath) {
  const absInput  = resolve(inputPath);
  const absOutput = outputPath
    ? resolve(outputPath)
    : resolve(dirname(absInput), basename(absInput, '.md') + '.mobile.pdf');

  let logEntry;
  try {
    const md   = readFileSync(absInput, 'utf8');
    const body = await marked(md);
    const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<style>${MOBILE_CSS}</style>
</head><body>${body}</body></html>`;

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 800, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Measure full content height — long-page, no pagination
      const contentHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      );

      const pdfBuffer = await page.pdf({
        width:           '390px',
        height:          `${contentHeight}px`,
        printBackground: true,
        margin:          { top: 0, right: 0, bottom: 0, left: 0 },
        pageRanges:      '1',
      });

      writeFileSync(absOutput, pdfBuffer);
    } finally {
      await browser.close();
    }

    logEntry = writeLog(`SUCCESS input="${absInput}" output="${absOutput}"`);
    return { success: true, output: absOutput, log: logEntry };
  } catch (err) {
    logEntry = writeLog(`FAILURE input="${absInput}" error="${err.message}"`);
    return { success: false, error: err.message, log: logEntry };
  }
}
