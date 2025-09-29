import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ReviewsService } from './reviews.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { CreateReviewDto } from './dto/create-review.dto';

interface AuthenticatedRequest extends Request {
  user?: {
    sub?: string;
    id?: string;
    email?: string;
    role?: string;
  };
}

@Controller('reviews')
@UseGuards(AdminOrKeyGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getReviews(
    @Query('status') status?: string,
    @Query('rating') rating?: string,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    const ratingValue = rating ? Number(rating) : undefined;
    return this.reviewsService.getReviews({
      status,
      rating: ratingValue,
      search,
      page,
      limit,
    });
  }

  @Post()
  async createReview(@Body() dto: CreateReviewDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.reviewsService.createReview(userId, dto);
  }

  @Post(':id/approve')
  async approveReview(@Param('id') id: string) {
    await this.reviewsService.approveReview(id);
    return { message: 'Review approved successfully' };
  }

  @Post(':id/reject')
  async rejectReview(@Param('id') id: string, @Body('reason') reason?: string) {
    await this.reviewsService.rejectReview(id, reason);
    return { message: 'Review rejected successfully' };
  }

  @Put(':id')
  async respondToReview(@Param('id') id: string, @Body('response') response: string) {
    await this.reviewsService.respondToReview(id, response);
    return { message: 'Review responded successfully' };
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }

  @Post(':id/helpful')
  async markHelpful(@Param('id') id: string) {
    await this.reviewsService.markHelpful(id);
    return { message: 'Marked review as helpful' };
  }

  @Post(':id/report')
  async reportReview(@Param('id') id: string, @Body('reason') reason?: string) {
    await this.reviewsService.reportReview(id, reason);
    return { message: 'Review reported' };
  }
}
