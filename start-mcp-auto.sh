#!/bin/bash

# 🚀 Auto Start MCP cho Audio Tài Lộc
# Script tự động khởi động MCP servers khi mở VS Code

PROJECT_ROOT="/Users/macbook/Desktop/Code/audiotailoc"
AUTO_MCP_SCRIPT="$PROJECT_ROOT/auto-mcp.sh"

# Kiểm tra xem script auto-mcp có tồn tại không
if [ ! -f "$AUTO_MCP_SCRIPT" ]; then
    echo "❌ Không tìm thấy script auto-mcp.sh"
    exit 1
fi

echo "🚀 Auto-starting MCP servers for Audio Tài Lộc..."

# Khởi động MCP servers
"$AUTO_MCP_SCRIPT" start

echo "✅ MCP servers đã được khởi động tự động"
echo "🎯 Bạn có thể sử dụng Copilot với các MCP servers:"
echo "   - Playwright: Automation testing"
echo "   - Memory: Persistent memory storage"
echo "   - GitHub: GitHub integration"
echo "   - Browser: Web browsing capabilities"

# Giữ terminal mở để xem logs
echo ""
echo "📋 Nhấn Ctrl+C để dừng MCP servers"
echo "📊 Sử dụng './auto-mcp.sh status' để kiểm tra trạng thái"

# Chờ user dừng
trap "$AUTO_MCP_SCRIPT stop; exit 0" INT
while true; do
    sleep 1
done
