#!/bin/bash

# ==========================================================================
# Audio Tài Lộc - Local Development Startup Script
# ==========================================================================
# This script starts all services (Backend, Frontend, Dashboard) for local development
# 
# Usage:
#   ./start-local.sh           # Start all services
#   ./start-local.sh backend   # Start only backend
#   ./start-local.sh frontend  # Start only frontend
#   ./start-local.sh dashboard # Start only dashboard
# ==========================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
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

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to start backend
start_backend() {
    print_info "Starting Backend on port 3010..."
    
    if check_port 3010; then
        print_warning "Port 3010 is already in use. Backend might be running already."
        read -p "Do you want to kill the process and restart? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Killing process on port 3010..."
            lsof -ti:3010 | xargs kill -9 2>/dev/null || true
            sleep 2
        else
            print_info "Skipping backend startup."
            return
        fi
    fi
    
    cd backend
    
    # Check if .env exists
    if [ ! -f .env ]; then
        print_error "Backend .env file not found!"
        print_info "Please copy .env.example to .env and configure it."
        cd ..
        return 1
    fi
    
    # Check if node_modules exists
    if [ ! -d node_modules ]; then
        print_info "Installing backend dependencies..."
        npm install
    fi
    
    # Start backend in a new terminal
    print_success "Backend starting..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e 'tell application "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev"'
    else
        # Linux (try gnome-terminal or xterm)
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd $(pwd) && npm run dev; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -e "cd $(pwd) && npm run dev; bash" &
        else
            print_warning "Could not detect terminal. Running in background..."
            npm run dev > ../logs/backend.log 2>&1 &
            echo $! > ../logs/backend.pid
        fi
    fi
    
    cd ..
    sleep 3
    
    # Check if backend is running
    if check_port 3010; then
        print_success "Backend started successfully on http://localhost:3010"
        print_info "API Docs: http://localhost:3010/docs"
        print_info "Health: http://localhost:3010/api/v1/health"
    else
        print_error "Failed to start backend on port 3010"
    fi
}

# Function to start frontend
start_frontend() {
    print_info "Starting Frontend on port 3000..."
    
    if check_port 3000; then
        print_warning "Port 3000 is already in use. Frontend might be running already."
        read -p "Do you want to kill the process and restart? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Killing process on port 3000..."
            lsof -ti:3000 | xargs kill -9 2>/dev/null || true
            sleep 2
        else
            print_info "Skipping frontend startup."
            return
        fi
    fi
    
    cd frontend
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        print_error "Frontend .env.local file not found!"
        print_info "Please copy .env.local.example to .env.local and configure it."
        cd ..
        return 1
    fi
    
    # Check if node_modules exists
    if [ ! -d node_modules ]; then
        print_info "Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend in a new terminal
    print_success "Frontend starting..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e 'tell application "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev"'
    else
        # Linux
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd $(pwd) && npm run dev; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -e "cd $(pwd) && npm run dev; bash" &
        else
            print_warning "Could not detect terminal. Running in background..."
            npm run dev > ../logs/frontend.log 2>&1 &
            echo $! > ../logs/frontend.pid
        fi
    fi
    
    cd ..
    sleep 5
    
    # Check if frontend is running
    if check_port 3000; then
        print_success "Frontend started successfully on http://localhost:3000"
    else
        print_error "Failed to start frontend on port 3000"
    fi
}

# Function to start dashboard
start_dashboard() {
    print_info "Starting Dashboard..."
    
    cd dashboard
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        print_error "Dashboard .env.local file not found!"
        print_info "Please copy .env.local.example to .env.local and configure it."
        cd ..
        return 1
    fi
    
    # Check if node_modules exists
    if [ ! -d node_modules ]; then
        print_info "Installing dashboard dependencies..."
        npm install
    fi
    
    # Start dashboard in a new terminal
    print_success "Dashboard starting..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e 'tell application "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev"'
    else
        # Linux
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd $(pwd) && npm run dev; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -e "cd $(pwd) && npm run dev; bash" &
        else
            print_warning "Could not detect terminal. Running in background..."
            npm run dev > ../logs/dashboard.log 2>&1 &
            echo $! > ../logs/dashboard.pid
        fi
    fi
    
    cd ..
    sleep 5
    
    # Dashboard port is dynamic (usually 3001), so we just show info
    print_success "Dashboard started successfully (check terminal for port)"
}

# Function to check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        exit 1
    fi
    print_success "Node.js: $(node --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed!"
        exit 1
    fi
    print_success "npm: $(npm --version)"
    
    # Check if we're in the project root
    if [ ! -d "backend" ] || [ ! -d "frontend" ] || [ ! -d "dashboard" ]; then
        print_error "Please run this script from the project root directory!"
        exit 1
    fi
    
    # Create logs directory if it doesn't exist
    mkdir -p logs
    
    print_success "All prerequisites met!"
    echo ""
}

# Main script
main() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║     🎵 Audio Tài Lộc - Local Development Startup 🎵     ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    
    check_prerequisites
    
    case "${1:-all}" in
        backend)
            start_backend
            ;;
        frontend)
            start_frontend
            ;;
        dashboard)
            start_dashboard
            ;;
        all)
            print_info "Starting all services..."
            echo ""
            start_backend
            echo ""
            start_frontend
            echo ""
            start_dashboard
            echo ""
            print_success "All services started!"
            echo ""
            print_info "📌 Quick Links:"
            echo "   - Backend API: http://localhost:3010/api/v1"
            echo "   - API Docs: http://localhost:3010/docs"
            echo "   - Frontend: http://localhost:3000"
            echo "   - Dashboard: http://localhost:3001 (or next available port)"
            echo ""
            print_info "💡 Tips:"
            echo "   - Check each terminal window for logs"
            echo "   - Press Ctrl+C in each terminal to stop services"
            echo "   - Run './stop-local.sh' to stop all services"
            ;;
        *)
            print_error "Invalid argument: $1"
            echo "Usage: $0 [all|backend|frontend|dashboard]"
            exit 1
            ;;
    esac
    
    echo ""
}

main "$@"
