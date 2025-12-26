#!/bin/bash

# Dashboard Test Runner Script
# Chạy tất cả các tests cho dashboard

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Dashboard Test Runner                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if services are running
echo -e "${YELLOW}Kiểm tra services...${NC}"

BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/health)
DASHBOARD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)

if [ "$BACKEND_STATUS" != "200" ]; then
    echo -e "${RED}❌ Backend không chạy trên port 3010${NC}"
    echo "   Chạy: cd backend && npm run dev"
    exit 1
fi

if [ "$DASHBOARD_STATUS" != "200" ] && [ "$DASHBOARD_STATUS" != "302" ]; then
    echo -e "${RED}❌ Dashboard không chạy trên port 3001${NC}"
    echo "   Chạy: cd dashboard && npm run dev"
    exit 1
fi

echo -e "${GREEN}✅ Services đang chạy${NC}"
echo ""

# Run smoke tests (Playwright)
echo -e "${BLUE}─── Running Smoke Tests (Playwright) ───${NC}"
npx playwright test tests/dashboard-smoke.spec.ts tests/auth.spec.ts tests/reports-download.spec.ts tests/backups-smoke.spec.ts
SMOKE_RESULT=$?

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Final Summary                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"

if [ $SMOKE_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Tất cả tests PASSED!${NC}"
    exit 0
else
    echo -e "${RED}❌ Một số tests FAILED${NC}"
    exit 1
fi




