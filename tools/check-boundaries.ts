#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

// Boundary rules from plantilla.md section 8
const RULES = [
  {
    name: 'core must not import from tenant',
    pattern: /from ['"]@tenant/,
    allowIn: ['src/core/integration'], // Only integration can import tenant via virtual module
  },
  {
    name: 'domain must not import from external layers',
    pattern: /from ['"]@core\/(application|infrastructure|composition|presentation|integration|config)/,
    allowIn: [],
  },
  {
    name: 'application must not import from infrastructure',
    pattern: /from ['"]@core\/infrastructure/,
    allowIn: [],
  },
  {
    name: 'tenant must not contain logic imports',
    pattern: /from ['"]@core\/(domain|application|infrastructure|composition|presentation|integration)/,
    allowIn: ['src/tenant/overrides'], // Only overrides can import core
  },
];

function findFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  const items = readdirSync(dir);

  for (const item of items) {
    const path = join(dir, item);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...findFiles(path, extensions));
    } else if (extensions.includes(extname(item))) {
      files.push(path);
    }
  }

  return files;
}

function checkFile(filePath: string): { file: string; violations: string[] } {
  const content = readFileSync(filePath, 'utf-8');
  const violations: string[] = [];

  for (const rule of RULES) {
    // Check if file is in allowed paths
    const isAllowed = rule.allowIn.some(allowed => filePath.includes(allowed));
    if (isAllowed) continue;

    if (rule.pattern.test(content)) {
      violations.push(rule.name);
    }
  }

  return { file: filePath, violations };
}

function main() {
  const files = findFiles('src', ['.ts', '.astro', '.js']);
  let errorCount = 0;

  console.log('Checking import boundaries...\n');

  for (const file of files) {
    const result = checkFile(file);
    if (result.violations.length > 0) {
      errorCount++;
      console.log(`❌ ${file}`);
      for (const violation of result.violations) {
        console.log(`   - ${violation}`);
      }
    }
  }

  console.log(`\n${errorCount} violations found`);

  if (errorCount > 0) {
    process.exit(1);
  }

  console.log('✅ All boundary rules respected');
}

main();
