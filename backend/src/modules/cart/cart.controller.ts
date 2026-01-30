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
} from '@nestjs/common';
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
  async getCart(
    @Query('cartId') cartId?: string,
    @Query('userId') userId?: string,
    @Req() req?: any,
  ) {
    // If authenticated, always prefer the authenticated user's cart
    if (req?.user) {
      const authenticatedUserId = req.user.sub || req.user.id;
      return this.cartService.getUserCart(authenticatedUserId);
    }

    // Guest handling
    if (cartId) {
      return this.cartService.getGuestCart(cartId);
    }

    // Fallback/Legacy: userId query param (only if not authenticated)
    if (userId) {
      return this.cartService.getUserCart(userId);
    }

    return {
      items: [],
      total: 0,
      message: 'No identification provided',
    };
  }

  @Post('items')
  async addToCart(
    @Body() addToCartDto: AddToCartDto,
    @Query('cartId') cartId?: string,
    @Query('userId') userId?: string,
    @Req() req?: any,
  ) {
    // If authenticated, always use the authenticated user's cart
    if (req?.user) {
      const authenticatedUserId = req.user.sub || req.user.id;
      return this.cartService.addToUserCart(
        authenticatedUserId,
        addToCartDto.productId,
        addToCartDto.quantity,
      );
    }

    // Guest handling
    if (cartId) {
      return this.cartService.addToGuestCart(cartId, addToCartDto.productId, addToCartDto.quantity);
    }

    // Fallback/Legacy: userId query param
    if (userId) {
      return this.cartService.addToUserCart(userId, addToCartDto.productId, addToCartDto.quantity);
    }

    return {
      success: false,
      message: 'No identification provided',
    };
  }

  // Guest Cart Endpoints (cartId is public but only works for guest carts)
  @Post('guest')
  async createGuestCart() {
    return this.cartService.createGuestCart();
  }

  @Get('guest/:cartId')
  async getGuestCart(@Param('cartId') cartId: string) {
    return this.cartService.getGuestCart(cartId);
  }

  @Post('guest/:cartId/items')
  async addToGuestCart(@Param('cartId') cartId: string, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToGuestCart(cartId, addToCartDto.productId, addToCartDto.quantity);
  }

  @Put('guest/:cartId/items/:productId')
  async updateGuestCartItem(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateGuestCartItem(cartId, productId, updateCartItemDto.quantity);
  }

  @Delete('guest/:cartId/items/:productId')
  async removeFromGuestCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromGuestCart(cartId, productId);
  }

  @Delete('guest/:cartId/clear')
  async clearGuestCart(@Param('cartId') cartId: string) {
    return this.cartService.clearGuestCart(cartId);
  }

  @UseGuards(JwtGuard)
  @Post('guest/:cartId/convert')
  async convertGuestCartToUserCart(@Param('cartId') cartId: string, @Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.cartService.convertGuestCartToUserCart(cartId, userId);
  }

  // User Cart Endpoints (Protected)
  @UseGuards(JwtGuard)
  @Get('user')
  async getUserCart(@Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.cartService.getUserCart(userId);
  }

  @UseGuards(JwtGuard)
  @Post('user/items')
  async addToUserCart(@Body() addToCartDto: AddToCartDto, @Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.cartService.addToUserCart(userId, addToCartDto.productId, addToCartDto.quantity);
  }

  @UseGuards(JwtGuard)
  @Put('user/items/:productId')
  async updateUserCartItem(
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.cartService.updateUserCartItem(userId, productId, updateCartItemDto.quantity);
  }

  @UseGuards(JwtGuard)
  @Delete('user/items/:productId')
  async removeFromUserCart(@Param('productId') productId: string, @Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.cartService.removeFromUserCart(userId, productId);
  }

  @UseGuards(JwtGuard)
  @Delete('user/clear')
  async clearUserCart(@Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.cartService.clearUserCart(userId);
  }
}
