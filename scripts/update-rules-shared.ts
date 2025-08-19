#!/usr/bin/env ts-node
/**
 * Sync shared conventions + ENV sections across backend, frontend, dashboard rule files.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const rulesDir = join(root, '.cursor/rules');
const backendFile = join(rulesDir, 'backend-rules.mdc');
const frontendFile = join(rulesDir, 'frontend-rules.mdc');
const dashboardFile = join(rulesDir, 'dashboard-rules.mdc');

const backendEnvFile = join(root, 'apps/backend/.env.example');
const frontendEnvFile = join(root, 'apps/frontend/.env.example');
const dashboardEnvFile = join(root, 'apps/dashboard/.env.example');

function extractBetween(text: string, start: string, end: string): string | null {
  const r = new RegExp(`${start}[\n\r]*([\s\S]*?)[\n\r]*${end}`);
  const m = text.match(r);
  return m ? m[1].trim() : null;
}
function replaceBetween(text: string, start: string, end: string, payload: string): string {
  const r = new RegExp(`${start}[\n\r]*([\s\S]*?)[\n\r]*${end}`);
  if (!r.test(text)) return text;
  return text.replace(r, `${start}\n${payload}\n${end}`);
}
function ensureChangelog(text: string, note: string): string {
  if (!/## CHANGELOG/.test(text)) text += `\n\n## CHANGELOG\n`;
  return text + `- ${note}\n`;
}

function readEnvLines(path: string): string[] {
  try {
    return readFileSync(path, 'utf8').split('\n').filter(l => l && !l.startsWith('#'));
  } catch { return []; }
}

function run() {
  const backend = readFileSync(backendFile, 'utf8');
  const table = extractBetween(backend, '<!-- SHARED_CONVENTIONS_START -->', '<!-- SHARED_CONVENTIONS_END -->');
  if (!table) {
    console.error('Shared conventions table not found in backend rules.');
    process.exit(1);
  }
  const shortRef = 'Xem bảng chuẩn trong backend-rules (đồng bộ tự động).';
  const stamp = new Date().toISOString();

  // Shared conventions propagate
  let fe = readFileSync(frontendFile, 'utf8');
  fe = replaceBetween(fe, '<!-- SHARED_CONVENTIONS_FE_START -->', '<!-- SHARED_CONVENTIONS_FE_END -->', `${shortRef}\n\n${table}`);
  let dash = readFileSync(dashboardFile, 'utf8');
  dash = replaceBetween(dash, '<!-- SHARED_CONVENTIONS_DASH_START -->', '<!-- SHARED_CONVENTIONS_DASH_END -->', `${shortRef}\n\n${table}`);

  // ENV sync
  const benv = readEnvLines(backendEnvFile);
  if (benv.length) {
    let backendUpdated = replaceBetween(backend, '<!-- ENV_BACKEND_START -->', '<!-- ENV_BACKEND_END -->', '```\n'+benv.join('\n')+'\n```');
    backendUpdated = ensureChangelog(backendUpdated, `shared conventions + env propagated ${stamp}`);
    writeFileSync(backendFile, backendUpdated, 'utf8');
  }
  const fenv = readEnvLines(frontendEnvFile);
  if (fenv.length) fe = replaceBetween(fe, '<!-- ENV_FRONTEND_START -->', '<!-- ENV_FRONTEND_END -->', '```\n'+fenv.join('\n')+'\n```');
  const denv = readEnvLines(dashboardEnvFile);
  if (denv.length) dash = replaceBetween(dash, '<!-- ENV_DASHBOARD_START -->', '<!-- ENV_DASHBOARD_END -->', '```\n'+denv.join('\n')+'\n```');

  fe = ensureChangelog(fe, `env/shared sync ${stamp}`);
  dash = ensureChangelog(dash, `env/shared sync ${stamp}`);
  writeFileSync(frontendFile, fe, 'utf8');
  writeFileSync(dashboardFile, dash, 'utf8');
  console.log('Shared conventions + ENV synced across rules.');
}
run();
