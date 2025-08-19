#!/bin/bash

# Audio Tài Lộc - Development Setup Script
# This script sets up the development environment

set -e

echo "🎵 Setting up Audio Tài Lộc development environment..."

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
    
    # Check pnpm
    if ! command -v pnpm &> /dev/null; then
        print_warning "pnpm is not installed. Installing pnpm..."
        npm install -g pnpm@9.7.0
    fi
    
    print_success "pnpm version: $(pnpm --version)"
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git"
        exit 1
    fi
    
    print_success "Git version: $(git --version)"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    pnpm install
    print_success "Dependencies installed successfully"
}

# Setup environment files
setup_env_files() {
    print_status "Setting up environment files..."
    
    # Backend .env
    if [ ! -f "apps/backend/.env" ]; then
        cat > apps/backend/.env << EOF
# Database Configuration
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="dev-jwt-secret-change-in-production"
JWT_REFRESH_SECRET="dev-refresh-secret-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Admin Configuration
ADMIN_EMAILS="admin@example.com"

# Server Configuration
PORT=3010
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
EOF
        print_success "Created apps/backend/.env"
    else
        print_warning "apps/backend/.env already exists"
    fi
    
    # Dashboard .env.local
    if [ ! -f "apps/dashboard/.env.local" ]; then
        cat > apps/dashboard/.env.local << EOF
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3010

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET="dev-nextauth-secret-change-in-production"

# Development
NODE_ENV=development
EOF
        print_success "Created apps/dashboard/.env.local"
    else
        print_warning "apps/dashboard/.env.local already exists"
    fi
    
    # Frontend .env.local
    if [ ! -f "apps/frontend/.env.local" ]; then
        cat > apps/frontend/.env.local << EOF
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3010

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="dev-nextauth-secret-change-in-production"

# Development
NODE_ENV=development
EOF
        print_success "Created apps/frontend/.env.local"
    else
        print_warning "apps/frontend/.env.local already exists"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Build packages first
    pnpm --filter @audiotailoc/types build
    pnpm --filter @audiotailoc/utils build
    
    # Generate Prisma client
    pnpm --filter @audiotailoc/backend prisma:generate
    
    # Run migrations
    pnpm --filter @audiotailoc/backend prisma:migrate:dev
    
    # Seed database
    pnpm --filter @audiotailoc/backend seed
    
    print_success "Database setup completed"
}

# Setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    # Install Husky
    pnpm prepare
    
    print_success "Git hooks setup completed"
}

# Build packages
build_packages() {
    print_status "Building shared packages..."
    
    pnpm --filter @audiotailoc/types build
    pnpm --filter @audiotailoc/utils build
    
    print_success "Packages built successfully"
}

# Show next steps
show_next_steps() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start the development servers:"
    echo "   pnpm dev"
    echo ""
    echo "2. Or start individual services:"
    echo "   pnpm backend:dev      # Backend API (port 3010)"
    echo "   pnpm dashboard:dev    # Admin Dashboard (port 3001)"
    echo "   pnpm frontend:dev     # Storefront (port 3000)"
    echo ""
    echo "3. Access the applications:"
    echo "   Storefront: http://localhost:3000"
    echo "   Dashboard:  http://localhost:3001"
    echo "   API Docs:   http://localhost:3010/docs"
    echo "   Health:     http://localhost:3010/api/v1/health"
    echo ""
    echo "4. Run tests:"
    echo "   pnpm test"
    echo ""
    echo "5. Run linting:"
    echo "   pnpm lint"
    echo ""
    echo "Happy coding! 🎵✨"
}

# Main execution
main() {
    echo "🎵 Audio Tài Lộc - Development Setup"
    echo "====================================="
    echo ""
    
    check_requirements
    install_dependencies
    setup_env_files
    setup_database
    setup_git_hooks
    build_packages
    show_next_steps
}

# Run main function
main "$@"
