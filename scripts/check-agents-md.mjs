import { readFile, lstat } from 'node:fs/promises';
import { resolve } from 'node:path';

const MAX_LINES = 150;
const MAX_COLUMNS = 100;
const AGENTS_PATH = resolve(process.cwd(), 'AGENTS.md');
const CLAUDE_PATH = resolve(process.cwd(), 'CLAUDE.md');

let hasError = false;

// 1. Check AGENTS.md content
let content = '';
try {
  content = await readFile(AGENTS_PATH, 'utf8');
} catch (err) {
  console.error(`❌ AGENTS.md not found at ${AGENTS_PATH}: ${err.message}`);
  process.exit(1);
}

const lines = content.split('\n');
// If file ends with a trailing newline, split results in an extra empty line; pop it if empty
if (lines.length > 0 && lines[lines.length - 1] === '') {
  lines.pop();
}

console.log(`Checking AGENTS.md (${lines.length} lines, max allowed: ${MAX_LINES})...`);

if (lines.length > MAX_LINES) {
  console.error(`❌ AGENTS.md exceeds maximum line count: ${lines.length} > ${MAX_LINES}`);
  hasError = true;
}

const columnViolations = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.length > MAX_COLUMNS) {
    columnViolations.push({ line: i + 1, length: line.length, text: line });
  }
}

if (columnViolations.length > 0) {
  console.error(`❌ AGENTS.md has ${columnViolations.length} line(s) exceeding ${MAX_COLUMNS} columns:`);
  for (const violation of columnViolations) {
    console.error(`   Line ${violation.line} (${violation.length} cols): ${violation.text}`);
  }
  hasError = true;
}

// 2. Check CLAUDE.md symlink if present
try {
  const stats = await lstat(CLAUDE_PATH);
  if (!stats.isSymbolicLink()) {
    console.warn(`⚠️  CLAUDE.md exists but is not a symlink to AGENTS.md.`);
  }
} catch {
  // CLAUDE.md is optional, but symlink recommended
}

if (hasError) {
  process.exit(1);
}

console.log(`✅ AGENTS.md passed all checks (${lines.length}/${MAX_LINES} lines, max columns <= ${MAX_COLUMNS}).`);
