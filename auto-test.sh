#!/bin/bash
# auto-test.sh - Comprehensive API Testing Suite for Audio Tài Lộc

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3010/api/v1"
ADMIN_EMAIL="admin@audiotailoc.com"
ADMIN_PASSWORD="Admin123!"
TEST_IMAGE_PATH="/tmp/test-image.jpg"

# Global variables
TOKEN=""
TEST_RESULTS=()
PASSED=0
FAILED=0

# Helper functions
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
    TEST_RESULTS+=("✅ $1")
    ((PASSED++))
}

error() {
    echo -e "${RED}❌ $1${NC}"
    TEST_RESULTS+=("❌ $1")
    ((FAILED++))
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

section() {
    echo -e "\n${PURPLE}🚀 $1${NC}"
    echo -e "${PURPLE}$(printf '%.0s=' {1..50})${NC}"
}

# Authentication
login() {
    section "Authentication"
    log "Logging in as admin..."

    RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}")

    TOKEN=$(echo "$RESPONSE" | jq -r '.data.token // empty')

    if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
        success "Login successful"
        return 0
    else
        error "Login failed: $(echo "$RESPONSE" | jq -r '.message // "Unknown error"')"
        return 1
    fi
}

# Health check
test_health() {
    section "Health Check"
    log "Testing health endpoint..."

    RESPONSE=$(curl -s "${BASE_URL}/health")

    if echo "$RESPONSE" | jq -e '.status == "ok"' >/dev/null 2>&1; then
        success "Health check passed"
        return 0
    else
        error "Health check failed"
        return 1
    fi
}

# Categories CRUD
test_categories() {
    section "Categories CRUD"

    # Get categories
    log "Getting categories..."
    RESPONSE=$(curl -s -H "Authorization: Bearer ${TOKEN}" "${BASE_URL}/catalog/categories")

    if echo "$RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
        success "Get categories successful"
        CATEGORIES_COUNT=$(echo "$RESPONSE" | jq -r '.data.total // 0')
        info "Found $CATEGORIES_COUNT categories"
    else
        error "Get categories failed"
        return 1
    fi

    # Create category
    log "Creating test category..."
    CREATE_RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" \
        "${BASE_URL}/catalog/categories" \
        -d '{"name":"Test Category","slug":"test-category","description":"Auto test category"}')

    if echo "$CREATE_RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
        success "Create category successful"
        CATEGORY_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id')
        info "Created category ID: $CATEGORY_ID"
    else
        error "Create category failed: $(echo "$CREATE_RESPONSE" | jq -r '.message // "Unknown error"')"
        return 1
    fi

    # Update category
    log "Updating category..."
    UPDATE_RESPONSE=$(curl -s -X PATCH \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" \
        "${BASE_URL}/catalog/categories/${CATEGORY_ID}" \
        -d '{"name":"Updated Test Category","description":"Updated auto test category"}')

    if echo "$UPDATE_RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
        success "Update category successful"
    else
        error "Update category failed"
    fi

    # Delete category
    log "Deleting category..."
    DELETE_RESPONSE=$(curl -s -X DELETE \
        -H "Authorization: Bearer ${TOKEN}" \
        "${BASE_URL}/catalog/categories/${CATEGORY_ID}")

    if echo "$DELETE_RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
        success "Delete category successful"
    else
        error "Delete category failed"
    fi
}

# File Upload
test_file_upload() {
    section "File Upload"

    # Create test image
    log "Creating test image..."
    if ! command -v convert >/dev/null 2>&1; then
        warning "ImageMagick not found, skipping file upload test"
        return 0
    fi

    convert -size 100x100 xc:blue "$TEST_IMAGE_PATH"

    # Upload file
    log "Uploading test image..."
    UPLOAD_RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer ${TOKEN}" \
        -F "file=@${TEST_IMAGE_PATH}" \
        "${BASE_URL}/files/upload")

    if echo "$UPLOAD_RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
        success "File upload successful"
        FILE_URL=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.url')
        info "Uploaded file URL: $FILE_URL"

        # Test file retrieval
        log "Testing file retrieval..."
        RETRIEVE_RESPONSE=$(curl -s -I "$FILE_URL")
        if echo "$RETRIEVE_RESPONSE" | grep -q "200 OK"; then
            success "File retrieval successful"
        else
            error "File retrieval failed"
        fi
    else
        error "File upload failed: $(echo "$UPLOAD_RESPONSE" | jq -r '.message // "Unknown error"')"
    fi

    # Cleanup
    rm -f "$TEST_IMAGE_PATH"
}

# Payments
test_payments() {
    section "Payments"

    # Get payment methods
    log "Getting payment methods..."
    METHODS_RESPONSE=$(curl -s -H "Authorization: Bearer ${TOKEN}" "${BASE_URL}/payments/methods")

    if echo "$METHODS_RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
        success "Get payment methods successful"
        METHODS_COUNT=$(echo "$METHODS_RESPONSE" | jq -r '.data.methods | length')
        info "Found $METHODS_COUNT payment methods"
    else
        error "Get payment methods failed"
    fi

    # Get products for order creation
    log "Getting products for order..."
    PRODUCTS_RESPONSE=$(curl -s -H "Authorization: Bearer ${TOKEN}" "${BASE_URL}/catalog/products")

    if echo "$PRODUCTS_RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
        PRODUCT_ID=$(echo "$PRODUCTS_RESPONSE" | jq -r '.data.items[0].id // empty')
        PRODUCT_PRICE=$(echo "$PRODUCTS_RESPONSE" | jq -r '.data.items[0].priceCents // 100000')

        if [ -n "$PRODUCT_ID" ]; then
            # Create order
            log "Creating test order..."
            ORDER_RESPONSE=$(curl -s -X POST \
                -H "Authorization: Bearer ${TOKEN}" \
                -H "Content-Type: application/json" \
                "${BASE_URL}/orders" \
                -d "{\"items\":[{\"productId\":\"${PRODUCT_ID}\",\"quantity\":1,\"price\":${PRODUCT_PRICE}}],\"totalAmount\":${PRODUCT_PRICE},\"shippingAddress\":{\"street\":\"123 Test St\",\"city\":\"Test City\",\"country\":\"VN\"},\"paymentMethod\":\"PAYOS\"}")

            if echo "$ORDER_RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
                success "Create order successful"
                ORDER_ID=$(echo "$ORDER_RESPONSE" | jq -r '.data.id')
                info "Created order ID: $ORDER_ID"

                # Create payment intent
                log "Creating payment intent..."
                INTENT_RESPONSE=$(curl -s -X POST \
                    -H "Authorization: Bearer ${TOKEN}" \
                    -H "Content-Type: application/json" \
                    "${BASE_URL}/payments/intents" \
                    -d "{\"orderId\":\"${ORDER_ID}\",\"amount\":${PRODUCT_PRICE},\"currency\":\"VND\",\"provider\":\"PAYOS\",\"description\":\"Test payment\",\"idempotencyKey\":\"test-$(date +%s)\"}")

                if echo "$INTENT_RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
                    success "Create payment intent successful"
                else
                    error "Create payment intent failed: $(echo "$INTENT_RESPONSE" | jq -r '.message // "Unknown error"')"
                fi
            else
                error "Create order failed: $(echo "$ORDER_RESPONSE" | jq -r '.message // "Unknown error"')"
            fi
        else
            warning "No products found, skipping order and payment tests"
        fi
    else
        error "Get products failed"
    fi
}

# Orders
test_orders() {
    section "Orders"

    log "Getting orders..."
    ORDERS_RESPONSE=$(curl -s -H "Authorization: Bearer ${TOKEN}" "${BASE_URL}/orders")

    if echo "$ORDERS_RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
        success "Get orders successful"
        ORDERS_COUNT=$(echo "$ORDERS_RESPONSE" | jq -r '.data.total // 0')
        info "Found $ORDERS_COUNT orders"
    else
        error "Get orders failed"
    fi
}

# Main execution
main() {
    echo -e "${CYAN}🎯 Audio Tài Lộc - Comprehensive API Test Suite${NC}"
    echo -e "${CYAN}$(printf '%.0s=' {1..60})${NC}"
    echo -e "${YELLOW}Started at: $(date)${NC}"
    echo ""

    # Check dependencies
    if ! command -v curl >/dev/null 2>&1; then
        error "curl is required but not installed"
        exit 1
    fi

    if ! command -v jq >/dev/null 2>&1; then
        error "jq is required but not installed"
        exit 1
    fi

    # Run tests
    test_health

    if login; then
        test_categories
        test_file_upload
        test_payments
        test_orders
    else
        error "Cannot proceed without authentication"
        exit 1
    fi

    # Summary
    echo ""
    echo -e "${PURPLE}$(printf '%.0s=' {1..60})${NC}"
    echo -e "${CYAN}📊 Test Summary${NC}"
    echo -e "${GREEN}✅ Passed: $PASSED${NC}"
    echo -e "${RED}❌ Failed: $FAILED${NC}"
    echo -e "${YELLOW}⏱️  Completed at: $(date)${NC}"

    if [ $FAILED -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed!${NC}"
        exit 0
    else
        echo -e "${RED}💥 Some tests failed. Check the output above.${NC}"
        exit 1
    fi
}

# Run main function
main "$@"