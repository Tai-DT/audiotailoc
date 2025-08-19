import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from '../auth/jwt.guard';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

class AddItemDto {
  @IsString()
  slug!: string;

  @IsInt() @Min(1)
  quantity!: number;
}

class UpdateItemDto {
  @IsInt() @Min(0)
  quantity!: number;
}

@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  async getCart(req: any) {
    return this.cart.getCartWithTotals(req.user?.sub);
  }

  @Post('items')
  async addItem(req: any, @Body() dto: AddItemDto) {
    await this.cart.addItem(req.user?.sub, dto.slug, dto.quantity);
    return this.cart.getCartWithTotals(req.user?.sub);
  }

  @Patch('items/:id')
  async updateItem(req: any, @Param('id') id: string, @Body() dto: UpdateItemDto) {
    await this.cart.updateItem(req.user?.sub, id, dto.quantity);
    return this.cart.getCartWithTotals(req.user?.sub);
  }

  @Delete('items/:id')
  async removeItem(req: any, @Param('id') id: string) {
    await this.cart.removeItem(req.user?.sub, id);
    return this.cart.getCartWithTotals(req.user?.sub);
  }
}

