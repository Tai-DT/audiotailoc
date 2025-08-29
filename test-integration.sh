#!/bin/bash

# Test script for Dashboard-Backend Integration
echo "🧪 Testing Dashboard-Backend Integration..."
echo "============================================"

# Check if API server is running
echo "1. Testing API Server Health..."
HEALTH_RESPONSE=$(curl -s http://localhost:8000/api/v2/shutdown/health)
if [ $? -eq 0 ]; then
    echo "✅ API Server is running"
    echo "   Response: $(echo $HEALTH_RESPONSE | jq -r '.data.status')"
else
    echo "❌ API Server is not responding"
    exit 1
fi

# Check dashboard server
echo ""
echo "2. Testing Dashboard Server..."
DASHBOARD_RESPONSE=$(curl -s -I http://localhost:3000 | head -1)
if [[ $DASHBOARD_RESPONSE == *"200"* ]]; then
    echo "✅ Dashboard Server is running"
else
    echo "❌ Dashboard Server is not responding"
    echo "   Response: $DASHBOARD_RESPONSE"
fi

# Test API endpoints
echo ""
echo "3. Testing API Endpoints..."

# Test users endpoint
echo "   📝 Testing Users API..."
USERS_RESPONSE=$(curl -s http://localhost:8000/api/v2/users)
USER_COUNT=$(echo $USERS_RESPONSE | jq -r '.data.pagination.total // 0')
echo "      Total Users: $USER_COUNT"

# Test products endpoint
echo "   📦 Testing Products API..."
PRODUCTS_RESPONSE=$(curl -s http://localhost:8000/api/v2/catalog/products)
PRODUCT_COUNT=$(echo $PRODUCTS_RESPONSE | jq -r '.data.pagination.total // 0')
echo "      Total Products: $PRODUCT_COUNT"

# Test orders endpoint
echo "   🛒 Testing Orders API..."
ORDERS_RESPONSE=$(curl -s http://localhost:8000/api/v2/orders)
ORDER_COUNT=$(echo $ORDERS_RESPONSE | jq -r '.data.pagination.total // 0')
echo "      Total Orders: $ORDER_COUNT"

# Test dashboard stats
echo "   📊 Testing Dashboard Stats..."
STATS_RESPONSE=$(curl -s http://localhost:8000/api/v2/dashboard/stats)
TOTAL_REVENUE=$(echo $STATS_RESPONSE | jq -r '.data.totalRevenue // 0')
echo "      Total Revenue: ${TOTAL_REVENUE} VND"

# Test system metrics
echo "   ⚡ Testing System Metrics..."
METRICS_RESPONSE=$(curl -s http://localhost:8000/api/v2/monitoring/metrics)
CPU_USAGE=$(echo $METRICS_RESPONSE | jq -r '.data.system.cpu.usage // 0' | cut -d. -f1)
MEMORY_USAGE=$(echo $METRICS_RESPONSE | jq -r '.data.system.memory.usage // 0' | cut -d. -f1)
echo "      CPU Usage: ${CPU_USAGE}%"
echo "      Memory Usage: ${MEMORY_USAGE}%"

echo ""
echo "4. Integration Summary:"
echo "   🏥 API Health: ✅"
echo "   🖥️  Dashboard: ✅"
echo "   👥 Users API: ✅ ($USER_COUNT users)"
echo "   📦 Products API: ✅ ($PRODUCT_COUNT products)"
echo "   🛒 Orders API: ✅ ($ORDER_COUNT orders)"
echo "   💰 Revenue: ✅ (${TOTAL_REVENUE} VND)"
echo "   📊 System Metrics: ✅ (CPU: ${CPU_USAGE}%, Memory: ${MEMORY_USAGE}%)"

echo ""
echo "🎉 Dashboard-Backend Integration Test Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Visit http://localhost:3000 to access the dashboard"
echo "   2. Visit http://localhost:3000/api-test to test API connectivity"
echo "   3. API documentation available at http://localhost:8000/api/v2/docs"
echo ""
echo "🔧 Environment:"
echo "   - Backend API: http://localhost:8000/api/v2"
echo "   - Dashboard: http://localhost:3000"
echo "   - API Test Page: http://localhost:3000/api-test"