#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Audio Tài Lộc Backend...${NC}"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend" || exit 1

# Check if build exists
if [ ! -d "dist" ] || [ ! -f "dist/main.js" ]; then
    echo -e "${RED}❌ Build not found. Running build first...${NC}"
    npm run build
fi

echo -e "${GREEN}✅ Starting backend on port 3010...${NC}"
echo -e "${BLUE}📝 Logs will be saved to backend.log${NC}"
echo ""

# Start the backend
npm run start:dev 2>&1 | tee -a backend.log
