import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('wishlist')
@UseGuards(JwtGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiResponse({ status: 201, description: 'Product added to wishlist successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Product already in wishlist' })
  async addToWishlist(@Request() req: AuthenticatedRequest, @Body() createWishlistDto: CreateWishlistDto) {
    const userId = req.user.sub;
    return this.wishlistService.addToWishlist(userId, createWishlistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist retrieved successfully' })
  async getWishlist(@Request() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.wishlistService.getWishlist(userId);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get wishlist item count' })
  @ApiResponse({ status: 200, description: 'Count retrieved successfully' })
  async getWishlistCount(@Request() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    const count = await this.wishlistService.getWishlistCount(userId);
    return { count };
  }

  @Get('check/:productId')
  @ApiOperation({ summary: 'Check if product is in wishlist' })
  @ApiResponse({ status: 200, description: 'Check completed successfully' })
  async isInWishlist(@Request() req: AuthenticatedRequest, @Param('productId') productId: string) {
    const userId = req.user.sub;
    const isInWishlist = await this.wishlistService.isInWishlist(userId, productId);
    return { isInWishlist };
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiResponse({ status: 200, description: 'Product removed from wishlist successfully' })
  @ApiResponse({ status: 404, description: 'Product not found in wishlist' })
  async removeFromWishlist(@Request() req: AuthenticatedRequest, @Param('productId') productId: string) {
    const userId = req.user.sub;
    return this.wishlistService.removeFromWishlist(userId, productId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear entire wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist cleared successfully' })
  async clearWishlist(@Request() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.wishlistService.clearWishlist(userId);
  }
}