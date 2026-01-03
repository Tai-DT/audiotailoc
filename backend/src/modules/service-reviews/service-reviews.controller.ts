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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ServiceReviewsService } from './service-reviews.service';
import { JwtGuard } from '../auth/jwt.guard';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';
import { RateLimitGuard } from '../common/rate-limit.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { CreateServiceReviewDto, UpdateServiceReviewDto } from './dto/service-review.dto';

@ApiTags('Service Reviews')
@ApiBearerAuth()
@Controller('service-reviews')
export class ServiceReviewsController {
  constructor(private readonly serviceReviewsService: ServiceReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all service reviews' })
  @ApiResponse({ status: 200, description: 'Service reviews retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'serviceId', required: false, type: String })
  @ApiQuery({ name: 'rating', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  async getReviews(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('serviceId') serviceId?: string,
    @Query('rating') rating?: string,
    @Query('status') status?: string,
  ) {
    return this.serviceReviewsService.findAll({
      page: Number(page),
      pageSize: Number(pageSize),
      serviceId,
      rating: rating ? Number(rating) : undefined,
      status,
    });
  }

  // IMPORTANT: Static routes must come BEFORE dynamic routes (:id)
  @Get('stats/summary')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Get service review statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getReviewStats() {
    return this.serviceReviewsService.getStats();
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get reviews for a specific service' })
  @ApiResponse({ status: 200, description: 'Service reviews retrieved successfully' })
  @ApiParam({ name: 'serviceId', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getServiceReviews(
    @Param('serviceId') serviceId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.serviceReviewsService.findByServiceId(serviceId, {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Get('service/:serviceId/rating')
  @ApiOperation({ summary: 'Get average rating for a service' })
  @ApiResponse({ status: 200, description: 'Average rating retrieved successfully' })
  @ApiParam({ name: 'serviceId', type: String })
  async getServiceRating(@Param('serviceId') serviceId: string) {
    return this.serviceReviewsService.getServiceAverageRating(serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service review by ID' })
  @ApiResponse({ status: 200, description: 'Service review retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Service review not found' })
  async getReview(@Param('id') id: string) {
    return this.serviceReviewsService.findById(id);
  }

  @Post()
  @UseGuards(JwtGuard, RateLimitGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service review' })
  @ApiResponse({ status: 201, description: 'Service review created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async createReview(@Req() req: any, @Body() createReviewDto: CreateServiceReviewDto) {
    // SECURITY: Force userId from authenticated session
    createReviewDto.userId = req.user.sub || req.user.id;
    return this.serviceReviewsService.create(createReviewDto);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update service review' })
  @ApiResponse({ status: 200, description: 'Service review updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your review' })
  @ApiResponse({ status: 404, description: 'Service review not found' })
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateServiceReviewDto,
    @Req() req: any,
  ) {
    // SECURITY: Prevent IDOR - users can only update their own reviews unless they're admin
    const review = await this.serviceReviewsService.findById(id);
    const authenticatedUserId = req.user?.sub || req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;

    if (!isAdmin && review.userId !== authenticatedUserId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    return this.serviceReviewsService.update(id, updateReviewDto);
  }

  @Patch(':id/status/:status')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Update service review status (approve/reject)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Service review not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'status', enum: ['APPROVED', 'REJECTED', 'PENDING'] })
  async updateReviewStatus(
    @Param('id') id: string,
    @Param('status') status: 'APPROVED' | 'REJECTED' | 'PENDING',
  ) {
    return this.serviceReviewsService.updateStatus(id, status);
  }

  @Patch(':id/response')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Add admin response to service review' })
  @ApiResponse({ status: 200, description: 'Response added successfully' })
  @ApiResponse({ status: 404, description: 'Service review not found' })
  async addResponse(@Param('id') id: string, @Body('response') response: string) {
    return this.serviceReviewsService.update(id, { response });
  }

  @Delete(':id')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Delete service review' })
  @ApiResponse({ status: 200, description: 'Service review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service review not found' })
  async deleteReview(@Param('id') id: string) {
    return this.serviceReviewsService.delete(id);
  }

  @Patch(':id/helpful/:helpful')
  @UseGuards(OptionalJwtGuard, RateLimitGuard)
  @ApiOperation({ summary: 'Mark service review as helpful/unhelpful' })
  @ApiResponse({ status: 200, description: 'Vote recorded successfully' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'helpful', enum: ['true', 'false'] })
  async markHelpful(@Param('id') id: string, @Param('helpful') helpful: 'true' | 'false') {
    return this.serviceReviewsService.markHelpful(id, helpful === 'true');
  }
}
