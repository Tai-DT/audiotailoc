import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PromotionsService, CreatePromotionDto, UpdatePromotionDto } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  /**
   * Get all promotions with optional filters
   * Public endpoint - anyone can view promotions
   */
  @Get()
  async getPromotions(
    @Query('isActive') isActive?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};

    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }

    if (type) {
      filters.type = type;
    }

    if (search) {
      filters.search = search;
    }

    return this.promotionsService.findAll(filters);
  }

  /**
   * Get promotion statistics
   * IMPORTANT: Must be before @Get(':id') to avoid route conflicts
   */
  @Get('stats')
  async getStats() {
    return this.promotionsService.getStats();
  }

  /**
   * Get promotion by code
   * Public endpoint - for checkout validation
   */
  @Get('code/:code')
  async getPromotionByCode(@Param('code') code: string) {
    return this.promotionsService.findByCode(code);
  }

  /**
   * Validate promotion code
   * Public endpoint - for real-time validation during checkout
   */
  @Post('validate')
  async validateCode(@Body() body: { code: string; orderAmount?: number }) {
    return this.promotionsService.validateCode(body.code, body.orderAmount || 0);
  }

  /**
   * Get promotion by ID
   * Public endpoint
   * IMPORTANT: Must be after specific routes like 'stats', 'code/:code'
   */
  @Get(':id')
  async getPromotion(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  /**
   * Apply promotion to cart
   * Public endpoint for checkout
   */
  @Post('apply-to-cart')
  async applyToCart(
    @Body()
    body: {
      code: string;
      items: Array<{
        productId: string;
        categoryId?: string;
        quantity: number;
        priceCents: number;
      }>;
    },
  ) {
    return this.promotionsService.applyToCart(body.code, body.items);
  }

  /**
   * Get promotions for a specific product
   * Public endpoint
   */
  @Get('product/:productId')
  async getPromotionsForProduct(
    @Param('productId') productId: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.promotionsService.getPromotionsForProduct(productId, categoryId);
  }

  /**
   * Check if product is eligible for promotion
   * Public endpoint
   */
  @Get(':id/eligible/:productId')
  async isProductEligible(
    @Param('id') id: string,
    @Param('productId') productId: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const eligible = await this.promotionsService.isProductEligible(id, productId, categoryId);
    return {
      success: true,
      eligible,
    };
  }

  /**
   * Create new promotion
   */
  @Post()
  async createPromotion(@Body() createDto: CreatePromotionDto) {
    return this.promotionsService.create(createDto);
  }

  /**
   * Update promotion
   */
  @Put(':id')
  async updatePromotion(@Param('id') id: string, @Body() updateDto: UpdatePromotionDto) {
    return this.promotionsService.update(id, updateDto);
  }

  /**
   * Delete promotion
   */
  @Delete(':id')
  async deletePromotion(@Param('id') id: string) {
    return this.promotionsService.delete(id);
  }

  /**
   * Duplicate promotion
   */
  @Post(':id/duplicate')
  async duplicatePromotion(@Param('id') id: string) {
    return this.promotionsService.duplicate(id);
  }

  /**
   * Toggle promotion active status
   */
  @Put(':id/toggle')
  async togglePromotion(@Param('id') id: string) {
    return this.promotionsService.toggleActive(id);
  }

  /**
   * Health check endpoint
   */
  @Get('status')
  async getStatus() {
    return this.promotionsService.getStatus();
  }
}
