#!/bin/bash

# Dashboard Optimization Script
# Optimizes the Next.js dashboard for production

set -e

echo "🚀 Starting Dashboard Optimization..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from dashboard directory.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Cleaning build artifacts...${NC}"
rm -rf .next
rm -rf node_modules/.cache
echo -e "${GREEN}✅ Clean complete${NC}"
echo ""

echo -e "${YELLOW}Step 2: Analyzing dependencies...${NC}"
npm list --depth=0 | head -20
echo -e "${GREEN}✅ Dependencies listed${NC}"
echo ""

echo -e "${YELLOW}Step 3: Checking for unused dependencies...${NC}"
echo "Tip: Run 'npx depcheck' to find unused dependencies"
echo ""

echo -e "${YELLOW}Step 4: Type checking...${NC}"
if npx tsc --noEmit; then
    echo -e "${GREEN}✅ No TypeScript errors${NC}"
else
    echo -e "${RED}❌ TypeScript errors found. Please fix before deploying.${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 5: Linting...${NC}"
if npm run lint; then
    echo -e "${GREEN}✅ No lint errors${NC}"
else
    echo -e "${YELLOW}⚠️  Lint warnings found. Consider fixing.${NC}"
fi
echo ""

echo -e "${YELLOW}Step 6: Building for production...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 7: Analyzing bundle size...${NC}"
if [ -d ".next" ]; then
    echo "Build output:"
    du -sh .next
    echo ""
    echo "Static files:"
    du -sh .next/static 2>/dev/null || echo "No static files"
    echo ""
    echo "Cache:"
    du -sh .next/cache 2>/dev/null || echo "No cache"
fi
echo -e "${GREEN}✅ Analysis complete${NC}"
echo ""

echo -e "${GREEN}🎉 Optimization complete!${NC}"
echo ""
echo "📊 Recommendations:"
echo "1. ✅ TypeScript errors fixed"
echo "2. ✅ Build successful"
echo "3. ⚡ Consider lazy loading heavy components"
echo "4. 🖼️  Use Next.js Image component for all images"
echo "5. 📦 Remove unused dependencies"
echo "6. 🔧 Enable code splitting for large pages"
echo ""
echo "Next steps:"
echo "• Run 'npm start' to test production build"
echo "• Run 'npx @next/bundle-analyzer' for detailed bundle analysis"
echo "• Deploy to production"
echo ""
