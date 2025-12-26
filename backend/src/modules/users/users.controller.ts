import
  {
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

class CreateUserDto
{
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength( 6 )
  password?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum( [ 'USER', 'ADMIN' ] )
  role?: 'USER' | 'ADMIN';

  @IsOptional()
  generatePassword?: boolean;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  emailNotifications?: boolean;

  @IsOptional()
  smsNotifications?: boolean;

  @IsOptional()
  promoNotifications?: boolean;
}

class UpdateUserDto
{
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum( [ 'USER', 'ADMIN' ] )
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

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  emailNotifications?: boolean;

  @IsOptional()
  smsNotifications?: boolean;

  @IsOptional()
  promoNotifications?: boolean;
}

@Controller( 'users' )
export class UsersController
{
  constructor( private readonly usersService: UsersService ) { }

  @UseGuards( AdminOrKeyGuard )
  @Get()
  async findAll (
    @Query( 'page' ) page = '1',
    @Query( 'limit' ) limit = '10',
    @Query( 'search' ) search?: string,
    @Query( 'role' ) role?: string,
    @Query( 'status' ) status?: string,
    @Query( 'startDate' ) startDate?: string,
    @Query( 'endDate' ) endDate?: string,
    @Query( 'sortBy' ) sortBy = 'createdAt',
    @Query( 'sortOrder' ) sortOrder = 'desc',
  )
  {
    return this.usersService.findAll( {
      page: parseInt( page ),
      limit: parseInt( limit ),
      search,
      role,
      status,
      startDate,
      endDate,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
    } );
  }

  @UseGuards( JwtGuard )
  @Get( 'profile' )
  async getProfile ( @Req() req: any )
  {
    const userId = req.user?.sub;
    if ( !userId )
    {
      throw new UnauthorizedException( 'User not authenticated' );
    }
    return this.usersService.findById( userId );
  }

  @UseGuards( JwtGuard )
  @Get( 'export-data' )
  async exportUserData ( @Req() req: any )
  {
    const userId = req.user?.sub;
    if ( !userId )
    {
      throw new UnauthorizedException( 'User not authenticated' );
    }
    return this.usersService.exportUserData( userId );
  }

  @UseGuards( JwtGuard )
  @Get( ':id' )
  async findOne ( @Param( 'id' ) id: string, @Req() req: any )
  {
    // SECURITY: Prevent IDOR - users can only view their own profile unless they're admin
    const user = req.user;
    const isAdmin = user?.role === 'ADMIN' || user?.email === process.env.ADMIN_EMAIL;
    
    // Allow admin to view any user, or user to view themselves
    if (!isAdmin && user?.sub !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    
    return this.usersService.findById( id );
  }

  @UseGuards( AdminOrKeyGuard )
  @Post()
  async create ( @Body() createUserDto: CreateUserDto )
  {
    return this.usersService.create( createUserDto );
  }

  @UseGuards( JwtGuard )
  @Put( ':id' )
  async update ( @Param( 'id' ) id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any )
  {
    // SECURITY: Prevent IDOR - users can only update their own profile unless they're admin
    const user = req.user;
    const isAdmin = user?.role === 'ADMIN' || user?.email === process.env.ADMIN_EMAIL;
    
    // Allow admin to update any user, or user to update themselves
    if (!isAdmin && user?.sub !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    
    return this.usersService.update( id, updateUserDto, user );
  }

  @UseGuards( JwtGuard )
  @Delete( ':id' )
  async remove ( @Param( 'id' ) id: string, @Req() req: any )
  {
    return this.usersService.remove( id, req.user );
  }

  @UseGuards( AdminOrKeyGuard )
  @Get( 'stats/overview' )
  async getStats ()
  {
    return this.usersService.getStats();
  }

  @UseGuards( AdminOrKeyGuard )
  @Get( 'stats/activity' )
  async getActivityStats ( @Query( 'days' ) days = '30' )
  {
    return this.usersService.getActivityStats( parseInt( days ) );
  }
}
