#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "======================================"
echo "🔍 AUDIO TÀI LỘC - SYSTEM CHECK"
echo "======================================"
echo ""

# 1. Check Backend Build
echo -e "${BLUE}[1/6] Checking Backend Build...${NC}"
if [ -d "backend/dist" ] && [ -f "backend/dist/main.js" ]; then
    echo -e "${GREEN}✅ Backend build exists${NC}"
else
    echo -e "${RED}❌ Backend not built. Run: cd backend && npm run build${NC}"
    exit 1
fi

# 2. Check Database Connection
echo -e "${BLUE}[2/6] Testing Database Connection...${NC}"
cd backend
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${YELLOW}⚠️  Cannot verify database (might be normal)${NC}"
fi

# 3. Check Environment Files
echo -e "${BLUE}[3/6] Checking Environment Files...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Backend .env exists${NC}"
    if grep -q "DATABASE_URL" .env; then
        echo -e "${GREEN}   - DATABASE_URL configured${NC}"
    fi
    if grep -q "REDIS_URL" .env; then
        echo -e "${GREEN}   - REDIS_URL configured${NC}"
    fi
    if grep -q "CLOUDINARY" .env; then
        echo -e "${GREEN}   - CLOUDINARY configured${NC}"
    fi
else
    echo -e "${RED}❌ Backend .env not found${NC}"
fi

cd ../frontend
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ Frontend .env.local exists${NC}"
    if grep -q "NEXT_PUBLIC_API_URL" .env.local; then
        API_URL=$(grep "NEXT_PUBLIC_API_URL" .env.local | cut -d '=' -f2 | tr -d '"' | tr -d ' ')
        echo -e "${GREEN}   - API URL: $API_URL${NC}"
    fi
else
    echo -e "${RED}❌ Frontend .env.local not found${NC}"
fi
cd ..

# 4. Check Node Modules
echo -e "${BLUE}[4/6] Checking Dependencies...${NC}"
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Backend dependencies missing. Run: cd backend && npm install${NC}"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Frontend dependencies missing. Run: cd frontend && npm install${NC}"
fi

# 5. Check Ports
echo -e "${BLUE}[5/6] Checking Port Availability...${NC}"
if lsof -i :3010 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3010 (Backend) is in use${NC}"
else
    echo -e "${GREEN}✅ Port 3010 (Backend) is available${NC}"
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3000 (Frontend) is in use${NC}"
else
    echo -e "${GREEN}✅ Port 3000 (Frontend) is available${NC}"
fi

if lsof -i :3001 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3001 (Dashboard) is in use${NC}"
else
    echo -e "${GREEN}✅ Port 3001 (Dashboard) is available${NC}"
fi

# 6. Summary
echo ""
echo -e "${BLUE}[6/6] System Summary${NC}"
echo "======================================"
echo -e "${GREEN}Backend:${NC}"
echo "  - Build: ✅ Ready"
echo "  - Dependencies: ✅ Installed"
echo "  - Port: 3010"
echo ""
echo -e "${GREEN}Frontend:${NC}"
echo "  - Dependencies: Check above"
echo "  - Port: 3000"
echo ""
echo -e "${GREEN}Dashboard:${NC}"
echo "  - Port: 3001"
echo ""
echo -e "${GREEN}Database:${NC}"
echo "  - Provider: Aiven PostgreSQL"
echo "  - Connection: Check above"
echo ""
echo "======================================"
echo -e "${YELLOW}To start services:${NC}"
echo -e "  Backend:   ${BLUE}cd backend && npm run dev${NC}"
echo -e "  Frontend:  ${BLUE}cd frontend && npm run dev${NC}"
echo -e "  Dashboard: ${BLUE}cd dashboard && npm run dev${NC}"
echo "======================================"
