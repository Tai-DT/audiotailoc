#!/bin/bash

# Dashboard Optimization Script
# Performs comprehensive optimization checks and builds

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}===================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the dashboard directory
if [ ! -f "package.json" ]; then
    print_error "Not in dashboard directory!"
    print_info "Please run this script from the dashboard directory"
    exit 1
fi

print_header "🚀 Dashboard Optimization Script"

# Step 1: Check Node.js and npm versions
print_header "Step 1: Environment Check"
node_version=$(node -v)
npm_version=$(npm -v)
print_info "Node.js: $node_version"
print_info "npm: $npm_version"

# Check if node version is >= 18
node_major=$(echo $node_version | cut -d'.' -f1 | tr -d 'v')
if [ "$node_major" -lt 18 ]; then
    print_warning "Node.js version should be >= 18.x. Current: $node_version"
else
    print_success "Node.js version OK"
fi

# Step 2: Install dependencies
print_header "Step 2: Dependencies Check"
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_info "Dependencies already installed"
    read -p "Update dependencies? (y/N): " update_deps
    if [ "$update_deps" = "y" ] || [ "$update_deps" = "Y" ]; then
        print_info "Updating dependencies..."
        npm install
        print_success "Dependencies updated"
    fi
fi

# Step 3: Clean build artifacts
print_header "Step 3: Clean Build Artifacts"
if [ -d ".next" ]; then
    print_info "Removing .next directory..."
    rm -rf .next
    print_success "Build artifacts cleaned"
else
    print_info "No build artifacts to clean"
fi

# Step 4: TypeScript type checking
print_header "Step 4: TypeScript Type Check"
print_info "Running type check..."
if npx tsc --noEmit; then
    print_success "Type check passed"
else
    print_error "Type check failed"
    read -p "Continue anyway? (y/N): " continue_check
    if [ "$continue_check" != "y" ] && [ "$continue_check" != "Y" ]; then
        exit 1
    fi
fi

# Step 5: ESLint
print_header "Step 5: ESLint Check"
print_info "Running linter..."
if npm run lint -- --fix; then
    print_success "Linting passed"
else
    print_warning "Linting had issues (auto-fixed where possible)"
fi

# Step 6: Build production
print_header "Step 6: Production Build"
print_info "Building for production..."
BUILD_START=$(date +%s)

if NODE_ENV=production npm run build; then
    BUILD_END=$(date +%s)
    BUILD_TIME=$((BUILD_END - BUILD_START))
    print_success "Production build completed in ${BUILD_TIME}s"
else
    print_error "Build failed"
    exit 1
fi

# Step 7: Analyze bundle size
print_header "Step 7: Bundle Analysis"
print_info "Analyzing bundle size..."

# Extract bundle size from build output
if [ -d ".next" ]; then
    # Get First Load JS sizes
    echo ""
    echo "📊 Bundle Size Report:"
    echo "====================="
    
    # List all pages and their sizes
    find .next -name "*.js" -type f | while read file; do
        size=$(du -h "$file" | cut -f1)
        echo "$size - $file"
    done | sort -rh | head -20
    
    print_success "Bundle analysis complete"
else
    print_error "Build directory not found"
fi

# Step 8: Check for large dependencies
print_header "Step 8: Large Dependencies Check"
print_info "Checking for large node_modules..."
if command -v du &> /dev/null; then
    echo ""
    echo "Top 10 largest dependencies:"
    du -sh node_modules/* | sort -rh | head -10
    print_success "Dependency check complete"
fi

# Step 9: Performance recommendations
print_header "Step 9: Performance Recommendations"
echo ""
echo "📈 Optimization Checklist:"
echo "========================="
echo ""
echo "✅ Completed Checks:"
echo "  - TypeScript compilation"
echo "  - ESLint validation"
echo "  - Production build"
echo "  - Bundle size analysis"
echo ""
echo "📝 Next Steps:"
echo "  1. Run Lighthouse in Chrome DevTools"
echo "     - Open http://localhost:3001"
echo "     - F12 > Lighthouse tab"
echo "     - Generate report"
echo ""
echo "  2. Test performance on 3G network"
echo "     - Chrome DevTools > Network tab"
echo "     - Throttle to 'Slow 3G'"
echo "     - Measure load times"
echo ""
echo "  3. Check for console errors"
echo "     - Browse all pages"
echo "     - Check Console tab"
echo "     - Fix any errors"
echo ""
echo "  4. Verify images load correctly"
echo "     - Check Products page"
echo "     - Verify Cloudinary optimization"
echo ""
echo "🎯 Performance Targets:"
echo "  - Lighthouse Score: >90"
echo "  - First Contentful Paint: <2s"
echo "  - Time to Interactive: <3.5s"
echo "  - Total Bundle Size: <2MB"
echo ""

# Step 10: Optional - Install bundle analyzer
print_header "Step 10: Bundle Analyzer (Optional)"
read -p "Install @next/bundle-analyzer? (y/N): " install_analyzer
if [ "$install_analyzer" = "y" ] || [ "$install_analyzer" = "Y" ]; then
    print_info "Installing bundle analyzer..."
    npm install --save-dev @next/bundle-analyzer
    print_success "Bundle analyzer installed"
    print_info "To use it, add to next.config.ts:"
    echo ""
    echo "const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})"
    echo ""
    echo "Then run: ANALYZE=true npm run build"
fi

# Final summary
print_header "✅ Optimization Complete!"
echo ""
echo "📊 Summary:"
echo "==========="
echo "- TypeScript: ✅ Checked"
echo "- ESLint: ✅ Checked"
echo "- Build: ✅ Success"
echo "- Bundle: ✅ Analyzed"
echo ""
echo "🚀 Next: Start the production server"
echo "   npm start"
echo ""
echo "📚 Documentation: See OPTIMIZATION_GUIDE.md"
echo ""

# Ask if user wants to start the production server
read -p "Start production server now? (y/N): " start_server
if [ "$start_server" = "y" ] || [ "$start_server" = "Y" ]; then
    print_info "Starting production server..."
    npm start
fi

exit 0
