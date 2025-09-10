#!/bin/bash

# Script để chạy cả 3 ứng dụng: Backend, Frontend và Dashboard
# Audio Tài Lộc - E-commerce Platform

echo "🚀 Starting Audio Tài Lộc Platform..."
echo "================================="

# Kill any existing processes on our ports
echo "🔧 Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Function to run app in background
run_app() {
    local name=$1
    local dir=$2
    local port=$3
    
    echo "📦 Starting $name on port $port..."
    cd "$dir" || exit
    npm run dev > /tmp/audiotailoc-$name.log 2>&1 &
    echo "✅ $name started (PID: $!)"
}

# Start Backend
run_app "Backend" "backend" 8000

# Wait for backend to be ready
echo "⏳ Waiting for Backend to be ready..."
sleep 5

# Start Frontend
run_app "Frontend" "frontend" 3000

# Start Dashboard
run_app "Dashboard" "dashboard" 3001

echo ""
echo "================================="
echo "✅ All services are starting!"
echo ""
echo "📍 Access points:"
echo "   Backend API:  http://localhost:8000"
echo "   Frontend:     http://localhost:3000"
echo "   Dashboard:    http://localhost:3001"
echo ""
echo "📊 API Docs:     http://localhost:8000/docs"
echo ""
echo "📝 Logs are saved to /tmp/audiotailoc-*.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo "================================="

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    pkill -P $$ 2>/dev/null
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Keep script running and show logs
while true; do
    sleep 1
done
