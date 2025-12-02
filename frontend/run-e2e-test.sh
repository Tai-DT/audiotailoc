#!/bin/bash

# E2E Test Runner for Audio Tài Lộc Frontend
# Ensures correct port is used for testing

set -e

echo "🔍 Checking frontend server..."

# Check if server is running on 3001
if curl -sf http://localhost:3001 > /dev/null; then
  echo "✅ Frontend server is running on port 3001"
  export FRONTEND_PORT=3001
elif curl -sf http://localhost:3000 > /dev/null; then
  echo "✅ Frontend server is running on port 3000"
  export FRONTEND_PORT=3000
else
  echo "❌ Frontend server is not running. Please start it with 'npm run dev'"
  exit 1
fi

echo "🧪 Running Playwright E2E tests..."
npx playwright test e2e.spec.ts --reporter=html

echo "✅ Tests complete!"
