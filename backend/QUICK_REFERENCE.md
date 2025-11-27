# Promotions System - Quick Reference Guide

## 🚀 Quick Start

### Installation & Migration
```bash
cd backend

# Apply database migration
npx prisma migrate dev --name "add_campaign_and_review_tables"

# Verify migration
npx prisma studio
```

### Import Services
```typescript
import { PromotionCampaignsService } from './services/promotion-campaigns.service';
import { PromotionProjectReviewsService } from './services/promotion-project-reviews.service';
```

---

## 📊 Campaign Operations

### Create Campaign
```typescript
const campaign = await campaignService.createCampaign({
  name: 'Summer Sale',
  description: 'Summer promotion',
  type: CampaignType.SEASONAL,
  promotionIds: ['promo-1', 'promo-2'],
  startDate: new Date('2024-06-01'),
  endDate: new Date('2024-06-30'),
  targetAudience: 'all_customers',
  createdBy: 'admin-id',
});
```

### List Campaigns
```typescript
const { campaigns, total } = await campaignService.listCampaigns({
  status: CampaignStatus.ACTIVE,
  type: CampaignType.EMAIL,
  skip: 0,
  take: 20,
  search: 'summer',
});
```

### Campaign Lifecycle
```typescript
await campaignService.launchCampaign(campaignId);      // Draft → Active
await campaignService.pauseCampaign(campaignId);       // Active → Paused
await campaignService.resumeCampaign(campaignId);      // Paused → Active
await campaignService.endCampaign(campaignId);         // Any → Completed
await campaignService.cancelCampaign(campaignId);      // Any → Cancelled
```

### Manage Promotions
```typescript
// Add promotions
await campaignService.addPromotionsToCampaign(
  campaignId,
  ['promo-3', 'promo-4']
);

// Remove promotions
await campaignService.removePromotionsFromCampaign(
  campaignId,
  ['promo-1']
);
```

### Metrics & Analytics
```typescript
// Track metric
await campaignService.trackMetric(campaignId, 'impression'); // or 'click', 'conversion'

// Get metrics
const metrics = await campaignService.getCampaignMetrics(campaignId);
// Returns: { impressions, clicks, ctr, conversions, conversionRate, revenue, ... }

// Get performance report
const report = await campaignService.getCampaignPerformanceReport(campaignId);
// Returns: { campaign, metrics, promotionStats, timeline }
```

### Campaign Queries
```typescript
const active = await campaignService.getActiveCampaigns();
const upcoming = await campaignService.getUpcomingCampaigns(7);      // Next 7 days
const byCampaign = await campaignService.getCampaignsByPromotionId(promotionId);
```

---

## ⭐ Review Operations

### Create Review
```typescript
const review = await reviewService.createReview({
  projectId: 'proj-123',
  promotionId: 'promo-456',
  userId: 'user-789',
  rating: 5,  // 1-5
  title: 'Great promotion!',
  comment: 'Very satisfied with this deal',
});
// status: PENDING (awaiting approval)
```

### Get Reviews
```typescript
// Get single review
const review = await reviewService.getReviewById(reviewId);

// Get all reviews for promotion
const { reviews, total, averageRating, ratingDistribution } =
  await reviewService.getReviewsForPromotion(projectId, promotionId);

// Get all reviews for project
const { reviews, total } = await reviewService.getProjectReviews(projectId);

// Get user reviews
const { reviews, total } = await reviewService.getUserReviews(userId);

// Get pending reviews (admin)
const { reviews, total } = await reviewService.getPendingReviews();
```

### Manage Reviews
```typescript
// Update review
await reviewService.updateReview(reviewId, {
  rating: 4,
  comment: 'Updated comment',
});

// Delete review
await reviewService.deleteReview(reviewId);
```

### Review Workflow
```typescript
// Admin approval
await reviewService.approveReview(reviewId);    // PENDING → APPROVED
await reviewService.rejectReview(reviewId);     // PENDING → REJECTED
await reviewService.verifyReview(reviewId);     // Mark as verified purchase

// Bulk operations
await reviewService.bulkApproveReviews([id1, id2, id3]);
await reviewService.bulkRejectReviews([id1, id2, id3]);
```

### Community Engagement
```typescript
// Mark as helpful
await reviewService.markAsHelpful(reviewId);
// Increments helpfulCount for visibility ranking
```

### Review Analytics
```typescript
const summary = await reviewService.getReviewSummary(projectId, promotionId);
// Returns: {
//   totalReviews: 25,
//   approvedReviews: 22,
//   pendingReviews: 3,
//   averageRating: 4.6,
//   ratingDistribution: { 5: 15, 4: 7, 3: 0, 2: 0, 1: 0 },
//   helpfulnessScore: 92
// }
```

---

## 🎛️ Campaign Types

```typescript
EMAIL       // Email marketing (10k reach, $500)
SMS         // SMS marketing (5k reach, $300)
PUSH        // Push notifications (20k reach, $200)
SOCIAL      // Social media (50k reach, $1k)
SEASONAL    // Seasonal promo (100k reach, $2k)
FLASH_SALE  // Flash sale (30k reach, $500)
LOYALTY     // Loyalty program (15k reach, $800)
```

## 🔄 Campaign States

```
DRAFT      → Initial state
SCHEDULED  → Scheduled for launch
ACTIVE     → Currently running
PAUSED     → Temporarily stopped
COMPLETED  → Finished successfully
CANCELLED  → Terminated early
```

## ⭐ Review States

```
PENDING    → Awaiting admin approval
APPROVED   → Visible to public
REJECTED   → Hidden from public
```

---

## 🔍 Common Queries

### Get all approved reviews for a promotion
```typescript
const { reviews } = await reviewService.getReviewsForPromotion(
  projectId,
  promotionId,
  { status: 'APPROVED', orderBy: 'newest' }
);
```

### Find high-rated reviews
```typescript
const { reviews } = await reviewService.getReviewsForPromotion(
  projectId,
  promotionId,
  { orderBy: 'highest' }
);
```

### Get helpful reviews
```typescript
const { reviews } = await reviewService.getReviewsForPromotion(
  projectId,
  promotionId,
  { orderBy: 'helpful' }
);
```

### Campaign performance comparison
```typescript
const campaign1 = await campaignService.getCampaignMetrics(campaignId1);
const campaign2 = await campaignService.getCampaignMetrics(campaignId2);

if (campaign1.roi > campaign2.roi) {
  console.log('Campaign 1 has better ROI');
}
```

---

## ❌ Error Handling

### Common Errors

```typescript
try {
  await campaignService.launchCampaign(campaignId);
} catch (error) {
  if (error instanceof BadRequestException) {
    // Handle validation error
    // e.g., "Cannot launch campaign without promotions"
  } else if (error instanceof NotFoundException) {
    // Handle not found
    // e.g., "Campaign not found"
  }
}
```

### Validation Rules

**Campaigns:**
- Name required
- Type must be valid CampaignType
- startDate < endDate
- Cannot launch without promotions

**Reviews:**
- Rating must be 1-5
- Project must exist
- Promotion must exist
- User ID optional

---

## 📈 Performance Tips

### 1. Pagination
```typescript
const { campaigns, total } = await campaignService.listCampaigns({
  skip: 0,
  take: 50,  // Don't fetch all
});
```

### 2. Date Filtering
```typescript
const metrics = await campaignService.getCampaignMetrics(
  campaignId,
  new Date('2024-01-01'),  // startDate
  new Date('2024-12-31')   // endDate
);
```

### 3. Bulk Operations
```typescript
// Better than individual updates
await reviewService.bulkApproveReviews(reviewIds);
```

### 4. Caching
```typescript
// Store frequently accessed campaigns
const activeCache = await campaignService.getActiveCampaigns();
// Refresh every 5 minutes
```

---

## 📝 Data Models

### Campaign
```typescript
{
  id: string;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  promotionIds: string[];
  startDate: Date;
  endDate: Date;
  targetAudience?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

### Review
```typescript
{
  id: string;
  projectId: string;
  promotionId: string;
  userId?: string;
  rating: number;  // 1-5
  title?: string;
  comment?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🧪 Testing

### Test Campaign Creation
```typescript
it('should create campaign', async () => {
  const campaign = await service.createCampaign({
    name: 'Test Campaign',
    type: CampaignType.EMAIL,
    promotionIds: ['promo-1'],
    startDate: new Date(),
    endDate: new Date(),
    createdBy: 'admin-1',
  });

  expect(campaign.id).toBeDefined();
  expect(campaign.status).toBe(CampaignStatus.DRAFT);
});
```

### Test Review Workflow
```typescript
it('should approve review', async () => {
  const review = await service.createReview({...});
  expect(review.status).toBe('PENDING');

  const approved = await service.approveReview(review.id);
  expect(approved.status).toBe('APPROVED');
});
```

---

## 📖 Documentation Links

- Full System Docs: `PROMOTIONS_SYSTEM_COMPLETE.md`
- Migration Guide: `MIGRATION_GUIDE.md`
- Implementation Details: `IMPLEMENTATION_SUMMARY.md`
- Database Schema: `prisma/schema.prisma`

---

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| Campaign not found | Verify campaign ID exists |
| Cannot launch without promotions | Add promotions first |
| Rating must be 1-5 | Use valid rating value |
| Project/Promotion not found | Verify IDs exist |
| Query timeout | Use date filtering |
| Connection pool exceeded | Reduce concurrent requests |

---

## 🎯 Next Steps

1. ✅ Apply database migration
2. ✅ Test campaign creation
3. ✅ Test review creation
4. ✅ Verify metrics tracking
5. ⏳ Implement notifications (Phase 4)
6. ⏳ Add email templates (Phase 5)
7. ⏳ Add analytics caching (Phase 6)

---

**Last Updated:** November 2025
**Version:** 1.0
**Status:** Ready for Production
