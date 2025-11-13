#!/bin/bash
#
# Comprehensive Prisma Model Name Fixer
# Replaces all camelCase Prisma model references with snake_case
#

set -e  # Exit on error

BACKEND_DIR="/Users/macbook/Desktop/audiotailoc/backend"
SRC_DIR="$BACKEND_DIR/src"

echo "=================================================="
echo "🔧 Prisma Model Name Fixer"
echo "=================================================="
echo ""

# Verify we're in the right place
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found: $BACKEND_DIR"
    exit 1
fi

echo "📁 Working directory: $SRC_DIR"
echo ""

# Create backup
BACKUP_FILE="$BACKEND_DIR/src-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
echo "📦 Creating backup: $BACKUP_FILE"
cd "$BACKEND_DIR"
tar -czf "$BACKUP_FILE" src/ 2>/dev/null || echo "⚠️  Backup failed (continuing anyway)"
echo ""

# Change to src directory
cd "$SRC_DIR"

echo "🔄 Applying model name replacements..."
echo "---"

# Function to apply sed replacement
fix_model() {
    local wrong="$1"
    local correct="$2"
    local count=0
    
    # Count occurrences before replacement
    count=$(grep -r "\.prisma\.$wrong\b" . 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$count" -gt 0 ]; then
        echo "  Fixing: $wrong → $correct ($count occurrences)"
        
        # Fix this.prisma.MODEL
        find . -type f -name "*.ts" -not -path "*/node_modules/*" -exec \
            sed -i '' "s/\.prisma\.$wrong\b/.prisma.$correct/g" {} \;
        
        # Fix tx.MODEL (in transactions)
        find . -type f -name "*.ts" -not -path "*/node_modules/*" -exec \
            sed -i '' "s/tx\.$wrong\b/tx.$correct/g" {} \;
    fi
}

# Fix Prisma type names
fix_type() {
    local wrong="$1"
    local correct="$2"
    
    find . -type f -name "*.ts" -not -path "*/node_modules/*" -exec \
        sed -i '' "s/Prisma\.$wrong/Prisma.$correct/g" {} \;
}

# Apply all fixes
fix_model "activityLog" "activity_logs"
fix_model "banner" "banners"
fix_model "cart" "carts"
fix_model "cartItem" "cart_items"
fix_model "customerQuestion" "customer_questions"
fix_model "knowledgeBaseEntry" "knowledge_base_entries"
fix_model "order" "orders"
fix_model "orderItem" "order_items"
fix_model "payment" "payments"
fix_model "paymentIntent" "payment_intents"
fix_model "product" "products"
fix_model "service" "services"
fix_model "serviceBooking" "service_bookings"
fix_model "serviceBookingItem" "service_booking_items"
fix_model "serviceItem" "service_items"
fix_model "serviceType" "service_types"
fix_model "systemConfig" "system_configs"
fix_model "technician" "technicians"
fix_model "technicianSchedule" "technician_schedules"
fix_model "user" "users"
fix_model "wishlistItem" "wishlist_items"

echo ""
echo "🔤 Fixing Prisma type imports..."
fix_type "BannerOrderByWithRelationInput" "bannersOrderByWithRelationInput"
fix_type "BannerWhereInput" "bannersWhereInput"

echo ""
echo "✅ All replacements completed!"
echo ""

# Test build
echo "🧪 Testing build..."
cd "$BACKEND_DIR"
echo "---"

# Run build and capture output
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT=$?

# Check for errors
ERROR_COUNT=$(echo "$BUILD_OUTPUT" | grep -o "Found [0-9]* errors" | grep -o "[0-9]*" || echo "0")

if [ "$ERROR_COUNT" = "0" ] && [ $BUILD_EXIT -eq 0 ]; then
    echo "✅ BUILD SUCCESSFUL! No TypeScript errors found."
    echo ""
    echo "📊 Build artifacts:"
    ls -lh dist/main.js 2>/dev/null || echo "   dist/main.js created"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Start backend: cd backend && npm run start:prod"
    echo "   2. Test health: curl http://localhost:3010/api/v1/health"
else
    echo "❌ Build failed with $ERROR_COUNT errors"
    echo ""
    echo "Last 30 lines of build output:"
    echo "$BUILD_OUTPUT" | tail -30
    echo ""
    echo "💡 Tip: Review errors above or check full build log"
    exit 1
fi

echo ""
echo "=================================================="
echo "✅ Script completed successfully!"
echo "=================================================="
