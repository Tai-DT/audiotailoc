#!/bin/bash

# ==========================================================================
# 🔧 Database Setup Script for Audio Tài Lộc
# ==========================================================================
# This script sets up the database for the Audio Tài Lộc project
# Usage: ./scripts/setup-database.sh [environment]
# Environment: development, staging, production (default: development)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment configuration
ENVIRONMENT=${1:-"development"}
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

    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
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

    # Install dependencies
    print_info "Installing backend dependencies..."
    npm install

    print_success "Environment setup completed!"
}

# Generate Prisma client
generate_prisma_client() {
    print_info "Generating Prisma client..."

    cd "$BACKEND_DIR"

    npx prisma generate

    print_success "Prisma client generated successfully!"
}

# Run database migration
run_migration() {
    print_info "Running database migration..."

    cd "$BACKEND_DIR"

    # For production/staging, use --create-only to avoid data loss
    if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "staging" ]; then
        print_warning "Running migration in $ENVIRONMENT environment"
        npx prisma migrate deploy
    else
        # For development, create and apply migration
        npx prisma migrate dev --name init
    fi

    print_success "Database migration completed!"
}

# Push schema to database
push_schema() {
    print_info "Pushing schema to database..."

    cd "$BACKEND_DIR"

    npx prisma db push --force-reset

    print_success "Schema pushed to database successfully!"
}

# Seed database
seed_database() {
    print_info "Seeding database..."

    cd "$BACKEND_DIR"

    if [ "$ENVIRONMENT" = "development" ]; then
        npm run seed
        print_success "Database seeded successfully!"
    else
        print_warning "Skipping database seeding for $ENVIRONMENT environment"
    fi
}

# Test database connection
test_connection() {
    print_info "Testing database connection..."

    cd "$BACKEND_DIR"

    # Simple connection test using Prisma
    npx prisma db execute --file <(echo "SELECT 1 as test;") > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        print_success "Database connection test passed!"
    else
        print_error "Database connection test failed!"
        exit 1
    fi
}

# Main function
main() {
    print_info "🚀 Starting Audio Tài Lộc Database Setup"
    print_info "Environment: $ENVIRONMENT"
    echo

    check_prerequisites
    setup_environment
    generate_prisma_client
    test_connection
    run_migration
    push_schema
    seed_database

    echo
    print_success "🎉 Database setup completed successfully!"
    print_info "You can now start the backend server with: npm run start:dev"
}

# Run main function
main "$@"