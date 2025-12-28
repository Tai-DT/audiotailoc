#!/bin/bash

# Configuration
ADMIN_API_KEY=$(grep ADMIN_API_KEY /Users/macbook/Desktop/audiotailoc/backend/.env | cut -d'=' -f2)
BASE_URL="http://localhost:3010/api/v1"

# Get services
SERVICES=$(curl -s "${BASE_URL}/services?pageSize=10" | jq -r '.data.services[].id')

# Get users
USERS=$(curl -s "${BASE_URL}/users" -H "X-Admin-Key: ${ADMIN_API_KEY}" | jq -r '.data.users[].id')

# Convert to arrays
SERVICE_ARR=($SERVICES)
USER_ARR=($USERS)

echo "Found ${#SERVICE_ARR[@]} services and ${#USER_ARR[@]} users"

# Login to get access token
ACCESS_TOKEN=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@audiotailoc.com","password":"admin123"}' | jq -r '.data.token')

echo "Got access token: ${ACCESS_TOKEN:0:20}..."

# Sample review data
TITLES=(
  "Dịch vụ tuyệt vời!"
  "Rất hài lòng với dịch vụ"
  "Chất lượng âm thanh xuất sắc"
  "Nhân viên chuyên nghiệp"
  "Giá cả hợp lý"
  "Sẽ quay lại lần sau"
  "Dịch vụ tốt hơn mong đợi"
)

COMMENTS=(
  "Kỹ thuật viên rất am hiểu và tận tâm. Hệ thống âm thanh của tôi hoạt động hoàn hảo sau khi được setup."
  "Tư vấn chi tiết, phù hợp với nhu cầu và ngân sách của gia đình."
  "Lắp đặt nhanh gọn, gọn gàng. Chất lượng âm thanh tuyệt vời!"
  "Rất ấn tượng với sự chuyên nghiệp của đội ngũ. Sẽ giới thiệu cho bạn bè."
  "Giá dịch vụ hợp lý so với chất lượng nhận được."
  "Phòng karaoke gia đình giờ đây rất hoàn hảo. Cảm ơn Audio Tài Lộc!"
  "Bảo hành tốt, hỗ trợ kỹ thuật nhiệt tình."
)

STATUSES=("PENDING" "APPROVED" "APPROVED" "APPROVED" "APPROVED")

# Create service reviews
echo "Creating service reviews..."
for i in {0..5}; do
  SERVICE_ID=${SERVICE_ARR[$((i % ${#SERVICE_ARR[@]}))]}
  USER_ID=${USER_ARR[$((i % ${#USER_ARR[@]}))]}
  RATING=$((3 + RANDOM % 3))  # 3-5 stars
  TITLE="${TITLES[$((i % ${#TITLES[@]}))]}"
  COMMENT="${COMMENTS[$((i % ${#COMMENTS[@]}))]}"
  STATUS="${STATUSES[$((i % ${#STATUSES[@]}))]}"
  
  echo "Creating review $((i+1)): Service=$SERVICE_ID, Rating=$RATING, Status=$STATUS"
  
  RESULT=$(curl -s -X POST "${BASE_URL}/service-reviews" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -d "{
      \"serviceId\": \"${SERVICE_ID}\",
      \"rating\": ${RATING},
      \"title\": \"${TITLE}\",
      \"comment\": \"${COMMENT}\"
    }")
  
  REVIEW_ID=$(echo $RESULT | jq -r '.data.id // .id // empty')
  
  if [ -n "$REVIEW_ID" ]; then
    echo "Created review: $REVIEW_ID"
    
    # Update status to APPROVED for some
    if [ "$STATUS" = "APPROVED" ]; then
      curl -s -X PATCH "${BASE_URL}/service-reviews/${REVIEW_ID}/status/APPROVED" \
        -H "X-Admin-Key: ${ADMIN_API_KEY}" > /dev/null
      echo "  -> Approved"
    fi
  else
    echo "Failed to create review: $RESULT"
  fi
done

echo ""
echo "Done! Checking stats..."
curl -s "${BASE_URL}/service-reviews/stats/summary" \
  -H "X-Admin-Key: ${ADMIN_API_KEY}" | jq '.data'
