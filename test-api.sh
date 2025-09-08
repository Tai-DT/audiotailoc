#!/bin/bash

echo "🔍 Testing Audio Tài Lộc API Endpoints..."
echo "=========================================="

BASE_URL="http://localhost:3010/api/v1"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2

    echo -n "Testing $description: "
    response=$(curl -s -w "%{http_code}" "$BASE_URL$endpoint" 2>/dev/null)
    http_code=$(echo "$response" | tail -c 3)
    body=$(echo "$response" | head -n -1)

    if [[ "$http_code" == "200" ]]; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
        # Show brief response info
        if [[ "$body" == *"success":true* ]]; then
            data_count=$(echo "$body" | grep -o '"data":\[[^]]*\]' | wc -c)
            if [[ $data_count -gt 10 ]]; then
                echo "  📊 Data retrieved successfully"
            fi
        fi
    elif [[ "$http_code" == "404" ]]; then
        echo -e "${RED}❌ NOT FOUND${NC}"
    else
        echo -e "${YELLOW}⚠️  HTTP $http_code${NC}"
    fi
}

echo ""
echo "📋 Core Services Endpoints:"
echo "---------------------------"
test_endpoint "/services" "Services List"
test_endpoint "/services/categories" "Service Categories"
test_endpoint "/services/types" "Service Types"

echo ""
echo "🏪 Product Endpoints:"
echo "--------------------"
test_endpoint "/products" "Products List"
test_endpoint "/products/categories" "Product Categories"

echo ""
echo "👥 User Management:"
echo "------------------"
test_endpoint "/users" "Users List"

echo ""
echo "📊 Dashboard Analytics:"
echo "----------------------"
test_endpoint "/dashboard/stats" "Dashboard Stats"

echo ""
echo "🔧 System Health:"
echo "----------------"
# Test server health
health_response=$(curl -s -w "%{http_code}" "$BASE_URL/health" 2>/dev/null)
health_code=$(echo "$health_response" | tail -c 3)

if [[ "$health_code" == "200" ]]; then
    echo -e "Server Health: ${GREEN}✅ HEALTHY${NC}"
else
    echo -e "Server Health: ${YELLOW}⚠️  CHECK NEEDED${NC}"
fi

echo ""
echo "🎯 API Test Summary:"
echo "==================="
echo "✅ All endpoints should return HTTP 200 with success:true"
echo "✅ Services API: $(curl -s "$BASE_URL/services" | grep -o '"total":[0-9]*' | cut -d':' -f2) services found"
echo "✅ Categories API: $(curl -s "$BASE_URL/services/categories" | grep -o '"value"' | wc -l) categories found"
echo "✅ Types API: $(curl -s "$BASE_URL/services/types" | grep -o '"value"' | wc -l) types found"
echo ""
echo "🚀 API Testing Complete!"
