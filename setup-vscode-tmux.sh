#!/bin/bash

# Audio Tài Lộc Development Environment Setup
# This script sets up the development environment using Zellij

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
DASHBOARD_DIR="$PROJECT_ROOT/dashboard"

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

# Check if Zellij is installed
check_zellij() {
    if ! command -v zellij &> /dev/null; then
        print_error "Zellij is not installed. Please install it first:"
        echo "  brew install zellij"
        exit 1
    fi
    print_success "Zellij is installed: $(zellij --version)"
}

# Check if directories exist
check_directories() {
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "Backend directory not found: $BACKEND_DIR"
        exit 1
    fi

    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi

    if [ ! -d "$DASHBOARD_DIR" ]; then
        print_error "Dashboard directory not found: $DASHBOARD_DIR"
        exit 1
    fi

    print_success "All project directories found"
}

# Start development environment
start_dev() {
    print_status "Starting Audio Tài Lộc development environment..."

    # Change to project root
    cd "$PROJECT_ROOT"

    # Start Zellij with the dev layout
    print_status "Starting Zellij with development layout..."
    zellij --layout dev

    print_success "Development environment started!"
    print_status "Use Ctrl+g to enter locked mode, then:"
    print_status "  Ctrl+p: Pane mode, Ctrl+n: Tab mode"
    print_status "  h/j/k/l: Navigate panes"
    print_status "  n: New pane, x: Close pane"
}

# Stop development environment
stop_dev() {
    print_status "Stopping development environment..."

    # Kill any running processes
    pkill -f "yarn dev" || true
    pkill -f "npm run dev" || true
    pkill -f "next dev" || true

    print_success "Development environment stopped"
}

# Show help
show_help() {
    echo "Audio Tài Lộc Development Environment Setup"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start    Start the development environment with Zellij"
    echo "  stop     Stop all development processes"
    echo "  check    Check if all requirements are met"
    echo "  help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start    # Start development environment"
    echo "  $0 stop     # Stop all processes"
    echo "  $0 check    # Verify setup"
}

# Main script logic
case "${1:-start}" in
    "start")
        check_zellij
        check_directories
        start_dev
        ;;
    "stop")
        stop_dev
        ;;
    "check")
        check_zellij
        check_directories
        print_success "All checks passed!"
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