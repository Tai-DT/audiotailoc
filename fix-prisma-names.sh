#!/bin/bash

# Prisma Model Name Fixer
# Fixes snake_case to camelCase model references

echo "🔧 Fixing Prisma model names in backend services..."

cd "$(dirname "$0")/backend/src" || exit 1

# Define replacements (database_name -> CodeName)
declare -A replacements=(
    ["serviceItem"]="service_items"
    ["serviceType"]="service_types"
    ["\.service\."]="\.services\."
    ["\.banner\."]="\.banners\."
    ["BannerOrderByWithRelationInput"]="bannersOrderByWithRelationInput"
    ["BannerWhereInput"]="bannersWhereInput"
    ["\.systemConfig\."]="\.system_configs\."
    ["\.knowledgeBaseEntry\."]="\.knowledge_base_entries\."
    ["\.technician\."]="\.technicians\."
    ["\.serviceBooking\."]="\.service_bookings\."
    ["technicianSchedule"]="technician_schedules"
    ["\.serviceBookingItem\."]="\.service_booking_items\."
    ["\.user\."]="\.users\."
    ["\.order\."]="\.orders\."
    ["\.orderItem\."]="\.order_items\."
    ["\.cart\."]="\.carts\."
    ["\.cartItem\."]="\.cart_items\."
    ["\.paymentIntent\."]="\.payment_intents\."
    ["\.payment\."]="\.payments\."
    ["\.product\."]="\.products\."
    ["\.customerQuestion\."]="\.customer_questions\."
    ["\.wishlistItem\."]="\.wishlist_items\."
    ["\.activityLog\."]="\.activity_logs\."
)

# Find all TypeScript files and apply replacements
for pattern in "${!replacements[@]}"; do
    replacement="${replacements[$pattern]}"
    echo "  Replacing: $pattern -> $replacement"
    
    find . -type f -name "*.ts" -not -path "*/node_modules/*" -exec \
        sed -i '' "s/this\.prisma$pattern/this.prisma.${replacement}/g" {} \;
    
    find . -type f -name "*.ts" -not -path "*/node_modules/*" -exec \
        sed -i '' "s/tx$pattern/tx.${replacement}/g" {} \;
    
    # Fix Prisma type imports
    find . -type f -name "*.ts" -not -path "*/node_modules/*" -exec \
        sed -i '' "s/Prisma\.$pattern/Prisma.${replacement}/g" {} \;
done

echo "✅ Model names fixed!"
echo ""
echo "🔍 Verifying changes..."
cd ../..
npm run build --silent 2>&1 | tail -5
