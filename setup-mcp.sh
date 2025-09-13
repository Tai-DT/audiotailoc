#!/bin/bash
# setup-mcp.sh - Setup MCP (Model Context Protocol) servers

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

PROJECT_ROOT="/Users/macbook/Desktop/Code/audiotailoc"
MCP_CONFIG="$PROJECT_ROOT/mcp-settings.json"

log() {
    echo -e "${BLUE}[MCP-SETUP]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install Node.js packages
install_nodejs_packages() {
    log "Installing Node.js MCP packages..."

    if ! command_exists npm; then
        error "npm not found. Please install Node.js first."
        return 1
    fi

    # Install Playwright MCP
    if ! npm list -g @playwright/mcp >/dev/null 2>&1; then
        log "Installing @playwright/mcp..."
        npm install -g @playwright/mcp@latest
        success "Playwright MCP installed"
    else
        success "Playwright MCP already installed"
    fi

    # Install Memory MCP
    if ! npm list -g @modelcontextprotocol/server-memory >/dev/null 2>&1; then
        log "Installing @modelcontextprotocol/server-memory..."
        npm install -g @modelcontextprotocol/server-memory@latest
        success "Memory MCP installed"
    else
        success "Memory MCP already installed"
    fi

    # Install Sequential Thinking MCP
    if ! npm list -g @modelcontextprotocol/server-sequential-thinking >/dev/null 2>&1; then
        log "Installing @modelcontextprotocol/server-sequential-thinking..."
        npm install -g @modelcontextprotocol/server-sequential-thinking@latest
        success "Sequential Thinking MCP installed"
    else
        success "Sequential Thinking MCP already installed"
    fi
}

# Install Python packages via uvx
install_uvx_packages() {
    log "Installing Python MCP packages via uvx..."

    if ! command_exists uvx; then
        warning "uvx not found. Installing uv..."
        curl -LsSf https://astral.sh/uv/install.sh | sh
        export PATH="$HOME/.cargo/bin:$PATH"
    fi

    # Install imagesorcery MCP
    log "Installing imagesorcery-mcp..."
    uvx pip install imagesorcery-mcp
    success "imagesorcery MCP installed"

    # Install markitdown MCP
    log "Installing markitdown-mcp..."
    uvx pip install markitdown-mcp
    success "markitdown MCP installed"
}

# Test HTTP servers connectivity
test_http_servers() {
    log "Testing HTTP MCP servers connectivity..."

    # Test Microsoft Docs
    if curl -s --max-time 5 https://learn.microsoft.com/api/mcp >/dev/null; then
        success "Microsoft Docs MCP accessible"
    else
        warning "Microsoft Docs MCP not accessible"
    fi

    # Test DeepWiki
    if curl -s --max-time 5 https://mcp.deepwiki.com/sse >/dev/null; then
        success "DeepWiki MCP accessible"
    else
        warning "DeepWiki MCP not accessible"
    fi

    # Test Sentry
    if curl -s --max-time 5 https://mcp.sentry.dev/mcp >/dev/null; then
        success "Sentry MCP accessible"
    else
        warning "Sentry MCP not accessible"
    fi

    # Test Prisma Postgres
    if curl -s --max-time 5 https://mcp.prisma.io/mcp >/dev/null; then
        success "Prisma Postgres MCP accessible"
    else
        warning "Prisma Postgres MCP not accessible"
    fi

    # Test GitHub Copilot
    if curl -s --max-time 5 https://api.githubcopilot.com/mcp/ >/dev/null; then
        success "GitHub Copilot MCP accessible"
    else
        warning "GitHub Copilot MCP not accessible"
    fi

    # Test shadcn
    if curl -s --max-time 5 https://www.shadcn.io/api/mcp >/dev/null; then
        success "shadcn MCP accessible"
    else
        warning "shadcn MCP not accessible"
    fi
}

# Create VS Code MCP settings
create_vscode_settings() {
    log "Creating VS Code MCP settings..."

    MCP_VSCODE_DIR="$HOME/Library/Application Support/Code/User"
    MCP_SETTINGS_FILE="$MCP_VSCODE_DIR/mcp.json"

    # Create directory if it doesn't exist
    mkdir -p "$MCP_VSCODE_DIR"

    # Copy our MCP settings
    if [ -f "$MCP_CONFIG" ]; then
        cp "$MCP_CONFIG" "$MCP_SETTINGS_FILE"
        success "VS Code MCP settings created at: $MCP_SETTINGS_FILE"
    else
        error "MCP config file not found: $MCP_CONFIG"
        return 1
    fi
}

# Setup memory storage
setup_memory_storage() {
    log "Setting up memory storage..."

    MEMORY_DIR="$HOME/.mcp-memory"
    mkdir -p "$MEMORY_DIR"

    # Create default memory file
    DEFAULT_MEMORY="$MEMORY_DIR/default.json"
    if [ ! -f "$DEFAULT_MEMORY" ]; then
        echo '{
  "conversations": [],
  "documents": [],
  "metadata": {
    "created": "'$(date -Iseconds)'",
    "version": "1.0"
  }
}' > "$DEFAULT_MEMORY"
        success "Default memory file created at: $DEFAULT_MEMORY"
    else
        success "Memory file already exists"
    fi
}

# Create test script
create_test_script() {
    log "Creating MCP test script..."

    TEST_SCRIPT="$PROJECT_ROOT/test-mcp.sh"

    if [ ! -f "$TEST_SCRIPT" ]; then
        error "Test script not found. Please ensure test-mcp.sh exists."
        return 1
    fi

    chmod +x "$TEST_SCRIPT"
    success "Test script ready: $TEST_SCRIPT"
}

# Main setup function
main() {
    echo ""
    echo -e "${BLUE}🚀 Starting MCP Setup...${NC}"
    echo ""

    # Check if we're in the right directory
    if [ ! -f "$MCP_CONFIG" ]; then
        error "MCP config file not found: $MCP_CONFIG"
        error "Please run this script from the project root directory."
        exit 1
    fi

    # Install packages
    install_nodejs_packages
    echo ""
    install_uvx_packages
    echo ""

    # Test connectivity
    test_http_servers
    echo ""

    # Setup configurations
    create_vscode_settings
    setup_memory_storage
    create_test_script

    echo ""
    echo -e "${GREEN}🎉 MCP Setup completed!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Restart VS Code to load MCP settings"
    echo "2. Run './test-mcp.sh' to verify installations"
    echo "3. Configure memory file path when prompted"
    echo ""
    echo -e "${BLUE}MCP Servers configured:${NC}"
    echo "- ✅ Playwright (Browser automation)"
    echo "- ✅ Memory (Persistent storage)"
    echo "- ✅ Sequential Thinking (AI reasoning)"
    echo "- ✅ imagesorcery (Image processing)"
    echo "- ✅ markitdown (Document processing)"
    echo "- ✅ Microsoft Docs (Documentation)"
    echo "- ✅ DeepWiki (Knowledge base)"
    echo "- ✅ Sentry (Error monitoring)"
    echo "- ✅ Prisma Postgres (Database)"
    echo "- ✅ GitHub Copilot (AI assistance)"
    echo "- ✅ shadcn (UI components)"
    echo ""
    echo -e "${YELLOW}📖 MCP configuration: $MCP_CONFIG${NC}"
    echo ""
    echo -e "${GREEN}🎯 Ready to use MCP in VS Code!${NC}"
}

# Run main function
main "$@"