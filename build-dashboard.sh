#!/bin/bash

# Dashboard Build & Optimization Script

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Dashboard Build & Optimization${NC}"
echo "=========================================="
echo ""

cd dashboard

# 1. Clean previous builds
echo -e "${YELLOW}1. Cleaning previous builds...${NC}"
rm -rf .next node_modules/.cache
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

# 2. Install dependencies
echo -e "${YELLOW}2. Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi
echo ""

# 3. Lint check
echo -e "${YELLOW}3. Running lint check...${NC}"
npm run lint || echo -e "${YELLOW}⚠ Lint warnings found (non-blocking)${NC}"
echo ""

# 4. Build for production
echo -e "${YELLOW}4. Building for production...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# 5. Analyze bundle size
echo -e "${YELLOW}5. Analyzing bundle...${NC}"
if [ -d ".next" ]; then
    echo "Build output:"
    du -sh .next
    echo ""
    echo "Pages:"
    du -sh .next/server/pages/* 2>/dev/null || echo "No pages found"
    echo ""
    echo "Static files:"
    du -sh .next/static/* 2>/dev/null || echo "No static files found"
fi
echo ""

# 6. Summary
echo "=========================================="
echo -e "${GREEN}✅ Build & Optimization Complete${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Test production build: npm start"
echo "2. Run Lighthouse audit"
echo "3. Deploy to production"
echo ""
