#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "🔍 AudioTaiLoc System Connectivity Test"
echo "========================================"
echo ""

# Backend URL
BACKEND_URL="http://localhost:3010"
API_BASE_URL="${BACKEND_URL}/api/v1"

echo "📍 Backend URL: $BACKEND_URL"
echo "📍 API Base URL: $API_BASE_URL"
echo ""

# Function to test endpoint
test_endpoint() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}

    echo -n "Testing $name... "

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

    if [ "$response" == "$expected_status" ] || [ "$response" == "200" ] || [ "$response" == "201" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response)"
        return 1
    fi
}

# Test Backend Health
echo "🏥 Backend Health Checks:"
echo "----------------------------"
test_endpoint "$API_BASE_URL/health" "Health Endpoint"
test_endpoint "$BACKEND_URL/docs" "Swagger Documentation" 200
echo ""

# Test API Endpoints
echo "🔌 API Endpoints:"
echo "----------------------------"
test_endpoint "$API_BASE_URL/catalog/products" "Products API"
test_endpoint "$API_BASE_URL/catalog/categories" "Categories API"
test_endpoint "$API_BASE_URL/services" "Services API"
test_endpoint "$API_BASE_URL/projects" "Projects API"
echo ""

# Test CORS
echo "🌐 CORS Configuration:"
echo "----------------------------"
echo -n "Testing CORS headers... "
cors_response=$(curl -s -I -X OPTIONS \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: GET" \
    "$API_BASE_URL/health" 2>/dev/null | grep -i "access-control-allow-origin")

if [ ! -z "$cors_response" ]; then
    echo -e "${GREEN}✓ OK${NC}"
    echo "  $cors_response"
else
    echo -e "${YELLOW}⚠ No CORS headers found${NC}"
fi
echo ""

# Test Authentication Endpoints
echo "🔐 Authentication Endpoints:"
echo "----------------------------"
test_endpoint "$API_BASE_URL/auth/register" "Register Endpoint" 201
test_endpoint "$API_BASE_URL/auth/login" "Login Endpoint" 400
echo ""

# Frontend/Dashboard Connection Test
echo "💻 Client Connection Config:"
echo "----------------------------"
echo "Frontend API URL: $(grep NEXT_PUBLIC_API_URL frontend/.env.local 2>/dev/null | cut -d'=' -f2)"
echo "Dashboard API URL: $(grep NEXT_PUBLIC_API_URL dashboard/.env.local 2>/dev/null | cut -d'=' -f2)"
echo ""

# Database Connection
echo "🗄️  Database Connection:"
echo "----------------------------"
echo -n "Testing database connectivity... "
if nc -z localhost 5432 2>/dev/null; then
    echo -e "${GREEN}✓ PostgreSQL port 5432 is open${NC}"
elif grep -q "accelerate.prisma-data.net" backend/.env 2>/dev/null; then
    echo -e "${GREEN}✓ Using Prisma Accelerate (cloud)${NC}"
else
    echo -e "${YELLOW}⚠ Cannot detect database${NC}"
fi
echo ""

# Redis Connection
echo "💾 Cache Connection:"
echo "----------------------------"
echo -n "Testing Redis connectivity... "
if grep -q "upstash.io" backend/.env 2>/dev/null; then
    echo -e "${GREEN}✓ Using Upstash Redis (cloud)${NC}"
else
    echo -e "${YELLOW}⚠ No Redis configuration found${NC}"
fi
echo ""

echo "========================================"
echo "✅ Connectivity Test Complete"
echo "========================================"
