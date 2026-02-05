#!/bin/bash

# Audio Tài Lộc - Development Runner Script
# Chạy tất cả các phần của dự án: Frontend, Backend, Dashboard

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function to check if port is in use
check_port() {
    local port=$1
    local name=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        print_warning "Port $port ($name) is already in use"
        return 1
    fi
    return 0
}

# Function to kill any process listening on a port (best-effort)
kill_port() {
    local port=$1
    local name=$2
    local pids
    pids=$(lsof -Pi :$port -sTCP:LISTEN -t 2>/dev/null || true)
    if [ -n "$pids" ]; then
        print_warning "Stopping processes on port $port ($name): $pids"
        kill -TERM $pids 2>/dev/null || true
        sleep 1
        pids=$(lsof -Pi :$port -sTCP:LISTEN -t 2>/dev/null || true)
        if [ -n "$pids" ]; then
            kill -KILL $pids 2>/dev/null || true
        fi
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1

    print_status "Waiting for $service_name to be ready..."

    while [ $attempt -le $max_attempts ]; do
        if curl -s --max-time 5 "$url" > /dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi

        echo -n "."
        sleep 2
        ((attempt++))
    done

    print_error "$service_name failed to start within $(($max_attempts * 2)) seconds"
    return 1
}

# Function to read value from a dotenv file (basic KEY=VALUE parsing)
read_dotenv() {
    local file=$1
    local key=$2
    local default_value=$3

    if [ -f "$file" ]; then
        # Get last matching assignment for key (ignore comments)
        local line
        line=$(grep -E "^[[:space:]]*${key}=" "$file" | tail -n 1 2>/dev/null || true)
        if [ -n "$line" ]; then
            local value="${line#*=}"
            # Strip surrounding quotes if present
            value="${value%\"}"
            value="${value#\"}"
            value="${value%\'}"
            value="${value#\'}"
            echo "$value"
            return 0
        fi
    fi

    echo "$default_value"
}

# Function to start a service in background
start_service() {
    local dir=$1
    local command=$2
    local service_name=$3
    local log_file="dev.log"

    print_status "Starting $service_name in $dir..."

    cd "$dir"

    # Start service in background and redirect output to log file
    if command -v setsid >/dev/null 2>&1; then
        # Run each service in its own session/process group so we can stop the whole tree reliably.
        setsid bash -lc "$command" > "$log_file" 2>&1 < /dev/null &
    else
        # Fallback: still run in background, but stopping may leave orphaned children on some platforms.
        nohup bash -lc "$command" > "$log_file" 2>&1 < /dev/null &
    fi
    local pid=$!

    # Save PID for cleanup
    echo $pid > "dev.pid"

    print_success "$service_name started with PID: $pid"
    print_status "Logs: $dir/$log_file"

    cd - > /dev/null
}

# Function to stop all services
stop_services() {
    print_warning "Stopping all services..."

    local backend_port
    backend_port=$(read_dotenv "backend/.env" "PORT" "3010")

    # Stop frontend
    if [ -f "frontend/dev.pid" ]; then
        local pid=$(cat frontend/dev.pid)
        if kill -0 $pid 2>/dev/null; then
            kill -TERM -- -$pid 2>/dev/null || kill -TERM $pid 2>/dev/null || true
            sleep 1
            if kill -0 $pid 2>/dev/null; then
                kill -KILL -- -$pid 2>/dev/null || kill -KILL $pid 2>/dev/null || true
            fi
            print_status "Frontend stopped (PID: $pid)"
        fi
        rm -f frontend/dev.pid
    fi
    kill_port 3000 "Frontend"

    # Stop backend
    if [ -f "backend/dev.pid" ]; then
        local pid=$(cat backend/dev.pid)
        if kill -0 $pid 2>/dev/null; then
            kill -TERM -- -$pid 2>/dev/null || kill -TERM $pid 2>/dev/null || true
            sleep 1
            if kill -0 $pid 2>/dev/null; then
                kill -KILL -- -$pid 2>/dev/null || kill -KILL $pid 2>/dev/null || true
            fi
            print_status "Backend stopped (PID: $pid)"
        fi
        rm -f backend/dev.pid
    fi
    kill_port "$backend_port" "Backend"

    # Stop dashboard
    if [ -f "dashboard/dev.pid" ]; then
        local pid=$(cat dashboard/dev.pid)
        if kill -0 $pid 2>/dev/null; then
            kill -TERM -- -$pid 2>/dev/null || kill -TERM $pid 2>/dev/null || true
            sleep 1
            if kill -0 $pid 2>/dev/null; then
                kill -KILL -- -$pid 2>/dev/null || kill -KILL $pid 2>/dev/null || true
            fi
            print_status "Dashboard stopped (PID: $pid)"
        fi
        rm -f dashboard/dev.pid
    fi
    kill_port 3001 "Dashboard"

    print_success "All services stopped"
}

# Function to show status
show_status() {
    print_header "SERVICE STATUS"

    # Check frontend
    if [ -f "frontend/dev.pid" ]; then
        local pid=$(cat frontend/dev.pid)
        if kill -0 $pid 2>/dev/null; then
            echo -e "${GREEN}✓ Frontend${NC} running (PID: $pid)"
        else
            echo -e "${RED}✗ Frontend${NC} not running (stale PID: $pid)"
        fi
    else
        echo -e "${RED}✗ Frontend${NC} not running"
    fi

    # Check backend
    if [ -f "backend/dev.pid" ]; then
        local pid=$(cat backend/dev.pid)
        if kill -0 $pid 2>/dev/null; then
            echo -e "${GREEN}✓ Backend${NC} running (PID: $pid)"
        else
            echo -e "${RED}✗ Backend${NC} not running (stale PID: $pid)"
        fi
    else
        echo -e "${RED}✗ Backend${NC} not running"
    fi

    # Check dashboard
    if [ -f "dashboard/dev.pid" ]; then
        local pid=$(cat dashboard/dev.pid)
        if kill -0 $pid 2>/dev/null; then
            echo -e "${GREEN}✓ Dashboard${NC} running (PID: $pid)"
        else
            echo -e "${RED}✗ Dashboard${NC} not running (stale PID: $pid)"
        fi
    else
        echo -e "${RED}✗ Dashboard${NC} not running"
    fi
}

# Function to show help
show_help() {
    echo "Audio Tài Lộc - Development Runner"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     Start all services (frontend, backend, dashboard)"
    echo "  stop      Stop all services"
    echo "  restart   Restart all services"
    echo "  status    Show status of all services"
    echo "  logs      Show logs for all services"
    echo "  clean     Clean all log files and PID files"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start    # Start all services"
    echo "  $0 stop     # Stop all services"
    echo "  $0 status   # Check service status"
}

# Function to show logs
show_logs() {
    print_header "SERVICE LOGS"

    if [ -f "frontend/dev.log" ]; then
        echo -e "${CYAN}Frontend Logs (last 20 lines):${NC}"
        tail -20 frontend/dev.log
        echo ""
    else
        echo -e "${RED}No frontend logs found${NC}"
    fi

    if [ -f "backend/dev.log" ]; then
        echo -e "${CYAN}Backend Logs (last 20 lines):${NC}"
        tail -20 backend/dev.log
        echo ""
    else
        echo -e "${RED}No backend logs found${NC}"
    fi

    if [ -f "dashboard/dev.log" ]; then
        echo -e "${CYAN}Dashboard Logs (last 20 lines):${NC}"
        tail -20 dashboard/dev.log
        echo ""
    else
        echo -e "${RED}No dashboard logs found${NC}"
    fi
}

# Function to clean files
clean_files() {
    print_status "Cleaning log files and PID files..."

    rm -f frontend/dev.log frontend/dev.pid
    rm -f backend/dev.log backend/dev.pid
    rm -f dashboard/dev.log dashboard/dev.pid

    print_success "Cleaned all temporary files"
}

# Main script logic
case "${1:-start}" in
    "start")
        print_header "STARTING AUDIO TÀI LỌC DEVELOPMENT ENVIRONMENT"

        # Check if services are already running
        if [ -f "frontend/dev.pid" ] || [ -f "backend/dev.pid" ] || [ -f "dashboard/dev.pid" ]; then
            print_warning "Some services may already be running. Use 'stop' first or 'restart'"
        fi

        # Check Node.js
        if ! command -v node &> /dev/null; then
            print_error "Node.js is not installed. Please install Node.js first."
            exit 1
        fi

        # Check npm
        if ! command -v npm &> /dev/null; then
            print_error "npm is not installed. Please install npm first."
            exit 1
        fi

        # Check ports
        FRONTEND_PORT=3000
        DASHBOARD_PORT=3001
        BACKEND_PORT=$(read_dotenv "backend/.env" "PORT" "3010")
        BACKEND_URL="http://localhost:${BACKEND_PORT}/api/v1"

        check_port $FRONTEND_PORT "Frontend" || exit 1
        check_port $BACKEND_PORT "Backend" || exit 1
        check_port $DASHBOARD_PORT "Dashboard" || exit 1

        # Install dependencies if needed
        print_status "Installing dependencies..."

        if [ ! -d "frontend/node_modules" ]; then
            print_status "Installing frontend dependencies..."
            cd frontend && npm install && cd ..
        fi

        if [ ! -d "backend/node_modules" ]; then
            print_status "Installing backend dependencies..."
            cd backend && npm install && cd ..
        fi

        if [ ! -d "dashboard/node_modules" ]; then
            print_status "Installing dashboard dependencies..."
            cd dashboard && npm install && cd ..
        fi

        # Start services
        # Ensure frontend/dashboard point at the same backend port as backend/.env
        start_service "frontend" "NEXT_PUBLIC_API_URL='${BACKEND_URL}' npm run dev" "Frontend"
        sleep 3

        start_service "backend" "npm run start:dev" "Backend"
        sleep 3

        start_service "dashboard" "NEXT_PUBLIC_API_URL='${BACKEND_URL}' npm run dev" "Dashboard"
        sleep 3

        # Wait for services to be ready
        print_status "Waiting for services to start up..."
        sleep 5

        # Show status
        show_status

        print_success "All services started successfully!"
        echo ""
        echo -e "${CYAN}Access URLs:${NC}"
        echo -e "  Frontend:  ${GREEN}http://localhost:${FRONTEND_PORT}${NC}"
        echo -e "  Backend:   ${GREEN}http://localhost:${BACKEND_PORT}${NC}"
        echo -e "  Dashboard: ${GREEN}http://localhost:${DASHBOARD_PORT}${NC}"
        echo ""
        echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
        echo ""

        # In detached mode, exit after starting services (services continue via nohup).
        # Useful for CI/non-interactive shells.
        if [ "${DEV_RUNNER_DETACH:-}" = "1" ] || [ "${DEV_RUNNER_DETACH:-}" = "true" ]; then
            print_success "Detached mode enabled. Services will keep running in background."
            exit 0
        fi

        # Wait for Ctrl+C
        trap stop_services SIGINT SIGTERM
        wait
        ;;

    "stop")
        stop_services
        ;;

    "restart")
        print_header "RESTARTING ALL SERVICES"
        stop_services
        sleep 2
        exec "$0" start
        ;;

    "status")
        show_status
        ;;

    "logs")
        show_logs
        ;;

    "clean")
        clean_files
        ;;

    "help"|"-h"|"--help")
        show_help
        ;;

    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
