import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Public endpoints
  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  async list(@Query(ValidationPipe) query: QueryProjectsDto) {
    return this.projectsService.findAll(query);
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
  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post()
  @ApiOperation({ summary: 'Create new project' })
  async create(@Body(ValidationPipe) data: CreateProjectDto, @Req() req: any) {
    // Inject userId from request
    // Note: In a real app, we'd get this from the JWT token in the request
    // For now, we'll assume the guard attaches the user to the request
    // or use a default admin ID if not available (for testing)
    const userId = req?.user?.id || 'admin-id-placeholder';
    data.userId = userId;
    return this.projectsService.create(data);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  async update(@Param('id') id: string, @Body(ValidationPipe) data: UpdateProjectDto) {
    return this.projectsService.update(id, data);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete project' })
  @ApiQuery({ name: 'permanent', required: false, type: Boolean })
  async remove(@Param('id') id: string, @Query('permanent') permanent?: string) {
    const isPermanent = permanent === 'true';
    return this.projectsService.remove(id, isPermanent);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post(':id/toggle-featured')
  @ApiOperation({ summary: 'Toggle project featured status' })
  async toggleFeatured(@Param('id') id: string) {
    return this.projectsService.toggleFeatured(id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle project active status' })
  async toggleActive(@Param('id') id: string) {
    return this.projectsService.toggleActive(id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Put(':id/reorder')
  @ApiOperation({ summary: 'Update project display order' })
  async updateOrder(@Param('id') id: string, @Body('displayOrder') displayOrder: number) {
    return this.projectsService.updateDisplayOrder(id, displayOrder);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore soft-deleted project' })
  async restore(@Param('id') id: string) {
    return this.projectsService.restore(id);
  }
}
