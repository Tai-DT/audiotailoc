import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  // Public endpoints
  @Get('product/:productId')
  async listProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('rating') rating?: string,
    @Query('verified') verified?: string,
    @Query('sortBy') sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful',
  ) {
    return this.reviews.getProductReviews(productId, {
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      rating: rating ? parseInt(rating, 10) : undefined,
      verified: verified ? verified === 'true' : undefined,
      sortBy,
    });
  }

  @Get('user/:userId')
  async listUserReviews(@Param('userId') userId: string) {
    return this.reviews.getUserReviews(userId);
  }

  @Post()
  async createReview(@Body() body: { userId: string; productId: string; rating: number; title: string; content: string; images?: string[] }) {
    return this.reviews.createReview(body.userId, {
      productId: body.productId,
      rating: body.rating,
      title: body.title,
      content: body.content,
      images: body.images,
    });
  }

  @Put(':id')
  async updateReview(
    @Param('id') id: string,
    @Body() body: Partial<{ userId: string; productId: string; rating: number; title: string; content: string; images?: string[] }>,
  ) {
    if (!body.userId) throw new Error('userId is required');
    return this.reviews.updateReview(body.userId, id, body as any);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string, @Query('userId') userId: string) {
    return this.reviews.deleteReview(userId, id);
  }

  // Voting/reporting
  @Post(':id/helpful')
  async markHelpful(@Param('id') id: string, @Body() body: { userId: string }) {
    await this.reviews.markReviewHelpful(body.userId, id);
    return { success: true };
  }

  @Post(':id/report')
  async report(@Param('id') id: string, @Body() body: { userId: string; reason: string }) {
    await this.reviews.reportReview(body.userId, id, body.reason);
    return { success: true };
  }

  // Admin moderation
  @UseGuards(AdminGuard)
  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    await this.reviews.approveReview(id);
    return { success: true };
  }

  @UseGuards(AdminGuard)
  @Post(':id/reject')
  async reject(@Param('id') id: string) {
    await this.reviews.rejectReview(id);
    return { success: true };
  }
}

