import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Site')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active testimonials' })
  @ApiResponse({ status: 200, description: 'Return all active testimonials.' })
  findAll() {
    return this.testimonialsService.findAll();
  }
}
