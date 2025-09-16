import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AdminGuard } from '../auth/admin.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Public endpoints
  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  async list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('featured') featured?: string,
    @Query('category') category?: string,
  ) {
    return this.projectsService.findAll({
      page,
      limit,
      status,
      featured: featured === 'true',
      category,
    });
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured projects' })
  async getFeatured() {
    return this.projectsService.findFeatured();
  }

  @Get('by-slug/:slug')
  @ApiOperation({ summary: 'Get project by slug' })
  async getBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  async getById(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  // Admin endpoints
  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create new project' })
  async create(@Body() data: any) {
    return this.projectsService.create(data);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.projectsService.update(id, data);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post(':id/toggle-featured')
  @ApiOperation({ summary: 'Toggle project featured status' })
  async toggleFeatured(@Param('id') id: string) {
    return this.projectsService.toggleFeatured(id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle project active status' })
  async toggleActive(@Param('id') id: string) {
    return this.projectsService.toggleActive(id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put(':id/reorder')
  @ApiOperation({ summary: 'Update project display order' })
  async updateOrder(
    @Param('id') id: string,
    @Body('displayOrder') displayOrder: number,
  ) {
    return this.projectsService.updateDisplayOrder(id, displayOrder);
  }
}
