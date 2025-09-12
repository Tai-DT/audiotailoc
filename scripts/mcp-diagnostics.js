#!/usr/bin/env node
/*
  mcp-diagnostics.js
  - Runs project-wide analysis: lint, typecheck, and tests across packages
  - Targets: backend (NestJS), dashboard (Next.js)
  - Usage:
      node scripts/mcp-diagnostics.js analyze    # lint + typecheck summary
      node scripts/mcp-diagnostics.js fix        # eslint --fix where available
      node scripts/mcp-diagnostics.js test       # run test suites
      node scripts/mcp-diagnostics.js all        # analyze + fix + test

  Notes:
  - Requires dependencies installed in each package.
  - Designed to be called manually or via Codex tasks.
*/

const { spawnSync } = require('node:child_process');
const { join } = require('node:path');

const root = process.cwd();
const pkgs = [
  {
    name: 'backend',
    cwd: join(root, 'backend'),
    scripts: {
      lint: ['npm', ['run', 'lint']],
      lintFix: ['npm', ['run', 'lint:fix']],
      typecheck: ['npm', ['run', 'typecheck']],
      test: ['npm', ['run', 'test']],
      testCi: ['npm', ['run', 'test:ci']],
    },
  },
  {
    name: 'dashboard',
    cwd: join(root, 'dashboard'),
    scripts: {
      lint: ['npm', ['run', 'lint']],
      // dashboard has no lint:fix script; attempt eslint --fix if available
      lintFix: ['npx', ['eslint', '--fix', '.']],
      // no dedicated typecheck script; rely on next build typecheck by default
      typecheck: ['npx', ['tsc', '-p', 'tsconfig.json', '--noEmit']],
      // testing stack may be configured by project; try jest if present
      test: ['npx', ['jest']],
      testCi: ['npx', ['jest', '--ci', '--coverage', '--watchAll=false', '--passWithNoTests']],
    },
  },
];

function run(label, cmd, args, options = {}) {
  process.stdout.write(`\n— ${label}: ${[cmd, ...args].join(' ')}\n`);
  const res = spawnSync(cmd, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    ...options,
  });
  const out = res.stdout || '';
  const err = res.stderr || '';
  if (out) process.stdout.write(out);
  if (err) process.stderr.write(err);
  return { code: res.status ?? 1, out, err };
}

function tryScript(pkg, key, fallback) {
  const tuple = pkg.scripts[key] || fallback;
  if (!tuple) return null;
  const [cmd, args] = tuple;
  return { cmd, args };
}

function analyze() {
  let failures = 0;
  for (const pkg of pkgs) {
    console.log(`\n=== Analyze: ${pkg.name} ===`);
    const lint = tryScript(pkg, 'lint');
    if (lint) {
      const { code } = run(`${pkg.name} lint`, lint.cmd, lint.args, { cwd: pkg.cwd });
      if (code !== 0) failures++;
    } else {
      console.log(`${pkg.name}: no lint script`);
    }

    const typecheck = tryScript(pkg, 'typecheck');
    if (typecheck) {
      const { code } = run(`${pkg.name} typecheck`, typecheck.cmd, typecheck.args, { cwd: pkg.cwd });
      if (code !== 0) failures++;
    } else {
      console.log(`${pkg.name}: no typecheck script`);
    }
  }
  return failures;
}

function fix() {
  let failures = 0;
  for (const pkg of pkgs) {
    console.log(`\n=== Auto-fix: ${pkg.name} ===`);
    const lintFix = tryScript(pkg, 'lintFix');
    if (lintFix) {
      const { code } = run(`${pkg.name} lint:fix`, lintFix.cmd, lintFix.args, { cwd: pkg.cwd });
      if (code !== 0) failures++;
    } else {
      console.log(`${pkg.name}: no lint:fix available`);
    }
  }
  return failures;
}

function test() {
  let failures = 0;
  for (const pkg of pkgs) {
    console.log(`\n=== Test: ${pkg.name} ===`);
    const testCmd = tryScript(pkg, 'testCi') || tryScript(pkg, 'test');
    if (testCmd) {
      const { code } = run(`${pkg.name} test`, testCmd.cmd, testCmd.args, { cwd: pkg.cwd });
      if (code !== 0) failures++;
    } else {
      console.log(`${pkg.name}: no test script`);
    }
  }
  return failures;
}

function printSummary(title, failures) {
  console.log(`\n====================================`);
  console.log(`${title} summary: ${failures === 0 ? 'OK' : failures + ' failure(s)'}`);
  console.log(`====================================\n`);
  process.exitCode = failures === 0 ? 0 : 1;
}

async function main() {
  const mode = (process.argv[2] || 'analyze').toLowerCase();
  switch (mode) {
    case 'analyze': {
      const f = analyze();
      printSummary('Analyze', f);
      break;
    }
    case 'fix': {
      const f = fix();
      printSummary('Auto-fix', f);
      break;
    }
    case 'test': {
      const f = test();
      printSummary('Test', f);
      break;
    }
    case 'all': {
      let f = 0;
      f += analyze();
      f += fix();
      f += test();
      printSummary('All tasks', f);
      break;
    }
    default:
      console.log('Usage: node scripts/mcp-diagnostics.js [analyze|fix|test|all]');
      process.exitCode = 2;
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e);
  process.exitCode = 1;
});

