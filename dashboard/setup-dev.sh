#!/bin/bash

# Audio Tài Lộc Dashboard Development Setup Script
echo "🎵 Audio Tài Lộc Dashboard - Development Setup"
echo "=============================================="

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_warning "Node.js version $NODE_VERSION detected. Node.js 18+ is recommended."
fi

print_status "Node.js version: $(node -v)"
print_status "NPM version: $(npm -v)"

# Install dependencies
print_status "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_status "Creating environment configuration..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v2
NEXT_PUBLIC_API_DOCS_URL=http://localhost:3001/docs/v2
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Authentication (if using JWT)
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Features
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_CHARTS=true
NEXT_PUBLIC_CHART_UPDATE_INTERVAL=5000

# Security
NEXT_PUBLIC_NODE_ENV=development

# API Keys (if needed)
GOOGLE_ANALYTICS_ID=
SENTRY_DSN=
EOF
    print_success "Environment file created: .env.local"
else
    print_warning "Environment file already exists: .env.local"
fi

# Check if backend is running
print_status "Checking backend connectivity..."
if curl -s http://localhost:3001/api/v2/health > /dev/null; then
    print_success "Backend is running and accessible"
else
    print_warning "Backend is not running on http://localhost:3001"
    print_warning "Please start the backend first:"
    echo "  cd ../backend"
    echo "  npm run start:dev"
fi

# Build the project
print_status "Building the project..."
if npm run build; then
    print_success "Project built successfully"
else
    print_error "Failed to build project"
    exit 1
fi

print_success "Dashboard setup completed!"
echo ""
echo "🚀 To start the dashboard:"
echo "   npm run dev"
echo ""
echo "📊 Dashboard will be available at:"
echo "   http://localhost:3000"
echo ""
echo "🔗 API Documentation:"
echo "   http://localhost:3000/api-docs"
echo ""
echo "⚙️  System Management:"
echo "   http://localhost:3000/system"
echo ""
echo "📈 Monitoring:"
echo "   http://localhost:3000/monitoring"
echo ""
echo "🎵 Happy coding with Audio Tài Lộc! 🎵"
