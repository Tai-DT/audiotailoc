#!/bin/bash
# monitor.sh - Health monitoring and alerting system

# Configuration
PROJECT_ROOT="/Users/macbook/Desktop/Code/audiotailoc"
LOG_FILE="${PROJECT_ROOT}/logs/monitor.log"
ALERT_LOG="${PROJECT_ROOT}/logs/alerts.log"
HEALTH_CHECK_INTERVAL=60  # seconds
MAX_FAILURES=3
NOTIFICATION_EMAIL=""  # Set your email for notifications

# Service configurations
declare -A SERVICES=(
    ["backend"]="http://localhost:3010/api/v1/health"
    ["frontend"]="http://localhost:3000"
    ["dashboard"]="http://localhost:3001"
)

# Failure counters
declare -A FAILURE_COUNTS=(
    ["backend"]=0
    ["frontend"]=0
    ["dashboard"]=0
)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

alert() {
    echo -e "${RED}🚨 ALERT: $1${NC}" | tee -a "$ALERT_LOG"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}" | tee -a "$LOG_FILE"
}

# Send notification
notify() {
    local message="$1"
    local level="${2:-info}"

    log "Sending $level notification: $message"

    # Email notification (requires mail command)
    if [ -n "$NOTIFICATION_EMAIL" ] && command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "Audio Tài Lộc $level Alert" "$NOTIFICATION_EMAIL"
    fi

    # Desktop notification (macOS)
    if command -v osascript >/dev/null 2>&1; then
        osascript -e "display notification \"$message\" with title \"Audio Tài Lộc Monitor\""
    fi

    # Slack webhook (if configured)
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
             --data "{\"text\":\"Audio Tài Lộc $level: $message\"}" \
             "$SLACK_WEBHOOK" 2>/dev/null || true
    fi
}

# Check service health
check_service() {
    local service_name="$1"
    local url="$2"

    case $service_name in
        "backend")
            # Special check for backend with JSON response
            if curl -s "$url" | jq -e '.status == "ok"' >/dev/null 2>&1; then
                return 0
            fi
            ;;
        "frontend"|"dashboard")
            # Basic HTTP check for frontend/dashboard
            if curl -s --head --fail "$url" >/dev/null 2>&1; then
                return 0
            fi
            ;;
    esac
    return 1
}

# Handle service failure
handle_failure() {
    local service_name="$1"
    local url="$2"

    ((FAILURE_COUNTS[$service_name]++))

    if [ ${FAILURE_COUNTS[$service_name]} -ge $MAX_FAILURES ]; then
        alert "$service_name has failed $MAX_FAILURES times! URL: $url"
        notify "$service_name is down! Failed health checks: ${FAILURE_COUNTS[$service_name]}" "alert"

        # Auto-restart attempt
        auto_restart_service "$service_name"
    else
        warning "$service_name health check failed (${FAILURE_COUNTS[$service_name]}/$MAX_FAILURES)"
    fi
}

# Handle service recovery
handle_recovery() {
    local service_name="$1"

    if [ ${FAILURE_COUNTS[$service_name]} -gt 0 ]; then
        success "$service_name has recovered!"
        notify "$service_name is back online" "info"
        FAILURE_COUNTS[$service_name]=0
    fi
}

# Auto-restart service
auto_restart_service() {
    local service_name="$1"

    info "Attempting to auto-restart $service_name..."

    case $service_name in
        "backend")
            # Kill existing backend processes
            pkill -f "npm run start:dev" || true
            sleep 2

            # Start backend
            cd "${PROJECT_ROOT}/backend" || return 1
            npm run start:dev > "${PROJECT_ROOT}/logs/backend-restart.log" 2>&1 &
            ;;
        "frontend")
            # Kill existing frontend processes
            pkill -f "next.*3000" || true
            sleep 2

            # Start frontend
            cd "${PROJECT_ROOT}/frontend" || return 1
            npm run dev > "${PROJECT_ROOT}/logs/frontend-restart.log" 2>&1 &
            ;;
        "dashboard")
            # Kill existing dashboard processes
            pkill -f "next.*3001" || true
            sleep 2

            # Start dashboard
            cd "${PROJECT_ROOT}/dashboard" || return 1
            npm run dev > "${PROJECT_ROOT}/logs/dashboard-restart.log" 2>&1 &
            ;;
    esac

    sleep 10  # Wait for service to start

    # Verify restart
    if check_service "$service_name" "${SERVICES[$service_name]}"; then
        success "$service_name restarted successfully"
        notify "$service_name auto-restart successful" "info"
        FAILURE_COUNTS[$service_name]=0
    else
        alert "$service_name auto-restart failed"
        notify "$service_name auto-restart failed - manual intervention required" "alert"
    fi
}

# Check system resources
check_system_resources() {
    # CPU usage
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
    if (( $(echo "$cpu_usage > 90" | bc -l) )); then
        alert "High CPU usage: ${cpu_usage}%"
        notify "High CPU usage detected: ${cpu_usage}%" "warning"
    fi

    # Memory usage
    local mem_usage=$(echo "scale=2; $(ps -A -o %mem | awk '{sum+=$1} END {print sum}') / 100" | bc)
    if (( $(echo "$mem_usage > 90" | bc -l) )); then
        alert "High memory usage: ${mem_usage}%"
        notify "High memory usage detected: ${mem_usage}%" "warning"
    fi

    # Disk usage
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ $disk_usage -gt 90 ]; then
        alert "High disk usage: ${disk_usage}%"
        notify "High disk usage detected: ${disk_usage}%" "warning"
    fi
}

# Check database connectivity
check_database() {
    if command -v pg_isready >/dev/null 2>&1; then
        if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
            alert "Database connection failed"
            notify "Database is not accessible" "alert"
        fi
    fi
}

# Generate health report
generate_report() {
    local report_file="${PROJECT_ROOT}/logs/health-report-$(date +%Y%m%d-%H%M%S).txt"

    {
        echo "=== Audio Tài Lộc Health Report ==="
        echo "Generated: $(date)"
        echo ""
        echo "Service Status:"
        for service in "${!SERVICES[@]}"; do
            if check_service "$service" "${SERVICES[$service]}"; then
                echo "✅ $service: Healthy"
            else
                echo "❌ $service: Unhealthy"
            fi
        done
        echo ""
        echo "System Resources:"
        echo "CPU Usage: $(top -l 1 | grep "CPU usage" | awk '{print $3}')"
        echo "Memory Usage: $(echo "scale=2; $(ps -A -o %mem | awk '{sum+=$1} END {print sum}') / 100" | bc)%"
        echo "Disk Usage: $(df / | tail -1 | awk '{print $5}')"
        echo ""
        echo "Recent Alerts:"
        if [ -f "$ALERT_LOG" ]; then
            tail -10 "$ALERT_LOG" 2>/dev/null || echo "No recent alerts"
        else
            echo "No alerts log found"
        fi
    } > "$report_file"

    info "Health report generated: $report_file"
}

# Main monitoring loop
monitor() {
    log "Starting Audio Tài Lộc monitoring system..."
    log "Health check interval: ${HEALTH_CHECK_INTERVAL}s"
    log "Max failures before alert: $MAX_FAILURES"

    # Create log directories
    mkdir -p "${PROJECT_ROOT}/logs"

    local report_counter=0

    while true; do
        # Check all services
        for service in "${!SERVICES[@]}"; do
            if check_service "$service" "${SERVICES[$service]}"; then
                handle_recovery "$service"
            else
                handle_failure "$service" "${SERVICES[$service]}"
            fi
        done

        # System resource checks
        check_system_resources

        # Database check
        check_database

        # Generate periodic report (every 10 cycles)
        ((report_counter++))
        if [ $report_counter -ge 10 ]; then
            generate_report
            report_counter=0
        fi

        sleep $HEALTH_CHECK_INTERVAL
    done
}

# Show status
status() {
    echo -e "${PURPLE}=== Audio Tài Lộc Monitor Status ===${NC}"
    echo ""

    echo -e "${BLUE}Service Status:${NC}"
    for service in "${!SERVICES[@]}"; do
        if check_service "$service" "${SERVICES[$service]}"; then
            echo -e "  ${GREEN}✅ $service: Healthy${NC}"
        else
            echo -e "  ${RED}❌ $service: Unhealthy${NC}"
        fi
    done

    echo ""
    echo -e "${BLUE}Failure Counters:${NC}"
    for service in "${!FAILURE_COUNTS[@]}"; do
        echo -e "  $service: ${FAILURE_COUNTS[$service]}/$MAX_FAILURES"
    done

    echo ""
    echo -e "${BLUE}System Resources:${NC}"
    echo -e "  CPU: $(top -l 1 | grep "CPU usage" | awk '{print $3}')"
    echo -e "  Memory: $(echo "scale=2; $(ps -A -o %mem | awk '{sum+=$1} END {print sum}') / 100" | bc)%"
    echo -e "  Disk: $(df / | tail -1 | awk '{print $5}')"

    echo ""
    echo -e "${BLUE}Recent Logs:${NC}"
    if [ -f "$LOG_FILE" ]; then
        tail -5 "$LOG_FILE" 2>/dev/null || echo "  No logs available"
    else
        echo "  No log file found"
    fi
}

# Cleanup function
cleanup() {
    log "Monitor stopping..."
    exit 0
}

# Signal handler
trap cleanup SIGINT SIGTERM

# Main function
main() {
    case "${1:-monitor}" in
        monitor)
            monitor
            ;;
        status)
            status
            ;;
        report)
            generate_report
            ;;
        restart)
            if [ -n "$2" ]; then
                auto_restart_service "$2"
            else
                echo "Usage: $0 restart <service>"
                echo "Services: ${!SERVICES[*]}"
                exit 1
            fi
            ;;
        *)
            echo "Usage: $0 [monitor|status|report|restart]"
            echo ""
            echo "Commands:"
            echo "  monitor  Start monitoring services"
            echo "  status   Show current status"
            echo "  report   Generate health report"
            echo "  restart  Restart a specific service"
            echo ""
            echo "Services: ${!SERVICES[*]}"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"