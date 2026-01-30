#!/usr/bin/env bash
set -euo pipefail

echo "Starting integration tests..."
# Ensure env configured for test DB
export NODE_ENV=test
# Run tests via ts-node or jest if available. For simplicity, run ts-node script that executes test files
npx ts-node -e "(async()=>{ const { execSync } = require('child_process'); execSync('NODE_OPTIONS=--loader=ts-node/esm npx mocha tests/**/*.spec.ts --exit',{stdio:'inherit'}); })()"

echo "Integration tests completed"
