#!/bin/bash
# setup-all.sh - Complete setup for Audio Tài Lộc automation and MCP

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_ROOT="/Users/macbook/Desktop/Code/audiotailoc"

log() {
    echo -e "${BLUE}[SETUP-ALL]${NC} $1"
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
    echo -e "${CYAN}ℹ️  $1${NC}"
}

section() {
    echo -e "\n${PURPLE}🚀 $1${NC}"
    echo -e "${PURPLE}$(printf '%.0s=' {1..60})${NC}"
}

# Check if we're in the right directory
check_environment() {
    section "Environment Check"

    if [ ! -d "$PROJECT_ROOT" ]; then
        error "Project directory not found: $PROJECT_ROOT"
        exit 1
    fi

    cd "$PROJECT_ROOT" || {
        error "Cannot change to project directory"
        exit 1
    }

    success "Project directory confirmed"

    # Check if scripts exist
    local scripts=("auto-test.sh" "auto-restart.sh" "auto-deploy.sh" "monitor.sh" "setup-automation.sh" "setup-mcp.sh")
    for script in "${scripts[@]}"; do
        if [ ! -f "$script" ]; then
            warning "$script not found - will be created"
        fi
    done
}

# Setup automation scripts
setup_automation() {
    section "Automation Scripts Setup"

    if [ -f "setup-automation.sh" ]; then
        log "Running automation setup..."
        ./setup-automation.sh
    else
        warning "setup-automation.sh not found, skipping automation setup"
    fi
}

# Setup MCP servers
setup_mcp() {
    section "MCP Servers Setup"

    if [ -f "setup-mcp.sh" ]; then
        log "Running MCP setup..."
        ./setup-mcp.sh
    else
        warning "setup-mcp.sh not found, skipping MCP setup"
    fi
}

# Create final summary
create_summary() {
    section "Setup Summary"

    echo -e "${CYAN}🎉 Audio Tài Lộc Complete Setup Finished!${NC}"
    echo ""
    echo -e "${GREEN}📁 Files created/modified:${NC}"
    echo "├── Automation Scripts:"
    echo "│   ├── auto-test.sh          # Comprehensive API testing"
    echo "│   ├── auto-restart.sh       # Auto-restart on crash"
    echo "│   ├── auto-deploy.sh        # Auto-deployment"
    echo "│   ├── monitor.sh           # Health monitoring"
    echo "│   ├── setup-automation.sh  # Automation setup"
    echo "│   └── .audiotailoc-aliases # Shell aliases"
    echo "├── MCP Configuration:"
    echo "│   ├── mcp-settings.json    # MCP server config"
    echo "│   ├── setup-mcp.sh         # MCP setup script"
    echo "│   ├── test-mcp.sh          # MCP test script"
    echo "│   └── MCP_GUIDE.md         # MCP usage guide"
    echo "└── Documentation:"
    echo "    ├── AUTOMATION_README.md # Automation guide"
    echo "    └── README.md            # Project overview"
    echo ""

    echo -e "${BLUE}🚀 Quick Start Commands:${NC}"
    echo ""
    echo "# Load aliases (add to ~/.zshrc)"
    echo "source .audiotailoc-aliases"
    echo ""
    echo "# Start monitoring"
    echo "at-monitor &"
    echo ""
    echo "# Run comprehensive tests"
    echo "at-auto-test"
    echo ""
    echo "# Deploy all services"
    echo "at-auto-deploy"
    echo ""
    echo "# Check system status"
    echo "at-status-all"
    echo ""
    echo "# Test MCP servers"
    echo "./test-mcp.sh"
    echo ""

    echo -e "${YELLOW}📖 Documentation:${NC}"
    echo "- AUTOMATION_README.md  # Complete automation guide"
    echo "- MCP_GUIDE.md         # MCP servers guide"
    echo ""

    echo -e "${PURPLE}🔧 Available Services:${NC}"
    echo "├── Backend API        # http://localhost:3010"
    echo "├── Frontend App       # http://localhost:3000"
    echo "├── Dashboard          # http://localhost:3001"
    echo "├── Database           # PostgreSQL"
    echo "├── Redis Cache        # Redis"
    echo "└── MCP Servers        # Various AI/tools"
    echo ""

    echo -e "${GREEN}🎯 Next Steps:${NC}"
    echo "1. Restart your terminal or run: source ~/.zshrc"
    echo "2. Start services: at-start"
    echo "3. Run tests: at-auto-test"
    echo "4. Monitor health: at-monitor &"
    echo "5. Check status: at-status-all"
    echo ""

    echo -e "${CYAN}💡 Pro Tips:${NC}"
    echo "- Use 'at-' aliases for quick access"
    echo "- Run 'at-setup' to initialize project"
    echo "- Use 'at-clean' to clean up build files"
    echo "- Monitor with 'at-health' commands"
    echo ""

    # Create quick reference card
    cat > QUICK_REFERENCE.md << 'EOF'
# Audio Tài Lộc - Quick Reference

## 🚀 Quick Commands
```bash
# Start all services
at-start

# Run tests
at-auto-test

# Deploy updates
at-auto-deploy

# Monitor health
at-monitor &

# Check status
at-status-all

# Clean up
at-clean
```

## 🔧 Development Workflow
```bash
# 1. Setup project
at-setup

# 2. Start development
at-dev

# 3. Run tests
at-test

# 4. Check health
at-health

# 5. Deploy
at-auto-deploy
```

## 📊 Monitoring
```bash
# Start monitoring
at-monitor &

# View logs
at-logs

# Health checks
at-health-backend
at-health-frontend
at-health-dashboard
```

## 🗄️ Database
```bash
# Generate Prisma client
at-db-generate

# Run migrations
at-db-migrate

# Open Prisma Studio
at-db-studio
```

## 📁 File Structure
```
audiotailoc/
├── backend/           # NestJS API server
├── frontend/          # Next.js client app
├── dashboard/         # Admin dashboard
├── scripts/           # Utility scripts
├── logs/             # Application logs
├── mcp-memory/       # MCP memory storage
└── docs/             # Documentation
```
EOF

    success "Quick reference created: QUICK_REFERENCE.md"
}

# Main setup function
main() {
    echo -e "${CYAN}🎯 Audio Tài Lộc - Complete Setup${NC}"
    echo -e "${CYAN}$(printf '%.0s=' {1..60})${NC}"
    echo ""

    check_environment
    setup_automation
    setup_mcp
    create_summary

    echo ""
    echo -e "${GREEN}🎉 All setup completed successfully!${NC}"
    echo -e "${YELLOW}📖 Check QUICK_REFERENCE.md for quick commands${NC}"
    echo -e "${BLUE}🚀 Happy coding with Audio Tài Lộc!${NC}"
}

# Run main function
main "$@"