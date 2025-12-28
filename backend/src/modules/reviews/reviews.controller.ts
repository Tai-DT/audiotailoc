import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtGuard } from '../auth/jwt.guard';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';
import { RateLimitGuard } from '../common/rate-limit.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@ApiTags('Reviews')
@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async getReviews(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('productId') productId?: string,
    @Query('rating') rating?: string,
    @Query('status') status?: string,
  ) {
    return this.reviewsService.findAll({
      page: Number(page),
      pageSize: Number(pageSize),
      productId,
      rating: rating ? Number(rating) : undefined,
      status,
    });
  }

  // IMPORTANT: Static routes must come BEFORE dynamic routes (:id)
  @Get('stats/summary')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Get review statistics' })
  async getReviewStats() {
    return this.reviewsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  async getReview(@Param('id') id: string) {
    return this.reviewsService.findById(id);
  }

  @Post()
  @UseGuards(JwtGuard, RateLimitGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new review' })
  async createReview(@Req() req: any, @Body() createReviewDto: CreateReviewDto) {
    // SECURITY: Force userId from authenticated session
    createReviewDto.userId = req.user.sub || req.user.id;
    return this.reviewsService.create(createReviewDto);
  }

  @Put(':id')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Update review' })
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req?: any,
  ) {
    // SECURITY: Prevent IDOR - users can only update their own reviews unless they're admin
    if (req?.user) {
      const review = await this.reviewsService.findById(id);
      const authenticatedUserId = req.user?.sub || req.user?.id;
      const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;

      const reviewUserId = (review as any)?.userId || (review as any)?.users?.id;
      if (!isAdmin && reviewUserId && reviewUserId !== authenticatedUserId) {
        throw new ForbiddenException('You can only update your own reviews');
      }
    }

    return this.reviewsService.update(id, updateReviewDto);
  }

  @Patch(':id/status/:status')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Update review status (approve/reject)' })
  async updateReviewStatus(
    @Param('id') id: string,
    @Param('status') status: 'APPROVED' | 'REJECTED' | 'PENDING',
  ) {
    return this.reviewsService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Delete review' })
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }

  @Patch(':id/helpful/:helpful')
  @UseGuards(OptionalJwtGuard, RateLimitGuard)
  @ApiOperation({ summary: 'Mark review as helpful/unhelpful' })
  async markHelpful(@Param('id') id: string, @Param('helpful') helpful: 'true' | 'false') {
    return this.reviewsService.markHelpful(id, helpful === 'true');
  }
}
