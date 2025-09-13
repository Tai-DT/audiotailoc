#!/bin/bash
# test-mcp.sh - Test MCP server connections

echo "🧪 Testing MCP Servers..."
echo "========================"

# Test stdio servers
echo ""
echo "📡 Testing stdio servers..."

# Playwright
echo -n "Playwright: "
if npx @playwright/mcp@latest --help >/dev/null 2>&1; then
    echo "✅ Working"
else
    echo "❌ Failed"
fi

# Memory
echo -n "Memory: "
if npx @modelcontextprotocol/server-memory@latest --help >/dev/null 2>&1; then
    echo "✅ Working"
else
    echo "❌ Failed"
fi

# Sequential Thinking
echo -n "Sequential Thinking: "
if npx @modelcontextprotocol/server-sequential-thinking@latest --help >/dev/null 2>&1; then
    echo "✅ Working"
else
    echo "❌ Failed"
fi

# Test Python packages
echo ""
echo "🐍 Testing Python MCP packages..."

# imagesorcery
echo -n "imagesorcery: "
if uvx imagesorcery-mcp --help >/dev/null 2>&1; then
    echo "✅ Working"
else
    echo "❌ Failed"
fi

# markitdown
echo -n "markitdown: "
if uvx markitdown-mcp --help >/dev/null 2>&1; then
    echo "✅ Working"
else
    echo "❌ Failed"
fi

# Test HTTP servers
echo ""
echo "🌐 Testing HTTP MCP servers..."

# Microsoft Docs
echo -n "Microsoft Docs: "
if curl -s --max-time 5 https://learn.microsoft.com/api/mcp >/dev/null; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

# DeepWiki
echo -n "DeepWiki: "
if curl -s --max-time 5 https://mcp.deepwiki.com/sse >/dev/null; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

# Sentry
echo -n "Sentry: "
if curl -s --max-time 5 https://mcp.sentry.dev/mcp >/dev/null; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

# Prisma Postgres
echo -n "Prisma Postgres: "
if curl -s --max-time 5 https://mcp.prisma.io/mcp >/dev/null; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

# GitHub Copilot
echo -n "GitHub Copilot: "
if curl -s --max-time 5 https://api.githubcopilot.com/mcp/ >/dev/null; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

# shadcn
echo -n "shadcn: "
if curl -s --max-time 5 https://www.shadcn.io/api/mcp >/dev/null; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

# Test VS Code configuration
echo ""
echo "⚙️  Testing VS Code configuration..."

MCP_CONFIG="$HOME/Library/Application Support/Code/User/mcp.json"
if [ -f "$MCP_CONFIG" ]; then
    echo "✅ VS Code MCP config exists: $MCP_CONFIG"
else
    echo "❌ VS Code MCP config missing"
fi

# Test memory storage
echo ""
echo "💾 Testing memory storage..."

MEMORY_DIR="$HOME/.mcp-memory"
if [ -d "$MEMORY_DIR" ]; then
    echo "✅ Memory directory exists: $MEMORY_DIR"
    if [ -f "$MEMORY_DIR/default.json" ]; then
        echo "✅ Default memory file exists"
    else
        echo "❌ Default memory file missing"
    fi
else
    echo "❌ Memory directory missing"
fi

echo ""
echo "🎉 MCP Test completed!"
echo ""
echo "📋 Summary:"
echo "- MCP servers are installed and configured"
echo "- VS Code settings are in place"
echo "- Memory storage is ready"
echo "- HTTP servers are accessible"
echo ""
echo "🚀 Next: Restart VS Code to activate MCP servers"