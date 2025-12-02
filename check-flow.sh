#!/bin/bash

# Enhanced Flow Check Script for Audio Tài Lộc
# Usage: ./check-flow.sh [options]
# Options:
#   --backend-only    Only check backend
#   --dashboard-only  Only check dashboard
#   --integration     Check integration between backend and dashboard
#   --quick           Quick check (skip lint, format, tests)
#   --verbose         Show detailed output
#   --json            Output results as JSON

set -e

# Check bash version for associative arrays (bash 4+)
if [ "${BASH_VERSION%%.*}" -lt 4 ]; then
    echo "Warning: Bash version < 4.0. Some features may not work."
fi

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
BACKEND_DIR="$PROJECT_ROOT/backend"
DASHBOARD_DIR="$PROJECT_ROOT/dashboard"
LOG_DIR="/tmp/audiotailoc-check"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$LOG_DIR/report_$TIMESTAMP.txt"
JSON_REPORT="$LOG_DIR/report_$TIMESTAMP.json"

# Options
CHECK_BACKEND=true
CHECK_DASHBOARD=true
CHECK_INTEGRATION=true
QUICK_MODE=false
VERBOSE=false
JSON_OUTPUT=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-only)
            CHECK_DASHBOARD=false
            CHECK_INTEGRATION=false
            shift
            ;;
        --dashboard-only)
            CHECK_BACKEND=false
            CHECK_INTEGRATION=false
            shift
            ;;
        --integration)
            CHECK_BACKEND=false
            CHECK_DASHBOARD=false
            CHECK_INTEGRATION=true
            shift
            ;;
        --quick)
            QUICK_MODE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        --help|-h)
            echo "Enhanced Flow Check Script for Audio Tài Lộc"
            echo ""
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --backend-only      Only check backend"
            echo "  --dashboard-only    Only check dashboard"
            echo "  --integration       Only check integration"
            echo "  --quick             Quick check (skip lint, format)"
            echo "  --verbose           Show detailed output"
            echo "  --json              Output results as JSON"
            echo "  --help, -h          Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                  # Full check"
            echo "  $0 --quick          # Quick check"
            echo "  $0 --backend-only    # Check backend only"
            echo "  $0 --verbose --json # Verbose with JSON output"
            echo ""
            echo "Logs are saved to: /tmp/audiotailoc-check/"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Run '$0 --help' for usage information"
            exit 1
            ;;
    esac
done

# Initialize
mkdir -p "$LOG_DIR"
rm -f "$REPORT_FILE" "$JSON_REPORT"

# Results tracking (using variables instead of associative arrays for compatibility)
BACKEND_TYPECHECK=0
BACKEND_BUILD=0
BACKEND_LINT=0
BACKEND_FORMAT=0
DASHBOARD_BUILD=0
DASHBOARD_LINT=0
INTEGRATION_CHECK=0
SERVICES_CHECK=0

# Helper functions
log() {
    echo -e "$1" | tee -a "$REPORT_FILE"
}

log_json() {
    if [ "$JSON_OUTPUT" = true ]; then
        echo "$1" >> "$JSON_REPORT"
    fi
}

check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Print header
print_header() {
    log "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    log "${BLUE}║  🔍 Audio Tài Lộc - Enhanced Flow Check Script         ║${NC}"
    log "${BLUE}║  Timestamp: $(date '+%Y-%m-%d %H:%M:%S')                      ║${NC}"
    log "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    log ""
}

# Check prerequisites
check_prerequisites() {
    log "${CYAN}📋 Checking prerequisites...${NC}"
    
    local missing=0
    
    if ! check_command node; then
        log "  ${RED}❌ Node.js not found${NC}"
        missing=$((missing + 1))
    else
        log "  ${GREEN}✅ Node.js: $(node --version)${NC}"
    fi
    
    if ! check_command npm; then
        log "  ${RED}❌ npm not found${NC}"
        missing=$((missing + 1))
    else
        log "  ${GREEN}✅ npm: $(npm --version)${NC}"
    fi
    
    if ! check_command curl; then
        log "  ${YELLOW}⚠️  curl not found (needed for API checks)${NC}"
    else
        log "  ${GREEN}✅ curl: $(curl --version | head -n1)${NC}"
    fi
    
    if [ $missing -gt 0 ]; then
        log "${RED}❌ Missing required prerequisites. Please install them first.${NC}"
        exit 1
    fi
    
    log ""
}

# Check Backend
check_backend() {
    if [ "$CHECK_BACKEND" = false ]; then
        return 0
    fi
    
    log "${YELLOW}📦 Checking Backend...${NC}"
    cd "$BACKEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log "  ${YELLOW}⚠️  node_modules not found. Running npm install...${NC}"
        npm install > "$LOG_DIR/backend-install.log" 2>&1 || {
            log "  ${RED}❌ npm install failed${NC}"
            RESULTS[backend_build]=1
            return 1
        }
    fi
    
    # TypeScript type checking
    log "  - TypeScript type checking..."
    if npm run typecheck > "$LOG_DIR/backend-typecheck.log" 2>&1; then
        ERROR_COUNT=$(grep -E "error TS" "$LOG_DIR/backend-typecheck.log" 2>/dev/null | wc -l | tr -d ' ')
        if [ "$ERROR_COUNT" -eq "0" ]; then
            log "    ${GREEN}✅ TypeScript: No errors ($ERROR_COUNT errors)${NC}"
            BACKEND_TYPECHECK=0
        else
            log "    ${RED}❌ TypeScript: $ERROR_COUNT errors found${NC}"
            if [ "$VERBOSE" = true ]; then
                grep -E "error TS" "$LOG_DIR/backend-typecheck.log" | head -10 | while read -r line; do
                    log "      $line"
                done
            fi
            BACKEND_TYPECHECK=1
        fi
    else
        log "    ${RED}❌ TypeScript: Failed to run typecheck${NC}"
        BACKEND_TYPECHECK=1
    fi
    
    # Build check
    log "  - Building..."
    if npm run build > "$LOG_DIR/backend-build.log" 2>&1; then
        if grep -q "Successfully" "$LOG_DIR/backend-build.log" 2>/dev/null || [ -f "dist/main.js" ]; then
            log "    ${GREEN}✅ Build: Success${NC}"
            BACKEND_BUILD=0
        else
            log "    ${YELLOW}⚠️  Build: Completed but no success message${NC}"
            BACKEND_BUILD=0
        fi
    else
        log "    ${RED}❌ Build: Failed${NC}"
        if [ "$VERBOSE" = true ]; then
            tail -20 "$LOG_DIR/backend-build.log" | while read -r line; do
                log "      $line"
            done
        fi
        BACKEND_BUILD=1
    fi
    
    # Lint check (skip in quick mode)
    if [ "$QUICK_MODE" = false ]; then
        log "  - Linting..."
        if npm run lint > "$LOG_DIR/backend-lint.log" 2>&1; then
            log "    ${GREEN}✅ Lint: No issues${NC}"
            BACKEND_LINT=0
        else
            ERROR_COUNT=$(grep -E "error|warning" "$LOG_DIR/backend-lint.log" 2>/dev/null | wc -l | tr -d ' ')
            if [ "$ERROR_COUNT" -gt 0 ]; then
                log "    ${YELLOW}⚠️  Lint: $ERROR_COUNT issues found${NC}"
                BACKEND_LINT=1
            else
                log "    ${GREEN}✅ Lint: No issues${NC}"
                BACKEND_LINT=0
            fi
        fi
        
        # Format check
        log "  - Formatting check..."
        if npm run format:check > "$LOG_DIR/backend-format.log" 2>&1; then
            log "    ${GREEN}✅ Format: All files formatted correctly${NC}"
            BACKEND_FORMAT=0
        else
            log "    ${YELLOW}⚠️  Format: Some files need formatting${NC}"
            BACKEND_FORMAT=1
        fi
    fi
    
    cd "$PROJECT_ROOT"
    log ""
}

# Check Dashboard
check_dashboard() {
    if [ "$CHECK_DASHBOARD" = false ]; then
        return 0
    fi
    
    log "${YELLOW}🎨 Checking Dashboard...${NC}"
    cd "$DASHBOARD_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log "  ${YELLOW}⚠️  node_modules not found. Running npm install...${NC}"
        npm install > "$LOG_DIR/dashboard-install.log" 2>&1 || {
            log "  ${RED}❌ npm install failed${NC}"
            RESULTS[dashboard_build]=1
            return 1
        }
    fi
    
    # Build check
    log "  - Building..."
    # Remove .next directory to avoid lock issues
    if [ -d ".next" ]; then
        rm -rf .next
    fi
    
    if npm run build > "$LOG_DIR/dashboard-build.log" 2>&1; then
        if grep -q "Creating an optimized production build\|Compiled successfully" "$LOG_DIR/dashboard-build.log" 2>/dev/null; then
            log "    ${GREEN}✅ Build: Success${NC}"
            DASHBOARD_BUILD=0
        else
            log "    ${YELLOW}⚠️  Build: Completed but check logs${NC}"
            DASHBOARD_BUILD=0
        fi
    else
        log "    ${RED}❌ Build: Failed${NC}"
        if [ "$VERBOSE" = true ]; then
            tail -20 "$LOG_DIR/dashboard-build.log" | while read -r line; do
                log "      $line"
            done
        fi
        DASHBOARD_BUILD=1
    fi
    
    # Lint check (skip in quick mode)
    if [ "$QUICK_MODE" = false ]; then
        log "  - Linting..."
        if npm run lint > "$LOG_DIR/dashboard-lint.log" 2>&1; then
            log "    ${GREEN}✅ Lint: No issues${NC}"
            DASHBOARD_LINT=0
        else
            ERROR_COUNT=$(grep -E "error|warning" "$LOG_DIR/dashboard-lint.log" 2>/dev/null | wc -l | tr -d ' ')
            if [ "$ERROR_COUNT" -gt 0 ]; then
                log "    ${YELLOW}⚠️  Lint: $ERROR_COUNT issues found${NC}"
                DASHBOARD_LINT=1
            else
                log "    ${GREEN}✅ Lint: No issues${NC}"
                DASHBOARD_LINT=0
            fi
        fi
    fi
    
    cd "$PROJECT_ROOT"
    log ""
}

# Check Services
check_services() {
    log "${YELLOW}🚀 Checking Services...${NC}"
    
    local backend_running=false
    local dashboard_running=false
    
    # Check Backend
    if lsof -ti:3010 >/dev/null 2>&1; then
        if curl -s -f http://localhost:3010/health >/dev/null 2>&1 || \
           curl -s -f http://localhost:3010/ >/dev/null 2>&1; then
            log "  ${GREEN}✅ Backend: Running on http://localhost:3010${NC}"
            backend_running=true
            SERVICES_CHECK=0
        else
            log "  ${YELLOW}⚠️  Backend: Port 3010 in use but not responding${NC}"
            SERVICES_CHECK=1
        fi
    else
        log "  ${RED}❌ Backend: Not running${NC}"
        SERVICES_CHECK=1
    fi
    
    # Check Dashboard
    if lsof -ti:3001 >/dev/null 2>&1; then
        if curl -s -f http://localhost:3001 >/dev/null 2>&1; then
            log "  ${GREEN}✅ Dashboard: Running on http://localhost:3001${NC}"
            dashboard_running=true
        else
            log "  ${YELLOW}⚠️  Dashboard: Port 3001 in use but not responding${NC}"
        fi
    else
        log "  ${RED}❌ Dashboard: Not running${NC}"
    fi
    
    log ""
}

# Check Integration
check_integration() {
    if [ "$CHECK_INTEGRATION" = false ]; then
        return 0
    fi
    
    log "${YELLOW}🔗 Checking Integration...${NC}"
    
    # Check if integration report exists
    if [ -f "$PROJECT_ROOT/INTEGRATION_REPORT.md" ]; then
        log "  ${GREEN}✅ Integration report found${NC}"
        INTEGRATION_CHECK=0
        
        # Check key endpoints
        if [ "$backend_running" = true ]; then
            log "  - Testing API endpoints..."
            
            # Test health endpoint
            if curl -s -f http://localhost:3010/health >/dev/null 2>&1; then
                log "    ${GREEN}✅ Health endpoint: OK${NC}"
            else
                log "    ${YELLOW}⚠️  Health endpoint: Not available${NC}"
            fi
            
            # Test search endpoint
            if curl -s -f "http://localhost:3010/api/v1/search?q=test" >/dev/null 2>&1; then
                log "    ${GREEN}✅ Search endpoint: OK${NC}"
            else
                log "    ${YELLOW}⚠️  Search endpoint: Not available${NC}"
            fi
        fi
    else
        log "  ${YELLOW}⚠️  Integration report not found${NC}"
        INTEGRATION_CHECK=1
    fi
    
    log ""
}

# Generate Summary
generate_summary() {
    log "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    log "${BLUE}║  📊 Summary                                                ║${NC}"
    log "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    log ""
    
    local total_checks=0
    local passed_checks=0
    
    if [ "$CHECK_BACKEND" = true ]; then
        log "${CYAN}Backend:${NC}"
        log "  TypeScript: $([ $BACKEND_TYPECHECK -eq 0 ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
        log "  Build:      $([ $BACKEND_BUILD -eq 0 ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
        if [ "$QUICK_MODE" = false ]; then
            log "  Lint:       $([ $BACKEND_LINT -eq 0 ] && echo -e "${GREEN}✅${NC}" || echo -e "${YELLOW}⚠️${NC}")"
            log "  Format:     $([ $BACKEND_FORMAT -eq 0 ] && echo -e "${GREEN}✅${NC}" || echo -e "${YELLOW}⚠️${NC}")"
        fi
        log ""
        total_checks=$((total_checks + 2))
        passed_checks=$((passed_checks + BACKEND_TYPECHECK + BACKEND_BUILD))
    fi
    
    if [ "$CHECK_DASHBOARD" = true ]; then
        log "${CYAN}Dashboard:${NC}"
        log "  Build:      $([ $DASHBOARD_BUILD -eq 0 ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
        if [ "$QUICK_MODE" = false ]; then
            log "  Lint:       $([ $DASHBOARD_LINT -eq 0 ] && echo -e "${GREEN}✅${NC}" || echo -e "${YELLOW}⚠️${NC}")"
        fi
        log ""
        total_checks=$((total_checks + 1))
        passed_checks=$((passed_checks + DASHBOARD_BUILD))
    fi
    
    if [ "$CHECK_INTEGRATION" = true ]; then
        log "${CYAN}Integration:${NC}"
        log "  Status:     $([ $INTEGRATION_CHECK -eq 0 ] && echo -e "${GREEN}✅${NC}" || echo -e "${YELLOW}⚠️${NC}")"
        log ""
    fi
    
    log "${CYAN}Services:${NC}"
    log "  Status:     $([ $SERVICES_CHECK -eq 0 ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
    log ""
    
    # Overall status
    local success_rate=0
    if [ $total_checks -gt 0 ]; then
        success_rate=$((100 * (total_checks - passed_checks) / total_checks))
    fi
    
    if [ $passed_checks -eq 0 ]; then
        log "${GREEN}✅ All checks passed!${NC}"
    else
        log "${YELLOW}⚠️  Some checks failed ($passed_checks/$total_checks)${NC}"
    fi
    
    log ""
    log "${BLUE}📝 Detailed logs:${NC}"
    log "  Backend typecheck: cat $LOG_DIR/backend-typecheck.log"
    log "  Backend build:     cat $LOG_DIR/backend-build.log"
    log "  Dashboard build:  cat $LOG_DIR/dashboard-build.log"
    log "  Full report:       cat $REPORT_FILE"
    log ""
    
    # JSON output
    if [ "$JSON_OUTPUT" = true ]; then
        log_json "{"
        log_json "  \"timestamp\": \"$(date -Iseconds)\","
        log_json "  \"backend\": {"
        log_json "    \"typecheck\": $BACKEND_TYPECHECK,"
        log_json "    \"build\": $BACKEND_BUILD,"
        log_json "    \"lint\": $BACKEND_LINT,"
        log_json "    \"format\": $BACKEND_FORMAT"
        log_json "  },"
        log_json "  \"dashboard\": {"
        log_json "    \"build\": $DASHBOARD_BUILD,"
        log_json "    \"lint\": $DASHBOARD_LINT"
        log_json "  },"
        log_json "  \"integration\": $INTEGRATION_CHECK,"
        log_json "  \"services\": $SERVICES_CHECK,"
        log_json "  \"success_rate\": $success_rate"
        log_json "}"
        log ""
        log "${GREEN}📄 JSON report saved to: $JSON_REPORT${NC}"
    fi
}

# Main execution
main() {
    print_header
    check_prerequisites
    
    if [ "$CHECK_BACKEND" = true ]; then
        check_backend
    fi
    
    if [ "$CHECK_DASHBOARD" = true ]; then
        check_dashboard
    fi
    
    check_services
    
    if [ "$CHECK_INTEGRATION" = true ]; then
        check_integration
    fi
    
    generate_summary
}

# Run main function
main

