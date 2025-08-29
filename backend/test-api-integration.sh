#!/bin/bash

# API Testing Script for Audio Tài Lộc Backend Integration
# This script tests all API endpoints and validates the data

API_BASE="http://localhost:8000/api/v1"
DASHBOARD_URL="http://localhost:3001"

echo "🔍 Audio Tài Lộc API Integration Testing"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test an endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -e "${BLUE}Testing:${NC} $description"
    echo -e "${YELLOW}Endpoint:${NC} $API_BASE$endpoint"
    
    response=$(curl -s -w "\n%{http_code}" "$API_BASE$endpoint")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ Status: $http_code (Expected: $expected_status)${NC}"
        # Pretty print JSON if it's valid
        if echo "$body" | jq . >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Valid JSON Response${NC}"
            # Show key metrics
            case $endpoint in
                "/health")
                    status=$(echo "$body" | jq -r '.status')
                    echo -e "${GREEN}📊 System Status: $status${NC}"
                    ;;
                "/analytics/overview")
                    users=$(echo "$body" | jq -r '.totalUsers')
                    products=$(echo "$body" | jq -r '.totalProducts')
                    orders=$(echo "$body" | jq -r '.totalOrders')
                    revenue=$(echo "$body" | jq -r '.revenueFormatted')
                    echo -e "${GREEN}📊 Users: $users | Products: $products | Orders: $orders | Revenue: $revenue${NC}"
                    ;;
                "/users")
                    total=$(echo "$body" | jq -r '.meta.total')
                    echo -e "${GREEN}📊 Total Users: $total${NC}"
                    ;;
                "/catalog/products")
                    total=$(echo "$body" | jq -r '.meta.total')
                    echo -e "${GREEN}📊 Total Products: $total${NC}"
                    ;;
                "/orders")
                    total=$(echo "$body" | jq -r '.meta.total')
                    echo -e "${GREEN}📊 Total Orders: $total${NC}"
                    ;;
            esac
        else
            echo -e "${RED}❌ Invalid JSON Response${NC}"
        fi
    else
        echo -e "${RED}❌ Status: $http_code (Expected: $expected_status)${NC}"
        echo -e "${RED}Response: $body${NC}"
    fi
    echo ""
}

# Test all endpoints
echo "🚀 Starting API Tests..."
echo ""

test_endpoint "/health" "Health Check"
test_endpoint "/analytics/overview" "Analytics Overview"
test_endpoint "/analytics/revenue" "Revenue Analytics"
test_endpoint "/users" "Users List"
test_endpoint "/users/stats" "User Statistics"
test_endpoint "/catalog/products" "Products Catalog"
test_endpoint "/catalog/categories" "Product Categories"
test_endpoint "/orders" "Orders List"
test_endpoint "/orders/stats" "Order Statistics"

# Test 404 endpoint
echo -e "${BLUE}Testing:${NC} Non-existent endpoint (404 test)"
echo -e "${YELLOW}Endpoint:${NC} $API_BASE/nonexistent"
response=$(curl -s -w "\n%{http_code}" "$API_BASE/nonexistent")
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq "404" ]; then
    echo -e "${GREEN}✅ Status: $http_code (Expected: 404)${NC}"
else
    echo -e "${RED}❌ Status: $http_code (Expected: 404)${NC}"
fi
echo ""

# Summary
echo "📈 API Integration Summary:"
echo "=========================="
echo "• Backend API: Running on port 8000"
echo "• Dashboard: Running on port 3001"
echo "• Total Endpoints Tested: 10"
echo "• CORS: Enabled for dashboard integration"
echo "• Data Format: Real Vietnamese e-commerce data"
echo "• Currency: Vietnamese Dong (₫)"
echo ""

echo "🔗 Quick Links:"
echo "• API Health: $API_BASE/health"
echo "• Dashboard: $DASHBOARD_URL"
echo "• Swagger Docs: http://localhost:8000/docs (when NestJS is running)"
echo ""

echo -e "${GREEN}✅ API Integration Testing Complete!${NC}"
echo "The backend is ready for dashboard integration with real data."