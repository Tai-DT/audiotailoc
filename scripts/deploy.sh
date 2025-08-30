#!/bin/bash

# Audio Tài Lộc Deployment Script
# Usage: ./scripts/deploy.sh [environment] [service]

set -e

ENVIRONMENT=${1:-"development"}
SERVICE=${2:-"all"}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi

    if [[ "$ENVIRONMENT" != "development" && "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
        log_error "Invalid environment: $ENVIRONMENT. Must be development, staging, or production"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Setup environment
setup_environment() {
    log_info "Setting up environment: $ENVIRONMENT"

    cd "$PROJECT_ROOT"

    # Create environment-specific docker-compose file if it doesn't exist
    if [[ ! -f "docker-compose.$ENVIRONMENT.yml" ]]; then
        log_warning "Environment-specific docker-compose file not found. Using default docker-compose.yml"
    fi

    # Create .env file if it doesn't exist
    if [[ ! -f ".env.$ENVIRONMENT" ]]; then
        log_error "Environment file .env.$ENVIRONMENT not found"
        log_info "Please create .env.$ENVIRONMENT file with required environment variables"
        exit 1
    fi

    # Copy environment file
    cp ".env.$ENVIRONMENT" ".env"

    log_success "Environment setup completed"
}

# Build services
build_services() {
    log_info "Building services..."

    cd "$PROJECT_ROOT"

    if [[ "$SERVICE" == "all" ]]; then
        docker-compose build --parallel
    else
        docker-compose build "$SERVICE"
    fi

    log_success "Services built successfully"
}

# Deploy services
deploy_services() {
    log_info "Deploying services..."

    cd "$PROJECT_ROOT"

    if [[ "$SERVICE" == "all" ]]; then
        docker-compose up -d
    else
        docker-compose up -d "$SERVICE"
    fi

    log_success "Services deployed successfully"
}

# Health check
health_check() {
    log_info "Performing health checks..."

    cd "$PROJECT_ROOT"

    # Wait for services to be healthy
    log_info "Waiting for services to start..."
    sleep 30

    # Check backend health
    if curl -f http://localhost:8000/api/v1/health > /dev/null 2>&1; then
        log_success "Backend is healthy"
    else
        log_error "Backend health check failed"
        exit 1
    fi

    # Check frontend health (if running)
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log_success "Frontend is healthy"
    else
        log_warning "Frontend health check failed (might not be running)"
    fi

    # Check dashboard health (if running)
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        log_success "Dashboard is healthy"
    else
        log_warning "Dashboard health check failed (might not be running)"
    fi

    log_success "Health checks completed"
}

# Backup database (for production)
backup_database() {
    if [[ "$ENVIRONMENT" == "production" ]]; then
        log_info "Creating database backup..."

        cd "$PROJECT_ROOT"

        # Create backup directory
        mkdir -p backups

        # Backup database
        BACKUP_FILE="backups/$(date +%Y%m%d_%H%M%S)_backup.sql"

        docker-compose exec -T postgres pg_dump -U postgres atl > "$BACKUP_FILE"

        if [[ $? -eq 0 ]]; then
            log_success "Database backup created: $BACKUP_FILE"
        else
            log_error "Database backup failed"
            exit 1
        fi
    fi
}

# Main deployment function
main() {
    log_info "Starting deployment of Audio Tài Lộc"
    log_info "Environment: $ENVIRONMENT"
    log_info "Service: $SERVICE"

    check_prerequisites
    setup_environment
    backup_database
    build_services
    deploy_services
    health_check

    log_success "🎉 Deployment completed successfully!"
    log_info ""
    log_info "Service URLs:"
    log_info "  - Backend API: http://localhost:8000"
    log_info "  - Frontend: http://localhost:3000"
    log_info "  - Dashboard: http://localhost:3001"
    log_info "  - API Documentation: http://localhost:8000/docs"
    log_info ""
    log_info "To view logs: docker-compose logs -f"
    log_info "To stop services: docker-compose down"
}

# Handle command line arguments
case "${2:-}" in
    "backend"|"frontend"|"dashboard"|"postgres"|"redis"|"prometheus"|"grafana"|"node-exporter")
        SERVICE="$2"
        ;;
    "all"|*)
        SERVICE="all"
        ;;
esac

# Run main function
main "$@"