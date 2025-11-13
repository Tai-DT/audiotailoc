#!/bin/bash

# Audio Tài Lộc - Development Startup Script
# This script starts both backend and dashboard in development mode

set -e

echo "🎵 Audio Tài Lộc - Development Environment"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if backend directory exists
if [ ! -d "$SCRIPT_DIR/backend" ]; then
    echo -e "${RED}❌ Backend directory not found!${NC}"
    exit 1
fi

# Check if dashboard directory exists
if [ ! -d "$SCRIPT_DIR/dashboard" ]; then
    echo -e "${RED}❌ Dashboard directory not found!${NC}"
    exit 1
fi

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    echo -e "${YELLOW}🔪 Killing process on port $port...${NC}"
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 2
}

# Check and kill existing processes
echo -e "${BLUE}📋 Checking existing processes...${NC}"
if check_port 3010; then
    echo -e "${YELLOW}⚠️  Port 3010 (Backend) is already in use${NC}"
    kill_port 3010
fi

if check_port 3001; then
    echo -e "${YELLOW}⚠️  Port 3001 (Dashboard) is already in use${NC}"
    kill_port 3001
fi

echo ""

# Start Backend
echo -e "${GREEN}🚀 Starting Backend (Port 3010)...${NC}"
cd "$SCRIPT_DIR/backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    yarn install
fi

# Check if prisma client is generated
if [ ! -d "node_modules/.prisma" ]; then
    echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
    npx prisma generate
fi

# Start backend in background
echo -e "${GREEN}▶️  Starting backend server...${NC}"
yarn dev > "$SCRIPT_DIR/backend-dev.log" 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend PID: $BACKEND_PID${NC}"

# Wait for backend to start
echo -e "${BLUE}⏳ Waiting for backend to start...${NC}"
sleep 8

# Check if backend is running
if ! check_port 3010; then
    echo -e "${RED}❌ Backend failed to start! Check backend-dev.log${NC}"
    cat "$SCRIPT_DIR/backend-dev.log"
    exit 1
fi

echo -e "${GREEN}✅ Backend is running on http://localhost:3010${NC}"
echo ""

# Start Dashboard
echo -e "${GREEN}🚀 Starting Dashboard (Port 3001)...${NC}"
cd "$SCRIPT_DIR/dashboard"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dashboard dependencies...${NC}"
    npm install
fi

# Clear Next.js cache
echo -e "${BLUE}🧹 Clearing Next.js cache...${NC}"
rm -rf .next node_modules/.cache 2>/dev/null || true

# Start dashboard in background
echo -e "${GREEN}▶️  Starting dashboard server...${NC}"
npm run dev > "$SCRIPT_DIR/dashboard-dev.log" 2>&1 &
DASHBOARD_PID=$!
echo -e "${GREEN}✅ Dashboard PID: $DASHBOARD_PID${NC}"

# Wait for dashboard to start
echo -e "${BLUE}⏳ Waiting for dashboard to start...${NC}"
sleep 10

# Check if dashboard is running
if ! check_port 3001; then
    echo -e "${RED}❌ Dashboard failed to start! Check dashboard-dev.log${NC}"
    cat "$SCRIPT_DIR/dashboard-dev.log"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Dashboard is running on http://localhost:3001${NC}"
echo ""
echo "=========================================="
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}📊 Service URLs:${NC}"
echo -e "  Backend API:    ${GREEN}http://localhost:3010${NC}"
echo -e "  API Docs:       ${GREEN}http://localhost:3010/api/v1/docs${NC}"
echo -e "  Dashboard:      ${GREEN}http://localhost:3001${NC}"
echo ""
echo -e "${BLUE}📝 Process IDs:${NC}"
echo -e "  Backend PID:    ${YELLOW}$BACKEND_PID${NC}"
echo -e "  Dashboard PID:  ${YELLOW}$DASHBOARD_PID${NC}"
echo ""
echo -e "${BLUE}📋 Logs:${NC}"
echo -e "  Backend:        ${YELLOW}tail -f $SCRIPT_DIR/backend-dev.log${NC}"
echo -e "  Dashboard:      ${YELLOW}tail -f $SCRIPT_DIR/dashboard-dev.log${NC}"
echo ""
echo -e "${BLUE}🛑 To stop services:${NC}"
echo -e "  ${YELLOW}kill $BACKEND_PID $DASHBOARD_PID${NC}"
echo -e "  or press ${YELLOW}Ctrl+C${NC} in this terminal"
echo ""
echo -e "${BLUE}🔍 To check logs:${NC}"
echo -e "  ${YELLOW}tail -f backend-dev.log${NC}"
echo -e "  ${YELLOW}tail -f dashboard-dev.log${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping services...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $DASHBOARD_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Services stopped${NC}"
    exit 0
}

# Trap CTRL+C
trap cleanup SIGINT SIGTERM

# Wait for processes
echo -e "${GREEN}✨ Development environment is ready!${NC}"
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"
echo ""

# Follow logs
tail -f "$SCRIPT_DIR/backend-dev.log" "$SCRIPT_DIR/dashboard-dev.log"
