import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from '../auth/jwt.guard';
import { IsString, IsNumber, Min } from 'class-validator';

class AddToCartDto { 
  @IsString()
  productId!: string; 
  
  @IsNumber()
  @Min(1)
  quantity!: number; 
}

class UpdateCartItemDto { 
  @IsNumber()
  @Min(1)
  quantity!: number; 
}

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Simple Cart Endpoint for Frontend
  @Get()
  async getCart(@Req() req: any, @Query('cartId') cartId?: string, @Query('userId') userId?: string) {
    // If authenticated user, get their cart
    const authenticatedUserId = req.user?.sub;
    if (authenticatedUserId) {
      return this.cartService.getUserCart(authenticatedUserId);
    }
    
    // Fallback to query parameters for backward compatibility
    if (cartId) {
      return this.cartService.getGuestCart(cartId);
    }
    if (userId) {
      return this.cartService.getUserCart(userId);
    }
    return {
      items: [],
      total: 0,
      message: 'No cart ID provided'
    };
  }

  @Post('items')
  @UseGuards(JwtGuard)
  async addToCart(
    @Req() req: any,
    @Body() addToCartDto: AddToCartDto,
    @Query('cartId') cartId?: string,
    @Query('userId') userId?: string
  ) {
    // If authenticated user, add to their cart
    const authenticatedUserId = req.user?.sub;
    if (authenticatedUserId) {
      return this.cartService.addToUserCart(
        authenticatedUserId,
        addToCartDto.productId,
        addToCartDto.quantity
      );
    }
    
    // Fallback to query parameters for backward compatibility
    if (cartId) {
      return this.cartService.addToGuestCart(
        cartId,
        addToCartDto.productId,
        addToCartDto.quantity
      );
    }
    if (userId) {
      return this.cartService.addToUserCart(
        userId,
        addToCartDto.productId,
        addToCartDto.quantity
      );
    }
    return {
      success: false,
      message: 'No cart ID provided'
    };
  }

  // Guest Cart Endpoints
  @Post('guest')
  async createGuestCart() {
    return this.cartService.createGuestCart();
  }

  @Get('guest/:cartId')
  async getGuestCart(@Param('cartId') cartId: string) {
    return this.cartService.getGuestCart(cartId);
  }

  @Post('guest/:cartId/items')
  async addToGuestCart(
    @Param('cartId') cartId: string,
    @Body() addToCartDto: AddToCartDto
  ) {
    return this.cartService.addToGuestCart(
      cartId,
      addToCartDto.productId,
      addToCartDto.quantity
    );
  }

  @Put('guest/:cartId/items/:productId')
  async updateGuestCartItem(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    return this.cartService.updateGuestCartItem(
      cartId,
      productId,
      updateCartItemDto.quantity
    );
  }

  @Delete('guest/:cartId/items/:productId')
  async removeFromGuestCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.removeFromGuestCart(cartId, productId);
  }

  @Delete('guest/:cartId/clear')
  async clearGuestCart(@Param('cartId') cartId: string) {
    return this.cartService.clearGuestCart(cartId);
  }

  @Post('guest/:cartId/convert/:userId')
  async convertGuestCartToUserCart(
    @Param('cartId') cartId: string,
    @Param('userId') userId: string
  ) {
    return this.cartService.convertGuestCartToUserCart(cartId, userId);
  }

  // User Cart Endpoints (Protected)
  @UseGuards(JwtGuard)
  @Get('user')
  async getUserCart(@Query('userId') userId: string) {
    return this.cartService.getUserCart(userId);
  }

  @UseGuards(JwtGuard)
  @Post('user/items')
  async addToUserCart(
    @Query('userId') userId: string,
    @Body() addToCartDto: AddToCartDto
  ) {
    return this.cartService.addToUserCart(
      userId,
      addToCartDto.productId,
      addToCartDto.quantity
    );
  }

  @UseGuards(JwtGuard)
  @Put('user/items/:productId')
  async updateUserCartItem(
    @Query('userId') userId: string,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    return this.cartService.updateUserCartItem(
      userId,
      productId,
      updateCartItemDto.quantity
    );
  }

  @UseGuards(JwtGuard)
  @Delete('user/items/:productId')
  async removeFromUserCart(
    @Query('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.removeFromUserCart(userId, productId);
  }

  @UseGuards(JwtGuard)
  @Delete('user/clear')
  async clearUserCart(@Query('userId') userId: string) {
    return this.cartService.clearUserCart(userId);
  }
}

