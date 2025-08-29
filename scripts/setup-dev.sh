#!/bin/bash

# Audio Tài Lộc Development Environment Setup Script
# This script sets up the complete development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

log_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Check system requirements
check_requirements() {
    log_step "Checking system requirements..."

    # Check if running on supported OS
    if [[ "$OSTYPE" != "linux-gnu"* && "$OSTYPE" != "darwin"* ]]; then
        log_error "This script is designed for Linux or macOS"
        exit 1
    fi

    # Check for required commands
    local required_commands=("curl" "git" "docker" "docker-compose")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            log_error "Required command '$cmd' is not installed"
            case $cmd in
                "docker")
                    log_info "Install Docker: https://docs.docker.com/get-docker/"
                    ;;
                "docker-compose")
                    log_info "Install Docker Compose: https://docs.docker.com/compose/install/"
                    ;;
                *)
                    log_info "Please install '$cmd' and try again"
                    ;;
            esac
            exit 1
        fi
    done

    log_success "System requirements check passed"
}

# Setup environment files
setup_environment() {
    log_step "Setting up environment files..."

    # Copy development environment file
    if [[ ! -f ".env" ]]; then
        if [[ -f ".env.development" ]]; then
            cp .env.development .env
            log_success "Created .env from .env.development"
        else
            log_warning "No .env.development file found. Please create environment file manually."
        fi
    else
        log_info ".env file already exists"
    fi

    # Create local environment files for frontend and dashboard
    if [[ -d "frontend" && ! -f "frontend/.env.local" ]]; then
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_REALTIME_CHAT=true
EOF
        log_success "Created frontend/.env.local"
    fi

    if [[ -d "dashboard" && ! -f "dashboard/.env.local" ]]; then
        cat > dashboard/.env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3001
EOF
        log_success "Created dashboard/.env.local"
    fi
}

# Setup Docker services
setup_docker() {
    log_step "Setting up Docker services..."

    # Start Docker services
    log_info "Starting Docker services..."
    docker-compose up -d postgres redis meilisearch

    # Wait for services to be ready
    log_info "Waiting for PostgreSQL to be ready..."
    local max_attempts=30
    local attempt=1

    while [[ $attempt -le $max_attempts ]]; do
        if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
            log_success "PostgreSQL is ready"
            break
        fi
        log_info "Waiting for PostgreSQL... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done

    if [[ $attempt -gt $max_attempts ]]; then
        log_error "PostgreSQL failed to start within expected time"
        exit 1
    fi

    # Setup database
    if [[ -d "backend" ]]; then
        log_info "Setting up backend database..."

        cd backend

        # Install dependencies if needed
        if [[ ! -d "node_modules" ]]; then
            log_info "Installing backend dependencies..."
            npm install
        fi

        # Generate Prisma client
        log_info "Generating Prisma client..."
        npx prisma generate

        # Push database schema
        log_info "Setting up database schema..."
        npx prisma db push

        # Seed database
        log_info "Seeding database..."
        npm run seed

        cd ..
        log_success "Backend database setup completed"
    fi
}

# Setup monitoring (optional)
setup_monitoring() {
    log_step "Setting up monitoring stack (optional)..."

    read -p "Do you want to setup monitoring stack? (y/N): " setup_monitoring
    if [[ $setup_monitoring =~ ^[Yy]$ ]]; then
        log_info "Starting monitoring services..."
        docker-compose up -d prometheus grafana node-exporter

        log_success "Monitoring stack started"
        log_info "Grafana: http://localhost:3002 (admin/admin)"
        log_info "Prometheus: http://localhost:9090"
    else
        log_info "Skipping monitoring setup"
    fi
}

# Setup development scripts
setup_scripts() {
    log_step "Setting up development scripts..."

    # Make scripts executable
    chmod +x scripts/*.sh 2>/dev/null || true

    log_success "Development scripts setup completed"
}

# Install dependencies
install_dependencies() {
    log_step "Installing project dependencies..."

    # Backend dependencies
    if [[ -d "backend" && -f "backend/package.json" ]]; then
        log_info "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
    fi

    # Frontend dependencies
    if [[ -d "frontend" && -f "frontend/package.json" ]]; then
        log_info "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
    fi

    # Dashboard dependencies
    if [[ -d "dashboard" && -f "dashboard/package.json" ]]; then
        log_info "Installing dashboard dependencies..."
        cd dashboard
        npm install
        cd ..
    fi

    log_success "All dependencies installed"
}

# Final setup instructions
print_instructions() {
    echo
    log_success "🎉 Development environment setup completed!"
    echo
    echo -e "${CYAN}🚀 Next steps:${NC}"
    echo
    echo "1. Start the development servers:"
    echo -e "   ${GREEN}./scripts/deploy.sh development${NC}"
    echo
    echo "2. Or start services individually:"
    echo -e "   ${GREEN}cd backend && npm run start:dev${NC}    # API Server (Port 8000)"
    echo -e "   ${GREEN}cd frontend && npm run dev${NC}         # Frontend (Port 3000)"
    echo -e "   ${GREEN}cd dashboard && npm run dev${NC}        # Dashboard (Port 3001)"
    echo
    echo "3. Access your application:"
    echo -e "   ${BLUE}Frontend:${NC}      http://localhost:3000"
    echo -e "   ${BLUE}Dashboard:${NC}     http://localhost:3001"
    echo -e "   ${BLUE}API Docs:${NC}      http://localhost:8000/docs"
    echo -e "   ${BLUE}API Health:${NC}    http://localhost:8000/api/v1/health"
    echo
    if [[ -f "monitoring/prometheus.yml" ]]; then
        echo "4. Monitoring (if enabled):"
        echo -e "   ${BLUE}Grafana:${NC}       http://localhost:3002 (admin/admin)"
        echo -e "   ${BLUE}Prometheus:${NC}    http://localhost:9090"
        echo
    fi
    echo -e "${YELLOW}📚 Documentation:${NC}"
    echo "   - Main README: README.md"
    echo "   - Workflow Guide: README_WORKFLOW.md"
    echo "   - API Documentation: http://localhost:8000/docs"
    echo
    echo -e "${GREEN}Happy coding! 🎵${NC}"
}

# Main setup function
main() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              🎵 AUDIO TÀI LỘC - DEV SETUP 🎵                 ║"
    echo "║              Modern Development Environment                  ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    log_info "Starting Audio Tài Lộc development environment setup..."
    echo

    check_requirements
    setup_environment
    install_dependencies
    setup_docker
    setup_scripts
    setup_monitoring

    print_instructions
}

# Run main function
main "$@"