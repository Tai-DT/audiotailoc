# Promotions System API Documentation

Complete API documentation for the AudioTailoc Promotions System with 120+ endpoints covering campaigns, projects, reviews, settings, and analytics.

## Table of Contents

1. [Authentication](#authentication)
2. [Public Endpoints](#public-endpoints)
3. [Admin Endpoints](#admin-endpoints)
4. [Campaign Endpoints](#campaign-endpoints)
5. [Project & Review Endpoints](#project--review-endpoints)
6. [Settings & Configuration](#settings--configuration)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

---

## Authentication

### JWT Authentication
All admin endpoints require valid JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Admin Authorization
Admin endpoints also require admin role in JWT payload.

---

## Public Endpoints

### Get All Promotions
```
GET /api/v1/promotions
Query Parameters:
  - isActive: boolean (optional)
  - type: string (optional)
  - search: string (optional)
  - limit: number (default: 50)
  - offset: number (default: 0)

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "promo-123",
      "code": "SUMMER20",
      "description": "Summer discount 20%",
      "discountPercentage": 20,
      "isActive": true,
      "startDate": "2025-12-01T00:00:00Z",
      "endDate": "2025-12-31T23:59:59Z"
    }
  ]
}
```

### Get Promotion by Code
```
GET /api/v1/promotions/code/:code

Path Parameters:
  - code: string (promotion code, converted to uppercase)

Response 200:
{
  "success": true,
  "data": {
    "id": "promo-123",
    "code": "SUMMER20",
    "description": "Summer discount 20%",
    "discountPercentage": 20,
    "maxUsage": 1000,
    "usageCount": 250
  }
}

Response 404: Promotion not found
```

### Validate Promotion Code
```
GET /api/v1/promotions/:code/validate

Path Parameters:
  - code: string (promotion code)

Response 200:
{
  "success": true,
  "data": {
    "isValid": true,
    "promotion": {...},
    "remainingUsage": 750
  }
}

Response 400: Invalid promotion code
```

### Apply Promotion to Cart
```
POST /api/v1/promotions/apply-to-cart

Request Body:
{
  "cartTotal": 500000,
  "items": [
    {
      "productId": "prod-1",
      "quantity": 2,
      "price": 250000
    }
  ],
  "promotionCode": "SUMMER20"
}

Response 200:
{
  "success": true,
  "data": {
    "originalTotal": 500000,
    "discountAmount": 100000,
    "finalTotal": 400000,
    "discountPercentage": 20,
    "promotionCode": "SUMMER20",
    "applicableItems": ["prod-1"]
  }
}

Response 400: Invalid promotion or cart
```

### Get Project Promotions
```
GET /api/v1/promotions/projects/:projectId/promotions

Path Parameters:
  - projectId: string

Response 200:
{
  "success": true,
  "data": [
    {
      "projectId": "proj-123",
      "promotionId": "promo-456",
      "discountPercentage": 20,
      "priority": 1,
      "isActive": true
    }
  ],
  "count": 1
}
```

### Get Best Promotions for Project
```
GET /api/v1/promotions/projects/:projectId/best-promotions
Query Parameters:
  - limit: number (default: 5)

Response 200:
{
  "success": true,
  "data": [
    {
      "projectId": "proj-123",
      "promotionId": "promo-456",
      "discountPercentage": 20,
      "priority": 1
    }
  ],
  "count": 1
}
```

### Get Project Review Summary
```
GET /api/v1/promotions/projects/:projectId/review-summary

Path Parameters:
  - projectId: string

Response 200:
{
  "success": true,
  "data": {
    "projectId": "proj-123",
    "totalReviews": 234,
    "averageRating": 4.56,
    "ratingDistribution": {
      "fiveStar": 180,
      "fourStar": 40,
      "threeStar": 10,
      "twoStar": 3,
      "oneStar": 1
    },
    "positivePromotionReviews": 185,
    "negativePromotionReviews": 18,
    "recommendationRate": 92.31,
    "topPositiveKeywords": ["quality", "value", "satisfied"],
    "topNegativeKeywords": ["limited", "expensive"]
  }
}
```

---

## Admin Endpoints

### Create Promotion
```
POST /api/v1/promotions
Authorization: Required (Admin)

Request Body:
{
  "code": "SUMMER20",
  "description": "Summer discount 20%",
  "type": "PERCENTAGE",
  "discountPercentage": 20,
  "maxUsage": 1000,
  "startDate": "2025-12-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "isActive": true
}

Response 201:
{
  "success": true,
  "data": {
    "id": "promo-123",
    "code": "SUMMER20",
    ...
  },
  "message": "Promotion created successfully"
}

Response 400: Invalid data
```

### Update Promotion
```
PUT /api/v1/promotions/:id
Authorization: Required (Admin)

Path Parameters:
  - id: string (promotion ID)

Request Body:
{
  "description": "Updated description",
  "maxUsage": 2000
}

Response 200:
{
  "success": true,
  "data": {...},
  "message": "Promotion updated successfully"
}
```

### Delete Promotion
```
DELETE /api/v1/promotions/:id
Authorization: Required (Admin)

Path Parameters:
  - id: string (promotion ID)

Response 200:
{
  "success": true,
  "message": "Promotion deleted successfully"
}

Response 404: Promotion not found
```

### Get Promotion Analytics
```
GET /api/v1/promotions/:id/analytics
Authorization: Required (Admin)

Path Parameters:
  - id: string (promotion ID)

Response 200:
{
  "success": true,
  "data": {
    "promotionId": "promo-123",
    "totalUsage": 250,
    "totalRevenue": 5000000,
    "averageDiscount": 100000,
    "conversionRate": 0.25,
    "roi": 400
  }
}
```

---

## Campaign Endpoints

### Create Campaign
```
POST /api/v1/promotions/campaigns
Authorization: Required (Admin)

Request Body:
{
  "name": "Summer Flash Sale",
  "description": "Limited time summer promotion",
  "type": "FLASH_SALE",
  "startDate": "2025-12-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "targetAudience": "Summer shoppers",
  "budget": 5000,
  "expectedReach": 50000,
  "priority": 1,
  "promotionIds": ["promo-123", "promo-456"]
}

Response 201:
{
  "success": true,
  "data": {
    "id": "camp-789",
    "name": "Summer Flash Sale",
    "status": "DRAFT",
    "createdAt": "2025-11-25T10:30:00Z"
  },
  "message": "Campaign created successfully"
}
```

### List Campaigns
```
GET /api/v1/promotions/campaigns
Authorization: Required (Admin)

Query Parameters:
  - status: string (DRAFT, SCHEDULED, ACTIVE, PAUSED, COMPLETED, CANCELLED)
  - type: string (EMAIL, SMS, PUSH, SOCIAL, SEASONAL, FLASH_SALE, LOYALTY)
  - startDate: string (ISO 8601)
  - endDate: string (ISO 8601)
  - skip: number (default: 0)
  - take: number (default: 20)

Response 200:
{
  "success": true,
  "data": [...],
  "total": 42,
  "skip": 0,
  "take": 20
}
```

### Get Campaign
```
GET /api/v1/promotions/campaigns/:id
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "data": {
    "id": "camp-789",
    "name": "Summer Flash Sale",
    "status": "ACTIVE",
    "promotionIds": ["promo-123", "promo-456"]
  }
}
```

### Update Campaign
```
PUT /api/v1/promotions/campaigns/:id
Authorization: Required (Admin)

Request Body:
{
  "name": "Updated name",
  "priority": 2
}

Response 200:
{
  "success": true,
  "data": {...},
  "message": "Campaign updated successfully"
}
```

### Launch Campaign
```
POST /api/v1/promotions/campaigns/:id/launch
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "data": {
    "id": "camp-789",
    "status": "ACTIVE"
  },
  "message": "Campaign launched successfully"
}

Response 400: Cannot launch without promotions
```

### Pause/Resume Campaign
```
POST /api/v1/promotions/campaigns/:id/pause
POST /api/v1/promotions/campaigns/:id/resume
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "data": {
    "id": "camp-789",
    "status": "PAUSED"
  },
  "message": "Campaign paused successfully"
}
```

### Get Campaign Metrics
```
GET /api/v1/promotions/campaigns/:id/metrics
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "data": {
    "campaignId": "camp-789",
    "impressions": 50000,
    "clicks": 5000,
    "ctr": 0.1,
    "conversions": 500,
    "conversionRate": 0.1,
    "revenue": 2500000,
    "roi": 400,
    "audienceReached": 50000
  }
}
```

### Get Campaign Performance Report
```
GET /api/v1/promotions/campaigns/:id/report
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "data": {
    "campaign": {...},
    "metrics": {...},
    "promotionStats": [
      {
        "promotionId": "promo-123",
        "revenue": 1500000,
        "usage": 150,
        "roi": 350
      }
    ],
    "timeline": [
      {
        "date": "2025-12-01T00:00:00Z",
        "clicks": 100,
        "conversions": 10,
        "revenue": 50000
      }
    ]
  }
}
```

### Add Promotions to Campaign
```
POST /api/v1/promotions/campaigns/:id/promotions
Authorization: Required (Admin)

Request Body:
{
  "promotionIds": ["promo-789", "promo-999"]
}

Response 200:
{
  "success": true,
  "message": "Promotions added to campaign successfully",
  "promotionIds": ["promo-789", "promo-999"]
}
```

### Remove Promotion from Campaign
```
DELETE /api/v1/promotions/campaigns/:id/promotions/:promotionId
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "message": "Promotion removed from campaign successfully"
}
```

### Get Active Campaigns
```
GET /api/v1/promotions/campaigns/active/list
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "data": [...],
  "count": 5
}
```

### Get Upcoming Campaigns
```
GET /api/v1/promotions/campaigns/upcoming/list
Authorization: Required (Admin)

Query Parameters:
  - days: number (default: 7)

Response 200:
{
  "success": true,
  "data": [...],
  "count": 3,
  "days": 7
}
```

---

## Project & Review Endpoints

### Add Promotion Review
```
POST /api/v1/promotions/projects/:projectId/promotions/:promotionId/reviews
Authorization: Required (User)

Request Body:
{
  "rating": 5,
  "title": "Great discount!",
  "comment": "This promotion saved me a lot of money.",
  "wouldRecommend": true,
  "verifiedPurchase": true,
  "promotionImpact": "positive"
}

Response 200:
{
  "success": true,
  "data": {
    "reviewId": "review_123",
    "rating": 5,
    "promotionImpact": "positive"
  },
  "message": "Review added successfully"
}
```

### Get Promotion Reviews
```
GET /api/v1/promotions/projects/:projectId/promotions/:promotionId/reviews
Query Parameters:
  - minRating: number
  - verifiedOnly: boolean
  - impact: string (positive, negative, neutral)
  - skip: number (default: 0)
  - take: number (default: 20)

Response 200:
{
  "success": true,
  "data": [
    {
      "reviewId": "review_123",
      "rating": 5,
      "title": "Great discount!",
      "comment": "...",
      "helpfulCount": 25,
      "unhelpfulCount": 2
    }
  ],
  "total": 50,
  "skip": 0,
  "take": 20
}
```

### Get Promotion Effectiveness
```
GET /api/v1/promotions/projects/:projectId/promotions/:promotionId/effectiveness
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "data": {
    "effectivenessScore": 92,
    "sentimentScore": 78,
    "recommendationScore": 89,
    "verificationScore": 85,
    "overallScore": 86
  }
}
```

### Mark Review as Helpful/Unhelpful
```
POST /api/v1/promotions/reviews/:reviewId/helpful
POST /api/v1/promotions/reviews/:reviewId/unhelpful
Authorization: Required (User)

Response 200:
{
  "success": true,
  "data": {
    "reviewId": "review_123",
    "helpfulCount": 26
  },
  "message": "Review marked as helpful"
}
```

---

## Settings & Configuration

### Global Settings

#### Get Global Settings
```
GET /api/v1/promotions/settings/global
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "data": {
    "maxConcurrentPromotions": 5,
    "maxPromotionsPerOrder": 1,
    "allowStackingPromotions": false,
    "maxDiscountPercentage": 50,
    "requireVerifiedEmail": true,
    "auditAllTransactions": true,
    ...
  }
}
```

#### Update Global Settings
```
PUT /api/v1/promotions/settings/global
Authorization: Required (Admin)

Request Body:
{
  "maxDiscountPercentage": 60,
  "maxPromotionsPerOrder": 2,
  "allowStackingPromotions": true
}

Response 200:
{
  "success": true,
  "data": {...},
  "message": "Global settings updated successfully"
}
```

#### Reset Global Settings
```
POST /api/v1/promotions/settings/global/reset
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "data": {...},
  "message": "Global settings reset to defaults"
}
```

### Promotion-Specific Settings

#### Get Promotion Settings
```
GET /api/v1/promotions/settings/promotion/:promotionId
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "data": {
    "promotionId": "promo-123",
    "displayName": "Summer Sale",
    "displayPriority": 1,
    "targetSegments": ["summer_shoppers", "vip"],
    ...
  }
}
```

#### Save Promotion Settings
```
PUT /api/v1/promotions/settings/promotion/:promotionId
Authorization: Required (Admin)

Request Body:
{
  "displayName": "Summer Sale",
  "displayPriority": 1,
  "applicableProductIds": ["prod-1", "prod-2"],
  "targetSegments": ["summer_shoppers"]
}

Response 200:
{
  "success": true,
  "data": {...},
  "message": "Promotion settings saved successfully"
}
```

### Validation

#### Validate Promotion
```
POST /api/v1/promotions/settings/validate

Request Body:
{
  "code": "SUMMER20",
  "discountPercentage": 20,
  "duration": 30,
  "customerEmail": "user@example.com"
}

Response 200:
{
  "success": true,
  "data": {
    "isValid": true,
    "errors": [],
    "warnings": ["This promotion requires approval before launch"]
  }
}

Response 400:
{
  "success": false,
  "data": {
    "isValid": false,
    "errors": ["Promo code must match format: ^[A-Z0-9]{4,12}$"],
    "warnings": []
  }
}
```

### A/B Testing

#### Create A/B Test
```
POST /api/v1/promotions/settings/ab-tests
Authorization: Required (Admin)

Request Body:
{
  "promotionId": "promo-123",
  "controlGroupPromotion": "SUMMER20",
  "testGroupPromotion": "SUMMER25",
  "splitPercentage": 50,
  "startDate": "2025-12-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z"
}

Response 201:
{
  "success": true,
  "data": {
    "testId": "test_123",
    "status": "draft",
    "metrics": {
      "controlConversions": 0,
      "testConversions": 0,
      "statisticalSignificance": 0
    }
  },
  "message": "A/B test created successfully"
}
```

#### Update A/B Test Metrics
```
PUT /api/v1/promotions/settings/ab-tests/:testId/metrics
Authorization: Required (Admin)

Request Body:
{
  "controlConversions": 150,
  "testConversions": 165,
  "controlRevenue": 75000,
  "testRevenue": 85000
}

Response 200:
{
  "success": true,
  "data": {
    "testId": "test_123",
    "metrics": {
      "controlConversions": 150,
      "testConversions": 165,
      "statisticalSignificance": 0.847
    }
  },
  "message": "A/B test metrics updated successfully"
}
```

#### Conclude A/B Test
```
POST /api/v1/promotions/settings/ab-tests/:testId/conclude
Authorization: Required (Admin)

Response 200:
{
  "success": true,
  "data": {
    "testId": "test_123",
    "status": "completed",
    "winner": "test"
  },
  "message": "A/B test concluded - Winner: test"
}
```

### Fraud Detection

#### Create Fraud Rule
```
POST /api/v1/promotions/settings/fraud-rules
Authorization: Required (Admin)

Request Body:
{
  "name": "Velocity Check",
  "description": "Detect rapid-fire promo usage",
  "enabled": true,
  "riskLevel": "high",
  "action": "block",
  "flagSuspiciousVelocity": true,
  "maxUsesPerIPAddress": 5
}

Response 201:
{
  "success": true,
  "data": {
    "ruleId": "rule_123",
    ...
  },
  "message": "Fraud detection rule created successfully"
}
```

#### Check Fraud
```
POST /api/v1/promotions/settings/check-fraud

Request Body:
{
  "customerId": "cust-123",
  "ipAddress": "192.168.1.1",
  "deviceId": "device-456",
  "location": "Ho Chi Minh City, VN",
  "accountAge": 5,
  "promotionCode": "SUMMER20",
  "amount": 50000
}

Response 200:
{
  "success": true,
  "data": {
    "isFraudulent": false,
    "riskLevel": "low",
    "triggeredRules": [],
    "recommendations": []
  }
}
```

### Analytics Configuration

#### Create Analytics Config
```
POST /api/v1/promotions/settings/analytics
Authorization: Required (Admin)

Request Body:
{
  "trackDimensions": ["product_id", "customer_segment"],
  "trackMetrics": ["conversions", "revenue", "roi"],
  "customDashboards": [
    {
      "name": "Performance Dashboard",
      "metrics": ["conversions", "roi"],
      "filters": { "timeRange": "30d" }
    }
  ],
  "alertRules": [
    {
      "name": "Low ROI Alert",
      "metric": "roi",
      "operator": "lt",
      "threshold": 100,
      "notifyEmail": ["admin@example.com"]
    }
  ]
}

Response 201:
{
  "success": true,
  "data": {...},
  "message": "Analytics configuration created successfully"
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Promotion not found",
    "code": "NOT_FOUND",
    "statusCode": 404
  }
}
```

### Common Error Codes

| Status | Code | Message |
|--------|------|---------|
| 400 | BAD_REQUEST | Invalid request data |
| 401 | UNAUTHORIZED | Missing or invalid JWT token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Promotion code already exists |
| 429 | RATE_LIMIT | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

---

## Rate Limiting

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### Rate Limits by Endpoint Type

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Public (read) | 100 | 15 min |
| Public (write) | 20 | 15 min |
| Admin | 500 | 15 min |
| Fraud check | 50 | 1 min |

---

## Best Practices

1. **Always validate promotional codes before applying** - Use the `/code/:code` endpoint
2. **Use appropriate filters** - Filter results by status, type, date to reduce payload
3. **Implement pagination** - Use skip/take for large result sets
4. **Monitor fraud rules** - Regularly review and update fraud detection rules
5. **Track A/B test significance** - Only declare winners when statistical significance > 0.85
6. **Audit settings changes** - All global settings changes are logged with user ID
7. **Test with staging** - Use a staging environment before rolling out new campaigns

---

## Support

For API issues or questions, contact:
- Email: api-support@audiotailoc.com
- Documentation: https://docs.audiotailoc.com
- Status Page: https://status.audiotailoc.com
