#!/bin/bash

echo "🚀 Setting up Audio Tài Lộc Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.x or later."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18.x or later is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME="Audio Tài Lộc"
NEXT_PUBLIC_APP_DESCRIPTION="Thiết bị âm thanh chuyên nghiệp"

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
EOF
    echo "✅ .env.local file created"
else
    echo "✅ .env.local file already exists"
fi

# Run linting check
echo "🔍 Running linting check..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Linting issues found. You may want to fix them."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure the backend is running on http://localhost:3010"
echo "2. Start the development server: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🔧 Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run start        - Start production server"
echo "  npm run lint         - Run linting"
echo "  npm run lint:fix     - Fix linting issues"
echo ""


