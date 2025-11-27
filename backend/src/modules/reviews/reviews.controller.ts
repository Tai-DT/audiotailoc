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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
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

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  async getReview(@Param('id') id: string) {
    return this.reviewsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new review' })
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Put(':id')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Update review' })
  async updateReview(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
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

  @Get('stats/summary')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Get review statistics' })
  async getReviewStats() {
    return this.reviewsService.getStats();
  }

  @Patch(':id/helpful/:helpful')
  @ApiOperation({ summary: 'Mark review as helpful/unhelpful' })
  async markHelpful(@Param('id') id: string, @Param('helpful') helpful: 'true' | 'false') {
    return this.reviewsService.markHelpful(id, helpful === 'true');
  }
}
