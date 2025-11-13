#!/bin/bash

# ==========================================================================
# Audio Tài Lộc - Check Services Status
# ==========================================================================
# This script checks the status of all services
# 
# Usage:
#   ./check-services.sh
# ==========================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║     🔍 Audio Tài Lộc - Services Health Check 🔍        ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
}

print_service_status() {
    local service=$1
    local port=$2
    local url=$3
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}📦 $service${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Check if port is listening
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "Port Status: ${GREEN}✓ Running on port $port${NC}"
        
        # Get process info
        local pid=$(lsof -ti:$port)
        echo -e "Process ID: ${CYAN}$pid${NC}"
        
        # Try to hit the URL if provided
        if [ ! -z "$url" ]; then
            echo -ne "HTTP Status: "
            local status_code=$(curl -s -o /dev/null -w "%{http_code}" $url 2>/dev/null)
            
            if [ "$status_code" = "200" ] || [ "$status_code" = "304" ]; then
                echo -e "${GREEN}✓ $status_code OK${NC}"
                echo -e "URL: ${CYAN}$url${NC}"
            elif [ "$status_code" = "000" ]; then
                echo -e "${YELLOW}⚠ Cannot connect${NC}"
            else
                echo -e "${YELLOW}⚠ $status_code${NC}"
            fi
        fi
    else
        echo -e "Port Status: ${RED}✗ Not running on port $port${NC}"
    fi
}

check_backend_health() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}🔧 Backend Health Details${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if lsof -Pi :3010 -sTCP:LISTEN -t >/dev/null 2>&1; then
        local health_response=$(curl -s http://localhost:3010/api/v1/health 2>/dev/null)
        
        if [ ! -z "$health_response" ]; then
            echo -e "${GREEN}Health Check Response:${NC}"
            echo "$health_response" | python3 -m json.tool 2>/dev/null || echo "$health_response"
            echo ""
            echo -e "${GREEN}✓ Backend API is healthy${NC}"
        else
            echo -e "${YELLOW}⚠ No response from health endpoint${NC}"
        fi
    else
        echo -e "${RED}✗ Backend is not running${NC}"
    fi
}

check_environment() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}🔧 Environment Configuration${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Check backend .env
    if [ -f "backend/.env" ]; then
        echo -e "Backend .env: ${GREEN}✓ Found${NC}"
        
        # Check important variables
        if grep -q "DATABASE_URL" backend/.env; then
            echo -e "  - DATABASE_URL: ${GREEN}✓ Set${NC}"
        else
            echo -e "  - DATABASE_URL: ${RED}✗ Missing${NC}"
        fi
        
        if grep -q "JWT_ACCESS_SECRET" backend/.env; then
            echo -e "  - JWT_ACCESS_SECRET: ${GREEN}✓ Set${NC}"
        else
            echo -e "  - JWT_ACCESS_SECRET: ${RED}✗ Missing${NC}"
        fi
    else
        echo -e "Backend .env: ${RED}✗ Not found${NC}"
    fi
    
    # Check frontend .env.local
    if [ -f "frontend/.env.local" ]; then
        echo -e "Frontend .env.local: ${GREEN}✓ Found${NC}"
        
        if grep -q "NEXT_PUBLIC_API_URL" frontend/.env.local; then
            local api_url=$(grep "NEXT_PUBLIC_API_URL" frontend/.env.local | cut -d '=' -f2)
            echo -e "  - NEXT_PUBLIC_API_URL: ${CYAN}$api_url${NC}"
        else
            echo -e "  - NEXT_PUBLIC_API_URL: ${RED}✗ Missing${NC}"
        fi
    else
        echo -e "Frontend .env.local: ${RED}✗ Not found${NC}"
    fi
    
    # Check dashboard .env.local
    if [ -f "dashboard/.env.local" ]; then
        echo -e "Dashboard .env.local: ${GREEN}✓ Found${NC}"
        
        if grep -q "NEXT_PUBLIC_API_URL" dashboard/.env.local; then
            local api_url=$(grep "NEXT_PUBLIC_API_URL" dashboard/.env.local | cut -d '=' -f2)
            echo -e "  - NEXT_PUBLIC_API_URL: ${CYAN}$api_url${NC}"
        else
            echo -e "  - NEXT_PUBLIC_API_URL: ${RED}✗ Missing${NC}"
        fi
    else
        echo -e "Dashboard .env.local: ${RED}✗ Not found${NC}"
    fi
}

main() {
    clear
    print_header
    
    # Check services
    print_service_status "Backend API" 3010 "http://localhost:3010/api/v1/health"
    print_service_status "Frontend" 3000 "http://localhost:3000"
    print_service_status "Dashboard" 3001 "http://localhost:3001"
    
    # Check backend health in detail
    check_backend_health
    
    # Check environment
    check_environment
    
    # Summary
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}📊 Summary${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    local running=0
    local total=3
    
    if lsof -Pi :3010 -sTCP:LISTEN -t >/dev/null 2>&1; then ((running++)); fi
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then ((running++)); fi
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then ((running++)); fi
    
    echo -e "Services Running: ${CYAN}$running/$total${NC}"
    
    if [ $running -eq $total ]; then
        echo -e "Status: ${GREEN}✓ All services running${NC}"
    elif [ $running -gt 0 ]; then
        echo -e "Status: ${YELLOW}⚠ Some services not running${NC}"
    else
        echo -e "Status: ${RED}✗ No services running${NC}"
    fi
    
    echo ""
    echo -e "${CYAN}Quick Links:${NC}"
    echo -e "  - Backend API: ${CYAN}http://localhost:3010/api/v1${NC}"
    echo -e "  - API Docs: ${CYAN}http://localhost:3010/docs${NC}"
    echo -e "  - Frontend: ${CYAN}http://localhost:3000${NC}"
    echo -e "  - Dashboard: ${CYAN}http://localhost:3001${NC}"
    echo ""
}

main
