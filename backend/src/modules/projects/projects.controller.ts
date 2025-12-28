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
  ParseIntPipe,
  DefaultValuePipe,
  UsePipes,
  ValidationPipe,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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
      featured: featured !== undefined ? featured === 'true' : undefined,
      category,
    });
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured projects' })
  async getFeatured() {
    try {
      return await this.projectsService.findFeatured();
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      // Return empty array instead of throwing 500
      return [];
    }
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
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: false }))
  async create(@Body() data: CreateProjectDto) {
    return this.projectsService.create(data);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: false }))
  async update(@Param('id') id: string, @Body() data: UpdateProjectDto, @Req() req?: any) {
    // SECURITY: Prevent IDOR - verify ownership before update
    // Note: Projects are admin-only for create/update/delete, but we still verify ownership for defense in depth
    if (req?.user) {
      const project = await this.projectsService.findById(id);
      const authenticatedUserId = req.user?.sub || req.user?.id;
      const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;

      const projectUserId = (project as any)?.userId || (project as any)?.users?.id;
      // Only enforce ownership check if project has a userId and user is not admin
      // Admin can update any project
      if (!isAdmin && projectUserId && projectUserId !== authenticatedUserId) {
        throw new ForbiddenException('You can only update your own projects');
      }

      // Prevent users from modifying userId to another user's ID
      if (data.userId && !isAdmin && data.userId !== authenticatedUserId) {
        throw new ForbiddenException('You cannot assign projects to other users');
      }
    }

    return this.projectsService.update(id, data);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  async remove(@Param('id') id: string, @Req() req?: any) {
    // SECURITY: Prevent IDOR - verify ownership before delete
    if (req?.user) {
      const project = await this.projectsService.findById(id);
      const authenticatedUserId = req.user?.sub || req.user?.id;
      const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;

      const projectUserId = (project as any)?.userId || (project as any)?.users?.id;
      if (!isAdmin && projectUserId && projectUserId !== authenticatedUserId) {
        throw new ForbiddenException('You can only delete your own projects');
      }
    }

    return this.projectsService.remove(id);
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
}
