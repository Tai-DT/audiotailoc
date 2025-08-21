import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';

class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN'])
  role?: 'USER' | 'ADMIN';
}

class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN'])
  role?: 'USER' | 'ADMIN';
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AdminGuard)
  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.usersService.findAll({
      page: parseInt(page),
      limit: parseInt(limit)
    });
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Param('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(AdminGuard)
  @Get('stats/overview')
  async getStats() {
    return this.usersService.getStats();
  }

  @UseGuards(AdminGuard)
  @Get('stats/activity')
  async getActivityStats(@Query('days') days = '30') {
    return this.usersService.getActivityStats(parseInt(days));
  }
}
