import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';

@ApiTags('Testimonials')
@Controller()
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get('testimonials')
  @ApiOperation({ summary: 'Get testimonials' })
  @ApiResponse({
    status: 200,
    description: 'Testimonials retrieved successfully',
  })
  async getTestimonials() {
    return this.testimonialsService.getTestimonials();
  }
}
