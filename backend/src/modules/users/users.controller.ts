import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
  UnauthorizedException,
  ForbiddenException,
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
  password?: string;

  @IsOptional()
  isActive?: boolean;
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
  ) {
    return this.usersService.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      role,
      status,
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
  async findOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    const isAdmin = user?.role === 'ADMIN';

    if (!isAdmin && user?.sub !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

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
    const user = req.user;
    const isAdmin = user?.role === 'ADMIN';

    if (!isAdmin && user?.sub !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.usersService.update(id, updateUserDto, isAdmin);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
