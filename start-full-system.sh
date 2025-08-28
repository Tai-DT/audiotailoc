#!/bin/bash

# 🎵 Audio Tài Lộc Full System Startup Script
# 🚀 Khởi động hoàn chỉnh hệ thống Audio Tài Lộc với dữ liệu thật

echo "🎵 Audio Tài Lộc - Full System Startup"
echo "======================================"
echo ""

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

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."

    # Setup dashboard environment
    if [ ! -f "dashboard/.env.local" ]; then
        cd dashboard
        cp env-config-updated.md .env.local
        print_success "Dashboard environment file created"
        cd ..
    else
        print_success "Dashboard environment file already exists"
    fi

    # Setup backend environment if needed
    if [ ! -f "backend/.env" ]; then
        print_warning "Backend .env file not found. Please create it manually."
    fi
}

# Start Docker services
start_docker_services() {
    print_status "Starting Docker services (Database, Redis, Meilisearch)..."

    docker-compose up -d postgres redis meilisearch

    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10

    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Docker services are running"
    else
        print_error "Failed to start Docker services"
        exit 1
    fi
}

# Start backend service
start_backend() {
    print_status "Starting Backend API server..."

    cd backend

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi

    # Wait for database to be ready
    print_status "Waiting for database connection..."
    sleep 5

    # Start backend in background
    npm run start:dev &
    BACKEND_PID=$!

    cd ..
    print_success "Backend server started (PID: $BACKEND_PID)"

    # Wait for backend to be ready
    print_status "Waiting for backend to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:8000/api/v1/health > /dev/null; then
            print_success "Backend is ready!"
            break
        fi
        sleep 2
    done

    if [ $i -eq 30 ]; then
        print_warning "Backend might not be ready yet. Continuing..."
    fi
}

# Start dashboard
start_dashboard() {
    print_status "Starting Dashboard..."

    cd dashboard

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing dashboard dependencies..."
        npm install
    fi

    # Start dashboard in background
    npm run dev &
    DASHBOARD_PID=$!

    cd ..
    print_success "Dashboard started (PID: $DASHBOARD_PID)"
}

# Display service information
show_services_info() {
    echo ""
    print_success "🎉 Audio Tài Lộc Full System is running!"
    echo ""
    echo "🌐 Service URLs:"
    echo "   📊 Dashboard:    http://localhost:3000"
    echo "   🔗 Backend API:  http://localhost:8000"
    echo "   📚 API Docs:     http://localhost:8000/docs"
    echo "   🗄️ Database:     localhost:5432"
    echo "   🔴 Redis:        localhost:6379"
    echo "   🔍 Meilisearch:  localhost:7700"
    echo ""
    echo "📋 To stop all services:"
    echo "   docker-compose down"
    echo "   kill $BACKEND_PID $DASHBOARD_PID 2>/dev/null"
    echo ""
    echo "🎵 Happy managing your Audio Tài Lộc store!"
}

# Main execution
main() {
    print_status "Starting Audio Tài Lộc Full System..."

    # Run checks
    check_docker
    check_nodejs

    # Setup environment
    setup_environment

    # Start services
    start_docker_services
    start_backend
    start_dashboard

    # Show information
    show_services_info

    # Keep script running to show PIDs
    echo ""
    print_status "Press Ctrl+C to stop all services"

    # Wait for user interrupt
    trap "echo ''; print_status 'Stopping services...'; docker-compose down; kill $BACKEND_PID $DASHBOARD_PID 2>/dev/null; exit" INT
    wait
}

# Run main function
main "$@"