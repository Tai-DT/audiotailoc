import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';

class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'DISABLED'])
  role?: 'USER' | 'ADMIN' | 'DISABLED';

  @IsOptional()
  generatePassword?: boolean;
}

class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'DISABLED'])
  role?: 'USER' | 'ADMIN' | 'DISABLED';
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AdminOrKeyGuard)
  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder = 'desc'
  ) {
    return this.usersService.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      role,
      status,
      startDate,
      endDate,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc'
    });
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(AdminOrKeyGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(id, req.user);
  }

  @UseGuards(AdminOrKeyGuard)
  @Get('stats/overview')
  async getStats() {
    return this.usersService.getStats();
  }

  @UseGuards(AdminOrKeyGuard)
  @Get('stats/activity')
  async getActivityStats(@Query('days') days = '30') {
    return this.usersService.getActivityStats(parseInt(days));
  }
}
