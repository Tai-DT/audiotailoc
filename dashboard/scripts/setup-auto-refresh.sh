#!/bin/bash

# Auto Token Refresh Setup Script for Audio Tài Lộc Dashboard
# This script sets up automatic token refresh using cron

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
REFRESH_SCRIPT="$SCRIPT_DIR/refresh-token.js"
LOG_FILE="$PROJECT_DIR/logs/token-refresh.log"

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

# Create cron job entry (runs every 10 minutes)
NODE_BIN="$(command -v node || true)"
if [ -z "$NODE_BIN" ]; then
  echo "⚠️  Node not found in PATH while configuring cron. The cron entry will fall back to 'node' which may not be available to cron."
  echo "   If you use nvm, rvm, or another runtime manager, set NODE_BIN to the absolute node path and re-run this script."
  NODE_BIN="node"
fi
CRON_JOB="*/10 * * * * cd $PROJECT_DIR && \"$NODE_BIN\" $REFRESH_SCRIPT >> $LOG_FILE 2>&1"

echo "🔧 Setting up auto token refresh..."
echo "📁 Project directory: $PROJECT_DIR"
echo "🔄 Refresh script: $REFRESH_SCRIPT"
echo "📋 Log file: $LOG_FILE"
echo ""

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "$REFRESH_SCRIPT"; then
    echo "⚠️  Cron job already exists for token refresh"
    echo "📋 Current cron jobs:"
    crontab -l | grep "$REFRESH_SCRIPT"
else
    # Add to crontab
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "✅ Added cron job for automatic token refresh"
    echo "🕐 Schedule: Every 10 minutes"
    echo "📋 Cron entry: $CRON_JOB"
fi

echo ""
echo "🎯 Manual commands:"
echo "   Refresh now:    npm run refresh-token"
echo "   View logs:      tail -f $LOG_FILE"
echo "   Remove cron:    crontab -e (then delete the line)"
echo ""
echo "🚀 Setup complete! Tokens will auto-refresh every 10 minutes."
