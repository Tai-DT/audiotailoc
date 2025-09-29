import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ListPromotionsDto } from './dto/list-promotions.dto';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotions: PromotionService) {}

  @Get()
  async findAll(@Query() query: ListPromotionsDto) {
    return this.promotions.list(query);
  }

  @Get('status')
  getStatus() {
    return {
      module: 'promotions',
      status: 'operational',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.promotions.getById(id);
  }

  @UseGuards(AdminOrKeyGuard)
  @Post()
  async create(@Body() dto: CreatePromotionDto) {
    return this.promotions.create(dto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.promotions.update(id, dto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.promotions.remove(id);
  }

  @UseGuards(AdminOrKeyGuard)
  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string) {
    return this.promotions.duplicate(id);
  }
}
