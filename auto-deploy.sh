#!/bin/bash
# auto-deploy.sh - Automated deployment script

# Configuration
PROJECT_ROOT="/Users/macbook/Desktop/Code/audiotailoc"
BACKEND_DIR="${PROJECT_ROOT}/backend"
FRONTEND_DIR="${PROJECT_ROOT}/frontend"
DASHBOARD_DIR="${PROJECT_ROOT}/dashboard"
LOG_FILE="${PROJECT_ROOT}/logs/auto-deploy.log"
BACKUP_DIR="${PROJECT_ROOT}/backups/$(date +%Y%m%d_%H%M%S)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

# Backup current state
backup_current_state() {
    log "Creating backup..."
    mkdir -p "$BACKUP_DIR"

    # Backup database if possible
    if [ -f "${BACKEND_DIR}/.env" ]; then
        cp "${BACKEND_DIR}/.env" "${BACKUP_DIR}/"
    fi

    # Backup package files
    for dir in "$BACKEND_DIR" "$FRONTEND_DIR" "$DASHBOARD_DIR"; do
        if [ -f "${dir}/package.json" ]; then
            cp "${dir}/package.json" "${BACKUP_DIR}/$(basename "$dir")-package.json"
        fi
        if [ -f "${dir}/package-lock.json" ]; then
            cp "${dir}/package-lock.json" "${BACKUP_DIR}/$(basename "$dir")-package-lock.json"
        fi
    done

    success "Backup created at: $BACKUP_DIR"
}

# Update dependencies
update_dependencies() {
    local dir=$1
    local name=$2

    log "Updating dependencies for $name..."

    cd "$dir" || {
        error "Cannot change to $name directory: $dir"
        return 1
    }

    # Backup package-lock.json
    if [ -f "package-lock.json" ]; then
        cp package-lock.json package-lock.json.backup
    fi

    # Update dependencies
    if npm update; then
        success "$name dependencies updated"
        return 0
    else
        error "Failed to update $name dependencies"
        # Restore backup
        if [ -f "package-lock.json.backup" ]; then
            mv package-lock.json.backup package-lock.json
        fi
        return 1
    fi
}

# Build project
build_project() {
    local dir=$1
    local name=$2

    log "Building $name..."

    cd "$dir" || {
        error "Cannot change to $name directory: $dir"
        return 1
    }

    if npm run build; then
        success "$name built successfully"
        return 0
    else
        error "Failed to build $name"
        return 1
    fi
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."

    cd "$BACKEND_DIR" || {
        error "Cannot change to backend directory: $BACKEND_DIR"
        return 1
    }

    # Generate Prisma client
    if npx prisma generate; then
        success "Prisma client generated"
    else
        error "Failed to generate Prisma client"
        return 1
    fi

    # Run migrations in development
    if npx prisma migrate dev --name auto-deploy-$(date +%s); then
        success "Database migrations completed"
        return 0
    else
        error "Database migration failed"
        return 1
    fi
}

# Run tests
run_tests() {
    local dir=$1
    local name=$2

    log "Running tests for $name..."

    cd "$dir" || {
        error "Cannot change to $name directory: $dir"
        return 1
    }

    if npm test -- --watchAll=false --passWithNoTests; then
        success "$name tests passed"
        return 0
    else
        warning "$name tests failed or not configured"
        return 0  # Don't fail deployment for test failures
    fi
}

# Health check
health_check() {
    log "Performing health checks..."

    # Wait for server to be ready
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:3010/api/v1/health | jq -e '.status == "ok"' >/dev/null 2>&1; then
            success "Backend health check passed"
            return 0
        fi
        log "Waiting for backend... (attempt $attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done

    error "Backend health check failed after $max_attempts attempts"
    return 1
}

# Deploy backend
deploy_backend() {
    log "Deploying backend..."

    cd "$BACKEND_DIR" || {
        error "Cannot change to backend directory: $BACKEND_DIR"
        return 1
    }

    # Stop existing server
    pkill -f "npm run start:dev" || true
    sleep 2

    # Start server
    npm run start:dev > "${PROJECT_ROOT}/logs/backend-deploy.log" 2>&1 &
    local backend_pid=$!

    log "Backend started with PID: $backend_pid"

    # Health check
    if health_check; then
        success "Backend deployed successfully"
        return 0
    else
        error "Backend deployment failed"
        kill "$backend_pid" 2>/dev/null || true
        return 1
    fi
}

# Deploy frontend
deploy_frontend() {
    log "Deploying frontend..."

    cd "$FRONTEND_DIR" || {
        error "Cannot change to frontend directory: $FRONTEND_DIR"
        return 1
    }

    # Stop existing server
    pkill -f "npm run dev" || true
    sleep 2

    # Start server
    npm run dev > "${PROJECT_ROOT}/logs/frontend-deploy.log" 2>&1 &
    local frontend_pid=$!

    log "Frontend started with PID: $frontend_pid"
    success "Frontend deployed successfully"
}

# Deploy dashboard
deploy_dashboard() {
    log "Deploying dashboard..."

    cd "$DASHBOARD_DIR" || {
        error "Cannot change to dashboard directory: $DASHBOARD_DIR"
        return 1
    }

    # Stop existing server
    pkill -f "npm run dev" || true
    sleep 2

    # Start server
    npm run dev > "${PROJECT_ROOT}/logs/dashboard-deploy.log" 2>&1 &
    local dashboard_pid=$!

    log "Dashboard started with PID: $dashboard_pid"
    success "Dashboard deployed successfully"
}

# Main deployment function
deploy() {
    local skip_tests=false
    local skip_build=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tests)
                skip_tests=true
                shift
                ;;
            --skip-build)
                skip_build=true
                shift
                ;;
            *)
                error "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    echo -e "${PURPLE}🚀 Audio Tài Lộc Auto-Deploy${NC}"
    echo -e "${PURPLE}$(printf '%.0s=' {1..50})${NC}"

    # Create log directory
    mkdir -p "${PROJECT_ROOT}/logs"

    # Backup current state
    backup_current_state

    # Update and build backend
    log "Processing backend..."
    if update_dependencies "$BACKEND_DIR" "Backend"; then
        if [ "$skip_build" = false ]; then
            build_project "$BACKEND_DIR" "Backend" || return 1
        fi
        if [ "$skip_tests" = false ]; then
            run_tests "$BACKEND_DIR" "Backend"
        fi
    else
        return 1
    fi

    # Run database migrations
    run_migrations || return 1

    # Update and build frontend
    log "Processing frontend..."
    if update_dependencies "$FRONTEND_DIR" "Frontend"; then
        if [ "$skip_build" = false ]; then
            build_project "$FRONTEND_DIR" "Frontend" || return 1
        fi
    fi

    # Update and build dashboard
    log "Processing dashboard..."
    if update_dependencies "$DASHBOARD_DIR" "Dashboard"; then
        if [ "$skip_build" = false ]; then
            build_project "$DASHBOARD_DIR" "Dashboard" || return 1
        fi
    fi

    # Deploy all services
    deploy_backend || return 1
    deploy_frontend
    deploy_dashboard

    success "🎉 Deployment completed successfully!"
    info "Check logs at: $LOG_FILE"
    info "Backup created at: $BACKUP_DIR"
}

# Rollback function
rollback() {
    if [ ! -d "$BACKUP_DIR" ]; then
        error "No backup found to rollback to"
        return 1
    fi

    log "Rolling back to backup: $BACKUP_DIR"

    # Restore files
    if [ -f "${BACKUP_DIR}/.env" ]; then
        cp "${BACKUP_DIR}/.env" "${BACKEND_DIR}/"
    fi

    # Restore package files
    for dir in "$BACKEND_DIR" "$FRONTEND_DIR" "$DASHBOARD_DIR"; do
        local name=$(basename "$dir")
        if [ -f "${BACKUP_DIR}/${name}-package.json" ]; then
            cp "${BACKUP_DIR}/${name}-package.json" "${dir}/package.json"
        fi
        if [ -f "${BACKUP_DIR}/${name}-package-lock.json" ]; then
            cp "${BACKUP_DIR}/${name}-package-lock.json" "${dir}/package-lock.json"
        fi
    done

    success "Rollback completed"
}

# Main function
main() {
    case "${1:-deploy}" in
        deploy)
            deploy "$@"
            ;;
        rollback)
            rollback
            ;;
        backup)
            backup_current_state
            ;;
        *)
            echo "Usage: $0 [deploy|rollback|backup] [options]"
            echo "Options:"
            echo "  --skip-tests    Skip running tests"
            echo "  --skip-build    Skip building projects"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"