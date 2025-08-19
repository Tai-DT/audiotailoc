#!/bin/bash

# Audio Tài Lộc - Production Deployment Script
# This script builds and deploys the application to production

set -e

echo "🚀 Deploying Audio Tài Lộc to production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Configuration
ENVIRONMENT=${1:-production}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-""}
IMAGE_TAG=${IMAGE_TAG:-$(git rev-parse --short HEAD)}
COMPOSE_FILE="docker-compose.yml"

# Check if required tools are installed
check_requirements() {
    print_status "Checking deployment requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    
    print_success "All requirements met"
}

# Build Docker images
build_images() {
    print_status "Building Docker images..."
    
    # Build shared packages first
    pnpm --filter @audiotailoc/types build
    pnpm --filter @audiotailoc/utils build
    
    # Build backend
    docker build -t audiotailoc-backend:$IMAGE_TAG -f Dockerfile .
    
    # Build frontend
    docker build -t audiotailoc-frontend:$IMAGE_TAG -f apps/frontend/Dockerfile .
    
    # Build dashboard
    docker build -t audiotailoc-dashboard:$IMAGE_TAG -f apps/dashboard/Dockerfile .
    
    print_success "Docker images built successfully"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Run linting
    pnpm lint
    
    # Run type checking
    pnpm typecheck
    
    # Run tests
    pnpm test
    
    print_success "All tests passed"
}

# Deploy with Docker Compose
deploy() {
    print_status "Deploying to $ENVIRONMENT..."
    
    # Set environment variables
    export IMAGE_TAG=$IMAGE_TAG
    export NODE_ENV=production
    
    # Deploy using Docker Compose
    docker-compose -f $COMPOSE_FILE up -d --build
    
    print_success "Deployment completed"
}

# Health check
health_check() {
    print_status "Performing health checks..."
    
    # Wait for services to start
    sleep 30
    
    # Check backend health
    if curl -f http://localhost:3010/api/v1/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_error "Backend health check failed"
        exit 1
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend health check failed"
        exit 1
    fi
    
    # Check dashboard
    if curl -f http://localhost:3001 > /dev/null 2>&1; then
        print_success "Dashboard is healthy"
    else
        print_error "Dashboard health check failed"
        exit 1
    fi
    
    print_success "All services are healthy"
}

# Rollback function
rollback() {
    print_warning "Rolling back deployment..."
    
    # Stop current deployment
    docker-compose -f $COMPOSE_FILE down
    
    # Start previous version (if available)
    if [ -n "$PREVIOUS_TAG" ]; then
        export IMAGE_TAG=$PREVIOUS_TAG
        docker-compose -f $COMPOSE_FILE up -d
        print_success "Rolled back to $PREVIOUS_TAG"
    else
        print_error "No previous version available for rollback"
        exit 1
    fi
}

# Cleanup old images
cleanup() {
    print_status "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Remove old images (keep last 5)
    docker images audiotailoc-* --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}" | \
    tail -n +6 | \
    awk '{print $1}' | \
    xargs -r docker rmi
    
    print_success "Cleanup completed"
}

# Main deployment function
main() {
    echo "🎵 Audio Tài Lộc - Production Deployment"
    echo "========================================="
    echo "Environment: $ENVIRONMENT"
    echo "Image Tag: $IMAGE_TAG"
    echo "Docker Registry: $DOCKER_REGISTRY"
    echo ""
    
    # Store current tag for potential rollback
    PREVIOUS_TAG=$(docker-compose -f $COMPOSE_FILE ps -q backend 2>/dev/null | xargs -r docker inspect --format='{{.Config.Image}}' | cut -d: -f2 || echo "")
    
    check_requirements
    run_tests
    build_images
    deploy
    health_check
    cleanup
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "Services:"
    echo "  Frontend: http://localhost:3000"
    echo "  Dashboard: http://localhost:3001"
    echo "  API: http://localhost:3010"
    echo "  API Docs: http://localhost:3010/docs"
    echo "  Health: http://localhost:3010/api/v1/health"
    echo ""
    echo "To rollback: ./scripts/deploy.sh rollback"
}

# Handle rollback
if [ "$1" = "rollback" ]; then
    rollback
    exit 0
fi

# Run main function
main "$@"
