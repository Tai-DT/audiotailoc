#!/bin/bash

# MCP Utilities cho Audio Tài Lộc

PROJECT_ROOT="/Users/macbook/Desktop/Code/audiotailoc"

case "$1" in
    "start")
        echo "🚀 Starting MCP servers..."
        echo "Note: MCP servers will be started when Copilot requests them"
        echo "Use VS Code with GitHub Copilot to interact with MCP"
        ;;
    "status")
        echo "📊 MCP Configuration Status:"
        echo "Project Root: $PROJECT_ROOT"
        echo "MCP Server: $PROJECT_ROOT/scripts/mcp-server.js"
        echo "VS Code Settings: Configured"
        ;;
    "test")
        echo "🧪 Testing MCP server..."
        node $PROJECT_ROOT/scripts/mcp-server.js --test
        ;;
    "logs")
        echo "� MCP server logs:"
        echo "Logs will appear in VS Code output panel when using MCP"
        ;;
    *)
        echo "Usage: $0 {start|status|test|logs}"
        echo ""
        echo "MCP Utilities for Audio Tài Lộc:"
        echo "  start  - Show MCP startup info"
        echo "  status - Show MCP configuration status"
        echo "  test   - Test MCP server"
        echo "  logs   - Show MCP logs info"
        exit 1
        ;;
esac
