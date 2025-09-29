import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

export interface CreatePolicyDto {
  title: string;
  contentHtml: string;
  summary?: string;
  type: string; // Changed from union type to string
  isPublished?: boolean;
}

export interface UpdatePolicyDto {
  title?: string;
  contentHtml?: string;
  summary?: string;
  isPublished?: boolean;
}

@ApiTags('policies')
@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all policies' })
  async findAll() {
    return this.policiesService.findAll();
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get policy by type' })
  async findByType(@Param('type') type: string) {
    return this.policiesService.findByType(type);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get policy by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.policiesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Create new policy' })
  async create(@Body() data: CreatePolicyDto) {
    return this.policiesService.create(data);
  }

  @Put(':slug')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Update policy' })
  async update(@Param('slug') slug: string, @Body() data: UpdatePolicyDto) {
    return this.policiesService.update(slug, data);
  }

  @Delete(':slug')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Delete policy' })
  async delete(@Param('slug') slug: string) {
    return this.policiesService.delete(slug);
  }
}
