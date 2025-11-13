#!/bin/bash

# Audio Tài Lộc - API Testing Script
# Tests all critical API endpoints

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Audio Tài Lộc - API Testing${NC}"
echo "========================================"
echo ""

# Configuration
BACKEND_URL="http://localhost:3010/api/v1"
ADMIN_EMAIL="admin@audiotailoc.com"
ADMIN_PASSWORD="Admin1234"
TOKEN=""

# Test counter
PASSED=0
FAILED=0
TOTAL=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local auth=$4
    local expected_code=${5:-200}
    
    TOTAL=$((TOTAL + 1))
    echo -n "Testing ${name}... "
    
    if [ "$auth" == "true" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            "${BACKEND_URL}${endpoint}")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            "${BACKEND_URL}${endpoint}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" == "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $http_code)"
        FAILED=$((FAILED + 1))
    fi
}

# Test 1: Health Check
echo -e "${YELLOW}1. Health Check${NC}"
test_endpoint "Health Check" "GET" "/health" "false" 200
echo ""

# Test 2: Login
echo -e "${YELLOW}2. Authentication${NC}"
echo -n "Testing Login... "
TOTAL=$((TOTAL + 1))

login_response=$(curl -s -X POST "${BACKEND_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}")

TOKEN=$(echo "$login_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Token received)"
    PASSED=$((PASSED + 1))
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}✗ FAIL${NC} (No token received)"
    FAILED=$((FAILED + 1))
    echo "Response: $login_response"
    echo ""
    echo -e "${RED}❌ Cannot continue without token. Exiting.${NC}"
    exit 1
fi
echo ""

# Test 3: Orders
echo -e "${YELLOW}3. Orders Endpoints${NC}"
test_endpoint "Get Orders" "GET" "/orders" "true" 200
test_endpoint "Get Orders with Pagination" "GET" "/orders?page=1&limit=10" "true" 200
echo ""

# Test 4: Products
echo -e "${YELLOW}4. Products Endpoints${NC}"
test_endpoint "Get Products" "GET" "/catalog/products" "false" 200
test_endpoint "Get Products with Pagination" "GET" "/catalog/products?page=1&pageSize=10" "false" 200
echo ""

# Test 5: Services
echo -e "${YELLOW}5. Services Endpoints${NC}"
test_endpoint "Get Services" "GET" "/services" "false" 200
test_endpoint "Get Service Types" "GET" "/service-types" "false" 200
echo ""

# Test 6: Users
echo -e "${YELLOW}6. Users Endpoints${NC}"
test_endpoint "Get Users" "GET" "/users" "true" 200
test_endpoint "Get Current User Profile" "GET" "/auth/me" "true" 200
echo ""

# Test 7: Bookings
echo -e "${YELLOW}7. Bookings Endpoints${NC}"
test_endpoint "Get Bookings" "GET" "/bookings" "true" 200
echo ""

# Test 8: Projects
echo -e "${YELLOW}8. Projects Endpoints${NC}"
test_endpoint "Get Projects" "GET" "/projects" "false" 200
test_endpoint "Get Featured Projects" "GET" "/projects/featured" "false" 200
echo ""

# Test 9: Reviews (Not implemented yet)
# echo -e "${YELLOW}9. Reviews Endpoints${NC}"
# test_endpoint "Get Reviews" "GET" "/reviews" "false" 200
# echo ""

# Test 10: Admin Dashboard
echo -e "${YELLOW}9. Admin Dashboard${NC}"
test_endpoint "Get Dashboard Stats" "GET" "/admin/dashboard" "true" 200
echo ""

# Test 11: Categories (Using service-types instead)
echo -e "${YELLOW}10. Service Types (Categories)${NC}"
test_endpoint "Get Service Types" "GET" "/service-types" "false" 200
echo ""

# Test 11: Knowledge Base (Not implemented in backend yet)
# echo -e "${YELLOW}11. Knowledge Base${NC}"
# test_endpoint "Get KB Articles" "GET" "/knowledge-base/articles" "false" 200
# echo ""

# Summary
echo ""
echo "========================================"
echo -e "${BLUE}📊 Test Summary${NC}"
echo "========================================"
echo -e "Total Tests:  ${BLUE}${TOTAL}${NC}"
echo -e "Passed:       ${GREEN}${PASSED}${NC}"
echo -e "Failed:       ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed.${NC}"
    exit 1
fi
