#!/bin/bash
# Script to kill process on port 3010

PORT=${1:-3010}

echo "🔍 Checking for processes on port $PORT..."

# Find process using the port
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ -z "$PID" ]; then
  echo "✅ No process found on port $PORT"
  exit 0
fi

echo "⚠️  Found process(es) on port $PORT:"
ps -p $PID -o pid,ppid,command

read -p "Do you want to kill these processes? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  kill -9 $PID 2>/dev/null
  echo "✅ Killed process(es) on port $PORT"
else
  echo "❌ Cancelled"
  exit 1
fi

