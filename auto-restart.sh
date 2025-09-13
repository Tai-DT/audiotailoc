#!/bin/bash
# auto-restart.sh - Auto restart server on crash

# Configuration
PROJECT_ROOT="/Users/macbook/Desktop/Code/audiotailoc"
BACKEND_DIR="${PROJECT_ROOT}/backend"
LOG_FILE="${PROJECT_ROOT}/logs/auto-restart.log"
PID_FILE="${PROJECT_ROOT}/auto-restart.pid"
MAX_RESTARTS=10
RESTART_DELAY=5

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}" | tee -a "$LOG_FILE"
}

# Check if another instance is running
check_existing_instance() {
    if [ -f "$PID_FILE" ]; then
        OLD_PID=$(cat "$PID_FILE")
        if kill -0 "$OLD_PID" 2>/dev/null; then
            error "Another auto-restart instance is running (PID: $OLD_PID)"
            exit 1
        else
            warning "Removing stale PID file"
            rm -f "$PID_FILE"
        fi
    fi
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    rm -f "$PID_FILE"
    exit 0
}

# Signal handler
trap cleanup SIGINT SIGTERM

# Health check function
check_health() {
    local max_attempts=5
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:3010/api/v1/health | jq -e '.status == "ok"' >/dev/null 2>&1; then
            return 0
        fi
        sleep 2
        ((attempt++))
    done
    return 1
}

# Start server
start_server() {
    log "Starting server..."
    cd "$BACKEND_DIR" || {
        error "Cannot change to backend directory: $BACKEND_DIR"
        return 1
    }

    # Start server in background
    npm run start:dev > "${PROJECT_ROOT}/logs/server.log" 2>&1 &
    SERVER_PID=$!

    log "Server started with PID: $SERVER_PID"

    # Wait a bit for server to start
    sleep 10

    # Check if server is still running
    if ! kill -0 "$SERVER_PID" 2>/dev/null; then
        error "Server failed to start"
        return 1
    fi

    # Health check
    if check_health; then
        success "Server is healthy"
        return 0
    else
        error "Server health check failed"
        kill "$SERVER_PID" 2>/dev/null
        return 1
    fi
}

# Main monitoring loop
monitor_server() {
    local restart_count=0
    local server_pid=""

    while true; do
        if [ -z "$server_pid" ] || ! kill -0 "$server_pid" 2>/dev/null; then
            if [ $restart_count -ge $MAX_RESTARTS ]; then
                error "Maximum restart attempts ($MAX_RESTARTS) reached. Giving up."
                break
            fi

            ((restart_count++))
            warning "Server not running. Attempting restart $restart_count/$MAX_RESTARTS"

            if start_server; then
                server_pid=$SERVER_PID
                success "Server restarted successfully"
                restart_count=0  # Reset counter on successful start
            else
                error "Failed to restart server"
                sleep $RESTART_DELAY
            fi
        else
            # Server is running, check health periodically
            if ! check_health; then
                warning "Server health check failed, will restart"
                kill "$server_pid" 2>/dev/null
                sleep 2
                server_pid=""
            else
                sleep 30  # Check every 30 seconds
            fi
        fi
    done
}

# Main function
main() {
    echo -e "${BLUE}🚀 Audio Tài Lộc Auto-Restart Monitor${NC}"
    echo -e "${BLUE}$(printf '%.0s=' {1..50})${NC}"

    # Create log directory
    mkdir -p "${PROJECT_ROOT}/logs"

    # Check dependencies
    if ! command -v curl >/dev/null 2>&1; then
        error "curl is required but not installed"
        exit 1
    fi

    if ! command -v jq >/dev/null 2>&1; then
        error "jq is required but not installed"
        exit 1
    fi

    if ! command -v npm >/dev/null 2>&1; then
        error "npm is required but not installed"
        exit 1
    fi

    # Check if backend directory exists
    if [ ! -d "$BACKEND_DIR" ]; then
        error "Backend directory not found: $BACKEND_DIR"
        exit 1
    fi

    # Check existing instance
    check_existing_instance

    # Save PID
    echo $$ > "$PID_FILE"

    log "Auto-restart monitor started"
    log "Project root: $PROJECT_ROOT"
    log "Backend dir: $BACKEND_DIR"
    log "Log file: $LOG_FILE"
    log "PID file: $PID_FILE"

    # Start monitoring
    monitor_server

    cleanup
}

# Run main function
main "$@"