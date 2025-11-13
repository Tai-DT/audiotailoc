#!/usr/bin/env node
/*
 Simple MCP project scanner: verifies .cursor/mcp.json, lists available servers,
 checks connectivity to Postgres, and prints suggested next steps.
*/

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return null;
  }
}

function logHeader(title) {
  const line = '-'.repeat(Math.max(3, title.length + 2));
  console.log(`\n${line}\n ${title}\n${line}`);
}

function which(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function main() {
  const root = process.cwd();
  const mcpConfigPath = path.join(root, '.cursor', 'mcp.json');

  logHeader('MCP Configuration');
  const mcpConfig = readJson(mcpConfigPath);
  if (!mcpConfig) {
    console.log('Missing .cursor/mcp.json');
  } else {
    console.log('Loaded .cursor/mcp.json');
    const servers = Object.keys(mcpConfig.mcpServers || {});
    console.log('Configured servers:', servers.length ? servers.join(', ') : '(none)');
  }

  logHeader('Node & npx availability');
  console.log('node:', which('node') ? 'found' : 'missing');
  console.log('npx :', which('npx') ? 'found' : 'missing');

  logHeader('Postgres Connectivity Check');
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/atl';
  console.log('DATABASE_URL:', dbUrl);
  try {
    // Try to connect using psql if available; otherwise skip
    if (which('psql')) {
      execSync(`psql '${dbUrl.replace('postgresql://', 'postgres://')}' -c "SELECT 1;"`, {
        stdio: 'ignore'
      });
      console.log('Postgres: OK');
    } else {
      console.log('psql not found, skipping direct connectivity test.');
    }
  } catch (err) {
    console.log('Postgres: FAILED (start docker compose or adjust credentials)');
  }

  logHeader('Swagger/OpenAPI');
  console.log('Backend exposes Swagger at http://localhost:8000/docs and /api/v1/docs (per code).');
  console.log('You can add an OpenAPI MCP server if desired.');

  logHeader('Suggested Next Steps');
  console.log('- Ensure docker-compose services are running for Postgres.');
  console.log('- In Cursor, enable MCP and load .cursor/mcp.json.');
  console.log('- Optionally add OpenAPI MCP server pointing to backend Swagger JSON.');
}

main();

