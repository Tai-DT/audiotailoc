#!/bin/bash

echo "🔧 Fixing all Prisma model name mismatches..."
cd "/Users/macbook/Desktop/audiotailoc/backend/src" || exit 1

# Create backup
echo "📦 Creating backup..."
tar -czf ../src-backup-$(date +%Y%m%d-%H%M%S).tar.gz . 2>/dev/null

# Fix all .prisma.WRONG -> .prisma.correct_ patterns
echo "🔄 Applying fixes..."

# Services module
find . -type f -name "*.service.ts" -exec sed -i '' \
  -e 's/\.prisma\.serviceItem/\.prisma\.service_items/g' \
  -e 's/\.prisma\.serviceType/\.prisma\.service_types/g' \
  -e 's/\.prisma\.serviceBooking/\.prisma\.service_bookings/g' \
  -e 's/\.prisma\.serviceBookingItem/\.prisma\.service_booking_items/g' \
  -e 's/tx\.serviceItem/tx\.service_items/g' \
  -e 's/tx\.serviceType/tx\.service_types/g' \
  -e 's/tx\.serviceBooking/tx\.service_bookings/g' \
  -e 's/tx\.serviceBookingItem/tx\.service_booking_items/g' \
  {} \;

# Site module
find . -type f -name "*.service.ts" -exec sed -i '' \
  -e 's/\.prisma\.banner/\.prisma\.banners/g' \
  -e 's/\.prisma\.systemConfig/\.prisma\.system_configs/g' \
  -e 's/tx\.banner/tx\.banners/g' \
  -e 's/tx\.systemConfig/tx\.system_configs/g' \
  -e 's/Prisma\.BannerOrderByWithRelationInput/Prisma.bannersOrderByWithRelationInput/g' \
  -e 's/Prisma\.BannerWhereInput/Prisma.bannersWhereInput/g' \
  {} \;

# Support module
find . -type f -name "*.service.ts" -exec sed -i '' \
  -e 's/\.prisma\.knowledgeBaseEntry/\.prisma\.knowledge_base_entries/g' \
  -e 's/tx\.knowledgeBaseEntry/tx\.knowledge_base_entries/g' \
  {} \;

# Technicians module
find . -type f -name "*.service.ts" -exec sed -i '' \
  -e 's/\.prisma\.technician\b/\.prisma\.technicians/g' \
  -e 's/tx\.technician\b/tx\.technicians/g' \
  -e 's/\.prisma\.technicianSchedule/\.prisma\.technician_schedules/g' \
  -e 's/tx\.technicianSchedule/tx\.technician_schedules/g' \
  {} \;

# Users module  
find . -type f -name "*.service.ts" -exec sed -i '' \
  -e 's/\.prisma\.user\b/\.prisma\.users/g' \
  -e 's/tx\.user\b/tx\.users/g' \
  -e 's/\.prisma\.order\b/\.prisma\.orders/g' \
  -e 's/\.prisma\.orderItem/\.prisma\.order_items/g' \
  -e 's/\.prisma\.cart\b/\.prisma\.carts/g' \
  -e 's/\.prisma\.cartItem/\.prisma\.cart_items/g' \
  {} \;

# Webhooks module
find . -type f -name "*.service.ts" -exec sed -i '' \
  -e 's/\.prisma\.paymentIntent/\.prisma\.payment_intents/g' \
  -e 's/\.prisma\.payment\b/\.prisma\.payments/g' \
  -e 's/\.prisma\.product\b/\.prisma\.products/g' \
  -e 's/\.prisma\.customerQuestion/\.prisma\.customer_questions/g' \
  {} \;

# Wishlist module
find . -type f -name "*.service.ts" -exec sed -i '' \
  -e 's/\.prisma\.wishlistItem/\.prisma\.wishlist_items/g' \
  {} \;

# Activity log service
find . -type f -name "activity-log.service.ts" -exec sed -i '' \
  -e 's/\.prisma\.activityLog/\.prisma\.activity_logs/g' \
  {} \;

echo "✅ All fixes applied!"
echo ""
echo "🧪 Testing build..."
cd /Users/macbook/Desktop/audiotailoc/backend
npm run build 2>&1 | grep -E "(Found [0-9]+ errors|error TS|Successfully compiled)"
