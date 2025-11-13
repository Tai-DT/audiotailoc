#!/bin/bash

# ==========================================================================
# 🔧 Test API with Admin Key
# ==========================================================================

API_URL="http://localhost:3010/api/v1"
ADMIN_KEY="dev-admin-key-2024"

echo "=================================================="
echo "🧪 Testing API Endpoints with Admin Key"
echo "=================================================="
echo ""

# Test Orders endpoint
echo "📦 Testing Orders endpoint..."
curl -s -H "X-Admin-Key: $ADMIN_KEY" \
     -H "Content-Type: application/json" \
     "$API_URL/orders?page=1&pageSize=10" | jq '.' || echo "❌ Orders endpoint failed"
echo ""

# Test Users endpoint
echo "👤 Testing Users endpoint..."
curl -s -H "X-Admin-Key: $ADMIN_KEY" \
     -H "Content-Type: application/json" \
     "$API_URL/users?page=1&limit=10" | jq '.' || echo "❌ Users endpoint failed"
echo ""

# Test Products endpoint
echo "📦 Testing Products endpoint..."
curl -s -H "X-Admin-Key: $ADMIN_KEY" \
     -H "Content-Type: application/json" \
     "$API_URL/products?page=1&limit=10" | jq '.' || echo "❌ Products endpoint failed"
echo ""

# Test Services endpoint
echo "🔧 Testing Services endpoint..."
curl -s -H "X-Admin-Key: $ADMIN_KEY" \
     -H "Content-Type: application/json" \
     "$API_URL/services?page=1&limit=10" | jq '.' || echo "❌ Services endpoint failed"
echo ""

echo "=================================================="
echo "✅ API Test Complete"
echo "=================================================="
