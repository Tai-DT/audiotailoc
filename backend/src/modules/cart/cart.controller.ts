import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from '../auth/jwt.guard';

class AddToCartDto { productId!: string; quantity!: number; }
class UpdateCartItemDto { quantity!: number; }

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Guest Cart Endpoints
  @Post('guest')
  async createGuestCart() {
    return this.cartService.createGuestCart();
  }

  @Get('guest/:guestId')
  async getGuestCart(@Param('guestId') guestId: string) {
    return this.cartService.getGuestCart(guestId);
  }

  @Post('guest/:guestId/items')
  async addToGuestCart(
    @Param('guestId') guestId: string,
    @Body() addToCartDto: AddToCartDto
  ) {
    return this.cartService.addToGuestCart(
      guestId,
      addToCartDto.productId,
      addToCartDto.quantity
    );
  }

  @Put('guest/:guestId/items/:productId')
  async updateGuestCartItem(
    @Param('guestId') guestId: string,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    return this.cartService.updateGuestCartItem(
      guestId,
      productId,
      updateCartItemDto.quantity
    );
  }

  @Delete('guest/:guestId/items/:productId')
  async removeFromGuestCart(
    @Param('guestId') guestId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.removeFromGuestCart(guestId, productId);
  }

  @Delete('guest/:guestId/clear')
  async clearGuestCart(@Param('guestId') guestId: string) {
    return this.cartService.clearGuestCart(guestId);
  }

  @Post('guest/:guestId/convert/:userId')
  async convertGuestCartToUserCart(
    @Param('guestId') guestId: string,
    @Param('userId') userId: string
  ) {
    return this.cartService.convertGuestCartToUserCart(guestId, userId);
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

  // Legacy endpoints for backward compatibility
  @UseGuards(JwtGuard)
  @Get()
  async getCart(@Query('userId') userId: string) {
    return this.cartService.getUserCart(userId);
  }

  @UseGuards(JwtGuard)
  @Post('items')
  async addItem(
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
  @Put('items/:productId')
  async updateItem(
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
  @Delete('items/:productId')
  async removeItem(
    @Query('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.removeFromUserCart(userId, productId);
  }
}

