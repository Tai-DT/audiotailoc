#!/bin/bash

# ==========================================================================
# Audio Tài Lộc - Stop All Local Services
# ==========================================================================
# This script stops all running services (Backend, Frontend, Dashboard)
# 
# Usage:
#   ./stop-local.sh
# ==========================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to kill process on a port
kill_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_info "Stopping $service on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
        
        if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_success "$service stopped successfully"
        else
            print_error "Failed to stop $service"
        fi
    else
        print_warning "$service not running on port $port"
    fi
}

# Function to kill process by PID file
kill_by_pid() {
    local pid_file=$1
    local service=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            print_info "Stopping $service (PID: $pid)..."
            kill -9 $pid 2>/dev/null || true
            rm -f "$pid_file"
            print_success "$service stopped successfully"
        else
            print_warning "$service PID file exists but process not running"
            rm -f "$pid_file"
        fi
    fi
}

main() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║      🛑 Audio Tài Lộc - Stop Local Services 🛑          ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    
    print_info "Stopping all services..."
    echo ""
    
    # Stop by port
    kill_port 3010 "Backend"
    kill_port 3000 "Frontend"
    kill_port 3001 "Dashboard (primary)"
    kill_port 3002 "Dashboard (fallback)"
    
    echo ""
    
    # Stop by PID files if they exist
    if [ -d "logs" ]; then
        kill_by_pid "logs/backend.pid" "Backend"
        kill_by_pid "logs/frontend.pid" "Frontend"
        kill_by_pid "logs/dashboard.pid" "Dashboard"
    fi
    
    echo ""
    print_success "All services stopped!"
    echo ""
    
    # Optional: clean up log files
    read -p "Do you want to clear log files? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -d "logs" ]; then
            rm -f logs/*.log
            rm -f logs/*.pid
            print_success "Log files cleared"
        fi
    fi
    
    echo ""
}

main
