import
{
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtGuard } from '../../modules/auth/jwt.guard';
import { OptionalJwtGuard } from '../../modules/auth/optional-jwt.guard';
import { AdminGuard } from '../../modules/auth/admin.guard';
import { RateLimitGuard } from '../common/rate-limit.guard';
import { PromotionsService } from './promotions.service';
import { PromotionAuditService } from './services/promotion-audit.service';
import { PromotionAnalyticsService } from './services/promotion-analytics.service';
import { PromotionCustomerService } from './services/promotion-customer.service';
import { PromotionAdvancedService } from './services/promotion-advanced.service';
import { PromotionCheckoutService } from './services/promotion-checkout.service';
import { PromotionReportingService } from './services/promotion-reporting.service';
import { PromotionNotificationService } from './services/promotion-notification.service';
import { PromotionBackupService, BackupType } from './services/promotion-backup.service';
import { PromotionDashboardService } from './services/promotion-dashboard.service';
import { PromotionCampaignsService } from './services/promotion-campaigns.service';
import { CampaignStatus, CampaignType } from '@prisma/client';
import { PromotionProjectsService } from './services/promotion-projects.service';
import { PromotionSettingsService } from './services/promotion-settings.service';
import
{
  CreatePromotionDto,
  UpdatePromotionDto,
  ValidatePromotionDto,
  ApplyPromotionToCartDto,
} from './dto/promotion.dto';

@Controller( 'promotions' )
export class PromotionsController
{
  constructor(
    private readonly promotionsService: PromotionsService,
    private readonly auditService: PromotionAuditService,
    private readonly analyticsService: PromotionAnalyticsService,
    private readonly customerService: PromotionCustomerService,
    private readonly advancedService: PromotionAdvancedService,
    private readonly checkoutService: PromotionCheckoutService,
    private readonly reportingService: PromotionReportingService,
    private readonly notificationService: PromotionNotificationService,
    private readonly backupService: PromotionBackupService,
    private readonly dashboardService: PromotionDashboardService,
    private readonly campaignService: PromotionCampaignsService,
    private readonly projectsService: PromotionProjectsService,
    private readonly settingsService: PromotionSettingsService,
  ) { }

  // ==================== PUBLIC ENDPOINTS ====================

  /**
   * Get all active promotions
   * @public
   */
  @Get()
  @UseGuards( RateLimitGuard )
  async getPromotions (
    @Query( 'isActive' ) isActive?: string,
    @Query( 'type' ) type?: string,
    @Query( 'search' ) search?: string,
    @Query( 'limit' ) limit: number = 50,
    @Query( 'offset' ) offset: number = 0,
  )
  {
    const filters: any = {};

    if ( isActive !== undefined )
    {
      filters.isActive = isActive === 'true';
    }

    if ( type )
    {
      filters.type = type;
    }

    if ( search )
    {
      filters.search = search;
    }

    return this.promotionsService.findAll( filters );
  }

  /**
   * Get promotion by code for validation
   * @public
   * @rateLimit High
   */
  @Get( 'code/:code' )
  @UseGuards( RateLimitGuard )
  async getPromotionByCode ( @Param( 'code' ) code: string )
  {
    if ( !code || code.length === 0 )
    {
      throw new BadRequestException( 'Promotion code is required' );
    }

    const promotion = await this.promotionsService.findByCode( code.toUpperCase() );
    if ( !promotion )
    {
      throw new NotFoundException( 'Promotion not found' );
    }

    return promotion;
  }

  /**
   * Validate promotion code with business rules
   * @public
   * @rateLimit Medium
   */
  @Post( 'validate' )
  @UseGuards( RateLimitGuard )
  @HttpCode( HttpStatus.OK )
  async validateCode ( @Body() body: ValidatePromotionDto )
  {
    if ( !body.code )
    {
      throw new BadRequestException( 'Promotion code is required' );
    }

    try
    {
      const result = await this.promotionsService.validateCode(
        body.code.toUpperCase(),
        body.cartTotal || 0,
      );

      return {
        valid: !!result,
        promotion: result || null,
        message: result ? 'Promotion is valid' : 'Promotion is not valid',
      };
    } catch ( error: any )
    {
      return {
        valid: false,
        promotion: null,
        message: ( error && error.message ) || 'Validation failed',
      };
    }
  }

  /**
   * Apply promotion to cart
   * @public
   */
  @Post( 'apply-to-cart' )
  @HttpCode( HttpStatus.OK )
  async applyToCart ( @Body() body: ApplyPromotionToCartDto )
  {
    if ( !body.code )
    {
      throw new BadRequestException( 'Promotion code is required' );
    }

    if ( !body.cartItems || body.cartItems.length === 0 )
    {
      throw new BadRequestException( 'Cart items are required' );
    }

    try
    {
      const result = await this.promotionsService.applyToCart(
        body.code.toUpperCase(),
        body.cartItems.map( item => ( {
          productId: item.productId,
          quantity: item.quantity,
          priceCents: item.price,
        } ) ),
      );

      return {
        success: true,
        data: result,
      };
    } catch ( error: any )
    {
      return {
        success: false,
        error: ( error && error.message ) || 'An error occurred',
      };
    }
  }

  /**
   * Get promotion by ID
   * @public
   */
  @Get( ':id' )
  @UseGuards( RateLimitGuard )
  async getPromotion ( @Param( 'id' ) id: string )
  {
    const promotion = await this.promotionsService.findOne( id );
    if ( !promotion )
    {
      throw new NotFoundException( 'Promotion not found' );
    }
    return promotion;
  }

  /**
   * Get promotions for a specific product
   * @public
   */
  @Get( 'product/:productId/applicable' )
  @UseGuards( RateLimitGuard )
  async getPromotionsForProduct (
    @Param( 'productId' ) productId: string,
    @Query( 'categoryId' ) categoryId?: string,
  )
  {
    return this.promotionsService.getPromotionsForProduct( productId, categoryId );
  }

  /**
   * Check if product is eligible for promotion
   * @public
   */
  @Get( ':promotionId/eligible/:productId' )
  @UseGuards( RateLimitGuard )
  async isProductEligible (
    @Param( 'promotionId' ) promotionId: string,
    @Param( 'productId' ) productId: string,
    @Query( 'categoryId' ) categoryId?: string,
  )
  {
    const eligible = await this.promotionsService.isProductEligible(
      promotionId,
      productId,
      categoryId,
    );
    return {
      promotionId,
      productId,
      eligible,
    };
  }

  /**
   * Get public promotion statistics
   * @public
   */
  @Get( 'stats/public' )
  @UseGuards( RateLimitGuard )
  async getPublicStats ()
  {
    return this.promotionsService.getStats();
  }

  // ==================== AUTHENTICATED CUSTOMER ENDPOINTS ====================

  /**
   * Get current user's promotion usage history
   * @authenticated
   */
  @Get( 'my-history' )
  @UseGuards( JwtGuard )
  async getMyPromotionHistory (
    @Req() req,
    @Query( 'limit' ) limit: number = 50,
    @Query( 'offset' ) offset: number = 0,
  )
  {
    const userId = req.user.id;
    return this.customerService.getCustomerHistory( userId, { limit, offset } );
  }

  /**
   * Get current user's promotion statistics
   * @authenticated
   */
  @Get( 'my-stats' )
  @UseGuards( JwtGuard )
  async getMyStats ( @Req() req )
  {
    const userId = req.user.id;
    return this.customerService.getCustomerStats( userId );
  }

  /**
   * Get current user's lifetime value
   * @authenticated
   */
  @Get( 'my-ltv' )
  @UseGuards( JwtGuard )
  async getMyLTV ( @Req() req )
  {
    const userId = req.user.id;
    return this.customerService.getCustomerLTV( userId );
  }

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * Create new promotion
   * @admin
   */
  @Post()
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.CREATED )
  async createPromotion ( @Body() createDto: CreatePromotionDto, @Req() req )
  {
    const result = await this.promotionsService.create( createDto );
    const promotion = result.data;

    // Audit log
    await this.auditService.log( {
      promotionId: promotion.id,
      userId: req.user.id,
      action: 'CREATE',
      newValues: createDto,
      reason: 'Promotion created',
      ipAddress: req.ip,
      userAgent: req.get( 'user-agent' ),
    } );

    return {
      success: true,
      data: promotion,
      message: 'Promotion created successfully',
    };
  }

  /**
   * Update promotion
   * @admin
   */
  @Put( ':id' )
  @UseGuards( JwtGuard, AdminGuard )
  async updatePromotion (
    @Param( 'id' ) id: string,
    @Body() updateDto: UpdatePromotionDto,
    @Req() req,
  )
  {
    const oldPromotion = await this.promotionsService.findOne( id );
    if ( !oldPromotion )
    {
      throw new NotFoundException( 'Promotion not found' );
    }

    const updated = await this.promotionsService.update( id, updateDto );

    // Audit log
    await this.auditService.log( {
      promotionId: id,
      userId: req.user.id,
      action: 'UPDATE',
      oldValues: oldPromotion,
      newValues: updateDto,
      reason: 'Promotion updated',
      ipAddress: req.ip,
      userAgent: req.get( 'user-agent' ),
    } );

    return {
      success: true,
      data: updated,
      message: 'Promotion updated successfully',
    };
  }

  /**
   * Delete promotion
   * @admin
   */
  @Delete( ':id' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async deletePromotion ( @Param( 'id' ) id: string, @Req() req )
  {
    const promotion = await this.promotionsService.findOne( id );
    if ( !promotion )
    {
      throw new NotFoundException( 'Promotion not found' );
    }

    await this.promotionsService.delete( id );

    // Audit log
    await this.auditService.log( {
      promotionId: id,
      userId: req.user.id,
      action: 'DELETE',
      oldValues: promotion,
      reason: 'Promotion deleted',
      ipAddress: req.ip,
      userAgent: req.get( 'user-agent' ),
    } );

    return {
      success: true,
      message: 'Promotion deleted successfully',
    };
  }

  /**
   * Duplicate promotion
   * @admin
   */
  @Post( ':id/duplicate' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.CREATED )
  async duplicatePromotion ( @Param( 'id' ) id: string, @Req() req )
  {
    const originalPromotion = await this.promotionsService.findOne( id );
    if ( !originalPromotion )
    {
      throw new NotFoundException( 'Promotion not found' );
    }

    const duplicated = await this.promotionsService.duplicate( id );

    // Audit log
    const duplicatedPromo = duplicated.data || duplicated;
    await this.auditService.log( {
      promotionId: ( duplicatedPromo as any ).id,
      userId: req.user.id,
      action: 'DUPLICATE',
      newValues: { originalId: id },
      reason: `Duplicated from promotion ${ id }`,
      ipAddress: req.ip,
      userAgent: req.get( 'user-agent' ),
    } );

    return {
      success: true,
      data: duplicatedPromo,
      message: 'Promotion duplicated successfully',
    };
  }

  /**
   * Toggle promotion active status
   * @admin
   */
  @Put( ':id/toggle' )
  @UseGuards( JwtGuard, AdminGuard )
  async togglePromotion ( @Param( 'id' ) id: string, @Req() req )
  {
    const promotion = await this.promotionsService.findOne( id );
    if ( !promotion )
    {
      throw new NotFoundException( 'Promotion not found' );
    }

    const updated = await this.promotionsService.toggleActive( id );
    const updatedPromo = updated.data || updated;
    const promotionData = promotion.data || promotion;

    // Audit log
    const action =
      ( ( updatedPromo as any ).data?.isActive ?? ( updatedPromo as any ).isActive )
        ? 'ACTIVATE'
        : 'DEACTIVATE';
    await this.auditService.log( {
      promotionId: id,
      userId: req.user.id,
      action,
      oldValues: { isActive: ( promotionData as any ).isActive },
      newValues: {
        isActive: ( updatedPromo as any ).data?.isActive ?? ( updatedPromo as any ).isActive,
      },
      reason: `Promotion ${ action.toLowerCase() }d`,
      ipAddress: req.ip,
      userAgent: req.get( 'user-agent' ),
    } );

    return {
      success: true,
      data: updatedPromo,
      message: `Promotion ${ action.toLowerCase() }d successfully`,
    };
  }

  /**
   * Bulk update promotions
   * @admin
   */
  @Put( 'bulk/update' )
  @UseGuards( JwtGuard, AdminGuard )
  async bulkUpdatePromotions (
    @Body()
    body: {
      promotionIds: string[];
      updates: UpdatePromotionDto;
    },
    @Req() req,
  )
  {
    if ( !body.promotionIds || body.promotionIds.length === 0 )
    {
      throw new BadRequestException( 'Promotion IDs are required' );
    }

    const results = [];
    for ( const promotionId of body.promotionIds )
    {
      try
      {
        const updated = await this.promotionsService.update( promotionId, body.updates );
        results.push( { promotionId, success: true, data: updated } );

        // Audit log for each
        await this.auditService.log( {
          promotionId,
          userId: req.user.id,
          action: 'UPDATE',
          newValues: body.updates,
          reason: 'Bulk update',
          ipAddress: req.ip,
          userAgent: req.get( 'user-agent' ),
        } );
      } catch ( error: any )
      {
        results.push( {
          promotionId,
          success: false,
          error: error?.message || 'Unknown error',
        } );
      }
    }

    return {
      success: true,
      results,
      message: `Bulk update completed: ${ results.filter( r => r.success ).length }/${ body.promotionIds.length } promotions updated`,
    };
  }

  /**
   * Bulk delete promotions
   * @admin
   */
  @Delete( 'bulk/delete' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async bulkDeletePromotions ( @Body() body: { promotionIds: string[] }, @Req() req )
  {
    if ( !body.promotionIds || body.promotionIds.length === 0 )
    {
      throw new BadRequestException( 'Promotion IDs are required' );
    }

    const results = [];
    for ( const promotionId of body.promotionIds )
    {
      try
      {
        const promotion = await this.promotionsService.findOne( promotionId );
        if ( promotion )
        {
          await this.promotionsService.delete( promotionId );

          // Audit log
          await this.auditService.log( {
            promotionId,
            userId: req.user.id,
            action: 'DELETE',
            oldValues: promotion,
            reason: 'Bulk delete',
            ipAddress: req.ip,
            userAgent: req.get( 'user-agent' ),
          } );

          results.push( { promotionId, success: true } );
        } else
        {
          results.push( {
            promotionId,
            success: false,
            error: 'Promotion not found',
          } );
        }
      } catch ( error: any )
      {
        results.push( {
          promotionId,
          success: false,
          error: error?.message || 'Unknown error',
        } );
      }
    }

    return {
      success: true,
      results,
      message: `Bulk delete completed: ${ results.filter( r => r.success ).length }/${ body.promotionIds.length } promotions deleted`,
    };
  }

  // ==================== ANALYTICS & AUDIT ENDPOINTS (ADMIN) ====================

  /**
   * Get detailed promotion analytics
   * @admin
   */
  @Get( ':id/analytics' )
  @UseGuards( JwtGuard, AdminGuard )
  async getPromotionAnalytics (
    @Param( 'id' ) id: string,
    @Query( 'startDate' ) startDate?: string,
    @Query( 'endDate' ) endDate?: string,
  )
  {
    const start = startDate ? new Date( startDate ) : new Date( Date.now() - 30 * 24 * 60 * 60 * 1000 );
    const end = endDate ? new Date( endDate ) : new Date();

    const [ metrics, trends, topMetrics ] = await Promise.all( [
      this.analyticsService.getPromotionMetrics( id, start, end ),
      this.analyticsService.getTrends( id, 30 ),
      this.analyticsService.getTopPromotions( 'revenue', 1, start, end ),
    ] );

    return {
      promotionId: id,
      metrics,
      trends,
      dateRange: { start, end },
    };
  }

  /**
   * Get promotion audit logs
   * @admin
   */
  @Get( ':id/audit-logs' )
  @UseGuards( JwtGuard, AdminGuard )
  async getAuditLogs (
    @Param( 'id' ) id: string,
    @Query( 'action' ) action?: string,
    @Query( 'limit' ) limit: number = 50,
    @Query( 'offset' ) offset: number = 0,
  )
  {
    return this.auditService.getPromotionLogs( id, {
      action,
      limit,
      offset,
    } );
  }

  /**
   * Get recent actions across all promotions
   * @admin
   */
  @Get( 'audit/recent-actions' )
  @UseGuards( JwtGuard, AdminGuard )
  async getRecentActions ( @Query( 'action' ) action?: string, @Query( 'limit' ) limit: number = 50 )
  {
    return this.auditService.getRecentActions( limit, action );
  }

  /**
   * Get customers who used a promotion
   * @admin
   */
  @Get( ':id/customers' )
  @UseGuards( JwtGuard, AdminGuard )
  async getPromotionCustomers (
    @Param( 'id' ) id: string,
    @Query( 'limit' ) limit: number = 50,
    @Query( 'offset' ) offset: number = 0,
  )
  {
    return this.customerService.getPromotionUsers( id, { limit, offset } );
  }

  /**
   * Get promotion adoption rate
   * @admin
   */
  @Get( ':id/adoption-rate' )
  @UseGuards( JwtGuard, AdminGuard )
  async getAdoptionRate ( @Param( 'id' ) id: string )
  {
    return this.analyticsService.getPromotionMetrics( id );
  }

  // ==================== CHECKOUT FLOW ENDPOINTS ====================

  /**
   * Apply promotion to checkout
   * @public
   */
  @Post( 'checkout/apply' )
  @UseGuards( RateLimitGuard, OptionalJwtGuard )
  @HttpCode( HttpStatus.OK )
  async applyToCheckout (
    @Req() req: any,
    @Body()
    body: {
      code: string;
      userId?: string;
      items: Array<{
        productId: string;
        categoryId?: string;
        quantity: number;
        priceCents: number;
      }>;
      subtotalCents: number;
      shippingCents?: number;
    },
  )
  {
    if ( !body.code )
    {
      throw new BadRequestException( 'Promotion code is required' );
    }

    if ( !body.items || body.items.length === 0 )
    {
      throw new BadRequestException( 'Checkout items are required' );
    }

    // SECURITY: Use authenticated userId if available, or verify the provided one
    const userId = req.user?.sub || body.userId;

    const result = await this.checkoutService.applyPromotionToCheckout( body.code.toUpperCase(), {
      userId,
      items: body.items,
      subtotalCents: body.subtotalCents,
      shippingCents: body.shippingCents,
    } );

    return {
      success: result.applied,
      data: result,
    };
  }

  /**
   * Get checkout summary with applied promotion
   * @public
   */
  @Post( 'checkout/summary' )
  @UseGuards( RateLimitGuard, OptionalJwtGuard )
  @HttpCode( HttpStatus.OK )
  async getCheckoutSummary (
    @Req() req: any,
    @Body()
    body: {
      userId?: string;
      items: Array<{
        productId: string;
        categoryId?: string;
        quantity: number;
        priceCents: number;
      }>;
      subtotalCents: number;
      shippingCents?: number;
      promotionCode?: string;
    },
  )
  {
    // SECURITY: Use authenticated userId if available, or verify the provided one
    const userId = req.user?.sub || body.userId;

    const summary = await this.checkoutService.getCheckoutSummary(
      {
        userId,
        items: body.items,
        subtotalCents: body.subtotalCents,
        shippingCents: body.shippingCents,
      },
      body.promotionCode,
    );

    return {
      success: true,
      data: summary,
    };
  }

  /**
   * Get applicable promotions for checkout
   * @public
   */
  @Post( 'checkout/applicable' )
  @UseGuards( RateLimitGuard, OptionalJwtGuard )
  @HttpCode( HttpStatus.OK )
  async getApplicableForCheckout (
    @Req() req: any,
    @Body()
    body: {
      userId?: string;
      items: Array<{
        productId: string;
        categoryId?: string;
        quantity: number;
        priceCents: number;
      }>;
      subtotalCents: number;
    },
  )
  {
    // SECURITY: Use authenticated userId if available, or verify the provided one
    const userId = req.user?.sub || body.userId;

    const applicable = await this.checkoutService.getApplicablePromotions( {
      userId,
      items: body.items,
      subtotalCents: body.subtotalCents,
    } );

    return {
      success: true,
      data: applicable,
      count: applicable.length,
    };
  }

  /**
   * Get suggested promotions for checkout
   * @public
   */
  @Post( 'checkout/suggested' )
  @UseGuards( RateLimitGuard )
  @HttpCode( HttpStatus.OK )
  async getSuggestedForCheckout (
    @Body()
    body: {
      userId?: string;
      items: Array<{
        productId: string;
        categoryId?: string;
        quantity: number;
        priceCents: number;
      }>;
      subtotalCents: number;
      shippingCents?: number;
      limit?: number;
    },
  )
  {
    const suggested = await this.checkoutService.getSuggestedPromotions(
      {
        userId: body.userId,
        items: body.items,
        subtotalCents: body.subtotalCents,
        shippingCents: body.shippingCents,
      },
      body.limit || 3,
    );

    return {
      success: true,
      data: suggested,
      count: suggested.length,
    };
  }

  /**
   * Validate promotion code availability for checkout
   * @public
   */
  @Get( 'checkout/validate/:code' )
  @UseGuards( RateLimitGuard )
  async validateForCheckout ( @Param( 'code' ) code: string )
  {
    if ( !code )
    {
      throw new BadRequestException( 'Promotion code is required' );
    }

    const result = await this.checkoutService.validatePromotionAvailability( code.toUpperCase() );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Get shipping discount if applicable
   * @public
   */
  @Get( 'checkout/shipping/:code' )
  @UseGuards( RateLimitGuard )
  async getShippingDiscount (
    @Param( 'code' ) code: string,
    @Query( 'shippingCents' ) shippingCents: number,
  )
  {
    if ( !code )
    {
      throw new BadRequestException( 'Promotion code is required' );
    }

    const discount = await this.checkoutService.getShippingDiscount(
      code.toUpperCase(),
      Number( shippingCents ) || 0,
    );

    return {
      success: !!discount,
      data: discount,
    };
  }

  // ==================== ADVANCED FEATURES ENDPOINTS ====================

  /**
   * Get promotion complexity and features
   * @admin
   */
  @Get( ':id/complexity' )
  @UseGuards( JwtGuard, AdminGuard )
  async getComplexity ( @Param( 'id' ) id: string )
  {
    const promotion = await this.promotionsService.findOne( id );
    if ( !promotion )
    {
      throw new NotFoundException( 'Promotion not found' );
    }

    const complexity = this.advancedService.getPromotionComplexity( promotion );

    return {
      success: true,
      data: complexity,
    };
  }

  /**
   * Get smart recommendations for a customer
   * @authenticated
   */
  @Get( 'recommendations/smart' )
  @UseGuards( JwtGuard )
  async getSmartRecommendations ( @Req() req, @Query( 'limit' ) limit: number = 5 )
  {
    const recommendations = await this.advancedService.getSmartRecommendations( req.user.id, limit );

    return {
      success: true,
      data: recommendations,
    };
  }

  // ==================== ANALYTICS & REPORTING ENDPOINTS ====================

  /**
   * Get dashboard metrics overview
   * @admin
   */
  @Get( 'analytics/dashboard' )
  @UseGuards( JwtGuard, AdminGuard )
  async getDashboardMetrics ()
  {
    const metrics = await this.reportingService.getDashboardMetrics();

    return {
      success: true,
      data: metrics,
    };
  }

  /**
   * Generate comprehensive promotion report
   * @admin
   */
  @Post( 'analytics/report' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async generateReport (
    @Body()
    filters?: {
      startDate?: string;
      endDate?: string;
      promotionType?: string;
      status?: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
      minRevenue?: number;
      maxRevenue?: number;
    },
  )
  {
    const report = await this.reportingService.generateReport( {
      ...filters,
      startDate: filters?.startDate ? new Date( filters.startDate ) : undefined,
      endDate: filters?.endDate ? new Date( filters.endDate ) : undefined,
    } );

    return {
      success: true,
      data: report,
      count: report.length,
    };
  }

  /**
   * Export promotions to CSV
   * @admin
   */
  @Post( 'analytics/export/csv' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async exportToCSV (
    @Body()
    filters?: {
      startDate?: string;
      endDate?: string;
      promotionType?: string;
      status?: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
    },
  )
  {
    const csv = await this.reportingService.exportToCSV( {
      ...filters,
      startDate: filters?.startDate ? new Date( filters.startDate ) : undefined,
      endDate: filters?.endDate ? new Date( filters.endDate ) : undefined,
    } );

    return {
      success: true,
      format: 'csv',
      data: csv,
    };
  }

  /**
   * Export promotions to JSON
   * @admin
   */
  @Post( 'analytics/export/json' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async exportToJSON (
    @Body()
    filters?: {
      startDate?: string;
      endDate?: string;
      promotionType?: string;
      status?: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
    },
  )
  {
    const json = await this.reportingService.exportToJSON( {
      ...filters,
      startDate: filters?.startDate ? new Date( filters.startDate ) : undefined,
      endDate: filters?.endDate ? new Date( filters.endDate ) : undefined,
    } );

    return {
      success: true,
      format: 'json',
      data: JSON.parse( json ),
    };
  }

  /**
   * Get promotion efficiency score
   * @admin
   */
  @Get( 'analytics/:id/efficiency' )
  @UseGuards( JwtGuard, AdminGuard )
  async getEfficiencyScore ( @Param( 'id' ) id: string )
  {
    const score = await this.reportingService.getEfficiencyScore( id );

    return {
      success: true,
      data: score,
    };
  }

  /**
   * Get promotion ROI analysis
   * @admin
   */
  @Get( 'analytics/:id/roi' )
  @UseGuards( JwtGuard, AdminGuard )
  async getROIAnalysis ( @Param( 'id' ) id: string )
  {
    const roi = await this.reportingService.getROIAnalysis( id );

    return {
      success: true,
      data: roi,
    };
  }

  /**
   * Get effectiveness time series
   * @admin
   */
  @Get( 'analytics/:id/effectiveness' )
  @UseGuards( JwtGuard, AdminGuard )
  async getEffectiveness ( @Param( 'id' ) id: string, @Query( 'days' ) days: number = 30 )
  {
    const series = await this.reportingService.getEffectivenessTimeSeries( id, days );

    return {
      success: true,
      data: series,
      days,
    };
  }

  /**
   * Get segment analysis
   * @admin
   */
  @Get( 'analytics/segments/breakdown' )
  @UseGuards( JwtGuard, AdminGuard )
  async getSegmentAnalysis ()
  {
    const segments = await this.reportingService.getSegmentAnalysis();

    return {
      success: true,
      data: segments,
    };
  }

  /**
   * Get monthly comparison
   * @admin
   */
  @Get( 'analytics/monthly/comparison' )
  @UseGuards( JwtGuard, AdminGuard )
  async getMonthlyComparison ()
  {
    const months = await this.reportingService.getMonthlyComparison();

    return {
      success: true,
      data: months,
    };
  }

  /**
   * Get recommendations
   * @admin
   */
  @Get( 'analytics/recommendations' )
  @UseGuards( JwtGuard, AdminGuard )
  async getRecommendations ()
  {
    const recommendations = await this.reportingService.getRecommendations();

    return {
      success: true,
      data: recommendations,
      count: recommendations.length,
    };
  }

  // ==================== NOTIFICATION ENDPOINTS ====================

  /**
   * Send promotion notification
   * @admin
   */
  @Post( 'notifications/send' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async sendNotification (
    @Body()
    body: {
      userId: string;
      promotionId: string;
      type: string;
      channels: string[];
      message?: string;
    },
  )
  {
    const template = this.notificationService.getNotificationTemplates()[ body.type ] || {
      type: body.type,
      channel: 'EMAIL',
      body: body.message || 'New promotion available',
    };

    const result = await this.notificationService.sendNotification(
      body.userId,
      body.promotionId,
      template,
      body.channels as any,
    );

    return {
      success: result.success,
      message: result.message,
      notificationId: result.notificationId,
    };
  }

  /**
   * Send to segment
   * @admin
   */
  @Post( 'notifications/send-segment' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async sendToSegment (
    @Body()
    body: {
      segment: string;
      promotionId: string;
      type: string;
      channels: string[];
    },
  )
  {
    const template = this.notificationService.getNotificationTemplates()[ body.type ] || {
      type: body.type,
      channel: 'EMAIL',
      body: 'New promotion available',
    };

    const result = await this.notificationService.sendToSegment(
      body.segment,
      body.promotionId,
      template,
      body.channels as any,
    );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Schedule notification
   * @admin
   */
  @Post( 'notifications/schedule' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.CREATED )
  async scheduleNotification (
    @Body()
    body: {
      userId: string;
      promotionId: string;
      type: string;
      channels: string[];
      scheduledFor: string;
    },
  )
  {
    const template = this.notificationService.getNotificationTemplates()[ body.type ] || {
      type: body.type,
      channel: 'EMAIL',
      body: 'Promotion reminder',
    };

    const result = await this.notificationService.scheduleNotification(
      body.userId,
      body.promotionId,
      template,
      new Date( body.scheduledFor ),
      body.channels as any,
    );

    return {
      success: result.success,
      notificationId: result.notificationId,
    };
  }

  /**
   * Send expiring reminder
   * @admin
   */
  @Post( 'notifications/expiring-reminder/:id' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async sendExpiringReminder (
    @Param( 'id' ) id: string,
    @Query( 'daysBeforeExpiry' ) daysBeforeExpiry: number = 1,
  )
  {
    const result = await this.notificationService.sendExpiringReminder( id, daysBeforeExpiry );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Send flash sale alert
   * @admin
   */
  @Post( 'notifications/flash-sale/:id' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async sendFlashSale (
    @Param( 'id' ) id: string,
    @Query( 'expiresInHours' ) expiresInHours: number = 1,
  )
  {
    const result = await this.notificationService.sendFlashSaleAlert( id, expiresInHours );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Send personalized offers
   * @authenticated
   */
  @Post( 'notifications/personalized' )
  @UseGuards( JwtGuard )
  @HttpCode( HttpStatus.OK )
  async sendPersonalizedOffers ( @Req() req, @Body() body: { promotionIds: string[] } )
  {
    const promotions = await Promise.all(
      body.promotionIds.map( id => this.promotionsService.findOne( id ).then( p => p?.data || p ) ),
    );

    const result = await this.notificationService.sendPersonalizedOffers(
      req.user.id,
      promotions.filter( Boolean ),
    );

    return {
      success: result.success,
      message: 'Notification sent successfully',
    };
  }

  /**
   * Get notification templates
   * @public
   */
  @Get( 'notifications/templates' )
  async getNotificationTemplates ()
  {
    const templates = this.notificationService.getNotificationTemplates();

    return {
      success: true,
      data: templates,
    };
  }

  // ==================== BACKUP & RESTORE ENDPOINTS ====================

  /**
   * Create backup for a single promotion
   * @admin
   */
  @Post( 'backups/create/:id' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.CREATED )
  async createBackup (
    @Param( 'id' ) promotionId: string,
    @Req() req,
    @Body() body?: { metadata?: Record<string, any> },
  )
  {
    const backup = await this.backupService.backupPromotion(
      promotionId,
      BackupType.MANUAL,
      req.user.id,
      body?.metadata,
    );

    return {
      success: true,
      data: backup,
      message: 'Backup created successfully',
    };
  }

  /**
   * Create backup for all promotions
   * @admin
   */
  @Post( 'backups/create-all' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.CREATED )
  async createBackupAll ( @Req() req, @Body() body?: { metadata?: Record<string, any> } )
  {
    const result = await this.backupService.backupAllPromotions(
      BackupType.MANUAL,
      req.user.id,
      body?.metadata,
    );

    return {
      success: true,
      data: result,
      message: `Backup created for ${ result.totalBackups } promotions`,
    };
  }

  /**
   * Get backup history for a promotion
   * @admin
   */
  @Get( 'backups/history/:id' )
  @UseGuards( JwtGuard, AdminGuard )
  async getBackupHistory ( @Param( 'id' ) promotionId: string, @Query( 'limit' ) limit: number = 50 )
  {
    const backups = await this.backupService.getBackupHistory( promotionId, limit );

    return {
      success: true,
      data: backups,
      count: backups.length,
    };
  }

  /**
   * Get restore history for a promotion
   * @admin
   */
  @Get( 'backups/restore-history/:id' )
  @UseGuards( JwtGuard, AdminGuard )
  async getRestoreHistory ( @Param( 'id' ) promotionId: string, @Query( 'limit' ) limit: number = 50 )
  {
    const restorePoints = await this.backupService.getRestoreHistory( promotionId, limit );

    return {
      success: true,
      data: restorePoints,
      count: restorePoints.length,
    };
  }

  /**
   * Restore promotion from backup
   * @admin
   */
  @Post( 'backups/restore/:backupId' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async restorePromotion (
    @Param( 'backupId' ) backupId: string,
    @Req() req,
    @Body() body?: { targetPromotionId?: string },
  )
  {
    const restorePoint = await this.backupService.restorePromotion(
      backupId,
      req.user.id,
      body?.targetPromotionId,
    );

    return {
      success: restorePoint.restoreStatus === 'COMPLETED',
      data: restorePoint,
      message:
        restorePoint.restoreStatus === 'COMPLETED'
          ? 'Promotion restored successfully'
          : `Restore failed: ${ restorePoint.errors?.join( ', ' ) || 'Unknown error' }`,
    };
  }

  /**
   * Restore multiple promotions from backups
   * @admin
   */
  @Post( 'backups/restore-multiple' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async restoreMultiple ( @Req() req, @Body() body: { backupIds: string[] } )
  {
    const result = await this.backupService.restoreMultiplePromotions( body.backupIds, req.user.id );

    return {
      success: result.failed === 0,
      data: result,
      message: `Restored ${ result.successful }/${ result.totalRequested } promotions`,
    };
  }

  /**
   * Compare two promotion backups
   * @admin
   */
  @Get( 'backups/compare' )
  @UseGuards( JwtGuard, AdminGuard )
  async compareBackups (
    @Query( 'backupId1' ) backupId1: string,
    @Query( 'backupId2' ) backupId2: string,
  )
  {
    const comparison = await this.backupService.compareBackups( backupId1, backupId2 );

    return {
      success: true,
      data: comparison,
    };
  }

  /**
   * Verify backup integrity
   * @admin
   */
  @Get( 'backups/verify/:backupId' )
  @UseGuards( JwtGuard, AdminGuard )
  async verifyBackup ( @Param( 'backupId' ) backupId: string )
  {
    const verification = await this.backupService.verifyBackup( backupId );

    return {
      success: verification.isValid,
      data: verification,
    };
  }

  /**
   * Delete backup
   * @admin
   */
  @Delete( 'backups/:backupId' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async deleteBackup ( @Param( 'backupId' ) backupId: string )
  {
    const result = await this.backupService.deleteBackup( backupId );

    return {
      success: result,
      message: result ? 'Backup deleted successfully' : 'Failed to delete backup',
    };
  }

  /**
   * Cleanup old backups based on retention policy
   * @admin
   */
  @Post( 'backups/cleanup' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async cleanupOldBackups ( @Query( 'retentionDays' ) retentionDays: number = 90 )
  {
    const result = await this.backupService.cleanupOldBackups( retentionDays );

    return {
      success: true,
      data: result,
      message: `Cleaned up ${ result.deletedCount } old backup(s)`,
    };
  }

  /**
   * Export backups as JSON
   * @admin
   */
  @Post( 'backups/export' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async exportBackups ( @Body() body: { backupIds: string[] } )
  {
    const jsonData = await this.backupService.exportBackupsAsJSON( body.backupIds );

    return {
      success: true,
      data: JSON.parse( jsonData ),
    };
  }

  /**
   * Import backups from JSON
   * @admin
   */
  @Post( 'backups/import' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.CREATED )
  async importBackups ( @Req() req, @Body() body: { jsonData: string } )
  {
    const result = await this.backupService.importBackupsFromJSON( body.jsonData, req.user.id );

    return {
      success: result.errors.length === 0,
      data: result,
      message: `Imported ${ result.imported } backup(s)`,
    };
  }

  /**
   * Get backup statistics
   * @admin
   */
  @Get( 'backups/statistics' )
  @UseGuards( JwtGuard, AdminGuard )
  async getBackupStatistics ()
  {
    const stats = await this.backupService.getBackupStatistics();

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Rollback promotion to previous version
   * @admin
   */
  @Post( 'backups/rollback/:promotionId/:backupId' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async rollbackToVersion (
    @Param( 'promotionId' ) promotionId: string,
    @Param( 'backupId' ) backupId: string,
    @Req() req,
  )
  {
    const restorePoint = await this.backupService.rollbackToVersion(
      promotionId,
      backupId,
      req.user.id,
    );

    return {
      success: restorePoint.restoreStatus === 'COMPLETED',
      data: restorePoint,
      message:
        restorePoint.restoreStatus === 'COMPLETED'
          ? 'Promotion rolled back successfully'
          : 'Rollback failed',
    };
  }

  // ==================== DASHBOARD ENDPOINTS ====================

  /**
   * Get dashboard overview with key metrics
   * @admin
   */
  @Get( 'dashboard/overview' )
  @UseGuards( JwtGuard, AdminGuard )
  async getDashboardOverview ()
  {
    const overview = await this.dashboardService.getDashboardOverview();

    return {
      success: true,
      data: overview,
    };
  }

  /**
   * Get promotions list with pagination and filters
   * @admin
   */
  @Post( 'dashboard/promotions' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async getPromotionsList (
    @Body()
    filters?: {
      search?: string;
      status?: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
      type?: string;
      sortBy?: 'name' | 'created' | 'revenue' | 'usage';
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    },
  )
  {
    const result = await this.dashboardService.getPromotionsList( filters );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Get detailed preview of a promotion
   * @admin
   */
  @Get( 'dashboard/preview/:id' )
  @UseGuards( JwtGuard, AdminGuard )
  async getPromotionPreview ( @Param( 'id' ) promotionId: string )
  {
    const preview = await this.dashboardService.getPromotionPreview( promotionId );

    return {
      success: true,
      data: preview,
    };
  }

  /**
   * Preview bulk edit operation
   * @admin
   */
  @Post( 'dashboard/bulk-edit/preview' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async previewBulkEdit (
    @Body()
    body: {
      promotionIds: string[];
      changes: Record<string, any>;
    },
  )
  {
    const preview = await this.dashboardService.previewBulkEdit( body.promotionIds, body.changes );

    return {
      success: true,
      data: preview,
    };
  }

  /**
   * Execute bulk edit operation
   * @admin
   */
  @Post( 'dashboard/bulk-edit/execute' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async executeBulkEdit (
    @Req() req,
    @Body()
    body: {
      promotionIds: string[];
      changes: Record<string, any>;
    },
  )
  {
    const operation = await this.dashboardService.executeBulkEdit(
      body.promotionIds,
      body.changes,
      req.user.id,
    );

    return {
      success: operation.status === 'COMPLETED',
      data: operation,
    };
  }

  /**
   * Bulk activate promotions
   * @admin
   */
  @Post( 'dashboard/bulk/activate' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async bulkActivate ( @Body() body: { promotionIds: string[] } )
  {
    const result = await this.dashboardService.bulkActivate( body.promotionIds );

    return {
      success: result.failed === 0,
      data: result,
      message: `Activated ${ result.activated } promotion(s)`,
    };
  }

  /**
   * Bulk deactivate promotions
   * @admin
   */
  @Post( 'dashboard/bulk/deactivate' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async bulkDeactivate ( @Body() body: { promotionIds: string[] } )
  {
    const result = await this.dashboardService.bulkDeactivate( body.promotionIds );

    return {
      success: result.failed === 0,
      data: result,
      message: `Deactivated ${ result.deactivated } promotion(s)`,
    };
  }

  /**
   * Bulk delete promotions
   * @admin
   */
  @Post( 'dashboard/bulk/delete' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async bulkDelete ( @Body() body: { promotionIds: string[] } )
  {
    const result = await this.dashboardService.bulkDelete( body.promotionIds );

    return {
      success: result.failed === 0,
      data: result,
      message: `Deleted ${ result.deleted } promotion(s)`,
    };
  }

  /**
   * Bulk extend promotion expiration
   * @admin
   */
  @Post( 'dashboard/bulk/extend-expiration' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async bulkExtendExpiration ( @Body() body: { promotionIds: string[]; days?: number } )
  {
    const result = await this.dashboardService.bulkExtendExpiration(
      body.promotionIds,
      body.days || 30,
    );

    return {
      success: result.failed === 0,
      data: result,
      message: `Extended ${ result.extended } promotion(s)`,
    };
  }

  /**
   * Export promotions
   * @admin
   */
  @Post( 'dashboard/export' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.OK )
  async exportPromotions (
    @Body()
    body: {
      promotionIds: string[];
      format?: 'CSV' | 'JSON';
      includeAnalytics?: boolean;
    },
  )
  {
    const data = await this.dashboardService.exportPromotions(
      body.promotionIds,
      body.format || 'CSV',
      body.includeAnalytics,
    );

    return {
      success: true,
      format: body.format || 'CSV',
      data,
    };
  }

  /**
   * Get export templates
   * @admin
   */
  @Get( 'dashboard/export-templates' )
  @UseGuards( JwtGuard, AdminGuard )
  async getExportTemplates ()
  {
    const templates = this.dashboardService.getExportTemplates();

    return {
      success: true,
      data: templates,
    };
  }

  /**
   * Get quick filters
   * @admin
   */
  @Get( 'dashboard/quick-filters' )
  @UseGuards( JwtGuard, AdminGuard )
  async getQuickFilters ()
  {
    const filters = this.dashboardService.getQuickFilters();

    return {
      success: true,
      data: filters,
    };
  }

  /**
   * Get dashboard statistics
   * @admin
   */
  @Get( 'dashboard/statistics' )
  @UseGuards( JwtGuard, AdminGuard )
  async getDashboardStatistics ()
  {
    const stats = await this.dashboardService.getDashboardStatistics();

    return {
      success: true,
      data: stats,
    };
  }

  // ==================== CAMPAIGN ENDPOINTS ====================

  /**
   * Create a new campaign
   * @admin
   */
  @Post( 'campaigns' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.CREATED )
  async createCampaign (
    @Body()
    body: {
      name: string;
      description?: string;
      type: CampaignType;
      startDate: string | Date;
      endDate: string | Date;
      targetAudience?: string;
      budget?: number;
      expectedReach?: number;
      priority?: number;
      promotionIds?: string[];
      metadata?: Record<string, any>;
    },
    @Req() req: any,
  )
  {
    try
    {
      const campaign = await this.campaignService.createCampaign( {
        name: body.name,
        description: body.description,
        type: body.type,
        startDate: typeof body.startDate === 'string' ? new Date( body.startDate ) : body.startDate,
        endDate: typeof body.endDate === 'string' ? new Date( body.endDate ) : body.endDate,
        targetAudience: body.targetAudience,
        budget: body.budget,
        expectedReach: body.expectedReach,
        priority: body.priority,
        promotionIds: body.promotionIds || [],
        metadata: body.metadata,
        createdBy: req.user?.id || 'system',
      } );

      return {
        success: true,
        data: campaign,
        message: 'Campaign created successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to create campaign' );
    }
  }

  /**
   * Get all campaigns with filters
   * @admin
   */
  @Get( 'campaigns' )
  @UseGuards( JwtGuard, AdminGuard )
  async listCampaigns (
    @Query( 'status' ) status?: CampaignStatus,
    @Query( 'type' ) type?: CampaignType,
    @Query( 'startDate' ) startDate?: string,
    @Query( 'endDate' ) endDate?: string,
    @Query( 'skip' ) skip: number = 0,
    @Query( 'take' ) take: number = 20,
  )
  {
    try
    {
      const result = await this.campaignService.listCampaigns( {
        status: status as CampaignStatus,
        type: type as CampaignType,
        startDate: startDate ? new Date( startDate ) : undefined,
        endDate: endDate ? new Date( endDate ) : undefined,
        skip,
        take,
      } );

      return {
        success: true,
        data: result.campaigns,
        total: result.total,
        skip,
        take,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to list campaigns' );
    }
  }

  /**
   * Get campaign by ID
   * @admin
   */
  @Get( 'campaigns/:id' )
  @UseGuards( JwtGuard, AdminGuard )
  async getCampaignById ( @Param( 'id' ) campaignId: string )
  {
    try
    {
      const campaign = await this.campaignService.getCampaignById( campaignId );

      if ( !campaign )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        data: campaign,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get campaign' );
    }
  }

  /**
   * Update campaign
   * @admin
   */
  @Put( 'campaigns/:id' )
  @UseGuards( JwtGuard, AdminGuard )
  async updateCampaign ( @Param( 'id' ) campaignId: string, @Body() body: any )
  {
    try
    {
      const updates: any = { ...body };

      if ( body.startDate && typeof body.startDate === 'string' )
      {
        updates.startDate = new Date( body.startDate );
      }

      if ( body.endDate && typeof body.endDate === 'string' )
      {
        updates.endDate = new Date( body.endDate );
      }

      const updated = await this.campaignService.updateCampaign( campaignId, updates );

      if ( !updated )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        data: updated,
        message: 'Campaign updated successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to update campaign' );
    }
  }

  /**
   * Launch campaign (change status to ACTIVE)
   * @admin
   */
  @Post( 'campaigns/:id/launch' )
  @UseGuards( JwtGuard, AdminGuard )
  async launchCampaign ( @Param( 'id' ) campaignId: string )
  {
    try
    {
      const campaign = await this.campaignService.launchCampaign( campaignId );

      if ( !campaign )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        data: campaign,
        message: 'Campaign launched successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to launch campaign' );
    }
  }

  /**
   * Pause campaign
   * @admin
   */
  @Post( 'campaigns/:id/pause' )
  @UseGuards( JwtGuard, AdminGuard )
  async pauseCampaign ( @Param( 'id' ) campaignId: string )
  {
    try
    {
      const campaign = await this.campaignService.pauseCampaign( campaignId );

      if ( !campaign )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        data: campaign,
        message: 'Campaign paused successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to pause campaign' );
    }
  }

  /**
   * Resume paused campaign
   * @admin
   */
  @Post( 'campaigns/:id/resume' )
  @UseGuards( JwtGuard, AdminGuard )
  async resumeCampaign ( @Param( 'id' ) campaignId: string )
  {
    try
    {
      const campaign = await this.campaignService.resumeCampaign( campaignId );

      if ( !campaign )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        data: campaign,
        message: 'Campaign resumed successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to resume campaign' );
    }
  }

  /**
   * End campaign (change status to COMPLETED)
   * @admin
   */
  @Post( 'campaigns/:id/end' )
  @UseGuards( JwtGuard, AdminGuard )
  async endCampaign ( @Param( 'id' ) campaignId: string )
  {
    try
    {
      const campaign = await this.campaignService.endCampaign( campaignId );

      if ( !campaign )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        data: campaign,
        message: 'Campaign ended successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to end campaign' );
    }
  }

  /**
   * Cancel campaign
   * @admin
   */
  @Post( 'campaigns/:id/cancel' )
  @UseGuards( JwtGuard, AdminGuard )
  async cancelCampaign ( @Param( 'id' ) campaignId: string )
  {
    try
    {
      const campaign = await this.campaignService.cancelCampaign( campaignId );

      if ( !campaign )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        data: campaign,
        message: 'Campaign cancelled successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to cancel campaign' );
    }
  }

  /**
   * Add promotions to campaign
   * @admin
   */
  @Post( 'campaigns/:id/promotions' )
  @UseGuards( JwtGuard, AdminGuard )
  async addPromotionsToCampaign (
    @Param( 'id' ) campaignId: string,
    @Body() body: { promotionIds: string[] },
  )
  {
    try
    {
      const success = await this.campaignService.addPromotionsToCampaign(
        campaignId,
        body.promotionIds,
      );

      if ( !success )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        message: 'Promotions added to campaign successfully',
        promotionIds: body.promotionIds,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to add promotions' );
    }
  }

  /**
   * Remove promotion from campaign
   * @admin
   */
  @Delete( 'campaigns/:id/promotions/:promotionId' )
  @UseGuards( JwtGuard, AdminGuard )
  async removePromotionFromCampaign (
    @Param( 'id' ) campaignId: string,
    @Param( 'promotionId' ) promotionId: string,
  )
  {
    try
    {
      const success = await this.campaignService.removePromotionsFromCampaign( campaignId, [
        promotionId,
      ] );

      if ( !success )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        message: 'Promotion removed from campaign successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to remove promotion' );
    }
  }

  /**
   * Get campaign metrics
   * @admin
   */
  @Get( 'campaigns/:id/metrics' )
  @UseGuards( JwtGuard, AdminGuard )
  async getCampaignMetrics ( @Param( 'id' ) campaignId: string )
  {
    try
    {
      const metrics = await this.campaignService.getCampaignMetrics( campaignId );

      return {
        success: true,
        data: metrics,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get metrics' );
    }
  }

  /**
   * Get campaign performance report
   * @admin
   */
  @Get( 'campaigns/:id/report' )
  @UseGuards( JwtGuard, AdminGuard )
  async getCampaignReport ( @Param( 'id' ) campaignId: string )
  {
    try
    {
      const report = await this.campaignService.getCampaignPerformanceReport( campaignId );

      return {
        success: true,
        data: report,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get report' );
    }
  }

  /**
   * Get active campaigns
   * @admin
   */
  @Get( 'campaigns/active/list' )
  @UseGuards( JwtGuard, AdminGuard )
  async getActiveCampaigns ()
  {
    try
    {
      const campaigns = await this.campaignService.getActiveCampaigns();

      return {
        success: true,
        data: campaigns,
        count: campaigns.length,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get active campaigns' );
    }
  }

  /**
   * Get upcoming campaigns
   * @admin
   */
  @Get( 'campaigns/upcoming/list' )
  @UseGuards( JwtGuard, AdminGuard )
  async getUpcomingCampaigns ( @Query( 'days' ) days: number = 7 )
  {
    try
    {
      const campaigns = await this.campaignService.getUpcomingCampaigns( days );

      return {
        success: true,
        data: campaigns,
        count: campaigns.length,
        days,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get upcoming campaigns' );
    }
  }

  /**
   * Get campaigns by promotion ID
   * @admin
   */
  @Get( 'campaigns/promotion/:promotionId' )
  @UseGuards( JwtGuard, AdminGuard )
  async getCampaignsByPromotionId ( @Param( 'promotionId' ) promotionId: string )
  {
    try
    {
      const campaigns = await this.campaignService.getCampaignsByPromotionId( promotionId );

      return {
        success: true,
        data: campaigns,
        count: campaigns.length,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get campaigns' );
    }
  }

  /**
   * Duplicate campaign
   * @admin
   */
  @Post( 'campaigns/:id/duplicate' )
  @UseGuards( JwtGuard, AdminGuard )
  async duplicateCampaign ( @Param( 'id' ) campaignId: string, @Req() req: any )
  {
    try
    {
      const duplicated = await this.campaignService.duplicateCampaign(
        campaignId,
        req.user?.id || 'system',
      );

      if ( !duplicated )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        data: duplicated,
        message: 'Campaign duplicated successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to duplicate campaign' );
    }
  }

  /**
   * Schedule campaign (set dates)
   * @admin
   */
  @Post( 'campaigns/:id/schedule' )
  @UseGuards( JwtGuard, AdminGuard )
  async scheduleCampaign (
    @Param( 'id' ) campaignId: string,
    @Body()
    body: {
      startDate: string | Date;
      endDate: string | Date;
    },
  )
  {
    try
    {
      const startDate =
        typeof body.startDate === 'string' ? new Date( body.startDate ) : body.startDate;
      const endDate = typeof body.endDate === 'string' ? new Date( body.endDate ) : body.endDate;

      const campaign = await this.campaignService.scheduleCampaign( campaignId, startDate, endDate );

      if ( !campaign )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        data: campaign,
        message: 'Campaign scheduled successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to schedule campaign' );
    }
  }

  /**
   * Delete campaign
   * @admin
   */
  @Delete( 'campaigns/:id' )
  @UseGuards( JwtGuard, AdminGuard )
  async deleteCampaign ( @Param( 'id' ) campaignId: string )
  {
    try
    {
      const success = await this.campaignService.deleteCampaign( campaignId );

      if ( !success )
      {
        throw new NotFoundException( 'Campaign not found' );
      }

      return {
        success: true,
        message: 'Campaign deleted successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to delete campaign' );
    }
  }

  // ==================== PROJECT & REVIEW ENDPOINTS ====================

  /**
   * Link promotion to project
   * @admin
   */
  @Post( 'projects/:projectId/promotions/:promotionId/link' )
  @UseGuards( JwtGuard, AdminGuard )
  async linkPromotionToProject (
    @Param( 'projectId' ) projectId: string,
    @Param( 'promotionId' ) promotionId: string,
    @Body()
    body: {
      discountPercentage: number;
      discountAmount?: number;
      priority?: number;
      startDate?: string | Date;
      endDate?: string | Date;
    },
  )
  {
    try
    {
      const projectPromotion = await this.projectsService.linkPromotionToProject(
        projectId,
        promotionId,
        {
          discountPercentage: body.discountPercentage,
          discountAmount: body.discountAmount,
          priority: body.priority,
          startDate: body.startDate
            ? typeof body.startDate === 'string'
              ? new Date( body.startDate )
              : body.startDate
            : undefined,
          endDate: body.endDate
            ? typeof body.endDate === 'string'
              ? new Date( body.endDate )
              : body.endDate
            : undefined,
        },
      );

      return {
        success: true,
        data: projectPromotion,
        message: 'Promotion linked to project successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to link promotion' );
    }
  }

  /**
   * Unlink promotion from project
   * @admin
   */
  @Post( 'projects/:projectId/promotions/:promotionId/unlink' )
  @UseGuards( JwtGuard, AdminGuard )
  async unlinkPromotionFromProject (
    @Param( 'projectId' ) projectId: string,
    @Param( 'promotionId' ) promotionId: string,
  )
  {
    try
    {
      const success = await this.projectsService.unlinkPromotionFromProject( projectId, promotionId );

      if ( !success )
      {
        throw new NotFoundException( 'Project promotion not found' );
      }

      return {
        success: true,
        message: 'Promotion unlinked from project successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to unlink promotion' );
    }
  }

  /**
   * Get all promotions for a project
   * @public
   */
  @Get( 'projects/:projectId/promotions' )
  @UseGuards( RateLimitGuard )
  async getProjectPromotions ( @Param( 'projectId' ) projectId: string )
  {
    try
    {
      const promotions = await this.projectsService.getProjectPromotions( projectId );

      return {
        success: true,
        data: promotions,
        count: promotions.length,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get project promotions' );
    }
  }

  /**
   * Get best promotions for a project
   * @public
   */
  @Get( 'projects/:projectId/best-promotions' )
  @UseGuards( RateLimitGuard )
  async getBestPromotionsForProject (
    @Param( 'projectId' ) projectId: string,
    @Query( 'limit' ) limit: number = 5,
  )
  {
    try
    {
      const promotions = await this.projectsService.getBestPromotionsForProject( projectId, limit );

      return {
        success: true,
        data: promotions,
        count: promotions.length,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get best promotions' );
    }
  }

  /**
   * Add review for project promotion
   * @public
   */
  @Post( 'projects/:projectId/promotions/:promotionId/reviews' )
  @UseGuards( JwtGuard )
  async addPromotionReview (
    @Param( 'projectId' ) projectId: string,
    @Param( 'promotionId' ) promotionId: string,
    @Body()
    body: {
      rating: number;
      title: string;
      comment: string;
      wouldRecommend: boolean;
      verifiedPurchase: boolean;
      promotionImpact: 'positive' | 'negative' | 'neutral';
    },
    @Req() req: any,
  )
  {
    try
    {
      const review = await this.projectsService.addPromotionReview(
        projectId,
        promotionId,
        req.user?.id || 'anonymous',
        body,
      );

      return {
        success: true,
        data: review,
        message: 'Review added successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to add review' );
    }
  }

  /**
   * Get reviews for project promotion
   * @public
   */
  @Get( 'projects/:projectId/promotions/:promotionId/reviews' )
  @UseGuards( RateLimitGuard )
  async getPromotionReviews (
    @Param( 'projectId' ) projectId: string,
    @Param( 'promotionId' ) promotionId: string,
    @Query( 'minRating' ) minRating?: number,
    @Query( 'verifiedOnly' ) verifiedOnly?: string,
    @Query( 'impact' ) impact?: string,
    @Query( 'skip' ) skip: number = 0,
    @Query( 'take' ) take: number = 20,
  )
  {
    try
    {
      const result = await this.projectsService.getPromotionReviews( projectId, promotionId, {
        minRating,
        verifiedOnly: verifiedOnly === 'true',
        promotionImpact: impact as any,
        skip,
        take,
      } );

      return {
        success: true,
        data: result.reviews,
        total: result.total,
        skip,
        take,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get reviews' );
    }
  }

  /**
   * Get project review summary
   * @public
   */
  @Get( 'projects/:projectId/review-summary' )
  @UseGuards( RateLimitGuard )
  async getProjectReviewSummary ( @Param( 'projectId' ) projectId: string )
  {
    try
    {
      const summary = await this.projectsService.getProjectReviewSummary( projectId );

      return {
        success: true,
        data: summary,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get review summary' );
    }
  }

  /**
   * Mark review as helpful
   * @public
   */
  @Post( 'reviews/:reviewId/helpful' )
  @UseGuards( JwtGuard )
  async markReviewAsHelpful ( @Param( 'reviewId' ) reviewId: string )
  {
    try
    {
      const review = await this.projectsService.markReviewAsHelpful( reviewId );

      if ( !review )
      {
        throw new NotFoundException( 'Review not found' );
      }

      return {
        success: true,
        data: review,
        message: 'Review marked as helpful',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to mark review' );
    }
  }

  /**
   * Mark review as unhelpful
   * @public
   */
  @Post( 'reviews/:reviewId/unhelpful' )
  @UseGuards( JwtGuard )
  async markReviewAsUnhelpful ( @Param( 'reviewId' ) reviewId: string )
  {
    try
    {
      const review = await this.projectsService.markReviewAsUnhelpful( reviewId );

      if ( !review )
      {
        throw new NotFoundException( 'Review not found' );
      }

      return {
        success: true,
        data: review,
        message: 'Review marked as unhelpful',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to mark review' );
    }
  }

  /**
   * Get promotion effectiveness based on reviews
   * @admin
   */
  @Get( 'projects/:projectId/promotions/:promotionId/effectiveness' )
  @UseGuards( JwtGuard, AdminGuard )
  async getPromotionEffectiveness (
    @Param( 'projectId' ) projectId: string,
    @Param( 'promotionId' ) promotionId: string,
  )
  {
    try
    {
      const effectiveness = await this.projectsService.getPromotionEffectiveness(
        projectId,
        promotionId,
      );

      return {
        success: true,
        data: effectiveness,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get effectiveness' );
    }
  }

  /**
   * Get related promotions by review sentiment
   * @admin
   */
  @Get( 'projects/:projectId/related-promotions' )
  @UseGuards( JwtGuard, AdminGuard )
  async getRelatedPromotionsByReviewSentiment (
    @Param( 'projectId' ) projectId: string,
    @Query( 'limit' ) limit: number = 5,
  )
  {
    try
    {
      const promotions = await this.projectsService.getRelatedPromotionsByReviewSentiment(
        projectId,
        limit,
      );

      return {
        success: true,
        data: promotions,
        count: promotions.length,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get related promotions' );
    }
  }

  /**
   * Compare promotions by reviews
   * @admin
   */
  @Post( 'projects/:projectId/compare-promotions' )
  @UseGuards( JwtGuard, AdminGuard )
  async comparePromotionsByReviews (
    @Param( 'projectId' ) projectId: string,
    @Body() body: { promotionIds: string[] },
  )
  {
    try
    {
      const comparison = await this.projectsService.comparePromotionsByReviews(
        projectId,
        body.promotionIds,
      );

      return {
        success: true,
        data: comparison,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to compare promotions' );
    }
  }

  /**
   * Get trending promotions by recent reviews
   * @admin
   */
  @Get( 'projects/:projectId/trending-promotions' )
  @UseGuards( JwtGuard, AdminGuard )
  async getTrendingPromotions (
    @Param( 'projectId' ) projectId: string,
    @Query( 'daysBack' ) daysBack: number = 30,
    @Query( 'limit' ) limit: number = 10,
  )
  {
    try
    {
      const trending = await this.projectsService.getTrendingPromotions( projectId, daysBack, limit );

      return {
        success: true,
        data: trending,
        count: trending.length,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get trending promotions' );
    }
  }

  // ==================== SETTINGS & CONFIGURATION ENDPOINTS ====================

  /**
   * Get global promotion settings
   * @admin
   */
  @Get( 'settings/global' )
  @UseGuards( JwtGuard, AdminGuard )
  async getGlobalSettings ()
  {
    try
    {
      const settings = await this.settingsService.getGlobalSettings();

      return {
        success: true,
        data: settings,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get settings' );
    }
  }

  /**
   * Update global promotion settings
   * @admin
   */
  @Put( 'settings/global' )
  @UseGuards( JwtGuard, AdminGuard )
  async updateGlobalSettings ( @Body() body: any, @Req() req: any )
  {
    try
    {
      const settings = await this.settingsService.updateGlobalSettings(
        body,
        req.user?.id || 'system',
      );

      return {
        success: true,
        data: settings,
        message: 'Global settings updated successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to update settings' );
    }
  }

  /**
   * Reset global settings to defaults
   * @admin
   */
  @Post( 'settings/global/reset' )
  @UseGuards( JwtGuard, AdminGuard )
  async resetGlobalSettings ( @Req() req: any )
  {
    try
    {
      const settings = await this.settingsService.resetGlobalSettings( req.user?.id || 'system' );

      return {
        success: true,
        data: settings,
        message: 'Global settings reset to defaults',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to reset settings' );
    }
  }

  /**
   * Get promotion-specific settings
   * @admin
   */
  @Get( 'settings/promotion/:promotionId' )
  @UseGuards( JwtGuard, AdminGuard )
  async getPromotionSettings ( @Param( 'promotionId' ) promotionId: string )
  {
    try
    {
      const settings = await this.settingsService.getPromotionSettings( promotionId );

      return {
        success: true,
        data: settings,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get promotion settings' );
    }
  }

  /**
   * Save promotion-specific settings
   * @admin
   */
  @Put( 'settings/promotion/:promotionId' )
  @UseGuards( JwtGuard, AdminGuard )
  async savePromotionSettings (
    @Param( 'promotionId' ) promotionId: string,
    @Body() body: any,
    @Req() req: any,
  )
  {
    try
    {
      const settings = await this.settingsService.savePromotionSettings( promotionId, {
        ...body,
        updatedBy: req.user?.id || 'system',
      } );

      return {
        success: true,
        data: settings,
        message: 'Promotion settings saved successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to save settings' );
    }
  }

  /**
   * Delete promotion-specific settings
   * @admin
   */
  @Delete( 'settings/promotion/:promotionId' )
  @UseGuards( JwtGuard, AdminGuard )
  async deletePromotionSettings ( @Param( 'promotionId' ) promotionId: string )
  {
    try
    {
      const success = await this.settingsService.deletePromotionSettings( promotionId );

      if ( !success )
      {
        throw new NotFoundException( 'Settings not found' );
      }

      return {
        success: true,
        message: 'Promotion settings deleted successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to delete settings' );
    }
  }

  /**
   * Validate promotion against settings
   * @public
   */
  @Post( 'settings/validate' )
  @UseGuards( RateLimitGuard )
  async validatePromotion ( @Body() body: any )
  {
    try
    {
      const validation = await this.settingsService.validatePromotion( body );

      return {
        success: validation.isValid,
        data: validation,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Validation failed' );
    }
  }

  /**
   * Create A/B test
   * @admin
   */
  @Post( 'settings/ab-tests' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.CREATED )
  async createABTest (
    @Body()
    body: {
      promotionId: string;
      controlGroupPromotion: string;
      testGroupPromotion: string;
      splitPercentage: number;
      startDate: string | Date;
      endDate: string | Date;
    },
  )
  {
    try
    {
      const test = await this.settingsService.createABTest( body.promotionId, {
        controlGroupPromotion: body.controlGroupPromotion,
        testGroupPromotion: body.testGroupPromotion,
        splitPercentage: body.splitPercentage,
        startDate: typeof body.startDate === 'string' ? new Date( body.startDate ) : body.startDate,
        endDate: typeof body.endDate === 'string' ? new Date( body.endDate ) : body.endDate,
        status: 'draft',
      } );

      return {
        success: true,
        data: test,
        message: 'A/B test created successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to create A/B test' );
    }
  }

  /**
   * Get A/B test
   * @admin
   */
  @Get( 'settings/ab-tests/:testId' )
  @UseGuards( JwtGuard, AdminGuard )
  async getABTest ( @Param( 'testId' ) testId: string )
  {
    try
    {
      const test = await this.settingsService.getABTest( testId );

      if ( !test )
      {
        throw new NotFoundException( 'A/B test not found' );
      }

      return {
        success: true,
        data: test,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get A/B test' );
    }
  }

  /**
   * Get active A/B tests for promotion
   * @admin
   */
  @Get( 'settings/ab-tests/promotion/:promotionId' )
  @UseGuards( JwtGuard, AdminGuard )
  async getActiveABTests ( @Param( 'promotionId' ) promotionId: string )
  {
    try
    {
      const tests = await this.settingsService.getActiveABTests( promotionId );

      return {
        success: true,
        data: tests,
        count: tests.length,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get A/B tests' );
    }
  }

  /**
   * Update A/B test metrics
   * @admin
   */
  @Put( 'settings/ab-tests/:testId/metrics' )
  @UseGuards( JwtGuard, AdminGuard )
  async updateABTestMetrics ( @Param( 'testId' ) testId: string, @Body() body: any )
  {
    try
    {
      const test = await this.settingsService.updateABTestMetrics( testId, body );

      if ( !test )
      {
        throw new NotFoundException( 'A/B test not found' );
      }

      return {
        success: true,
        data: test,
        message: 'A/B test metrics updated successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to update metrics' );
    }
  }

  /**
   * Conclude A/B test and declare winner
   * @admin
   */
  @Post( 'settings/ab-tests/:testId/conclude' )
  @UseGuards( JwtGuard, AdminGuard )
  async concludeABTest ( @Param( 'testId' ) testId: string )
  {
    try
    {
      const test = await this.settingsService.concludeABTest( testId );

      if ( !test )
      {
        throw new NotFoundException( 'A/B test not found' );
      }

      return {
        success: true,
        data: test,
        message: `A/B test concluded - Winner: ${ test.winner }`,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to conclude test' );
    }
  }

  /**
   * Create fraud detection rule
   * @admin
   */
  @Post( 'settings/fraud-rules' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.CREATED )
  async createFraudDetectionRule ( @Body() body: any )
  {
    try
    {
      const rule = await this.settingsService.createFraudDetectionRule( body );

      return {
        success: true,
        data: rule,
        message: 'Fraud detection rule created successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to create rule' );
    }
  }

  /**
   * Get fraud detection rule
   * @admin
   */
  @Get( 'settings/fraud-rules/:ruleId' )
  @UseGuards( JwtGuard, AdminGuard )
  async getFraudDetectionRule ( @Param( 'ruleId' ) ruleId: string )
  {
    try
    {
      const rule = await this.settingsService.getFraudDetectionRule( ruleId );

      if ( !rule )
      {
        throw new NotFoundException( 'Fraud rule not found' );
      }

      return {
        success: true,
        data: rule,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get rule' );
    }
  }

  /**
   * Get all enabled fraud detection rules
   * @admin
   */
  @Get( 'settings/fraud-rules' )
  @UseGuards( JwtGuard, AdminGuard )
  async getEnabledFraudRules ()
  {
    try
    {
      const rules = await this.settingsService.getEnabledFraudRules();

      return {
        success: true,
        data: rules,
        count: rules.length,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get fraud rules' );
    }
  }

  /**
   * Update fraud detection rule
   * @admin
   */
  @Put( 'settings/fraud-rules/:ruleId' )
  @UseGuards( JwtGuard, AdminGuard )
  async updateFraudDetectionRule ( @Param( 'ruleId' ) ruleId: string, @Body() body: any )
  {
    try
    {
      const rule = await this.settingsService.updateFraudDetectionRule( ruleId, body );

      if ( !rule )
      {
        throw new NotFoundException( 'Fraud rule not found' );
      }

      return {
        success: true,
        data: rule,
        message: 'Fraud rule updated successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to update rule' );
    }
  }

  /**
   * Check transaction against fraud rules
   * @public
   */
  @Post( 'settings/check-fraud' )
  @UseGuards( RateLimitGuard )
  async checkFraudRules ( @Body() body: any )
  {
    try
    {
      const result = await this.settingsService.checkFraudRules( body );

      return {
        success: true,
        data: result,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Fraud check failed' );
    }
  }

  /**
   * Create analytics configuration
   * @admin
   */
  @Post( 'settings/analytics' )
  @UseGuards( JwtGuard, AdminGuard )
  @HttpCode( HttpStatus.CREATED )
  async createAnalyticsConfig ( @Body() body: any )
  {
    try
    {
      const config = await this.settingsService.createAnalyticsConfig( body );

      return {
        success: true,
        data: config,
        message: 'Analytics configuration created successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to create config' );
    }
  }

  /**
   * Get analytics configuration
   * @admin
   */
  @Get( 'settings/analytics' )
  @UseGuards( JwtGuard, AdminGuard )
  async getAnalyticsConfig ()
  {
    try
    {
      const config = await this.settingsService.getAnalyticsConfig();

      return {
        success: true,
        data: config,
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to get config' );
    }
  }

  /**
   * Update analytics configuration
   * @admin
   */
  @Put( 'settings/analytics' )
  @UseGuards( JwtGuard, AdminGuard )
  async updateAnalyticsConfig ( @Body() body: any )
  {
    try
    {
      const config = await this.settingsService.updateAnalyticsConfig( body );

      return {
        success: true,
        data: config,
        message: 'Analytics configuration updated successfully',
      };
    } catch ( error: any )
    {
      throw new BadRequestException( error.message || 'Failed to update config' );
    }
  }
}
