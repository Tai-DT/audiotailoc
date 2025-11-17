#!/bin/bash

# Performance Test Script for Audio Tài Lộc Backend
# Usage: ./scripts/run-performance-test.sh

set -e

echo "🚀 Starting Performance Test for Audio Tài Lộc Backend"
echo "=================================================="

# Check if Artillery is installed
if ! command -v artillery &> /dev/null; then
    echo "📦 Installing Artillery..."
    npm install -g artillery
fi

# Check if backend is running
echo "🔍 Checking if backend is running..."
if ! curl -s http://localhost:3010/api/v1/health > /dev/null; then
    echo "❌ Backend is not running. Please start the backend first:"
    echo "   cd backend && npm run start:dev"
    exit 1
fi

echo "✅ Backend is running"

# Create test data directory
mkdir -p test-data/performance

# Create test image for upload
echo "📄 Creating test image..."
convert -size 100x100 xc:blue test-data/performance/test-image.png 2>/dev/null || {
    echo "⚠️  ImageMagick not found. Using existing test image or creating simple one..."
    # Create a simple PNG using base64 if ImageMagick is not available
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > test-data/performance/test-image.png
}

# Run performance test
echo "🎯 Running performance test..."
artillery run artillery-performance-test.yml --output test-data/performance/results.json

# Generate report
echo "📊 Generating performance report..."
artillery report test-data/performance/results.json --output test-data/performance/report.html

# Display results
echo ""
echo "📈 Performance Test Results:"
echo "=========================="

# Extract key metrics using jq if available
if command -v jq &> /dev/null; then
    echo "📊 Total Requests: $(jq '.aggregate.counters.http_requests' test-data/performance/results.json)"
    echo "✅ Successful Requests: $(jq '.aggregate.counters.http_requests_2xx' test-data/performance/results.json)"
    echo "❌ Failed Requests: $(jq '.aggregate.counters.http_requests_4xx + .aggregate.counters.http_requests_5xx' test-data/performance/results.json)"
    echo "⏱️  Average Response Time: $(jq '.aggregate.latency.mean' test-data/performance/results.json)ms"
    echo "🔥 Max Response Time: $(jq '.aggregate.latency.max' test-data/performance/results.json)ms"
    echo "📏 P95 Response Time: $(jq '.aggregate.latency.p95' test-data/performance/results.json)ms"
    echo "🔥 P99 Response Time: $(jq '.aggregate.latency.p99' test-data/performance/results.json)ms"
else
    echo "📊 Detailed results saved to: test-data/performance/results.json"
    echo "📈 HTML report generated at: test-data/performance/report.html"
fi

# Performance thresholds check
echo ""
echo "🔍 Performance Analysis:"
echo "======================="

if command -v jq &> /dev/null; then
    # Check response times
    AVG_RESPONSE_TIME=$(jq '.aggregate.latency.mean' test-data/performance/results.json)
    P95_RESPONSE_TIME=$(jq '.aggregate.latency.p95' test-data/performance/results.json)
    SUCCESS_RATE=$(jq '(.aggregate.counters.http_requests_2xx / .aggregate.counters.http_requests) * 100' test-data/performance/results.json)
    
    # Performance thresholds
    TARGET_AVG=500  # 500ms average response time
    TARGET_P95=1000 # 1000ms P95 response time
    TARGET_SUCCESS=99 # 99% success rate
    
    if (( $(echo "$AVG_RESPONSE_TIME < $TARGET_AVG" | bc -l) )); then
        echo "✅ Average response time (${AVG_RESPONSE_TIME}ms) is within target (<${TARGET_AVG}ms)"
    else
        echo "❌ Average response time (${AVG_RESPONSE_TIME}ms) exceeds target (<${TARGET_AVG}ms)"
    fi
    
    if (( $(echo "$P95_RESPONSE_TIME < $TARGET_P95" | bc -l) )); then
        echo "✅ P95 response time (${P95_RESPONSE_TIME}ms) is within target (<${TARGET_P95}ms)"
    else
        echo "❌ P95 response time (${P95_RESPONSE_TIME}ms) exceeds target (<${TARGET_P95}ms)"
    fi
    
    if (( $(echo "$SUCCESS_RATE > $TARGET_SUCCESS" | bc -l) )); then
        echo "✅ Success rate (${SUCCESS_RATE}%) is within target (>${TARGET_SUCCESS}%)"
    else
        echo "❌ Success rate (${SUCCESS_RATE}%) is below target (>${TARGET_SUCCESS}%)"
    fi
fi

echo ""
echo "📁 Files generated:"
echo "   - Raw results: test-data/performance/results.json"
echo "   - HTML report: test-data/performance/report.html"
echo ""
echo "🌐 Open the HTML report in your browser to view detailed results:"
echo "   open test-data/performance/report.html"
echo ""
echo "🎉 Performance test completed!"