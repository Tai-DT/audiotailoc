#!/bin/bash

# Script để khởi động Backend và Frontend
# Sử dụng: ./start-services.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Khởi động Backend và Frontend...${NC}"
echo ""

# Kiểm tra xem đã có process nào đang chạy chưa
if lsof -ti:3010 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Backend đã chạy trên port 3010${NC}"
else
    echo -e "${GREEN}📦 Khởi động Backend (port 3010)...${NC}"
    cd backend
    npm run dev > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    cd ..
fi

if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Frontend đã chạy trên port 3000${NC}"
else
    echo -e "${GREEN}🌐 Khởi động Frontend (port 3000)...${NC}"
    cd frontend
    npm run dev > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    cd ..
fi

echo ""
echo -e "${YELLOW}⏳ Đợi các service khởi động...${NC}"
sleep 10

echo ""
echo -e "${GREEN}✅ Kiểm tra trạng thái:${NC}"
echo ""

# Kiểm tra Backend
if curl -s http://localhost:3010/api/v1/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend đang chạy: http://localhost:3010${NC}"
    echo "   API Docs: http://localhost:3010/docs"
else
    echo -e "${RED}❌ Backend chưa sẵn sàng${NC}"
    echo "   Xem log: tail -f /tmp/backend.log"
fi

# Kiểm tra Frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend đang chạy: http://localhost:3000${NC}"
else
    echo -e "${YELLOW}⏳ Frontend đang khởi động...${NC}"
    echo "   Xem log: tail -f /tmp/frontend.log"
fi

echo ""
echo -e "${GREEN}📝 Logs:${NC}"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo -e "${GREEN}🛑 Để dừng:${NC}"
echo "   kill \$(lsof -ti:3010)  # Backend"
echo "   kill \$(lsof -ti:3000)  # Frontend"

