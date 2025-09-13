#!/bin/bash
# setup-automation.sh - Quick setup for all automation scripts

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

PROJECT_ROOT="/Users/macbook/Desktop/Code/audiotailoc"

log() {
    echo -e "${BLUE}[SETUP]${NC} $1"
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

# Check if we're in the right directory
check_directory() {
    if [ ! -d "$PROJECT_ROOT" ]; then
        error "Project directory not found: $PROJECT_ROOT"
        exit 1
    fi

    cd "$PROJECT_ROOT" || {
        error "Cannot change to project directory"
        exit 1
    }

    success "Project directory confirmed"
}

# Make scripts executable
setup_permissions() {
    log "Setting up script permissions..."

    chmod +x auto-test.sh 2>/dev/null && success "auto-test.sh permissions set" || warning "auto-test.sh not found"
    chmod +x auto-restart.sh 2>/dev/null && success "auto-restart.sh permissions set" || warning "auto-restart.sh not found"
    chmod +x auto-deploy.sh 2>/dev/null && success "auto-deploy.sh permissions set" || warning "auto-deploy.sh not found"
    chmod +x monitor.sh 2>/dev/null && success "monitor.sh permissions set" || warning "monitor.sh not found"
}

# Create logs directory
setup_logs() {
    log "Creating logs directory..."
    mkdir -p logs
    success "Logs directory created"
}

# Setup shell aliases
setup_aliases() {
    log "Setting up shell aliases..."

    SHELL_RC=""
    if [ -n "$ZSH_VERSION" ]; then
        SHELL_RC="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ]; then
        SHELL_RC="$HOME/.bashrc"
    else
        warning "Unknown shell, aliases not set up automatically"
        return 1
    fi

    if [ -f "$SHELL_RC" ]; then
        # Check if aliases are already added
        if grep -q "audiotailoc-aliases" "$SHELL_RC"; then
            info "Aliases already configured in $SHELL_RC"
        else
            echo "" >> "$SHELL_RC"
            echo "# Audio Tài Lộc aliases" >> "$SHELL_RC"
            echo "source $PROJECT_ROOT/.audiotailoc-aliases" >> "$SHELL_RC"
            success "Aliases added to $SHELL_RC"
            info "Run 'source $SHELL_RC' to load aliases immediately"
        fi
    else
        warning "Shell configuration file not found: $SHELL_RC"
    fi
}

# Test scripts
test_scripts() {
    log "Testing scripts..."

    # Test auto-test.sh
    if [ -f "auto-test.sh" ]; then
        ./auto-test.sh --help >/dev/null 2>&1 && success "auto-test.sh working" || warning "auto-test.sh may have issues"
    fi

    # Test monitor.sh
    if [ -f "monitor.sh" ]; then
        ./monitor.sh status >/dev/null 2>&1 && success "monitor.sh working" || warning "monitor.sh may have issues"
    fi
}

# Create sample environment file
create_env_template() {
    log "Creating environment template..."

    if [ ! -f ".env.automation" ]; then
        cat > .env.automation << 'EOF'
# Audio Tài Lộc Automation Environment Variables
# Copy this to .env and customize as needed

# Monitoring
NOTIFICATION_EMAIL=your-email@example.com
SLACK_WEBHOOK=https://hooks.slack.com/...

# Auto-deploy
BACKUP_RETENTION_DAYS=7
AUTO_UPDATE_DEPENDENCIES=true

# Auto-restart
MAX_RESTART_ATTEMPTS=5
HEALTH_CHECK_TIMEOUT=30

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/audiotailoc

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret-here

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# PayOS (for payments)
PAYOS_CLIENT_ID=your-client-id
PAYOS_API_KEY=your-api-key
PAYOS_CHECKSUM_KEY=your-checksum-key
EOF
        success "Environment template created: .env.automation"
        info "Copy to .env and customize as needed"
    else
        info "Environment template already exists"
    fi
}

# Setup cron jobs (optional)
setup_cron() {
    log "Setting up cron jobs..."

    read -p "Do you want to set up automatic cron jobs? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        CRON_JOBS="
# Audio Tài Lộc automation
*/5 * * * * $PROJECT_ROOT/monitor.sh status >> $PROJECT_ROOT/logs/cron.log 2>&1
0 2 * * * $PROJECT_ROOT/auto-deploy.sh >> $PROJECT_ROOT/logs/cron-deploy.log 2>&1
0 3 * * 0 $PROJECT_ROOT/auto-deploy.sh backup >> $PROJECT_ROOT/logs/cron-backup.log 2>&1
"

        if crontab -l 2>/dev/null | grep -q "Audio Tài Lộc"; then
            info "Cron jobs already configured"
        else
            (crontab -l 2>/dev/null; echo "$CRON_JOBS") | crontab -
            success "Cron jobs added"
            info "Jobs: health check (5min), auto-deploy (2AM), backup (3AM Sunday)"
        fi
    else
        info "Skipping cron setup"
    fi
}

# Main setup function
main() {
    echo -e "${PURPLE}🚀 Audio Tài Lộc Automation Setup${NC}"
    echo -e "${PURPLE}$(printf '%.0s=' {1..50})${NC}"

    check_directory
    setup_permissions
    setup_logs
    setup_aliases
    test_scripts
    create_env_template
    setup_cron

    echo ""
    echo -e "${GREEN}🎉 Setup completed!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Source your shell config: source ~/.zshrc (or ~/.bashrc)"
    echo "2. Copy .env.automation to .env and customize"
    echo "3. Run 'at-status-all' to check everything"
    echo "4. Start monitoring: 'at-monitor &'"
    echo ""
    echo -e "${BLUE}Available commands:${NC}"
    echo "- at-auto-test        # Run comprehensive tests"
    echo "- at-auto-deploy      # Deploy all services"
    echo "- at-monitor          # Start health monitoring"
    echo "- at-status-all       # Show system status"
    echo ""
    echo -e "${YELLOW}📖 Read AUTOMATION_README.md for detailed instructions${NC}"
}

# Run main function
main "$@"