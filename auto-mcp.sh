#!/bin/bash

# 🚀 Auto MCP Manager cho Audio Tài Lộc
# Script tự động quản lý các MCP servers

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="/Users/macbook/Desktop/Code/audiotailoc"
MCP_CONFIG="$HOME/.mcp"
MEMORY_FILE="$MCP_CONFIG/memory.json"

# Tạo thư mục MCP nếu chưa có
mkdir -p "$MCP_CONFIG"

# Tạo file memory mặc định nếu chưa có
if [ ! -f "$MEMORY_FILE" ]; then
    echo '{"conversations": [], "facts": [], "preferences": {}}' > "$MEMORY_FILE"
    echo "✅ Đã tạo file memory tại $MEMORY_FILE"
fi

# Function để kiểm tra và cài đặt dependencies
check_dependencies() {
    echo "🔍 Đang kiểm tra dependencies..."

    # Kiểm tra Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js chưa được cài đặt"
        return 1
    fi

    # Kiểm tra npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm chưa được cài đặt"
        return 1
    fi

    # Cài đặt MCP servers nếu chưa có
    if ! npm list -g @playwright/mcp &> /dev/null; then
        echo "📦 Đang cài đặt @playwright/mcp..."
        npm install -g @playwright/mcp
    fi

    if ! npm list -g @modelcontextprotocol/server-memory &> /dev/null; then
        echo "📦 Đang cài đặt @modelcontextprotocol/server-memory..."
        npm install -g @modelcontextprotocol/server-memory
    fi

    if ! npm list -g @browsermcp/mcp &> /dev/null; then
        echo "📦 Đang cài đặt @browsermcp/mcp..."
        npm install -g @browsermcp/mcp
    fi

    echo "✅ Tất cả dependencies đã sẵn sàng"
    return 0
}

# Function để khởi động MCP servers
start_mcp_servers() {
    echo "🚀 Đang khởi động MCP servers..."

    # Tạo script khởi động cho từng server
    cat > "$MCP_CONFIG/start-playwright.sh" << 'EOF'
#!/bin/bash
echo "🎭 Starting Playwright MCP Server..."
npx @playwright/mcp@latest
EOF

    cat > "$MCP_CONFIG/start-memory.sh" << EOF
#!/bin/bash
echo "🧠 Starting Memory MCP Server..."
MEMORY_FILE_PATH="$MEMORY_FILE" npx -y @modelcontextprotocol/server-memory
EOF

    cat > "$MCP_CONFIG/start-browser.sh" << 'EOF'
#!/bin/bash
echo "🌐 Starting Browser MCP Server..."
npx @browsermcp/mcp@latest
EOF

    # Làm executable
    chmod +x "$MCP_CONFIG/start-playwright.sh"
    chmod +x "$MCP_CONFIG/start-memory.sh"
    chmod +x "$MCP_CONFIG/start-browser.sh"

    echo "✅ Đã tạo scripts khởi động MCP servers"
    echo "📍 Scripts location: $MCP_CONFIG/"
}

# Function để kiểm tra trạng thái
check_status() {
    echo "📊 MCP Servers Status:"
    echo "======================"

    # Kiểm tra Playwright
    if pgrep -f "playwright" > /dev/null; then
        echo "✅ Playwright MCP: Running"
    else
        echo "❌ Playwright MCP: Stopped"
    fi

    # Kiểm tra Memory
    if pgrep -f "server-memory" > /dev/null; then
        echo "✅ Memory MCP: Running"
    else
        echo "❌ Memory MCP: Stopped"
    fi

    # Kiểm tra Browser
    if pgrep -f "browsermcp" > /dev/null; then
        echo "✅ Browser MCP: Running"
    else
        echo "❌ Browser MCP: Stopped"
    fi

    echo ""
    echo "📁 Memory file: $MEMORY_FILE"
    echo "📁 MCP config: $HOME/Library/Application Support/Code/User/mcp.json"
}

# Function để test các servers
test_servers() {
    echo "🧪 Testing MCP servers..."

    # Test Playwright
    echo "Testing Playwright MCP..."
    timeout 5s npx @playwright/mcp@latest --help > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Playwright MCP: OK"
    else
        echo "❌ Playwright MCP: Failed"
    fi

    # Test Memory
    echo "Testing Memory MCP..."
    timeout 5s bash "$MCP_CONFIG/start-memory.sh" > /dev/null 2>&1 &
    sleep 2
    if pgrep -f "server-memory" > /dev/null; then
        echo "✅ Memory MCP: OK"
        pkill -f "server-memory"
    else
        echo "❌ Memory MCP: Failed"
    fi

    # Test Browser
    echo "Testing Browser MCP..."
    timeout 5s npx @browsermcp/mcp@latest --help > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Browser MCP: OK"
    else
        echo "❌ Browser MCP: Failed"
    fi
}

# Function để dừng tất cả servers
stop_servers() {
    echo "🛑 Đang dừng tất cả MCP servers..."

    # Dừng Playwright
    pkill -f "playwright" 2>/dev/null && echo "✅ Đã dừng Playwright MCP"

    # Dừng Memory
    pkill -f "server-memory" 2>/dev/null && echo "✅ Đã dừng Memory MCP"

    # Dừng Browser
    pkill -f "browsermcp" 2>/dev/null && echo "✅ Đã dừng Browser MCP"

    echo "✅ Tất cả MCP servers đã được dừng"
}

# Function để khởi động tất cả servers
start_all_servers() {
    echo "🚀 Đang khởi động tất cả MCP servers..."

    # Dừng servers cũ trước
    stop_servers

    # Khởi động Playwright
    echo "🎭 Starting Playwright MCP..."
    nohup "$MCP_CONFIG/start-playwright.sh" > "$MCP_CONFIG/playwright.log" 2>&1 &
    echo $! > "$MCP_CONFIG/playwright.pid"

    # Khởi động Memory
    echo "🧠 Starting Memory MCP..."
    nohup "$MCP_CONFIG/start-memory.sh" > "$MCP_CONFIG/memory.log" 2>&1 &
    echo $! > "$MCP_CONFIG/memory.pid"

    # Khởi động Browser
    echo "🌐 Starting Browser MCP..."
    nohup "$MCP_CONFIG/start-browser.sh" > "$MCP_CONFIG/browser.log" 2>&1 &
    echo $! > "$MCP_CONFIG/browser.pid"

    sleep 2
    check_status
}

# Main script logic
case "$1" in
    "start")
        check_dependencies && start_all_servers
        ;;
    "stop")
        stop_servers
        ;;
    "restart")
        stop_servers
        sleep 2
        check_dependencies && start_all_servers
        ;;
    "status")
        check_status
        ;;
    "test")
        test_servers
        ;;
    "setup")
        check_dependencies && start_mcp_servers
        ;;
    "logs")
        echo "📋 MCP Server Logs:"
        echo "==================="
        echo "Playwright: $MCP_CONFIG/playwright.log"
        echo "Memory: $MCP_CONFIG/memory.log"
        echo "Browser: $MCP_CONFIG/browser.log"
        echo ""
        echo "Use 'tail -f <log_file>' to view logs"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|test|setup|logs}"
        echo ""
        echo "Auto MCP Manager cho Audio Tài Lộc:"
        echo "  start   - Khởi động tất cả MCP servers"
        echo "  stop    - Dừng tất cả MCP servers"
        echo "  restart - Restart tất cả MCP servers"
        echo "  status  - Hiển thị trạng thái các servers"
        echo "  test    - Test các MCP servers"
        echo "  setup   - Thiết lập MCP servers"
        echo "  logs    - Hiển thị đường dẫn logs"
        exit 1
        ;;
esac
