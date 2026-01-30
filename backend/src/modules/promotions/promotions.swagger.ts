import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

/**
 * Public Promotion Endpoints Swagger Documentation
 */
export const GetPromotionsSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all active promotions',
      description: 'Retrieve a list of all active promotions with optional filters',
    }),
    ApiQuery({
      name: 'isActive',
      required: false,
      type: 'string',
      description: 'Filter by active status (true/false)',
    }),
    ApiQuery({
      name: 'type',
      required: false,
      type: 'string',
      description: 'Filter by promotion type',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: 'string',
      description: 'Search promotions by code or description',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: 'number',
      description: 'Number of results (default: 50)',
    }),
    ApiQuery({
      name: 'offset',
      required: false,
      type: 'number',
      description: 'Offset for pagination (default: 0)',
    }),
    ApiResponse({
      status: 200,
      description: 'List of promotions',
      schema: {
        example: {
          success: true,
          data: [
            {
              id: 'promo-123',
              code: 'SUMMER20',
              description: 'Summer discount 20%',
              discountPercentage: 20,
              isActive: true,
              startDate: '2025-12-01T00:00:00Z',
              endDate: '2025-12-31T23:59:59Z',
            },
          ],
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );

export const GetPromotionByCodeSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get promotion by code',
      description: 'Retrieve a specific promotion by its code for validation',
    }),
    ApiParam({ name: 'code', type: 'string', description: 'Promotion code' }),
    ApiResponse({
      status: 200,
      description: 'Promotion details',
      schema: {
        example: {
          success: true,
          data: {
            id: 'promo-123',
            code: 'SUMMER20',
            description: 'Summer discount 20%',
            discountPercentage: 20,
            maxUsage: 1000,
            usageCount: 250,
          },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'Promotion not found' }),
  );

export const ApplyPromotionToCartSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Apply promotion to cart',
      description: 'Apply a promotion code to shopping cart and calculate discount',
    }),
    ApiBody({
      schema: {
        example: {
          cartTotal: 500000,
          items: [{ productId: 'prod-1', quantity: 2, price: 250000 }],
          promotionCode: 'SUMMER20',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Promotion applied successfully',
      schema: {
        example: {
          success: true,
          data: {
            originalTotal: 500000,
            discountAmount: 100000,
            finalTotal: 400000,
            discountPercentage: 20,
            promotionCode: 'SUMMER20',
          },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Invalid promotion code or cart' }),
  );

/**
 * Admin Campaign Endpoints Swagger Documentation
 */
export const CreateCampaignSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new campaign',
      description: 'Create a new marketing campaign to organize and link promotions',
    }),
    ApiBody({
      schema: {
        example: {
          name: 'Summer Flash Sale',
          description: 'Limited time summer promotion',
          type: 'FLASH_SALE',
          startDate: '2025-12-01T00:00:00Z',
          endDate: '2025-12-31T23:59:59Z',
          targetAudience: 'Summer shoppers',
          budget: 5000,
          expectedReach: 50000,
          priority: 1,
          promotionIds: ['promo-123', 'promo-456'],
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Campaign created successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: 'camp-789',
            name: 'Summer Flash Sale',
            status: 'DRAFT',
            createdAt: '2025-11-25T10:30:00Z',
          },
        },
      },
    }),
  );

export const LaunchCampaignSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Launch campaign',
      description: 'Change campaign status from DRAFT to ACTIVE',
    }),
    ApiParam({ name: 'id', type: 'string', description: 'Campaign ID' }),
    ApiResponse({
      status: 200,
      description: 'Campaign launched successfully',
      schema: {
        example: {
          success: true,
          data: { id: 'camp-789', status: 'ACTIVE', startDate: '2025-12-01T00:00:00Z' },
          message: 'Campaign launched successfully',
        },
      },
    }),
  );

export const GetCampaignMetricsSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get campaign metrics',
      description: 'Retrieve performance metrics for a campaign',
    }),
    ApiParam({ name: 'id', type: 'string', description: 'Campaign ID' }),
    ApiResponse({
      status: 200,
      description: 'Campaign metrics',
      schema: {
        example: {
          success: true,
          data: {
            campaignId: 'camp-789',
            impressions: 50000,
            clicks: 5000,
            ctr: 0.1,
            conversions: 500,
            conversionRate: 0.1,
            revenue: 2500000,
            roi: 400,
          },
        },
      },
    }),
  );

/**
 * Admin Project/Review Endpoints Swagger Documentation
 */
export const LinkPromotionToProjectSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Link promotion to project',
      description: 'Associate a promotion with a product/project',
    }),
    ApiParam({ name: 'projectId', type: 'string', description: 'Project ID' }),
    ApiParam({ name: 'promotionId', type: 'string', description: 'Promotion ID' }),
    ApiBody({
      schema: {
        example: {
          discountPercentage: 20,
          discountAmount: 50000,
          priority: 1,
          startDate: '2025-12-01T00:00:00Z',
          endDate: '2025-12-31T23:59:59Z',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Promotion linked successfully',
    }),
  );

export const AddPromotionReviewSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Add review for promotion',
      description: 'Submit a customer review for a promotion on a project',
    }),
    ApiParam({ name: 'projectId', type: 'string', description: 'Project ID' }),
    ApiParam({ name: 'promotionId', type: 'string', description: 'Promotion ID' }),
    ApiBody({
      schema: {
        example: {
          rating: 5,
          title: 'Great discount!',
          comment: 'This promotion saved me a lot of money. Excellent value.',
          wouldRecommend: true,
          verifiedPurchase: true,
          promotionImpact: 'positive',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Review added successfully',
      schema: {
        example: {
          success: true,
          data: {
            reviewId: 'review_123',
            rating: 5,
            promotionImpact: 'positive',
            helpfulCount: 0,
          },
        },
      },
    }),
  );

export const GetProjectReviewSummarySwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get project review summary',
      description: 'Get comprehensive review analytics for a project',
    }),
    ApiParam({ name: 'projectId', type: 'string', description: 'Project ID' }),
    ApiResponse({
      status: 200,
      description: 'Review summary',
      schema: {
        example: {
          success: true,
          data: {
            projectId: 'proj-123',
            totalReviews: 234,
            averageRating: 4.56,
            ratingDistribution: {
              fiveStar: 180,
              fourStar: 40,
              threeStar: 10,
              twoStar: 3,
              oneStar: 1,
            },
            recommendationRate: 92.31,
            topPositiveKeywords: ['quality', 'value', 'satisfied', 'excellent'],
            topNegativeKeywords: ['limited', 'expensive'],
          },
        },
      },
    }),
  );

/**
 * Admin Settings Endpoints Swagger Documentation
 */
export const GetGlobalSettingsSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get global promotion settings',
      description: 'Retrieve system-wide promotion configuration',
    }),
    ApiResponse({
      status: 200,
      description: 'Global settings',
      schema: {
        example: {
          success: true,
          data: {
            maxConcurrentPromotions: 5,
            maxPromotionsPerOrder: 1,
            allowStackingPromotions: false,
            maxDiscountPercentage: 50,
            requireVerifiedEmail: true,
            auditAllTransactions: true,
          },
        },
      },
    }),
  );

export const UpdateGlobalSettingsSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update global promotion settings',
      description: 'Modify system-wide promotion configuration',
    }),
    ApiBody({
      schema: {
        example: {
          maxDiscountPercentage: 60,
          maxPromotionsPerOrder: 2,
          allowStackingPromotions: true,
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Settings updated successfully',
    }),
  );

export const ValidatePromotionSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Validate promotion',
      description: 'Check if a promotion meets all system requirements',
    }),
    ApiBody({
      schema: {
        example: {
          code: 'SUMMER20',
          discountPercentage: 20,
          duration: 30,
          customerEmail: 'user@example.com',
          customerAccountAge: 10,
          orderValue: 500000,
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Validation result',
      schema: {
        example: {
          success: true,
          data: {
            isValid: true,
            errors: [],
            warnings: ['This promotion requires approval before launch'],
          },
        },
      },
    }),
  );

export const CreateABTestSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create A/B test',
      description: 'Set up a split-test to compare two promotion codes',
    }),
    ApiBody({
      schema: {
        example: {
          promotionId: 'promo-123',
          controlGroupPromotion: 'SUMMER20',
          testGroupPromotion: 'SUMMER25',
          splitPercentage: 50,
          startDate: '2025-12-01T00:00:00Z',
          endDate: '2025-12-31T23:59:59Z',
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'A/B test created',
      schema: {
        example: {
          success: true,
          data: {
            testId: 'test_123',
            status: 'draft',
            metrics: { controlConversions: 0, testConversions: 0 },
          },
        },
      },
    }),
  );

export const ConcludeABTestSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Conclude A/B test',
      description: 'End the test and determine the winning promotion code',
    }),
    ApiParam({ name: 'testId', type: 'string', description: 'Test ID' }),
    ApiResponse({
      status: 200,
      description: 'Test concluded',
      schema: {
        example: {
          success: true,
          data: {
            testId: 'test_123',
            status: 'completed',
            winner: 'test',
            metrics: {
              controlConversions: 150,
              testConversions: 165,
              statisticalSignificance: 0.847,
            },
          },
          message: 'A/B test concluded - Winner: test',
        },
      },
    }),
  );

export const CreateFraudRuleSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create fraud detection rule',
      description: 'Add a new rule to the fraud detection system',
    }),
    ApiBody({
      schema: {
        example: {
          name: 'Velocity Check',
          description: 'Detect rapid-fire promo usage',
          enabled: true,
          riskLevel: 'high',
          action: 'block',
          flagSuspiciousVelocity: true,
          maxUsesPerIPAddress: 5,
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Rule created',
    }),
  );

export const CheckFraudSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Check transaction for fraud',
      description: 'Run a transaction through fraud detection rules',
    }),
    ApiBody({
      schema: {
        example: {
          customerId: 'cust-123',
          ipAddress: '192.168.1.1',
          deviceId: 'device-456',
          location: 'Ho Chi Minh City, VN',
          accountAge: 5,
          promotionCode: 'SUMMER20',
          amount: 50000,
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Fraud check result',
      schema: {
        example: {
          success: true,
          data: {
            isFraudulent: false,
            riskLevel: 'low',
            triggeredRules: [],
            recommendations: [],
          },
        },
      },
    }),
  );

export const AnalyticsConfigSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create/Update analytics configuration',
      description: 'Configure what metrics and dimensions to track',
    }),
    ApiBody({
      schema: {
        example: {
          trackDimensions: ['product_id', 'customer_segment', 'region'],
          trackMetrics: ['conversions', 'revenue', 'roi'],
          customDashboards: [
            {
              name: 'Performance Dashboard',
              metrics: ['conversions', 'roi'],
              filters: { timeRange: '30d' },
            },
          ],
          alertRules: [
            {
              name: 'Low ROI Alert',
              metric: 'roi',
              operator: 'lt',
              threshold: 100,
              notifyEmail: ['admin@example.com'],
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Configuration updated',
    }),
  );
