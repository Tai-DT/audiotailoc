import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
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
  @IsEnum(['USER', 'ADMIN'])
  role?: 'USER' | 'ADMIN';

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
  @IsEnum(['USER', 'ADMIN'])
  role?: 'USER' | 'ADMIN';
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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
    @Query('sortOrder') sortOrder = 'desc',
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
      sortOrder: sortOrder as 'asc' | 'desc',
    });
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    // DEBUG LOG
    console.log('[DEBUG_CONTROLLER] getProfile called');
    console.log('[DEBUG_CONTROLLER] req.user:', JSON.stringify(req.user));
    console.log('[DEBUG_CONTROLLER] req.users:', JSON.stringify((req as any).users));
    
    const userId = req.user?.sub || (req as any).users?.sub;
    console.log('[DEBUG_CONTROLLER] Extracted userId:', userId);
    
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user?.sub || (req as any).users?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    // Prevent users from changing their role
    // Prevent users from changing their role

    // Whitelist allowed fields to prevent security issues
    const sanitizedData = {
      name: updateUserDto.name,
      phone: updateUserDto.phone,
      address: updateUserDto.address,
      dateOfBirth: updateUserDto.dateOfBirth,
      gender: updateUserDto.gender,
    };

    // Remove undefined fields
    Object.keys(sanitizedData).forEach(key =>
      (sanitizedData as any)[key] === undefined && delete (sanitizedData as any)[key]
    );

    console.log('DEBUG_CONTROLLER: userId', userId);
    console.log('DEBUG_CONTROLLER: updateUserDto', JSON.stringify(updateUserDto));
    console.log('DEBUG_CONTROLLER: sanitizedData', JSON.stringify(sanitizedData));

    return this.usersService.update(userId, sanitizedData);
  }

  @UseGuards(JwtGuard)
  @Get('export-data')
  async exportUserData(@Req() req: any) {
    const userId = req.user?.sub || (req as any).users?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.usersService.exportUserData(userId);
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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const currentUser = req.user || (req as any).users;

    // Allow admin to update anyone, or user to update themselves
    if (currentUser.role !== 'ADMIN' && currentUser.sub !== id) {
      throw new UnauthorizedException('You can only update your own profile');
    }

    // Only admin can change roles
    if (updateUserDto.role && currentUser.role !== 'ADMIN') {
      throw new UnauthorizedException('Only admins can change user roles');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(id, req.users || req.user);
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
