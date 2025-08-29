#!/bin/bash

# ==========================================================================
# 🔧 Database Migration Script for Audio Tài Lộc
# ==========================================================================
# This script handles database migrations for the Audio Tài Lộc project
# Usage: ./scripts/migrate-database.sh [command] [environment]
# Commands: migrate, push, reset, seed
# Environment: development, staging, production (default: development)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMMAND=${1:-"migrate"}
ENVIRONMENT=${2:-"development"}
BACKEND_DIR="./backend"

# Function to print colored output
print_info() {
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi

    if ! command_exists npx; then
        print_error "npx is not installed. Please install npx first."
        exit 1
    fi

    print_success "Prerequisites check passed!"
}

# Setup environment
setup_environment() {
    print_info "Setting up environment: $ENVIRONMENT"

    cd "$BACKEND_DIR"

    # Copy environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f ".env.$ENVIRONMENT" ]; then
            cp ".env.$ENVIRONMENT" ".env"
            print_success "Environment file copied from .env.$ENVIRONMENT"
        else
            print_error "Environment file .env.$ENVIRONMENT not found!"
            exit 1
        fi
    fi

    print_success "Environment setup completed!"
}

# Generate Prisma client
generate_client() {
    print_info "Generating Prisma client..."

    cd "$BACKEND_DIR"

    npx prisma generate

    print_success "Prisma client generated successfully!"
}

# Run migration
run_migrate() {
    print_info "Running database migration..."

    cd "$BACKEND_DIR"

    if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "staging" ]; then
        print_warning "Running migration in $ENVIRONMENT environment"
        npx prisma migrate deploy
    else
        # For development, create and apply migration
        npx prisma migrate dev --name update-schema
    fi

    print_success "Database migration completed!"
}

# Push schema
run_push() {
    print_info "Pushing schema to database..."

    cd "$BACKEND_DIR"

    if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "staging" ]; then
        print_warning "This will reset the database in $ENVIRONMENT environment!"
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Operation cancelled."
            exit 0
        fi
    fi

    npx prisma db push --force-reset

    print_success "Schema pushed to database successfully!"
}

# Reset database
run_reset() {
    print_info "Resetting database..."

    cd "$BACKEND_DIR"

    if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "staging" ]; then
        print_error "Reset is not allowed in $ENVIRONMENT environment!"
        exit 1
    fi

    npx prisma migrate reset --force

    print_success "Database reset completed!"
}

# Seed database
run_seed() {
    print_info "Seeding database..."

    cd "$BACKEND_DIR"

    if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "staging" ]; then
        print_warning "Seeding in $ENVIRONMENT environment"
    fi

    npm run seed

    print_success "Database seeded successfully!"
}

# Test connection
test_connection() {
    print_info "Testing database connection..."

    cd "$BACKEND_DIR"

    node ../scripts/test-database-connection.js

    print_success "Database connection test passed!"
}

# Show usage
show_usage() {
    echo "Usage: $0 [command] [environment]"
    echo ""
    echo "Commands:"
    echo "  migrate    Run database migrations (default)"
    echo "  push       Push schema to database (with reset)"
    echo "  reset      Reset database (development only)"
    echo "  seed       Seed database with initial data"
    echo "  test       Test database connection"
    echo "  generate   Generate Prisma client only"
    echo ""
    echo "Environments:"
    echo "  development (default)"
    echo "  staging"
    echo "  production"
    echo ""
    echo "Examples:"
    echo "  $0 migrate production    # Run migrations in production"
    echo "  $0 push development      # Push schema in development"
    echo "  $0 seed staging         # Seed database in staging"
    echo "  $0 test                  # Test database connection"
}

# Main function
main() {
    print_info "🚀 Audio Tài Lộc Database Migration Tool"
    print_info "Command: $COMMAND"
    print_info "Environment: $ENVIRONMENT"
    echo

    case $COMMAND in
        "migrate")
            check_prerequisites
            setup_environment
            generate_client
            run_migrate
            ;;
        "push")
            check_prerequisites
            setup_environment
            generate_client
            run_push
            ;;
        "reset")
            check_prerequisites
            setup_environment
            run_reset
            ;;
        "seed")
            check_prerequisites
            setup_environment
            run_seed
            ;;
        "test")
            check_prerequisites
            setup_environment
            test_connection
            ;;
        "generate")
            check_prerequisites
            setup_environment
            generate_client
            ;;
        "help"|"-h"|"--help")
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown command: $COMMAND"
            echo
            show_usage
            exit 1
            ;;
    esac

    echo
    print_success "🎉 Operation completed successfully!"
}

# Run main function
main "$@"